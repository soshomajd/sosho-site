// Optimise just the selected November portfolio batch; leave all approved older assets untouched.
// Usage: node scripts/build-portfolio-expansion.mjs <ignored-source-map.json>
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const sourceMap = process.argv[2];
if (!sourceMap) throw new Error("Pass the selected desktop/tablet/mobile ImageGen source map.");
const sources = JSON.parse(await readFile(sourceMap, "utf8"));
const manifestPath = "scripts/portfolio-expansion-20261110-art.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const path = "src/app/components/Projects/hero-views.ts";
const source = await readFile(path, "utf8");
const registry = JSON.parse(source.slice(source.indexOf("= {") + 2).replace(/;\s*$/, ""));
const faDevices = { desktop: "دسکتاپ", tablet: "تبلت", mobile: "موبایل" };
const enDevices = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
const widths = { desktop: 1200, tablet: 820, mobile: 780 };
const assets = [];
for (const project of manifest.projects) {
  registry[project.slug] = [];
  for (const device of ["desktop", "tablet", "mobile"]) {
    const selected = sources[`${project.slug}:${device}`];
    if (!selected?.path) throw new Error(`Missing ${project.slug}:${device}`);
    const image = sharp(selected.path);
    const meta = await image.metadata();
    const width = Math.min(widths[device], meta.width);
    // Preserve the approved composition and its native aspect ratio: never stretch or crop.
    const height = Math.round(meta.height * width / meta.width);
    let bytes;
    let quality = 84;
    do {
      bytes = await sharp(selected.path).resize({ width }).webp({ quality, effort: 6 }).toBuffer();
      if (bytes.length <= 160000 || quality <= 66) break;
      quality -= 3;
    } while (true);
    const src = `/projects/hero/${project.slug}-${device}.webp`;
    await writeFile(`public${src}`, bytes);
    if (device === "desktop") await sharp(selected.path).resize({ width: 720 }).webp({ quality: 78, effort: 6 }).toFile(`public/projects/hero/${project.slug}-desktop-thumb.webp`);
    const view = {
      src, width, height,
      alt: { fa: `نمای هیروی طرح مفهومی ${project.title.fa} در ${faDevices[device]}`, en: `${enDevices[device]} hero of the ${project.title.en} design concept` },
      caption: { fa: `طرح مفهومی · هیرو در ${faDevices[device]}`, en: `Design concept · ${enDevices[device]} hero` },
    };
    registry[project.slug].push(view);
    assets.push({ slug: project.slug, device, ...view, bytes: bytes.length, quality, prompt: selected.prompt, ...(selected.correction ? { correction: selected.correction } : {}), sourceFile: selected.path.split(/[\\/]/).at(-1) });
    console.log(`${src}: ${width}x${height}, ${bytes.length} bytes`);
  }
}
// Preserve existing newline style and the old registry values.
const nl = source.includes("\r\n") ? "\r\n" : "\n";
await writeFile(path, source.slice(0, source.indexOf("= {") + 2) + JSON.stringify(registry, null, 2).replace(/\n/g, nl) + `;${nl}`);
manifest.assets = assets;
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Saved ${assets.length} new hero views plus ${manifest.projects.length} thumbnails.`);
