// Builds the 1200x630 social share card (og:image) for every project and design concept, in
// Persian and English: public/projects/og/<slug>-<locale>.jpg. Each card is rendered with
// Playwright from the real desktop and mobile hero captures in public/projects/hero/.
// JPG at 1200x630 is what Telegram, WhatsApp, LinkedIn and X all preview without cropping.
//
// Usage: npm run projects:og

import { chromium } from "playwright";
import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const jiti = createJiti(import.meta.url);
const { PROJECTS } = await jiti.import(resolve(root, "src/app/components/Projects/data.ts"));
const { CONCEPT_PROJECTS } = await jiti.import(resolve(root, "src/app/components/Projects/concepts.ts"));

const outDir = resolve(root, "public/projects/og");
await mkdir(outDir, { recursive: true });

const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(resolve(root, path))).toString("base64")}`;
const fontRegular = await dataUrl("public/fonts/iranyekan/iranyekan-regular.woff2", "font/woff2");
const fontBold = await dataUrl("public/fonts/iranyekan/iranyekan-extrabold.woff2", "font/woff2");
const logo = await dataUrl("public/brand/logo-horizontal-light.webp", "image/webp");

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cardHtml({ locale, title, service, kind, host, desktop, mobile }) {
  const isFa = locale === "fa";
  return `<!doctype html>
<html lang="${locale}" dir="${isFa ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8" />
<style>
  @font-face { font-family: "IRANYekan"; src: url(${fontRegular}) format("woff2"); font-weight: 400; }
  @font-face { font-family: "IRANYekan"; src: url(${fontBold}) format("woff2"); font-weight: 800; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #111820; color: #eceee9; font-family: "IRANYekan", Tahoma, Arial, sans-serif; }
  .glow { position: absolute; border-radius: 50%; filter: blur(90px); }
  .glow-a { width: 520px; height: 520px; top: -220px; inset-inline-end: -120px; background: #8dafc5; opacity: .22; }
  .glow-b { width: 420px; height: 420px; bottom: -240px; inset-inline-start: -80px; background: #c98b62; opacity: .16; }
  .grid { position: absolute; inset: 0; opacity: .5; background-image: linear-gradient(rgb(236 238 233 / 4%) 1px, transparent 1px), linear-gradient(90deg, rgb(236 238 233 / 4%) 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse at center, black, transparent 75%); }
  .layout { position: relative; display: flex; height: 100%; padding: 56px 64px; gap: 48px; align-items: stretch; }
  .copy { flex: 0 0 410px; display: flex; flex-direction: column; }
  .kind { display: inline-flex; align-self: flex-start; align-items: center; gap: 10px; border: 1px solid rgb(201 139 98 / 40%); border-radius: 999px; padding: 8px 16px; color: #c98b62; font-size: 17px; font-weight: 800; }
  .kind::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #c98b62; }
  h1 { margin-top: 28px; font-size: ${isFa ? 50 : 48}px; line-height: 1.35; font-weight: 800; letter-spacing: ${isFa ? 0 : "-0.02em"}; }
  .service { margin-top: 18px; color: #a6b2bc; font-size: 21px; line-height: 1.7; }
  .foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 24px; border-top: 1px solid rgb(236 238 233 / 12%); }
  .foot img { height: 34px; width: auto; }
  .host { direction: ltr; color: #8dafc5; font-size: 18px; font-weight: 800; font-family: "Segoe UI", Arial, sans-serif; }
  .stage { position: relative; flex: 1; display: flex; align-items: center; }
  .browser { position: relative; width: 100%; margin-bottom: 40px; border: 1px solid rgb(141 175 197 / 28%); border-radius: 18px; background: #1d2935; overflow: hidden; box-shadow: 0 30px 80px rgb(0 0 0 / 45%); }
  .bar { display: flex; gap: 7px; padding: 12px 14px; border-bottom: 1px solid rgb(236 238 233 / 8%); direction: ltr; }
  .bar span { width: 10px; height: 10px; border-radius: 50%; background: rgb(236 238 233 / 22%); }
  /* Full width, never cropped sideways; only very tall captures lose their lower part. */
  .browser img { display: block; width: 100%; height: auto; max-height: 400px; object-fit: cover; object-position: top center; }
  .phone { position: absolute; bottom: -8px; inset-inline-end: -22px; width: 158px; height: 318px; border: 6px solid #0b1016; border-radius: 30px; background: #0b1016; overflow: hidden; box-shadow: 0 24px 60px rgb(0 0 0 / 55%), 0 0 0 1px rgb(141 175 197 / 30%); }
  .phone img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center; border-radius: 24px; }
</style>
</head>
<body>
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="grid"></div>
  <div class="layout">
    <div class="copy">
      <span class="kind">${escape(kind)}</span>
      <h1>${escape(title)}</h1>
      <p class="service">${escape(service)}</p>
      <div class="foot">
        <img src="${logo}" alt="" />
        ${host ? `<span class="host">${escape(host)}</span>` : ""}
      </div>
    </div>
    <div class="stage">
      <div class="browser"><div class="bar"><span></span><span></span><span></span></div><img src="${desktop}" alt="" /></div>
      <div class="phone"><img src="${mobile}" alt="" /></div>
    </div>
  </div>
</body>
</html>`;
}

const entries = [
  ...PROJECTS.map((project) => ({ project, concept: false })),
  ...CONCEPT_PROJECTS.map((project) => ({ project, concept: true })),
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const { project, concept } of entries) {
  const desktop = await dataUrl(`public${project.images[0].src}`, "image/webp");
  // A few hero captures are only a short mobile strip; the full-height phone capture fits the frame better.
  const heroMobile = project.images[2];
  const mobile = heroMobile.width / heroMobile.height > 0.6 && existsSync(resolve(root, `public/projects/${project.slug}-mobile.webp`))
    ? await dataUrl(`public/projects/${project.slug}-mobile.webp`, "image/webp")
    : await dataUrl(`public${heroMobile.src}`, "image/webp");
  for (const locale of ["fa", "en"]) {
    const kind = concept ? (locale === "fa" ? "طرح مفهومی" : "Design concept") : (locale === "fa" ? "نمونه‌کار" : "Case study");
    // Concept titles carry a "· descriptor" or "؛ descriptor" tail; the card shows only the name and keeps the rest as the subtitle.
    const [name, tail] = project.title[locale].split(/\s*[·؛]\s*/);
    const service = tail ?? project.service[locale];
    await page.setContent(cardHtml({ locale, title: name, service, kind, host: concept ? "" : project.host, desktop, mobile }), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const file = resolve(outDir, `${project.slug}-${locale}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 84 });
    console.log(`wrote public/projects/og/${project.slug}-${locale}.jpg`);
  }
}
await browser.close();
