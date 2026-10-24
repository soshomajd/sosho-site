import { ServiceError } from "./core.js";

// Free website audit: fetches one public page (plus its robots.txt and sitemap) and returns
// language-neutral checks (`id`, `status`, `value`) that the website translates. Nothing here
// stores the page or the visitor's URL.
//
// SSRF guard: only public http(s) host *names* on ports 80/443 are fetched. IP literals,
// localhost and internal suffixes are refused, every redirect hop is re-validated, and the
// body, time and redirect count are capped.

const MAX_URL_LENGTH = 300;
const MAX_HTML_BYTES = 1_000_000;
const MAX_SMALL_BYTES = 150_000;
const FETCH_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 4;
const USER_AGENT = "SoshoSiteAudit/1.0 (+https://sosho-studio.net/en/tools/website-seo-audit)";

const BLOCKED_SUFFIXES = [
  ".localhost", ".local", ".internal", ".lan", ".home", ".corp", ".intranet",
  ".private", ".test", ".invalid", ".example", ".arpa", ".onion",
];

/** Validates a URL the visitor typed. Adds https:// when no scheme was given. */
export function normalizeAuditUrl(input, { allowBareHost = true } = {}) {
  if (typeof input !== "string") return { ok: false, code: "invalid_url" };
  let text = input.trim();
  if (text.length < 4 || text.length > MAX_URL_LENGTH) return { ok: false, code: "invalid_url" };
  if (allowBareHost && !/^[a-z][a-z0-9+.-]*:\/\//iu.test(text)) {
    if (/^[a-z][a-z0-9+.-]*:/iu.test(text) && !/^[^/]*\.[^/]*:\d/u.test(text)) {
      return { ok: false, code: "invalid_url" };
    }
    text = `https://${text}`;
  }
  let url;
  try {
    url = new URL(text);
  } catch {
    return { ok: false, code: "invalid_url" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return { ok: false, code: "invalid_url" };
  if (url.username || url.password) return { ok: false, code: "invalid_url" };
  if (url.port && url.port !== "80" && url.port !== "443") return { ok: false, code: "blocked_host" };
  const host = url.hostname.toLowerCase().replace(/\.$/u, "");
  if (!host || host.startsWith("[") || host.includes(":")) return { ok: false, code: "blocked_host" };
  if (!host.includes(".")) return { ok: false, code: "blocked_host" };
  if (/^[\d.]+$/u.test(host) || /^0x[0-9a-f.]+$/iu.test(host)) return { ok: false, code: "blocked_host" };
  const tld = host.split(".").at(-1);
  if (!/^(?:[a-z]{2,24}|xn--[a-z0-9-]{2,40})$/u.test(tld)) return { ok: false, code: "blocked_host" };
  if (host === "localhost" || BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return { ok: false, code: "blocked_host" };
  }
  url.hash = "";
  return { ok: true, url };
}

async function readLimited(response, maxBytes) {
  if (!response.body) return { text: "", bytes: 0, truncated: false };
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      chunks.push(value.subarray(0, value.byteLength - (bytes - maxBytes)));
      truncated = true;
      await reader.cancel().catch(() => undefined);
      break;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { text: new TextDecoder("utf-8", { fatal: false }).decode(merged), bytes: Math.min(bytes, maxBytes), truncated };
}

/** GET with manual redirects; every hop goes through the same host validation. */
async function safeGet(startUrl, fetchImpl, { maxBytes, accept }) {
  let current = startUrl;
  const chain = [];
  const startedAt = Date.now();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    let response;
    try {
      response = await fetchImpl(current.toString(), {
        method: "GET",
        redirect: "manual",
        headers: { "user-agent": USER_AGENT, accept },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch {
      throw new ServiceError("audit_unreachable", { status: 502 });
    }
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      chain.push({ url: current.toString(), status: response.status });
      await response.body?.cancel().catch(() => undefined);
      let next;
      try {
        next = new URL(response.headers.get("location"), current);
      } catch {
        throw new ServiceError("audit_unreachable", { status: 502 });
      }
      const checked = normalizeAuditUrl(next.toString(), { allowBareHost: false });
      if (!checked.ok) throw new ServiceError("blocked_host", { status: 400 });
      current = checked.url;
      continue;
    }
    const headersTimeMs = Date.now() - startedAt;
    const body = await readLimited(response, maxBytes);
    return { response, finalUrl: current, chain, headersTimeMs, ...body };
  }
  throw new ServiceError("too_many_redirects", { status: 502 });
}

const words = (text) => text.trim().split(/\s+/u).filter(Boolean).length;
const clip = (value, max = 200) => (typeof value === "string" ? value.replace(/\s+/gu, " ").trim().slice(0, max) : "");

/** Reads the SEO-relevant parts of an HTML document. */
export async function analyzeHtml(html) {
  const page = {
    title: "",
    description: "",
    robotsMeta: "",
    viewport: false,
    canonical: "",
    lang: "",
    ogTitle: false,
    ogImage: false,
    twitterCard: false,
    h1: 0,
    h2: 0,
    images: 0,
    imagesMissingAlt: 0,
    jsonLd: 0,
    hreflang: 0,
    words: 0,
  };
  let titleOpen = false;
  const rewriter = new HTMLRewriter()
    .on("html", { element(el) { page.lang = clip(el.getAttribute("lang") ?? "", 20); } })
    .on("title", {
      element() { titleOpen = !page.title; },
      text(chunk) { if (titleOpen) page.title += chunk.text; if (chunk.lastInTextNode) titleOpen = false; },
    })
    .on("meta", {
      element(el) {
        const name = (el.getAttribute("name") ?? "").toLowerCase();
        const property = (el.getAttribute("property") ?? "").toLowerCase();
        const content = el.getAttribute("content") ?? "";
        if (name === "description" && !page.description) page.description = content;
        if (name === "robots" || name === "googlebot") page.robotsMeta += ` ${content}`;
        if (name === "viewport" && content.trim()) page.viewport = true;
        if (name === "twitter:card" && content.trim()) page.twitterCard = true;
        if (property === "og:title" && content.trim()) page.ogTitle = true;
        if (property === "og:image" && content.trim()) page.ogImage = true;
      },
    })
    .on("link", {
      element(el) {
        const rel = (el.getAttribute("rel") ?? "").toLowerCase();
        if (rel.split(/\s+/u).includes("canonical") && !page.canonical) page.canonical = el.getAttribute("href") ?? "";
        if (rel === "alternate" && el.getAttribute("hreflang")) page.hreflang += 1;
      },
    })
    .on("h1", { element() { page.h1 += 1; } })
    .on("h2", { element() { page.h2 += 1; } })
    .on("img", {
      element(el) {
        page.images += 1;
        if (el.getAttribute("alt") === null) page.imagesMissingAlt += 1;
      },
    })
    .on('script[type="application/ld+json"]', { element() { page.jsonLd += 1; } })
    .on("h1, h2, h3, h4, p, li, td, blockquote, figcaption", {
      text(chunk) { page.words += words(chunk.text); },
    });
  await rewriter.transform(new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } })).arrayBuffer();
  page.title = clip(page.title);
  page.description = clip(page.description, 320);
  page.canonical = clip(page.canonical, 300);
  return page;
}

