/**
 * The site's colour palette: the only place to change when the brand colours change.
 *
 * - `colors`: four hex colours in any order (for example straight from a palette site).
 * - `mode`: "light" builds a light background from the lightest colour and dark text from the
 *   darkest; "dark" does the reverse.
 *
 * Every theme colour (background, cards, text, buttons, links, status colours, browser
 * theme colour) is derived from these in `tokens.ts`, which also darkens or lightens
 * a colour until its text is readable. A palette that still cannot reach readable contrast
 * fails the build with a message instead of shipping. Run `npm run build` after a change.
 */
export const PALETTE: { colors: [string, string, string, string]; mode: "light" | "dark" } = {
  colors: ["#6F4E37", "#A67B5B", "#ECB176", "#FED8B1"],
  mode: "light",
};
