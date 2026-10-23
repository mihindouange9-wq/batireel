import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Logo, LogoMark, MARK_PATH } from "../brand/Logo";
import HeroScene, { type FilmDrive, type SceneDrive } from "./HeroScene";
import { DEVIS, ETAPES_PASSEPORT, POSTES, PROFILS, fcfa, postesManquants, totalDevis } from "../content/demo";
import { FOOTER } from "../content/site";
import { gsap, prepareStrokes } from "../lib/motion";
import "./scene.css";

/* ───────────── Le film : « Nadège et Joël construisent » (116 s, 1920 × 1080) ─────────────
   Une histoire, pas une visite guidée : un couple fictif veut construire sa maison à Libreville, a peur de se
   faire avoir, et choisit BATIRÉEL. Trois gestes (comparer, choisir, suivre), puis les clés.
   Ligne de temps GSAP en pause : l'outil de rendu place la tête de lecture image par image (`window.seek`)
   et capture ; le chantier 3D reçoit son instant de l'extérieur. Aucune transition CSS : chaque image est
   identique d'un rendu à l'autre. La bande-son est composée dans l'encodeur à partir de `window.SON`.

   0–7     ouverture : BATIRÉEL, en collaboration avec MÉTHODE AURA
   7–16    le rêve : un terrain, une maison à construire
   16–32   la peur : les histoires qu'on entend, la question
   32–42   la décision : BATIRÉEL, trois gestes
   42–61   1 · comparer : le projet décrit, trois devis sur les mêmes lignes
   61–77   2 · choisir : un profil, ses preuves
   77–99   3 · suivre : le Passeport Chantier, la villa qui se monte, un écart relevé
   99–107  le résultat : les clés
   107–116 l'appel, la signature, le partenaire */

declare global {
  interface Window {
    seek: (t: number) => void;
    DUREE: number;
    pret: boolean;
    SON: Record<string, unknown>;
  }
}

export const DUREE = 116;

/* instants clés (secondes) */
const T = {
  reve: 7.0,
  peur: 16.0,
  decision: 32.6,
  comparer: 42.2,
  choisir: 61.5,
  suivre: 77.4,
  resultat: 99.6,
  fin: 107.0,
} as const;
/** instant du film où le chantier 3D démarre */
const T3D = 78.0;

const ZONES = [
  "Deux devis, du simple au double, pour la même maison.",
  "Un prix bas… et la toiture qui manque.",
  "Des acomptes versés, puis plus de nouvelles.",
  "Un chantier qui s'arrête. Sans trace.",
];

