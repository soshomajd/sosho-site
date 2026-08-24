import { spawn, spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const nextBin = resolve(root, "node_modules", "next", "dist", "bin", "next");
const wranglerBin = resolve(root, "node_modules", "wrangler", "bin", "wrangler.js");
const workerConfig = resolve(root, "wrangler.dev.jsonc");

const migrate = spawnSync(
  process.execPath,
  [wranglerBin, "d1", "migrations", "apply", "DB", "--local", "--config", workerConfig],
  { cwd: root, env: { ...process.env, CI: "true" }, stdio: "inherit" }
);
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const worker = spawn(
  process.execPath,
  [wranglerBin, "dev", "--config", workerConfig, "--port", "8787"],
  { cwd: root, stdio: "inherit" }
);
const frontend = spawn(process.execPath, [nextBin, "dev"], {
  cwd: root,
  env: { ...process.env, WORKER_DEV_PROXY_URL: "http://127.0.0.1:8787" },
  stdio: "inherit",
});

let shuttingDown = false;
function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  worker.kill();
  frontend.kill();
  process.exitCode = exitCode;
}

worker.on("exit", (code) => shutdown(code ?? 1));
frontend.on("exit", (code) => shutdown(code ?? 1));
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
