// Notifies IndexNow search engines (Bing, Yandex, Seznam, Naver...) about the
// site's URLs after a deploy. The key file lives in public/<key>.txt and is
// served at the site root, which proves ownership of the host.
//
// Usage (after `npm run deploy`):
//   node scripts/indexnow.mjs                 # every URL in the live sitemap
//   node scripts/indexnow.mjs https://sosho-studio.net/fa/blogs/some-post ...

import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sosho-studio.net";
const host = new URL(SITE).host;

async function findKey() {
  const publicDir = resolve(process.cwd(), "public");
  for (const name of await readdir(publicDir)) {
    if (/^[0-9a-f]{32}\.txt$/u.test(name)) {
      const key = (await readFile(resolve(publicDir, name), "utf8")).trim();
      if (`${key}.txt` === name) return key;
    }
  }
  throw new Error("No IndexNow key file (public/<32 hex>.txt containing the same key) found");
}

async function sitemapUrls() {
  const response = await fetch(`${SITE}/sitemap.xml`);
  if (!response.ok) throw new Error(`Sitemap request failed: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1].trim());
}

const key = await findKey();
const urls = process.argv.length > 2 ? process.argv.slice(2) : await sitemapUrls();
const urlList = [...new Set(urls)].filter((url) => new URL(url).host === host);
if (urlList.length === 0) throw new Error("No URLs to submit");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${SITE}/${key}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted and key validation pending.
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${response.status}`);
if (response.status >= 400) {
  console.error(await response.text());
  process.exit(1);
}
