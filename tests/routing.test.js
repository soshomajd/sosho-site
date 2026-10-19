import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import worker, { PAGE_SECURITY_HEADERS } from "../worker/index.js";

function globalHeaderRules(text) {
  const rules = {};
  let inGlobalBlock = false;
  for (const line of text.split(/\r?\n/u)) {
    if (/^\S/u.test(line)) {
      inGlobalBlock = line.trim() === "/*";
      continue;
    }
    const match = inGlobalBlock && line.match(/^\s+([A-Za-z-]+):\s*(.+)$/u);
    if (match) rules[match[1].toLowerCase()] = match[2].trim();
  }
  return rules;
}

const NOT_FOUND_HTML = "<!DOCTYPE html><html><body>not found page</body></html>";

// Minimal stand-in for the static-assets binding: a few known pages, a 404 document,
// and 404 for everything else, the way the real asset server answers.
const assets = {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/fa" || pathname === "/fa/blogs") {
      return new Response("<html>page</html>", { status: 200, headers: { "content-type": "text/html" } });
    }
    if (pathname === "/404") {
      return new Response(NOT_FOUND_HTML, { status: 200, headers: { "content-type": "text/html" } });
    }
    return new Response(null, { status: 404 });
  },
};

function get(url, { method = "GET", runtimeEnv = { ...env, ASSETS: assets } } = {}) {
  return worker.fetch(new Request(url, { method, redirect: "manual" }), runtimeEnv, createExecutionContext());
}

describe("canonical page redirects", () => {
  it("sends www to the apex host over https with one 301", async () => {
    const response = await get("https://www.sosho-studio.net/fa/blogs?x=1");
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://sosho-studio.net/fa/blogs?x=1");
  });

  it("upgrades plain http on the apex host", async () => {
    const response = await get("http://sosho-studio.net/fa");
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://sosho-studio.net/fa");
  });

  it("removes trailing slashes and .html with a permanent redirect", async () => {
    const slash = await get("https://sosho-studio.net/fa/blogs/");
    expect(slash.status).toBe(301);
    expect(slash.headers.get("location")).toBe("https://sosho-studio.net/fa/blogs");

    const html = await get("https://sosho-studio.net/fa.html");
    expect(html.status).toBe(301);
    expect(html.headers.get("location")).toBe("https://sosho-studio.net/fa");

    const index = await get("https://sosho-studio.net/fa/index.html");
    expect(index.headers.get("location")).toBe("https://sosho-studio.net/fa");
  });

  it("leaves canonical URLs, other hosts and non-GET requests alone", async () => {
    expect((await get("https://sosho-studio.net/fa")).status).toBe(200);
    expect((await get("https://sosho-site-staging.example.workers.dev/fa")).status).toBe(200);
    const post = await get("https://www.sosho-studio.net/fa", { method: "POST" });
    expect(post.status).not.toBe(301);
  });

  it("never redirects API calls", async () => {
    const response = await get("https://www.sosho-studio.net/api/sales/status");
    expect(response.status).toBe(200);
  });
});

describe("page security headers", () => {
  it("mirror the global block of public/_headers exactly", () => {
    expect(PAGE_SECURITY_HEADERS).toEqual(globalHeaderRules(env.TEST_HEADERS_FILE));
  });

  it("are applied to pages and to the 404 page served by the Worker", async () => {
    for (const url of ["https://sosho-studio.net/fa", "https://sosho-studio.net/fa/missing"]) {
      const response = await get(url);
      for (const [name, value] of Object.entries(PAGE_SECURITY_HEADERS)) {
        expect(response.headers.get(name)).toBe(value);
      }
    }
  });

  it("keeps admin pages out of indexes and caches", async () => {
    const admin = { ...env, ASSETS: { fetch: async () => new Response("<html>admin</html>", { status: 200 }) } };
    const response = await get("https://sosho-studio.net/admin/messages", { runtimeEnv: admin });
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

describe("not found handling", () => {
  it("serves the 404 document with a real 404 status and noindex", async () => {
    const response = await get("https://sosho-studio.net/fa/does-not-exist");
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(await response.text()).toBe(NOT_FOUND_HTML);
  });

  it("does not let the 404 document answer 200 at its own URL", async () => {
    const response = await get("https://sosho-studio.net/404");
    expect(response.status).toBe(404);
  });

  it("keeps a bare 404 for missing files", async () => {
    const response = await get("https://sosho-studio.net/fa/missing.png");
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
  });
});
