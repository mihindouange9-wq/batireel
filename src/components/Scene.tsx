import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Logo, LogoMark, MARK_PATH } from "../brand/Logo";
import HeroScene, { type FilmDrive, type SceneDrive } from "./HeroScene";
import { DEVIS, ETAPES_PASSEPORT, POSTES, PROFILS, fcfa, postesManquants, totalDevis, type Validation } from "../content/demo";
import { CONSTAT, FOOTER, HERO } from "../content/site";
import { gsap, prepareStrokes } from "../lib/motion";
import "./scene.css";

/* ───────────── Le film de présentation (38 s, 1920 × 1080) ─────────────
   Ligne de temps GSAP en pause : l'outil de rendu place la tête de lecture image par image (`window.seek`)
   et capture. Aucune transition CSS ici, et la scène 3D reçoit l'instant du chantier de l'extérieur : chaque
   image est identique d'un rendu à l'autre. Sept plans :
   0–4,6 s le monogramme se trace et se coule · 4,6–13,4 s le chantier se monte sous le titre
   13,4–18,6 s les trois zones grises · 18,6–24,4 s le comparateur · 24,4–30 s le Passeport Chantier
   30–33,2 s un profil, ses preuves · 33,2–38 s la villa achevée, la signature, le partenaire. */

declare global {
  interface Window {
    seek: (t: number) => void;
    DUREE: number;
    pret: boolean;
  }
}

export const DUREE = 38;
/** instant où le chantier 3D démarre (fin du plan 1) */
const T3D = 4.6;

