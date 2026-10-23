// Télécharge les photographies de chantier et de professionnels depuis la banque d'images Pexels et écrit
// docs/credits-photos.md. Licence Pexels : usage gratuit, y compris commercial, modification autorisée,
// attribution non exigée (https://www.pexels.com/license/). Chantiers et personnes n'ont aucun lien avec
// BATIRÉEL : les légendes, dates et noms affichés sont des démonstrations fictives.
// node tools/fetch-photos.mjs            → public/photos/<nom>.webp (+ <nom>-<largeur>.webp) + docs/credits-photos.md
// node tools/fetch-photos.mjs --force    → retélécharge aussi les fichiers déjà présents
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dest = path.join(root, "public", "photos");

/* nom de fichier, id Pexels, cadrage (largeur × hauteur), variantes plus étroites (srcset), usage, auteur (pseudonyme Pexels), titre */
const ETAPE = [900];
const PHOTOS = [
  { name: "etape-preparation", id: 15360464, w: 1400, h: 900, variants: ETAPE, who: "Passeport · préparation (implantation au théodolite)", by: "@mographe", title: "Men using a theodolite in Fès, Morocco" },
  { name: "etape-terrassement", id: 38188337, w: 1400, h: 900, variants: ETAPE, who: "Passeport · terrassement", by: "@senyonga", title: "Construction workers excavating in Kampala, Uganda" },
  { name: "etape-fondations", id: 37733178, w: 1400, h: 900, variants: ETAPE, who: "Passeport · fondations", by: "@tkirkgoz", title: "Workers preparing steel reinforcement for a concrete foundation" },
  { name: "etape-structure", id: 34831719, w: 1400, h: 900, variants: ETAPE, who: "Passeport · structure", by: "@tanko-joseph", title: "Construction workers erecting rebar columns in Jimeta, Nigeria" },
  { name: "etape-finitions", id: 37352217, w: 1400, h: 900, variants: ETAPE, who: "Passeport · finitions", by: "@akoonie", title: "Construction worker applying plaster in Abuja, Nigeria" },
  { name: "etape-livraison", id: 1036863, w: 1400, h: 900, variants: ETAPE, who: "Passeport · livraison", by: "@apgpotr", title: "Person painting an exterior building wall outdoors in daylight" },
  { name: "matiere-dalle", id: 15109999, w: 1800, h: 771, variants: [1400, 1000], who: "Présentation · du dessin à la photographie", by: "@iwashere", title: "High-angle view of workers reinforcing a steel foundation" },
  { name: "pro-maconnerie", id: 19982408, w: 720, h: 900, who: "Professionnels · maçonnerie (profil fictif)", by: "@illustrate-digital-ug", title: "Smiling construction worker in helmet, Kitgum Matidi, Uganda" },
  { name: "pro-electricite", id: 33630755, w: 720, h: 900, who: "Professionnels · électricité (profil fictif)", by: "@barde_shots", title: "Young worker in orange safety gear holding helmet, outdoors" },
  { name: "pro-architecture", id: 6282116, w: 720, h: 900, who: "Professionnels · architecture (profil fictif)", by: "@yaroslav-shuraev", title: "Black male architect working on blueprints in a well-lit office" },
  /* film de présentation : le même couple (fictif) du rêve aux clés */
  { name: "film-couple-reve", id: 7765593, w: 1920, h: 1080, who: "Film · le couple imagine sa maison", by: "@kindelmedia", title: "A joyful couple imagines their dream home with creative interior sketches" },
  { name: "film-couple-cles", id: 7579195, w: 1920, h: 1080, who: "Film · le couple reçoit ses clés", by: "@kindelmedia", title: "A joyful couple celebrates receiving the key to their new home" },
  { name: "film-couple-sourire", id: 7579211, w: 1920, h: 1080, who: "Film · le couple, clés en main", by: "@kindelmedia", title: "Smiling African American couple holding keys, celebrating home ownership" },
  { name: "film-chantier-arret", id: 38132565, w: 1920, h: 1080, who: "Film · un chantier à l'arrêt (Ghana)", by: "@eons", title: "Partial construction in lush greenery, Greater Accra Region, Ghana" },
  { name: "film-couple-entree", id: 7579198, w: 1920, h: 1080, who: "Film · le couple entre chez lui", by: "@kindelmedia", title: "A cheerful couple stands in their new home" },
];

const url = (p, w, h) => `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}&fm=webp&q=80`;
const force = process.argv.includes("--force");

await mkdir(dest, { recursive: true });
let total = 0;
for (const p of PHOTOS) {
  const files = [[`${p.name}.webp`, p.w, p.h], ...(p.variants ?? []).map((w) => [`${p.name}-${w}.webp`, w, Math.round((w * p.h) / p.w)])];
  for (const [file, w, h] of files) {
    const target = path.join(dest, file);
    if (!force && existsSync(target)) {
      console.log(`  ${file} · déjà présent`);
      continue;
    }
    const r = await fetch(url(p, w, h));
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !type.startsWith("image/")) throw new Error(`${p.id} : ${r.status} ${type}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 4000) throw new Error(`${p.id} : fichier anormalement petit`);
    await writeFile(target, buf);
    total += buf.length;
    console.log(`  ${file} · ${w}×${h} · ${(buf.length / 1024).toFixed(0)} Ko · ${p.who}`);
  }
}

const lignes = PHOTOS.map((p) => `| \`${p.name}.webp\` | ${p.who} | [${p.id}](https://www.pexels.com/photo/${p.id}/) | ${p.by} | ${p.title} |`).join("\n");
const md = `# Crédits des photographies

Les photographies de chantier et de professionnels proviennent de la banque d'images [Pexels](https://www.pexels.com/), sous [licence Pexels](https://www.pexels.com/license/) : usage gratuit, y compris commercial, modification autorisée, attribution non exigée. Les chantiers et les personnes photographiés n'ont aucun lien avec BATIRÉEL : dates, noms, documents et validations affichés sont des démonstrations fictives.

Fichiers : \`public/photos/<nom>.webp\` (et \`<nom>-<largeur>.webp\`, variantes servies aux écrans plus étroits), téléchargés et recadrés par \`node tools/fetch-photos.mjs\`.

| Fichier | Usage | Photo | Auteur | Titre |
| --- | --- | --- | --- | --- |
${lignes}
`;
await mkdir(path.join(root, "docs"), { recursive: true });
await writeFile(path.join(root, "docs", "credits-photos.md"), md);
console.log(`${PHOTOS.length} photographies · ${(total / 1024).toFixed(0)} Ko · docs/credits-photos.md écrit`);
