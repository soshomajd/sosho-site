"use client";

import { useId, useMemo, useState } from "react";

import type { Locale } from "@/app/i18n";

import { CodeBlock, ToolPanel, escapeHtml, fieldClass, labelClass } from "./ui";

const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider"] as const;
const MAX_SITEMAP_URLS = 50_000;

const copy = {
  fa: {
    site: "آدرس سایت",
    sitePlaceholder: "https://example.com",
    access: "دسترسی ربات‌های جستجو",
    allowAll: "همه‌چیز باز باشد",
    blockAll: "کل سایت بسته باشد (مثلاً سایت در حال ساخت)",
    paths: "مسیرهایی که نباید بخزند (هر مسیر در یک خط)",
    pathsPlaceholder: "/admin\n/api/\n/cart",
    ai: "ربات‌های آموزش هوش مصنوعی",
    aiInherit: "قانون جداگانه نگذار",
    aiBlock: "مسدود کن (GPTBot، ClaudeBot، Google-Extended و …)",
    aiNote: "ربات‌های جستجو و پاسخ‌گو مثل OAI-SearchBot و PerplexityBot تحت تأثیر این گزینه قرار نمی‌گیرند.",
    robotsOut: "robots.txt",
    urls: "آدرس صفحه‌ها برای sitemap (هر آدرس در یک خط)",
    urlsPlaceholder: "https://example.com/\nhttps://example.com/about\n/blog/first-post",
    lastmod: "تاریخ امروز را به‌عنوان آخرین تغییر بنویس",
    sitemapOut: "sitemap.xml",
    sitemapEmpty: "آدرس‌ها را وارد کنید تا نقشهٔ سایت ساخته شود.",
    skipped: "آدرس نامعتبر نادیده گرفته شد",
    relativeHint: "آدرس‌های نسبی (مثل /about) با آدرس سایت کامل می‌شوند.",
    count: "آدرس در نقشه",
    robotsHeading: "فایل robots.txt",
    sitemapHeading: "فایل sitemap.xml",
  },
  en: {
    site: "Site address",
    sitePlaceholder: "https://example.com",
    access: "Search crawler access",
    allowAll: "Everything open",
    blockAll: "Block the whole site (for example while under construction)",
    paths: "Paths crawlers should skip (one per line)",
    pathsPlaceholder: "/admin\n/api/\n/cart",
    ai: "AI training crawlers",
    aiInherit: "Do not add a separate rule",
    aiBlock: "Block them (GPTBot, ClaudeBot, Google-Extended and more)",
    aiNote: "Search and answer crawlers such as OAI-SearchBot and PerplexityBot are not affected by this option.",
    robotsOut: "robots.txt",
    urls: "Page addresses for the sitemap (one per line)",
    urlsPlaceholder: "https://example.com/\nhttps://example.com/about\n/blog/first-post",
    lastmod: "Write today's date as the last-modified date",
    sitemapOut: "sitemap.xml",
    sitemapEmpty: "Enter addresses to build the sitemap.",
    skipped: "invalid addresses were ignored",
    relativeHint: "Relative addresses (such as /about) are completed with the site address.",
    count: "addresses in the sitemap",
    robotsHeading: "robots.txt file",
    sitemapHeading: "sitemap.xml file",
  },
} as const;

// A real public host name: labels of letters, digits and hyphens with a dot (punycode is fine).
const isPublicHost = (host: string) => /^(?:[a-z0-9-]+\.)+[a-z0-9-]{2,}$/iu.test(host);

function cleanBase(value: string): URL | null {
  const text = value.trim();
  if (!text) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//iu.test(text) ? text : `https://${text}`);
    return (url.protocol === "http:" || url.protocol === "https:") && isPublicHost(url.hostname) ? url : null;
  } catch {
    return null;
  }
}

function cleanPath(line: string) {
  const text = line.trim();
  if (!text) return "";
  return text.startsWith("/") ? text : `/${text}`;
}

