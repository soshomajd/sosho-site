"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    type MutableRefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;
type ServiceKind = "design" | "wordpress" | "seo" | "web3" | "ai";

const SERVICE_MODULES: ReadonlyArray<{ kind: ServiceKind; color: string }> = [
    { kind: "design", color: "#22d3ee" },
    { kind: "wordpress", color: "#818cf8" },
    { kind: "seo", color: "#34d399" },
    { kind: "web3", color: "#a78bfa" },
    { kind: "ai", color: "#f472b6" },
];

function subscribeReducedMotion(callback: () => void) {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

function subscribeCompactViewport(callback: () => void) {
    const media = window.matchMedia("(max-width: 767px)");
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

function useReducedMotion() {
    return useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        () => true,
    );
}

function useCompactViewport() {
    return useSyncExternalStore(
        subscribeCompactViewport,
        () => window.matchMedia("(max-width: 767px)").matches,
        () => true,
    );
}

function useSectionProgress(sectionId: string) {
    const progress = useRef(0);
    const [active, setActive] = useState(true);

    useEffect(() => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const travel = Math.max(1, rect.height - window.innerHeight);
            progress.current = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
        };
        const requestUpdate = () => {
            if (!frame) frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        const observer = new IntersectionObserver(
            ([entry]) => setActive(entry?.isIntersecting ?? false),
            { rootMargin: "20% 0px" },
        );
        observer.observe(section);

        return () => {
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
            observer.disconnect();
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [sectionId]);

    return { progress, active };
}

function usePointer(enabled: boolean): PointerRef {
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!enabled) return;
        const handlePointerMove = (event: PointerEvent) => {
            pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, [enabled]);

    return pointer;
}

function ParticleField({
    progress,
    pointer,
    compact,
}: {
    progress: ProgressRef;
    pointer: PointerRef;
    compact: boolean;
}) {
    const points = useRef<THREE.Points>(null);
    const smoothedPointer = useRef({ x: 0, y: 0 });
    const count = compact ? 58 : 110;
    const positions = useMemo(() => {
        const data = new Float32Array(count * 3);
        let seed = 73;
        const random = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };

        for (let index = 0; index < count; index += 1) {
            data[index * 3] = (random() - 0.5) * 18;
            data[index * 3 + 1] = (random() - 0.5) * 11;
            data[index * 3 + 2] = (random() - 0.5) * 9 - 2;
        }
        return data;
    }, [count]);

    useFrame((state, delta) => {
        if (!points.current) return;
        smoothedPointer.current.x = THREE.MathUtils.damp(smoothedPointer.current.x, pointer.current.x, 3.2, delta);
        smoothedPointer.current.y = THREE.MathUtils.damp(smoothedPointer.current.y, pointer.current.y, 3.2, delta);
        points.current.rotation.y =
            progress.current * 0.7 + state.clock.elapsedTime * 0.012 + smoothedPointer.current.x * 0.18;
        points.current.rotation.x = progress.current * -0.12 + smoothedPointer.current.y * 0.1;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                color="#7dd3fc"
                size={compact ? 0.025 : 0.032}
                sizeAttenuation
                transparent
                opacity={0.42}
                depthWrite={false}
            />
        </points>
    );
}

function Rod({
    from,
    to,
    color,
    radius = 0.018,
}: {
    from: [number, number, number];
    to: [number, number, number];
    color: string;
    radius?: number;
}) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize(),
    );

    return (
        <mesh position={midpoint} quaternion={quaternion}>
            <cylinderGeometry args={[radius, radius, direction.length(), 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.72} />
        </mesh>
    );
}

