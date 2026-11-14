// Small-screen image variants, derived from files that are already in public/.
//
//   public/projects/hero/<slug>-desktop-thumb.webp  ->  <slug>-desktop-thumb-sm.webp   (home work ribbon on phones)
//   public/blog/<name>.jpg                          ->  <name>-card.webp                (article cards on phones)
//
// The components only use a variant when its file exists, so a missing one never breaks a page;
// it just means phones download the larger original. Run after adding a project or an article cover:
//
//   npm run images:thumbs            # create what is missing or older than its source
//   npm run images:thumbs -- --force # rebuild everything
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");

const JOBS = [
  {
    folder: "public/projects/hero",
    match: /-desktop-thumb\.webp$/,
    target: (name) => name.replace(/\.webp$/, "-sm.webp"),
    width: 440,
    quality: 72,
  },
  {
    folder: "public/blog",
    match: /\.jpg$/,
    target: (name) => name.replace(/\.jpg$/, "-card.webp"),
    width: 640,
    quality: 74,
  },
];

async function isFresh(source, target) {
  try {
    const [from, to] = await Promise.all([stat(source), stat(target)]);
    return to.mtimeMs >= from.mtimeMs;
  } catch {
    return false;
  }
}

let built = 0;
let skipped = 0;
for (const job of JOBS) {
  const names = (await readdir(job.folder)).filter((name) => job.match.test(name));
  for (const name of names) {
    const source = path.join(job.folder, name);
    const target = path.join(job.folder, job.target(name));
    if (!force && (await isFresh(source, target))) {
      skipped += 1;
      continue;
    }
    await sharp(source).resize({ width: job.width, withoutEnlargement: true }).webp({ quality: job.quality, effort: 6 }).toFile(target);
    built += 1;
  }
}
console.log(`Thumbnails: ${built} built, ${skipped} already up to date.`);
