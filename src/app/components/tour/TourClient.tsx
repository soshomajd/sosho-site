"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useState } from "react";

import { TOUR_SECTION_IDS, type TourSectionId } from "./CameraPath";
import TourSection from "./TourSection";
import { useCompactViewport, useReducedMotion, useTourProgress } from "./useTourProgress";

const TourCanvas = dynamic(() => import("./TourCanvas"), {
    ssr: false,
    loading: () => null,
});

/** Scroll distance the journey needs, as a multiple of the viewport height. */
const SCROLL_VIEWPORTS = 8;

export type TourSlots = Record<TourSectionId, ReactNode>;

/**
 * Decides whether the visitor gets the 3D tour or the plain page.
 *
 * The server render is always the plain page: `useReducedMotion` and
 * `useCompactViewport` both report `true` during SSR, so the static export
 * contains the full readable document. The tour only replaces it after the
 * client confirms a pointer-sized viewport and no motion preference, which also
 * covers the reduced-motion and low-end fallback the brief asks for.
 */
export default function TourClient({
    slots,
    fallback,
    isRtl,
    skipLabel,
}: {
    slots: TourSlots;
    fallback: ReactNode;
    isRtl: boolean;
    skipLabel: string;
}) {
    const reducedMotion = useReducedMotion();
    const compact = useCompactViewport();
    const [skipped, setSkipped] = useState(false);

    const tourActive = !reducedMotion && !compact && !skipped;
    const progress = useTourProgress(tourActive);

    // The tour owns the scrollbar while it runs; restore the page otherwise.
    useEffect(() => {
        if (!tourActive) return;
        const previous = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#05070c";
        return () => {
            document.body.style.backgroundColor = previous;
        };
    }, [tourActive]);

    if (!tourActive) return <>{fallback}</>;

    return (
        <>
            <TourCanvas progress={progress}>
                {TOUR_SECTION_IDS.map((id) => (
                    <TourSection key={id} id={id} isRtl={isRtl}>
                        {slots[id]}
                    </TourSection>
                ))}
            </TourCanvas>

            {/* Gives the page something to scroll; the canvas itself is fixed. */}
            <div style={{ height: `${SCROLL_VIEWPORTS * 100}vh` }} aria-hidden="true" />

            <button
                type="button"
                onClick={() => setSkipped(true)}
                className="fixed bottom-5 end-5 z-30 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                {skipLabel}
            </button>
        </>
    );
}
