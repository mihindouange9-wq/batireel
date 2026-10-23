// Contrôles d'interaction et d'accessibilité du site BATIRÉEL : structure, navigation, démonstrations
// (Passeport Chantier, comparateur), menu mobile, clavier, mouvement réduit, débordements, console.
// node tools/check.mjs [url]
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://127.0.0.1:5206";
// l'introduction a son propre test : ici on ouvre le site directement
const url = base + (base.includes("?") ? "&" : "?") + "nointro";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const results = [];
const ok = (name, pass, detail = "") => results.push(`${pass ? "OK   " : "ÉCHEC"} ${name}${detail ? " — " + detail : ""}`);

async function fresh(w, h, touch = false, reduced = false) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror " + e.message));
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.type() + " " + m.text().slice(0, 160)));
  page.on("response", (r) => r.status() >= 400 && errors.push(r.status() + " " + r.url()));
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: w, height: h, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(2800);
  return { page, errors };
}

// ── Ordinateur
{
  const { page, errors } = await fresh(1440, 900);
  ok("polices Barlow Condensed et Manrope chargées", await page.evaluate(() => document.fonts.check('700 40px "Barlow Condensed"') && document.fonts.check('450 16px "Manrope Variable"')));
  ok("un seul h1", (await page.$$eval("h1", (n) => n.length)) === 1);
  const headings = await page.$$eval("h1, h2, h3", (hs) => hs.map((h) => h.tagName));
  let jump = false;
  for (let i = 1; i < headings.length; i++) if (+headings[i][1] > +headings[i - 1][1] + 1) jump = true;
  ok("hiérarchie des titres sans saut", !jump, headings.join(" "));
  const noAlt = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.hasAttribute("alt")).length);
  ok("toutes les images ont un alt", noAlt === 0, `${noAlt} sans alt`);
  const unlabeled = await page.$$eval("a, button", (els) => els.filter((el) => !(el.textContent || "").trim() && !el.getAttribute("aria-label")).length);
  ok("liens et boutons tous libellés", unlabeled === 0, `${unlabeled} sans libellé`);
  const canvas = await page.waitForSelector(".hero__stage canvas", { timeout: 8000 }).then(() => true).catch(() => false);
  ok("ordinateur : la scène 3D est rendue dans le hero (chargée après le premier rendu)", canvas);
  ok("l'en-tête devient compact au défilement", await page.evaluate(async () => { window.scrollTo(0, 400); await new Promise((r) => setTimeout(r, 900)); return document.querySelector(".header").classList.contains("is-compact"); }));

  // Passeport Chantier : onglets au clic et au clavier
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#passeport").offsetTop - 64));
  await sleep(2200);
  await page.click('#passeport-tab-finitions');
  await sleep(500);
  const p1 = await page.evaluate(() => ({ titre: document.querySelector("#passeport-panel h3").textContent, alerte: !!document.querySelector(".passeport__alerte"), selected: document.querySelector('[role="tab"][aria-selected="true"]').id }));
  ok("passeport : l'étape Finitions s'affiche avec son anomalie", p1.titre === "Finitions" && p1.alerte && p1.selected === "passeport-tab-finitions", JSON.stringify(p1));
  await page.keyboard.press("ArrowDown");
  await sleep(400);
  ok("passeport : flèche bas passe à Livraison", (await page.$eval("#passeport-panel h3", (h) => h.textContent)) === "Livraison");
  await page.keyboard.press("Home");
  await sleep(400);
  ok("passeport : Début revient à Préparation", (await page.$eval("#passeport-panel h3", (h) => h.textContent)) === "Préparation");

  // comparateur : désélection, minimum deux offres, écarts
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#comparer").offsetTop - 64));
  await sleep(2200);
  const cols0 = await page.$$eval(".comparateur__table thead th", (t) => t.length - 1);
  await page.click('.comparateur__pick[aria-pressed="true"]');
  await sleep(300);
  const cols1 = await page.$$eval(".comparateur__table thead th", (t) => t.length - 1);
  await page.click('.comparateur__pick[aria-pressed="true"]');
  await sleep(300);
  const cols2 = await page.$$eval(".comparateur__table thead th", (t) => t.length - 1);
  ok("comparateur : trois offres, puis deux, jamais moins", cols0 === 3 && cols1 === 2 && cols2 === 2, `${cols0} → ${cols1} → ${cols2}`);
  await page.click('.comparateur__pick[aria-pressed="false"]');
  await sleep(300);
  const marks = await page.evaluate(() => ({ min: document.querySelectorAll(".comparateur__table td.is-min").length, max: document.querySelectorAll(".comparateur__table td.is-max").length, absent: document.querySelectorAll(".comparateur__table td.is-absent").length }));
  ok("comparateur : écarts et poste absent marqués", marks.min >= 6 && marks.max >= 6 && marks.absent === 1, JSON.stringify(marks));
  const ecart = await page.$$eval(".comparateur__table tfoot tr:nth-child(2) td", (tds) => tds.map((t) => t.textContent.trim().slice(0, 32)));
  ok("comparateur : l'offre incomplète n'est jamais « la plus basse »", ecart.some((t) => t.startsWith("Incomplète")) && ecart.some((t) => t.startsWith("Offre complète la plus basse")), ecart.join(" | "));

  // navigation par ancre
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await page.click('.header__nav a[href="#terrain"]');
  await sleep(2600);
  const landed = await page.evaluate(() => Math.round(document.querySelector("#terrain").getBoundingClientRect().top));
  ok("navigation : « Le terrain » amène à la section", Math.abs(landed - 64) < 40, `haut à ${landed} px`);
  ok("navigation : le focus suit l'ancre", await page.evaluate(() => document.activeElement?.id === "terrain"));
  const ctas = await page.$$eval("#rejoindre a.btn", (as) => as.map((a) => a.getAttribute("href")));
  ok("appel final : les deux boutons ont une destination", ctas.length === 2 && ctas.every((h) => h && h.length > 1), ctas.join(", "));
  ok("aucune erreur console (ordinateur)", errors.length === 0, errors.join(" | "));
  await page.close();
}

