import { Cartouche, ImageReveal, Marquee } from "../components/Plan";
import { MATIERE } from "../content/demo";
import { PRESENTATION } from "../content/site";
import "./presentation.css";

/* La présentation : sur graphite, une coupe du bâtiment en trois strates (le prix, la personne,
   l'avancement) à gauche, le texte à droite ; puis une grande photographie qui apparaît derrière son
   dessin ; enfin le texte monumental qui traverse l'écran. */
export default function Presentation() {
  return (
    <section className="presentation sheet" id="presentation" data-tone="dark" aria-labelledby="presentation-title">
      <div className="container">
        <div className="presentation__head">
          <h2 id="presentation-title" data-title>
            {PRESENTATION.title}
          </h2>
          <p className="lead presentation__lead" data-reveal>
            {PRESENTATION.lead}
          </p>
        </div>

        <div className="presentation__grid">
          <div className="presentation__coupe" data-reveal>
            <svg viewBox="0 0 520 440" data-draw aria-hidden="true">
              {/* la coupe : trois niveaux, un escalier, le sol */}
              <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round">
                <path data-stroke d="M40 400H480" strokeWidth="2" />
                <path data-stroke d="M80 400V280H440V400" />
                <path data-stroke d="M80 280V160H440V280" />
                <path data-stroke d="M80 160V60H300V160" />
                <path data-stroke d="M300 60L440 60V160" strokeDasharray="5 5" opacity="0.6" />
                <path data-stroke d="M380 400V340H400V320H420V300H440" opacity="0.8" />
              </g>
              {/* hachures de la dalle et repères */}
              <g stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5">
                <path data-stroke d="M90 410L100 400M120 410L130 400M150 410L160 400M180 410L190 400M210 410L220 400M240 410L250 400M270 410L280 400M300 410L310 400M330 410L340 400M360 410L370 400M390 410L400 400M420 410L430 400" />
              </g>
              <g stroke="var(--cuivre-light)" strokeWidth="1.2" fill="none">
                <path data-stroke d="M30 400H14M30 280H14M30 160H14M30 60H14M22 400V60" />
              </g>
              <g fill="var(--cuivre-light)" fontFamily="Manrope Variable, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2">
                <text data-pop x="96" y="382">
                  LE PRIX
                </text>
                <text data-pop x="96" y="262">
                  LA PERSONNE
                </text>
                <text data-pop x="96" y="142">
                  L'AVANCEMENT
                </text>
              </g>
              <g fill="currentColor" fontFamily="Manrope Variable, sans-serif" fontSize="10" fontWeight="600" letterSpacing="2" opacity="0.7">
                <text data-pop x="454" y="404">
                  ±0,00
                </text>
                <text data-pop x="454" y="284">
                  +3,20
                </text>
                <text data-pop x="454" y="164">
                  +6,40
                </text>
              </g>
            </svg>
          </div>

          <ol className="presentation__strates">
            {PRESENTATION.strates.map((s, i) => (
              <li key={s.label} className="presentation__strate" data-reveal data-reveal-delay={String(i * 0.08)}>
                <h3>{s.title}</h3>
                <span className="cote">{s.label}</span>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <ImageReveal className="presentation__image" src={MATIERE.photo} srcSet={MATIERE.photoSet} sizes="(max-width: 900px) calc(100vw - 40px), min(100vw - 128px, 1360px)" width={MATIERE.width} height={MATIERE.height} alt={MATIERE.alt} caption="Du trait à la matière : le ferraillage d'une dalle, photographié sur chantier (banque d'images)." ratio="21 / 9" />

        <Cartouche num={3} label="La présentation" />
      </div>
      <Marquee text={PRESENTATION.marquee} />
    </section>
  );
}
