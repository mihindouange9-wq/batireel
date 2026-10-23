import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import "./plan.css";

/* ───────────── Pièces communes du « plan » ─────────────
   Le cartouche (bloc-titre des feuilles), la ligne de transition entre deux feuilles, la révélation
   d'une photographie derrière son dessin, et le texte monumental qui traverse l'écran. */

/** Le cartouche : numéro de feuille, titre, échelle. Il identifie la section comme une feuille du dossier. */
export function Cartouche({ num, total = 10, label, scale = "1:100" }: { num: number; total?: number; label: string; scale?: string }) {
  return (
    <p className="cartouche">
      <span className="cartouche__num tabular">
        {String(num).padStart(2, "0")}
        <span className="cartouche__total"> / {total}</span>
      </span>
      <b>{label}</b>
      <span className="tabular">Échelle {scale}</span>
    </p>
  );
}

/** La ligne de transition : un filet se trace, des repères se posent, comme on passe à la feuille suivante. */
export function PlanDivider({ label }: { label?: string }) {
  return (
    <div className="plan-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none" data-draw>
        <path data-stroke d="M0 24H1200" />
      </svg>
      <svg className="plan-divider__ticks" viewBox="0 0 1200 48" preserveAspectRatio="xMinYMid meet" data-draw>
        <path data-stroke d="M60 14V34M300 18V30M600 14V34M900 18V30M1140 14V34" />
      </svg>
      {label && <span className="plan-divider__label cote cote--plain">{label}</span>}
    </div>
  );
}

/** Une photographie qui apparaît derrière son dessin technique : le trait d'abord, la matière ensuite. */
export function ImageReveal({
  src,
  srcSet,
  sizes,
  width,
  height,
  alt,
  caption,
  ratio = "16 / 10",
  className,
  keepDrawing = true,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
  keepDrawing?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const img = el.querySelector(".image-reveal__photo");
    const drawing = el.querySelector(".image-reveal__drawing");
    gsap.set(img, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(drawing, { autoAlpha: 1 });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        gsap
          .timeline()
          .to(img, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power4.inOut" }, 0.2)
          .to(drawing, { autoAlpha: keepDrawing ? 0.18 : 0, duration: 1.2, ease: "power2.out" }, 0.9);
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <figure ref={root} className={`image-reveal ${className ?? ""}`} style={{ "--ratio": ratio } as CSSProperties}>
      <div className="image-reveal__frame">
        <img className="image-reveal__photo" src={src} srcSet={srcSet} sizes={sizes} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
        <svg className="image-reveal__drawing" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="0.35" fill="none" opacity="0.9">
            {Array.from({ length: 7 }, (_, i) => (
              <path key={`h${i}`} d={`M0 ${12.5 * (i + 1)}H160`} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <path key={`v${i}`} d={`M${16 * (i + 1)} 0V100`} />
            ))}
          </g>
          <g stroke="currentColor" strokeWidth="0.9" fill="none">
            <path d="M24 70H136M24 70V38H80V22H136V70" />
            <path d="M24 78V84M136 78V84M24 81H136" />
          </g>
        </svg>
      </div>
      {caption && <figcaption className="image-reveal__caption cote cote--plain">{caption}</figcaption>}
    </figure>
  );
}

/** Le texte monumental : il traverse l'écran au rythme du défilement, une seule fois dans la page. */
export function Marquee({ text, tone = "dark" }: { text: string; tone?: "dark" | "light" }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const track = el.querySelector(".marquee__track");
    const tween = gsap.fromTo(track, { xPercent: 4 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div ref={root} className={`marquee marquee--${tone}`} aria-hidden="true">
      <div className="marquee__track">
        {[0, 1, 2].map((i) => (
          <span key={i} className="marquee__item">
            {text}
            <i className="marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Une annotation de plan posée en marge d'un bloc : un trait de rappel et son texte. */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`plan-note ${className ?? ""}`}>{children}</p>;
}
