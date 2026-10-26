import sharp from "sharp";
import { mkdir, readFile, stat } from "node:fs/promises";

const sourceMapPath = process.argv[2];
if (!sourceMapPath) throw new Error("Pass a JSON map of concept slug to generated PNG path.");
const sourceMap = JSON.parse(await readFile(sourceMapPath, "utf8"));
const manifest = JSON.parse(await readFile("scripts/project-concepts-manifest.json", "utf8"));
await mkdir("public/projects/concepts", { recursive: true });
const results = [];
for (const asset of manifest.assets) {
  const source = sourceMap[asset.slug];
  if (!source) throw new Error(`Missing selected image: ${asset.slug}`);
  const target = `public${asset.file}`;
  await sharp(source).resize(1200, 750, { fit: "cover" }).webp({ quality: 82, effort: 6 }).toFile(target);
  if ((await stat(target)).size > 150_000) {
    await sharp(source).resize(1200, 750, { fit: "cover" }).webp({ quality: 72, effort: 6 }).toFile(target);
  }
  const thumb = target.replace(/\.webp$/, "-thumb.webp");
  await sharp(target).resize(720, 450).webp({ quality: 74, effort: 6 }).toFile(thumb);
  const metadata = await sharp(target).metadata();
  if (metadata.width !== 1200 || metadata.height !== 750) throw new Error(`Invalid dimensions: ${target}`);
  results.push({ slug: asset.slug, language: asset.language, file: target, bytes: (await stat(target)).size, thumbnailBytes: (await stat(thumb)).size });
}
for (const slug of ["tino-electronic", "wallpaper-consortium", "niroo-tejarat-atieh"]) {
  await sharp(`public/projects/${slug}-cover.webp`).resize(720, 450).webp({ quality: 76, effort: 6 }).toFile(`public/projects/${slug}-preview.webp`);
}
console.log(JSON.stringify({ count: results.length, persian: results.filter(a => a.language === "fa").length, english: results.filter(a => a.language === "en").length, assets: results }, null, 2));
