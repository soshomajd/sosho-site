# Web design editorial research — 2026-10-24

The supplied Persian research note was read before selecting topics. This is a qualitative editorial assessment, not a verified traffic leaderboard. Competitor article views and Persian keyword search volumes were not available. The note's third-party search-volume figure was not reused because its original dataset and method could not be independently verified.

## Sources reviewed

- [Figma: Top web design trends for 2026](https://www.figma.com/resource-library/web-design-trends/): current editorial coverage of immersive design, motion and AI.
- [Webflow: Eight web design trends for 2026](https://webflow.com/blog/web-design-trends-2026): brand-specific visual craft, expressive design and selective use of AI.
- [Wix: Web design trends](https://www.wix.com/blog/web-design-trends): current coverage of visual styles and hierarchy. Rolling-page update labels were not treated as precise original publication dates.
- [Figma Make](https://www.figma.com/make/), [Webflow AI](https://webflow.com/ai), [Wix AI Website Builder](https://www.wix.com/ai-website-builder): official capability descriptions, not hands-on benchmarks.
- [model-viewer loading](https://modelviewer.dev/examples/loading/) and [camera controls](https://modelviewer.dev/examples/stagingandcameras/): primary technical references for the 3D guide.
- [Core Web Vitals](https://web.dev/articles/vitals), [interaction animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [image SEO](https://developers.google.com/search/docs/appearance/google-images): technical fact checks.

## Selected articles

| Topic / slug | Reader intent | Editorial reason |
| --- | --- | --- |
| `web-design-trends-2026` | Explore contemporary design before a redesign | Recurs across the three design publishers; original application and trade-off analysis, rather than a translated list. |
| `ai-website-design-guide` | Understand tools and move from a prompt to a usable website | AI appears in current design coverage and official products; includes an original brief and launch checks without invented tool benchmarks. |
| `3d-website-design-guide` | Decide whether to commission an interactive model | Connects trend exploration to a concrete project decision; covers costs, mobile alternatives and acceptance criteria. |

The existing 23 articles were checked to avoid duplicating their primary purpose. In particular, a new general speed guide was not added because the blog already contains performance articles. Website and UI/UX tags connect the new cluster through the existing related-post and service-link system.

## Content and artwork

All three articles have independently written Persian and English copy, accurate publication dates, concise SEO titles, direct answers, four FAQs, official references and a dedicated cover with localised alt text. Examples are explicitly hypothetical. No client results, traffic statistics, prices, endorsements or guaranteed rankings were invented.

Covers were generated with built-in ImageGen and optimised to 1200×630 JPEG, each below 100,000 bytes. The exact prompts and dates are stored with the new assets in [the cover manifest](../scripts/blog-art-manifest.json). Existing artwork was preserved.

## Publication and validation

- Production deployment: `c01f7c69-c1b5-44d5-b67c-2bba03c1e118`, serving `sosho-studio.net` and `www.sosho-studio.net`.
- Lint: passed without warnings. Existing Worker tests: 149 passed. Static build: passed. Wrangler dry-run: passed.
- All 52 localized article exports were checked for metadata, reciprocal hreflang, canonical URLs, alt text, image dimensions and hashes, schemas, references, sitemap/llms inclusion and internal links.
- All six new pages were checked at 320px with correct RTL/LTR and loaded covers; desktop rendering and keyboard entry were also reviewed.
- Live checks passed for all six new pages, three exact cover hashes, both blog indexes, schemas, page security headers, sitemap/llms outputs and an existing legacy cover redirect.
- IndexNow accepted the 70 sitemap URLs with HTTP 200. This is URL notification, not a claim that Google has indexed the pages.

Persian URLs for manual URL Inspection:

- https://sosho-studio.net/fa/blogs/web-design-trends-2026
- https://sosho-studio.net/fa/blogs/ai-website-design-guide
- https://sosho-studio.net/fa/blogs/3d-website-design-guide

English equivalents use `/en/` in place of `/fa/`.

