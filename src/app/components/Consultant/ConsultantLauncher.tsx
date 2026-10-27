"use client";

import { FiCompass } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { CONSULTANT_OPEN_EVENT } from "./ConsultantButton";

/** The floating corner button on every page; it opens the same project estimate as the other buttons. */
export default function ConsultantLauncher({ locale }: { locale: Locale }) {
  const label = locale === "fa" ? "برآورد هوشمند" : "Smart estimate";
  return (
    <div className="fixed bottom-4 end-4 z-70 sm:bottom-6 sm:end-6">
      <button
        type="button"
        onClick={(event) => window.dispatchEvent(new CustomEvent(CONSULTANT_OPEN_EVENT, { detail: { opener: event.currentTarget } }))}
        className="group flex h-14 items-center gap-3 rounded-full border border-white/10 bg-surface/95 px-4 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transform-none sm:h-16 sm:px-5"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/20 sm:h-11 sm:w-11">
          <FiCompass className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
}
