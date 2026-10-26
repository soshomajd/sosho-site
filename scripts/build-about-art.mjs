import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const source = process.argv[2];
if (!source) throw new Error("Pass the selected ImageGen panorama PNG path.");
await mkdir("public/brand", { recursive: true });
const results = [];
for (const [suffix, width, height, quality] of [["", 1800, 720, 82], ["-sm", 900, 360, 78]]) {
  const file = `public/brand/about-studio-panorama-20261026${suffix}.webp`;
  await sharp(source).resize(width, height, { fit: "cover" }).webp({ quality, effort: 6 }).toFile(file);
  const metadata = await sharp(file).metadata();
  if (metadata.width !== width || metadata.height !== height) throw new Error(`Invalid dimensions: ${file}`);
  results.push({ file, width, height, bytes: (await stat(file)).size });
}
console.log(JSON.stringify(results, null, 2));
