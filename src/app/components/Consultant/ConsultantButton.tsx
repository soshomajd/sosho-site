"use client";

import type { ReactNode } from "react";
import { FiCompass } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { consultantCopy } from "./copy";

export const CONSULTANT_OPEN_EVENT = "sosho:consultant-open";

/** Opens the project consultant. The dialog's code is only downloaded on the first click. */
export default function ConsultantButton({
  locale,
  variant = "secondary",
  className = "",
  children,
}: {
  locale: Locale;
  /** "bare" leaves all styling to className (for places with their own button style, like the hero). */
  variant?: "primary" | "secondary" | "link" | "bare";
  className?: string;
  children?: ReactNode;
}) {
  const styles = {
    primary:
      "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none",
    secondary:
      "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 bg-surface/40 px-6 text-sm font-bold text-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
    link: "inline-flex items-center gap-2 rounded-md text-sm font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
    bare: "",
  };
  return (
    <button
      type="button"
      onClick={(event) => window.dispatchEvent(new CustomEvent(CONSULTANT_OPEN_EVENT, { detail: { opener: event.currentTarget } }))}
      className={`${styles[variant]} ${className}`}
    >
      <FiCompass className="h-4 w-4" aria-hidden="true" />
      {children ?? consultantCopy(locale).open}
    </button>
  );
}
