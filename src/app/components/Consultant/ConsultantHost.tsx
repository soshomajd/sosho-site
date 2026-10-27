"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/app/i18n";

import { CONSULTANT_OPEN_EVENT } from "./ConsultantButton";

// The consultant is not part of the first paint: its code loads on the first open only.
const ConsultantDialog = dynamic(() => import("./ConsultantDialog"), { ssr: false });

const OPEN_HASH = "#estimate";

/** Mounted once per page; any ConsultantButton (or a #estimate link) opens the dialog. */
export default function ConsultantHost({ locale }: { locale: Locale }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ opener?: HTMLElement }>).detail;
      opener.current = detail?.opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setMounted(true);
      setOpen(true);
    };
    const fromHash = () => {
      if (window.location.hash === OPEN_HASH) show(new CustomEvent(CONSULTANT_OPEN_EVENT));
    };
    window.addEventListener(CONSULTANT_OPEN_EVENT, show);
    window.addEventListener("hashchange", fromHash);
    fromHash();
    return () => {
      window.removeEventListener(CONSULTANT_OPEN_EVENT, show);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  function close() {
    setOpen(false);
    if (window.location.hash === OPEN_HASH) history.replaceState(null, "", window.location.pathname + window.location.search);
    // Return focus to whatever opened the dialog.
    window.setTimeout(() => opener.current?.focus(), 0);
  }

  return mounted ? <ConsultantDialog locale={locale} open={open} onClose={close} /> : null;
}
