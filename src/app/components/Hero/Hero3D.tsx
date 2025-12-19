"use client";

import { useEffect, useRef, useState } from "react";

type ThreeWebGPUModule = typeof import("three/webgpu");
type ThreeTSLModule = typeof import("three/tsl");
type RadialBlurModule = typeof import("three/examples/jsm/tsl/display/radialBlur.js");

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(media.matches);
        onChange();

        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        }

        media.addListener(onChange);
        return () => media.removeListener(onChange);
    }, []);

    return reduced;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(hover: none) and (pointer: coarse)");
        const onChange = () => setIsMobile(media.matches);
        onChange();

        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        }

        media.addListener(onChange);
        return () => media.removeListener(onChange);
    }, []);

    return isMobile;
}

export default function Hero3D() {
    const reducedMotion = usePrefersReducedMotion();
    const isMobile = useIsMobile();
    const mountRef = useRef<HTMLDivElement>(null);
    const [webGPUSupported, setWebGPUSupported] = useState(true);

    useEffect(() => {
        if (reducedMotion || isMobile) return;

        let disposed = false;
        let resizeObserver: ResizeObserver | null = null;

        const mount = mountRef.current;
        if (!mount) return;

        if (typeof navigator === "undefined" || !("gpu" in navigator)) {
            setWebGPUSupported(false);
            return;
        }

        // Lazy-load heavy WebGPU/TSL modules on the client.
        const init = async () => {
            const THREE = (await import("three/webgpu")) as unknown as ThreeWebGPUModule;
            const { float, int, pass, uniform } =
                (await import("three/tsl")) as unknown as ThreeTSLModule;
            const { radialBlur } =
                (await import(
                    "three/examples/jsm/tsl/display/radialBlur.js"
                )) as unknown as RadialBlurModule;

            if (disposed) return;

            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
            camera.position.z = 50;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);

            const timer = new THREE.Timer();

            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d);
            hemiLight.position.set(0, 1000, 0);
            scene.add(hemiLight);

            const pointLight = new THREE.PointLight(0xffffff, 1000);
            pointLight.position.set(0, 0, 0);
            scene.add(pointLight);

            const group = new THREE.Group();

            const geometry = new THREE.TetrahedronGeometry();
            const material = new THREE.MeshStandardMaterial({ flatShading: true });
            const instanceCount = 90;
            const mesh = new THREE.InstancedMesh(geometry, material, instanceCount);

            const dummy = new THREE.Object3D();
            const col = new THREE.Color();
            const center = new THREE.Vector2();

            for (let i = 0; i < instanceCount; i++) {
                dummy.position.x = Math.random() * 50 - 25;
                dummy.position.y = Math.random() * 50 - 25;
                dummy.position.z = Math.random() * 50 - 25;

                center.set(dummy.position.x, dummy.position.y);

                // Make sure tetrahedrons are not positioned at the origin.
                if (center.length() < 6) {
                    center.normalize().multiplyScalar(6);
                    dummy.position.x = center.x;
                    dummy.position.y = center.y;
                }

                dummy.scale.setScalar(Math.random() * 2 + 1);

                dummy.rotation.x = Math.random() * Math.PI;
                dummy.rotation.y = Math.random() * Math.PI;
                dummy.rotation.z = Math.random() * Math.PI;

                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);

                col.setHSL(0.55 + (i / instanceCount) * 0.15, 1, 0.2);
                mesh.setColorAt(i, col);
            }

            group.add(mesh);
            scene.add(group);

            const renderer = new THREE.WebGPURenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.toneMapping = THREE.NeutralToneMapping;

            // Some three.js WebGPU builds require async init.
            if (typeof renderer.init === "function") {
                try {
                    await renderer.init();
                } catch {
                    if (!disposed) setWebGPUSupported(false);
                    return;
                }
            }

            if (disposed) {
                if (typeof renderer.dispose === "function") renderer.dispose();
                return;
            }

            mount.appendChild(renderer.domElement);

            const postProcessing = new THREE.PostProcessing(renderer);
            const scenePass = pass(scene, camera);

            const weightUniform = uniform(float(0.9));
            const decayUniform = uniform(float(0.95));
            const exposureUniform = uniform(int(5));
            const countUniform = uniform(int(32));

            const blurPass = radialBlur(scenePass, {
                weight: weightUniform,
                decay: decayUniform,
                count: countUniform,
                exposure: exposureUniform,
            });

            postProcessing.outputNode = blurPass;

            const setSizeFromMount = () => {
                const width = Math.max(1, mount.clientWidth);
                const height = Math.max(1, mount.clientHeight);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };

            setSizeFromMount();

            resizeObserver = new ResizeObserver(() => setSizeFromMount());
            resizeObserver.observe(mount);

            const animate = () => {
                if (disposed) return;
                timer.update();
                const delta = timer.getDelta();
                group.rotation.y += delta * 0.1;
                postProcessing.render();
            };

            renderer.setAnimationLoop(animate);

            return () => {
                renderer.setAnimationLoop(null);

                if (resizeObserver) {
                    resizeObserver.disconnect();
                    resizeObserver = null;
                }

                try {
                    mount.removeChild(renderer.domElement);
                } catch {
                    // ignore
                }

                geometry.dispose();
                material.dispose();
                if (typeof renderer.dispose === "function") renderer.dispose();
            };
        };

        let cleanup: undefined | (() => void);

        init()
            .then((c) => {
                cleanup = c;
            })
            .catch(() => {
                if (!disposed) setWebGPUSupported(false);
            });

        return () => {
            disposed = true;
            if (cleanup) cleanup();
        };
    }, [reducedMotion, isMobile]);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {!reducedMotion && !isMobile && webGPUSupported ? (
                <>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent_70%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent_72%)]" />
                </>
            ) : null}

            {reducedMotion || isMobile ? (
                <div className="absolute inset-0">
                    <div className="hero-fallback-static" aria-hidden="true" />
                </div>
            ) : !webGPUSupported ? (
                <div className="absolute inset-0">
                    <div className="hero-fallback-blob hero-fallback-blob-1" aria-hidden="true" />
                    <div className="hero-fallback-blob hero-fallback-blob-2" aria-hidden="true" />
                </div>
            ) : (
                <div ref={mountRef} className="absolute inset-0" />
            )}
        </div>
    );
}