function DesignGlyph({ color }: { color: string }) {
    return (
        <group position={[0, 0, 0.19]}>
            <mesh position={[-0.16, 0.14, 0]}>
                <boxGeometry args={[0.48, 0.35, 0.055]} />
                <meshBasicMaterial color={color} transparent opacity={0.92} />
            </mesh>
            <mesh position={[0.19, -0.15, 0.04]}>
                <boxGeometry args={[0.43, 0.32, 0.055]} />
                <meshBasicMaterial color="#c4f1ff" transparent opacity={0.7} />
            </mesh>
            <mesh position={[-0.31, -0.29, 0.07]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

function WordPressGlyph({ color }: { color: string }) {
    return (
        <group position={[0, 0, 0.2]}>
            <mesh>
                <torusGeometry args={[0.34, 0.035, 12, 40]} />
                <meshBasicMaterial color={color} />
            </mesh>
            {[-0.22, 0, 0.22].map((x, index) => (
                <mesh
                    key={x}
                    position={[x, 0, 0.01]}
                    rotation={[0, 0, index === 1 ? -0.46 : 0.46]}
                >
                    <boxGeometry args={[0.055, 0.55, 0.045]} />
                    <meshBasicMaterial color="#eef2ff" />
                </mesh>
            ))}
        </group>
    );
}

function SeoGlyph({ color }: { color: string }) {
    return (
        <group position={[0, 0, 0.2]}>
            <mesh position={[-0.09, 0.09, 0]}>
                <torusGeometry args={[0.24, 0.055, 12, 36]} />
                <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0.22, -0.22, 0]} rotation={[0, 0, -0.78]}>
                <boxGeometry args={[0.08, 0.37, 0.065]} />
                <meshBasicMaterial color={color} />
            </mesh>
            {[0.13, 0.24, 0.36].map((height, index) => (
                <mesh key={height} position={[-0.2 + index * 0.15, -0.25 + height / 2, 0.025]}>
                    <boxGeometry args={[0.07, height, 0.04]} />
                    <meshBasicMaterial color="#d1fae5" transparent opacity={0.78} />
                </mesh>
            ))}
        </group>
    );
}

const WEB3_NODES: Array<[number, number, number]> = [
    [0, 0, 0.08],
    [-0.34, 0.22, 0],
    [0.33, 0.24, 0],
    [-0.23, -0.31, 0],
    [0.31, -0.27, 0],
];

function Web3Glyph({ color }: { color: string }) {
    return (
        <group position={[0, 0, 0.2]}>
            {WEB3_NODES.slice(1).map((node) => (
                <Rod key={node.join("-")} from={WEB3_NODES[0]} to={node} color={color} />
            ))}
            {WEB3_NODES.map((node, index) => (
                <mesh key={node.join("-")} position={node}>
                    <sphereGeometry args={[index === 0 ? 0.11 : 0.075, 14, 14]} />
                    <meshBasicMaterial color={index === 0 ? "#ffffff" : color} />
                </mesh>
            ))}
        </group>
    );
}

function AiGlyph({ color }: { color: string }) {
    return (
        <group position={[0, 0, 0.2]}>
            <mesh>
                <icosahedronGeometry args={[0.29, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.7}
                    wireframe
                />
            </mesh>
            <mesh rotation={[1.05, 0.32, 0.2]}>
                <torusGeometry args={[0.4, 0.014, 8, 48]} />
                <meshBasicMaterial color="#fce7f3" transparent opacity={0.82} />
            </mesh>
            <mesh position={[0.32, -0.2, 0.25]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

function ServiceModule({ kind, color }: { kind: ServiceKind; color: string }) {
    return (
        <group>
            <RoundedBox args={[1.16, 1.16, 0.22]} radius={0.2} smoothness={3}>
                <meshPhysicalMaterial
                    color="#111827"
                    emissive={color}
                    emissiveIntensity={0.12}
                    roughness={0.28}
                    metalness={0.46}
                    clearcoat={0.8}
                    transparent
                    opacity={0.9}
                />
            </RoundedBox>
            <RoundedBox
                args={[1.03, 1.03, 0.025]}
                radius={0.16}
                smoothness={3}
                position={[0, 0, 0.125]}
            >
                <meshBasicMaterial color={color} transparent opacity={0.075} />
            </RoundedBox>
            {kind === "design" ? <DesignGlyph color={color} /> : null}
            {kind === "wordpress" ? <WordPressGlyph color={color} /> : null}
            {kind === "seo" ? <SeoGlyph color={color} /> : null}
            {kind === "web3" ? <Web3Glyph color={color} /> : null}
            {kind === "ai" ? <AiGlyph color={color} /> : null}
        </group>
    );
}

function BrowserStack() {
    return (
        <group>
            <RoundedBox args={[5.05, 3.28, 0.22]} radius={0.22} smoothness={4}>
                <meshPhysicalMaterial
                    color="#171d2a"
                    roughness={0.24}
                    metalness={0.5}
                    clearcoat={0.85}
                    transparent
                    opacity={0.94}
                />
            </RoundedBox>
            <RoundedBox
                args={[4.68, 2.72, 0.035]}
                radius={0.12}
                smoothness={3}
                position={[0, -0.12, 0.135]}
            >
                <meshBasicMaterial color="#080d14" />
            </RoundedBox>
            {[-2.16, -1.98, -1.8].map((x, index) => (
                <mesh key={x} position={[x, 1.36, 0.15]}>
                    <sphereGeometry args={[0.052, 12, 12]} />
                    <meshBasicMaterial
                        color={["#fb7185", "#fbbf24", "#34d399"][index]}
                    />
                </mesh>
            ))}
            <mesh position={[0.55, 1.36, 0.15]}>
                <boxGeometry args={[2.45, 0.075, 0.03]} />
                <meshBasicMaterial color="#334155" />
            </mesh>
            <mesh position={[-1.86, -0.06, 0.175]}>
                <boxGeometry args={[0.52, 2.26, 0.035]} />
                <meshBasicMaterial color="#111b2b" />
            </mesh>
            {[0.75, 0.44, 0.13, -0.18].map((y, index) => (
                <mesh key={y} position={[-1.88, y, 0.205]}>
                    <boxGeometry args={[index === 0 ? 0.3 : 0.23, 0.055, 0.03]} />
                    <meshBasicMaterial
                        color={index === 0 ? "#22d3ee" : "#475569"}
                        transparent
                        opacity={index === 0 ? 0.95 : 0.62}
                    />
                </mesh>
            ))}
        </group>
    );
}

function UiLayer() {
    return (
        <group>
            <mesh position={[-0.4, 0.62, 0]}>
                <boxGeometry args={[2.05, 0.15, 0.045]} />
                <meshBasicMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[-0.76, 0.34, 0]}>
                <boxGeometry args={[1.34, 0.07, 0.045]} />
                <meshBasicMaterial color="#64748b" />
            </mesh>
            <RoundedBox args={[0.68, 0.25, 0.055]} radius={0.1} position={[-1.08, 0.02, 0]}>
                <meshBasicMaterial color="#6366f1" />
            </RoundedBox>
            {[-0.96, -0.03, 0.9].map((x, index) => (
                <RoundedBox
                    key={x}
                    args={[0.75, 0.72, 0.05]}
                    radius={0.1}
                    position={[x, -0.72, 0]}
                >
                    <meshBasicMaterial
                        color={["#102634", "#171e3a", "#1f1734"][index]}
                    />
                </RoundedBox>
            ))}
            {[-0.96, -0.03, 0.9].map((x, index) => (
                <mesh key={`${x}-dot`} position={[x, -0.58, 0.04]}>
                    <circleGeometry args={[0.09, 20]} />
                    <meshBasicMaterial color={["#22d3ee", "#818cf8", "#f472b6"][index]} />
                </mesh>
            ))}
        </group>
    );
}

function CodeLayer() {
    return (
        <group>
            <RoundedBox args={[1.3, 1.33, 0.055]} radius={0.12} position={[1.18, 0.2, 0]}>
                <meshBasicMaterial color="#0d1824" transparent opacity={0.96} />
            </RoundedBox>
            {[0.68, 0.43, 0.18, -0.07, -0.32].map((y, index) => (
                <group key={y} position={[0, y, 0.04]}>
                    <mesh position={[0.83, 0, 0]}>
                        <boxGeometry args={[0.16, 0.045, 0.025]} />
                        <meshBasicMaterial color="#f472b6" />
                    </mesh>
                    <mesh position={[1.23, 0, 0]}>
                        <boxGeometry args={[0.5 + (index % 2) * 0.2, 0.045, 0.025]} />
                        <meshBasicMaterial color={index % 2 ? "#818cf8" : "#22d3ee"} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function SystemModel({
    progress,
    pointer,
    compact,
    isRtl,
}: {
    progress: ProgressRef;
    pointer: PointerRef;
    compact: boolean;
    isRtl: boolean;
}) {
    const world = useRef<THREE.Group>(null);
    const uiLayer = useRef<THREE.Group>(null);
    const codeLayer = useRef<THREE.Group>(null);
    const halo = useRef<THREE.Mesh>(null);
    const orbiters = useRef<Array<THREE.Group | null>>([]);
    const smoothed = useRef(0);
    const smoothedPointer = useRef({ x: 0, y: 0 });

    useFrame((state, delta) => {
        const worldNode = world.current;
        if (!worldNode) return;
        smoothed.current = THREE.MathUtils.damp(smoothed.current, progress.current, 5.5, delta);
        smoothedPointer.current.x = THREE.MathUtils.damp(smoothedPointer.current.x, pointer.current.x, 3.5, delta);
        smoothedPointer.current.y = THREE.MathUtils.damp(smoothedPointer.current.y, pointer.current.y, 3.5, delta);
        const p = smoothed.current;
        const eased = p * p * (3 - 2 * p);
        const reveal = THREE.MathUtils.smoothstep(p, 0.035, 0.34);
        const idle = state.clock.elapsedTime;
        const px = smoothedPointer.current.x;
        const py = smoothedPointer.current.y;

        const side = isRtl ? -1 : 1;
        worldNode.position.x = (compact ? 0 : side * (1.72 + Math.sin(p * Math.PI) * 0.2)) + px * (compact ? 0.12 : 0.26);
        worldNode.position.y = (compact ? -1.75 + eased * 0.18 : -0.05 + eased * 0.08) - py * (compact ? 0.08 : 0.16);
        const baseScale = compact ? 0.62 : 0.82;
        worldNode.scale.setScalar(baseScale + eased * (compact ? 0.035 : 0.08));
        worldNode.rotation.x = -0.08 + eased * 0.15 + py * 0.07;
        worldNode.rotation.y = side * (-0.3 + eased * 0.56) + px * 0.16;
        worldNode.rotation.z = side * (0.015 - eased * 0.035) - px * 0.02;

        if (uiLayer.current) {
            uiLayer.current.position.z = 0.2 + eased * 0.72;
            uiLayer.current.position.x = eased * -0.16;
        }
        if (codeLayer.current) {
            codeLayer.current.position.z = 0.22 + eased * 1.28;
            codeLayer.current.position.x = eased * 0.22;
        }
        if (halo.current) {
            halo.current.rotation.z = eased * Math.PI * 1.35 + idle * 0.025 + px * 0.25;
            halo.current.rotation.x = 1.12 + py * 0.12;
            halo.current.scale.setScalar(0.82 + reveal * 0.34);
        }

        orbiters.current.forEach((orbiter, index) => {
            if (!orbiter) return;
            const angle = (index / SERVICE_MODULES.length) * Math.PI * 2 - 0.55 + eased * 1.5;
            const radius = (compact ? 2.72 : 3.58) * reveal;
            const depth = 0.28 + Math.sin(angle * 1.7) * 0.6 * reveal;
            const parallax = (1 - index / SERVICE_MODULES.length) * 0.5 + 0.5;
            orbiter.position.set(
                Math.cos(angle) * radius + px * 0.22 * parallax,
                Math.sin(angle) * radius * 0.56 - py * 0.14 * parallax,
                depth,
            );
            const scale = Math.max(0.001, reveal * (compact ? 0.7 : 0.78));
            orbiter.scale.setScalar(scale);
            orbiter.rotation.x = -worldNode.rotation.x * 0.7;
            orbiter.rotation.y = -worldNode.rotation.y + Math.sin(angle) * 0.18;
            orbiter.rotation.z = -angle * 0.08;
        });
    });

    return (
        <group ref={world}>
            <mesh ref={halo} rotation={[1.12, 0.18, 0]} position={[0, 0, -0.5]}>
                <torusGeometry args={[3.15, 0.012, 8, 120]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.34} />
            </mesh>
            <mesh rotation={[1.35, -0.34, 0.5]} position={[0, 0, -0.62]}>
                <torusGeometry args={[2.72, 0.008, 8, 120]} />
                <meshBasicMaterial color="#818cf8" transparent opacity={0.28} />
            </mesh>

            <BrowserStack />
            <group ref={uiLayer} position={[0, 0, 0.2]}>
                <UiLayer />
            </group>
            <group ref={codeLayer} position={[0, 0, 0.22]}>
                <CodeLayer />
            </group>

            {SERVICE_MODULES.map((service, index) => (
                <group
                    key={service.kind}
                    ref={(node) => {
                        orbiters.current[index] = node;
                    }}
                    scale={0.001}
                >
                    <ServiceModule {...service} />
                </group>
            ))}
        </group>
    );
}

function StudioScene({
    progress,
    pointer,
    compact,
    isRtl,
}: {
    progress: ProgressRef;
    pointer: PointerRef;
    compact: boolean;
    isRtl: boolean;
}) {
    return (
        <>
            <ambientLight intensity={0.72} />
            <directionalLight position={[4, 6, 8]} intensity={2.2} color="#dbeafe" />
            <pointLight position={[-4, 1, 4]} intensity={17} distance={11} color="#22d3ee" />
            <pointLight position={[4, -2, 3]} intensity={14} distance={10} color="#6366f1" />
            <ParticleField progress={progress} pointer={pointer} compact={compact} />
            <SystemModel progress={progress} pointer={pointer} compact={compact} isRtl={isRtl} />
        </>
    );
}

function StaticStudio({ isRtl }: { isRtl: boolean }) {
    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
                className={`absolute bottom-[8%] h-[17rem] w-[21rem] opacity-55 sm:bottom-[18%] sm:h-[24rem] sm:w-[30rem] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:opacity-80 ${
                    isRtl ? "left-[-4rem] lg:left-[5%]" : "right-[-4rem] lg:right-[5%]"
                }`}
            >
                <div className="absolute inset-[4%] rounded-full border border-accent/20 [transform:rotateX(64deg)_rotateZ(18deg)]" />
                <div className="absolute inset-[14%] rounded-full border border-primary/25 [transform:rotateX(72deg)_rotateZ(-24deg)]" />
                <div className="absolute inset-x-[9%] top-[24%] h-[54%] rounded-[1.4rem] border border-foreground/15 bg-surface/70 shadow-[0_0_80px_rgba(99,102,241,0.2)] backdrop-blur-sm [transform:perspective(800px)_rotateY(-12deg)_rotateX(5deg)] rtl:[transform:perspective(800px)_rotateY(12deg)_rotateX(5deg)]">
                    <div className="mx-4 mt-4 flex gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-400" />
                        <span className="h-2 w-2 rounded-full bg-amber-300" />
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="mx-4 mt-4 grid h-[65%] grid-cols-[1fr_2.6fr] gap-3 rounded-xl bg-background/75 p-3">
                        <div className="rounded-lg bg-foreground/5" />
                        <div className="space-y-3 pt-1">
                            <div className="h-3 w-3/4 rounded-full bg-foreground/60" />
                            <div className="h-2 w-1/2 rounded-full bg-muted/40" />
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <span className="h-12 rounded-md bg-accent/15" />
                                <span className="h-12 rounded-md bg-primary/20" />
                                <span className="h-12 rounded-md bg-fuchsia-400/15" />
                            </div>
                        </div>
                    </div>
                </div>
                {[
                    "left-[4%] top-[16%] bg-accent",
                    "right-[3%] top-[34%] bg-primary",
                    "left-[16%] bottom-[5%] bg-emerald-400",
                    "right-[18%] bottom-[2%] bg-fuchsia-400",
                ].map((className) => (
                    <span
                        key={className}
                        className={`absolute h-3 w-3 rounded-full shadow-[0_0_22px_currentColor] ${className}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Hero3D({ sectionId, isRtl }: { sectionId: string; isRtl: boolean }) {
    const reducedMotion = useReducedMotion();
    const compact = useCompactViewport();
    const { progress, active } = useSectionProgress(sectionId);
    const pointer = usePointer(!reducedMotion && !compact);

    if (reducedMotion) return <StaticStudio isRtl={isRtl} />;

    return (
        <Canvas
            aria-hidden="true"
            tabIndex={-1}
            frameloop={active ? "always" : "demand"}
            dpr={compact ? [1, 1.2] : [1, 1.55]}
            camera={{ position: [0, 0, 10], fov: compact ? 49 : 42, near: 0.1, far: 60 }}
            gl={{
                alpha: true,
                antialias: !compact,
                powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            style={{ position: "absolute", inset: 0 }}
        >
            <StudioScene progress={progress} pointer={pointer} compact={compact} isRtl={isRtl} />
        </Canvas>
    );
}
