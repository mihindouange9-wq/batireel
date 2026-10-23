import { createContext, useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ───────────── La scène du hero : une villa R+1 qui se construit et se déconstruit ─────────────
   Un modèle réaliste, procédural, à l'échelle (1 unité = 1 m) : dalle, poteaux, murs enduits, dalle haute
   en porte-à-faux sur la terrasse, étage, toiture-terrasse à acrotère, vitrages, brise-soleil en bois,
   escalier extérieur, et le poteau cuivre de la signature. Matériaux physiques (textures Poly Haven, CC0 :
   docs/credits-textures.md), soleil à ombres portées, environnement de réflexion, brouillard graphite.
   Le chantier se monte en huit phases (fondations → finitions), tient, se démonte dans l'ordre inverse, et
   recommence. Le pointeur incline légèrement la scène, le défilement rapproche la caméra. */

export type SceneDrive = {
  /** progression du défilement dans le hero, 0 → 1 */
  scroll: number;
  /** pointeur normalisé, -1 → 1 */
  px: number;
  py: number;
  /** la scène ne se rend que lorsqu'elle est visible */
  active: boolean;
};

/** Mode film : l'instant du cycle est imposé de l'extérieur (tools/video-render.mjs place la tête de lecture). */
export type FilmDrive = { time: number };

const GRAPHITE = "#191b19";
const CUIVRE = "#b86f45";

/* ---- chronologie du chantier (secondes) ---- */
const PHASES = 8;
const BUILD = 7.6;
const HOLD = 4.2;
const UNBUILD = 4.4;
const REST = 1.6;
const CYCLE = BUILD + HOLD + UNBUILD + REST;
const D_BUILD = 1.8;
const D_UNBUILD = 1.25;
const SLOT_BUILD = (BUILD - D_BUILD) / (PHASES - 1);
const SLOT_UNBUILD = (UNBUILD - D_UNBUILD) / (PHASES - 1);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInCubic = (p: number) => p * p * p;

type Mode = "grow" | "drop";

/** Part montée d'un élément (0 → 1) pour la phase et l'ordre donnés, à l'instant t du cycle. */
function amountAt(t: number, phase: number, order: number, mode: Mode) {
  if (t < 0) return 0;
  if (t < BUILD) {
    const start = (phase - 1) * SLOT_BUILD + order * 0.11;
    const p = clamp01((t - start) / (D_BUILD - 0.55));
    return mode === "drop" ? easeOutQuart(p) : easeOutCubic(p);
  }
  if (t < BUILD + HOLD) return 1;
  const u = t - BUILD - HOLD;
  if (u < UNBUILD) {
    const start = (PHASES - phase) * SLOT_UNBUILD + order * 0.07;
    const q = clamp01((u - start) / (D_UNBUILD - 0.35));
    return 1 - easeInCubic(q);
  }
  return 0;
}

const ClockCtx = createContext<MutableRefObject<number>>({ current: BUILD });

type PartProps = {
  phase: number;
  order?: number;
  mode?: Mode;
  /** origine du groupe : la base de l'élément (il pousse depuis sa base, ou descend sur elle) */
  position?: [number, number, number];
  children: ReactNode;
};

/** Un élément du chantier : il pousse depuis sa base (murs, poteaux) ou se pose depuis le haut (dalles). */
function Part({ phase, order = 0, mode = "grow", position = [0, 0, 0], children }: PartProps) {
  const g = useRef<THREE.Group>(null);
  const clock = useContext(ClockCtx);
  useFrame(() => {
    const o = g.current;
    if (!o) return;
    const a = amountAt(clock.current, phase, order, mode);
    o.visible = a > 0.002;
    if (mode === "grow") {
      o.scale.y = Math.max(0.002, a);
      o.position.y = position[1];
    } else {
      o.scale.y = 1;
      o.position.y = position[1] + (1 - a) * 2.6;
    }
  });
  return (
    <group ref={g} position={position}>
      {children}
    </group>
  );
}

type Mats = Record<"dalle" | "beton" | "enduit" | "bois" | "sol" | "verre" | "metal" | "cuivre" | "ombre", THREE.Material>;

/** Une boîte posée : `at` est son centre, `size` ses dimensions. */
function Box({ size, at, material, rotation }: { size: [number, number, number]; at: [number, number, number]; material: THREE.Material; rotation?: [number, number, number] }) {
  return (
    <mesh position={at} rotation={rotation} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

/** Un poteau rond, debout sur sa base. */
function Column({ r, h, at, material, segments = 24 }: { r: number; h: number; at: [number, number]; material: THREE.Material; segments?: number }) {
  return (
    <mesh position={[at[0], h / 2, at[1]]} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, segments]} />
    </mesh>
  );
}

/* ---- le bâtiment ---- */
const SOL_Y = 0.35; // dessus de la dalle basse
const RDC_H = 3.0;
const R1_Y = SOL_Y + RDC_H + 0.3; // dessus de la dalle haute : 3.65
const R1_H = 2.9;
const TOIT_Y = R1_Y + R1_H + 0.3; // dessus de la toiture : 6.85

function Villa({ m, lite }: { m: Mats; lite: boolean }) {
  const seg = lite ? 12 : 28;
  const slats = useMemo(() => Array.from({ length: 30 }, (_, i) => -2.45 + i * 0.169), []);
  const steps = useMemo(() => Array.from({ length: 13 }, (_, i) => i), []);
  return (
    <group>
      {/* 1 · fondations : remblai compacté puis la dalle basse */}
      <Part phase={1} order={0} mode="grow">
        <Box size={[13, 0.08, 10]} at={[0, 0.04, 0]} material={m.beton} />
      </Part>
      <Part phase={1} order={1} mode="drop">
        <Box size={[11, 0.35, 8]} at={[0, 0.175, 0]} material={m.dalle} />
      </Part>

      {/* 2 · poteaux du rez-de-chaussée : la file de façade et les trois poteaux de la terrasse, dont le cuivre */}
      <Part phase={2} order={0} position={[0, SOL_Y, 0]}>
        {[-5.07, -2.4, 0.4, 3.05].map((x) => (
          <Box key={x} size={[0.25, RDC_H, 0.25]} at={[x, RDC_H / 2, 2.5]} material={m.beton} />
        ))}
      </Part>
      <Part phase={2} order={1} position={[0, SOL_Y, 0]}>
        <Column r={0.15} h={RDC_H} at={[4.9, -3.0]} material={m.beton} segments={seg} />
        <Column r={0.15} h={RDC_H} at={[4.9, 0.4]} material={m.beton} segments={seg} />
      </Part>
      <Part phase={2} order={2} position={[0, SOL_Y, 0]}>
        <Column r={0.15} h={RDC_H} at={[4.9, 3.6]} material={m.cuivre} segments={seg} />
      </Part>

      {/* 3 · murs du rez-de-chaussée : fond, pignon gauche, pignon droit percé d'une fenêtre */}
      <Part phase={3} order={0} position={[0, SOL_Y, 0]}>
        <Box size={[8.4, RDC_H, 0.2]} at={[-1.0, RDC_H / 2, -3.7]} material={m.enduit} />
      </Part>
      <Part phase={3} order={1} position={[0, SOL_Y, 0]}>
        <Box size={[0.2, RDC_H, 6.4]} at={[-5.1, RDC_H / 2, -0.6]} material={m.enduit} />
      </Part>
      <Part phase={3} order={2} position={[0, SOL_Y, 0]}>
        <Box size={[0.2, RDC_H, 2.2]} at={[3.1, RDC_H / 2, -2.7]} material={m.enduit} />
        <Box size={[0.2, RDC_H, 2.2]} at={[3.1, RDC_H / 2, 1.5]} material={m.enduit} />
        <Box size={[0.2, 0.9, 2.0]} at={[3.1, 0.45, -0.6]} material={m.enduit} />
        <Box size={[0.2, 0.6, 2.0]} at={[3.1, 2.7, -0.6]} material={m.enduit} />
      </Part>

      {/* 4 · la dalle haute, en porte-à-faux sur la terrasse */}
      <Part phase={4} mode="drop">
        <Box size={[11.4, 0.3, 8.4]} at={[0.2, SOL_Y + RDC_H + 0.15, 0.2]} material={m.dalle} />
      </Part>

      {/* 5 · l'étage : murs enduits, bandeau vitré à droite, grande baie en façade */}
      <Part phase={5} order={0} position={[0, R1_Y, 0]}>
        <Box size={[10.8, R1_H, 0.2]} at={[0.2, R1_H / 2, -3.7]} material={m.enduit} />
      </Part>
      <Part phase={5} order={1} position={[0, R1_Y, 0]}>
        <Box size={[0.2, R1_H, 7.4]} at={[-5.1, R1_H / 2, -0.1]} material={m.enduit} />
      </Part>
      <Part phase={5} order={2} position={[0, R1_Y, 0]}>
        <Box size={[0.2, R1_H, 1.2]} at={[5.5, R1_H / 2, -3.2]} material={m.enduit} />
        <Box size={[0.2, R1_H, 1.0]} at={[5.5, R1_H / 2, 3.1]} material={m.enduit} />
        <Box size={[0.2, 0.95, 5.2]} at={[5.5, 0.475, 0]} material={m.enduit} />
        <Box size={[0.2, 0.95, 5.2]} at={[5.5, 2.425, 0]} material={m.enduit} />
      </Part>
      <Part phase={5} order={3} position={[0, R1_Y, 0]}>
        <Box size={[1.6, R1_H, 0.2]} at={[-4.4, R1_H / 2, 3.5]} material={m.enduit} />
        <Box size={[5.2, R1_H, 0.2]} at={[3.0, R1_H / 2, 3.5]} material={m.enduit} />
        <Box size={[4.0, 0.65, 0.2]} at={[-1.6, 0.325, 3.5]} material={m.enduit} />
        <Box size={[4.0, 0.55, 0.2]} at={[-1.6, 2.625, 3.5]} material={m.enduit} />
      </Part>

      {/* 6 · toiture-terrasse et acrotère */}
      <Part phase={6} order={0} mode="drop">
        <Box size={[11.8, 0.3, 8.8]} at={[0.3, R1_Y + R1_H + 0.15, 0.3]} material={m.dalle} />
      </Part>
      <Part phase={6} order={2} position={[0, TOIT_Y, 0]}>
        <Box size={[11.8, 0.45, 0.15]} at={[0.3, 0.225, 4.625]} material={m.beton} />
        <Box size={[11.8, 0.45, 0.15]} at={[0.3, 0.225, -4.025]} material={m.beton} />
        <Box size={[0.15, 0.45, 8.8]} at={[-5.525, 0.225, 0.3]} material={m.beton} />
        <Box size={[0.15, 0.45, 8.8]} at={[6.125, 0.225, 0.3]} material={m.beton} />
      </Part>

      {/* 7 · vitrages : mur-rideau du rez-de-chaussée, fenêtre du pignon, bandeau et baie de l'étage */}
      <Part phase={7} order={0} position={[0, SOL_Y, 0]}>
        <Box size={[2.42, RDC_H, 0.04]} at={[-3.74, RDC_H / 2, 2.5]} material={m.verre} />
        <Box size={[2.55, RDC_H, 0.04]} at={[-1.0, RDC_H / 2, 2.5]} material={m.verre} />
        <Box size={[2.4, RDC_H, 0.04]} at={[1.725, RDC_H / 2, 2.5]} material={m.verre} />
        <Box size={[8.2, 0.06, 0.08]} at={[-1.0, 2.55, 2.5]} material={m.metal} />
        <Box size={[0.04, 1.5, 2.0]} at={[3.1, 1.65, -0.6]} material={m.verre} />
      </Part>
      <Part phase={7} order={1} position={[0, R1_Y, 0]}>
        <Box size={[0.04, 1.0, 5.2]} at={[5.5, 1.45, 0]} material={m.verre} />
        <Box size={[4.0, 1.7, 0.04]} at={[-1.6, 1.5, 3.5]} material={m.verre} />
        <Box size={[4.0, 0.05, 0.06]} at={[-1.6, 1.5, 3.5]} material={m.metal} />
      </Part>

      {/* 8 · finitions : brise-soleil en bois, escalier extérieur et son garde-corps */}
      <Part phase={8} order={0} position={[0, R1_Y + 0.3, 0]}>
        {slats.map((z) => (
          <Box key={z} size={[0.05, 2.3, 0.05]} at={[5.72, 1.15, z]} material={m.bois} />
        ))}
        <Box size={[0.05, 0.05, 5.1]} at={[5.72, 0.02, 0]} material={m.metal} />
        <Box size={[0.05, 0.05, 5.1]} at={[5.72, 2.28, 0]} material={m.metal} />
      </Part>
      <Part phase={8} order={1}>
        {steps.map((i) => (
          <Box key={i} size={[1.2, 0.28 * (i + 1), 0.28]} at={[-6.3, (0.28 * (i + 1)) / 2, 3.4 - 0.14 - 0.28 * i]} material={m.beton} />
        ))}
      </Part>
      <Part phase={8} order={2}>
        {steps.filter((i) => i % 2 === 0).map((i) => (
          <Box key={i} size={[0.04, 1.0, 0.04]} at={[-6.88, 0.28 * (i + 1) + 0.5, 3.4 - 0.14 - 0.28 * i]} material={m.metal} />
        ))}
        <Box size={[0.04, 0.04, 4.9]} at={[-6.88, 3.07, 1.58]} rotation={[Math.PI / 4, 0, 0]} material={m.metal} />
      </Part>
    </group>
  );
}

/* ---- la caméra, le pointeur, l'horloge du chantier ---- */
function Driver({ drive, clock, film, onReady, children }: { drive: MutableRefObject<SceneDrive>; clock: MutableRefObject<number>; film?: MutableRefObject<FilmDrive>; onReady?: () => void; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const rot = useRef({ x: 0, y: 0 });
  const ready = useRef(false);
  const lastFilm = useRef(NaN);
  const { gl, scene, camera, advance } = useThree();

  // les programmes se compilent en parallèle (KHR_parallel_shader_compile) avant la première image,
  // puis on ne rend que lorsque le hero est visible : la boucle demande les images une à une
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        ready.current = true;
        onReady?.();
      });
    const loop = (now: number) => {
      if (ready.current && drive.current.active) {
        // en mode film, une seule image par instant demandé : le rendu logiciel est lent
        if (film) {
          if (film.current.time !== lastFilm.current) {
            lastFilm.current = film.current.time;
            advance(now);
          }
        } else {
          advance(now);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [drive, advance, gl, scene, camera, onReady, film]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.25);
    if (film) {
      clock.current = film.current.time;
    } else {
      clock.current += dt;
      if (clock.current >= CYCLE) clock.current -= CYCLE;
    }

    const d = drive.current;
    if (group.current) {
      rot.current.y += (d.px * 0.07 - rot.current.y) * Math.min(1, dt * 2.2);
      rot.current.x += (-d.py * 0.025 - rot.current.x) * Math.min(1, dt * 2.2);
      group.current.rotation.y = rot.current.y;
      group.current.rotation.x = rot.current.x;
    }
    // la caméra se rapproche et descend avec le défilement, le regard remonte vers l'étage
    const cam = state.camera;
    const s = d.scroll;
    const target = new THREE.Vector3(23 - s * 5.5, 9.8 - s * 3.6, 25 - s * 6.5);
    if (film) cam.position.copy(target);
    else cam.position.lerp(target, Math.min(1, dt * 2.4));
    cam.lookAt(-1.3 + s * 1.0, 3.0 + s * 0.8, 0.4);
  });

  return <group ref={group}>{children}</group>;
}