// ── Débordements à cinq largeurs
for (const w of [1600, 1280, 768, 390, 320]) {
  const { page, errors } = await fresh(w, 900, w < 800);
  const over = await page.evaluate(async () => {
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, (document.body.scrollHeight * i) / steps);
      await new Promise((r) => setTimeout(r, 180));
    }
    const sw = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const out = [...document.querySelectorAll("body *")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > window.innerWidth + 1 && getComputedStyle(el).position !== "fixed" && !el.closest(".marquee, .comparateur__scroll, .hero__stage");
    }).length;
    return { sw, out };
  });
  ok(`${w} px : pas de défilement horizontal`, over.sw <= 0, `${over.sw} px`);
  ok(`${w} px : aucun élément hors écran`, over.out === 0, `${over.out} éléments`);
  ok(`${w} px : aucune erreur console`, errors.length === 0, errors.join(" | "));
  await page.close();
}

// ── Mobile : menu et cibles tactiles
{
  const { page } = await fresh(390, 844, true);
  await page.tap(".header__toggle");
  await sleep(700);
  const menu = await page.evaluate(() => ({ expanded: document.querySelector(".header__toggle").getAttribute("aria-expanded"), links: [...document.querySelectorAll("#menu-mobile a")].filter((a) => a.offsetParent).length }));
  ok("menu mobile : ouvert, six liens", menu.expanded === "true" && menu.links === 6, JSON.stringify(menu));
  await page.keyboard.press("Escape");
  await sleep(400);
  ok("menu mobile : Échap le referme", (await page.$eval(".header__toggle", (b) => b.getAttribute("aria-expanded"))) === "false");
  await page.tap(".header__toggle");
  await sleep(600);
  await page.tap('#menu-mobile a[href="#comparer"]');
  await sleep(1500);
  ok("menu mobile : se referme après un choix", (await page.$eval(".header__toggle", (b) => b.getAttribute("aria-expanded"))) === "false");
  const small = await page.evaluate(() => [...document.querySelectorAll("a, button")]
    .filter((el) => el.offsetParent)
    .map((el) => ({ t: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) }))
    .filter((e) => e.h < 40 && e.w < 40));
  ok("cibles tactiles d'au moins 40 px", small.length === 0, JSON.stringify(small));
  const mobile3d = await page.evaluate(() => ({ canvas: document.querySelectorAll(".hero__stage canvas").length, dessin: document.querySelectorAll(".hero__drawing").length, module: performance.getEntriesByType("resource").some((e) => /trois-/.test(e.name)) }));
  ok("mobile : le dessin remplace la scène 3D et le module 3D n'est pas chargé", mobile3d.canvas === 0 && mobile3d.dessin === 1 && !mobile3d.module, JSON.stringify(mobile3d));
  const fiche = await page.evaluate(() => {
    const row = document.querySelector(".comparateur__table tbody tr");
    const tds = [...row.querySelectorAll("td")];
    return { display: getComputedStyle(row).display, n: tds.length, visibles: tds.filter((td) => td.getBoundingClientRect().width > 60 && td.getBoundingClientRect().right <= innerWidth + 1).length };
  });
  ok("mobile : comparateur en fiches, toutes les offres côte à côte", fiche.display === "grid" && fiche.n === 3 && fiche.visibles === 3, JSON.stringify(fiche));
  await page.close();
}

// ── Mouvement réduit : tout visible, bâtiment terminé
{
  const { page } = await fresh(1280, 900, false, true);
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal], [data-title], h2, .btn")].filter((el) => +getComputedStyle(el).opacity < 0.9 || getComputedStyle(el).visibility === "hidden").length);
  ok("mouvement réduit : aucun contenu masqué", hidden === 0, `${hidden} éléments masqués`);
  ok("mouvement réduit : le bâtiment est montré terminé", (await page.$eval(".etapes__phase-num", (e) => e.textContent.trim())) === "07");
  await page.close();
}

// ── Clavier : lien d'évitement et contour de focus
{
  const { page } = await fresh(1280, 900);
  const trail = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    trail.push(await page.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return `${a.tagName.toLowerCase()}${a.className ? "." + String(a.className).split(" ")[0] : ""}:${s.outlineStyle}`; }));
  }
  ok("clavier : lien d'évitement puis navigation, contour visible", trail[0].startsWith("a.skip-link") && trail.every((t) => !t.endsWith(":none")), trail.join(" → "));
  await page.close();
}

await browser.close();
console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("ÉCHEC")).length;
console.log(`\n${results.length - fails}/${results.length} contrôles passés`);
process.exit(fails ? 1 : 0);
