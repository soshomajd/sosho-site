"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { TOUR_CURVE } from "./CameraPath";

/**
 * A sleeve drawn around the tail of the camera curve, so the cable the camera
 * travels through is literally the path it follows. Rendered back-faces only,
 * which puts the viewer inside the tube instead of looking at it from outside.
 */
export default function SceneCable() {
    const geometry = useMemo(() => {
        const points = [];
        // The cable stage runs from 0.78 to 1; sample a little early so the
        // opening is already in frame as the camera leaves the board.
        for (let i = 0; i <= 60; i += 1) {
            points.push(TOUR_CURVE.getPointAt(0.76 + (0.24 * i) / 60));
        }
        const spline = new THREE.CatmullRomCurve3(points);
        return new THREE.TubeGeometry(spline, 120, 0.85, 16, false);
    }, []);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial
                color="#0d1017"
                roughness={0.9}
                metalness={0.2}
                side={THREE.BackSide}
            />
        </mesh>
    );
}
