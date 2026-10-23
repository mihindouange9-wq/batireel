import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import HeroDrawing from "../components/HeroDrawing";
import type { SceneDrive } from "../components/HeroScene";
import { INTRO_EVENT } from "../components/Intro";
import { HERO } from "../content/site";
import { gsap, ScrollTrigger, isTouch, playDrawing, prefersReducedMotion, prepareDrawing, splitWords, useGSAP, prepareStrokes } from "../lib/motion";
import "./hero.css";

const HeroScene = lazy(() => import("../components/HeroScene"));

/** WebGL disponible, pas de mouvement réduit, pas de `?no3d` : la scène 3D remplace le dessin (hors écrans tactiles). */
function canRender3D() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion() || window.location.search.includes("no3d")) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* Premier écran : le titre en bas à gauche, asymétrique, le volume architectural à droite, les cotes
   autour. Après l'introduction, les lignes de titre montent derrière leur masque, les cotes se tracent,
   la scène apparaît. Le défilement rapproche la caméra et fait monter le titre, sans parallaxe gratuite. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const drive = useRef<SceneDrive>({ scroll: 0, px: 0, py: 0, active: true });
  const [mode, setMode] = useState<"drawing" | "3d">("drawing");
  const lite = isTouch() || (typeof window !== "undefined" && window.innerWidth < 760);

  useEffect(() => {
    // sur écran tactile ou étroit, le dessin suffit : ni WebGL ni module 3D à charger (poids, batterie)
    if (lite || !canRender3D()) return;
    // la scène se charge une fois le premier rendu passé et le navigateur libre, pour ne pas retarder le texte
    let idle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const timer = window.setTimeout(() => {
      idle = ric(() => setMode("3d"), { timeout: 1800 });
    }, 300);
    return () => {
      window.clearTimeout(timer);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, [lite]);

  useGSAP(
    () => {
      const scope = root.current!;
      const lines = scope.querySelectorAll<HTMLElement>(".hero__line");
      const rest = scope.querySelectorAll<HTMLElement>(".hero__sub, .hero__actions, .hero__cotes, .hero__scroll");
      const stage = scope.querySelector<HTMLElement>(".hero__stage");
      const drawing = scope.querySelector<SVGSVGElement>(".hero__drawing");
      const cotes = scope.querySelectorAll<SVGElement>(".hero__dims [data-stroke]");

      if (prefersReducedMotion()) return;

      const words = Array.from(lines).flatMap((l) => splitWords(l));
      gsap.set(words, { yPercent: 112 });
      gsap.set(rest, { autoAlpha: 0, y: 24 });
      gsap.set(stage, { autoAlpha: 0 });
      prepareStrokes(Array.from(cotes));
      if (drawing) prepareDrawing(drawing);

      const tl = gsap.timeline({ paused: document.documentElement.classList.contains("intro-active"), defaults: { ease: "power4.out" } });
      tl.to(stage, { autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0)
        .to(words, { yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.1)
        .to(rest, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.7)
        .to(cotes, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.15 }, 0.9);
      if (drawing) tl.add(playDrawing(drawing, { speed: 0.7 }), 0.2);
      const onIntroDone = () => tl.play();
      window.addEventListener(INTRO_EVENT, onIntroDone);

      // le défilement pilote la scène et fait monter le titre, lentement
      const st = ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          drive.current.scroll = self.progress;
        },
        onToggle: (self) => {
          drive.current.active = self.isActive;
        },
      });
      gsap.to(scope.querySelector(".hero__copy"), { yPercent: -10, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.6 } });

      // le pointeur incline la composition, sans jamais bloquer les interactions natives
      const onMove = (e: PointerEvent) => {
        drive.current.px = (e.clientX / window.innerWidth) * 2 - 1;
        drive.current.py = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        window.removeEventListener(INTRO_EVENT, onIntroDone);
        window.removeEventListener("pointermove", onMove);
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__stage" aria-hidden="true">
        {mode === "3d" ? (
          <Suspense fallback={<HeroDrawing className="hero__drawing hero__drawing--fallback" />}>
            <HeroScene drive={drive} lite={lite} />
          </Suspense>
        ) : (
          <HeroDrawing className="hero__drawing" />
        )}
        {/* cotes posées sur la scène */}
        <svg className="hero__dims" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path data-stroke d="M8 92H92" />
          <path data-stroke d="M8 88V96M92 88V96" />
          <path data-stroke d="M95 12V80" />
          <path data-stroke d="M92 12H98M92 80H98" />
        </svg>
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {HERO.title.map((line) => (
              <span key={line} className="hero__line">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__sub lead">{HERO.subtitle}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={HERO.primary.href}>
              <span className="btn__label">{HERO.primary.label}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href={HERO.secondary.href}>
              <span className="btn__label">{HERO.secondary.label}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
        <ul className="hero__cotes" aria-label="Repères du plan">
          {HERO.cotes.map((c) => (
            <li key={c} className="cote">
              {c}
            </li>
          ))}
        </ul>
        <a className="hero__scroll" href="#constat">
          <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
          {HERO.scroll}
        </a>
      </div>
    </section>
  );
}
