import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, ChevronDown, Copy, MessageCircle } from "lucide-react";
import { Cartouche, Note } from "../components/Plan";
import { CONTACT, SITE, TERRAIN } from "../content/site";
import { composerMessage, formaterNumero, lienWhatsapp, normaliserNumero, type Profil, type Projet } from "../lib/whatsapp";
import "./contact.css";

/* Décrire mon projet : un formulaire court dont le message part de WhatsApp. Le site ne stocke rien : le
   texte est composé ici, montré tel qu'il partira, puis remis à l'application du visiteur avec le numéro de
   BATIRÉEL (variable VITE_WHATSAPP). Tant que le numéro n'est pas renseigné, le message se copie, prêt à
   envoyer, et le formulaire le dit. */

type Champ = "nom" | "commune" | "surface" | "message";
type Erreurs = Partial<Record<Champ, string>>;
type Statut = { ton: "ok" | "erreur"; texte: string } | null;

const MIN_MESSAGE = 20;

function valider(p: Projet): Erreurs {
  const e: Erreurs = {};
  if (p.nom.trim().length < 2) e.nom = CONTACT.erreurs.nom;
  if (p.commune.trim().length < 2) e.commune = CONTACT.erreurs.commune;
  if (p.surface.trim() && !/^\d{1,6}([.,]\d{1,2})?$/.test(p.surface.trim())) e.surface = CONTACT.erreurs.surface;
  if (p.message.trim().length < MIN_MESSAGE) e.message = CONTACT.erreurs.message;
  return e;
}

