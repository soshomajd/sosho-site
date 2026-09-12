import * as THREE from "three";

/**
 * The whole home page is one continuous camera journey. Scroll progress (0 -> 1)
 * maps onto a single spline, so every stage below is just a slice of the same
 * curve rather than a separate animation to keep in sync.
 *
 *   0.00  desk, camera pulled back
 *   0.12  through the monitor bezel into screen space
 *   0.18  hero, then one content section after another
 *   0.72  out through the back of the panel, past the board
 *   0.80  along the cable toward the tower
 *   0.88  geometry dissolves into light
 *   0.96  into the case through the vent
 */

export type TourStage =
    | "desk"
    | "entering"
    | "sections"
    | "exiting"
    | "cable"
    | "light"
    | "case";

export const STAGE_RANGES: ReadonlyArray<{ stage: TourStage; from: number; to: number }> = [
    { stage: "desk", from: 0, to: 0.12 },
    { stage: "entering", from: 0.12, to: 0.18 },
    { stage: "sections", from: 0.18, to: 0.72 },
    { stage: "exiting", from: 0.72, to: 0.8 },
    { stage: "cable", from: 0.8, to: 0.88 },
    { stage: "light", from: 0.88, to: 0.96 },
    { stage: "case", from: 0.96, to: 1 },
];

/** Section ids in the order the camera meets them, matching the home page anchors. */
export const TOUR_SECTION_IDS = [
    "hero",
    "services",
    "projects",
    "about",
    "blog",
    "contact",
] as const;

export type TourSectionId = (typeof TOUR_SECTION_IDS)[number];

/**
 * Control points for the journey. The camera looks down -Z for the whole screen
 * space run, then swings +X toward the tower case during the cable stage.
 */
const CONTROL_POINTS: ReadonlyArray<[number, number, number]> = [
    [0, 1.6, 9], // pulled back, whole desk in frame
    [0, 1.35, 6], // leaning in
    [0, 1.15, 3.2], // close to the glass
    [0, 1.1, 0.6], // at the bezel
    [0, 1.1, -1.5], // through it, screen space begins
    [0, 1.1, -8], // hero
    [0, 1.1, -16], // services
    [0, 1.1, -24], // projects
    [0, 1.1, -32], // about
    [0, 1.1, -40], // blog
    [0, 1.1, -48], // contact
    [0, 1.1, -55], // back of the panel
    [0.4, 0.9, -60], // past the board
    [1.8, 0.2, -63], // cable mouth
    [3.6, -0.6, -64], // cable bends toward the floor
    [5.2, -1.4, -62], // cable runs behind the desk
    [6.1, -1.9, -58], // approaching the tower
    [6.4, -1.9, -54.5], // the vent
    [6.4, -1.9, -51], // inside the case
];

export const TOUR_CURVE = new THREE.CatmullRomCurve3(
    CONTROL_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.5,
);

/** How far ahead on the curve the camera aims. Kept small so turns stay readable. */
const LOOK_AHEAD = 0.012;

const scratchPosition = new THREE.Vector3();
const scratchTarget = new THREE.Vector3();

/**
 * Position + aim point for a progress value. Both vectors are reused, so copy
 * them if you need to hold on to the values past the current frame.
 */
export function getCameraAt(progress: number): {
    position: THREE.Vector3;
    target: THREE.Vector3;
} {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    TOUR_CURVE.getPointAt(t, scratchPosition);
    TOUR_CURVE.getPointAt(Math.min(1, t + LOOK_AHEAD), scratchTarget);
    // At the very end there is no curve left to aim at, so keep the last heading.
    if (t + LOOK_AHEAD >= 1) {
        TOUR_CURVE.getTangentAt(1, scratchTarget).multiplyScalar(2).add(scratchPosition);
    }
    return { position: scratchPosition, target: scratchTarget };
}

/** Curve progress where each section sits, derived from its control point index. */
export const SECTION_ANCHORS: ReadonlyArray<{ id: TourSectionId; t: number }> =
    TOUR_SECTION_IDS.map((id, index) => ({
        id,
        // Control points 5..10 are the six section stops.
        t: (index + 5) / (CONTROL_POINTS.length - 1),
    }));

/** World position of a section's content panel. */
export function getSectionPosition(id: TourSectionId): THREE.Vector3 {
    const anchor = SECTION_ANCHORS.find((entry) => entry.id === id);
    if (!anchor) throw new Error(`Unknown tour section: ${id}`);
    return TOUR_CURVE.getPointAt(anchor.t).clone();
}

export function stageAt(progress: number): TourStage {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    for (const range of STAGE_RANGES) {
        if (t >= range.from && t < range.to) return range.stage;
    }
    return "case";
}

/** 0 -> 1 progress inside a single stage, for driving per-stage effects. */
export function stageProgress(progress: number, stage: TourStage): number {
    const range = STAGE_RANGES.find((entry) => entry.stage === stage);
    if (!range) return 0;
    return THREE.MathUtils.clamp(
        (progress - range.from) / (range.to - range.from),
        0,
        1,
    );
}
