import type { CSSProperties } from "react";
import "./logo.css";

/* ───────────── Logo BATIRÉEL ─────────────
   Le monogramme est un B sculpté, en une seule couleur : une lettre massive au fût droit et aux bols en
   coussin (flanc droit plat, angles arrondis), comme un élément de béton coffré. Deux détails, visibles en
   grand, effacés en petit : une entaille fine entre le fût et la barre médiane (la dalle passe à côté du
   poteau) et deux chanfreins aux angles du fût (l'arête du béton). Le mot, en Barlow Condensed, porte la
   seule couleur du bloc-marque : le É en cuivre. Même géométrie dans le favicon, l'image de partage,
   l'introduction et la plaque du pied de page (tools/build-brand.mjs, Intro.tsx, Footer.tsx). */

export const MARK_VIEWBOX = "14 10 72 80";
export const MARK_WIDTH = 72;
export const MARK_HEIGHT = 80;
/** Silhouette du B (fût de 20, barres de 14, bols à rayons 14 et 16), contre-formes, entaille de 3 ; règle pair-impair. */
export const MARK_PATH =
  "M19 10H66A14 14 0 0 1 80 24V34A14 14 0 0 1 66 48H70A16 16 0 0 1 86 64V74A16 16 0 0 1 70 90H19L14 85V15Z " +
  "M34 24H60A6 6 0 0 1 66 30V35A6 6 0 0 1 60 41H34Z M34 55H64A8 8 0 0 1 72 63V68A8 8 0 0 1 64 76H34Z M34 41H37V55H34Z";

type MarkProps = {
  /** Hauteur du monogramme en pixels ; la largeur suit (72/80). */
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
      {withMark && <LogoMark size={size} className="logo__mark" />}
      {withWord && (
        <span className="logo__word" aria-hidden="true">
          BATIR<span className="logo__accent">É</span>EL
        </span>
      )}
    </span>
  );
}