export default function Contact() {
  const numero = normaliserNumero(SITE.contact.whatsapp);
  const base = useId();
  const id = (champ: string) => `${base}-${champ}`;
  const form = useRef<HTMLFormElement>(null);

  const [profil, setProfil] = useState<Profil>("particulier");
  const [nom, setNom] = useState("");
  const [typeProjet, setTypeProjet] = useState<string>(CONTACT.champs.type.options[0]);
  const [metier, setMetier] = useState<string>(CONTACT.champs.metier.options[0]);
  const [commune, setCommune] = useState("");
  const [surface, setSurface] = useState("");
  const [stade, setStade] = useState<string>(CONTACT.champs.stade.options[0]);
  const [message, setMessage] = useState("");
  const [tente, setTente] = useState(false);
  const [statut, setStatut] = useState<Statut>(null);
  const [copie, setCopie] = useState(false);

  const projet = useMemo<Projet>(
    () => ({ profil, nom, type: profil === "pro" ? metier : typeProjet, commune, surface, stade: profil === "pro" ? "" : stade, message }),
    [profil, nom, metier, typeProjet, commune, surface, stade, message],
  );
  const texte = useMemo(() => composerMessage(projet, CONTACT.signature), [projet]);
  // l'aperçu sépare l'en-tête, le corps et la signature : le curseur se pose à la fin du corps
  const parties = useMemo(() => {
    const blocs = texte.split("\n\n");
    return { entete: blocs[0], corps: blocs.slice(1, -1).join("\n\n"), signature: blocs[blocs.length - 1] };
  }, [texte]);
  // après une première tentative, les erreurs suivent la saisie : un état dérivé, sans effet
  const erreurs = useMemo<Erreurs>(() => (tente ? valider(projet) : {}), [projet, tente]);
  const pret = useMemo(() => Object.keys(valider(projet)).length === 0, [projet]);

  // l'appel final choisit le profil : ses boutons mènent ici avec un attribut data-profil
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-profil]");
      if (a) setProfil(a.dataset.profil === "pro" ? "pro" : "particulier");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const copier = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(texte);
      ok = true;
    } catch {
      /* repli ci-dessous : navigateurs sans API presse-papiers ou sans permission */
    }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = texte;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    setCopie(ok);
    if (ok) window.setTimeout(() => setCopie(false), 2500);
    setStatut(ok ? { ton: "ok", texte: CONTACT.statut.copie } : { ton: "erreur", texte: CONTACT.statut.copieImpossible });
  };

  const envoyer = (e: FormEvent) => {
    e.preventDefault();
    setTente(true);
    const err = valider(projet);
    const premier = (["nom", "commune", "surface", "message"] as Champ[]).find((c) => err[c]);
    if (premier) {
      setStatut({ ton: "erreur", texte: CONTACT.statut.invalide });
      document.getElementById(id(premier))?.focus();
      return;
    }
    if (!numero) {
      void copier();
      return;
    }
    window.open(lienWhatsapp(numero, texte), "_blank", "noopener,noreferrer");
    setStatut({ ton: "ok", texte: CONTACT.statut.ouvert });
  };

  const champs = CONTACT.champs;
  const pro = profil === "pro";

  return (
    <section className="contact sheet" id="contact" data-tone="light" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__head">
          <h2 id="contact-title" data-title>
            {CONTACT.title}
          </h2>
          <p className="lead contact__lead" data-reveal>
            {CONTACT.lead}
          </p>
        </div>

        <form ref={form} className="contact__form" noValidate onSubmit={envoyer} aria-describedby={id("confidentialite")} data-reveal>
          <fieldset className="contact__profils">
            <legend className="field__label">{CONTACT.profilLegend}</legend>
            <div className="contact__profils-grid">
              {CONTACT.profils.map((p) => (
                <label key={p.id} className={`contact__profil ${profil === p.id ? "is-on" : ""}`}>
                  <input className="visually-hidden" type="radio" name="profil" value={p.id} checked={profil === p.id} onChange={() => setProfil(p.id)} />
                  <span className="contact__profil-label">{p.label}</span>
                  <span className="contact__profil-hint">{p.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="contact__fields">
            <Field id={id("nom")} label={champs.nom.label} erreur={erreurs.nom}>
              <input
                id={id("nom")}
                name="nom"
                type="text"
                autoComplete="name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={champs.nom.placeholder}
                aria-invalid={erreurs.nom ? true : undefined}
                aria-describedby={erreurs.nom ? `${id("nom")}-erreur` : undefined}
              />
            </Field>

            <Field id={id("commune")} label={champs.commune.label} erreur={erreurs.commune}>
              <input
                id={id("commune")}
                name="commune"
                type="text"
                autoComplete="address-level2"
                list={id("communes")}
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder={champs.commune.placeholder}
                aria-invalid={erreurs.commune ? true : undefined}
                aria-describedby={erreurs.commune ? `${id("commune")}-erreur` : undefined}
              />
              <datalist id={id("communes")}>
                {TERRAIN.reperes.map((r) => (
                  <option key={r.id} value={r.label} />
                ))}
              </datalist>
            </Field>

            {pro ? (
              <Field id={id("metier")} label={champs.metier.label} className="field--full">
                <span className="field__select">
                  <select id={id("metier")} name="metier" value={metier} onChange={(e) => setMetier(e.target.value)}>
                    {champs.metier.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown className="field__chevron" size={18} strokeWidth={2} aria-hidden="true" />
                </span>
              </Field>
            ) : (
              <>
                <Field id={id("type")} label={champs.type.label}>
                  <span className="field__select">
                    <select id={id("type")} name="type" value={typeProjet} onChange={(e) => setTypeProjet(e.target.value)}>
                      {champs.type.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown className="field__chevron" size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                </Field>

                <Field id={id("surface")} label={champs.surface.label} indication={champs.surface.optional} erreur={erreurs.surface}>
                  <span className="field__unit-wrap">
                    <input
                      id={id("surface")}
                      name="surface"
                      type="text"
                      inputMode="decimal"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                      placeholder={champs.surface.placeholder}
                      aria-invalid={erreurs.surface ? true : undefined}
                      aria-describedby={erreurs.surface ? `${id("surface")}-erreur` : undefined}
                    />
                    <span className="field__unit" aria-hidden="true">
                      m²
                    </span>
                  </span>
                </Field>

                <Field id={id("stade")} label={champs.stade.label} className="field--full">
                  <span className="field__select">
                    <select id={id("stade")} name="stade" value={stade} onChange={(e) => setStade(e.target.value)}>
                      {champs.stade.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown className="field__chevron" size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                </Field>
              </>
            )}

            <Field id={id("message")} label={pro ? champs.message.labelPro : champs.message.label} erreur={erreurs.message} className="field--full">
              <textarea
                id={id("message")}
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={pro ? champs.message.placeholderPro : champs.message.placeholder}
                aria-invalid={erreurs.message ? true : undefined}
                aria-describedby={erreurs.message ? `${id("message")}-erreur` : undefined}
              />
            </Field>
          </div>

          <div className="contact__actions">
            <button type="submit" className="btn btn--primary contact__envoyer">
              <span className="btn__label">{numero ? CONTACT.envoyer : CONTACT.copier}</span>
              <span className="btn__arrow" aria-hidden="true" />
            </button>
            {numero ? (
              <a className="link contact__direct" href={lienWhatsapp(numero)} target="_blank" rel="noopener">
                {CONTACT.direct} <span className="tabular">{formaterNumero(numero)}</span>
              </a>
            ) : (
              <Note className="contact__attente">{CONTACT.numeroAbsent}</Note>
            )}
          </div>
          <p className={`contact__statut ${statut?.ton === "erreur" ? "is-erreur" : ""}`} role="status" aria-live="polite">
            {statut?.texte}
          </p>
          <p id={id("confidentialite")} className="contact__confidentialite">
            {CONTACT.confidentialite}
          </p>
        </form>

        <aside className="contact__apercu" aria-label={CONTACT.apercu} data-reveal data-reveal-delay="0.12">
          <p className="cote cote--plain">{CONTACT.apercu}</p>
          <div className="contact__bulle">
            <p className="contact__bulle-head">
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              WhatsApp · {SITE.name}
            </p>
            <p className={`contact__bulle-texte ${pret ? "is-pret" : ""}`}>
              {parties.entete}
              {"\n\n"}
              <span className="contact__bulle-corps">{parties.corps}</span>
              {"\n\n"}
              {parties.signature}
            </p>
            <p className="contact__bulle-etat">
              <span className={`statut ${pret ? "statut--ok" : "statut--attente"}`}>{pret ? CONTACT.etat.pret : CONTACT.etat.enCours}</span>
            </p>
          </div>
          {numero && (
            <button type="button" className="contact__copier" onClick={() => void copier()}>
              {copie ? <Check size={16} strokeWidth={2.2} aria-hidden="true" /> : <Copy size={16} strokeWidth={2} aria-hidden="true" />}
              {copie ? CONTACT.statut.copie : CONTACT.copier}
            </button>
          )}
        </aside>

        <div className="contact__cartouche">
          <Cartouche num={10} label="Décrire mon projet" />
        </div>
      </div>
    </section>
  );
}

/** Un champ du formulaire : étiquette visible, indication éventuelle, erreur posée sous le champ. */
function Field({ id, label, indication, erreur, className, children }: { id: string; label: string; indication?: string; erreur?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`field ${erreur ? "is-invalid" : ""} ${className ?? ""}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {indication && <span className="field__indication"> · {indication}</span>}
      </label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className="field__erreur">
          {erreur}
        </p>
      )}
    </div>
  );
}
