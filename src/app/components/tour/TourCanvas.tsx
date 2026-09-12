"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { type MutableRefObject, type ReactNode, useRef } from "react";
import * as THREE from "three";

import { getCameraAt } from "./CameraPath";
import EffectsLight from "./EffectsLight";
import SceneCable from "./SceneCable";
import SceneCase from "./SceneCase";
import SceneDesk from "./SceneDesk";

/**
 * Moves the camera along the tour curve every frame. The scroll value is read
 * from a ref and eased here rather than in the scroll handler, so a fast flick
 * still produces a smooth dolly instead of a jump cut.
 */
function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
    const smoothed = useRef(0);
    const target = useRef(new THREE.Vector3());

    useFrame(({ camera }, delta) => {
        // Frame-rate independent easing: same feel at 60 and 144 fps.
        const ease = 1 - Math.pow(0.0015, delta);
        smoothed.current = THREE.MathUtils.lerp(smoothed.current, progress.current, ease);

        const { position, target: aim } = getCameraAt(smoothed.current);
        camera.position.copy(position);
        target.current.lerp(aim, ease);
        camera.lookAt(target.current);
    });

    return null;
}

export default function TourCanvas({
    progress,
    children,
}: {
    progress: MutableRefObject<number>;
    children?: ReactNode;
}) {
    return (
        <Canvas
            className="!fixed inset-0"
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ fov: 55, near: 0.1, far: 200 }}
            frameloop="always"
        >
            <color attach="background" args={["#05070c"]} />
            <fog attach="fog" args={["#05070c", 18, 70]} />

            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 8, 6]} intensity={1.1} />
            <pointLight position={[0, 1.1, -1]} intensity={4} distance={14} color="#22d3ee" />

            <CameraRig progress={progress} />

            <SceneDesk />
            <SceneCable />
            <SceneCase />
            <EffectsLight progress={progress} />

            {children}
        </Canvas>
    );
}
