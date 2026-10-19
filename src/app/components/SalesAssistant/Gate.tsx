"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Locale } from "@/app/i18n";

// The widget's code is only downloaded once the Worker reports Sales Chat as available.
const SalesAssistant = dynamic(() => import("./index"), { ssr: false });

export default function SalesAssistantGate({ locale }: { locale: Locale }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const check = () => {
      fetch("/api/sales/status", { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: unknown) => {
          if (data && typeof data === "object" && (data as { available?: unknown }).available === true) {
            setAvailable(true);
          }
        })
        .catch(() => {
          // Stay hidden when the readiness check cannot complete.
        });
    };
    // The check is not needed for the first paint; run it once the browser is idle.
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    if (typeof window.requestIdleCallback === "function") idleHandle = window.requestIdleCallback(check, { timeout: 3000 });
    else timeoutHandle = window.setTimeout(check, 1500);
    return () => {
      controller.abort();
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, []);

  return available ? <SalesAssistant locale={locale} preverified /> : null;
}
