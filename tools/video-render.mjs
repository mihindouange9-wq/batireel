// Film BATIRÉEL « Nadège et Joël construisent » : charge la scène du site (`/?scene`, servie par `npm run preview`),
// capture image par image dans Chrome (ligne de temps GSAP et chantier 3D placés à chaque instant), puis
// encode en MP4 H.264 + AAC par WebCodecs dans une seconde page Chrome (video/encodeur.html), qui compose
// aussi la bande-son à partir des repères publiés par la scène (window.SON).
// node tools/video-render.mjs                 → livrables/BATIREEL-film-<durée>s-1080p.mp4 et -720p.mp4 + affiche
// node tools/video-render.mjs --apercu        → planche-contact video/apercu.jpg (images clés) sans encoder
// Options : --url http://127.0.0.1:5206  --ips 30  --debit 12000 (kb/s, 1080p)  --debit-mobile 5000 (kb/s, 720p)
//           --sans-mobile (pas de second encodage)  --reprendre (reprend le dernier rendu interrompu : les images déjà capturées sont gardées)
// Les images sont capturées en PNG (sans perte) ; l'encodeur H.264 High fait le reste. Chrome utilise la carte
// graphique de la machine pour la 3D. Ne pas recompiler le site pendant le rendu (il lit dist/ via preview).
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { setTimeout as attendre } from "node:timers/promises";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const VIDEO = join(RACINE, "video");
const args = process.argv.slice(2);
const option = (nom, defaut) => { const i = args.indexOf("--" + nom); return i >= 0 ? Number(args[i + 1]) : defaut; };
const texte = (nom, defaut) => { const i = args.indexOf("--" + nom); return i >= 0 ? args[i + 1] : defaut; };
const APERCU = args.includes("--apercu");
const IPS = option("ips", 30);
const DEBIT = option("debit", 12000) * 1000;
const DEBIT_MOBILE = option("debit-mobile", 5000) * 1000;
const SANS_MOBILE = args.includes("--sans-mobile");
const REPRENDRE = args.includes("--reprendre");
const SITE = texte("url", "http://127.0.0.1:5206");
const L = 1920, H = 1080;
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
let DOSSIER = join(tmpdir(), `batireel-video-${Date.now()}`);
if (REPRENDRE) {
  const anciens = (await readdir(tmpdir())).filter((n) => n.startsWith("batireel-video-")).sort();
  if (anciens.length) DOSSIER = join(tmpdir(), anciens[anciens.length - 1]);
}
await mkdir(join(DOSSIER, "frames"), { recursive: true });

