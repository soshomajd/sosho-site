# Plain-language business guides — November 4, 2026

Five original bilingual articles were added to `src/app/blogs/posts.ts`, bringing the journal to 36 articles. The owner requested publication on the real production domain, `sosho-studio.net`. The fifth topic, reducing website build and maintenance costs, was explicitly selected by the owner.

| Slug | Persian topic | Cover bytes |
| --- | --- | ---: |
| `react-native-mobile-app-business-benefits` | React Native and practical business app benefits | 98,598 |
| `wordpress-low-cost-business-website` | An economical WordPress starting point | 138,794 |
| `nextjs-ecommerce-service-website-seo` | Next.js shops, service websites and SEO | 141,132 |
| `seo-tasks-for-business-owners` | SEO tasks an owner can actually carry out | 145,281 |
| `reduce-website-build-maintenance-costs` | Reducing unnecessary build and maintenance work | 121,432 |

## Content and art

Each guide has six short sections, a direct answer, three visible FAQ entries, primary references, descriptive bilingual image alt text and search titles/descriptions. Persian copy is approximately 605–722 words per article excluding headings, with no paragraph longer than 52 words. Examples are illustrative, not invented client results. Recommendations are identified as practical suggestions. No fixed prices, guaranteed savings, delivery promises or Google ranking guarantees are claimed. WordPress is described as an economical option rather than universally cheapest; Next.js is described as a capable implementation choice rather than a source of automatic Google points.

References checked on November 4 include React Native overview/components/platform-specific code; WordPress features, requirements, backups and updates; WooCommerce; Next.js server/client components and metadata; Google Search Central's SEO, people-first content, images, Search Console, page experience and product-data guides; and MDN's website planning guidance.

The five selected covers were generated with the built-in ImageGen tool. They are original photographic-style editorial illustrations, not photographs of actual client work. Ordinary phones, a ceramics workshop, a homewares shop, a working checklist and a planning meeting replace the historical dark 3D illustration style for this batch. Final files are `public/blog/<slug>-editorial-20261104.jpg`, exactly 1200×630 progressive JPEG, each below 150,000 bytes. Prompts, subjects, dates and bilingual alt text are appended in `scripts/blog-art-manifest.json`. A discarded preliminary fifth-topic image is not referenced or shipped.

## Validation before publication

- Repository root and main branch verified; the working tree was clean before this change.
- Production Cloudflare identity/account, apex/www routes, Sites project `appgprj_6a8ad6027bec8191bb77d131b71765e4`, `DB`/`sosho-sales` binding and secret-name inventory verified without printing secret values. Remote D1 reported no pending migrations. No database changes or provider calls were needed.
- ESLint passed; all 194 runtime tests passed in 14 files. The established nonfatal Windows export-analysis sandbox warnings remained. The source-file-size Babel formatting notice did not prevent lint.
- Production build and TypeScript passed, exporting 155 routes. The build used `NEXT_PUBLIC_SITE_URL=https://sosho-studio.net`.
- Wrangler dry-run passed against 1,963 static assets. The default filesystem sandbox blocked esbuild parent-directory resolution; the already authorised local dry-run succeeded outside that boundary without publication.
- All ten new localized HTML pages passed checks for initial language/direction, one H1, production canonical/alternates, image dimensions and alt text, prerendered direct answers, Article/FAQ JSON-LD, indexability, sitemap and both llms outputs. The ten packaged SQL migrations match their source files byte for byte.
- Playwright checked every new article in both languages at 320px and desktop widths. Images decoded, FAQs were visible, language links worked and no horizontal overflow or page errors occurred. Persian articles were also checked with page JavaScript disabled. Both blog indexes linked all five new articles, and both homepages rendered normally.
- Production baseline: home and consultant configuration returned 200. `/api/health` returned 503 solely for missing Meta credentials, while database/migrations and the configured website services passed their checks. This predates the content release and does not establish live Instagram readiness. No contact submissions, AI turns or external-user messages were sent.

## Production publication and live verification

Published to Worker `sosho-site` and both existing custom domains on November 4, 2026. Version: `76d1c78c-5bad-43fa-b8f3-e24487e20235`. Wrangler completed the asset upload and deployed the existing schedules. No migrations, secrets, tariffs or provider configuration were changed.

All ten new localized URLs return 200 and match the generated HTML byte for byte. Each has one H1, a production canonical URL, an indexable robots policy, the intended image alt text, two valid JSON-LD blocks and the existing CSP header. All five live JPEGs return 200 with the correct MIME type and SHA-256 hashes matching the selected local files. The live sitemap and both llms outputs contain every new localized article URL.

Live Persian/English home and blog pages, robots and consultant configuration returned 200; an unknown article returned a real 404. Playwright also opened the production React Native article on desktop and the cost-reduction article on mobile, confirming loaded covers and no horizontal overflow. `/api/health` retains the identical pre-release 503/missing-Meta-credentials status; this release did not fix or regress that separate integration.

`npm run seo:indexnow` submitted all 114 live sitemap URLs and received HTTP 200. This records acceptance by IndexNow, not confirmation of Google indexing or a ranking outcome. Local verification details and screenshots remain in ignored `.playwright-mcp/` task artifacts.
