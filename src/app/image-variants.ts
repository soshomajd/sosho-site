import { existsSync } from "node:fs";
import path from "node:path";

// Server-only helpers (they read the public/ folder at build time).
// The files are produced by scripts/build-thumbnails.mjs; when one is missing the page simply
// keeps using the original image, so a new project or article never renders a broken picture.

function existing(publicPath: string): string | undefined {
  return existsSync(path.join(process.cwd(), "public", publicPath)) ? publicPath : undefined;
}

/** 440px work-ribbon tile for phones, next to the 720px "<slug>-desktop-thumb.webp". */
export function ribbonSmallThumb(thumb: string): string | undefined {
  return existing(thumb.replace(/\.webp$/, "-sm.webp"));
}

/** 640px WebP of an article cover for cards on phones, next to the 1200px JPEG. */
export function blogCardImage(cover: string): string | undefined {
  return existing(cover.replace(/\.jpg$/, "-card.webp"));
}
