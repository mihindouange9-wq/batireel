import { useRef, useState, type KeyboardEvent } from "react";
import { AlertTriangle, Calendar, FileText } from "lucide-react";
import { Cartouche, Note } from "../components/Plan";
import { CHANTIER, ETAPES_PASSEPORT, type Validation } from "../content/demo";
import { PASSEPORT } from "../content/site";
import "./passeport.css";

const STATUT: Record<Validation["state"], { cls: string; text: string }> = {
  ok: { cls: "statut--ok", text: "Validé" },
  attente: { cls: "statut--attente", text: "En attente" },
  alerte: { cls: "statut--alerte", text: "Anomalie" },
  avenir: { cls: "statut--attente", text: "À venir" },
};

/* Le Passeport Chantier : une chronologie à gauche (onglets, au clavier comme au pointeur), la feuille
   de l'étape à droite : photographie datée, résumé, documents, validations, anomalie éventuelle. */
export default function Passeport() {
  const [active, setActive] = useState(2);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const etape = ETAPES_PASSEPORT[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = ETAPES_PASSEPORT.length;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="passeport sheet" id="passeport" data-tone="light" aria-labelledby="passeport-title">
      <div className="container">
        <div className="passeport__head">
          <h2 id="passeport-title" data-title>
            {PASSEPORT.title}
          </h2>
          <p className="lead passeport__lead" data-reveal>
            {PASSEPORT.lead}
          </p>
        </div>

        <div className="passeport__grid" data-reveal>
          <div className="passeport__timeline">
            <p className="cote passeport__ref">
              {CHANTIER.ref} · {CHANTIER.name}
            </p>
            <div className="passeport__tabs" role="tablist" aria-label="Étapes du chantier" aria-orientation="vertical">
              <span className="passeport__rail" aria-hidden="true">
                <i style={{ transform: `scaleY(${(active + 0.5) / ETAPES_PASSEPORT.length})` }} />
              </span>
              {ETAPES_PASSEPORT.map((s, i) => (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`passeport-tab-${s.id}`}
                  aria-selected={i === active}
                  aria-controls="passeport-panel"
                  tabIndex={i === active ? 0 : -1}
                  className={`passeport__tab ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""} ${s.alerte ? "has-alerte" : ""}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className="passeport__tab-num tabular">{s.num}</span>
                  <span className="passeport__tab-label">{s.label}</span>
                  <span className="passeport__tab-date tabular">{s.date}</span>
                </button>
              ))}
            </div>
            <p className="passeport__hint">{PASSEPORT.hint}</p>
          </div>

          <article className="passeport__sheet" id="passeport-panel" role="tabpanel" aria-labelledby={`passeport-tab-${etape.id}`}>
            <figure className="passeport__photo" key={etape.id}>
              <img src={etape.photo} srcSet={etape.photoSet} sizes="(max-width: 900px) calc(100vw - 40px), min(62vw, 880px)" alt={etape.photoAlt} width="1400" height="900" loading="lazy" decoding="async" />
              <figcaption className="passeport__stamp">
                <Calendar size={14} strokeWidth={2.2} aria-hidden="true" />
                <span className="tabular">{etape.date}</span>
                <span className="passeport__stamp-label">{PASSEPORT.labels.photo}</span>
              </figcaption>
            </figure>
            <div className="passeport__body">
              <div className="passeport__title">
                <span className="passeport__big tabular" aria-hidden="true">
                  {etape.num}
                </span>
                <h3>{etape.label}</h3>
              </div>
              <p className="passeport__summary">{etape.summary}</p>
              {etape.alerte && (
                <p className="passeport__alerte" role="status">
                  <AlertTriangle size={18} strokeWidth={2.2} aria-hidden="true" />
                  {etape.alerte}
                </p>
              )}
              <div className="passeport__lists">
                <div>
                  <p className="cote cote--plain">{PASSEPORT.labels.documents}</p>
                  <ul className="passeport__docs">
                    {etape.documents.map((d) => (
                      <li key={d}>
                        <FileText size={16} strokeWidth={2} aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="cote cote--plain">{PASSEPORT.labels.validations}</p>
                  <ul className="passeport__validations">
                    {etape.validations.map((v) => (
                      <li key={v.who}>
                        <span>{v.who}</span>
                        <span className={`statut ${STATUT[v.state].cls}`}>{v.state === "ok" || v.state === "avenir" ? v.label : STATUT[v.state].text + " · " + v.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>

        <Note className="passeport__demo">{PASSEPORT.demoNote}</Note>
        <Cartouche num={4} label="Le Passeport Chantier" />
      </div>
    </section>
  );
}
