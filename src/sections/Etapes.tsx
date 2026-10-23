import { useRef, useState } from "react";
import { Cartouche } from "../components/Plan";
import { ETAPES } from "../content/site";
import { gsap, prefersReducedMotion, useGSAP, prepareStrokes } from "../lib/motion";
import "./etapes.css";

/* Chaque étape sous contrôle : la section est épinglée, le défilement monte le bâtiment en coupe,
   phase par phase ; la liste de gauche suit, les points de contrôle s'allument. En mouvement réduit,
   le bâtiment est montré terminé, sans épinglage. */
export default function Etapes() {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(prefersReducedMotion() ? ETAPES.phases.length - 1 : 0);
  const n = ETAPES.phases.length;

  useGSAP(
    () => {
      const scope = root.current!;
      const groups = ETAPES.phases.map((p) => scope.querySelector<SVGGElement>(`[data-phase="${p.id}"]`)!);
      const strokes = (g: SVGGElement) => Array.from(g.querySelectorAll<SVGGeometryElement>("[data-stroke]"));
      const fills = (g: SVGGElement) => Array.from(g.querySelectorAll<SVGElement>("[data-fill]"));
      if (prefersReducedMotion()) return;

      gsap.set(groups.slice(1), { autoAlpha: 0 });
      prepareStrokes(groups.flatMap(strokes));
      groups.forEach((g) => gsap.set(fills(g), { autoAlpha: 0, transformOrigin: "center bottom", scaleY: 0.96 }));
      gsap.set(scope.querySelector(".etapes__cote-fill"), { scaleY: 0, transformOrigin: "center bottom" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: () => `+=${n * 70}%`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate: (self) => setPhase(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
        },
      });
      groups.forEach((g, i) => {
        const at = i;
        if (i > 0) tl.set(g, { autoAlpha: 1 }, at);
        tl.to(strokes(g), { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.04 }, at);
        tl.to(fills(g), { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: "power3.out", stagger: 0.03 }, at + 0.25);
      });
      tl.to(scope.querySelector(".etapes__cote-fill"), { scaleY: 1, duration: n, ease: "none" }, 0);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section className="etapes" id="etapes" data-tone="dark" ref={root} aria-labelledby="etapes-title">
      <div className="container etapes__grid">
        <div className="etapes__copy">
          <h2 id="etapes-title" data-title>
            {ETAPES.title}
          </h2>
          <p className="lead etapes__lead" data-reveal>
            {ETAPES.lead}
          </p>
          <ol className="etapes__list" aria-label="Phases du chantier">
            {ETAPES.phases.map((p, i) => (
              <li key={p.id} className={`etapes__item ${i === phase ? "is-active" : ""} ${i < phase ? "is-done" : ""}`} aria-current={i === phase ? "step" : undefined}>
                <span className="etapes__item-num tabular">0{i + 1}</span>
                <span className="etapes__item-label">{p.label}</span>
                <span className="etapes__item-text">{p.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="etapes__stage" aria-hidden="true">
          <svg viewBox="0 0 640 520" className="etapes__svg">
            {/* le terrain et la cote de hauteur */}
            <g stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M20 430H620" />
            </g>
            <g className="etapes__cote" stroke="var(--cuivre-light)" strokeWidth="1.2" fill="none">
              <path d="M600 430V110M592 430H608M592 110H608" />
              <path className="etapes__cote-fill" d="M600 430V110" strokeWidth="4" />
            </g>
            {/* 01 préparation : bornage et implantation */}
            <g data-phase="preparation" stroke="currentColor" strokeWidth="1.4" fill="none">
              <path data-stroke d="M90 430V414M550 430V414M90 422H550" strokeDasharray="6 6" />
              <circle data-stroke cx="90" cy="406" r="6" />
              <circle data-stroke cx="550" cy="406" r="6" />
              <path data-stroke d="M40 420L60 380L80 420Z" />
            </g>
            {/* 02 terrassement : la fouille */}
            <g data-phase="terrassement" stroke="currentColor" strokeWidth="1.6" fill="none">
              <path data-stroke d="M110 430V470H530V430" />
              <path data-stroke d="M120 470L130 458M160 470L170 458M200 470L210 458M240 470L250 458M280 470L290 458M320 470L330 458M360 470L370 458M400 470L410 458M440 470L450 458M480 470L490 458M520 470L530 458" strokeWidth="0.8" opacity="0.6" />
            </g>
            {/* 03 fondations : semelles et longrines */}
            <g data-phase="fondations" stroke="currentColor" strokeWidth="1.6" fill="none">
              <path data-stroke d="M130 470V446H170V470M470 470V446H510V470M300 470V446H340V470" />
              <rect data-fill x="130" y="446" width="40" height="24" fill="var(--craie)" opacity="0.9" stroke="none" />
              <rect data-fill x="300" y="446" width="40" height="24" fill="var(--craie)" opacity="0.9" stroke="none" />
              <rect data-fill x="470" y="446" width="40" height="24" fill="var(--craie)" opacity="0.9" stroke="none" />
              <path data-stroke d="M120 446H520" strokeWidth="2.2" />
              <path data-stroke d="M120 430H520" strokeWidth="2.2" />
            </g>
            {/* 04 structure : poteaux, poutres, planchers, escalier */}
            <g data-phase="structure" stroke="currentColor" strokeWidth="2" fill="none">
              <path data-stroke d="M150 430V300M320 430V300M490 430V300" />
              <path data-stroke d="M120 300H520" strokeWidth="3" />
              <path data-stroke d="M150 300V180M320 300V180M490 300V180" />
              <path data-stroke d="M120 180H520" strokeWidth="3" />
              <path data-stroke d="M420 430V404H440V380H460V356H480V330H500V304" strokeWidth="1.4" />
              <rect data-fill x="120" y="296" width="400" height="8" fill="var(--craie)" stroke="none" />
              <rect data-fill x="120" y="176" width="400" height="8" fill="var(--craie)" stroke="none" />
            </g>
            {/* 05 enveloppe : murs, toiture, casquette */}
            <g data-phase="enveloppe" stroke="currentColor" strokeWidth="1.6" fill="none">
              <rect data-fill x="124" y="304" width="392" height="122" fill="var(--graphite-3)" stroke="none" />
              <rect data-fill x="124" y="184" width="392" height="112" fill="var(--graphite-3)" stroke="none" />
              <path data-stroke d="M124 304H516M124 184H516" />
              <path data-stroke d="M100 176H540" strokeWidth="3" />
              <path data-stroke d="M100 176V160H540V176" />
              <path data-stroke d="M520 160L560 110" stroke="var(--cuivre-light)" strokeWidth="2.2" />
            </g>
            {/* 06 finitions : ouvertures et réseaux */}
            <g data-phase="finitions" stroke="currentColor" strokeWidth="1.4" fill="none">
              <rect data-stroke x="180" y="330" width="60" height="70" />
              <rect data-stroke x="360" y="330" width="60" height="70" />
              <rect data-stroke x="180" y="210" width="60" height="60" />
              <rect data-stroke x="270" y="210" width="60" height="60" />
              <rect data-stroke x="360" y="210" width="60" height="60" />
              <rect data-stroke x="260" y="346" width="48" height="84" />
              <rect data-fill x="182" y="332" width="56" height="66" fill="var(--craie)" opacity="0.35" stroke="none" />
              <rect data-fill x="362" y="332" width="56" height="66" fill="var(--craie)" opacity="0.35" stroke="none" />
              <rect data-fill x="182" y="212" width="56" height="56" fill="var(--craie)" opacity="0.35" stroke="none" />
              <rect data-fill x="272" y="212" width="56" height="56" fill="var(--craie)" opacity="0.35" stroke="none" />
              <rect data-fill x="362" y="212" width="56" height="56" fill="var(--craie)" opacity="0.35" stroke="none" />
              <path data-stroke d="M130 410H170M130 290H170" strokeDasharray="3 4" opacity="0.7" />
            </g>
            {/* 07 livraison : le repère validé et le drapeau */}
            <g data-phase="livraison" stroke="var(--cuivre-light)" strokeWidth="2" fill="none">
              <circle data-stroke cx="320" cy="110" r="22" />
              <path data-stroke d="M308 110L317 119L334 100" />
              <path data-stroke d="M120 160V130H150V146H120" />
            </g>
            <g fill="currentColor" fontFamily="Manrope Variable, sans-serif" fontSize="11" fontWeight="600" letterSpacing="2" opacity="0.75">
              <text x="26" y="446">±0,00</text>
              <text x="26" y="306">+3,20</text>
              <text x="26" y="186">+6,40</text>
            </g>
          </svg>
          <p className="etapes__phase">
            <span className="etapes__phase-num tabular">0{phase + 1}</span>
            <span className="etapes__phase-label">{ETAPES.phases[phase].label}</span>
          </p>
        </div>

        <div className="etapes__cartouche">
          <Cartouche num={7} label="Chaque étape sous contrôle" scale="1:50" />
        </div>
      </div>
    </section>
  );
}