export default function RobotsSitemapTool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const baseId = useId();
  const [site, setSite] = useState("");
  const [access, setAccess] = useState<"allow" | "block">("allow");
  const [paths, setPaths] = useState("");
  const [ai, setAi] = useState<"inherit" | "block">("inherit");
  const [urls, setUrls] = useState("");
  const [lastmod, setLastmod] = useState(false);

  const base = cleanBase(site);

  const robots = useMemo(() => {
    const lines = ["User-agent: *"];
    if (access === "block") {
      lines.push("Disallow: /");
    } else {
      lines.push("Allow: /");
      for (const path of paths.split(/\r?\n/u).map(cleanPath).filter(Boolean)) lines.push(`Disallow: ${path}`);
    }
    if (ai === "block") {
      for (const bot of TRAINING_BOTS) lines.push("", `User-agent: ${bot}`, "Disallow: /");
    }
    if (base) lines.push("", `Sitemap: ${base.origin}/sitemap.xml`);
    return lines.join("\n") + "\n";
  }, [access, paths, ai, base]);

  const sitemap = useMemo(() => {
    const entries: string[] = [];
    let skipped = 0;
    const seen = new Set<string>();
    for (const raw of urls.split(/\r?\n/u)) {
      const line = raw.trim();
      if (!line) continue;
      let full: string | null = null;
      try {
        if (/^https?:\/\//iu.test(line)) full = new URL(line).toString();
        else if (base) full = new URL(line.startsWith("/") ? line : `/${line}`, base.origin).toString();
        if (full && !isPublicHost(new URL(full).hostname)) full = null;
      } catch {
        full = null;
      }
      if (!full) {
        skipped += 1;
        continue;
      }
      if (seen.has(full)) continue;
      seen.add(full);
      if (entries.length < MAX_SITEMAP_URLS) entries.push(full);
    }
    const date = new Date().toISOString().slice(0, 10);
    const body = entries
      .map((loc) => `  <url>\n    <loc>${escapeHtml(loc)}</loc>${lastmod ? `\n    <lastmod>${date}</lastmod>` : ""}\n  </url>`)
      .join("\n");
    const xml = entries.length
      ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
      : "";
    return { xml, count: entries.length, skipped };
  }, [urls, base, lastmod]);

  return (
    <ToolPanel>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <h3 className="text-base font-bold text-foreground">{t.robotsHeading}</h3>
          <div>
            <label htmlFor={`${baseId}-site`} className={labelClass}>{t.site}</label>
            <input id={`${baseId}-site`} dir="ltr" inputMode="url" className={`${fieldClass} text-start`} placeholder={t.sitePlaceholder} value={site} onChange={(e) => setSite(e.target.value)} />
          </div>
          <fieldset>
            <legend className={labelClass}>{t.access}</legend>
            <div className="grid gap-2 text-sm text-foreground">
              <label className="flex items-center gap-2">
                <input type="radio" name={`${baseId}-access`} checked={access === "allow"} onChange={() => setAccess("allow")} />
                {t.allowAll}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name={`${baseId}-access`} checked={access === "block"} onChange={() => setAccess("block")} />
                {t.blockAll}
              </label>
            </div>
          </fieldset>
          {access === "allow" ? (
            <div>
              <label htmlFor={`${baseId}-paths`} className={labelClass}>{t.paths}</label>
              <textarea id={`${baseId}-paths`} dir="ltr" rows={4} className={`${fieldClass} resize-y text-start`} placeholder={t.pathsPlaceholder} value={paths} onChange={(e) => setPaths(e.target.value)} />
            </div>
          ) : null}
          <div>
            <label htmlFor={`${baseId}-ai`} className={labelClass}>{t.ai}</label>
            <select id={`${baseId}-ai`} className={fieldClass} value={ai} onChange={(e) => setAi(e.target.value as "inherit" | "block")}>
              <option value="inherit">{t.aiInherit}</option>
              <option value="block">{t.aiBlock}</option>
            </select>
            <p className="mt-1.5 text-xs leading-6 text-muted">{t.aiNote}</p>
          </div>
          <CodeBlock label={t.robotsOut} value={robots} locale={locale} filename="robots.txt" />
        </div>

        <div className="grid content-start gap-4">
          <h3 className="text-base font-bold text-foreground">{t.sitemapHeading}</h3>
          <div>
            <label htmlFor={`${baseId}-urls`} className={labelClass}>{t.urls}</label>
            <textarea id={`${baseId}-urls`} dir="ltr" rows={7} className={`${fieldClass} resize-y text-start`} placeholder={t.urlsPlaceholder} value={urls} onChange={(e) => setUrls(e.target.value)} />
            <p className="mt-1.5 text-xs leading-6 text-muted">{t.relativeHint}</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={lastmod} onChange={(e) => setLastmod(e.target.checked)} />
            {t.lastmod}
          </label>
          <p className="text-xs text-muted" role="status">
            <span dir="ltr">{sitemap.count}</span> {t.count}
            {sitemap.skipped ? ` · ${sitemap.skipped} ${t.skipped}` : ""}
          </p>
          {sitemap.xml ? (
            <CodeBlock label={t.sitemapOut} value={sitemap.xml} locale={locale} filename="sitemap.xml" mime="application/xml" />
          ) : (
            <p className="rounded-2xl border border-dashed border-foreground/15 p-6 text-sm text-muted">{t.sitemapEmpty}</p>
          )}
        </div>
      </div>
    </ToolPanel>
  );
}
