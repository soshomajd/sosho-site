// Generates an on-brand, text-free blog cover image (1200x630) with Playwright.
// No external AI/image API needed — pure HTML/CSS rendered to PNG, reusing the
// same gradient/grid language as the Hero and About sections.
//
// Usage:
//   node scripts/generate-cover.mjs --slug "my-post-slug" --tag "SEO"
//   node scripts/generate-cover.mjs --slug "my-post-slug" --tag "AI" --out public/blog/custom-name.png

import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

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

const COLOR_PAIRS = [
    { match: ["seo", "geo", "aeo", "google", "website"], from: "#34d399", to: "#22d3ee" },
    { match: ["ai", "automation"], from: "#f472b6", to: "#a78bfa" },
    { match: ["wordpress", "strategy"], from: "#818cf8", to: "#6366f1" },
    { match: ["web3", "blockchain", "solidity", "hardhat", "ethers"], from: "#a78bfa", to: "#f472b6" },
    { match: ["next.js", "frontend", "ui/ux", "tailwind"], from: "#22d3ee", to: "#6366f1" },
    { match: ["node.js", "backend", "mongodb", "security"], from: "#6366f1", to: "#34d399" },
];
const DEFAULT_PAIR = { from: "#22d3ee", to: "#6366f1" };

function pickColorPair(tag) {
    const needle = (tag ?? "").toLowerCase();
    return COLOR_PAIRS.find((pair) => pair.match.some((m) => needle.includes(m))) ?? DEFAULT_PAIR;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const slug = args.slug;
    if (!slug) {
        console.error("Usage: node scripts/generate-cover.mjs --slug <slug> --tag <tag> [--out <path>]");
        process.exit(1);
    }
    const tag = args.tag ?? "";
    const outPath = resolve(process.cwd(), args.out ?? `public/blog/${slug}.png`);
    const { from, to } = pickColorPair(tag);

    const markSvg = await readFile(resolve(process.cwd(), "public/sosho-mark.svg"), "utf8");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    background: linear-gradient(180deg, #0b0f14 0%, #090d12 100%);
    font-family: "Segoe UI", Tahoma, Arial, sans-serif;
  }
  .blob {
    position: absolute;
    border-radius: 999px;
    filter: blur(64px);
  }
  .blob-a { width: 520px; height: 520px; top: -160px; right: -120px; background: ${to}; opacity: 0.28; }
  .blob-b { width: 460px; height: 460px; bottom: -180px; left: -100px; background: ${from}; opacity: 0.22; }
  .grid {
    position: absolute;
    inset: 0;
    opacity: 0.14;
    background-image:
      linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
    background-size: 48px 48px;
    -webkit-mask-image: radial-gradient(ellipse at center, black, transparent 72%);
    mask-image: radial-gradient(ellipse at center, black, transparent 72%);
  }
  .eyebrow {
    position: absolute;
    top: 56px;
    left: 64px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .eyebrow .rule { width: 32px; height: 1px; background: linear-gradient(90deg, ${to}, ${from}); }
  .eyebrow span {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: ${to};
    text-transform: uppercase;
  }
  .tag {
    position: absolute;
    top: 52px;
    right: 64px;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1px solid rgba(229,231,235,0.14);
    background: rgba(17,24,39,0.55);
    color: rgba(229,231,235,0.85);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .badge {
    position: relative;
    width: 260px;
    height: 260px;
    border-radius: 48px;
    border: 1px solid rgba(229,231,235,0.15);
    background: rgba(11,15,20,0.65);
    box-shadow: 0 0 120px ${to}33, 0 0 0 1px rgba(255,255,255,0.03) inset;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ring { position: absolute; border-radius: 999px; border: 1px solid; }
  .ring-a { inset: -34px; border-color: ${to}33; }
  .ring-b { inset: -68px; border-color: ${from}22; }
  .mark { width: 148px; height: 148px; }
  .footer {
    position: absolute;
    bottom: 48px;
    left: 64px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(156,163,175,0.85);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .footer .dot { width: 6px; height: 6px; border-radius: 999px; background: ${to}; }
</style>
</head>
<body>
  <div class="blob blob-a"></div>
  <div class="blob blob-b"></div>
  <div class="grid"></div>

  <div class="eyebrow"><span class="rule"></span><span>SOSHO STUDIO</span></div>
  ${tag ? `<div class="tag">${tag}</div>` : ""}

  <div class="center">
    <div class="badge">
      <span class="ring ring-a"></span>
      <span class="ring ring-b"></span>
      <span class="mark">${markSvg.replace("<svg ", '<svg style="width:100%;height:100%" ')}</span>
    </div>
  </div>

  <div class="footer"><span class="dot"></span>sosho.studio</div>
</body>
</html>`;

    await mkdir(dirname(outPath), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.screenshot({ path: outPath });
    await browser.close();

    console.log(`Cover saved: ${outPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
