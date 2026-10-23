// Télécharge les textures physiques (couleur, normales, rugosité) de la scène 3D du hero depuis Poly Haven,
// licence CC0 (https://polyhaven.com/license), puis les réduit en WebP 768 px dans Chrome et écrit
// docs/credits-textures.md.
// node tools/fetch-textures.mjs            → public/textures/<nom>_<carte>.webp + docs/credits-textures.md
// node tools/fetch-textures.mjs --force    → retélécharge aussi les fichiers déjà présents
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = path.resolve(import.meta.dirname, "..");
const dest = path.join(root, "public", "textures");
const src = path.join(root, "tools", ".textures-src");
const force = process.argv.includes("--force");
const SIZE = 768;

/* identifiant Poly Haven, usage dans la scène */
const TEXTURES = [
  { slug: "concrete_wall_005", who: "béton des dalles, poteaux, acrotère, escalier" },
  { slug: "white_stucco_02", who: "enduit des murs" },
  { slug: "fine_grained_wood", who: "brise-soleil en bois" },
  { slug: "sandy_gravel", who: "sol du terrain" },
];
/* cartes retenues : couleur (sRGB), normales OpenGL, rugosité ; qualité WebP par carte */
const MAPS = [
  { key: "Diffuse", suffix: "diff", q: 0.82 },
  { key: "nor_gl", suffix: "nor", q: 0.9 },
  { key: "Rough", suffix: "rough", q: 0.8 },
];

await mkdir(dest, { recursive: true });
await mkdir(src, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.goto("about:blank");

const credits = [];
let total = 0;
for (const t of TEXTURES) {
  const files = await (await fetch(`https://api.polyhaven.com/files/${t.slug}`)).json();
  const info = await (await fetch(`https://api.polyhaven.com/info/${t.slug}`)).json();
  const authors = Object.keys(info.authors ?? {}).join(", ") || "Poly Haven";
  credits.push({ ...t, authors, name: info.name ?? t.slug });
  for (const m of MAPS) {
    const entry = files[m.key]?.["1k"]?.jpg;
    if (!entry) throw new Error(`${t.slug} : carte ${m.key} absente`);
    const out = path.join(dest, `${t.slug}_${m.suffix}.webp`);
    if (!force && existsSync(out)) {
      console.log(`  ${path.basename(out)} · déjà présent`);
      continue;
    }
    const jpg = path.join(src, `${t.slug}_${m.suffix}.jpg`);
    if (force || !existsSync(jpg)) {
      const r = await fetch(entry.url);
      if (!r.ok) throw new Error(`${entry.url} : ${r.status}`);
      await writeFile(jpg, Buffer.from(await r.arrayBuffer()));
    }
    // réduction et conversion dans Chrome (ni sharp ni Python sur ce poste)
    const b64 = (await readFile(jpg)).toString("base64");
    const data = await page.evaluate(
      async (b64, size, q) => {
        const img = new Image();
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = "data:image/jpeg;base64," + b64;
        });
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, size, size);
        return c.toDataURL("image/webp", q);
      },
      b64,
      SIZE,
      m.q,
    );
    const buf = Buffer.from(data.split(",")[1], "base64");
    await writeFile(out, buf);
    total += buf.length;
    console.log(`  ${path.basename(out)} · ${SIZE} px · ${(buf.length / 1024).toFixed(0)} Ko · ${t.who}`);
  }
}
await browser.close();

const lignes = credits.map((c) => `| \`${c.slug}\` | ${c.who} | ${c.name} | ${c.authors} | [polyhaven.com/a/${c.slug}](https://polyhaven.com/a/${c.slug}) |`).join("\n");
await mkdir(path.join(root, "docs"), { recursive: true });
await writeFile(
  path.join(root, "docs", "credits-textures.md"),
  `# Crédits des textures de la scène 3D

Les textures physiques (couleur, normales, rugosité) de la villa du hero proviennent de [Poly Haven](https://polyhaven.com/), sous licence [CC0](https://polyhaven.com/license) : usage libre, y compris commercial, attribution non exigée. Elles sont téléchargées en 1K puis réduites en WebP de ${SIZE} px par \`node tools/fetch-textures.mjs\` dans \`public/textures/\`.

| Identifiant | Usage | Nom | Auteur(s) | Page |
| --- | --- | --- | --- | --- |
${lignes}
`,
);
console.log(`${credits.length} jeux de textures · ${(total / 1024).toFixed(0)} Ko écrits · docs/credits-textures.md`);
