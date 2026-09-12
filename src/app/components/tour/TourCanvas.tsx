"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { type MutableRefObject, type ReactNode, useRef } from "react";
import * as THREE from "three";

import { type TourStage, getCameraAt, stageAt } from "./CameraPath";
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

/**
 * Hides scenery that belongs to a different leg of the journey.
 *
 * Everything lives in one world, so without this the tower case sits in frame
 * as an unexplained dark block while the camera is still moving past the
 * content sections.
 */
function StageGroup({
    progress,
    stages,
    children,
}: {
    progress: MutableRefObject<number>;
    stages: readonly TourStage[];
    children: ReactNode;
}) {
    const group = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!group.current) return;
        group.current.visible = stages.includes(stageAt(progress.current));
    });

    return <group ref={group}>{children}</group>;
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
            camera={{ fov: 50, near: 0.1, far: 200 }}
            frameloop="always"
        >
            <color attach="background" args={["#080c14"]} />
            <fog attach="fog" args={["#080c14", 10, 46]} />

            {/* The desk is a dark scene, but it still has to read as a room. */}
            <ambientLight intensity={1.5} />
            <hemisphereLight args={["#9dd7ff", "#0b0f18", 1.1]} />
            <directionalLight position={[5, 9, 8]} intensity={2.2} />
            <directionalLight position={[-6, 4, 5]} intensity={0.9} color="#7dd3fc" />
            <pointLight position={[0, 1.2, 2.4]} intensity={22} distance={16} color="#22d3ee" />

            <CameraRig progress={progress} />

            <StageGroup progress={progress} stages={["desk", "entering", "sections"]}>
                <SceneDesk />
            </StageGroup>

            <StageGroup progress={progress} stages={["exiting", "cable", "light"]}>
                <SceneCable />
            </StageGroup>

            <StageGroup progress={progress} stages={["light", "case"]}>
                <SceneCase />
            </StageGroup>

            <EffectsLight progress={progress} />

            {children}
        </Canvas>
    );
}
