"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiCheck, FiCopy, FiDownload } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

export const fieldClass =
  "w-full rounded-2xl border border-foreground/15 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40";

export const labelClass = "mb-2 block text-sm font-semibold text-foreground";

export const buttonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none";

export const ghostButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-foreground/15 px-4 text-xs font-bold text-foreground transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

export function ToolPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-foreground/10 bg-surface/20 p-5 sm:p-7 ${className}`}>{children}</div>
  );
}

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API is unavailable on insecure origins; fall back to a hidden textarea.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } finally {
        area.remove();
      }
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  }
  return { copied, copy };
}

const CODE_COPY = {
  fa: { copy: "کپی", copied: "کپی شد", download: "دانلود" },
  en: { copy: "Copy", copied: "Copied", download: "Download" },
} as const;

/** Read-only code box with copy (and optional download) buttons. Always left-to-right. */
export function CodeBlock({
  label,
  value,
  locale,
  filename,
  mime = "text/plain",
}: {
  label: string;
  value: string;
  locale: Locale;
  filename?: string;
  mime?: string;
}) {
  const t = CODE_COPY[locale];
  const { copied, copy } = useCopy(value);

  function download() {
    const url = URL.createObjectURL(new Blob([value], { type: `${mime};charset=utf-8` }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? "file.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background/60">
      <div className="flex items-center justify-between gap-3 border-b border-foreground/10 px-4 py-2.5">
        <span className="text-xs font-bold text-muted">{label}</span>
        <div className="flex items-center gap-2">
          {filename ? (
            <button type="button" onClick={download} className={ghostButtonClass}>
              <FiDownload className="h-3.5 w-3.5" aria-hidden="true" />
              {t.download}
            </button>
          ) : null}
          <button type="button" onClick={() => void copy()} className={ghostButtonClass}>
            {copied ? <FiCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> : <FiCopy className="h-3.5 w-3.5" aria-hidden="true" />}
            <span aria-live="polite">{copied ? t.copied : t.copy}</span>
          </button>
        </div>
      </div>
      <pre dir="ltr" tabIndex={0} className="max-h-96 overflow-auto p-4 text-start text-xs leading-6 text-foreground/90">
        <code>{value}</code>
      </pre>
    </div>
  );
}

/** Escapes text for use inside an HTML attribute or element. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;");
}
