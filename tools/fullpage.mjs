// Captures pleine page (ordinateur et mobile) après un passage complet qui déclenche les révélations.
// node tools/fullpage.mjs [url] [dossier]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://127.0.0.1:5206";
const out = process.argv[3] ?? ".impeccable/review";
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let browser;
for (let i = 0; i < 3 && !browser; i++) {
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: "new",
      args: ["--hide-scrollbars"],
    });
  } catch {}
}
for (const [name, width, height, mobile] of [["desktop", 1440, 900, false], ["mobile", 390, 844, true]]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await sleep(2600);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += height * 0.5) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await sleep(220);
  }
  await sleep(1500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(600);
  // les parallaxes au défilement sont figées là où elles sont : la capture pleine page les montre en place
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  console.log(name, "→", path.join(out, `${name}.png`), total + " px");
  await page.close();
}
await browser.close();
