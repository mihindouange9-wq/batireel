import { Cartouche, Note } from "../components/Plan";
import { CONSTAT } from "../content/site";
import "./constat.css";

/* Le constat : une feuille de papier technique. À gauche, le titre et les trois zones grises ; à droite,
   un relevé dessiné des trois situations (un devis illisible, des informations éparpillées, un avancement
   sans repères), dont les traits se tracent et dont les rappels pointent vers les points du texte. */
export default function Constat() {
  return (
    <section className="constat sheet" id="constat" data-tone="light" aria-labelledby="constat-title">
      <div className="container constat__grid">
        <div className="constat__copy">
          <h2 id="constat-title" data-title>
            {CONSTAT.title}
          </h2>
          <p className="lead constat__lead" data-reveal>
            {CONSTAT.lead}
          </p>
        </div>

        <div className="constat__drawing" data-reveal>
          <svg viewBox="0 0 560 520" data-draw aria-hidden="true">
            {/* zone 1 : le devis, trois colonnes qui ne s'alignent pas */}
            <g stroke="currentColor" strokeWidth="1.2" fill="none">
              <path data-stroke d="M40 40H220V200H40Z" />
              <path data-stroke d="M60 72H200M60 96H160M60 120H190M60 144H120M60 168H180" opacity="0.6" />
              <path data-stroke d="M250 40H430V200H250Z" />
              <path data-stroke d="M270 72H410M270 108H350M270 144H400" opacity="0.6" />
              <path data-stroke d="M460 60H540V180H460Z" strokeDasharray="4 4" />
            </g>
            <g className="constat__alerte" stroke="var(--controle)" strokeWidth="1.6" fill="none">
              <path data-stroke d="M250 182L430 182" />
              <path data-stroke d="M160 144L200 144" />
            </g>
            {/* zone 2 : les informations éparpillées */}
            <g stroke="currentColor" strokeWidth="1.2" fill="none">
              <circle data-stroke cx="90" cy="300" r="22" />
              <circle data-stroke cx="190" cy="258" r="14" />
              <circle data-stroke cx="260" cy="330" r="18" />
              <circle data-stroke cx="150" cy="370" r="11" />
              <path data-stroke d="M112 300L176 262M204 266L246 318M106 318L146 360" strokeDasharray="3 5" opacity="0.7" />
            </g>
            {/* zone 3 : l'avancement sans repères */}
            <g stroke="currentColor" strokeWidth="1.2" fill="none">
              <path data-stroke d="M330 440H540" strokeWidth="2" />
              <path data-stroke d="M330 430V450M400 434V446M470 434V446M540 430V450" />
              <path data-stroke d="M330 480H420" strokeWidth="6" opacity="0.5" />
            </g>
            <g fill="currentColor" fontFamily="Manrope Variable, sans-serif" fontSize="11" fontWeight="600" letterSpacing="2">
              <text data-pop x="40" y="226">
                DEVIS A
              </text>
              <text data-pop x="250" y="226">
                DEVIS B
              </text>
              <text data-pop x="540" y="206" opacity="0.6" textAnchor="end">
                DEVIS C ?
              </text>
              <text data-pop x="330" y="508">
                SEMAINE 1
              </text>
              <text data-pop x="536" y="508" textAnchor="end">
                … ?
              </text>
            </g>
            <g fill="var(--controle)" fontFamily="Manrope Variable, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2">
              <text data-pop x="330" y="212">
                TOITURE ABSENTE
              </text>
            </g>
          </svg>
          <Note className="constat__legende">Relevé des trois situations décrites ci-contre : le devis incomplet, les informations dispersées, l'avancement sans repères.</Note>
        </div>

        <ol className="constat__points">
          {CONSTAT.points.map((p, i) => (
            <li key={p.title} className="constat__point" data-reveal data-reveal-delay={String(i * 0.08)}>
              <span className="constat__num tabular" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="cote constat__note">{p.note}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="constat__cartouche">
          <Cartouche num={2} label="Le constat" />
        </div>
      </div>
    </section>
  );
}
