# Portfolio hero views — October 26, 2026

The approved portfolio order is shared by `Projects/showcase.ts`: three real websites, then ten original concepts. The homepage renders only the first five (Tino, Wallpaper Consortium, Niroo Tejarat, Sepid, Nova). `/fa/projectcs` and `/en/projectcs` render the remaining eight in order. The route spelling is intentional. Concepts retain bilingual descriptions, interface-language labels and a Design concept badge, with no external anchors or delivered-client claims; from October 27 each concept card and ribbon tile links to its own page.

## Images and provenance

- `public/projects/hero/` contains 39 hero-only WebP images and 13 desktop thumbnails. The full views total 4,482,486 bytes; thumbnails total 569,312 bytes. Every full image is at most 159,408 bytes.
- Nine real screenshots were captured with Playwright from the public websites at desktop 1440×900, tablet 820×1180 and mobile 390×844. Captures include navigation and the first hero only, preserving their natural height. `scripts/project-hero-captures.json` records URLs and readiness checks.
- Niroo Tejarat's working www address was used. The active mechanical hero image was fully loaded and decoded before capture in all three sizes. Its very long scroll stage was not captured as a full section.
- Thirty concept images were made with the built-in `image_gen` tool, one call per rendition, referencing the approved original design. Tablet/mobile are separate compositions of the same identity, rather than desktop crops. Nova tablet and Narvan desktop received targeted edits to remove secondary bottom sections.
- Prompts and those correction prompts: `scripts/project-hero-art-manifest.json`. Final dimensions, sizes and provenance: `scripts/project-hero-assets.json`. Earlier approved concept images remain as design references.
- `node scripts/build-project-heroes.mjs <ignored-source-map.json>` optimizes selected PNGs and real captures, generates desktop thumbnails, and writes `Projects/hero-views.ts`. Local source paths remain in ignored task artifacts.

## Rendering and SEO

`DeviceViews.tsx` is a Server Component. All three complete images, labels and alt text are present in the static HTML. Intrinsic image dimensions reserve space; CSS uses natural image height without clipping. Desktop presents three frames side by side; mobile puts desktop above tablet/mobile. All views load lazily. The ribbon now uses thumbnails from these same hero images.

The archive is a static bilingual CollectionPage with breadcrumbs, canonical/alternate URLs, Open Graph, Twitter metadata and an ItemList of design concepts. Both localized routes are in the sitemap and llms index. Existing case-study slugs remain intact and now use the new desktop/tablet/mobile captures. The live Niroo link uses www.

No client component, animation dependency or JavaScript was added. The homepage interaction chunk remains 6,228 bytes gzip; the full initial script list remains 193,967 bytes gzip including Next/React. Archive cards flow normally. Homepage stacking is enabled only on roomy screens; reduced motion disables it.

The five-card stacking effect is restored at desktop viewports from 1024×760. The previous below-1000px-height override was removed. Each of the five cards now has a distinct sticky offset (100–140px) and receding scale (0.92–1). Device-frame widths adapt to available viewport height using their intrinsic image ratios, keeping complete hero images visible. No JavaScript is needed for this layout or its scroll animation. The eight archive cards retain normal flow.

## Verification

- ESLint passed. All 161 runtime tests passed in 12 files. The existing nonfatal Windows static-analysis sandbox warnings remain unchanged.
- Production build and TypeScript passed: 110 static routes. Static audit checked 92 localized HTML pages and 184 JSON-LD blocks, including correct canonical/alternates, one H1 and initial language/direction.
- Playwright checked Persian and English, desktop, tablet, 320/390px mobile, reduced motion and JavaScript disabled. The homepage has 5 cards / 15 views; the archive has 8 cards / 24 views, in the approved order. All images decode, remain visible without cropping and have no horizontal overflow. Concept cards contain zero links.
- The home archive CTA navigates correctly; language switching preserves `/projectcs`. Both new URLs are present in sitemap and llms output.
- The portrait remains fixed while only its pupils move. Native ribbon pause still works. Archive cards remain in normal flow even with motion enabled.
- Restored stacking was checked in both languages at 1440×900, 1280×800 and 1024×768. All five cards pin with distinct offsets, overlap during scrolling and fit completely in the viewport. Mobile, reduced motion and the eight archive cards retain normal flow. Complete image aspect ratios and CSS stacking also work with JavaScript disabled; the initial script size is unchanged. ESLint, TypeScript/static build and the 92-page SEO audit passed again after this correction.
- Wrangler dry-run passed with 1,386 client assets and no publication. Local preview: `http://127.0.0.1:3007/fa` and `/fa/projectcs` (English equivalents also available).

This update has not been deployed to production.
