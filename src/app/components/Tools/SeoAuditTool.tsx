"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiSearch, FiXCircle } from "react-icons/fi";

import ContactForm from "@/app/components/ContactForm";
import type { Locale } from "@/app/i18n";

import { AUDIT_COPY, AUDIT_ERRORS, type AuditCheckId } from "./audit-copy";
import { ToolPanel, buttonClass, fieldClass, labelClass } from "./ui";

type CheckState = "pass" | "warn" | "fail" | "info";
type AuditCheck = { id: AuditCheckId; status: CheckState; value?: string | number };
type AuditResult = {
  url: string;
  score: number;
  counts: { pass: number; warn: number; fail: number };
  checks: AuditCheck[];
};

const copy = {
  fa: {
    label: "آدرس سایت یا صفحه",
    placeholder: "example.com",
    run: "بررسی کن",
    running: "در حال بررسی…",
    again: "بررسی سایت دیگر",
    score: "امتیاز سلامت سایت",
    of: "از ۱۰۰",
    fail: "مشکل مهم",
    warn: "قابل بهبود",
    pass: "سالم",
    checked: "صفحهٔ بررسی‌شده",
    fixFirst: "اول این‌ها را اصلاح کنید",
    improve: "بعد این‌ها را بهتر کنید",
    healthy: "مواردی که درست است",
    info: "اطلاعات",
    noIssues: "مشکل مهمی پیدا نشد. آفرین!",
    limits: "این بررسی فقط سئوی پایه و سلامت فنی یک صفحه را می‌سنجد؛ رتبه، کیفیت محتوا و لینک‌ها را نشان نمی‌دهد.",
    leadHeading: "می‌خواهید این مشکل‌ها را ما برطرف کنیم؟",
    leadIntro: "نام و راه تماس‌تان را بفرستید؛ نتیجهٔ این بررسی همراه پیام برای ما ثبت می‌شود و راه‌حل را با شما در میان می‌گذاریم.",
    leadMessage: (url: string, score: number, issues: string) =>
      `درخواست اصلاح سایت پس از بررسی رایگان سئو\nآدرس: ${url}\nامتیاز: ${score} از ۱۰۰${issues ? `\nمشکل‌های مهم: ${issues}` : ""}\n\nلطفاً با من تماس بگیرید.`,
    chars: "نویسه",
    withoutAlt: "تصویر بدون alt",
    of2: "از",
    ms: "میلی‌ثانیه",
    kb: "کیلوبایت",
    words: "کلمه",
  },
  en: {
    label: "Website or page address",
    placeholder: "example.com",
    run: "Check it",
    running: "Checking…",
    again: "Check another site",
    score: "Site health score",
    of: "out of 100",
    fail: "Important issues",
    warn: "To improve",
    pass: "Healthy",
    checked: "Page checked",
    fixFirst: "Fix these first",
    improve: "Then improve these",
    healthy: "What is already right",
    info: "Info",
    noIssues: "No important issues found. Well done!",
    limits: "This check measures the basic SEO and technical health of one page only; it does not show rankings, content quality or links.",
    leadHeading: "Want us to fix these issues for you?",
    leadIntro: "Send your name and a way to reach you; the result of this check is attached to the message and we will go through the fix with you.",
    leadMessage: (url: string, score: number, issues: string) =>
      `Request to fix a site after the free SEO check\nAddress: ${url}\nScore: ${score} out of 100${issues ? `\nImportant issues: ${issues}` : ""}\n\nPlease get in touch.`,
    chars: "characters",
    withoutAlt: "images without alt",
    of2: "of",
    ms: "ms",
    kb: "KB",
    words: "words",
  },
} as const;

const STATE_STYLE: Record<CheckState, { color: string; Icon: typeof FiCheckCircle }> = {
  pass: { color: "text-emerald-400", Icon: FiCheckCircle },
  warn: { color: "text-amber-400", Icon: FiAlertTriangle },
  fail: { color: "text-red-400", Icon: FiXCircle },
  info: { color: "text-sky-400", Icon: FiInfo },
};

function formatValue(check: AuditCheck, locale: Locale): string {
  const t = copy[locale];
  const { id, value } = check;
  if (value === undefined) return "";
  switch (id) {
    case "speed":
      return `${value} ${t.ms}`;
    case "size":
      return `${value} ${t.kb}`;
    case "words":
      return `${value} ${t.words}`;
    case "description":
      return `${value} ${t.chars}`;
    case "alt": {
      const [missing, total] = String(value).split("/");
      return `${missing} ${t.of2} ${total} ${t.withoutAlt}`;
    }
    default:
      return String(value);
  }
}

function scoreColor(score: number) {
  return score >= 80 ? "text-emerald-400" : score >= 55 ? "text-amber-400" : "text-red-400";
}

function ScoreRing({ score, locale }: { score: number; locale: Locale }) {
  const t = copy[locale];
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label={`${t.score}: ${score} ${t.of}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-foreground/10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(circumference * score) / 100} ${circumference}`}
          className={`${scoreColor(score)} stroke-current`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p dir="ltr" className={`text-4xl font-extrabold ${scoreColor(score)}`}>{score}</p>
          <p className="text-[11px] text-muted">{t.of}</p>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ check, locale, withFix }: { check: AuditCheck; locale: Locale; withFix: boolean }) {
  const { color, Icon } = STATE_STYLE[check.status];
  const entry = AUDIT_COPY[check.id];
  if (!entry) return null;
  const value = formatValue(check, locale);
  return (
    <li className="rounded-2xl border border-foreground/10 bg-background/20 p-4">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{entry.label[locale]}</p>
          {value ? (
            <p dir="auto" className="mt-1 break-words text-xs text-muted">{value}</p>
          ) : null}
          {withFix ? <p className="mt-2 text-sm leading-7 text-muted">{entry.fix[locale]}</p> : null}
        </div>
      </div>
    </li>
  );
}

