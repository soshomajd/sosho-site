import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const source = process.argv[2];
if (!source) throw new Error("Pass the selected ImageGen PNG path.");
await mkdir("public/brand", { recursive: true });
const target = "public/brand/soheil-character-3d.webp";
await sharp(source)
  .resize(1000, 1000, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 84, alphaQuality: 95, effort: 6 })
  .toFile(target);
const metadata = await sharp(target).metadata();
if (metadata.width !== 1000 || metadata.height !== 1000 || !metadata.hasAlpha) {
  throw new Error("Character must be a 1000×1000 transparent asset.");
}
console.log(JSON.stringify({ file: target, width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha, bytes: (await stat(target)).size }));
