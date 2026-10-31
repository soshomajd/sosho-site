# Trend article release — 2026-10-31

Two original bilingual articles are published on the existing production Worker `sosho-site`:

- WebMCP: https://sosho-studio.net/fa/blogs/webmcp-agent-ready-websites and its `/en/` counterpart.
- Passkeys: https://sosho-studio.net/fa/blogs/passkeys-passwordless-website-login and its `/en/` counterpart.

Topic selection reflects current primary-source developments: Chrome guidance updated October 7, the WebMCP community draft dated October 27 and FIDO Alliance's October 15 report. The articles distinguish experimental WebMCP from a final standard and a credential-count estimate from unique people. Practical examples are identified as SoSho editorial recommendations. Sources are visible in each language and included in structured data and AI-readable content.

## Sources and assets

`src/app/blogs/posts.ts` owns the posts, dated 2026-10-31, including both languages, direct answers, three FAQs each and primary sources. Homepage previews, the blog index, sitemap and llms-full.txt include them. README now records 29 posts and the home content-modified date was updated.

The built-in ImageGen tool generated both covers. Selected outputs were inspected and optimized to real 1200×630 JPEG files:

- `public/blog/webmcp-agent-ready-websites-editorial-20261031.jpg` (64,207 bytes).
- `public/blog/passkeys-passwordless-website-login-editorial-20261031.jpg` (77,848 bytes).

The exact prompts, provider, filenames, dates and bilingual alt text are stored in `scripts/blog-art-manifest.json` on the two entries dated 2026-10-31. Source PNGs remain in the built-in generated-images directory and ignored QA artifacts.

## Verification and publication

- TypeScript/static build passed; 141 routes exported.
- Repository ESLint passed, excluding environment-owned virtual `.aws`, `.agents` and `.codex` paths through CLI flags. Plain Windows traversal could not enumerate `.aws`; no application lint rule was disabled.
- All 28 manifest-listed covers were found. The older missing manifest entry recorded by the project review remains outside this change.
- 22 local browser cases passed: both languages, 320px/1440px, JavaScript on/off, article schemas, canonical/alternate metadata, covers, overflow, blog/home listings, sitemap and llms-full.txt. No page or image errors occurred.
- Wrangler dry-run passed. Production D1 listed no pending migrations; none were applied.
- Production deployment succeeded on both apex/www custom domains: version `377aad25-f35b-424d-9eb6-847dc5544482`.
- IndexNow accepted the four new public article URLs with HTTP 200; this is submission acceptance, not a guarantee of indexing.
- Post-release verification passed: 11 public route checks, two cover images with real 1200×630 dimensions, and 8 live browser cases across both languages and viewport sizes.

Reports/screenshots: ignored `.playwright-mcp/trend-articles-20261031/report.json` and `production-report.json`. All owned browser contexts and verification servers closed after testing.

## Existing API readiness signal

Before the release, `/api/health` returned 503 because the three Meta/Instagram credentials were missing; database and migration checks were available. The post-release probe reports the same missing configuration. This content release did not change credentials or Instagram behavior; article checks do not establish Instagram readiness.