/** Environnement de réflexion : un ciel équirectangulaire de 128 × 64 dessiné sur canvas (ciel, horizon, sol, soleil),
    filtré par PMREM. Quelques millisecondes, là où la pièce procédurale de three.js en coûtait des centaines. */
function skyEquirect() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, 64);
  sky.addColorStop(0, "#c9d3df");
  sky.addColorStop(0.48, "#9aa0a6");
  sky.addColorStop(0.52, "#3b3935");
  sky.addColorStop(1, "#191816");
  g.fillStyle = sky;
  g.fillRect(0, 0, 128, 64);
  const sun = g.createRadialGradient(92, 16, 1, 92, 16, 16);
  sun.addColorStop(0, "rgba(255,238,205,1)");
  sun.addColorStop(1, "rgba(255,238,205,0)");
  g.fillStyle = sun;
  g.fillRect(0, 0, 128, 64);
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const sky = skyEquirect();
    const env = pmrem.fromEquirectangular(sky).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    return () => {
      scene.environment = null;
      env.dispose();
      sky.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* ---- textures et matériaux ---- */
const SETS = ["concrete_wall_005", "white_stucco_02", "fine_grained_wood", "sandy_gravel"] as const;
const URLS = SETS.flatMap((s) => [`/textures/${s}_diff.webp`, `/textures/${s}_nor.webp`, `/textures/${s}_rough.webp`]);

function prepared(tex: THREE.Texture, repeat: [number, number], srgb: boolean) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

function pbr(tex: THREE.Texture[], set: number, repeat: [number, number], extra: THREE.MeshStandardMaterialParameters = {}) {
  const i = set * 3;
  return new THREE.MeshStandardMaterial({
    map: prepared(tex[i], repeat, true),
    normalMap: prepared(tex[i + 1], repeat, false),
    roughnessMap: prepared(tex[i + 2], repeat, false),
    metalness: 0,
    roughness: 1,
    ...extra,
  });
}

function useMaterials(): Mats {
  // décodage des images hors du fil principal (createImageBitmap), déjà retournées : flipY reste à false
  const bitmaps = useLoader(THREE.ImageBitmapLoader, URLS, (loader) => loader.setOptions({ imageOrientation: "flipY", premultiplyAlpha: "none" }));
  return useMemo(() => {
    const tex = bitmaps.map((b) => {
      const t = new THREE.Texture(b);
      t.flipY = false;
      t.needsUpdate = true;
      return t;
    });
    const ombreTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d")!;
      const r = g.createRadialGradient(128, 128, 30, 128, 128, 128);
      r.addColorStop(0, "rgba(0,0,0,0.5)");
      r.addColorStop(0.6, "rgba(0,0,0,0.18)");
      r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    })();
    return {
      dalle: pbr(tex, 0, [3.2, 2.4], { color: "#dcd8cd", normalScale: new THREE.Vector2(0.7, 0.7) }),
      beton: pbr(tex, 0, [1.2, 1.6], { color: "#d3cfc3", normalScale: new THREE.Vector2(0.7, 0.7) }),
      enduit: pbr(tex, 1, [2.6, 1.3], { color: "#f1ebdc", normalScale: new THREE.Vector2(0.5, 0.5) }),
      bois: pbr(tex, 2, [0.4, 2.6], { color: "#b98a58", roughness: 0.9 }),
      sol: pbr(tex, 3, [30, 30], { color: "#6f6a5f", normalScale: new THREE.Vector2(0.7, 0.7) }),
      verre: new THREE.MeshPhysicalMaterial({ color: "#1d272c", metalness: 0.15, roughness: 0.06, envMapIntensity: 1.5, transparent: true, opacity: 0.86, side: THREE.DoubleSide }),
      metal: new THREE.MeshStandardMaterial({ color: "#2a2d2b", metalness: 0.7, roughness: 0.38 }),
      cuivre: new THREE.MeshStandardMaterial({ color: CUIVRE, metalness: 0.88, roughness: 0.3, envMapIntensity: 1.2 }),
      ombre: new THREE.MeshBasicMaterial({ map: ombreTex, transparent: true, depthWrite: false }),
    };
  }, [bitmaps]);
}

