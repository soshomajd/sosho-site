import { PALETTE } from "./palette";

type Rgb = [number, number, number];

const parse = (hex: string): Rgb => {
  const value = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Theme palette: "${hex}" is not a six-digit hex colour.`);
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb;
};
const toHex = (rgb: Rgb) => `#${rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0")).join("")}`;
const mix = (a: Rgb, b: Rgb, amount: number): Rgb => a.map((c, i) => c + (b[i] - c) * amount) as Rgb;

// WCAG 2 relative luminance and contrast ratio.
const luminance = (rgb: Rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

/** Moves `color` toward `target` in small steps until it reaches `ratio` against every background. */
const readable = (color: Rgb, backgrounds: Rgb[], ratio: number, target: Rgb): Rgb => {
  for (let step = 0; step <= 50; step += 1) {
    const candidate = mix(color, target, step / 50);
    if (backgrounds.every((bg) => contrast(candidate, bg) >= ratio)) return candidate;
  }
  return mix(color, target, 1);
};

function derive({ colors, mode }: typeof PALETTE) {
  const [darkest, darker, lighter, lightest] = colors.map(parse).sort((a, b) => luminance(a) - luminance(b));
  const light = mode === "light";
  // Text moves toward black on a light theme and toward white on a dark one.
  const ink = light ? BLACK : WHITE;

  const background = light ? mix(lightest, WHITE, 0.72) : mix(darkest, BLACK, 0.78);
  const surface = light ? mix(lightest, WHITE, 0.3) : mix(darkest, BLACK, 0.55);
  const grounds = [background, surface];
  const foreground = light ? mix(darkest, BLACK, 0.6) : mix(lightest, WHITE, 0.55);
  const muted = readable(mix(light ? darkest : lightest, darker, 0.5), grounds, 4.5, ink);
  // Buttons put background-coloured text on the primary colour, so the same pair must read.
  const primary = readable(light ? darkest : lighter, [background], 4.5, ink);
  const accent = readable(darker, grounds, 4.5, ink);
  // Decorative tint for icons and the floating WhatsApp button: non-text contrast (3:1).
  const sage = readable(light ? lighter : lightest, [background], 3, ink);
  const status = light
    ? { success: parse("#3d6b35"), warning: parse("#8a5300"), danger: parse("#b3261e") }
    : { success: parse("#a9bfa3"), warning: parse("#d8ae82"), danger: parse("#e0a09a") };

  const tokens = {
    background,
    surface,
    primary,
    accent,
    sage,
    foreground,
    muted,
    success: readable(status.success, grounds, 4.5, ink),
    warning: readable(status.warning, grounds, 4.5, ink),
    danger: readable(status.danger, grounds, 4.5, ink),
  };

  const checks: [string, Rgb, Rgb, number][] = [
    ["foreground on background", tokens.foreground, background, 7],
    ["foreground on surface", tokens.foreground, surface, 4.5],
    ["muted on surface", tokens.muted, surface, 4.5],
    ["button text on primary", background, tokens.primary, 4.5],
    ["accent on background", tokens.accent, background, 4.5],
  ];
  const failed = checks.filter(([, a, b, ratio]) => contrast(a, b) < ratio);
  if (failed.length) {
    throw new Error(
      `Theme palette ${colors.join(", ")} (${mode}) is not readable: ${failed
        .map(([name, a, b, ratio]) => `${name} ${contrast(a, b).toFixed(2)}:1 < ${ratio}:1`)
        .join("; ")}. Try the other mode or a palette with a darker and a lighter colour.`,
    );
  }

  return Object.fromEntries(Object.entries(tokens).map(([name, rgb]) => [name, toHex(rgb)])) as Record<keyof typeof tokens, string>;
}

export const THEME_MODE = PALETTE.mode;
export const THEME = derive(PALETTE);
/** Logo files with dark lettering for light themes and light lettering for dark ones. */
export const LOGO =
  THEME_MODE === "light"
    ? { horizontal: { src: "/brand/logo-horizontal-dark.webp", width: 701, height: 200 }, full: { src: "/brand/logo-full-dark.webp", width: 827, height: 640 } }
    : { horizontal: { src: "/brand/logo-horizontal-light.webp", width: 694, height: 200 }, full: { src: "/brand/logo-full-light.webp", width: 824, height: 640 } };

/** Overrides the @theme defaults in globals.css; rendered unlayered in <head>, so it always wins. */
export const THEME_CSS = `:root{color-scheme:${THEME_MODE};${Object.entries(THEME)
  .map(([name, value]) => `--color-${name}:${value}`)
  .join(";")}}`;
