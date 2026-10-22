// Checks the current ImageGen covers recorded in blog-art-manifest.json.
// --sheet builds a contact sheet of the current covers. --legacy explicitly
// selects the former procedural SVG renderer below (not used by current posts).
// Legacy renderer: one text-free illustration (1200x630 JPEG) per blog post with
// Playwright. Each scene is plain SVG, so no stock-photo licence or external
// request is involved and the artwork can be edited in this file.
//
// Usage:
//   node scripts/generate-blog-art.mjs               # verify the current covers
//   node scripts/generate-blog-art.mjs --only slug   # verify one cover
//   node scripts/generate-blog-art.mjs --sheet out.png   # current covers contact sheet
//   node scripts/generate-blog-art.mjs --legacy      # historical SVG scenes (unused by current posts)

import { chromium } from "playwright";
import { access, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const W = 1200;
const H = 630;

const PALETTES = {
  indigo: ["#818cf8", "#22d3ee"],
  emerald: ["#34d399", "#22d3ee"],
  pink: ["#f472b6", "#a78bfa"],
  violet: ["#a78bfa", "#f472b6"],
  cyan: ["#22d3ee", "#6366f1"],
  green: ["#34d399", "#6366f1"],
};

// ---------------------------------------------------------------- primitives
const f = (n) => Number(n.toFixed(1));
// `extra` may override fill/stroke; never emit a duplicate attribute (invalid XML).
const card = (x, y, w, h, r = 20, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${/\bfill=/.test(extra) ? "" : 'fill="url(#glass)"'} ${/\bstroke=/.test(extra) ? "" : 'stroke="url(#edge)"'} stroke-width="1.5" ${extra}/>`;
const bar = (x, y, w, h = 10, fill = "rgba(255,255,255,.16)") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;
const accBar = (x, y, w, h = 10) => bar(x, y, w, h, "url(#acc)");
const dots = (x, y) =>
  [0, 1, 2]
    .map((i) => `<circle cx="${x + i * 16}" cy="${y}" r="4.5" fill="${["#f87171", "#fbbf24", "#4ade80"][i]}" opacity=".85"/>`)
    .join("");
// A gradient stroke (objectBoundingBox units) is not painted on a perfectly horizontal or
// vertical line, whose box has zero height or width, so nudge the end by a hair.
const line = (x1, y1, x2, y2, stroke = "url(#acc)", w = 3, dash = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2 === x1 && stroke.startsWith("url(") ? x2 + 0.01 : x2}" y2="${y2 === y1 && stroke.startsWith("url(") ? y2 + 0.01 : y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
const path = (d, stroke = "url(#acc)", w = 3, fill = "none", extra = "") =>
  `<path d="${d}" stroke="${stroke}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const circle = (cx, cy, r, fill = "url(#glass)", stroke = "url(#edge)", w = 1.5) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
const glowDot = (cx, cy, r = 7) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#accV)" filter="url(#glow)"/>`;
const check = (cx, cy, s = 1) =>
  path(`M${cx - 7 * s} ${cy} L${cx - 2 * s} ${cy + 6 * s} L${cx + 8 * s} ${cy - 6 * s}`, "#ffffff", 3.2 * s);
const arrow = (x1, y1, x2, y2, stroke = "url(#acc)", w = 3.5) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d) => f(x2 - 13 * Math.cos(a + d));
  const hy = (d) => f(y2 - 13 * Math.sin(a + d));
  return (
    line(x1, y1, x2, y2, stroke, w) +
    path(`M${hx(0.5)} ${hy(0.5)} L${x2} ${y2} L${hx(-0.5)} ${hy(-0.5)}`, stroke, w)
  );
};
const iconBadge = (cx, cy, r, inner) =>
  `<g>${circle(cx, cy, r, "rgba(8,12,20,.85)", "url(#edge)", 2)}${inner}</g>`;
const diamond = (cx, cy, s, stroke = "url(#acc)") =>
  path(`M${cx} ${cy - s} L${cx + s * 0.62} ${cy} L${cx} ${cy + s} L${cx - s * 0.62} ${cy} Z`, stroke, 3, "rgba(255,255,255,.05)") +
  path(`M${cx - s * 0.62} ${cy} L${cx} ${cy + s * 0.34} L${cx + s * 0.62} ${cy} M${cx} ${cy - s} L${cx} ${cy + s * 0.34}`, stroke, 2.2);
const bolt = (cx, cy, s = 1) =>
  path(
    `M${cx + 10 * s} ${cy - 34 * s} L${cx - 18 * s} ${cy + 6 * s} L${cx - 1 * s} ${cy + 6 * s} L${cx - 10 * s} ${cy + 34 * s} L${cx + 20 * s} ${cy - 8 * s} L${cx + 2 * s} ${cy - 8 * s} Z`,
    "url(#acc)",
    3,
    "rgba(255,255,255,.08)"
  );
const lock = (cx, cy, s = 1) =>
  `<rect x="${cx - 14 * s}" y="${cy - 2 * s}" width="${28 * s}" height="${22 * s}" rx="${5 * s}" fill="url(#glass)" stroke="url(#acc)" stroke-width="2.5"/>` +
  path(`M${cx - 8 * s} ${cy - 2 * s} V${cy - 9 * s} A${8 * s} ${8 * s} 0 0 1 ${cx + 8 * s} ${cy - 9 * s} V${cy - 2 * s}`, "url(#acc)", 2.5 * s);
const cube = (x, y, s = 60) =>
  card(x, y, s, s, 12) +
  path(`M${x + 12} ${y + 12} H${x + s - 12} V${y + s - 12} H${x + 12} Z`, "url(#acc)", 2.2) +
  path(`M${x + 12} ${y + 12} L${x + s - 12} ${y + s - 12} M${x + s - 12} ${y + 12} L${x + 12} ${y + s - 12}`, "rgba(255,255,255,.22)", 1.6);
const gauge = (cx, cy, r, pct, w = 14) => {
  const pt = (t) => [f(cx + r * Math.cos(Math.PI * (1 - t))), f(cy - r * Math.sin(Math.PI * (1 - t)))];
  const [sx, sy] = pt(0);
  const [ex, ey] = pt(1);
  const [px, py] = pt(pct);
  return (
    path(`M${sx} ${sy} A${r} ${r} 0 0 1 ${ex} ${ey}`, "rgba(255,255,255,.12)", w) +
    path(`M${sx} ${sy} A${r} ${r} 0 ${pct > 1 ? 1 : 0} 1 ${px} ${py}`, "url(#acc)", w)
  );
};
const ring = (cx, cy, r, pct, w = 10) => {
  const c = 2 * Math.PI * r;
  return (
    circle(cx, cy, r, "none", "rgba(255,255,255,.12)", w) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#acc)" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${f(c * pct)} ${f(c)}" transform="rotate(-90 ${cx} ${cy})"/>`
  );
};
// -------------------------------------------------------------------- scenes
const SCENES = {
  "wordpress-or-custom-website": {
    palette: "indigo",
    svg: () => `
      ${card(170, 150, 360, 330)}${dots(196, 178)}
      ${accBar(196, 210, 308, 56)}
      ${bar(196, 284, 140, 70)}${bar(352, 284, 152, 70)}
      ${bar(196, 372, 308, 12)}${bar(196, 396, 230, 12)}${bar(196, 430, 96, 24, "url(#acc)")}
      ${card(670, 150, 360, 330)}${dots(696, 178)}
      ${path("M742 262 L706 296 L742 330", "url(#acc)", 7)}${path("M820 262 L856 296 L820 330", "url(#acc)", 7)}${path("M798 250 L764 342", "rgba(255,255,255,.55)", 6)}
      ${bar(706, 374, 190, 11)}${bar(706, 398, 250, 11)}${accBar(706, 422, 120, 11)}
      ${iconBadge(600, 315, 44, arrow(578, 325, 622, 325, "#fff", 3) + arrow(622, 305, 578, 305, "#fff", 3))}`,
  },
  "google-seo-launch-checklist": {
    palette: "emerald",
    svg: () => `
      ${card(170, 140, 400, 350)}
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            circle(214, 200 + i * 72, 20, i < 3 ? "url(#accV)" : "rgba(255,255,255,.06)", "url(#edge)", 2) +
            (i < 3 ? check(214, 200 + i * 72, 0.9) : "") +
            bar(252, 190 + i * 72, 250 - i * 20, 12) +
            bar(252, 212 + i * 72, 160 - i * 14, 8, "rgba(255,255,255,.09)")
        )
        .join("")}
      ${circle(840, 300, 118, "rgba(255,255,255,.04)", "url(#acc)", 12)}
      ${line(924, 384, 990, 450, "url(#acc)", 18)}
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${778 + i * 26}" y="${340 - i * 20}" width="16" height="${50 + i * 20}" rx="5" fill="url(#accV)" opacity="${0.45 + i * 0.13}"/>`).join("")}
      ${arrow(776, 300, 900, 240, "#ffffff", 4)}`,
  },
  "practical-ai-automation": {
    palette: "pink",
    svg: () => {
      const nodes = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8 + 0.2;
        return [f(600 + Math.cos(a) * 250), f(315 + Math.sin(a) * 160)];
      });
      return `
      ${circle(600, 315, 205, "none", "rgba(255,255,255,.1)", 1.5)}
      ${circle(600, 315, 135, "none", "rgba(255,255,255,.07)", 1.5)}
      ${nodes.map(([x, y]) => line(600, 315, x, y, "url(#acc)", 2.2)).join("")}
      ${nodes.map(([x, y], i) => circle(x, y, i % 2 ? 20 : 26, "rgba(8,12,20,.9)", "url(#acc)", 3) + glowDot(x, y, 6)).join("")}
      ${card(520, 245, 160, 140, 28, 'filter="url(#glow)"')}
      ${card(540, 265, 120, 100, 20)}
      ${path("M600 285 L608 309 L632 315 L608 321 L600 345 L592 321 L568 315 L592 309 Z", "url(#acc)", 3, "rgba(255,255,255,.12)")}`;
    },
  },
  "nextjs-performance-app-router": {
    palette: "cyan",
    svg: () => `
      ${gauge(600, 400, 215, 0.86, 26)}
      ${Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        const a = Math.PI * (1 - t);
        const x1 = 600 + 245 * Math.cos(a);
        const y1 = 400 - 245 * Math.sin(a);
        const x2 = 600 + 262 * Math.cos(a);
        const y2 = 400 - 262 * Math.sin(a);
        return line(f(x1), f(y1), f(x2), f(y2), "rgba(255,255,255,.28)", 3);
      }).join("")}
      ${line(600, 400, 745, 262, "#ffffff", 8)}
      ${circle(600, 400, 28, "rgba(8,12,20,.95)", "url(#acc)", 7)}
      ${bolt(600, 250, 1.6)}
      ${card(250, 440, 190, 62, 16)}${bar(274, 460, 110, 10)}${accBar(274, 480, 70, 8)}
      ${card(760, 440, 190, 62, 16)}${bar(784, 460, 110, 10)}${accBar(784, 480, 140, 8)}`,
  },
  "tailwind-clean-ui-patterns": {
    palette: "cyan",
    svg: () => `
      ${card(200, 140, 380, 170)}
      ${card(228, 172, 150, 52, 26, 'fill="url(#accV)" stroke="none"')}${bar(396, 188, 142, 18)}
      ${bar(228, 250, 300, 12)}${bar(228, 274, 210, 12)}
      ${card(620, 140, 380, 170)}
      ${[0, 1].map((i) => card(654, 176 + i * 62, 88, 40, 20, i ? "" : 'fill="url(#accV)" stroke="none"') + circle(i ? 676 : 720, 196 + i * 62, 14, "#fff", "none")).join("")}
      ${bar(770, 190, 170, 12)}${bar(770, 252, 120, 12)}
      ${card(200, 340, 380, 150)}
      ${card(228, 370, 324, 50, 14, 'stroke="url(#acc)"')}${bar(246, 389, 130, 12)}${path("M392 382 V408", "#fff", 3)}
      ${accBar(228, 446, 120, 14)}
      ${card(620, 340, 380, 150)}
      ${circle(676, 415, 34, "url(#accV)", "none")}${bar(730, 392, 200, 14)}${bar(730, 420, 150, 11)}${bar(730, 442, 170, 11)}`,
  },
  "nodejs-clean-api-architecture": {
    palette: "green",
    svg: () => `
      ${card(330, 130, 540, 100)}${path("M370 180 H430 M410 160 L430 180 L410 200", "url(#acc)", 5)}${bar(470, 164, 160, 12)}${bar(470, 188, 110, 10, "rgba(255,255,255,.1)")}${accBar(740, 168, 100, 14)}
      ${card(330, 265, 540, 100)}${circle(400, 315, 26, "none", "url(#acc)", 5)}${circle(400, 315, 9, "url(#accV)", "none")}${bar(470, 299, 190, 12)}${bar(470, 323, 130, 10, "rgba(255,255,255,.1)")}${accBar(740, 303, 100, 14)}
      ${card(330, 400, 540, 100)}
      ${path("M372 428 A28 11 0 0 1 428 428 V470 A28 11 0 0 1 372 470 Z", "url(#acc)", 3.5, "rgba(255,255,255,.06)")}${path("M372 428 A28 11 0 0 0 428 428", "url(#acc)", 3.5)}
      ${bar(470, 434, 200, 12)}${bar(470, 458, 140, 10, "rgba(255,255,255,.1)")}${accBar(740, 438, 100, 14)}
      ${line(600, 230, 600, 265, "url(#acc)", 3, "6 8")}${line(600, 365, 600, 400, "url(#acc)", 3, "6 8")}${glowDot(600, 248, 6)}${glowDot(600, 383, 6)}
      ${arrow(150, 180, 318, 180, "url(#acc)", 4)}${arrow(882, 450, 1050, 450, "url(#acc)", 4)}`,
  },
  "mongodb-data-modeling": {
    palette: "green",
    svg: () => {
      const doc = (x, y, w, h, lines) =>
        card(x, y, w, h, 18) +
        path(`M${x + 28} ${y + 30} q-12 0 -12 12 v${h / 2 - 50} q0 12 -12 12 q12 0 12 12 v${h / 2 - 50} q0 12 12 12`, "url(#acc)", 3) +
        lines;
      return `
      ${line(430, 255, 520, 300, "url(#acc)", 3, "7 8")}${line(430, 395, 520, 340, "url(#acc)", 3, "7 8")}
      ${line(770, 300, 840, 255, "url(#acc)", 3, "7 8")}${line(770, 340, 840, 395, "url(#acc)", 3, "7 8")}
      ${doc(170, 175, 260, 160, `${bar(224, 205, 140, 11)}${accBar(224, 232, 90, 11)}${bar(224, 259, 120, 11)}${bar(224, 286, 100, 11)}`)}
      ${doc(170, 335, 260, 130, `${bar(224, 366, 130, 11)}${accBar(224, 393, 100, 11)}${bar(224, 420, 110, 11)}`)}
      ${card(520, 215, 250, 200, 22, 'filter="url(#glow)"')}
      ${doc(520, 215, 250, 200, `${accBar(574, 250, 130, 13)}${bar(574, 282, 110, 11)}${card(574, 308, 160, 70, 12, 'stroke="url(#acc)"')}${bar(592, 326, 90, 10)}${bar(592, 348, 120, 10, "rgba(255,255,255,.1)")}`)}
      ${doc(840, 175, 190, 130, `${bar(894, 208, 100, 11)}${accBar(894, 235, 70, 11)}${bar(894, 262, 90, 11)}`)}
      ${doc(840, 335, 190, 130, `${bar(894, 368, 100, 11)}${accBar(894, 395, 80, 11)}${bar(894, 422, 70, 11)}`)}`;
    },
  },
  "api-validation-security": {
    palette: "green",
    svg: () => `
      ${[0, 1, 2].map((i) => arrow(140, 230 + i * 80, 400, 250 + i * 60, i === 1 ? "#f87171" : "url(#acc)", 4)).join("")}
      ${[0, 2].map((i) => arrow(802, 250 + i * 60, 1060, 230 + i * 80, "url(#acc)", 4)).join("")}
      ${path("M600 120 L770 188 V320 C770 430 700 490 600 520 C500 490 430 430 430 320 V188 Z", "url(#acc)", 7, "rgba(255,255,255,.05)", 'filter="url(#glow)"')}
      ${path("M600 150 L744 207 V318 C744 410 684 461 600 488 C516 461 456 410 456 318 V207 Z", "rgba(255,255,255,.1)", 2, "rgba(8,12,20,.5)")}
      ${path("M540 318 L585 363 L664 270", "#ffffff", 14)}
      ${iconBadge(780, 470, 34, lock(780, 466, 0.9))}
      ${path("M396 332 L430 332", "#f87171", 4)}${path("M404 322 L420 342 M420 322 L404 342", "#f87171", 4)}`,
  },
  "solidity-contract-design": {
    palette: "violet",
    svg: () => `
      ${card(300, 120, 340, 390)}
      ${accBar(334, 156, 140, 14)}${bar(494, 156, 110, 14)}
      ${bar(334, 200, 180, 11)}${bar(354, 226, 210, 11, "url(#acc)")}${bar(354, 252, 150, 11)}${bar(334, 278, 70, 11)}
      ${bar(334, 322, 220, 11)}${bar(354, 348, 170, 11, "url(#acc)")}${bar(354, 374, 200, 11)}${bar(334, 400, 70, 11)}
      ${bar(334, 444, 150, 11)}${bar(354, 468, 120, 11, "url(#acc)")}
      ${iconBadge(640, 160, 38, lock(640, 156, 1))}
      ${line(682, 315, 760, 315, "url(#acc)", 3, "6 8")}
      ${circle(850, 315, 130, "none", "rgba(255,255,255,.1)", 1.5)}
      ${diamond(850, 315, 100)}
      ${glowDot(760, 315, 7)}${glowDot(912, 215, 5)}${glowDot(790, 420, 5)}`,
  },
  "hardhat-testing-deploy": {
    palette: "violet",
    svg: () => `
      ${card(150, 150, 380, 330)}
      ${[0, 1, 2, 3].map((i) => circle(200, 215 + i * 70, 20, i === 3 ? "rgba(255,255,255,.06)" : "url(#accV)", "url(#edge)", 2) + (i === 3 ? path("M190 215 L210 215", "#fff", 0) : check(200, 215 + i * 70, 0.9)) + bar(238, 206 + i * 70, 230 - i * 24, 12) + bar(238, 228 + i * 70, 130 - i * 8, 8, "rgba(255,255,255,.09)")).join("")}
      ${arrow(548, 315, 650, 315, "url(#acc)", 5)}
      ${[0, 1, 2].map((i) => cube(690 + i * 125, 285, 70)).join("")}
      ${[0, 1].map((i) => line(760 + i * 125, 320, 815 + i * 125, 320, "url(#acc)", 4)).join("")}
      ${glowDot(725, 320, 6)}${glowDot(975, 320, 6)}`,
  },
  "ethersjs-wallets-transactions": {
    palette: "violet",
    svg: () => `
      ${card(150, 190, 330, 250, 28)}
      ${card(150, 190, 330, 90, 28, 'fill="rgba(255,255,255,.06)"')}${accBar(190, 226, 130, 14)}${bar(190, 250, 90, 9)}
      ${diamond(420, 235, 26)}
      ${bar(190, 330, 250, 12)}${bar(190, 358, 180, 12)}
      ${card(400, 340, 110, 56, 18, 'filter="url(#glow)"')}${circle(440, 368, 12, "url(#accV)", "none")}
      ${arrow(500, 300, 700, 300, "url(#acc)", 4)}
      ${card(540, 268, 130, 64, 14)}${bar(560, 288, 70, 10)}${accBar(560, 308, 50, 9)}
      ${path("M640 318 q10 -14 20 0", "url(#acc)", 3)}
      ${circle(800, 300, 62, "rgba(8,12,20,.9)", "url(#acc)", 4)}${diamond(800, 300, 30)}
      ${circle(960, 300, 62, "rgba(8,12,20,.9)", "url(#acc)", 4)}${diamond(960, 300, 30)}
      ${arrow(866, 300, 892, 300, "url(#acc)", 3)}
      ${[0, 1, 2].map((i) => circle(800 + i * 80, 410, 16, i === 0 ? "url(#accV)" : "rgba(255,255,255,.07)", "url(#edge)", 2)).join("")}
      ${line(816, 410, 864, 410, "url(#acc)", 3, "5 6")}${line(896, 410, 944, 410, "url(#acc)", 3, "5 6")}${check(800, 410, 0.55)}`,
  },
  "frontend-backend-api-contracts": {
    palette: "cyan",
    svg: () => `
      ${card(130, 160, 360, 310)}${dots(156, 188)}
      ${accBar(156, 220, 308, 50)}${bar(156, 288, 140, 80)}${bar(312, 288, 152, 80)}${bar(156, 386, 308, 12)}${bar(156, 410, 200, 12)}
      ${[0, 1, 2].map((i) => card(720, 160 + i * 106, 350, 90, 16) + circle(758, 205 + i * 106, 7, "#34d399", "none") + circle(780, 205 + i * 106, 7, "url(#acc)", "none") + bar(810, 199 + i * 106, 200, 12)).join("")}
      ${arrow(506, 265, 704, 265, "url(#acc)", 4)}${arrow(704, 365, 506, 365, "url(#acc)", 4)}
      ${iconBadge(605, 315, 48, path("M594 292 q-12 0 -12 12 v6 q0 12 -12 12 q12 0 12 12 v6 q0 12 12 12 M616 292 q12 0 12 12 v6 q0 12 12 12 q-12 0 -12 12 v6 q0 12 -12 12", "url(#acc)", 4.5))}`,
  },
  "fast-seo-websites": {
    palette: "emerald",
    svg: () => `
      ${card(210, 130, 780, 380, 24)}${dots(244, 162)}${bar(330, 154, 360, 16, "rgba(255,255,255,.08)")}
      ${[0, 1, 2].map((i) => ring(340 + i * 260, 330, 70, [0.97, 1, 0.94][i], 14) + glowDot(340 + i * 260, 330, 9)).join("")}
      ${[0, 1, 2].map((i) => bar(285 + i * 260, 432, 110, 10, "rgba(255,255,255,.16)") + accBar(305 + i * 260, 454, 70, 8)).join("")}
      ${bolt(960, 120, 1.3)}`,
  },
  "smart-contracts-web3-dex-cex-guide": {
    palette: "violet",
    svg: () => `
      ${card(130, 140, 400, 350)}${bar(160, 170, 90, 12, "rgba(255,255,255,.2)")}
      ${[0, 1, 2, 3].map((i) => `<rect x="${f(500 - (90 + i * 50))}" y="${200 + i * 28}" width="${90 + i * 50}" height="18" rx="6" fill="#f472b6" opacity="${0.35 + i * 0.12}"/>`).join("")}
      ${line(150, 320, 510, 320, "rgba(255,255,255,.3)", 2, "4 6")}
      ${[0, 1, 2, 3].map((i) => `<rect x="${f(500 - (200 - i * 45))}" y="${344 + i * 28}" width="${200 - i * 45}" height="18" rx="6" fill="#22d3ee" opacity="${0.75 - i * 0.12}"/>`).join("")}
      ${card(670, 140, 400, 350)}
      ${path("M710 450 V190 M710 450 H1030", "rgba(255,255,255,.28)", 3)}
      ${path("M730 215 C760 360 850 420 1020 438", "url(#acc)", 6)}
      ${circle(780, 365, 16, "url(#accV)", "none")}${circle(900, 418, 12, "#fff", "none", 0)}
      ${path("M780 365 L780 450 M780 365 L710 365", "rgba(255,255,255,.2)", 2, "none", 'stroke-dasharray="5 6"')}
      ${iconBadge(600, 315, 50, path("M582 305 H616 M606 295 L616 305 L606 315 M618 327 H584 M594 317 L584 327 L594 337", "#fff", 4))}
      ${glowDot(530, 315, 6)}${glowDot(670, 315, 6)}`,
  },
  "erp-system-guide-buy-or-build": {
    palette: "indigo",
    svg: () => {
      const tiles = [
        [210, 140, "bars"],
        [545, 110, "boxes"],
        [880, 140, "cart"],
        [210, 395, "people"],
        [545, 420, "coin"],
        [880, 395, "gear"],
      ];
      const glyph = (kind, x, y) => {
        const cx = x + 55;
        const cy = y + 43;
        if (kind === "bars") return [0, 1, 2, 3].map((i) => `<rect x="${cx - 30 + i * 17}" y="${cy + 18 - (10 + i * 9)}" width="11" height="${10 + i * 9}" rx="3" fill="url(#accV)"/>`).join("");
        if (kind === "boxes") return cube(cx - 26, cy - 26, 52);
        if (kind === "cart") return path(`M${cx - 30} ${cy - 22} H${cx - 18} L${cx - 8} ${cy + 12} H${cx + 22} L${cx + 30} ${cy - 10} H${cx - 14}`, "url(#acc)", 4) + circle(cx - 4, cy + 26, 5, "#fff", "none", 0) + circle(cx + 18, cy + 26, 5, "#fff", "none", 0);
        if (kind === "people") return circle(cx - 14, cy - 8, 12, "none", "url(#acc)", 4) + path(`M${cx - 38} ${cy + 26} q24 -34 48 0`, "url(#acc)", 4) + circle(cx + 20, cy - 4, 9, "none", "url(#acc)", 3.5);
        if (kind === "coin") return circle(cx, cy, 26, "none", "url(#acc)", 4.5) + path(`M${cx - 9} ${cy + 8} q9 12 18 0 q-6 -6 -9 -9 q-9 -6 0 -14 q9 -4 9 5`, "#fff", 3);
        return circle(cx, cy, 14, "none", "url(#acc)", 4.5) + Array.from({ length: 8 }, (_, i) => { const a = (Math.PI / 4) * i; return line(f(cx + 21 * Math.cos(a)), f(cy + 21 * Math.sin(a)), f(cx + 30 * Math.cos(a)), f(cy + 30 * Math.sin(a)), "url(#acc)", 5); }).join("");
      };
      return `
      ${tiles.map(([x, y]) => line(x + 55, y + 43, 600, 315, "url(#acc)", 2.5, "6 8")).join("")}
      ${tiles.map(([x, y, k]) => card(x, y, 110, 86, 18) + glyph(k, x, y)).join("")}
      ${circle(600, 315, 92, "rgba(8,12,20,.9)", "url(#acc)", 5)}
      ${circle(600, 315, 62, "none", "rgba(255,255,255,.2)", 2)}
      ${glowDot(600, 315, 22)}${circle(600, 315, 9, "#fff", "none", 0)}`;
    },
  },
  "smart-contract-erp-crm-integration": {
    palette: "violet",
    svg: () => `
      ${[0, 1, 2].map((i) => cube(130 + i * 100, 285, 64)).join("")}
      ${[0, 1].map((i) => line(194 + i * 100, 317, 230 + i * 100, 317, "url(#acc)", 4)).join("")}
      ${diamond(215, 190, 38)}${diamond(215, 445, 30)}
      ${arrow(440, 317, 520, 317, "url(#acc)", 5)}
      ${path("M545 440 V250 C545 190 640 190 640 250 V440", "url(#acc)", 9, "none", 'filter="url(#glow)"')}
      ${path("M560 440 V255 C560 210 625 210 625 255 V440", "rgba(255,255,255,.12)", 3)}
      ${glowDot(592, 245, 8)}${glowDot(592, 320, 6)}${glowDot(592, 395, 6)}
      ${arrow(660, 317, 740, 317, "url(#acc)", 5)}
      ${card(760, 130, 320, 370, 22)}${dots(786, 160)}
      ${[0, 1, 2].map((i) => card(786 + i * 98, 190, 88, 130, 12, 'stroke="url(#acc)" opacity=".95"') + `<rect x="${798 + i * 98}" y="204" width="64" height="12" rx="6" fill="url(#acc)"/>` + card(798 + i * 98, 232, 64, 28, 8) + (i < 2 ? card(798 + i * 98, 270, 64, 28, 8) : "")).join("")}
      ${[0, 1, 2].map((i) => bar(786, 350 + i * 40, 280 - i * 40, 12, i === 0 ? "url(#acc)" : "rgba(255,255,255,.14)") + circle(1052, 356 + i * 40, 7, i === 2 ? "rgba(255,255,255,.14)" : "#34d399", "none", 0)).join("")}`,
  },
  "future-of-ai-and-blockchain-in-iran": {
    palette: "indigo",
    svg: () => {
      // A neural network (AI) and a block chain meeting at a Persian eight-pointed star (shamseh).
      const layers = [
        [175, [205, 315, 425]],
        [290, [165, 260, 370, 465]],
        [405, [225, 315, 405]],
      ];
      const links = [];
      for (let l = 0; l < layers.length - 1; l += 1) {
        const [x1, ys1] = layers[l];
        const [x2, ys2] = layers[l + 1];
        for (const y1 of ys1) for (const y2 of ys2) links.push(line(x1, y1, x2, y2, "rgba(255,255,255,.14)", 1.6));
      }
      const nodes = layers.flatMap(([x, ys]) => ys.map((y) => circle(x, y, 15, "rgba(8,12,20,.92)", "url(#acc)", 3) + glowDot(x, y, 5)));
      const square = (cx, cy, r, rot, stroke, w, fill) =>
        `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="6" transform="rotate(${rot} ${cx} ${cy})" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
      const star = (cx, cy, r, stroke, w, fill = "none") => square(cx, cy, r, 0, stroke, w, fill) + square(cx, cy, r, 45, stroke, w, fill);
      return `
      ${links.join("")}
      ${nodes.join("")}
      ${line(422, 315, 484, 315, "#818cf8", 3, "6 8")}
      ${circle(600, 315, 150, "none", "rgba(255,255,255,.08)", 1.5)}
      ${star(600, 315, 80, "url(#acc)", 5, "rgba(255,255,255,.04)")}
      ${star(600, 315, 54, "rgba(255,255,255,.22)", 2)}
      ${circle(600, 315, 34, "rgba(8,12,20,.92)", "url(#edge)", 2)}
      ${glowDot(600, 315, 16)}${circle(600, 315, 6, "#fff", "none", 0)}
      ${line(716, 315, 760, 315, "#22d3ee", 3, "6 8")}
      ${[0, 1, 2].map((i) => cube(770 + i * 95, 283, 64)).join("")}
      ${[0, 1].map((i) => line(834 + i * 95, 315, 865 + i * 95, 315, "#22d3ee", 4)).join("")}
      ${line(897, 230, 897, 280, "rgba(255,255,255,.28)", 2.5, "5 7")}${line(897, 350, 897, 397, "rgba(255,255,255,.28)", 2.5, "5 7")}
      ${diamond(897, 190, 34)}
      ${card(770, 400, 254, 72, 16)}${accBar(794, 422, 120, 11)}${bar(794, 444, 180, 9)}
      ${glowDot(484, 315, 6)}${glowDot(716, 315, 6)}`;
    },
  },
};