export default function SeoAuditTool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const baseId = useId();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (status === "done") resultRef.current?.focus();
  }, [status]);

  async function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const value = url.trim();
    if (!value) {
      setStatus("error");
      setError(AUDIT_ERRORS.invalid_url[locale]);
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/tools/audit", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ url: value }),
        signal: controller.signal,
      });
      const body = (await response.json().catch(() => ({}))) as Partial<AuditResult> & { error?: string };
      if (response.ok && Array.isArray(body.checks) && typeof body.score === "number") {
        setResult(body as AuditResult);
        setStatus("done");
        return;
      }
      const known = body.error && AUDIT_ERRORS[body.error] ? body.error : response.status === 429 ? "rate_limited" : "generic";
      setError(AUDIT_ERRORS[known][locale]);
      setStatus("error");
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return;
      setError(AUDIT_ERRORS.network[locale]);
      setStatus("error");
    }
  }

  const failing = result?.checks.filter((check) => check.status === "fail") ?? [];
  const warning = result?.checks.filter((check) => check.status === "warn") ?? [];
  const passing = result?.checks.filter((check) => check.status === "pass") ?? [];
  const infos = result?.checks.filter((check) => check.status === "info") ?? [];

  return (
    <div className="grid gap-6">
      <ToolPanel>
        <form onSubmit={run} noValidate className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor={`${baseId}-url`} className={labelClass}>{t.label}</label>
            <input
              id={`${baseId}-url`}
              dir="ltr"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              className={`${fieldClass} text-start`}
              placeholder={t.placeholder}
              value={url}
              maxLength={300}
              onChange={(event) => setUrl(event.target.value)}
              aria-invalid={status === "error" ? true : undefined}
              aria-describedby={status === "error" ? `${baseId}-error` : undefined}
            />
          </div>
          <button type="submit" className={`${buttonClass} h-12`} disabled={status === "loading"}>
            <FiSearch className="h-4 w-4" aria-hidden="true" />
            {status === "loading" ? t.running : t.run}
          </button>
        </form>
        {status === "error" && error ? (
          <p id={`${baseId}-error`} role="alert" className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <p className="mt-4 text-xs leading-6 text-muted">{t.limits}</p>
      </ToolPanel>

      {status === "done" && result ? (
        <div ref={resultRef} tabIndex={-1} className="grid gap-6 outline-none" aria-live="polite">
          <ToolPanel>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <ScoreRing score={result.score} locale={locale} />
              <div className="min-w-0 flex-1 text-center sm:text-start">
                <h2 className="text-xl font-extrabold text-foreground">{t.score}</h2>
                <p className="mt-2 break-all text-xs text-muted">
                  {t.checked}: <span dir="ltr" className="text-foreground/80">{result.url}</span>
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold sm:justify-start">
                  <li className="rounded-full border border-red-400/30 px-3 py-1.5 text-red-300">{t.fail}: <span dir="ltr">{result.counts.fail}</span></li>
                  <li className="rounded-full border border-amber-400/30 px-3 py-1.5 text-amber-300">{t.warn}: <span dir="ltr">{result.counts.warn}</span></li>
                  <li className="rounded-full border border-emerald-400/30 px-3 py-1.5 text-emerald-300">{t.pass}: <span dir="ltr">{result.counts.pass}</span></li>
                </ul>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-foreground/15 px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  setUrl("");
                }}
              >
                {t.again}
              </button>
            </div>
          </ToolPanel>

          {failing.length === 0 && warning.length === 0 ? (
            <p className="rounded-2xl border border-emerald-400/30 bg-emerald-950/10 px-5 py-4 text-sm font-bold text-emerald-300">{t.noIssues}</p>
          ) : null}

          {failing.length > 0 ? (
            <section aria-labelledby={`${baseId}-fail`}>
              <h3 id={`${baseId}-fail`} className="mb-3 text-lg font-bold text-foreground">{t.fixFirst}</h3>
              <ul className="grid gap-3 md:grid-cols-2">
                {failing.map((check) => <CheckRow key={check.id} check={check} locale={locale} withFix />)}
              </ul>
            </section>
          ) : null}

          {warning.length > 0 ? (
            <section aria-labelledby={`${baseId}-warn`}>
              <h3 id={`${baseId}-warn`} className="mb-3 text-lg font-bold text-foreground">{t.improve}</h3>
              <ul className="grid gap-3 md:grid-cols-2">
                {warning.map((check) => <CheckRow key={check.id} check={check} locale={locale} withFix />)}
              </ul>
            </section>
          ) : null}

          {passing.length + infos.length > 0 ? (
            <details className="rounded-3xl border border-foreground/10 bg-surface/10 p-5">
              <summary className="cursor-pointer text-sm font-bold text-foreground">
                {t.healthy} (<span dir="ltr">{passing.length + infos.length}</span>)
              </summary>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {[...passing, ...infos].map((check) => <CheckRow key={check.id} check={check} locale={locale} withFix={false} />)}
              </ul>
            </details>
          ) : null}

          <ContactForm
            key={result.url}
            locale={locale}
            heading={t.leadHeading}
            intro={t.leadIntro}
            initialMessage={t.leadMessage(
              result.url,
              result.score,
              failing.map((check) => AUDIT_COPY[check.id]?.label[locale]).filter(Boolean).join(locale === "fa" ? "، " : ", ").slice(0, 600)
            )}
          />
        </div>
      ) : null}
    </div>
  );
}