export default function HeroScene({ drive, lite, film, onReady }: { drive: MutableRefObject<SceneDrive>; lite: boolean; film?: MutableRefObject<FilmDrive>; onReady?: () => void }) {
  const m = useMaterials();
  // le chantier commence une fois l'introduction passée, puis boucle
  const clock = useRef(typeof document !== "undefined" && document.documentElement.classList.contains("intro-active") ? -2.6 : -0.4);
  const shadow = lite ? 1024 : 2048;
  return (
    <Canvas
      shadows="soft"
      dpr={lite ? 1 : [1, 1.75]}
      camera={{ fov: 26, near: 1, far: 90, position: [23, 9.8, 25] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      frameloop="never"
      style={{ width: "100%", height: "100%" }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(GRAPHITE, 26, 58);
      }}
    >
      <Environment />
      <hemisphereLight args={["#dfe6ee", "#2b2724", 0.75]} />
      <directionalLight
        position={[12, 16, 10]}
        intensity={2.7}
        color="#ffe3c4"
        castShadow
        shadow-mapSize={[shadow, shadow]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-bias={-0.00025}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[-10, 6, -8]} intensity={0.45} color="#9db0c4" />
      <ClockCtx.Provider value={clock}>
        <Driver drive={drive} clock={clock} film={film} onReady={onReady}>
          {/* le terrain */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={m.sol} receiveShadow>
            <planeGeometry args={[90, 90]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.006, 0.3]} material={m.ombre}>
            <planeGeometry args={[20, 15]} />
          </mesh>
          <Villa m={m} lite={lite} />
        </Driver>
      </ClockCtx.Provider>
    </Canvas>
  );
}
