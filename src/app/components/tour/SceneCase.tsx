"use client";

import { RoundedBox } from "@react-three/drei";

/** Interior of the tower at the end of the cable run. */
export default function SceneCase() {
    return (
        <group position={[6.4, -1.9, -52]}>
            <RoundedBox args={[6, 6, 8]} radius={0.12} smoothness={3}>
                <meshStandardMaterial color="#0a0d14" roughness={0.95} side={2} />
            </RoundedBox>

            {/* A couple of boards to give the space some scale */}
            <mesh position={[-1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[5, 3.4]} />
                <meshStandardMaterial color="#123027" roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[1.7, -1.1, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[3.6, 2.2]} />
                <meshStandardMaterial color="#0f2433" roughness={0.7} metalness={0.3} />
            </mesh>

            <pointLight position={[0, 1.4, 0]} intensity={7} distance={9} color="#22d3ee" />
        </group>
    );
}
