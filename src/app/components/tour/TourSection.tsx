"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type ReactNode, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { type TourSectionId, getSectionPosition } from "./CameraPath";

/** Distance at which a panel is fully lit; it fades out past twice this. */
const FOCUS_DISTANCE = 6;

/**
 * One content panel parked on the camera path. The markup is real DOM rendered
 * through drei's `Html`, so headings stay selectable and reachable by keyboard
 * while the camera moves past them.
 */
export default function TourSection({
    id,
    isRtl,
    children,
}: {
    id: TourSectionId;
    isRtl: boolean;
    children: ReactNode;
}) {
    // Fade is driven by how close the camera actually is, so this component
    // never needs the raw scroll value.
    const anchor = useMemo(() => getSectionPosition(id), [id]);
    const wrapper = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useFrame(({ camera }) => {
        const distance = camera.position.distanceTo(anchor);
        const opacity = THREE.MathUtils.clamp(
            1 - (distance - FOCUS_DISTANCE) / FOCUS_DISTANCE,
            0,
            1,
        );
        // Keep the panel in the tree but out of the tab order once it is behind
        // the camera, otherwise keyboard focus jumps to invisible content.
        const visible = opacity > 0.02;
        if (visible !== mounted) setMounted(visible);
        if (!wrapper.current) return;
        wrapper.current.style.opacity = String(opacity);
        wrapper.current.style.transform = `translateY(${(1 - opacity) * 24}px)`;
    });

    return (
        <Html
            position={anchor}
            center
            distanceFactor={9}
            zIndexRange={[20, 0]}
            style={{ pointerEvents: mounted ? "auto" : "none" }}
        >
            <div
                ref={wrapper}
                dir={isRtl ? "rtl" : "ltr"}
                aria-hidden={mounted ? undefined : true}
                inert={!mounted}
                className="w-[min(78vw,52rem)] transition-none"
                style={{ opacity: 0 }}
            >
                {children}
            </div>
        </Html>
    );
}
