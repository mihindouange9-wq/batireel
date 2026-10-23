/* ───────────── Données de démonstration, explicitement fictives ─────────────
   Devis, chantier, professionnels : tout est inventé pour montrer le fonctionnement. Les montants sont en
   francs CFA. Les photographies viennent d'une banque d'images (docs/credits-photos.md). */

const photo = (name: string) => `/photos/${name}.webp`;
/* variantes produites par tools/fetch-photos.mjs : <nom>-<largeur>.webp, le fichier sans suffixe étant le plus grand */
const srcset = (name: string, widths: number[], full: number) =>
  [...widths.map((w) => `${photo(`${name}-${w}`)} ${w}w`), `${photo(name)} ${full}w`].join(", ");
const ETAPE_SET = (name: string) => srcset(name, [900], 1400);

/* ---- Comparateur de devis ---- */
export type Poste = { id: string; label: string; quantite: string };
export type LigneDevis = { materiaux: number; main: number; delai: number; inclus: boolean; note?: string };
export type Devis = {
  id: string;
  label: string;
  entreprise: string;
  garantie: string;
  lignes: Record<string, LigneDevis>;
  inclus: string[];
};

export const POSTES: Poste[] = [
  { id: "terrassement", label: "Terrassement et implantation", quantite: "1 lot" },
  { id: "fondations", label: "Fondations en béton armé", quantite: "38 m³" },
  { id: "maconnerie", label: "Maçonnerie et chaînages", quantite: "310 m²" },
  { id: "charpente", label: "Charpente et couverture", quantite: "160 m²" },
  { id: "electricite", label: "Électricité (42 points)", quantite: "1 lot" },
  { id: "plomberie", label: "Plomberie et sanitaires", quantite: "1 lot" },
  { id: "finitions", label: "Enduits, carrelage, peinture", quantite: "265 m²" },
];

export const DEVIS: Devis[] = [
  {
    id: "a",
    label: "Devis A",
    entreprise: "Okoumé BTP (entreprise fictive)",
    garantie: "Garantie de parfait achèvement, 1 an",
    inclus: ["Évacuation des gravats", "Nettoyage de fin de chantier", "Plans d'exécution"],
    lignes: {
      terrassement: { materiaux: 650_000, main: 1_100_000, delai: 12, inclus: true },
      fondations: { materiaux: 5_200_000, main: 2_300_000, delai: 21, inclus: true },
      maconnerie: { materiaux: 6_900_000, main: 4_100_000, delai: 45, inclus: true },
      charpente: { materiaux: 5_600_000, main: 2_200_000, delai: 18, inclus: true },
      electricite: { materiaux: 2_100_000, main: 1_400_000, delai: 15, inclus: true },
      plomberie: { materiaux: 1_900_000, main: 1_300_000, delai: 14, inclus: true },
      finitions: { materiaux: 4_800_000, main: 3_600_000, delai: 40, inclus: true },
    },
  },
  {
    id: "b",
    label: "Devis B",
    entreprise: "Ogooué Construction (entreprise fictive)",
    garantie: "Aucune garantie précisée",
    inclus: ["Nettoyage de fin de chantier"],
    lignes: {
      terrassement: { materiaux: 600_000, main: 900_000, delai: 10, inclus: true },
      fondations: { materiaux: 4_700_000, main: 2_000_000, delai: 18, inclus: true },
      maconnerie: { materiaux: 6_400_000, main: 3_500_000, delai: 40, inclus: true },
      charpente: { materiaux: 0, main: 0, delai: 0, inclus: false, note: "Toiture non comprise : à chiffrer séparément" },
      electricite: { materiaux: 1_800_000, main: 1_200_000, delai: 12, inclus: true },
      plomberie: { materiaux: 1_700_000, main: 1_100_000, delai: 12, inclus: true },
      finitions: { materiaux: 4_300_000, main: 3_200_000, delai: 35, inclus: true },
    },
  },
  {
    id: "c",
    label: "Devis C",
    entreprise: "Estuaire Bâtiment (entreprise fictive)",
    garantie: "Garantie décennale, attestation jointe",
    inclus: ["Évacuation des gravats", "Nettoyage de fin de chantier", "Plans d'exécution", "Suivi hebdomadaire photographié", "Étude de sol"],
    lignes: {
      terrassement: { materiaux: 700_000, main: 1_250_000, delai: 12, inclus: true },
      fondations: { materiaux: 5_600_000, main: 2_500_000, delai: 24, inclus: true },
      maconnerie: { materiaux: 7_300_000, main: 4_400_000, delai: 48, inclus: true },
      charpente: { materiaux: 6_000_000, main: 2_400_000, delai: 20, inclus: true },
      electricite: { materiaux: 2_300_000, main: 1_500_000, delai: 15, inclus: true },
      plomberie: { materiaux: 2_100_000, main: 1_400_000, delai: 15, inclus: true },
      finitions: { materiaux: 5_200_000, main: 3_900_000, delai: 42, inclus: true },
    },
  },
];

