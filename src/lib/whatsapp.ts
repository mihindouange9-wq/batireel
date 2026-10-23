/* ───────────── Lien WhatsApp « cliquer pour discuter » ─────────────
   Le site ne stocke rien : le message est composé ici, puis remis à WhatsApp (wa.me), qui l'ouvre dans
   l'application du visiteur avec le numéro de BATIRÉEL. Le numéro vient de la variable VITE_WHATSAPP
   (indicatif pays, sans « + » ni espaces, par exemple 241XXXXXXXX). */

export type Profil = "particulier" | "pro";

export interface Projet {
  profil: Profil;
  nom: string;
  /** type de projet (particulier) ou métier (professionnel) */
  type: string;
  commune: string;
  /** surface en m², facultative */
  surface: string;
  /** avancement du projet (particulier) */
  stade: string;
  message: string;
}

/** Ne garde que les chiffres : « +241 XX XX XX XX » devient « 241XXXXXXXX » ; un « 00 » initial est retiré. */
export const normaliserNumero = (brut: string) => brut.replace(/\D/g, "").replace(/^00/, "");

/** Affichage lisible : l'indicatif du Gabon suivi du numéro par paires ; un autre indicatif est laissé tel quel. */
export function formaterNumero(brut: string) {
  const n = normaliserNumero(brut);
  if (!n) return "";
  if (!n.startsWith("241")) return `+${n}`;
  return `+241 ${n.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}

/** L'adresse wa.me, avec le message pré-rempli s'il y en a un. */
export function lienWhatsapp(numero: string, texte = "") {
  const base = `https://wa.me/${normaliserNumero(numero)}`;
  return texte ? `${base}?text=${encodeURIComponent(texte)}` : base;
}

const propre = (s: string) => s.replace(/\s+/g, " ").trim();

/** Le message tel qu'il partira : une salutation, l'essentiel sur une ligne, le texte du visiteur, la signature. */
export function composerMessage(p: Projet, signature: string) {
  const nom = propre(p.nom);
  const point = nom ? "." : "";
  const commune = propre(p.commune);
  const surface = propre(p.surface);
  const lignes = ["Bonjour BATIRÉEL,"];
  if (p.profil === "pro") {
    lignes.push(`Je suis ${nom || "…"}${point}`, `Activité : ${[p.type, commune].filter(Boolean).join(" · ")}`);
  } else {
    lignes.push(`Je m'appelle ${nom || "…"}${point}`, `Projet : ${[p.type, commune, surface ? `${surface}\u00a0m²` : ""].filter(Boolean).join(" · ")}`);
    if (p.stade) lignes.push(`Où j'en suis : ${p.stade.charAt(0).toLowerCase()}${p.stade.slice(1)}`);
  }
  lignes.push("", p.message.trim() || "…", "", `— ${signature}`);
  return lignes.join("\n");
}
