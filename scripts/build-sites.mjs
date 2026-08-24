import { spawnSync } from "node:child_process";
import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
  env: { ...process.env, SITES_STATIC_EXPORT: "1" },
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

const migrationPath = resolve(root, "db", "migrations", "0000_ai_sales.sql");
const migrationSql = await readFile(migrationPath, "utf8");
const schemaStatements = migrationSql
  .split("-- statement-breakpoint")
  .map((statement) => statement.trim())
  .filter(Boolean);
const workerTemplate = await readFile(resolve(root, "worker", "index.js"), "utf8");
const worker = workerTemplate.replace(
  "__SCHEMA_STATEMENTS__",
  JSON.stringify(schemaStatements)
);

await writeFile(resolve(serverDir, "index.js"), worker, "utf8");
await cp(resolve(root, ".openai", "hosting.json"), resolve(openAiDir, "hosting.json"));
await cp(migrationPath, resolve(drizzleDir, "0000_ai_sales.sql"));

console.log(`Sites bundle ready at ${distDir}`);
