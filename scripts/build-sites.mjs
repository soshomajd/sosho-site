import { spawnSync } from "node:child_process";
import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const nextBin = resolve(root, "node_modules", "next", "dist", "bin", "next");
const exportDir = resolve(root, "out");
const distDir = resolve(root, "dist");
const clientDir = resolve(distDir, "client");
const serverDir = resolve(distDir, "server");
const openAiDir = resolve(distDir, ".openai");
const drizzleDir = resolve(openAiDir, "drizzle");

const build = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  env: {
    ...process.env,
    SITES_STATIC_EXPORT: "1",
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://sosho-studio.net",
  },
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

await access(resolve(exportDir, "index.html"));
await rm(distDir, { recursive: true, force: true });
await mkdir(clientDir, { recursive: true });
await mkdir(serverDir, { recursive: true });
await mkdir(drizzleDir, { recursive: true });
await cp(exportDir, clientDir, { recursive: true });

// The root layout is shared with /admin, so it can only emit lang="fa" dir="rtl".
// Rewrite the English pages in the shipped HTML so crawlers and screen readers
// get the right language before any JavaScript runs (HtmlLangDir keeps them in sync later).
async function localizeEnglishHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      await localizeEnglishHtml(full);
    } else if (entry.name.endsWith(".html")) {
      const html = await readFile(full, "utf8");
      const next = html.replace('<html lang="fa" dir="rtl"', '<html lang="en" dir="ltr"');
      if (next !== html) await writeFile(full, next);
    }
  }
}
await localizeEnglishHtml(resolve(clientDir, "en"));
const englishHome = resolve(clientDir, "en.html");
try {
  await access(englishHome);
  const html = await readFile(englishHome, "utf8");
  await writeFile(englishHome, html.replace('<html lang="fa" dir="rtl"', '<html lang="en" dir="ltr"'));
} catch {
  // en.html is absent only if the export layout changes; the directory pass above still covers en/*.
}
await cp(resolve(root, "worker"), serverDir, { recursive: true });
await access(resolve(serverDir, "index.js"));
await cp(resolve(root, ".openai", "hosting.json"), resolve(openAiDir, "hosting.json"));

const migrationsDir = resolve(root, "db", "migrations");
const migrationFiles = (await readdir(migrationsDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();
if (migrationFiles.length === 0) throw new Error("No D1 migrations found");
for (const migrationFile of migrationFiles) {
  await cp(resolve(migrationsDir, migrationFile), resolve(drizzleDir, migrationFile));
}

console.log(`Sites bundle ready at ${distDir}`);
