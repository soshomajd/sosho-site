"use client";

import Lenis from "lenis";
import { type MutableRefObject, useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

function subscribeMedia(query: string) {
    return (callback: () => void) => {
        const media = window.matchMedia(query);
        media.addEventListener("change", callback);
        return () => media.removeEventListener("change", callback);
    };
}

/**
 * Server snapshot is `true` on purpose: the static export ships the plain
 * scrollable page, and the tour only takes over once the client confirms the
 * visitor actually wants motion.
 */
export function useReducedMotion() {
    return useSyncExternalStore(
        subscribeMedia("(prefers-reduced-motion: reduce)"),
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        () => true,
    );
}

export function useCompactViewport() {
    return useSyncExternalStore(
        subscribeMedia("(max-width: 767px)"),
        () => window.matchMedia("(max-width: 767px)").matches,
        () => true,
    );
}

/**
 * Drives one 0 -> 1 value from the page scroll position, smoothed by Lenis.
 *
 * The value is kept in a ref rather than state: the camera reads it every frame
 * inside `useFrame`, and re-rendering React sixty times a second would drop the
 * frame rate for no benefit. GSAP is available in the project if per-section
 * timelines are wanted later, but a single linear mapping does not need
 * ScrollTrigger.
 */
export function useTourProgress(enabled: boolean): MutableRefObject<number> {
    const progress = useRef(0);

    useEffect(() => {
        if (!enabled) {
            progress.current = 0;
            return;
        }

        const lenis = new Lenis({
            lerp: 0.09,
            wheelMultiplier: 0.9,
            smoothWheel: true,
        });

        const read = () => {
            const travel = Math.max(
                1,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            progress.current = THREE.MathUtils.clamp(window.scrollY / travel, 0, 1);
        };

        let frame = 0;
        const tick = (time: number) => {
            lenis.raf(time);
            read();
            frame = window.requestAnimationFrame(tick);
        };

        read();
        frame = window.requestAnimationFrame(tick);
        window.addEventListener("resize", read);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", read);
            lenis.destroy();
        };
    }, [enabled]);

    return progress;
}