export const totalDevis = (d: Devis) => Object.values(d.lignes).reduce((s, l) => s + l.materiaux + l.main, 0);
export const delaiDevis = (d: Devis) => Object.values(d.lignes).reduce((s, l) => s + l.delai, 0);
export const fcfa = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;

/* ---- Passeport Chantier ---- */
export type Validation = { who: string; state: "ok" | "attente" | "alerte" | "avenir"; label: string };
export type Etape = {
  id: string;
  num: string;
  label: string;
  date: string;
  dateISO: string;
  summary: string;
  photo: string;
  photoSet: string;
  photoAlt: string;
  documents: string[];
  validations: Validation[];
  alerte?: string;
};

export const CHANTIER = {
  name: "Maison R+1, quartier Angondjé, Libreville · chantier fictif",
  ref: "PC-2026-0147",
};

export const ETAPES_PASSEPORT: Etape[] = [
  {
    id: "preparation",
    num: "01",
    label: "Préparation",
    date: "15 juin 2026",
    dateISO: "2026-06-15",
    summary: "Implantation au théodolite, bornage, installation de la base vie et du panneau de chantier.",
    photo: photo("etape-preparation"),
    photoSet: ETAPE_SET("etape-preparation"),
    photoAlt: "Deux ouvriers relèvent l'implantation d'un bâtiment au théodolite.",
    documents: ["Plan d'implantation", "Procès-verbal d'ouverture de chantier", "Attestation d'assurance"],
    validations: [
      { who: "Client", state: "ok", label: "Validé le 15 juin" },
      { who: "Entreprise", state: "ok", label: "Validé le 15 juin" },
      { who: "Suivi BATIRÉEL", state: "ok", label: "Point d'étape du 16 juin" },
    ],
  },
  {
    id: "terrassement",
    num: "02",
    label: "Terrassement",
    date: "29 juin 2026",
    dateISO: "2026-06-29",
    summary: "Fouilles en rigoles, mise à niveau de la plateforme, évacuation des terres.",
    photo: photo("etape-terrassement"),
    photoSet: ETAPE_SET("etape-terrassement"),
    photoAlt: "Un ouvrier casqué guide la pelle mécanique dans une fouille.",
    documents: ["Rapport d'étude de sol", "Photographies datées (14)"],
    validations: [
      { who: "Client", state: "ok", label: "Validé le 1er juil." },
      { who: "Entreprise", state: "ok", label: "Validé le 30 juin" },
      { who: "Suivi BATIRÉEL", state: "ok", label: "Point d'étape du 1er juil." },
    ],
  },
  {
    id: "fondations",
    num: "03",
    label: "Fondations",
    date: "20 juillet 2026",
    dateISO: "2026-07-20",
    summary: "Ferraillage des semelles filantes, coulage du béton, longrines et dallage.",
    photo: photo("etape-fondations"),
    photoSet: ETAPE_SET("etape-fondations"),
    photoAlt: "Des ouvriers assemblent le ferraillage d'une fondation.",
    documents: ["Procès-verbal de ferraillage", "Bon de livraison béton", "Photographies datées (31)"],
    validations: [
      { who: "Client", state: "ok", label: "Validé le 24 juil." },
      { who: "Entreprise", state: "ok", label: "Validé le 23 juil." },
      { who: "Suivi BATIRÉEL", state: "ok", label: "Point d'étape du 22 juil." },
    ],
  },
  {
    id: "structure",
    num: "04",
    label: "Structure",
    date: "24 août 2026",
    dateISO: "2026-08-24",
    summary: "Poteaux, poutres et plancher haut du rez-de-chaussée, escalier coulé en place.",
    photo: photo("etape-structure"),
    photoSet: ETAPE_SET("etape-structure"),
    photoAlt: "Des ouvriers dressent les armatures de poteaux en béton armé.",
    documents: ["Plan de coffrage", "Photographies datées (22)"],
    validations: [
      { who: "Client", state: "ok", label: "Validé le 31 août" },
      { who: "Entreprise", state: "ok", label: "Validé le 29 août" },
      { who: "Suivi BATIRÉEL", state: "attente", label: "Point d'étape prévu" },
    ],
  },
  {
    id: "finitions",
    num: "05",
    label: "Finitions",
    date: "19 octobre 2026",
    dateISO: "2026-10-19",
    summary: "Enduits, réseaux, carrelage et peinture. Un écart a été relevé sur une fourniture.",
    photo: photo("etape-finitions"),
    photoSet: ETAPE_SET("etape-finitions"),
    photoAlt: "Un ouvrier applique un enduit sur un mur, depuis un échafaudage.",
    documents: ["Devis complémentaire validé", "Fiche de fourniture carrelage", "Photographies datées (9)"],
    validations: [
      { who: "Client", state: "attente", label: "À valider" },
      { who: "Entreprise", state: "ok", label: "Validé le 19 oct." },
      { who: "Suivi BATIRÉEL", state: "alerte", label: "Écart relevé" },
    ],
    alerte: "Carrelage livré différent de la référence du devis. Validation suspendue jusqu'à l'accord du client.",
  },
  {
    id: "livraison",
    num: "06",
    label: "Livraison",
    date: "30 novembre 2026",
    dateISO: "2026-11-30",
    summary: "Réception des travaux, levée des réserves, remise des clés et du dossier des ouvrages exécutés.",
    photo: photo("etape-livraison"),
    photoSet: ETAPE_SET("etape-livraison"),
    photoAlt: "Un peintre termine la façade d'une maison achevée.",
    documents: ["Procès-verbal de réception", "Liste des réserves", "Dossier des ouvrages exécutés"],
    validations: [
      { who: "Client", state: "avenir", label: "À venir" },
      { who: "Entreprise", state: "avenir", label: "À venir" },
      { who: "Suivi BATIRÉEL", state: "avenir", label: "À venir" },
    ],
  },
];

