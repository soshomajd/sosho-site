import { spawnSync } from "node:child_process";
import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const nextBin = resolve(root, "node_modules", "next", "dist", "bin", "next");
const exportDir = resolve(root, "out");
const distDir = resolve(root, "dist");
const clientDir = resolve(distDir, "client");
const serverDir = resolve(distDir, "server");

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
await cp(exportDir, clientDir, { recursive: true });

const worker = `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(new URL("/fa", url), 308);
    }

    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const candidates = url.pathname.endsWith("/")
      ? [url.pathname + "index.html"]
      : [url.pathname + ".html", url.pathname + "/index.html"];

    for (const pathname of candidates) {
      const candidateUrl = new URL(url);
      candidateUrl.pathname = pathname;
      response = await env.ASSETS.fetch(new Request(candidateUrl, request));
      if (response.status !== 404) return response;
    }

    const firstSegment = url.pathname.split("/").filter(Boolean)[0];
    if (firstSegment !== "fa" && firstSegment !== "en" && !url.pathname.includes(".")) {
      const localized = new URL(url);
      localized.pathname = "/fa" + url.pathname;
      return Response.redirect(localized, 308);
    }

    return response;
  },
};

export default worker;
`;

await writeFile(resolve(serverDir, "index.js"), worker, "utf8");

console.log(`Sites bundle ready at ${distDir}`);