/* ---------- serveur local : encodeur et dossier des images ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png" };
const serveur = http.createServer(async (q, r) => {
  const p = decodeURIComponent(q.url.split("?")[0]);
  const fichier = p.startsWith("/frames/") ? join(DOSSIER, p) : join(VIDEO, p);
  try { const d = await readFile(fichier); r.writeHead(200, { "Content-Type": TYPES[extname(fichier)] || "application/octet-stream", "Cache-Control": "no-store" }); r.end(d); }
  catch { r.writeHead(404); r.end(); }
});
await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
const BASE = `http://127.0.0.1:${serveur.address().port}`;

/* ---------- Chrome piloté par le protocole DevTools ---------- */
async function ouvrirChrome(taille) {
  const port = 9500 + Math.floor(Math.random() * 400);
  const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", "--no-first-run", "--disable-extensions", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--force-device-scale-factor=1", "--ignore-gpu-blocklist", `--remote-debugging-port=${port}`, `--user-data-dir=${DOSSIER}/profil-${port}`, `--window-size=${taille}`, "about:blank"], { stdio: "ignore" });
  let cible = null;
  for (let i = 0; i < 80 && !cible; i++) { await attendre(250); try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* attente */ } }
  if (!cible) throw new Error("Chrome injoignable");
  const ws = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((ok) => { ws.onopen = ok; });
  let n = 0; const attentes = new Map(); const erreurs = [];
  ws.onmessage = (m) => { const t = JSON.parse(m.data); if (t.id && attentes.has(t.id)) { attentes.get(t.id)(t); attentes.delete(t.id); return; } if (t.method === "Runtime.exceptionThrown") erreurs.push((t.params.exceptionDetails?.exception?.description || "").split("\n")[0]); if (t.method === "Runtime.consoleAPICalled" && t.params.type === "error") erreurs.push(t.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200)); };
  const envoyer = (method, params = {}) => new Promise((ok) => { const id = ++n; attentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
  const evaluer = async (expression, timeout = 60000) => { const r = await envoyer("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, timeout }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "erreur"); return r.result?.result?.value; };
  await envoyer("Page.enable"); await envoyer("Runtime.enable");
  return { envoyer, evaluer, erreurs, fermer: () => { try { ws.close(); } catch { /* fermé */ } chrome.kill(); } };
}

/* ---------- 1. capture ---------- */
const scene = await ouvrirChrome(`${L},${H}`);
await scene.envoyer("Emulation.setDeviceMetricsOverride", { width: L, height: H, deviceScaleFactor: 1, mobile: false });
await scene.envoyer("Page.navigate", { url: `${SITE}/?scene` });
for (let i = 0; i < 360; i++) { if (await scene.evaluer("window.pret === true")) break; await attendre(250); }
if (!(await scene.evaluer("window.pret === true"))) { console.error("scène non prête (3D, polices ou images)", scene.erreurs); process.exit(1); }
await attendre(1200); // textures envoyées au GPU, polices
const DUREE = await scene.evaluer("window.DUREE");
const SON = await scene.evaluer("JSON.stringify(window.SON || {})");
const total = Math.round(DUREE * IPS);
const image = async (t, format = "jpeg") => {
  await scene.evaluer(`new Promise((ok) => { window.seek(${t}); requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(ok))); })`);
  const { data } = (await scene.envoyer("Page.captureScreenshot", format === "png" ? { format, captureBeyondViewport: false, optimizeForSpeed: true } : { format, quality: 92, captureBeyondViewport: false })).result;
  return Buffer.from(data, "base64");
};

if (APERCU) {
  const temps = [1.2, 3.8, 8.6, 12.8, 17.2, 21.0, 25.4, 30.0, 33.4, 37.6, 44.0, 48.4, 52.6, 57.0, 63.2, 67.6, 72.2, 78.6, 82.8, 86.6, 91.0, 96.4, 101.0, 105.4, 108.4, 112.6];
  const vignettes = [];
  for (const t of temps) vignettes.push({ t, data: (await image(t)).toString("base64") });
  const planche = await scene.evaluer(`(async () => {
    const vignettes = ${JSON.stringify(vignettes)};
    const vw = 480, vh = 270, cols = 4, rows = Math.ceil(vignettes.length / cols);
    const c = document.createElement('canvas'); c.width = vw * cols; c.height = vh * rows; const g = c.getContext('2d');
    g.fillStyle = '#222'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < vignettes.length; i++) { const img = new Image(); img.src = 'data:image/jpeg;base64,' + vignettes[i].data; await img.decode(); const x = (i % cols) * vw, y = Math.floor(i / cols) * vh; g.drawImage(img, x + 2, y + 2, vw - 4, vh - 4); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x + 2, y + 2, 76, 26); g.fillStyle = '#fff'; g.font = '600 15px sans-serif'; g.fillText(vignettes[i].t.toFixed(1) + ' s', x + 10, y + 21); }
    return c.toDataURL('image/jpeg', 0.86).split(',')[1];
  })()`, 120000);
  await mkdir(VIDEO, { recursive: true });
  await writeFile(join(VIDEO, "apercu.jpg"), Buffer.from(planche, "base64"));
  console.log(`video/apercu.jpg : ${temps.length} images clés · ${DUREE} s · erreurs page : ${scene.erreurs.length ? scene.erreurs.join(" | ") : "aucune"}`);
  scene.fermer(); serveur.close(); await attendre(600); await rm(DOSSIER, { recursive: true, force: true }).catch(() => {});
  process.exit(0);
}

console.log(`Film BATIRÉEL · ${L}×${H} · ${IPS} i/s · ${DUREE} s · ${total} images`);
const debut = Date.now();
let gardees = 0;
for (let i = 0; i < total; i++) {
  const chemin = join(DOSSIER, "frames", `i${String(i).padStart(5, "0")}.png`);
  if (REPRENDRE && existsSync(chemin) && (await stat(chemin)).size > 2000) { gardees++; continue; }
  await writeFile(chemin, await image(i / IPS, "png"));
  if (i % 60 === 0) process.stdout.write(`  capture ${i}/${total} (${((Date.now() - debut) / 1000).toFixed(0)} s)\r`);
}
console.log(`  capture ${total}/${total} en ${((Date.now() - debut) / 1000).toFixed(0)} s${gardees ? ` (${gardees} images reprises)` : ""} · erreurs page : ${scene.erreurs.length ? scene.erreurs.join(" | ") : "aucune"}`);
const affiche = await image(35.0, "webp");
scene.fermer();

/* ---------- 2. encodage : 1080p pour les grands écrans, 720p pour les réseaux et les téléphones ---------- */
const enc = await ouvrirChrome("800,600");
await enc.envoyer("Page.navigate", { url: `${BASE}/encodeur.html` });
for (let i = 0; i < 80; i++) { if (await enc.evaluer("window.pret === true")) break; await attendre(250); }
const cibles = [{ nom: "1080p", largeur: L, hauteur: H, debit: DEBIT }];
if (!SANS_MOBILE) cibles.push({ nom: "720p", largeur: 1280, hauteur: 720, debit: DEBIT_MOBILE });
const LIVRABLES = join(RACINE, "livrables");
await mkdir(LIVRABLES, { recursive: true });
let audio = false;
const sorties = [];
for (const c of cibles) {
  console.log(`  encodage H.264 ${c.largeur}×${c.hauteur} à ${c.debit / 1000} kb/s…`);
  const taille = await enc.evaluer(`window.encoder(${JSON.stringify({ dossier: `${BASE}/frames`, total, ips: IPS, largeur: c.largeur, hauteur: c.hauteur, debit: c.debit, son: JSON.parse(SON) })})`, 3600000);
  const erreur = await enc.evaluer("window.erreur || ''");
  if (erreur) { console.error("échec :", erreur); enc.fermer(); process.exit(1); }
  audio = await enc.evaluer("window.audio");
  const morceaux = [];
  for (let d = 0; d < taille; d += 8_000_000) morceaux.push(Buffer.from(await enc.evaluer(`window.tranche(${d}, ${Math.min(taille, d + 8_000_000)})`, 120000), "base64"));
  const fichier = join(LIVRABLES, `BATIREEL-film-${DUREE}s-${c.nom}.mp4`);
  await writeFile(fichier, Buffer.concat(morceaux));
  sorties.push({ fichier, taille: (await stat(fichier)).size });
}
enc.fermer();
await writeFile(join(LIVRABLES, "BATIREEL-film-affiche.webp"), affiche);
serveur.close();
await attendre(600); await rm(DOSSIER, { recursive: true, force: true }).catch(() => {});
console.log(`\n${sorties.map((s) => `  ${s.fichier} · ${(s.taille / 1048576).toFixed(1)} Mo`).join("\n")}\n  ${DUREE} s · audio AAC : ${audio ? "oui" : "non"} · affiche : livrables/BATIREEL-film-affiche.webp`);