/* ---- Profils de professionnels ---- */
export type Info = { label: string; state: "verified" | "declared" | "missing" };
export type Profil = {
  id: string;
  metier: string;
  nom: string;
  lieu: string;
  photo: string;
  photoAlt: string;
  realisations: string[];
  references: string[];
  infos: Info[];
  feature?: boolean;
};

export const PROFILS: Profil[] = [
  {
    id: "maconnerie",
    metier: "Maçonnerie générale",
    nom: "Mbeng & Fils (profil fictif)",
    lieu: "Owendo",
    photo: photo("pro-maconnerie"),
    photoAlt: "Un maçon souriant, casque jaune, devant une structure en béton armé.",
    realisations: ["Villa R+1, Angondjé, 2024", "Extension de boutique, Owendo, 2025", "Mur de clôture et portail, Akanda, 2025"],
    references: ["Deux clients joignables sur demande", "Visite d'un chantier terminé possible"],
    infos: [
      { label: "Registre du commerce", state: "verified" },
      { label: "Assurance responsabilité civile", state: "verified" },
      { label: "Effectif : 12 personnes", state: "declared" },
      { label: "Attestation décennale", state: "missing" },
    ],
    feature: true,
  },
  {
    id: "electricite",
    metier: "Électricité du bâtiment",
    nom: "Paul Nziengui (profil fictif)",
    lieu: "Libreville",
    photo: photo("pro-electricite"),
    photoAlt: "Un jeune électricien en tenue orange tient son casque.",
    realisations: ["Installation complète, maison de 140 m², 2025", "Mise aux normes d'un atelier, 2024"],
    references: ["Un client joignable sur demande"],
    infos: [
      { label: "Habilitation électrique", state: "verified" },
      { label: "Pièce d'identité", state: "verified" },
      { label: "8 ans d'expérience", state: "declared" },
    ],
  },
  {
    id: "architecture",
    metier: "Architecture et suivi de chantier",
    nom: "Cabinet Ékang (profil fictif)",
    lieu: "Libreville",
    photo: photo("pro-architecture"),
    photoAlt: "Un architecte travaille sur des plans dans un bureau lumineux.",
    realisations: ["Maison individuelle, Nzeng-Ayong, 2025", "Réhabilitation d'un immeuble de bureaux, 2024"],
    references: ["Dossier de références consultable au cabinet"],
    infos: [
      { label: "Inscription à l'ordre des architectes", state: "verified" },
      { label: "Assurance professionnelle", state: "verified" },
      { label: "Logiciels et méthodes de suivi", state: "declared" },
    ],
  },
];

export const MATIERE = { photo: photo("matiere-dalle"), photoSet: srcset("matiere-dalle", [1000, 1400], 1800), width: 1800, height: 771, alt: "Vue en plongée d'ouvriers posant le ferraillage d'une dalle." };
/** Les postes qu'une offre ne couvre pas : une offre incomplète ne peut pas être « la plus basse ». */
export const postesManquants = (d: Devis) => POSTES.filter((p) => !d.lignes[p.id].inclus);