/** True when the robots.txt group for "*" disallows the whole site. */
export function robotsBlocksEverything(text) {
  let applies = false;
  let seenRule = false;
  for (const raw of text.split(/\r?\n/u)) {
    const line = raw.replace(/#.*/u, "").trim();
    const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/iu);
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2].trim();
    if (field === "user-agent") {
      if (seenRule) applies = false;
      seenRule = false;
      if (value === "*") applies = true;
    } else if (applies && (field === "disallow" || field === "allow")) {
      seenRule = true;
      if (field === "disallow" && value === "/") return true;
    }
  }
  return false;
}

const level = (condition, ifFalse = "warn") => (condition ? "pass" : ifFalse);

/** Turns the fetched facts into the ordered list of checks and an overall score. */
export function buildAudit({ finalUrl, chain, status, timeMs, bytes, truncated, headers, page, robots, sitemap }) {
  const checks = [];
  const add = (id, state, value) => checks.push(value === undefined ? { id, status: state } : { id, status: state, value });

  const isHttps = finalUrl.protocol === "https:";
  add("https", level(isHttps, "fail"));
  add("status", level(status >= 200 && status < 300, "fail"), status);
  if (chain.length > 0) add("redirects", chain.length > 2 ? "warn" : "info", chain.length);
  add("speed", timeMs < 800 ? "pass" : timeMs < 1800 ? "warn" : "fail", Math.round(timeMs));
  const kb = Math.round(bytes / 1024);
  add("size", kb <= 200 ? "pass" : kb <= 500 ? "warn" : "fail", truncated ? `${kb}+` : kb);
  add("compression", level(Boolean(headers.get("content-encoding"))));

  const titleLength = [...page.title].length;
  add("title", !page.title ? "fail" : titleLength >= 20 && titleLength <= 60 ? "pass" : "warn", page.title ? `${page.title} (${titleLength})` : undefined);
  const descLength = [...page.description].length;
  add("description", !page.description ? "fail" : descLength >= 70 && descLength <= 160 ? "pass" : "warn", page.description ? `${descLength}` : undefined);
  add("h1", page.h1 === 1 ? "pass" : page.h1 === 0 ? "fail" : "warn", page.h1);
  add("headings", level(page.h2 >= 1), page.h2);
  add("canonical", level(Boolean(page.canonical)));
  add("lang", level(Boolean(page.lang)), page.lang || undefined);
  add("viewport", level(page.viewport, "fail"));
  add("social", level(page.ogTitle && page.ogImage));
  if (page.images === 0) add("alt", "info", "0/0");
  else add("alt", page.imagesMissingAlt === 0 ? "pass" : "warn", `${page.imagesMissingAlt}/${page.images}`);
  add("schema", level(page.jsonLd >= 1), page.jsonLd);
  const noindex = /noindex/iu.test(page.robotsMeta) || /noindex/iu.test(headers.get("x-robots-tag") ?? "");
  add("noindex", noindex ? "fail" : "pass");
  add("words", page.words >= 300 ? "pass" : page.words >= 120 ? "warn" : "fail", page.words);

  if (robots.found && robots.blocksAll) add("robots", "fail");
  else add("robots", level(robots.found));
  add("sitemap", level(sitemap.found));

  const scored = checks.filter((check) => check.status !== "info");
  const points = scored.reduce((sum, check) => sum + (check.status === "pass" ? 1 : check.status === "warn" ? 0.5 : 0), 0);
  const score = Math.round((points / scored.length) * 100);
  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const check of scored) counts[check.status] += 1;
  return { url: finalUrl.toString(), score, counts, checks };
}

