"use client";

import { useId, useMemo, useState } from "react";

import type { Locale } from "@/app/i18n";

import { CodeBlock, ToolPanel, escapeHtml, fieldClass, labelClass } from "./ui";

const copy = {
  fa: {
    title: "عنوان صفحه",
    description: "توضیحات صفحه (meta description)",
    url: "آدرس کامل صفحه",
    siteName: "نام سایت یا برند",
    image: "آدرس تصویر اشتراک‌گذاری (اختیاری)",
    lang: "زبان محتوا",
    langFa: "فارسی",
    langEn: "انگلیسی",
    langNone: "نامشخص",
    chars: "نویسه",
    good: "طول مناسب",
    short: "کوتاه‌تر از حد توصیه‌شده",
    long: "ممکن است در گوگل بریده شود",
    preview: "پیش‌نمایش نتیجه گوگل",
    output: "کد HTML برای قرار دادن در head",
    emptyTitle: "عنوان صفحهٔ شما اینجا نمایش داده می‌شود",
    emptyDescription: "توضیحات صفحهٔ شما اینجا نمایش داده می‌شود. آن را کوتاه و جذاب بنویسید.",
    placeholderUrl: "https://example.com/page",
    fill: "<!-- عنوان و توضیحات را بنویسید -->",
  },
  en: {
    title: "Page title",
    description: "Page description (meta description)",
    url: "Full page address",
    siteName: "Site or brand name",
    image: "Share image address (optional)",
    lang: "Content language",
    langFa: "Persian",
    langEn: "English",
    langNone: "Not set",
    chars: "characters",
    good: "Good length",
    short: "Shorter than recommended",
    long: "May be cut off in Google",
    preview: "Google result preview",
    output: "HTML to place inside the head",
    emptyTitle: "Your page title appears here",
    emptyDescription: "Your page description appears here. Keep it short and compelling.",
    placeholderUrl: "https://example.com/page",
    fill: "<!-- Write a title and description -->",
  },
} as const;

const length = (value: string) => [...value.trim()].length;

function Counter({ value, min, max, locale, id }: { value: string; min: number; max: number; locale: Locale; id: string }) {
  const t = copy[locale];
  const size = length(value);
  const state = size === 0 ? "idle" : size < min ? "short" : size > max ? "long" : "good";
  const color = state === "good" ? "text-success" : state === "idle" ? "text-muted" : "text-warning";
  const message = state === "good" ? t.good : state === "short" ? t.short : state === "long" ? t.long : "";
  return (
    <p id={id} className={`mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs ${color}`}>
      <span>{message}</span>
      <span dir="ltr">
        {size} / {max} {t.chars}
      </span>
    </p>
  );
}

export default function MetaTagTool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const baseId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [image, setImage] = useState("");
  const [lang, setLang] = useState<"fa" | "en" | "">(locale);

  const code = useMemo(() => {
    const clean = (value: string) => escapeHtml(value.replace(/\s+/gu, " ").trim());
    const lines: string[] = [];
    const titleText = clean(title);
    const descText = clean(description);
    const urlText = clean(url);
    const imageText = clean(image);
    const siteText = clean(siteName);
    if (!titleText && !descText) return t.fill;
    if (titleText) lines.push(`<title>${titleText}</title>`);
    if (descText) lines.push(`<meta name="description" content="${descText}">`);
    if (urlText) lines.push(`<link rel="canonical" href="${urlText}">`);
    lines.push(`<meta property="og:type" content="website">`);
    if (titleText) lines.push(`<meta property="og:title" content="${titleText}">`);
    if (descText) lines.push(`<meta property="og:description" content="${descText}">`);
    if (urlText) lines.push(`<meta property="og:url" content="${urlText}">`);
    if (siteText) lines.push(`<meta property="og:site_name" content="${siteText}">`);
    if (lang) lines.push(`<meta property="og:locale" content="${lang === "fa" ? "fa_IR" : "en_US"}">`);
    if (imageText) lines.push(`<meta property="og:image" content="${imageText}">`);
    lines.push(`<meta name="twitter:card" content="${imageText ? "summary_large_image" : "summary"}">`);
    if (titleText) lines.push(`<meta name="twitter:title" content="${titleText}">`);
    if (descText) lines.push(`<meta name="twitter:description" content="${descText}">`);
    if (imageText) lines.push(`<meta name="twitter:image" content="${imageText}">`);
    return lines.join("\n");
  }, [title, description, url, siteName, image, lang, t.fill]);

  const shownTitle = title.trim() ? [...title.trim()].slice(0, 60).join("") + (length(title) > 60 ? "…" : "") : t.emptyTitle;
  const shownDescription = description.trim()
    ? [...description.trim()].slice(0, 160).join("") + (length(description) > 160 ? "…" : "")
    : t.emptyDescription;
  let host = "example.com";
  try {
    if (url.trim()) host = new URL(url.trim()).host || host;
  } catch {
    // Keep the placeholder host while the address is incomplete.
  }

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <div>
            <label htmlFor={`${baseId}-title`} className={labelClass}>{t.title}</label>
            <input id={`${baseId}-title`} className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} aria-describedby={`${baseId}-title-count`} />
            <Counter id={`${baseId}-title-count`} value={title} min={20} max={60} locale={locale} />
          </div>
          <div>
            <label htmlFor={`${baseId}-desc`} className={labelClass}>{t.description}</label>
            <textarea id={`${baseId}-desc`} rows={4} className={`${fieldClass} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} aria-describedby={`${baseId}-desc-count`} />
            <Counter id={`${baseId}-desc-count`} value={description} min={70} max={160} locale={locale} />
          </div>
          <div>
            <label htmlFor={`${baseId}-url`} className={labelClass}>{t.url}</label>
            <input id={`${baseId}-url`} dir="ltr" inputMode="url" className={`${fieldClass} text-start`} placeholder={t.placeholderUrl} value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${baseId}-site`} className={labelClass}>{t.siteName}</label>
              <input id={`${baseId}-site`} className={fieldClass} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div>
              <label htmlFor={`${baseId}-lang`} className={labelClass}>{t.lang}</label>
              <select id={`${baseId}-lang`} className={fieldClass} value={lang} onChange={(e) => setLang(e.target.value as "fa" | "en" | "")}>
                <option value="fa">{t.langFa}</option>
                <option value="en">{t.langEn}</option>
                <option value="">{t.langNone}</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${baseId}-image`} className={labelClass}>{t.image}</label>
            <input id={`${baseId}-image`} dir="ltr" inputMode="url" className={`${fieldClass} text-start`} placeholder="https://example.com/og.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
        </div>

        <div className="grid content-start gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">{t.preview}</p>
            <div className="rounded-2xl border border-foreground/10 bg-white p-4 text-start" dir={lang === "fa" ? "rtl" : lang === "en" ? "ltr" : "auto"}>
              <p dir="ltr" className="truncate text-start text-xs text-slate-600">{host}</p>
              <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{shownTitle}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{shownDescription}</p>
            </div>
          </div>
          <CodeBlock label={t.output} value={code} locale={locale} filename="meta-tags.html" mime="text/html" />
        </div>
      </div>
    </ToolPanel>
  );
}
