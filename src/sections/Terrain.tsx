import { Cartouche, Note } from "../components/Plan";
import { TERRAIN } from "../content/site";
import "./terrain.css";

/* Pensé pour le terrain : la vision pour le Gabon et une carte-repère de l'Estuaire (Libreville, Akanda,
   Owendo, Ntoum), dessinée comme un plan de situation, sans statistiques. */
export default function Terrain() {
  return (
    <section className="terrain sheet" id="terrain" data-tone="light" aria-labelledby="terrain-title">
      <div className="container terrain__grid">
        <div className="terrain__map" data-reveal>
          <svg viewBox="0 0 100 100" data-draw aria-hidden="true">
            {/* le trait de côte de l'estuaire, stylisé */}
            <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5">
              <path data-stroke d="M10 12C18 20 22 30 20 40S14 60 18 72 30 92 44 96" />
              <path data-stroke d="M34 6C36 16 42 22 44 30S40 44 46 50 60 60 62 76 58 92 60 98" />
            </g>
            {/* la grille de situation */}
            <g stroke="currentColor" strokeWidth="0.25" fill="none" opacity="0.35">
              <path data-stroke d="M0 25H100M0 50H100M0 75H100M25 0V100M50 0V100M75 0V100" />
            </g>
            {/* les liaisons entre repères */}
            <g stroke="var(--cuivre-deep)" strokeWidth="0.6" fill="none" strokeDasharray="1.5 1.5">
              {TERRAIN.reperes
                .filter((r) => !r.main)
                .map((r) => (
                  <path key={r.id} data-stroke d={`M48 52L${r.x} ${r.y}`} />
                ))}
            </g>
            {/* les repères */}
            {TERRAIN.reperes.map((r) => (
              <g key={r.id} data-pop>
                <circle cx={r.x} cy={r.y} r={r.main ? 3.2 : 2.2} fill={r.main ? "var(--cuivre)" : "var(--craie)"} stroke="var(--cuivre-deep)" strokeWidth="0.6" />
                {r.main && <circle cx={r.x} cy={r.y} r="6" fill="none" stroke="var(--cuivre)" strokeWidth="0.4" />}
                <text x={r.id === "ntoum" ? r.x : r.x + 5} y={r.id === "akanda" ? r.y - 4 : r.id === "ntoum" ? r.y + 7 : r.y + 1.2} textAnchor={r.id === "ntoum" ? "middle" : "start"} fontSize="3.6" fontWeight="700" fontFamily="Manrope Variable, sans-serif" letterSpacing="0.4" fill="currentColor">
                  {r.label.toUpperCase()}
                </text>
              </g>
            ))}
            <g fill="currentColor" fontFamily="Manrope Variable, sans-serif" fontSize="2.6" fontWeight="600" letterSpacing="0.5" opacity="0.7">
              <text data-pop x="6" y="7">
                ESTUAIRE · GABON
              </text>
              <text data-pop x="94" y="7" textAnchor="end">
                PLAN DE SITUATION
              </text>
            </g>
          </svg>
        </div>

        <div className="terrain__copy">
          <h2 id="terrain-title" data-title>
            {TERRAIN.title}
          </h2>
          <p className="lead terrain__lead" data-reveal>
            {TERRAIN.lead}
          </p>
          <ul className="terrain__points">
            {TERRAIN.points.map((p, i) => (
              <li key={p.title} data-reveal data-reveal-delay={String(i * 0.08)}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
          <Note>{TERRAIN.disclaimer}</Note>
        </div>

        <div className="terrain__cartouche">
          <Cartouche num={8} label="Pensé pour le terrain" scale="1:50 000" />
        </div>
      </div>
    </section>
  );
}
