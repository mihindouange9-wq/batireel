import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Cartouche } from "../components/Plan";
import { EXPLORER } from "../content/site";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import "./explorer.css";

/* Le sommaire de l'accueil : la nomenclature du dossier. Chaque ligne mène à une page ; elle entre par
   son filet qui se trace, puis son titre monte. Au survol, une dalle cuivre traverse la ligne et le
   titre avance. Au défilement, les titres se décalent légèrement les uns par rapport aux autres. */
export default function Explorer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>(".explorer__row", root.current!);
      rows.forEach((row, i) => {
        gsap.fromTo(
          row.querySelector(".explorer__label"),
          { xPercent: i % 2 ? 5 : -5 },
          { xPercent: 0, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "top 45%", scrub: 0.6 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section className="explorer sheet" id="explorer" data-tone="light" ref={root} aria-labelledby="explorer-title">
      <div className="container">
        <div className="explorer__head">
          <h2 id="explorer-title" data-title>
            {EXPLORER.title}
          </h2>
          <p className="lead" data-reveal>
            {EXPLORER.lead}
          </p>
        </div>
        <ul className="explorer__list">
          {EXPLORER.items.map((item) => (
            <li key={item.href} className="explorer__item">
              <span className="explorer__rule" data-rule aria-hidden="true" />
              <a className="explorer__row" href={item.href}>
                <span className="explorer__num tabular">{item.num}</span>
                <span className="explorer__label" data-title>
                  {item.label}
                </span>
                <span className="explorer__text" data-reveal>
                  {item.text}
                </span>
                <span className="explorer__action" data-reveal>
                  {item.action}
                  <ArrowUpRight size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <Cartouche num={4} total={5} label="Le dossier" />
      </div>
    </section>
  );
}
