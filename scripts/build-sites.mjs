import { spawnSync } from "node:child_process";
import { access, cp, mkdir, readdir, rm } from "node:fs/promises";
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
