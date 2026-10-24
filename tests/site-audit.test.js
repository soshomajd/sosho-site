import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import worker from "../worker/index.js";
import { analyzeHtml, normalizeAuditUrl, robotsBlocksEverything } from "../worker/site-audit.js";
import { network } from "./network.js";

const GOOD_PAGE = `<!doctype html><html lang="fa"><head>
<title>طراحی سایت حرفه‌ای و سئو برای کسب‌وکار شما</title>
<meta name="description" content="در این صفحه نمونه، خدمات طراحی سایت، سئو و راهکارهای هوش مصنوعی را معرفی می‌کنیم تا انتخاب برایتان ساده‌تر شود.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="https://audit-fixture.com/">
<meta property="og:title" content="Fixture"><meta property="og:image" content="https://audit-fixture.com/og.jpg">
<script type="application/ld+json">{"@context":"https://schema.org"}</script>
</head><body><h1>عنوان اصلی</h1><h2>بخش</h2>
<p>${"کلمه ".repeat(320)}</p>
<img src="/a.jpg" alt="تصویر"><img src="/b.jpg">
</body></html>`;

function htmlResponse(body, init = {}) {
  return new HttpResponse(body, { headers: { "content-type": "text/html; charset=utf-8" }, ...init });
}

function mockSite({ page = GOOD_PAGE, robots = "User-agent: *\nAllow: /\nSitemap: https://audit-fixture.com/sitemap.xml\n", sitemap = true } = {}) {
  network.use(
    http.get("https://audit-fixture.com/", () => htmlResponse(page)),
    http.get("https://audit-fixture.com/robots.txt", () =>
      robots === null ? new HttpResponse("nope", { status: 404 }) : new HttpResponse(robots, { headers: { "content-type": "text/plain" } })
    ),
    http.get("https://audit-fixture.com/sitemap.xml", () =>
      sitemap ? new HttpResponse("<urlset/>", { headers: { "content-type": "application/xml" } }) : new HttpResponse("nope", { status: 404 })
    )
  );
}

