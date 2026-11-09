# Two original website articles — 2026-11-08

Two original bilingual articles were added to `src/app/blogs/posts.ts`. Each has nine sections, a direct answer, four FAQs, localized metadata and image alt text, and primary-source references. Existing article data was preserved byte-for-byte. README inventory is now 42 articles.

## Articles

- `website-content-preparation-checklist`: «قبل از سفارش طراحی سایت چه متن و عکس‌هایی آماده کنیم؟» — a practical content handover guide with a clearly hypothetical furniture-workshop example. Approximately 1,222 Persian and 1,025 English words.
- `website-redesign-seo-url-checklist`: «بازطراحی سایت و سئو؛ چک‌لیست آدرس‌ها قبل و بعد از انتشار» — URL inventory, mapping, redirects, canonical consistency, staging checks and post-release observation. Approximately 1,210 Persian and 997 English words. No promise of preserved rankings or a result timetable.

Both are available under `/{fa,en}/blogs/{slug}`. Existing routing automatically includes them in the blog indexes, homepage preview, sitemap and llms-full output. No runtime, database, pricing or integration code changed.

## Original cover art

Generated with built-in ImageGen, with two independent original prompts and no reference image. The chosen direction is natural editorial photography: warm daylight, teal and copper accents, physical props, no readable text or third-party logos. These are generated illustrations, not photographs of actual client work.

Final crops are optimized JPEGs, 1200×630:

- `public/blog/website-content-preparation-checklist-editorial-20261108.jpg` — 170,274 bytes. A content folder, photographs and page outlines on a wooden desk.
- `public/blog/website-redesign-seo-url-checklist-editorial-20261108.jpg` — 145,325 bytes. Old and new physical website boards with copper connections between corresponding pages.

The complete actual prompts, generation date, dimensions and bilingual alt text are recorded in `scripts/blog-art-manifest.json`. Original PNGs and browser screenshots are local review artifacts under the ignored `.playwright-mcp/blog-20261108/` directory.

## Primary sources reviewed

- https://developers.google.com/search/docs/appearance/google-images
- https://www.w3.org/WAI/tutorials/images/decision-tree/
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/webmasters/answer/9012289?hl=en

## Validation

- ESLint passed (Babel emitted an informational size notice for the existing large article data module).
- Worker tests: 14 files, 194 tests passed.
- Static Sites build passed: 167 pages; all Worker source copies match the packaged bundle.
- Wrangler deploy dry-run passed.
- Cover inventory verifier passed: 41 manifest-listed covers, 1200×630.
- Focused Playwright review passed on all four localized article pages: 1440, 390 and 320px; no horizontal overflow; correct title, canonical, language alternate, OG image and BlogPosting/FAQ metadata; decoded images and correct alt; keyboard language switching; complete no-JavaScript article content; zero browser runtime errors.
- Both language indexes, homepage previews, sitemap and llms-full contain the new articles.
- Representative Persian desktop and 320px screenshots inspected visually.

## Production preflight

Verified root application, branch `main`, production apex/www routes, `sosho-site` Worker, Sites project `appgprj_6a8ad6027bec8191bb77d131b71765e4`, D1 binding `DB` / database `sosho-sales`, and generated production origin `https://sosho-studio.net`.

Wrangler identity matches the configured owner account. Remote D1 reports no pending migrations. Secret names were checked without reading or logging secret values. Readiness before release remains HTTP 503 solely for missing Meta/Instagram configuration (`META_VERIFY_TOKEN`, `META_APP_SECRET`, `META_INSTAGRAM_ACCESS_TOKEN`); database, migrations, content AI, image AI, media storage, Sales AI, admin auth and Telegram checks are true. This existing integration gap is unrelated to the static article release.

## Production release and live verification

Published successfully to the apex and www custom domains. Cloudflare version: `73a3649e-2dbf-44db-af26-7e703939571c`.

All four live article URLs returned HTTP 200 with correct localized content, production canonical URLs, security headers, indexable metadata and decoded covers. Published cover SHA-256 hashes match the reviewed local JPEGs. Persian mobile and English desktop browser checks passed with no overflow or runtime errors. Both live indexes, homepage previews, sitemap and llms-full contain the new articles.

- https://sosho-studio.net/fa/blogs/website-content-preparation-checklist
- https://sosho-studio.net/en/blogs/website-content-preparation-checklist
- https://sosho-studio.net/fa/blogs/website-redesign-seo-url-checklist
- https://sosho-studio.net/en/blogs/website-redesign-seo-url-checklist

Post-release database/migrations and Sales provider availability checks remain true. `/api/health` still reports the same pre-existing missing Meta configuration; no full Instagram/provider transaction was attempted. Publication does not establish Google indexing. No commit or push was made by the agent.

Local logs and screenshots: `.playwright-mcp/blog-20261108/` (ignored).
