import { Cartouche } from "../components/Plan";
import { REJOINDRE } from "../content/site";
import "./rejoindre.css";

/* L'appel à l'action : deux publics, deux entrées sur le chantier. Chaque bouton mène au formulaire
   « Décrire mon projet » avec le profil déjà choisi (attribut data-profil lu par la section Contact). */
export default function Rejoindre() {
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
            <a className="btn btn--primary" href="#contact" data-profil="particulier">
              <span className="btn__label">{REJOINDRE.particuliers.action}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
          </div>
          <div className="rejoindre__col rejoindre__col--pro" data-reveal data-reveal-delay="0.1">
            <h3>{REJOINDRE.pros.title}</h3>
            <span className="cote">Entrée B</span>
            <p>{REJOINDRE.pros.text}</p>
            <a className="btn btn--ghost" href="#contact" data-profil="pro">
              <span className="btn__label">{REJOINDRE.pros.action}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <Cartouche num={9} label="Entrer sur le chantier" />
      </div>
    </section>
  );
}
