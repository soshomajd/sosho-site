"use client";

import { LuSparkles } from "react-icons/lu";

import type { Locale } from "@/app/i18n";

import { CONSULTANT_OPEN_EVENT } from "./ConsultantButton";

/**
 * The floating corner button on every page; it opens the same project estimate as the other buttons.
 * Phones get a round icon-only button so it does not cover page content; the label stays for screen readers.
 */
export default function ConsultantLauncher({ locale }: { locale: Locale }) {
  const label = locale === "fa" ? "برآورد هوشمند" : "Smart estimate";
  return (
    <div className="fixed bottom-4 end-4 z-70 sm:bottom-6 sm:end-6">
      <button
        type="button"
        title={label}
        onClick={(event) => window.dispatchEvent(new CustomEvent(CONSULTANT_OPEN_EVENT, { detail: { opener: event.currentTarget } }))}
        className="group flex h-14 w-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-surface/95 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transform-none sm:h-16 sm:w-auto sm:justify-start sm:px-5"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-primary to-accent text-background shadow-lg shadow-primary/20 sm:h-11 sm:w-11">
          <LuSparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="sr-only sm:not-sr-only">{label}</span>
      </button>
    </div>
  );
}
