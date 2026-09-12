"use client";

import { type MutableRefObject, type ReactNode, useEffect, useRef } from "react";

import { type TourSectionId, sectionOpacityAt } from "./CameraPath";

/**
 * A content panel for one leg of the journey.
 *
 * These deliberately live outside the R3F canvas rather than inside a drei
 * `Html` node. Anchoring them to a point on the curve put them directly in the
 * camera's way: the camera travels *through* each anchor, so the projected
 * position swung to the edge of the screen and clipped the copy as it passed.
 * A fixed overlay keeps every panel centred and legible while the 3D world
 * still moves behind it.
 *
 * Opacity is written straight to the DOM from a rAF loop. Driving it through
 * React state would re-render the whole panel on every frame of every fade.
 */
export default function TourSection({
    id,
    progress,
    isRtl,
    children,
}: {
    id: TourSectionId;
    progress: MutableRefObject<number>;
    isRtl: boolean;
    children: ReactNode;
}) {
    const panel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frame = 0;
        let wasVisible: boolean | null = null;

        const tick = () => {
            const node = panel.current;
            if (node) {
                const opacity = sectionOpacityAt(progress.current, id);
                const visible = opacity > 0.01;
                node.style.opacity = String(opacity);
                node.style.transform = `translateY(${(1 - opacity) * 26}px)`;
                if (visible !== wasVisible) {
                    wasVisible = visible;
                    // Keep hidden panels out of the tab order and off the
                    // accessibility tree, otherwise focus jumps into copy the
                    // visitor cannot see.
                    node.style.visibility = visible ? "visible" : "hidden";
                    node.style.pointerEvents = visible ? "auto" : "none";
                    node.inert = !visible;
                }
            }
            frame = window.requestAnimationFrame(tick);
        };

        frame = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(frame);
    }, [id, progress]);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-5 py-24"
            aria-hidden="true"
        >
            <div
                ref={panel}
                dir={isRtl ? "rtl" : "ltr"}
                className="max-h-full w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-background/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9"
                style={{ opacity: 0, visibility: "hidden" }}
            >
                {children}
            </div>
        </div>
    );
}
