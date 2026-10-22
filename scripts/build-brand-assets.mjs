// Builds the web brand assets from the four owner-supplied logo masters in
// public/brand/source/ (transparent PNGs, trimmed). Re-run after replacing a master:
//   node scripts/build-brand-assets.mjs
//
// Masters (the "light" ones have a white top and are for dark backgrounds):
//   mark-light.png   mark-dark.png   full-light.png   full-dark.png
// Outputs:
//   public/brand/logo-horizontal-{light,dark}.webp   mark + wordmark on one line (header)
//   public/brand/logo-full-{light,dark}.webp         stacked mark over wordmark (footer, large)
//   public/brand/logo-mark-{light,dark}.webp         mark only
//   public/brand/logo-mark-512.png                   transparent mark for schema.org / social
//   src/app/icon.png, src/app/apple-icon.png         favicon and iOS icon on a dark tile

import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(resolve(process.cwd(), "package.json"));
const sharp = require("sharp");

const SRC = resolve(process.cwd(), "public/brand/source");
const OUT = resolve(process.cwd(), "public/brand");
const DARK_TILE = { r: 9, g: 13, b: 18, alpha: 1 }; // #090d12, the site background

const load = (name) => sharp(resolve(SRC, name)).ensureAlpha();

/** Rows of a stacked logo that hold ink; used to split the mark from the wordmark. */
async function inkRows(name) {
  const { data, info } = await load(name).raw().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (let y = 0; y < info.height; y += 1) {
    let ink = 0;
    for (let x = 0; x < info.width; x += 1) if (data[(y * info.width + x) * 4 + 3] > 40) ink += 1;
    rows.push(ink);
  }
  return { rows, width: info.width, height: info.height };
}

async function splitWordmark(name) {
  const { rows, height } = await inkRows(name);
  // The widest empty band in the lower half separates the mark from the wordmark.
  let bestStart = -1;
  let bestLength = 0;
  let runStart = -1;
  for (let y = Math.floor(height * 0.5); y < height; y += 1) {
    if (rows[y] === 0) {
      if (runStart < 0) runStart = y;
      if (y - runStart + 1 > bestLength) {
        bestLength = y - runStart + 1;
        bestStart = runStart;
      }
    } else runStart = -1;
  }
  if (bestLength < 4) throw new Error(`${name}: could not find the gap between mark and wordmark`);
  const cut = bestStart + Math.floor(bestLength / 2);
  const wordmark = await load(name)
    .extract({ left: 0, top: cut, width: (await load(name).metadata()).width, height: height - cut })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();
  return wordmark;
}

async function lockup(tone) {
  const mark = await load(`mark-${tone}.png`).png().toBuffer();
  const wordmark = await splitWordmark(`full-${tone}.png`);
  const markMeta = await sharp(mark).metadata();
  const H = 200;
  const markW = Math.round((markMeta.width / markMeta.height) * H);
  const wordH = Math.round(H * 0.3);
  const wordBuf = await sharp(wordmark).resize({ height: wordH }).png().toBuffer();
  const wordMeta = await sharp(wordBuf).metadata();
  const gap = Math.round(H * 0.17);
  const width = markW + gap + wordMeta.width;
  const markBuf = await sharp(mark).resize({ height: H }).png().toBuffer();
  await sharp({ create: { width, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: markBuf, left: 0, top: 0 },
      { input: wordBuf, left: markW + gap, top: Math.round((H - wordMeta.height) / 2) },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(resolve(OUT, `logo-horizontal-${tone}.webp`));
  console.log(`logo-horizontal-${tone}.webp ${width}x${H}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const tone of ["light", "dark"]) {
    await lockup(tone);
    const full = await load(`full-${tone}.png`).resize({ height: 640 }).webp({ quality: 92, alphaQuality: 100 }).toFile(resolve(OUT, `logo-full-${tone}.webp`));
    console.log(`logo-full-${tone}.webp ${full.width}x${full.height}`);
    const mark = await load(`mark-${tone}.png`).resize({ height: 512 }).webp({ quality: 92, alphaQuality: 100 }).toFile(resolve(OUT, `logo-mark-${tone}.webp`));
    console.log(`logo-mark-${tone}.webp ${mark.width}x${mark.height}`);
  }
  await load("mark-dark.png")
    .resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(resolve(OUT, "logo-mark-512.png"));
  console.log("logo-mark-512.png 512x512");

  // Browser tab / home-screen icon: the white-top mark on the site's dark colour so it shows on any tab bar.
  for (const [file, size] of [["icon.png", 512], ["apple-icon.png", 180]]) {
    const inner = Math.round(size * 0.66);
    const mark = await load("mark-light.png").resize({ width: inner, height: inner, fit: "inside" }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: DARK_TILE } })
      .composite([{ input: mark, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toFile(resolve(process.cwd(), "src/app", file));
    console.log(`src/app/${file} ${size}x${size}`);
  }

  // favicon.ico: a PNG-in-ICO container (supported by every current browser) with 16, 32 and 48 px images.
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((size) => sharp(resolve(process.cwd(), "src/app/icon.png")).resize(size, size).png({ compressionLevel: 9 }).toBuffer())
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map((image, index) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizes[index], 0);
    entry.writeUInt8(sizes[index], 1);
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(resolve(process.cwd(), "src/app/favicon.ico"), Buffer.concat([header, ...entries, ...images]));
  console.log("src/app/favicon.ico 16/32/48");
}

await main();
