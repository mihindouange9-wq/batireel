import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ───────────── La scène du hero ─────────────
   Un volume architectural contemporain, procédural : une dalle, un corps bas, un corps haut en porte-à-faux
   sur trois poteaux, une casquette, un escalier et un montant cuivre. Béton clair mat, lumière directionnelle
   chaude, brouillard graphite pour la profondeur. Le pointeur incline légèrement la composition, le
   défilement rapproche la caméra et fait apparaître les lignes structurelles. Rien ne tourne vite. */

export type SceneDrive = {
  /** progression du défilement dans le hero, 0 → 1 */
  scroll: number;
  /** pointeur normalisé, -1 → 1 */
  px: number;
  py: number;
  /** la scène ne se rend que lorsqu'elle est visible */
  active: boolean;
};

const BETON = "#cfcabd";
const BETON_SOMBRE = "#b9b4a6";
const GRAPHITE = "#191b19";
const CUIVRE = "#b86f45";
const CRAIE = "#f0ede4";

/** Les arêtes d'un volume, en lignes fines : les lignes structurelles du plan. */
function Outline({ args }: { args: [number, number, number] }) {
  const geom = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...args), 15), [args]);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={CRAIE} transparent opacity={0.15} />
    </lineSegments>
  );
}

function Volumes({ drive, lite }: { drive: MutableRefObject<SceneDrive>; lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const lines = useRef<THREE.Group>(null);
  const rot = useRef({ x: 0, y: 0 });

  const beton = useMemo(() => new THREE.MeshStandardMaterial({ color: BETON, roughness: 0.94, metalness: 0 }), []);
  const betonSombre = useMemo(() => new THREE.MeshStandardMaterial({ color: BETON_SOMBRE, roughness: 0.96, metalness: 0 }), []);
  const cuivre = useMemo(() => new THREE.MeshStandardMaterial({ color: CUIVRE, roughness: 0.5, metalness: 0.35 }), []);
  const sol = useMemo(() => new THREE.MeshStandardMaterial({ color: "#20231f", roughness: 1, metalness: 0 }), []);
  // une ombre portée douce, peinte sur une texture : moins coûteuse qu'une carte d'ombres
  const ombre = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(128, 128, 20, 128, 128, 128);
    r.addColorStop(0, "rgba(0,0,0,0.55)");
    r.addColorStop(0.55, "rgba(0,0,0,0.22)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    return new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false });
  }, []);

  useFrame((state, delta) => {
    const d = drive.current;
    if (!group.current) return;
    // rotation lente, inclinée par le pointeur, poussée par le défilement
    const targetY = 0.35 + d.px * 0.22 + d.scroll * 0.9;
    const targetX = -d.py * 0.06;
    rot.current.y += (targetY - rot.current.y) * Math.min(1, delta * 2.2);
    rot.current.x += (targetX - rot.current.x) * Math.min(1, delta * 2.2);
    group.current.rotation.y = rot.current.y + state.clock.elapsedTime * 0.04;
    group.current.rotation.x = rot.current.x;
    // la caméra se rapproche et descend avec le défilement
    const cam = state.camera;
    const sx = 7.6 - d.scroll * 2.6;
    const sy = 4.4 - d.scroll * 1.9;
    const sz = 8.2 - d.scroll * 3.2;
    cam.position.x += (sx - cam.position.x) * Math.min(1, delta * 2.4);
    cam.position.y += (sy - cam.position.y) * Math.min(1, delta * 2.4);
    cam.position.z += (sz - cam.position.z) * Math.min(1, delta * 2.4);
    cam.lookAt(0.4, 1.5 + d.scroll * 0.4, 0);
    // les lignes structurelles apparaissent avec le défilement
    if (lines.current) {
      lines.current.traverse((o) => {
        const m = (o as THREE.LineSegments).material as THREE.LineBasicMaterial | undefined;
        if (m && "opacity" in m) m.opacity = 0.15 + d.scroll * 0.85;
      });
    }
  });

  return (
    <group ref={group} position={[0.3, -0.2, 0]}>
      {/* le terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={sol}>
        <planeGeometry args={[40, 40]} />
      </mesh>
      {/* la dalle */}
      <mesh position={[0, 0.16, 0]} material={beton}>
        <boxGeometry args={[6.4, 0.32, 4.4]} />
      </mesh>
      <group ref={lines}>
        {/* corps bas */}
        <mesh position={[-0.7, 1.12, 0.15]} material={beton}>
          <boxGeometry args={[3.2, 1.6, 2.5]} />
          <Outline args={[3.2, 1.6, 2.5]} />
        </mesh>
        {/* corps haut en porte-à-faux */}
        <mesh position={[0.55, 2.74, -0.25]} material={beton}>
          <boxGeometry args={[4.4, 1.5, 2.2]} />
          <Outline args={[4.4, 1.5, 2.2]} />
        </mesh>
        {/* casquette */}
        <mesh position={[0.45, 3.59, -0.15]} material={betonSombre}>
          <boxGeometry args={[5.2, 0.18, 2.9]} />
          <Outline args={[5.2, 0.18, 2.9]} />
        </mesh>
        {/* escalier */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-2.9 + i * 0.3, 0.42 + i * 0.26, 1.7]} material={betonSombre}>
            <boxGeometry args={[0.3, 0.2 + i * 0.52, 1.0]} />
          </mesh>
        ))}
        {/* poteaux sous le porte-à-faux */}
        {[1.3, 2.1, 2.9].map((x) => (
          <mesh key={x} position={[x, 1.15, 0.65]} material={betonSombre}>
            <cylinderGeometry args={[0.07, 0.07, 1.66, lite ? 8 : 16]} />
          </mesh>
        ))}
        {/* le montant cuivre : la signature */}
        <mesh position={[2.72, 1.9, -1.3]} material={cuivre}>
          <boxGeometry args={[0.09, 3.1, 0.09]} />
        </mesh>
        <mesh position={[0.5, 0.33, 2.2]} material={cuivre}>
          <boxGeometry args={[5.2, 0.03, 0.03]} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.004, 0.2]} material={ombre}>
        <planeGeometry args={[13, 10]} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ drive, lite }: { drive: MutableRefObject<SceneDrive>; lite: boolean }) {
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ fov: 30, near: 0.5, far: 60, position: [7.6, 4.4, 8.2] }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
      style={{ width: "100%", height: "100%" }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(GRAPHITE, 9, 24);
      }}
    >
      <ambientLight intensity={0.55} color={CRAIE} />
      <directionalLight position={[6, 9, 4]} intensity={1.9} color="#ffe9d2" />
      <directionalLight position={[-6, 3, -4]} intensity={0.45} color="#9fb3a3" />
      <Volumes drive={drive} lite={lite} />
    </Canvas>
  );
}