let ipCounter = 0;
async function postAudit(body, { origin = "https://example.com", runtimeEnv = env, raw } = {}) {
  ipCounter += 1;
  const headers = { "content-type": "application/json", "cf-connecting-ip": `203.0.113.${ipCounter}` };
  if (origin) headers.origin = origin;
  const ctx = createExecutionContext();
  const response = await worker.fetch(
    new Request("https://example.com/api/tools/audit", { method: "POST", headers, body: raw ?? JSON.stringify(body) }),
    runtimeEnv,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return response;
}

beforeEach(async () => {
  await env.DB.prepare("DELETE FROM rate_limit_counters").run();
});

describe("audit URL validation (SSRF guard)", () => {
  it("accepts public host names, with or without a scheme", () => {
    expect(normalizeAuditUrl("example-shop.com").url.toString()).toBe("https://example-shop.com/");
    expect(normalizeAuditUrl("  http://Sub.Example-Shop.com/path?q=1#frag ").url.toString()).toBe("http://sub.example-shop.com/path?q=1");
    expect(normalizeAuditUrl("https://xn--mgbaam7a8h.com/").ok).toBe(true);
  });

  it("refuses everything that is not a public http(s) host name", () => {
    const refused = [
      "http://localhost", "http://localhost:3000", "localhost:8787", "http://127.0.0.1/", "https://10.0.0.5/admin",
      "http://192.168.1.1", "http://169.254.169.254/latest/meta-data", "http://[::1]/", "http://0x7f000001/", "http://2130706433/",
      "http://intranet", "http://printer.local", "http://api.internal/", "http://service.lan", "http://a.b.test",
      "file:///etc/passwd", "ftp://example-shop.com", "javascript:alert(1)", "https://user:pass@example-shop.com/",
      "https://example-shop.com:8443/", "https://example-shop.com:22/", "https://example-shop.123/", "",
      "x", `https://${"a".repeat(310)}.com`,
    ];
    for (const value of refused) expect(normalizeAuditUrl(value).ok, value).toBe(false);
    expect(normalizeAuditUrl(42).ok).toBe(false);
  });
});

describe("page analysis", () => {
  it("reads title, description, headings, images, schema and word count", async () => {
    const page = await analyzeHtml(GOOD_PAGE);
    expect(page.title).toContain("طراحی سایت");
    expect(page.description.length).toBeGreaterThan(70);
    expect(page).toMatchObject({ lang: "fa", viewport: true, h1: 1, h2: 1, images: 2, imagesMissingAlt: 1, jsonLd: 1, ogTitle: true, ogImage: true });
    expect(page.canonical).toBe("https://audit-fixture.com/");
    expect(page.words).toBeGreaterThan(300);
  });

  it("detects a robots.txt that blocks everything", () => {
    expect(robotsBlocksEverything("User-agent: *\nDisallow: /")).toBe(true);
    expect(robotsBlocksEverything("User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nAllow: /")).toBe(false);
    expect(robotsBlocksEverything("User-agent: *\nDisallow: /admin\nDisallow:")).toBe(false);
    expect(robotsBlocksEverything("# nothing here")).toBe(false);
  });
});

describe("POST /api/tools/audit", () => {
  it("audits a healthy page and returns language-neutral checks", async () => {
    mockSite();
    const response = await postAudit({ url: "audit-fixture.com" });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.url).toBe("https://audit-fixture.com/");
    const byId = Object.fromEntries(body.checks.map((check) => [check.id, check]));
    expect(byId.https.status).toBe("pass");
    expect(byId.title.status).toBe("pass");
    expect(byId.description.status).toBe("pass");
    expect(byId.h1.status).toBe("pass");
    expect(byId.alt).toMatchObject({ status: "warn", value: "1/2" });
    expect(byId.schema.status).toBe("pass");
    expect(byId.robots.status).toBe("pass");
    expect(byId.sitemap.status).toBe("pass");
    expect(body.score).toBeGreaterThan(80);
    expect(body.counts.pass + body.counts.warn + body.counts.fail).toBe(body.checks.filter((c) => c.status !== "info").length);
  });

  it("flags a thin, noindex page with no robots.txt or sitemap", async () => {
    mockSite({
      page: "<html><head><title>x</title><meta name=\"robots\" content=\"noindex, nofollow\"></head><body><p>hi</p></body></html>",
      robots: null,
      sitemap: false,
    });
    const body = await (await postAudit({ url: "https://audit-fixture.com/" })).json();
    const byId = Object.fromEntries(body.checks.map((check) => [check.id, check.status]));
    expect(byId).toMatchObject({ noindex: "fail", h1: "fail", viewport: "fail", words: "fail", robots: "warn", sitemap: "warn", description: "fail" });
    expect(body.score).toBeLessThan(55);
  });

  it("refuses private targets and revalidates redirects", async () => {
    for (const url of ["http://localhost:8787", "http://127.0.0.1", "http://169.254.169.254/", "file:///etc/passwd"]) {
      const response = await postAudit({ url });
      expect(response.status, url).toBe(400);
    }
    network.use(
      http.get("https://audit-fixture.com/", () => new HttpResponse(null, { status: 302, headers: { location: "http://169.254.169.254/latest" } }))
    );
    const response = await postAudit({ url: "https://audit-fixture.com/" });
    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("blocked_host");
  });

  it("follows a normal redirect and reports it", async () => {
    network.use(
      http.get("http://audit-fixture.com/", () => new HttpResponse(null, { status: 301, headers: { location: "https://audit-fixture.com/" } })),
      http.get("https://audit-fixture.com/", () => htmlResponse(GOOD_PAGE)),
      http.get("https://audit-fixture.com/robots.txt", () => new HttpResponse("User-agent: *\nAllow: /", { headers: { "content-type": "text/plain" } })),
      http.get("https://audit-fixture.com/sitemap.xml", () => new HttpResponse("<urlset/>", { headers: { "content-type": "application/xml" } }))
    );
    const body = await (await postAudit({ url: "http://audit-fixture.com/" })).json();
    expect(body.url).toBe("https://audit-fixture.com/");
    expect(body.checks.find((check) => check.id === "redirects")).toMatchObject({ status: "info", value: 1 });
  });

  it("reports an unreachable site and a non-HTML target without leaking details", async () => {
    network.use(http.get("https://audit-fixture.com/", () => HttpResponse.error()));
    const down = await postAudit({ url: "audit-fixture.com" });
    expect(down.status).toBe(502);
    expect((await down.json()).error).toBe("audit_unreachable");

    network.use(http.get("https://audit-fixture.com/", () => new HttpResponse("%PDF-1.7", { headers: { "content-type": "application/pdf" } })));
    const pdf = await postAudit({ url: "audit-fixture.com" });
    expect(pdf.status).toBe(422);
    expect((await pdf.json()).error).toBe("not_html");
  });

  it("checks origin, body shape and per-IP rate limit", async () => {
    expect((await postAudit({ url: "audit-fixture.com" }, { origin: "https://evil.example" })).status).toBe(403);
    // Without an Origin header, only same-origin browser requests pass in production (same rule as /api/contact).
    expect((await postAudit({ url: "audit-fixture.com" }, { origin: "https://evil.example" })).status).toBe(403);
    expect((await postAudit({ url: "audit-fixture.com", extra: 1 })).status).toBe(400);
    expect((await postAudit(null, { raw: "not json" })).status).toBe(400);

    mockSite();
    const limited = { ...env, AUDIT_IP_HOURLY_LIMIT: "1" };
    ipCounter += 1000;
    const headers = { "content-type": "application/json", origin: "https://example.com", "cf-connecting-ip": "198.51.100.200" };
    const send = async () => {
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        new Request("https://example.com/api/tools/audit", { method: "POST", headers, body: JSON.stringify({ url: "audit-fixture.com" }) }),
        limited,
        ctx
      );
      await waitOnExecutionContext(ctx);
      return response.status;
    };
    expect(await send()).toBe(200);
    expect(await send()).toBe(429);
  });
});
