import type { CSSProperties } from "react";
import "./logo.css";

/* ───────────── Logo BATIRÉEL ─────────────
   Le monogramme est un B bâti : une lettre massive, deux bols en demi-cercle, deux contre-formes carrées
   comme les ouvertures d'une élévation. La fenêtre basse est en cuivre : l'étape validée, le point sans
   zone grise. Le mot, en Barlow Condensed, garde son É en cuivre. Même géométrie dans le favicon, l'image
   de partage, l'introduction et le pied de page (tools/build-brand.mjs, Intro.tsx, Footer.tsx). Dans le
   bloc-marque, le monogramme est posé sur une plaque carrée filetée : il se lit comme un symbole, pas comme
   une lettre de plus devant le mot. */

export const MARK_VIEWBOX = "14 10 65 80";
export const MARK_WIDTH = 65;
export const MARK_HEIGHT = 80;
/** Silhouette du B (fût de 20, barres de 14) et ses deux contre-formes, en règle pair-impair. */
export const MARK_PATH = "M14 10H55A19 19 0 0 1 55 48H58A21 21 0 0 1 58 90H14Z M34 24H52V41H34Z M34 55H56V76H34Z";
/** La fenêtre basse, remplie de cuivre. */
export const MARK_WINDOW = { x: 34, y: 55, width: 22, height: 21 } as const;

type MarkProps = {
  /** Hauteur du monogramme en pixels ; la largeur suit (65/80). */
  size?: number;
  className?: string;
  title?: string;
};

export function LogoMark({ size = 28, className, title }: MarkProps) {
  return (
    <svg
      className={className}
      width={+((size * MARK_WIDTH) / MARK_HEIGHT).toFixed(2)}
      height={size}
      viewBox={MARK_VIEWBOX}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
      <rect x={MARK_WINDOW.x} y={MARK_WINDOW.y} width={MARK_WINDOW.width} height={MARK_WINDOW.height} fill="var(--logo-dot, #b86f45)" />
    </svg>
  );
}

type LogoProps = {
  /** Hauteur du monogramme en pixels ; les capitales du mot ont la même hauteur. */
  size?: number;
  /** `dark` sur graphite (lettre blanc chantier), `light` sur craie (lettre graphite). */
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
      {withMark && (
        <span className="logo__badge" aria-hidden="true">
          <LogoMark size={+(size * 0.94).toFixed(2)} className="logo__mark" />
        </span>
      )}
      {withWord && (
        <span className="logo__word" aria-hidden="true">
          BATIR<span className="logo__accent">É</span>EL
        </span>
      )}
    </span>
  );
}
