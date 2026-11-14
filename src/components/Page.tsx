import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { NAV_CTA, PAGES } from "../content/site";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import type { Route } from "../lib/router";
import "./page.css";

type Inner = Exclude<Route, "/">;

/* En-tête d'une page intérieure : le repère de feuille, un titre monumental qui monte derrière son
   masque, la phrase d'entrée, et un fragment de plan qui se trace à droite. Au défilement, le titre
   s'éloigne lentement et le plan glisse en sens inverse. */
export function PageHead({ route }: { route: Inner }) {
  const page = PAGES[route];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const scope = root.current!;
      const st = { trigger: scope, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(scope.querySelector(".page-head__title"), { yPercent: -14, ease: "none", scrollTrigger: st });
      gsap.to(scope.querySelector(".page-head__plan"), { yPercent: 16, rotate: -2, ease: "none", scrollTrigger: st });
      gsap.to(scope.querySelector(".page-head__num"), { xPercent: -8, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section className="page-head sheet" data-tone="dark" ref={root} aria-labelledby="page-title">
      <span className="page-head__num tabular" aria-hidden="true">
        {page.feuille}
      </span>
      <svg className="page-head__plan" viewBox="0 0 520 420" aria-hidden="true" data-draw>
        <path data-stroke d="M20 380H500" />
        <path data-stroke d="M60 380V120H300V380" />
        <path data-stroke d="M300 200H460V380" />
        <path data-stroke d="M60 250H300" />
        <path data-stroke d="M110 120V60H250V120" />
        <path data-stroke d="M100 380V300H160V380M200 290H260V340H200Z" />
        <path data-stroke d="M340 250H420V320H340Z" />
        <path data-stroke d="M60 400H460M60 392V408M300 392V408M460 392V408" className="page-head__cote" />
        <path data-stroke d="M480 200V380M472 200H488M472 380H488" className="page-head__cote" />
        <circle data-pop cx="60" cy="120" r="5" />
        <circle data-pop cx="300" cy="200" r="5" />
        <circle data-pop cx="460" cy="380" r="5" />
      </svg>
      <div className="container page-head__in">
        <p className="cote page-head__kicker" data-reveal>
          <a href="/" className="page-head__back">
            Accueil
          </a>
          <span aria-hidden="true"> / </span>
          Feuille {page.feuille} · {page.nom}
        </p>
        <h1 id="page-title" className="page-head__title">
          {page.titre.map((line) => (
            <span key={line} className="page-head__line" data-title>
              {line}
            </span>
          ))}
        </h1>
        <p className="lead page-head__lead" data-reveal data-reveal-delay="0.25">
          {page.texte}
        </p>
      </div>
      <span className="page-head__rule" data-rule aria-hidden="true" />
    </section>
  );
}

/* Bas d'une page intérieure : la feuille suivante en très grand (toute la bande est le lien), et l'entrée
   vers le formulaire. Au survol, une dalle cuivre monte derrière le titre. */
export function PageNext({ route }: { route: Inner }) {
  const next = PAGES[route].suivante as Route;
  const page = PAGES[next];
  return (
    <section className="page-next" data-tone="dark" aria-label="Poursuivre la visite">
      <a className="page-next__link" href={next}>
        <span className="container page-next__in">
          <span className="cote" data-reveal>
            Feuille suivante{"feuille" in page ? ` · ${page.feuille}` : ""}
          </span>
          <span className="page-next__title" data-title>
            {page.nom}
          </span>
          <ArrowUpRight className="page-next__arrow" size={56} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </a>
      {next !== "/projet" && (
        <div className="container page-next__foot" data-reveal>
          <p>Un projet en tête ? Quelques lignes suffisent pour nous le décrire.</p>
          <a className="btn btn--primary" href={NAV_CTA.href}>
            <span className="btn__label">{NAV_CTA.label}</span>
            <span className="btn__arrow" aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
