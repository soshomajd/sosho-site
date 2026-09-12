"use client";

import { RoundedBox } from "@react-three/drei";

/**
 * Blocked out with primitives on purpose: the camera path and the scroll
 * mapping need to be right before a real model is worth importing. Swap the
 * meshes here for a GLTF later without touching CameraPath or TourCanvas.
 */
export default function SceneDesk() {
    return (
        <group>
            {/* Desk surface */}
            <mesh position={[0, -0.55, 4]} receiveShadow>
                <boxGeometry args={[16, 0.18, 8]} />
                <meshStandardMaterial color="#1b1f2a" roughness={0.85} metalness={0.05} />
            </mesh>

            {/* Monitor stand */}
            <mesh position={[0, 0.1, 1.4]}>
                <cylinderGeometry args={[0.16, 0.42, 1.1, 20]} />
                <meshStandardMaterial color="#2a3040" roughness={0.5} metalness={0.4} />
            </mesh>

            {/* Monitor shell, open at the front so the camera can fly through */}
            <RoundedBox args={[7.2, 4.4, 0.34]} radius={0.09} smoothness={4} position={[0, 1.1, 0.3]}>
                <meshStandardMaterial color="#11151d" roughness={0.45} metalness={0.55} />
            </RoundedBox>

            {/* Screen glow: the doorway into the tour */}
            <mesh position={[0, 1.1, 0.14]}>
                <planeGeometry args={[6.7, 3.9]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.13} />
            </mesh>

            {/* Keyboard */}
            <RoundedBox args={[3.4, 0.12, 1.1]} radius={0.05} smoothness={3} position={[0, -0.4, 5.2]}>
                <meshStandardMaterial color="#232838" roughness={0.7} />
            </RoundedBox>

            {/* Mouse: the final click target */}
            <RoundedBox args={[0.42, 0.18, 0.68]} radius={0.09} smoothness={4} position={[2.5, -0.37, 5.3]}>
                <meshStandardMaterial color="#232838" roughness={0.6} />
            </RoundedBox>
        </group>
    );
}