// ------------------------------------------------------------------ rendering
function sceneMarkup(slug, scale = 1) {
  const scene = SCENES[slug];
  const [c1, c2] = PALETTES[scene.palette];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * scale}" height="${H * scale}">
  <defs>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <linearGradient id="accV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity=".03"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="${c2}" stop-opacity=".45"/></linearGradient>
    <radialGradient id="blobA" cx=".12" cy=".08" r=".7"><stop offset="0" stop-color="${c1}" stop-opacity=".34"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></radialGradient>
    <radialGradient id="blobB" cx=".92" cy=".95" r=".7"><stop offset="0" stop-color="${c2}" stop-opacity=".30"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".045"/></pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#090d12"/>
  <rect width="${W}" height="${H}" fill="url(#blobA)"/>
  <rect width="${W}" height="${H}" fill="url(#blobB)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  ${scene.svg()}
</svg>`;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
      args[key] = value;
      if (value !== "true") i += 1;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.legacy) {
    const manifest = JSON.parse(await readFile(new URL("./blog-art-manifest.json", import.meta.url), "utf8"));
    const assets = args.only ? manifest.assets.filter((asset) => asset.slug === args.only) : manifest.assets;
    if (!assets.length) throw new Error(`Unknown cover: ${args.only}`);
    for (const asset of assets) await access(resolve(process.cwd(), asset.output));
    if (!args.sheet) {
      console.log(`Verified ${assets.length} ImageGen covers (${manifest.width}x${manifest.height}). Prompts: scripts/blog-art-manifest.json`);
      return;
    }
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
      const cells = await Promise.all(assets.map(async (asset) => {
        const data = (await readFile(resolve(process.cwd(), asset.output))).toString("base64");
        return `<figure style="margin:0"><img width="300" height="158" src="data:image/jpeg;base64,${data}"/><figcaption style="overflow-wrap:anywhere;color:#bbb;font:12px sans-serif">${asset.slug}</figcaption></figure>`;
      }));
      await page.setContent(`<body style="margin:12px;background:#090d12"><div style="display:grid;grid-template-columns:repeat(4,300px);gap:12px">${cells.join("")}</div></body>`);
      const out = resolve(process.cwd(), args.sheet);
      await mkdir(dirname(out), { recursive: true });
      await page.screenshot({ path: out, fullPage: true });
      console.log("Sheet saved:", out);
    } finally {
      await browser.close();
    }
    return;
  }
  const slugs = args.only ? [args.only] : Object.keys(SCENES);
  for (const slug of slugs) {
    if (!SCENES[slug]) throw new Error(`Unknown scene: ${slug}`);
  }
  const browser = await chromium.launch();
  try {
    if (args.sheet) {
      const page = await browser.newPage({ viewport: { width: 1640, height: 1000 } });
      const cells = Object.keys(SCENES)
        .map((slug) => `<figure style="margin:0"><div style="border:1px solid #333"><img width="${W * 0.33}" height="${H * 0.33}" src="data:image/svg+xml;base64,${Buffer.from(sceneMarkup(slug)).toString("base64")}"/></div><figcaption style="color:#aaa;font:12px sans-serif">${slug}</figcaption></figure>`)
        .join("");
      await page.setContent(`<body style="margin:12px;background:#000"><div style="display:grid;grid-template-columns:repeat(4,400px);gap:10px">${cells}</div></body>`);
      const out = resolve(process.cwd(), args.sheet);
      await mkdir(dirname(out), { recursive: true });
      await page.screenshot({ path: out, fullPage: true });
      console.log("Sheet saved:", out);
      return;
    }
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    for (const slug of slugs) {
      await page.setContent(`<body style="margin:0;background:#090d12">${sceneMarkup(slug)}</body>`);
      const out = resolve(process.cwd(), `public/blog/${slug}.jpg`);
      await mkdir(dirname(out), { recursive: true });
      await page.screenshot({ path: out, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: W, height: H } });
      console.log("Saved", out);
    }
  } finally {
    await browser.close();
  }
}

await main();
