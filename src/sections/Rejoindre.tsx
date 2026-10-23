import { Cartouche } from "../components/Plan";
import { REJOINDRE, SITE } from "../content/site";
import "./rejoindre.css";

/* L'appel à l'action : deux publics, deux entrées sur le chantier. Sans adresse de contact renseignée,
   le bloc le dit honnêtement au lieu d'un faux lien. */
export default function Rejoindre() {
  const email = SITE.contact.email.trim();
  const href = (subject: string) => (email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : "#contact");

  return (
    <section className="rejoindre" id="rejoindre" data-tone="dark" aria-labelledby="rejoindre-title">
      <div className="container">
        <div className="rejoindre__head">
          <h2 id="rejoindre-title" data-title>
            {REJOINDRE.title}
          </h2>
          <p className="lead rejoindre__lead" data-reveal>
            {REJOINDRE.lead}
          </p>
        </div>

        <div className="rejoindre__grid">
          <div className="rejoindre__col" data-reveal>
            <h3>{REJOINDRE.particuliers.title}</h3>
            <span className="cote">Entrée A</span>
            <p>{REJOINDRE.particuliers.text}</p>
            <a className="btn btn--primary" href={href("BATIRÉEL · mon projet")}>
              <span className="btn__label">{REJOINDRE.particuliers.action}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
          </div>
          <div className="rejoindre__col rejoindre__col--pro" data-reveal data-reveal-delay="0.1">
            <h3>{REJOINDRE.pros.title}</h3>
            <span className="cote">Entrée B</span>
            <p>{REJOINDRE.pros.text}</p>
            <a className="btn btn--ghost" href={href("BATIRÉEL · mon activité")}>
              <span className="btn__label">{REJOINDRE.pros.action}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="rejoindre__contact" id="contact" data-reveal>
          <span className="rejoindre__node" aria-hidden="true" />
          {email ? (
            <p>
              <a className="link rejoindre__mail" href={`mailto:${email}`}>
                {email}
              </a>
              <span className="rejoindre__hint">{REJOINDRE.contactHint}</span>
            </p>
          ) : (
            <p>
              <strong>{REJOINDRE.contactMissing}</strong>
              <span className="rejoindre__hint">{REJOINDRE.contactHint}</span>
            </p>
          )}
        </div>

        <Cartouche num={9} label="Entrer sur le chantier" />
      </div>
    </section>
  );
}