const INFO = {
  verified: { cls: "statut--ok", text: "Vérifié" },
  declared: { cls: "statut--declare", text: "Déclaré" },
  missing: { cls: "statut--attente", text: "Non fourni" },
} as const;
const ETAT: Record<Validation["state"], { cls: string; text: string }> = {
  ok: { cls: "statut--ok", text: "Validé" },
  attente: { cls: "statut--attente", text: "À valider" },
  alerte: { cls: "statut--alerte", text: "Écart relevé" },
  avenir: { cls: "statut--attente", text: "À venir" },
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  // la scène 3D ne se rend que lorsqu'elle est visible (plans 2 et 7) : le rendu logiciel est lent
  const drive = useRef<SceneDrive>({ scroll: 0, px: 0, py: 0, active: false });
  const film = useRef<FilmDrive>({ time: -1 });
  const [ready3d, setReady3d] = useState(false);
  const onReady = useCallback(() => setReady3d(true), []);
  const postes = POSTES.slice(0, 4);
  const pro = PROFILS[0];

  useEffect(() => {
    const scope = root.current!;
    const q = (s: string) => scope.querySelector<HTMLElement>(s)!;
    const qa = (s: string) => Array.from(scope.querySelectorAll<HTMLElement>(s));
    const d = drive.current;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 1 } });

    /* ---- plan 1 : le repère se pose, le B se trace puis se coule ---- */
    prepareStrokes(qa(".scene__p1 [data-stroke]"));
    tl.to(qa(".scene__p1 .scene__ligne"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.08 }, 0.1)
      .to(q(".scene__mark-trace"), { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.5)
      .to(q(".scene__mark-trace"), { fillOpacity: 1, duration: 0.5, ease: "power2.out" }, 1.9)
      .from(".scene__p1 .scene__wordmark", { autoAlpha: 0, y: 24, duration: 0.9 }, 2.3)
      .from(".scene__p1 .scene__cote", { autoAlpha: 0, duration: 0.6 }, 2.9)
      .to(".scene__p1", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 4.1);

    /* ---- plan 2 : le chantier se monte sous le titre ---- */
    tl.set(d, { active: true }, T3D - 0.05)
      .from(".scene__stage", { autoAlpha: 0, duration: 1.2 }, T3D)
      .from(".scene__p2", { autoAlpha: 0, duration: 0.01 }, T3D)
      .from(qa(".scene__p2 .scene__title > span > i"), { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out" }, 4.9)
      .from(".scene__p2 .scene__sub", { autoAlpha: 0, y: 18, duration: 0.8 }, 6.0)
      .from(".scene__p2 .scene__cotes", { autoAlpha: 0, duration: 0.6 }, 6.6)
      .to(".scene__p2", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 13.0)
      .to(".scene__stage", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 13.0)
      .set(d, { active: false }, 13.6);

    /* ---- plan 3 : trois zones grises ---- */
    tl.from(".scene__p3", { autoAlpha: 0, duration: 0.01 }, 13.4)
      .from(qa(".scene__p3 .scene__title > span > i"), { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" }, 13.5)
      .from(".scene__p3 .scene__zones", { scaleX: 0, transformOrigin: "left center", duration: 0.01 }, 14.2)
      .from(qa(".scene__p3 .scene__zone"), { autoAlpha: 0, y: 26, duration: 0.8, stagger: 0.45 }, 14.4)
      .to(".scene__p3", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 18.1);

    /* ---- plan 4 : comparez autrement ---- */
    tl.from(".scene__p4", { autoAlpha: 0, duration: 0.01 }, 18.5)
      .from(qa(".scene__p4 .scene__title > span > i"), { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" }, 18.6)
      .from(".scene__p4 .scene__sub", { autoAlpha: 0, y: 14, duration: 0.7 }, 19.2)
      .from(".scene__p4 thead", { autoAlpha: 0, y: 10, duration: 0.6 }, 19.4)
      .from(qa(".scene__p4 tbody tr"), { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.38 }, 19.7)
      .from(qa(".scene__p4 tbody .statut--alerte"), { autoAlpha: 0, scale: 0.7, transformOrigin: "left center", duration: 0.45 }, 21.7)
      .from(".scene__p4 tfoot", { autoAlpha: 0, y: 12, duration: 0.6 }, 22.3)
      .from(qa(".scene__p4 tfoot .statut--alerte"), { autoAlpha: 0, scale: 0.7, transformOrigin: "left center", duration: 0.45 }, 22.9)
      .to(".scene__p4", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 23.9);

    /* ---- plan 5 : le Passeport Chantier ---- */
    tl.from(".scene__p5", { autoAlpha: 0, duration: 0.01 }, 24.3)
      .from(qa(".scene__p5 .scene__title > span > i"), { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" }, 24.4)
      .from(".scene__p5 .scene__rail", { scaleX: 0, transformOrigin: "left center", duration: 2.8, ease: "power2.inOut" }, 25.2)
      .from(qa(".scene__p5 .scene__etape"), { autoAlpha: 0, y: 30, duration: 0.7, stagger: 0.42 }, 25.3)
      .from(".scene__p5 .scene__sub", { autoAlpha: 0, y: 12, duration: 0.6 }, 28.3)
      .to(".scene__p5", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 29.5);

    /* ---- plan 6 : un profil, ses preuves ---- */
    tl.from(".scene__p6", { autoAlpha: 0, duration: 0.01 }, 29.9)
      .from(qa(".scene__p6 .scene__title > span > i"), { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" }, 30.0)
      .from(".scene__p6 .scene__card", { autoAlpha: 0, x: 60, duration: 0.9 }, 30.4)
      .from(qa(".scene__p6 .scene__info"), { autoAlpha: 0, x: 20, duration: 0.5, stagger: 0.3 }, 31.0)
      .to(".scene__p6", { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 32.7);

    /* ---- plan 7 : la villa achevée, la signature, le partenaire ---- */
    tl.set(d, { active: true }, 33.0)
      .to(".scene__stage", { autoAlpha: 1, duration: 1.0 }, 33.2)
      .fromTo(d, { scroll: 0.1 }, { scroll: 0.6, duration: 4.8, ease: "sine.inOut" }, 33.2)
      .from(".scene__p7", { autoAlpha: 0, duration: 0.01 }, 33.1)
      .from(qa(".scene__p7 .scene__title > span > i"), { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" }, 33.6)
      .from(".scene__p7 .scene__logo", { autoAlpha: 0, duration: 0.8 }, 34.6)
      .from(".scene__p7 .scene__partner", { autoAlpha: 0, y: 14, duration: 0.8 }, 36.0);

    window.DUREE = DUREE;
    window.seek = (t: number) => {
      const tt = clamp(t, 0, DUREE);
      tl.seek(tt, false);
      // le chantier se monte pendant le plan 2 et reste achevé pour le plan 7
      film.current.time = tt < 20 ? Math.min(tt - T3D, 11.0) : 9.0 + (tt - 33) * 1e-4;
    };
    window.seek(0);
    return () => {
      tl.kill();
    };
  }, []);

  // prêt quand la scène 3D a compilé ses programmes, les polices et les images sont là
  useEffect(() => {
    if (!ready3d) return;
    const images = Array.from(document.images)
      .filter((i) => !i.complete)
      .map((i) => new Promise<void>((r) => { i.onload = i.onerror = () => r(); }));
    Promise.all([document.fonts.ready, ...images]).then(() => {
      window.pret = true;
    });
  }, [ready3d]);

  return (
    <div className="scene" ref={root}>
      {/* la scène 3D, partagée par les plans 2 et 7 */}
      <div className="scene__stage" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene drive={drive} lite={false} film={film} onReady={onReady} />
        </Suspense>
      </div>

      {/* plan 1 */}
      <section className="scene__plan scene__p1">
        <svg className="scene__lignes" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.55">
            <path className="scene__ligne" data-stroke d="M0 220H1920" />
            <path className="scene__ligne" data-stroke d="M0 860H1920" />
            <path className="scene__ligne" data-stroke d="M420 0V1080" />
            <path className="scene__ligne" data-stroke d="M1500 0V1080" />
          </g>
        </svg>
        <svg className="scene__mark" viewBox="14 10 72 80" aria-hidden="true">
          <path className="scene__mark-trace" data-stroke d={MARK_PATH} fill="currentColor" fillRule="evenodd" fillOpacity="0" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="scene__wordmark">
          <Logo size={64} withMark={false} />
        </div>
        <p className="scene__cote cote">Libreville · plateforme en conception</p>
      </section>

      {/* plan 2 */}
      <section className="scene__plan scene__p2">
        <div className="scene__copy">
          <p className="scene__title">
            <span><i>{HERO.title[0]}</i></span>
            <span><i>{HERO.title[1]}</i></span>
          </p>
          <p className="scene__sub">{HERO.subtitle}</p>
          <p className="scene__cotes">
            <span className="cote">{HERO.cotes[0]}</span>
            <span className="cote">{HERO.cotes[1]}</span>
          </p>
        </div>
      </section>

      {/* plan 3 */}
      <section className="scene__plan scene__p3 scene__plan--craie sheet" data-tone="light">
        <div className="scene__inner">
          <p className="scene__title scene__title--compact">
            <span><i>Trois zones grises,</i></span>
            <span><i>un seul chantier.</i></span>
          </p>
          <ol className="scene__zones">
            {CONSTAT.points.map((p, i) => (
              <li className="scene__zone" key={p.title}>
                <span className="scene__zone-num tabular">0{i + 1}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p className="cote cote--plain">{p.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* plan 4 */}
      <section className="scene__plan scene__p4">
        <div className="scene__inner">
          <div className="scene__head">
            <p className="scene__title scene__title--compact">
              <span><i>Comparez</i></span>
              <span><i>autrement.</i></span>
            </p>
            <p className="scene__sub scene__sub--right">Trois devis ramenés aux mêmes lignes. Une offre à laquelle il manque un poste n'est jamais « la plus basse ».</p>
          </div>
          <table className="scene__table">
            <thead>
              <tr>
                <th>Poste</th>
                {DEVIS.map((dv) => (
                  <th key={dv.id}>
                    <b>{dv.label}</b>
                    <span>{dv.entreprise}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {postes.map((p) => {
                const vals = DEVIS.map((dv) => {
                  const l = dv.lignes[p.id];
                  return l.inclus ? l.materiaux + l.main : null;
                });
                const present = vals.filter((v): v is number => v !== null);
                const min = Math.min(...present);
                return (
                  <tr key={p.id}>
                    <th>{p.label}</th>
                    {DEVIS.map((dv, k) => {
                      const v = vals[k];
                      return (
                        <td key={dv.id} className={v === null ? "is-absent" : v === min ? "is-min" : ""}>
                          {v === null ? <span className="statut statut--alerte">Non inclus</span> : <span className="tabular">{fcfa(v)}</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Total de l'offre</th>
                {DEVIS.map((dv) => (
                  <td key={dv.id}>
                    <span className="tabular">{fcfa(totalDevis(dv))}</span>
                    {postesManquants(dv).length > 0 && <span className="statut statut--alerte">Incomplète</span>}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* plan 5 */}
      <section className="scene__plan scene__p5 scene__plan--craie sheet" data-tone="light">
        <div className="scene__inner">
          <p className="scene__title scene__title--compact">
            <span><i>Le Passeport</i></span>
            <span><i>Chantier.</i></span>
          </p>
          <div className="scene__chrono">
            <span className="scene__rail" />
            <ol className="scene__etapes">
              {ETAPES_PASSEPORT.map((e) => {
                const v = e.validations[0];
                return (
                  <li className="scene__etape" key={e.id}>
                    <img src={e.photo.replace(".webp", "-900.webp")} alt="" width="900" height="579" />
                    <span className="scene__etape-num tabular">{e.num}</span>
                    <b>{e.label}</b>
                    <span className="scene__etape-date">{e.date}</span>
                    <span className={`statut ${ETAT[v.state].cls}`}>{ETAT[v.state].text}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="scene__sub scene__sub--encre">Photographies datées, documents et validations, rangés dans une seule chronologie. Chantier fictif.</p>
        </div>
      </section>

      {/* plan 6 */}
      <section className="scene__plan scene__p6">
        <div className="scene__inner scene__inner--duo">
          <div className="scene__copy scene__copy--static">
            <p className="scene__title scene__title--compact">
              <span><i>Des professionnels,</i></span>
              <span><i>des preuves.</i></span>
            </p>
            <p className="scene__sub">Ce qui a été vérifié est marqué comme tel. Ce qui est déclaré reste une déclaration. Profil fictif.</p>
          </div>
          <article className="scene__card">
            <img src={pro.photo} alt="" width="720" height="900" />
            <div className="scene__card-body">
              <h3>{pro.nom}</h3>
              <p className="cote">
                {pro.metier} · {pro.lieu}
              </p>
              <ul className="scene__infos">
                {pro.infos.map((i) => (
                  <li className="scene__info" key={i.label}>
                    <span>{i.label}</span>
                    <span className={`statut ${INFO[i.state].cls}`}>{INFO[i.state].text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* plan 7 */}
      <section className="scene__plan scene__p7">
        <div className="scene__copy">
          <p className="scene__title">
            <span><i>Entrez sur</i></span>
            <span><i>le chantier.</i></span>
          </p>
          <div className="scene__logo">
            <LogoMark size={64} />
            <Logo size={44} withMark={false} />
          </div>
        </div>
        <div className="scene__partner">
          <span className="scene__partner-label">{FOOTER.partner.label}</span>
          <img className="scene__partner-logo" src="/partenaires/methode-aura.png" alt={FOOTER.partner.name} width="800" height="246" />
          <span className="scene__partner-note">{FOOTER.partner.note}</span>
        </div>
      </section>
    </div>
  );
}
