# Project gallery expansion — October 26, 2026

The portfolio contains three existing real projects and ten original design concepts. The latest layout shows five on the homepage and eight on the localized `/projectcs` route, each with desktop, tablet and mobile hero views; see [the responsive hero update](PROJECT_HERO_VIEWS_2026-10-26.md). The concepts have dedicated bilingual titles, service labels, descriptions, feature lists and alt text, with a small "Design concept" label. They have no external URLs or invented delivery/results claims; since October 27 each has its own detail page (see the update at the end of this file). The actual case-study dataset and its three routes remain intact.

## Art direction and assets

The user requested visual variety and ambitious motion-graphics/3D art direction, rather than repeated template layouts with different colors. The initial conventional mockups were discarded. The final ten selected images were generated with the built-in `image_gen` tool, one call per image. They are static UI/website concepts with cinematic art direction, not ten implemented live websites or animated videos.

Prompts, bilingual metadata and the language of each interface: `scripts/project-concepts-manifest.json`. Display data: `src/app/components/Projects/concepts.ts`. Final full-size assets: `public/projects/concepts/<slug>.webp`; gallery versions: `<slug>-thumb.webp`.

| Interface | Language | Distinct design direction |
| --- | --- | --- |
| Sepid medical | Persian / RTL | Cinematic glass heart, flowing light, large Persian typography |
| Nova beauty | Persian / RTL | Floating cosmetics, liquid chrome, asymmetric fashion storefront |
| Didar admin | Persian / RTL | Dark operations command center, order-routing globe and heatmaps |
| Taraz finance | Persian / RTL | Light horizontal workspace, dimensional cash-flow ribbons |
| Ark architecture | Persian / RTL | Brutalist typography, angular masks and monumental architecture |
| Narvan dining | Persian / RTL | Orbital food composition, burgundy palette and vertical menu |
| OrbitDEX | English / LTR | Trading terminal, holographic liquidity, chart and swap modules |
| Vaulta wallet | English / LTR | Ivory editorial typography, chrome vault ring, translucent asset card |
| MetricFlow | English / LTR | Cobalt billboard typography, dimensional data ribbon and dashboard |
| Nomad House | English / LTR | Cinematic destination collage and editorial booking rail |

Full images are 1200×750 WebP, 81,670–148,882 bytes each; thumbnails are 720×450, 28,680–52,574 bytes. The ten full images total 1,152,590 bytes and their ten thumbnails total 386,174 bytes. `scripts/build-project-concepts.mjs <source-map.json>` optimizes selected generated PNGs and also creates 720×450 previews of the three actual homepage captures. Source maps containing local generated-image paths stay in ignored task artifacts.

## Gallery and rendering

`WorkRibbon.tsx` interleaves 13 unique items into two opposite-moving rows. It uses small thumbnails, lazy loading and low fetch priority. A second aria-hidden copy of each row provides a seamless CSS loop; it is not counted as additional portfolio work. A labeled native checkbox pauses motion without client JavaScript; hover/focus also pause. Reduced motion removes animation and duplicate rows and permits native horizontal browsing. `HomeMotion` uses only an intersection observer to pause the gallery off-screen; the old gallery scroll listener has been removed.

The main project section initially contained 13 server-rendered cards and is now split into five home cards and eight archive cards. Sticky offsets are capped on roomy home viewports; archive cards flow normally. The ten concept cards link only to their own detail page, never to an external site. Actual project links and service/article routes remain intact. Homepage sitemap freshness was updated to October 26.

## Initial gallery verification (before the responsive hero update)

- Lint passed; the Worker runtime suite passed 161 tests in 12 files. Existing nonfatal Windows sandbox static-analysis warnings did not prevent test execution.
- Production static export and TypeScript passed: 108 routes, with the same three real case-study slugs per locale and (before the October 27 update) no concept detail routes.
- Static audit passed for all 90 localized HTML pages: one H1, correct initial language/direction, production canonical/alternates and 180 parseable JSON-LD blocks.
- Playwright confirmed 13 main cards, exactly 3 real / 10 concept cards, zero anchors inside the new concept cards, and 13 unique logical gallery items.
- Both gallery rows moved in opposite directions. The native checkbox paused both rows, including with JavaScript disabled. Reduced motion disabled animation, hid duplicate groups and allowed horizontal browsing.
- Persian mobile at 320px had no horizontal overflow. Concept cards use text/image columns on desktop and a full-width vertical layout on mobile, preserving the image aspect ratio rather than cropping away the interface. Sticky offsets are capped at 144px; measured desktop concept-card height is about 529px.
- Images have descriptive bilingual alt text; interface-language inventory is six Persian and four English. Main images and thumbnails were inspected, including the three actual homepage previews.
- Wrangler production dry-run passed without uploading or deploying (1,308 client assets). This required the already authorized local dry-run outside the filesystem sandbox for esbuild path resolution.
- New concepts add no client component or animation library. Removing the old gallery scroll fallback reduced the home interaction chunk to 6,030 bytes gzip; the full initial homepage script list remains 193,769 bytes gzip including Next/React.

Preview: `http://127.0.0.1:3007/fa` and `/en`. This change remains local; no production deployment was requested for the gallery expansion.

## Update, October 27: a page for every project, and the work ribbon fixed

- Every showcase item now opens its own page at `/{fa,en}/projects/[slug]`. The three real projects keep their case studies; the ten concepts render `Projects/ConceptCase.tsx`: a "Design concept" badge, summary, the desktop hero, an about section that states plainly it is not a client project and has no live address, an at-a-glance list (type, status, interface language, views), the sections shown, tablet and mobile views, two more projects, and a contact CTA. Schema is WebPage plus CreativeWork with the studio as creator; there are no outbound links and no results claims. The concept pages carry `noindex, follow` and are not in the sitemap (they are thin and image-led; Search Console showed new thin pages piling up under "Crawled, currently not indexed"); the three real case studies stay indexable. The site footer now links all seven service pages on every page, because Search Console listed ten service URLs as "Discovered, never crawled" while only the home page linked to them.
- Home and archive cards link to those pages (the concept badge stays); every tile in `WorkRibbon.tsx` is a link. The aria-hidden loop copy is not focusable.
- The ribbon bug: `.work-ribbon:hover` and `:focus-within` paused the animation, so it froze under the mouse and stayed frozen after un-ticking the pause checkbox (the checkbox keeps focus). Now only `.work-ribbon-toggle input:checked` (and being off-screen) pauses it; the label flips between "Pause motion" and "Resume motion".

## Update, October 27 (later): thicker pages for Search Console

Search Console listed new thin pages under "Crawled, currently not indexed" and ten service pages as "Discovered, never crawled". Median words of the main content, before and after: services 275 to 481, tools 390 to 544 (the hub and thinnest tool page went from about 170 to 450+), real case studies 329 to 402. What was added: service pages (`Services/guide.ts`: when you need it, approach, common mistakes, related services and a free tool), tool pages (`Tools/guide.ts`: when to use, tips, two related articles), the tools hub (a guide, the suggested order and an FAQ with FAQPage schema) and the case studies (related services). Nothing here claims results, prices or client outcomes.
