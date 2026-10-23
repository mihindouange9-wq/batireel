import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, prepareStrokes } from "../lib/motion";
import { MARK_PATH, MARK_WINDOW } from "../brand/Logo";
import "./intro.css";

const KEY = "batireel-intro";
export const INTRO_EVENT = "batireel:intro-done";

/** Vrai tant que l'introduction n'a pas été vue dans cette session (lu avant le premier rendu). */
export function introPending() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (window.location.search.includes("nointro")) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

/* Introduction cinématographique, brève et non bloquante : des lignes de construction se tracent, deux
   cotes s'affichent, le monogramme se trace et sa fenêtre s'allume, puis le calque s'efface et le hero se met en place. Un clic ou
   Échap la passe ; elle ne se rejoue pas dans la session. Durée totale : moins de trois secondes. */
export default function Intro() {
  const [state, setState] = useState<"playing" | "done">(() => (introPending() ? "playing" : "done"));
  const root = useRef<HTMLDivElement>(null);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* stockage indisponible */
    }
    const el = root.current;
    const done = () => {
      setState("done");
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new CustomEvent(INTRO_EVENT));
    };
    if (!el) return done();
    gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut", onComplete: done });
  };

  useEffect(() => {
    if (state !== "playing") return;
    document.documentElement.classList.add("intro-active");
    const el = root.current!;
    const q = (s: string) => Array.from(el.querySelectorAll<SVGElement>(s));
    const strokes = q("[data-stroke]");
    prepareStrokes(strokes);
    gsap.set(q("[data-pop], .intro__window"), { autoAlpha: 0 });
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(q(".intro__grid"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.04 }, 0)
      .to(q(".intro__wall"), { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.12 }, 0.35)
      .to(q(".intro__cote"), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut", stagger: 0.1 }, 0.9)
      .to(q("[data-pop]"), { autoAlpha: 1, duration: 0.35, stagger: 0.07 }, 1.15)
      .to(q(".intro__mark"), { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, 1.3)
      .to(q(".intro__window"), { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 1.8)
      .to({}, { duration: 0.35 });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state === "done") return null;

  return (
    <div ref={root} className="intro" role="presentation" onClick={finish}>
      <svg className="intro__svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* lignes de construction */}
        <g className="intro__lines" stroke="currentColor" strokeWidth="1" fill="none">
          <path className="intro__grid" data-stroke d="M0 140H1200" opacity="0.3" />
          <path className="intro__grid" data-stroke d="M0 560H1200" opacity="0.3" />
          <path className="intro__grid" data-stroke d="M260 0V700" opacity="0.3" />
          <path className="intro__grid" data-stroke d="M940 0V700" opacity="0.3" />
        </g>
        {/* le plan d'une pièce, puis ses cotes */}
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <path className="intro__wall" data-stroke d="M380 220H820" />
          <path className="intro__wall" data-stroke d="M820 220V480" />
          <path className="intro__wall" data-stroke d="M820 480H380" />
          <path className="intro__wall" data-stroke d="M380 480V220" />
          <path className="intro__wall" data-stroke d="M600 220V340" opacity="0.7" />
        </g>
        <g stroke="var(--cuivre-light)" strokeWidth="1.25" fill="none">
          <path className="intro__cote" data-stroke d="M380 520V540M820 520V540M380 530H820" />
          <path className="intro__cote" data-stroke d="M860 220H880M860 480H880M870 220V480" />
        </g>
        <g className="intro__texts" fill="var(--cuivre-light)" fontFamily="Manrope Variable, sans-serif" fontSize="14" fontWeight="600" letterSpacing="2">
          <text data-pop x="600" y="562" textAnchor="middle">
            12,40
          </text>
          <text data-pop x="896" y="356" transform="rotate(90 896 356)" textAnchor="middle">
            7,20
          </text>
          <text data-pop x="380" y="200" fontSize="11" fill="currentColor" opacity="0.6">
            A
          </text>
          <text data-pop x="812" y="200" fontSize="11" fill="currentColor" opacity="0.6">
            B
          </text>
        </g>
        {/* le monogramme se trace au centre, sa fenêtre s'allume */}
        <g className="intro__repere" fill="none" stroke="currentColor" strokeWidth="2" transform="translate(544 340) scale(1.2)">
          <path className="intro__mark" data-stroke d={MARK_PATH} />
          <rect className="intro__window" x={MARK_WINDOW.x} y={MARK_WINDOW.y} width={MARK_WINDOW.width} height={MARK_WINDOW.height} fill="var(--cuivre)" stroke="none" />
        </g>
      </svg>
      <p className="intro__skip cote cote--plain">Cliquer ou Échap pour passer</p>
    </div>
  );
}
