import { useMemo, useState, type CSSProperties } from "react";
import { Check, Minus } from "lucide-react";
import { Cartouche, Note } from "../components/Plan";
import { DEVIS, POSTES, delaiDevis, fcfa, postesManquants, totalDevis, type Devis } from "../content/demo";
import { COMPARATEUR } from "../content/site";
import "./comparateur.css";

/* Le comparateur : on choisit deux ou trois offres fictives, chaque poste est ramené à la même ligne ;
   le montant le plus bas et le plus haut de chaque ligne sont marqués, un poste absent est signalé en
   rouge contrôle, et le pied de tableau donne le total, la durée, l'écart et les prestations incluses.
   Une offre à laquelle il manque un poste n'est jamais « la plus basse » : l'écart se calcule par rapport à
   l'offre complète la moins chère. Sur téléphone, chaque poste devient une fiche, les offres côte à côte. */
export default function Comparateur() {
  const [selected, setSelected] = useState<string[]>(["a", "b", "c"]);
  const offres = useMemo(() => DEVIS.filter((d) => selected.includes(d.id)), [selected]);
  const completes = offres.filter((d) => postesManquants(d).length === 0);
  const minComplet = completes.length ? Math.min(...completes.map(totalDevis)) : null;

  const toggle = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) return s.length > 2 ? s.filter((x) => x !== id) : s;
      return DEVIS.map((d) => d.id).filter((x) => x === id || s.includes(x));
    });
  };

  const montant = (d: Devis, poste: string) => {
    const l = d.lignes[poste];
    return l.inclus ? l.materiaux + l.main : null;
  };

  return (
    <section className="comparateur sheet" id="comparer" data-tone="dark" aria-labelledby="comparateur-title">
      <div className="container">
        <div className="comparateur__head">
          <h2 id="comparateur-title" data-title>
            {COMPARATEUR.title}
          </h2>
          <p className="lead comparateur__lead" data-reveal>
            {COMPARATEUR.lead}
          </p>
        </div>

        <div className="comparateur__bar" data-reveal>
          <p className="cote comparateur__project">{COMPARATEUR.project}</p>
          <div className="comparateur__choice" role="group" aria-label="Offres à comparer">
            {DEVIS.map((d) => {
              const on = selected.includes(d.id);
              return (
                <button key={d.id} type="button" className={`comparateur__pick ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggle(d.id)}>
                  <span className="comparateur__pick-mark" aria-hidden="true">
                    {on ? <Check size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={2} />}
                  </span>
                  <span className="comparateur__pick-label">{d.label}</span>
                  <span className="comparateur__pick-total tabular">
                    {fcfa(totalDevis(d))}
                    {postesManquants(d).length > 0 && <span className="comparateur__pick-flag">incomplète</span>}
                  </span>
                </button>
              );
            })}
            <span className="comparateur__hint">{COMPARATEUR.hint}</span>
          </div>
        </div>

        <div className="comparateur__scroll" data-reveal>
          <table className="comparateur__table" style={{ "--cols": offres.length } as CSSProperties}>
            <caption className="visually-hidden">Comparaison ligne par ligne des offres sélectionnées</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader" className="comparateur__poste-head">
                  {COMPARATEUR.columns.ligne}
                </th>
                {offres.map((d) => (
                  <th key={d.id} scope="col">
                    <span className="comparateur__th-label">{d.label}</span>
                    <span className="comparateur__th-ent">{d.entreprise}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {POSTES.map((p) => {
                const values = offres.map((d) => montant(d, p.id));
                const present = values.filter((v): v is number => v !== null);
                const min = Math.min(...present);
                const max = Math.max(...present);
                return (
                  <tr key={p.id} role="row">
                    <th scope="row" role="rowheader">
                      <span className="comparateur__poste">{p.label}</span>
                      <span className="comparateur__qte tabular">
                        {COMPARATEUR.columns.quantite} · {p.quantite}
                      </span>
                    </th>
                    {offres.map((d) => {
                      const l = d.lignes[p.id];
                      const v = montant(d, p.id);
                      const cls = v === null ? "is-absent" : present.length > 1 && v === min && min !== max ? "is-min" : present.length > 1 && v === max && min !== max ? "is-max" : "";
                      return (
                        <td key={d.id} role="cell" data-devis={d.label} className={cls}>
                          {v === null ? (
                            <span className="comparateur__absent">
                              <span className="statut statut--alerte">Non inclus</span>
                              <small>{l.note}</small>
                            </span>
                          ) : (
                            <>
                              <span className="comparateur__total tabular">{fcfa(v)}</span>
                              {present.length > 1 && v > min && <span className="comparateur__delta tabular">+ {fcfa(v - min)}</span>}
                              <span className="comparateur__detail tabular">
                                <span>
                                  {COMPARATEUR.columns.materiaux} {fcfa(l.materiaux)}
                                </span>
                                <span>
                                  {COMPARATEUR.columns.main} {fcfa(l.main)}
                                </span>
                                <span>
                                  {COMPARATEUR.columns.delai} {l.delai} j
                                </span>
                              </span>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot role="rowgroup">
              <tr className="comparateur__row-total" role="row">
                <th scope="row" role="rowheader">{COMPARATEUR.totalLabel}</th>
                {offres.map((d) => (
                  <td key={d.id} role="cell" data-devis={d.label} className="tabular">
                    {fcfa(totalDevis(d))}
                    {postesManquants(d).length > 0 && (
                      <span className="statut statut--alerte comparateur__total-note">hors {postesManquants(d).map((p) => p.label.toLowerCase()).join(", ")}</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr role="row">
                <th scope="row" role="rowheader">{COMPARATEUR.ecartLabel}</th>
                {offres.map((d) => {
                  const manquants = postesManquants(d);
                  const e = minComplet === null ? null : totalDevis(d) - minComplet;
                  return (
                    <td key={d.id} role="cell" data-devis={d.label} className="tabular">
                      {manquants.length > 0 ? (
                        <span className="comparateur__absent">
                          <span className="statut statut--alerte">Incomplète</span>
                          <small>Sans {manquants.map((p) => p.label.toLowerCase()).join(", ")} : le total ne se compare pas.</small>
                        </span>
                      ) : e === null ? (
                        "Sans objet"
                      ) : e === 0 ? (
                        "Offre complète la plus basse"
                      ) : (
                        `+ ${fcfa(e)}`
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr role="row">
                <th scope="row" role="rowheader">{COMPARATEUR.delaiLabel}</th>
                {offres.map((d) => (
                  <td key={d.id} role="cell" data-devis={d.label} className="tabular">
                    {delaiDevis(d)} jours ouvrés
                  </td>
                ))}
              </tr>
              <tr role="row">
                <th scope="row" role="rowheader">{COMPARATEUR.inclusLabel}</th>
                {offres.map((d) => (
                  <td key={d.id} role="cell" data-devis={d.label}>
                    <ul className="comparateur__inclus">
                      {d.inclus.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                      <li className="comparateur__garantie">{d.garantie}</li>
                    </ul>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <ul className="comparateur__legend" aria-label="Légende">
          <li>
            <i className="comparateur__swatch comparateur__swatch--min" /> {COMPARATEUR.legend.min}
          </li>
          <li>
            <i className="comparateur__swatch comparateur__swatch--max" /> {COMPARATEUR.legend.max}
          </li>
          <li>
            <i className="comparateur__swatch comparateur__swatch--absent" /> {COMPARATEUR.legend.absent}
          </li>
        </ul>
        <Note>Montants et entreprises inventés pour la démonstration ; aucun tarif réel n'est présenté.</Note>
        <Cartouche num={5} label="Comparez autrement" />
      </div>
    </section>
  );
}
