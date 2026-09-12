"use client";

import { useFrame } from "@react-three/fiber";
import { type MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";

import { TOUR_CURVE, stageProgress } from "./CameraPath";

const PARTICLE_COUNT = 900;

/**
 * Deterministic scatter. `Math.random` would make the particle field differ
 * between renders (and between server and client), so the positions are hashed
 * from the particle index instead: same cloud every time, still unstructured.
 */
function noise(seed: number): number {
    const value = Math.sin(seed * 127.1) * 43758.5453;
    return value - Math.floor(value);
}

/**
 * The "becoming light" moment. Particles are scattered along the tail of the
 * curve and fade up as the light stage advances.
 *
 * Real bloom would need `@react-three/postprocessing`, which is not a
 * dependency yet; additive blending carries the effect well enough to judge the
 * timing, and the material can be swapped once bloom is added.
 */
export default function EffectsLight({
    progress,
}: {
    progress: MutableRefObject<number>;
}) {
    const points = useRef<THREE.Points>(null);
    const material = useRef<THREE.PointsMaterial>(null);

    const geometry = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i += 1) {
            const t = 0.8 + noise(i) * 0.2;
            const point = TOUR_CURVE.getPointAt(t);
            positions[i * 3] = point.x + (noise(i + 101) - 0.5) * 1.3;
            positions[i * 3 + 1] = point.y + (noise(i + 202) - 0.5) * 1.3;
            positions[i * 3 + 2] = point.z + (noise(i + 303) - 0.5) * 1.3;
        }
        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return buffer;
    }, []);

    useFrame((_, delta) => {
        if (!material.current || !points.current) return;
        const amount = stageProgress(progress.current, "light");
        material.current.opacity = amount;
        points.current.visible = amount > 0.01;
        points.current.rotation.z += delta * 0.08 * amount;
    });

    return (
        <points ref={points} geometry={geometry} visible={false}>
            <pointsMaterial
                ref={material}
                size={0.055}
                color="#7dd3fc"
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
