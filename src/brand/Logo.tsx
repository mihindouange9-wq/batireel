import type { CSSProperties } from "react";
import "./logo.css";

/* ───────────── Logo BATIRÉEL ─────────────
   Le symbole est un repère de chantier : la croix de visée cerclée que l'on trace sur un plan et que l'on
   retrouve, en peinture, sur le terrain. Quatre traits, un cercle, un point cuivre au centre : le point
   exact, sans zone grise. Le mot, en Barlow Condensed, garde son accent sur le É. */

export const MARK_VIEWBOX = "0 0 100 100";
export const MARK = {
  circle: { cx: 50, cy: 50, r: 30 },
  ticks: [
    "M50 6V26",
    "M50 74V94",
    "M6 50H26",
    "M74 50H94",
  ],
  dot: 7,
} as const;

type MarkProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function LogoMark({ size = 28, className, title }: MarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <circle cx={MARK.circle.cx} cy={MARK.circle.cy} r={MARK.circle.r} stroke="currentColor" strokeWidth="7" />
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="square">
        {MARK.ticks.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle cx={MARK.circle.cx} cy={MARK.circle.cy} r={MARK.dot} fill="var(--logo-dot, #b86f45)" />
    </svg>
  );
}

type LogoProps = {
  /** Hauteur du symbole en pixels ; le mot suit. */
  size?: number;
  /** `dark` sur graphite (tracé blanc chantier), `light` sur craie (tracé graphite). */
  tone?: "dark" | "light";
  withWord?: boolean;
  withMark?: boolean;
  className?: string;
  title?: string;
};

export function Logo({ size = 28, tone = "dark", withWord = true, withMark = true, className, title = "BATIRÉEL" }: LogoProps) {
  const style = { "--logo-size": `${size}px` } as CSSProperties;
  return (
    <span className={`logo logo--${tone} ${className ?? ""}`} style={style} role="img" aria-label={title}>
      {withMark && <LogoMark size={size} className="logo__mark" />}
      {withWord && (
        <span className="logo__word" aria-hidden="true">
          BATIR<span className="logo__accent">É</span>EL
        </span>
      )}
    </span>
  );
}
