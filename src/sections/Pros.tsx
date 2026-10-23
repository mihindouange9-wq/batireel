import { Cartouche, ImageReveal, Note } from "../components/Plan";
import { PROFILS, type Info } from "../content/demo";
import { PROS } from "../content/site";
import "./pros.css";

const INFO: Record<Info["state"], { cls: string; text: string }> = {
  verified: { cls: "statut--ok", text: "Vérifié" },
  declared: { cls: "statut--declare", text: "Déclaré" },
  missing: { cls: "statut--attente", text: "Non fourni" },
};

/* Les professionnels : un profil en grand, deux profils en demi-largeur. Chaque fiche sépare ce qui a
   été vérifié de ce qui est seulement déclaré, et dit ce qui manque. */
export default function Pros() {
  const [feature, ...others] = PROFILS;
  return (
    <section className="pros sheet" id="professionnels" data-tone="light" aria-labelledby="pros-title">
      <div className="container">
        <div className="pros__head">
          <h2 id="pros-title" data-title>
            {PROS.title}
          </h2>
          <p className="lead pros__lead" data-reveal>
            {PROS.lead}
          </p>
        </div>

        <ul className="pros__legend" aria-label="Légende des informations" data-reveal>
          <li>
            <span className="statut statut--ok">Vérifié</span> {PROS.legend.verified}
          </li>
          <li>
            <span className="statut statut--declare">Déclaré</span> {PROS.legend.declared}
          </li>
          <li>
            <span className="statut statut--attente">Non fourni</span> {PROS.legend.missing}
          </li>
        </ul>

        <article className="pros__feature" data-reveal>
          <ImageReveal className="pros__photo" src={feature.photo} alt={feature.photoAlt} ratio="4 / 5" keepDrawing={false} />
          <div className="pros__body">
            <h3>{feature.nom}</h3>
            <p className="cote">
              {feature.metier} · {feature.lieu}
            </p>
            <div className="pros__cols">
              <div>
                <p className="cote cote--plain">{PROS.realisationsLabel}</p>
                <ul className="pros__list">
                  {feature.realisations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className="cote cote--plain pros__sub">{PROS.referencesLabel}</p>
                <ul className="pros__list">
                  {feature.references.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="cote cote--plain">{PROS.infosLabel}</p>
                <ul className="pros__infos">
                  {feature.infos.map((i) => (
                    <li key={i.label}>
                      <span>{i.label}</span>
                      <span className={`statut ${INFO[i.state].cls}`}>{INFO[i.state].text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </article>

        <div className="pros__others">
          {others.map((p, i) => (
            <article key={p.id} className="pros__card" data-reveal data-reveal-delay={String(i * 0.1)}>
              <ImageReveal className="pros__photo" src={p.photo} alt={p.photoAlt} ratio="4 / 5" keepDrawing={false} />
              <div className="pros__body">
                <h3>{p.nom}</h3>
                <p className="cote">
                  {p.metier} · {p.lieu}
                </p>
                <p className="cote cote--plain pros__sub">{PROS.realisationsLabel}</p>
                <ul className="pros__list">
                  {p.realisations.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className="cote cote--plain pros__sub">{PROS.infosLabel}</p>
                <ul className="pros__infos">
                  {p.infos.map((i) => (
                    <li key={i.label}>
                      <span>{i.label}</span>
                      <span className={`statut ${INFO[i.state].cls}`}>{INFO[i.state].text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <Note>Profils inventés pour la démonstration : les photographies viennent d'une banque d'images et ne représentent pas ces personnes ni ces entreprises.</Note>
        <Cartouche num={6} label="Des professionnels, des preuves" />
      </div>
    </section>
  );
}