const INFO = {
  verified: { cls: "statut--ok", text: "Vérifié" },
  declared: { cls: "statut--declare", text: "Déclaré" },
  missing: { cls: "statut--attente", text: "Non fourni" },
} as const;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Lines({ className, lines }: { className?: string; lines: string[] }) {
  return (
    <p className={`film__title ${className ?? ""}`}>
      {lines.map((l) => (
        <span className="w" key={l}>
          <i>{l}</i>
        </span>
      ))}
    </p>
  );
}

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);
  // la scène 3D ne se rend que pendant « suivre » (77–99 s)
  const drive = useRef<SceneDrive>({ scroll: 0.15, px: 0, py: 0, active: false });
  const film = useRef<FilmDrive>({ time: -1 });
  const [ready3d, setReady3d] = useState(false);
  const onReady = useCallback(() => setReady3d(true), []);
  const postes = POSTES.slice(0, 4);
  const pro = PROFILS[0];
  const devisA = DEVIS[0];

  useEffect(() => {
    const scope = root.current!;
    const q = (s: string) => scope.querySelector<HTMLElement>(s)!;
    const qa = (s: string) => Array.from(scope.querySelectorAll<HTMLElement>(s));
    const d = drive.current;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 1 } });

    /* ---- grammaire ---- */
    const rise = (sel: string, t: number, stagger = 0.1, duration = 1.0) => tl.from(qa(`${sel} .w > i`), { yPercent: 112, duration, stagger, ease: "power4.out" }, t);
    const sink = (sel: string, t: number) => tl.to(qa(`${sel} .w > i`), { yPercent: -112, duration: 0.5, stagger: 0.05, ease: "power3.in" }, t);
    const fade = (sel: string, t: number, dur = 0.7, y = 18) => tl.from(sel, { autoAlpha: 0, y, duration: dur }, t);
    const out = (sel: string, t: number, dur = 0.45) => tl.to(sel, { autoAlpha: 0, duration: dur, ease: "power2.in" }, t);
    const stamp = (sel: string, t: number) => tl.from(sel, { autoAlpha: 0, scale: 1.7, rotation: -6, transformOrigin: "left center", duration: 0.35, ease: "power4.out" }, t);
    const plan = (sel: string, t: number) => tl.set(sel, { autoAlpha: 1 }, t);
    const unplan = (sel: string, t: number) => tl.set(sel, { autoAlpha: 0 }, t);
    /** le volet craie traverse l'écran ; à mi-course, les plans s'échangent */
    const wipe = (t: number, from: string, to: string) => {
      tl.fromTo(".film__wipe", { xPercent: -135 }, { xPercent: 135, duration: 0.9, ease: "power3.inOut" }, t);
      unplan(from, t + 0.45);
      plan(to, t + 0.45);
    };
    const kenburns = (sel: string, t: number, dur: number, from = 1.1, to = 1.0) => tl.fromTo(sel, { scale: from }, { scale: to, duration: dur, ease: "none" }, t);
    const typed = (sel: string, text: string, t: number, step = 0.055) => {
      const el = q(sel);
      for (let i = 1; i <= text.length; i++) tl.set(el, { textContent: text.slice(0, i) }, t + i * step);
      return t + text.length * step;
    };

    // états de départ possédés par GSAP (jamais par le CSS : une transformation CSS en % se cumulerait)
    gsap.set(".film__wipe", { xPercent: -135, skewX: -8 });
    gsap.set(".film__steps-rail-fill", { scaleX: 0, transformOrigin: "left center" });

    /* ================= 0 · ouverture : BATIRÉEL × MÉTHODE AURA ================= */
    prepareStrokes(qa(".film__p0 [data-stroke]"));
    plan(".film__p0", 0);
    tl.to(qa(".film__p0 .film__ligne"), { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut", stagger: 0.07 }, 0.05)
      .to(q(".film__p0 .film__mark-trace"), { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.4)
      .to(q(".film__p0 .film__mark-trace"), { fillOpacity: 1, duration: 0.45, ease: "power2.out" }, 1.75)
      .from(".film__p0 .film__wordmark", { autoAlpha: 0, y: 22, duration: 0.8 }, 2.15)
      .from(".film__p0 .film__rule", { scaleX: 0, transformOrigin: "center", duration: 0.9, ease: "power4.out" }, 2.6)
      .from(".film__p0 .film__collab-label", { autoAlpha: 0, y: 12, duration: 0.6 }, 2.95)
      .from(".film__p0 .film__collab-logo", { autoAlpha: 0, scale: 0.9, transformOrigin: "center", duration: 0.9, ease: "power3.out" }, 3.1)
      .from(".film__p0 .film__collab-note", { autoAlpha: 0, duration: 0.6 }, 3.7);
    wipe(6.3, ".film__p0", ".film__p1");

    /* ================= 1 · le rêve ================= */
    kenburns(".film__p1 .film__photo img", T.reve - 0.5, 10, 1.12, 1.0);
    rise(".film__p1 .film__t1", T.reve + 0.5, 0.14);
    fade(".film__p1 .film__cote", T.reve + 1.7, 0.6, 10);
    sink(".film__p1 .film__t1", T.reve + 4.6);
    rise(".film__p1 .film__t2", T.reve + 5.2, 0.14);
    // la lumière baisse : quelque chose inquiète
    tl.to(".film__p1 .film__shade", { opacity: 0.92, duration: 1.2, ease: "power2.in" }, T.peur - 1.3);
    out(".film__p1 .film__t2", T.peur - 0.9, 0.5);
    out(".film__p1 .film__cote", T.peur - 0.9, 0.5);
    unplan(".film__p1", T.peur);

    /* ================= 2 · la peur ================= */
    plan(".film__p2", T.peur);
    kenburns(".film__p2 .film__photo img", T.peur, 16, 1.0, 1.14);
    rise(".film__p2 .film__t1", T.peur + 0.4, 0.12);
    sink(".film__p2 .film__t1", T.peur + 3.0);
    ZONES.forEach((_, i) => {
      const t = T.peur + 3.4 + i * 2.2;
      tl.from(`.film__zone-${i}`, { autoAlpha: 0, x: -50, duration: 0.6, ease: "power4.out" }, t);
      stamp(`.film__zone-${i} .statut`, t + 0.12);
    });
    tl.to(".film__p2 .film__zones", { autoAlpha: 0, y: -30, duration: 0.5, ease: "power2.in" }, T.peur + 12.4);
    tl.to(".film__p2 .film__shade", { opacity: 0.97, duration: 1.0 }, T.peur + 12.2);
    rise(".film__p2 .film__question", T.peur + 12.9, 0.1, 0.9);
    tl.to(".film__p2 .film__question", { scale: 1.04, duration: 3.0, ease: "none", transformOrigin: "left center" }, T.peur + 13.6);
    wipe(T.decision - 0.8, ".film__p2", ".film__p3");

    /* ================= 3 · la décision ================= */
    tl.from(".film__p3 .film__logo-big", { scale: 1.35, autoAlpha: 0, transformOrigin: "center", duration: 0.55, ease: "power4.out" }, T.decision);
    tl.from(".film__p3 .film__halo", { scale: 0.2, autoAlpha: 0, transformOrigin: "center", duration: 1.6, ease: "power3.out" }, T.decision);
    rise(".film__p3 .film__t1", T.decision + 0.9, 0.12);
    tl.to(".film__p3 .film__logo-big", { y: -120, duration: 0.9, ease: "power3.inOut" }, T.decision + 3.4);
    tl.to(".film__p3 .film__t1", { y: -120, duration: 0.9, ease: "power3.inOut" }, T.decision + 3.4);
    fade(".film__p3 .film__t2", T.decision + 3.9, 0.7, 14);
    qa(".film__p3 .film__geste").forEach((g, i) => tl.from(g, { autoAlpha: 0, y: 36, duration: 0.6, ease: "power4.out" }, T.decision + 4.5 + i * 0.35));
    wipe(T.comparer - 0.8, ".film__p3", ".film__p4");

    /* ================= 4 · comparer ================= */
    tl.from(".film__p4 .film__num", { xPercent: -40, autoAlpha: 0, duration: 0.9, ease: "power4.out" }, T.comparer);
    rise(".film__p4 .film__t1", T.comparer + 0.15, 0.1);
    tl.from(".film__p4 .film__device", { x: 120, autoAlpha: 0, rotationY: -8, transformOrigin: "left center", duration: 1.0, ease: "power4.out" }, T.comparer + 0.3);
    // le projet se décrit
    let tt = T.comparer + 1.3;
    tt = typed(".film__f-type", "Maison R+1", tt);
    tt = typed(".film__f-surface", "140 m²", tt + 0.25);
    tt = typed(".film__f-lieu", "Libreville, Angondjé", tt + 0.25);
    tl.to(".film__f-btn", { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "center" }, tt + 0.4);
    tl.to(".film__f-btn", { backgroundColor: "#d08c62", duration: 0.2 }, tt + 0.4);
    fade(".film__p4 .film__sub1", T.comparer + 1.6, 0.6, 12);
    stamp(".film__f-reponses", tt + 1.0);
    const tTable = tt + 2.3;
    // le comparateur remplace le formulaire
    tl.to(".film__screen-form", { autoAlpha: 0, x: -40, duration: 0.4, ease: "power2.in" }, tTable - 0.35);
    tl.from(".film__screen-table", { autoAlpha: 0, x: 40, duration: 0.5 }, tTable);
    out(".film__p4 .film__sub1", tTable - 0.3, 0.3);
    fade(".film__p4 .film__sub2", tTable + 0.3, 0.6, 12);
    tl.from(qa(".film__table thead th"), { autoAlpha: 0, y: -10, duration: 0.5, stagger: 0.08 }, tTable + 0.2);
    tl.from(qa(".film__table tbody tr"), { autoAlpha: 0, y: 16, duration: 0.55, stagger: 0.4 }, tTable + 0.6);
    stamp(".film__table .is-absent .statut", tTable + 2.5);
    tl.from(".film__table tfoot", { autoAlpha: 0, y: 12, duration: 0.6 }, tTable + 3.1);
    stamp(".film__table tfoot .statut", tTable + 3.7);
    out(".film__p4 .film__sub2", tTable + 4.4, 0.3);
    fade(".film__p4 .film__sub3", tTable + 4.8, 0.6, 12);
    // l'offre complète la moins chère, en grand
    const tCall = tTable + 5.3;
    tl.from(".film__callout", { autoAlpha: 0, y: 30, duration: 0.7 }, tCall);
    const compteur = { v: 0 };
    const montant = q(".film__callout-montant");
    tl.to(compteur, { v: totalDevis(devisA), duration: 1.5, ease: "power2.out", onUpdate: () => { montant.textContent = fcfa(Math.round(compteur.v)); } }, tCall + 0.1);
    stamp(".film__callout .statut", tCall + 1.5);
    tl.to(".film__table td.is-min", { backgroundColor: "rgba(141,156,143,0.18)", duration: 0.5 }, tCall + 0.3);
    wipe(T.choisir - 0.8, ".film__p4", ".film__p5");

    /* ================= 5 · choisir ================= */
    tl.from(".film__p5 .film__num", { xPercent: -40, autoAlpha: 0, duration: 0.9, ease: "power4.out" }, T.choisir);
    rise(".film__p5 .film__t1", T.choisir + 0.15, 0.1);
    tl.from(".film__p5 .film__card", { x: 120, autoAlpha: 0, duration: 1.0, ease: "power4.out" }, T.choisir + 0.4);
    tl.from(".film__p5 .film__card img", { scale: 1.15, duration: 6, ease: "none" }, T.choisir + 0.4);
    fade(".film__p5 .film__sub1", T.choisir + 1.3, 0.6, 12);
    qa(".film__p5 .film__info").forEach((el, i) => {
      tl.from(el, { autoAlpha: 0, x: 26, duration: 0.5, ease: "power3.out" }, T.choisir + 1.9 + i * 0.55);
      stamp(`.film__p5 .film__info-${i} .statut`, T.choisir + 2.1 + i * 0.55);
    });
    out(".film__p5 .film__sub1", T.choisir + 5.2, 0.3);
    fade(".film__p5 .film__sub2", T.choisir + 5.6, 0.6, 12);
    qa(".film__p5 .film__real").forEach((el, i) => tl.from(el, { autoAlpha: 0, x: 20, duration: 0.5 }, T.choisir + 6.2 + i * 0.3));
    tl.from(".film__p5 .film__c-btn", { autoAlpha: 0, y: 14, duration: 0.5 }, T.choisir + 8.0);
    tl.to(".film__p5 .film__c-btn", { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "center" }, T.choisir + 9.6);
    tl.from(".film__p5 .film__chosen", { autoAlpha: 0, scale: 0.6, transformOrigin: "center", duration: 0.5, ease: "back.out(2.5)" }, T.choisir + 10.0);
    out(".film__p5 .film__sub2", T.choisir + 10.4, 0.3);
    fade(".film__p5 .film__sub3", T.choisir + 10.8, 0.6, 12);
    wipe(T.suivre - 0.8, ".film__p5", ".film__p6");

    /* ================= 6 · suivre : la villa se monte, le Passeport se remplit ================= */
    tl.set(d, { active: true }, T.suivre - 0.2);
    tl.from(".film__stage", { autoAlpha: 0, duration: 1.0 }, T3D - 0.3);
    tl.from(".film__p6 .film__num", { xPercent: -40, autoAlpha: 0, duration: 0.9, ease: "power4.out" }, T.suivre);
    rise(".film__p6 .film__t1", T.suivre + 0.15, 0.1);
    fade(".film__p6 .film__sub1", T.suivre + 1.2, 0.6, 12);
    tl.from(".film__steps", { autoAlpha: 0, y: 40, duration: 0.8 }, T.suivre + 0.8);
    // les étapes s'allument au rythme du chantier
    [0.9, 2.3, 3.7, 5.3, 6.9].forEach((dt, i) => {
      const t = T3D + dt;
      tl.to(`.film__step-${i} .film__step-dim`, { opacity: 0, duration: 0.45 }, t);
      tl.from(`.film__step-${i} .film__step-pic`, { scale: 1.12, duration: 0.8, ease: "power3.out" }, t);
      stamp(`.film__step-${i} .statut`, t + 0.25);
      tl.to(`.film__steps-rail-fill`, { scaleX: (i + 1) / 6, duration: 1.2, ease: "power2.inOut" }, t);
    });
    out(".film__p6 .film__sub1", T3D + 4.0, 0.3);
    fade(".film__p6 .film__sub2", T3D + 4.4, 0.6, 12);
    // un écart relevé, puis résolu
    const tAlerte = T3D + 8.6;
    tl.from(".film__alert", { autoAlpha: 0, y: 30, duration: 0.6, ease: "power4.out" }, tAlerte);
    stamp(".film__alert .film__alert-tag", tAlerte + 0.15);
    out(".film__p6 .film__sub2", tAlerte - 0.3, 0.3);
    fade(".film__p6 .film__sub3", tAlerte + 0.4, 0.6, 12);
    tl.to(".film__alert", { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" }, tAlerte + 3.6);
    tl.from(".film__resolu", { autoAlpha: 0, y: 30, duration: 0.6, ease: "power4.out" }, tAlerte + 3.9);
    stamp(".film__resolu .film__alert-tag", tAlerte + 4.05);
    out(".film__p6 .film__sub3", tAlerte + 4.2, 0.3);
    fade(".film__p6 .film__sub4", tAlerte + 4.6, 0.6, 12);
    // la caméra se rapproche de la villa achevée
    tl.fromTo(d, { scroll: 0.15 }, { scroll: 0.62, duration: 10, ease: "sine.inOut" }, T3D + 9.5);
    // livraison
    const tLiv = T3D + 16.6;
    tl.to(".film__resolu", { autoAlpha: 0, duration: 0.4 }, tLiv - 0.5);
    tl.to(".film__step-5 .film__step-dim", { opacity: 0, duration: 0.45 }, tLiv);
    tl.from(".film__step-5 .film__step-pic", { scale: 1.12, duration: 0.8, ease: "power3.out" }, tLiv);
    stamp(".film__step-5 .statut", tLiv + 0.25);
    tl.to(".film__steps-rail-fill", { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, tLiv);
    out(".film__p6 .film__sub4", tLiv - 0.2, 0.3);
    fade(".film__p6 .film__sub5", tLiv + 0.3, 0.6, 12);
    wipe(T.resultat - 0.6, ".film__p6", ".film__p7");
    tl.set(d, { active: false }, T.resultat + 0.3);
    tl.to(".film__stage", { autoAlpha: 0, duration: 0.3 }, T.resultat - 0.15);

    /* ================= 7 · le résultat ================= */
    kenburns(".film__p7 .film__photo-a img", T.resultat - 0.5, 7, 1.14, 1.0);
    rise(".film__p7 .film__t1", T.resultat + 0.5, 0.12);
    fade(".film__p7 .film__cote", T.resultat + 1.6, 0.6, 10);
    tl.fromTo(".film__p7 .film__photo-b", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: "power4.inOut" }, T.resultat + 4.2);
    kenburns(".film__p7 .film__photo-b img", T.resultat + 4.2, 4, 1.0, 1.08);
    sink(".film__p7 .film__t1", T.resultat + 4.0);
    rise(".film__p7 .film__t2", T.resultat + 4.9, 0.12);
    wipe(T.fin - 0.6, ".film__p7", ".film__p8");

    /* ================= 8 · l'appel, la signature, le partenaire ================= */
    tl.from(".film__p8 .film__logo-big", { scale: 1.35, autoAlpha: 0, transformOrigin: "center", duration: 0.55, ease: "power4.out" }, T.fin);
    tl.from(".film__p8 .film__halo", { scale: 0.2, autoAlpha: 0, transformOrigin: "center", duration: 1.6, ease: "power3.out" }, T.fin);
    rise(".film__p8 .film__t1", T.fin + 0.8, 0.12);
    qa(".film__p8 .film__geste").forEach((g, i) => tl.from(g, { autoAlpha: 0, y: 30, duration: 0.6, ease: "power4.out" }, T.fin + 2.2 + i * 0.3));
    tl.from(".film__p8 .film__rule", { scaleX: 0, transformOrigin: "center", duration: 0.9, ease: "power4.out" }, T.fin + 3.6);
    tl.from(".film__p8 .film__collab-label", { autoAlpha: 0, y: 12, duration: 0.6 }, T.fin + 3.9);
    tl.from(".film__p8 .film__collab-logo", { autoAlpha: 0, scale: 0.9, transformOrigin: "center", duration: 0.9, ease: "power3.out" }, T.fin + 4.05);
    tl.from(".film__p8 .film__collab-note", { autoAlpha: 0, duration: 0.6 }, T.fin + 4.7);
    tl.from(".film__p8 .film__fictif", { autoAlpha: 0, duration: 0.6 }, T.fin + 5.2);
    tl.to(".film__p8", { autoAlpha: 0, duration: 1.0, ease: "power2.in" }, DUREE - 1.2);
    tl.to({}, { duration: 0.01 }, DUREE);

    /* ---- la bande-son : repères envoyés à l'encodeur ---- */
    const zoneStamps = ZONES.map((_, i) => T.peur + 3.52 + i * 2.2);
    window.SON = {
      tempo: 96,
      pads: [
        { t0: 0, t1: 7.6, chord: "Dm", gain: 0.085, fc: 420 },
        { t0: 7.0, t1: 16.4, chord: "F", gain: 0.095, fc: 640 },
        { t0: 16.0, t1: 32.2, chord: "Dt", gain: 0.1, fc: 380 },
        { t0: 32.4, t1: 42.4, chord: "Bb", gain: 0.1, fc: 760 },
        { t0: 42.0, t1: 47.0, chord: "F", gain: 0.085, fc: 700 },
        { t0: 47.0, t1: 52.0, chord: "Dm", gain: 0.085, fc: 700 },
        { t0: 52.0, t1: 57.0, chord: "Bb", gain: 0.085, fc: 700 },
        { t0: 57.0, t1: 62.0, chord: "C", gain: 0.085, fc: 760 },
        { t0: 61.5, t1: 66.5, chord: "Gm", gain: 0.085, fc: 700 },
        { t0: 66.5, t1: 71.5, chord: "Bb", gain: 0.085, fc: 700 },
        { t0: 71.5, t1: 77.8, chord: "F", gain: 0.085, fc: 760 },
        { t0: 77.4, t1: 83.0, chord: "Dm", gain: 0.09, fc: 640 },
        { t0: 83.0, t1: 88.5, chord: "Bb", gain: 0.09, fc: 680 },
        { t0: 88.5, t1: 94.0, chord: "F", gain: 0.09, fc: 720 },
        { t0: 94.0, t1: 100.0, chord: "C", gain: 0.095, fc: 820 },
        { t0: 99.4, t1: 107.4, chord: "F", gain: 0.11, fc: 900 },
        { t0: 107.0, t1: 112.0, chord: "Bb", gain: 0.1, fc: 820 },
        { t0: 112.0, t1: DUREE, chord: "F", gain: 0.1, fc: 900 },
      ],
      drone: [[T.peur + 2.0, T.decision - 0.6]],
      pulse: [[T.decision + 0.6, T.resultat - 0.6]],
      arp: [[T.comparer, T.resultat - 1.2]],
      hits: [T.decision, T.fin],
      chocs: [T3D + 1.4, T3D + 3.75, T3D + 5.4],
      stamps: [...zoneStamps, tTable + 2.5, tTable + 3.7, tAlerte + 0.15],
      ticks: [
        ...Array.from({ length: 10 }, (_, i) => T.comparer + 1.3 + i * 0.22),
        ...[0, 1, 2, 3].map((i) => tTable + 0.6 + i * 0.4),
        ...[0, 1, 2, 3].map((i) => T.choisir + 1.9 + i * 0.55),
        ...[0.9, 2.3, 3.7, 5.3, 6.9].map((dt) => T3D + dt),
      ],
      pings: [1.95, 3.2, tCall + 0.1, T.choisir + 10.0, tAlerte + 3.9, tLiv + 0.25, T.fin + 4.05],
      risers: [[T.decision - 4.6, T.decision], [T.fin - 2.4, T.fin]],
      whooshes: [6.3, T.decision - 0.8, T.comparer - 0.8, T.choisir - 0.8, T.suivre - 0.8, T.resultat - 0.6, T.fin - 0.6],
      duree: DUREE,
    };

    window.DUREE = DUREE;
    window.seek = (t: number) => {
      const tt = clamp(t, 0, DUREE);
      tl.seek(tt, false);
      // le chantier se monte à partir de T3D, reste achevé ensuite ; l'instant change à chaque image
      film.current.time = tt < T3D ? -1 : Math.min(tt - T3D, 11.0) + (tt - T3D) * 1e-5;
    };
    window.seek(0);
    return () => {
      tl.kill();
    };
  }, [devisA]);

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

  const collab = (
    <>
      <span className="film__rule" />
      <span className="film__collab-label">{FOOTER.partner.label}</span>
      <img className="film__collab-logo" src="/partenaires/methode-aura.png" alt={FOOTER.partner.name} width="800" height="246" />
      <span className="film__collab-note">{FOOTER.partner.note}</span>
    </>
  );

  return (
    <div className="film" ref={root}>
      {/* la scène 3D, derrière le plan « suivre » */}
      <div className="film__stage" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene drive={drive} lite={false} film={film} onReady={onReady} />
        </Suspense>
      </div>

      {/* 0 · ouverture */}
      <section className="film__plan film__p0">
        <svg className="film__lignes" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5">
            <path className="film__ligne" data-stroke d="M0 180H1920" />
            <path className="film__ligne" data-stroke d="M0 900H1920" />
            <path className="film__ligne" data-stroke d="M360 0V1080" />
            <path className="film__ligne" data-stroke d="M1560 0V1080" />
          </g>
        </svg>
        <svg className="film__mark" viewBox="14 10 72 80" aria-hidden="true">
          <path className="film__mark-trace" data-stroke d={MARK_PATH} fill="currentColor" fillRule="evenodd" fillOpacity="0" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="film__wordmark">
          <Logo size={60} withMark={false} />
        </div>
        <div className="film__collab">{collab}</div>
      </section>

      {/* 1 · le rêve */}
      <section className="film__plan film__p1">
        <figure className="film__photo">
          <img src="/photos/film-couple-reve.webp" alt="" width="1920" height="1080" />
          <span className="film__shade film__shade--left" />
        </figure>
        <div className="film__copy film__copy--low">
          <Lines className="film__t1" lines={["Un terrain", "à Libreville.", "Un rêve : leur maison."]} />
          <Lines className="film__t2 film__title--abs" lines={["Nadège et Joël", "sont prêts", "à construire."]} />
          <p className="film__cote cote">Nadège et Joël · couple fictif</p>
        </div>
      </section>

      {/* 2 · la peur */}
      <section className="film__plan film__p2">
        <figure className="film__photo film__photo--sombre">
          <img src="/photos/film-chantier-arret.webp" alt="" width="1920" height="1080" />
          <span className="film__shade film__shade--dark" />
        </figure>
        <div className="film__copy film__copy--high">
          <Lines className="film__t1" lines={["Mais autour d'eux,", "tout le monde a une histoire."]} />
          <ol className="film__zones">
            {ZONES.map((z, i) => (
              <li className={`film__zone film__zone-${i}`} key={z}>
                <span className="statut statut--alerte">Zone grise</span>
                <span className="film__zone-text">{z}</span>
              </li>
            ))}
          </ol>
          <Lines className="film__question film__title--abs" lines={["Comment construire", "sans se faire avoir ?"]} />
        </div>
      </section>

      {/* 3 · la décision */}
      <section className="film__plan film__p3 film__plan--centre">
        <span className="film__halo" />
        <div className="film__logo-big">
          <LogoMark size={150} />
          <Logo size={100} withMark={false} />
        </div>
        <Lines className="film__t1 film__title--centre" lines={["Le chantier.", "Sans zone grise."]} />
        <div className="film__gestes">
          <p className="film__t2 film__sub film__sub--centre">Nadège et Joël choisissent BATIRÉEL. Trois gestes.</p>
          <ol className="film__geste-list">
            {["Comparer", "Choisir", "Suivre"].map((g, i) => (
              <li className="film__geste" key={g}>
                <span className="film__geste-num tabular">0{i + 1}</span>
                <span className="film__geste-label">{g}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · comparer */}
      <section className="film__plan film__p4">
        <div className="film__copy film__copy--step">
          <span className="film__num tabular">01</span>
          <Lines className="film__t1 film__title--step" lines={["Comparer."]} />
          <p className="film__sub film__sub1">Ils décrivent leur projet. Une fois.</p>
          <p className="film__sub film__sub2">Trois entreprises répondent. Les devis sont ramenés aux mêmes lignes, aux mêmes quantités.</p>
          <p className="film__sub film__sub3">Le poste manquant saute aux yeux. L'offre complète la moins chère aussi.</p>
          <div className="film__callout">
            <span className="film__callout-label">{devisA.label} · {devisA.entreprise}</span>
            <span className="film__callout-montant tabular">{fcfa(0)}</span>
            <span className="statut statut--ok">Complète · la moins chère</span>
          </div>
        </div>
        <div className="film__device">
          <div className="film__device-bar">
            <i /><i /><i />
            <span>batireel · mon projet</span>
          </div>
          <div className="film__device-screen">
            <div className="film__screen film__screen-form">
              <p className="film__screen-title">Décrire mon projet</p>
              <dl className="film__form">
                <div><dt>Type de projet</dt><dd className="film__f-type">&nbsp;</dd></div>
                <div><dt>Surface</dt><dd className="film__f-surface">&nbsp;</dd></div>
                <div><dt>Commune</dt><dd className="film__f-lieu">&nbsp;</dd></div>
              </dl>
              <span className="film__f-btn">Publier mon projet</span>
              <span className="film__f-reponses statut statut--ok">3 entreprises ont répondu</span>
            </div>
            <div className="film__screen film__screen-table">
              <p className="film__screen-title">Comparer les devis</p>
              <table className="film__table">
                <thead>
                  <tr>
                    <th>Poste</th>
                    {DEVIS.map((dv) => (
                      <th key={dv.id}>
                        <b>{dv.label}</b>
                        <span>{dv.entreprise.replace(" (entreprise fictive)", "")}</span>
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
                    <th>Total</th>
                    {DEVIS.map((dv) => (
                      <td key={dv.id} className={postesManquants(dv).length ? "" : dv.id === devisA.id ? "is-min" : ""}>
                        <span className="tabular">{fcfa(totalDevis(dv))}</span>
                        {postesManquants(dv).length > 0 && <span className="statut statut--alerte">Incomplète</span>}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
              <p className="film__screen-note">Devis et entreprises fictifs · démonstration</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · choisir */}
      <section className="film__plan film__p5">
        <div className="film__copy film__copy--step">
          <span className="film__num tabular">02</span>
          <Lines className="film__t1 film__title--step" lines={["Choisir."]} />
          <p className="film__sub film__sub1">Chaque professionnel montre ses preuves : vérifiées, déclarées… ou manquantes.</p>
          <p className="film__sub film__sub2">Ses réalisations, ses références. Tout est dit avant de signer.</p>
          <p className="film__sub film__sub3">Nadège et Joël signent avec une entreprise qu'ils connaissent vraiment.</p>
        </div>
        <article className="film__card">
          <figure className="film__card-photo">
            <img src={pro.photo} alt="" width="720" height="900" />
          </figure>
          <div className="film__card-body">
            <h3>{pro.nom.replace(" (profil fictif)", "")}</h3>
            <p className="cote">
              {pro.metier} · {pro.lieu} · profil fictif
            </p>
            <ul className="film__infos">
              {pro.infos.map((i, k) => (
                <li className={`film__info film__info-${k}`} key={i.label}>
                  <span>{i.label}</span>
                  <span className={`statut ${INFO[i.state].cls}`}>{INFO[i.state].text}</span>
                </li>
              ))}
            </ul>
            <ul className="film__reals">
              {pro.realisations.map((r) => (
                <li className="film__real" key={r}>{r}</li>
              ))}
            </ul>
            <span className="film__c-btn">Choisir cette entreprise</span>
            <span className="film__chosen statut statut--ok">Entreprise choisie</span>
          </div>
        </article>
      </section>

      {/* 6 · suivre */}
      <section className="film__plan film__p6">
        <div className="film__copy film__copy--step">
          <span className="film__num tabular">03</span>
          <Lines className="film__t1 film__title--step" lines={["Suivre."]} />
          <p className="film__sub film__sub1">Le chantier avance par étapes. Chacune est photographiée, datée, validée.</p>
          <p className="film__sub film__sub2">Documents rangés, validations enregistrées : rien ne se perd entre deux visites.</p>
          <p className="film__sub film__sub3">Un écart ? Il est relevé avant de coûter.</p>
          <p className="film__sub film__sub4">Même de loin, Nadège et Joël savent où en est leur maison.</p>
          <p className="film__sub film__sub5">Cinq mois plus tard, la maison est livrée.</p>
          <div className="film__alert">
            <span className="film__alert-tag statut statut--alerte">Écart relevé</span>
            <b>Carrelage livré différent du devis.</b>
            <span>Validation suspendue jusqu'à l'accord de Nadège et Joël.</span>
          </div>
          <div className="film__alert film__resolu">
            <span className="film__alert-tag statut statut--ok">Écart résolu</span>
            <b>Référence du devis respectée.</b>
            <span>Le chantier reprend, la validation est enregistrée.</span>
          </div>
        </div>
        <div className="film__steps">
          <span className="film__steps-rail">
            <i className="film__steps-rail-fill" />
          </span>
          <ol className="film__steps-list">
            {ETAPES_PASSEPORT.map((e, i) => (
              <li className={`film__step film__step-${i}`} key={e.id}>
                <figure className="film__step-pic-wrap">
                  <img className="film__step-pic" src={e.photo.replace(".webp", "-900.webp")} alt="" width="900" height="579" />
                  <span className="film__step-dim" />
                </figure>
                <span className="film__step-num tabular">{e.num}</span>
                <b>{e.label}</b>
                <span className="film__step-date">{e.date}</span>
                <span className="statut statut--ok">Validé</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 · le résultat */}
      <section className="film__plan film__p7">
        <figure className="film__photo film__photo-a">
          <img src="/photos/film-couple-cles.webp" alt="" width="1920" height="1080" />
          <span className="film__shade film__shade--left" />
        </figure>
        <figure className="film__photo film__photo-b">
          <img src="/photos/film-couple-entree.webp" alt="" width="1920" height="1080" />
          <span className="film__shade film__shade--left" />
        </figure>
        <div className="film__copy film__copy--high">
          <Lines className="film__t1" lines={["Au prix comparé.", "Chaque étape validée."]} />
          <Lines className="film__t2 film__title--abs" lines={["Chez eux."]} />
          <p className="film__cote cote">Histoire fictive · démonstration</p>
        </div>
      </section>

      {/* 8 · l'appel */}
      <section className="film__plan film__p8 film__plan--centre">
        <span className="film__halo" />
        <div className="film__logo-big">
          <LogoMark size={120} />
          <Logo size={80} withMark={false} />
        </div>
        <Lines className="film__t1 film__title--centre film__title--petit" lines={["Vous construisez ?"]} />
        <ol className="film__geste-list film__geste-list--fin">
          {["Comparez", "Choisissez", "Suivez"].map((g, i) => (
            <li className="film__geste" key={g}>
              <span className="film__geste-num tabular">0{i + 1}</span>
              <span className="film__geste-label">{g}</span>
            </li>
          ))}
        </ol>
        <div className="film__collab">{collab}</div>
        <p className="film__fictif cote cote--plain">Histoire, devis, entreprises et chantier fictifs · démonstration · photographies de banque d'images</p>
      </section>

      {/* le volet des transitions, et le grain du film */}
      <div className="film__wipe" aria-hidden="true" />
      <div className="film__grain" aria-hidden="true" />
      <div className="film__vignette" aria-hidden="true" />
    </div>
  );
}
