// Génère dans Chrome les déclinaisons du logo : favicon-32.png, apple-touch-icon.png (180) et og-image.png (1200 × 630).
// node tools/build-brand.mjs
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const svg = fs.readFileSync(path.join(pub, "favicon.svg"), "utf8");
const fontUrl = (p) => "file:///" + path.join(root, "node_modules", p).replace(/\\/g, "/");

const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();

// ── icônes : le repère sur tuile graphite
await page.goto("about:blank");
for (const [size, name] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
  const data = await page.evaluate(async (svg, size) => {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); });
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, size, size);
    return c.toDataURL("image/png");
  }, svg, size);
  fs.writeFileSync(path.join(pub, name), Buffer.from(data.split(",")[1], "base64"));
  console.log("écrit public/" + name);
}

// ── image de partage : titre, lignes de plan, repère, dans les polices du site
const mark = `<svg width="46" height="46" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="30" stroke="#FCFBF7" stroke-width="7"/><g stroke="#FCFBF7" stroke-width="7" stroke-linecap="square"><path d="M50 6V26"/><path d="M50 74V94"/><path d="M6 50H26"/><path d="M74 50H94"/></g><circle cx="50" cy="50" r="7" fill="#B86F45"/></svg>`;
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{font-family:"Barlow";src:url("${fontUrl("@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2")}") format("woff2");font-weight:800;}
@font-face{font-family:"Manrope";src:url("${fontUrl("@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2")}") format("woff2");font-weight:200 800;}
html,body{margin:0;width:1200px;height:630px;background:#191B19;color:#FCFBF7;font-family:"Manrope",sans-serif;overflow:hidden}
.wrap{position:relative;width:1200px;height:630px;padding:60px 80px 56px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:16px;font-family:"Barlow";font-weight:800;font-size:40px;letter-spacing:.08em;text-transform:uppercase}
.logo b{color:#D08C62;font-weight:800}
.tag{font-size:15px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#A5A39A;white-space:nowrap}
h1{margin:0;font-family:"Barlow";font-weight:800;font-size:118px;line-height:.9;letter-spacing:-.01em;text-transform:uppercase}
h1 span{display:block;color:#F0EDE4;margin-left:60px;opacity:.92}
p{margin:0;font-size:22px;color:#CDCABF;max-width:46ch;line-height:1.45}
svg.lines{position:absolute;inset:0;width:1200px;height:630px}
svg.lines path{fill:none;stroke-width:1.5;vector-effect:non-scaling-stroke}
</style></head><body><div class="wrap">
<svg class="lines" viewBox="0 0 1200 630"><path d="M0 108H1200" stroke="rgba(252,251,247,.12)"/><path d="M0 522H1200" stroke="rgba(252,251,247,.12)"/><path d="M860 0V630" stroke="rgba(252,251,247,.12)"/><path d="M900 420H1120M900 410V430M1120 410V430" stroke="#D08C62"/><path d="M1150 150V330M1140 150H1160M1140 330H1160" stroke="#D08C62"/></svg>
<div class="top"><div class="logo">${mark}<span>BATIR<b>É</b>EL</span></div><span class="tag">Mise en relation · devis · suivi de chantier · Gabon</span></div>
<div><h1>Le chantier.<span>Sans zone grise.</span></h1></div>
<p>Comparez les devis. Choisissez les bons professionnels. Suivez l'avancement de vos travaux en toute transparence.</p>
</div></body></html>`;
const tmp = path.join(root, "tools/.tmp-og.html");
fs.writeFileSync(tmp, html);
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto("file:///" + tmp.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(pub, "og-image.png") });
fs.unlinkSync(tmp);
console.log("écrit public/og-image.png");
await browser.close();
