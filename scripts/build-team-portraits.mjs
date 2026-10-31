import sharp from "sharp";
import { stat } from "node:fs/promises";

const sources = process.argv.slice(2);
if (sources.length !== 2) throw new Error("Pass the selected Claude PNG followed by the selected Codex PNG.");
for (const [index, member] of ["claude", "codex"].entries()) {
  const target = `public/brand/${member}-character-20261029.webp`;
  await sharp(sources[index])
    .resize(1000, 1000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 85, alphaQuality: 95, effort: 6 })
    .toFile(target);
  const metadata = await sharp(target).metadata();
  if (metadata.width !== 1000 || metadata.height !== 1000 || !metadata.hasAlpha) throw new Error(`${member}: expected 1000×1000 with alpha.`);
  console.log(JSON.stringify({ file: target, width: metadata.width, height: metadata.height, alpha: true, bytes: (await stat(target)).size }));
}