/** Runs the whole audit for an already validated URL. */
export async function auditSite(startUrl, fetchImpl = fetch) {
  const main = await safeGet(startUrl, fetchImpl, { maxBytes: MAX_HTML_BYTES, accept: "text/html,application/xhtml+xml" });
  const contentType = main.response.headers.get("content-type") ?? "";
  if (main.response.status < 400 && contentType && !/html|xml/iu.test(contentType)) {
    throw new ServiceError("not_html", { status: 422 });
  }
  const origin = main.finalUrl.origin;
  const probe = async (path) => {
    try {
      const checked = normalizeAuditUrl(`${origin}${path}`, { allowBareHost: false });
      if (!checked.ok) return { found: false, text: "" };
      const result = await safeGet(checked.url, fetchImpl, { maxBytes: MAX_SMALL_BYTES, accept: "text/plain,application/xml,*/*" });
      const looksLikeHtml = /<html[\s>]/iu.test(result.text.slice(0, 500));
      return { found: result.response.status === 200 && !looksLikeHtml, text: result.text };
    } catch {
      return { found: false, text: "" };
    }
  };
  const [robotsResult, sitemapResult] = await Promise.all([probe("/robots.txt"), probe("/sitemap.xml")]);
  const robots = { found: robotsResult.found, blocksAll: robotsResult.found && robotsBlocksEverything(robotsResult.text) };
  const sitemapDeclared = robotsResult.found && /^\s*sitemap\s*:\s*\S+/imu.test(robotsResult.text);
  const page = await analyzeHtml(main.text);
  return buildAudit({
    finalUrl: main.finalUrl,
    chain: main.chain,
    status: main.response.status,
    timeMs: main.headersTimeMs,
    bytes: main.bytes,
    truncated: main.truncated,
    headers: main.response.headers,
    page,
    robots,
    sitemap: { found: sitemapResult.found || sitemapDeclared },
  });
}
