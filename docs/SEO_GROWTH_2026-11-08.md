# Corporate and ecommerce search visibility — 2026-11-08

## Authorized scope and outcome

The owner selected corporate and ecommerce website design as the acquisition priority and authorized the proposed service-page, case-study, internal-link and promotion work, including the established production publication workflow. Existing uncommitted article work and its generated covers were retained. The implementation remains in the root application; no database, runtime API, pricing, credentials, branch or package changes are part of this work.

Two distinct service offers were added under both languages:

- `/fa/services/corporate-website-design` / `/en/services/corporate-website-design`
- `/fa/services/ecommerce-website-design` / `/en/services/ecommerce-website-design`

The existing general website and WordPress/WooCommerce URLs remain stable. The new pages address business and store purchase intent; WordPress remains a technology-specific offer and the general page links to the two specialisations. All eleven services have bilingual copy, guides, FAQs and static routes. The new pages include relevant real projects, scope/preparation and cost factors, an estimate action, and production canonical/alternate/OG metadata.

The three real project records now include a factual UX challenge, visible design decisions, an illustrative user journey, relevant service/article links and an explicit modification date. Their existing real screenshots were reused. Concepts remain labelled, noindex and excluded from the sitemap. No sales, traffic, ranking, timing or client-testimonial claims were invented.

Twelve selected articles now link to the appropriate offers within their body. Service related-article lists support multi-service intent. Home service links, footer links, offer catalog and homepage metadata reflect the focus; the existing Hero portrait interactions were preserved. Article and project modification dates and the service content date feed the sitemap. llms-full also reflects the added explanatory content and relationships; it is not described as a Google-ranking mechanism.

## Source map

- `src/app/components/Services/{data,guide,faq}.ts`: eleven service offers.
- `src/app/components/Services/WebsiteServiceDetails.tsx`: new-page project evidence, cost factors and preparation guidance.
- `src/app/components/Projects/data.ts` and `CaseStudyDetails.tsx`: real project content and presentation.
- `src/app/blogs/related.ts`: curated service relationships; article renderer adds contextual links.
- `src/app/seo-content.ts`, `seo.ts`, `sitemap.ts`, `llms-content.ts`: discovery metadata and content dates.

## Search Console evidence received from owner

The supplied historical Performance screenshot has 8 web-search clicks, 241 impressions, CTR 3.3% and average position 19.7 over its selected three-month range. These are not a current daily baseline or unique-person counts. The project URL rows for Wallpaper Consortium show 71 Persian and 52 English impressions, while the shown www Persian general-service row has 3 impressions. This supports focusing the service journeys; it does not prove why individual URLs are unindexed.

The owner pasted 30 entries from **Crawled – currently not indexed**:

- 6 article URLs: the Persian and English versions of `3d-website-design-guide`, `ai-website-design-guide` and `web-design-trends-2026`.
- 6 real-project URLs: both languages of Tino Electronic, Wallpaper Consortium and Niroo Tejarat Atieh.
- 12 tool URLs: both languages of `/tools` and the five tools.
- 6 non-HTML resources: three favicon URL forms, two WOFF2 fonts and the web manifest.

The 24 HTML URLs list 2026-10-24 as their last crawl, before the 2026-10-26 real-project imagery and subsequent content changes. This is evidence about the report supplied by the owner, not confirmation of Google's latest crawl state. Fonts, icons and the manifest are not acquisition landing pages and do not need to become indexed text results. Their presence in the report does not justify changing their URLs or forcing indexing.

The owner subsequently checked `https://sosho-studio.net/fa/services/website-design-development` in URL Inspection and explicitly reported **URL is on Google**. This confirms the reported indexed status of that general-service URL. The Google-selected canonical and latest crawl details were not supplied. Do not infer that every service/project URL is indexed or that this URL ranks for target purchase queries.

Public HTTP checks can establish availability and declared indexability. They cannot establish Google's current index state, chosen canonical, crawler rendering or ranking. Further Search Console URL Inspection detail is needed for individual project/new-service URLs and Google-selected canonical questions. No Search Console account access or submission capability is connected in this workspace.

## Owner actions after release

1. Inspect the two new Persian service pages and the three Persian real-project pages in Search Console. Read the indexed result, Google-selected canonical and last crawl; use **Test live URL** for current access. Request indexing once for substantially changed important pages where appropriate. A successful live test or request is not proof of indexing.
2. Keep `https://sosho-studio.net/sitemap.xml` submitted; if it already exists successfully, check its latest status rather than repeatedly adding it.
3. Publish the prepared copy in `docs/LINKEDIN_CASE_STUDIES_2026-11-08.md` from the owner's LinkedIn account. There is no connected LinkedIn publishing tool; no external social message or post was sent.
4. In Performance, use a consistent Web search type, country/device view and date range. Compare the latest 28 days with the previous 28 days after sufficient data exists. Review each new landing page and its queries separately. A query filter excluding brand variants (`sosho|so sho|سوشو`) helps approximate non-brand activity, but anonymised queries are omitted from filtered query data, so this is not an exact split.
5. Review enquiries separately from search clicks. Search Console alone does not measure contacts, unique visitors or lead quality. No GA4 property, new tracking SDK or numerical tariff was created without the necessary account configuration.

Useful query groups to evaluate (examples, not verified volume forecasts): corporate website design, industrial/company service websites, ecommerce design, product catalogue/search requirements. Assess wording against actual Search Console queries rather than inventing search-volume or rank targets.

## External guidance reviewed

- Google helpful-content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Crawlable, contextual internal links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Indexing reasons: https://support.google.com/webmasters/answer/7440203?hl=en
- URL Inspection limits: https://support.google.com/webmasters/answer/9012289?hl=en
- Performance report: https://support.google.com/webmasters/answer/7576553?hl=en

## Validation and release

Build, lint and Worker test logs are stored under ignored `.playwright-mcp/seo-20261108/`. Initial checks passed: 14 test files / 194 Worker tests, ESLint and static build. Browser, Hero, dry-run, production preflight and live release results are appended after completion. Verification establishes implementation behavior, not future Google rankings.

### Final local validation

- Final static build passed; ESLint passed (only an informational Babel size notice for the large existing article module).
- Worker tests: 14 files / 194 tests passed.
- Focused browser/SEO checks passed on all 130 sitemap URLs: HTTP 200, self-canonical, language alternates, one h1 and no noindex metadata.
- Four new localized service pages passed at 1440, 390 and 320px, including loaded images, five-question FAQ schema, WebPage modification date, keyboard language switching, estimate-dialog open/close and no-JavaScript content. APIs were stubbed during browser checks; this does not establish a successful runtime estimate or a configured tariff.
- Six localized real case studies and 24 article-to-service relationships passed; zero browser runtime errors.
- Hero check: 22/22 scenarios passed, including no-JavaScript, reduced motion, keyboard/pointer and touch behavior. The Windows process used the existing default Hero artifact directory; its log is in the dated SEO artifact folder.
- Wrangler dry-run passed. All Worker files match their generated copies. Branch main, production domain, Sites identity, D1 binding and production origin verified. Wrangler identity matches the intended owner account; remote D1 has no pending migrations. Secret names checked without exposing values.
- Readiness before release remains 503 solely for the previously missing Meta/Instagram configuration. Database, migrations, Sales AI, content/media, admin and Telegram readiness checks are true. No Instagram or provider transaction was made.
- Real reference sites Tino and Niroo returned HTTP 200 on this check. The Consortium client-domain fetch failed from this environment; its case study uses the repository’s existing real captures and previously recorded features, and no claim of current external-site availability is made.
- The six non-HTML Search Console samples all returned 200 locally with appropriate icon/font/manifest MIME types.
- Representative Persian desktop/mobile service screenshots and a mobile case-study screenshot inspected visually.

### Production publication

Published to the production apex and www domains. Cloudflare version: `02043459-77bd-4e57-a0e7-aa8d32f939d8`. Wrangler recovered from one automatic asset-upload retry and exited successfully. The release did not change credentials, migrations, runtime source or the cron configuration.

The existing IndexNow integration submitted the 38 changed canonical page URLs after verifying the four new localized service URLs were live; the endpoint returned HTTP 200. This is an accepted notification to supporting search engines, not a Google Search Console submission or proof of indexing.

### Live verification

All 130 sitemap URLs passed on production: HTTP 200, production self-canonical, language alternates, one h1 and indexable declared metadata. The four new service pages passed live at 1440, 390 and 320px with loaded images, appropriate schema, keyboard language switching, estimate-dialog open/close and no-JavaScript content. All six localized case-study pages and 24 contextual article-to-service relationships passed. Production robots and llms-full reflect the release; zero browser runtime errors were observed.

The post-release database and migration checks remain true. The same pre-existing missing Meta/Instagram configuration keeps the aggregate health endpoint at 503; it is not a static-page failure or a new regression from this release. Full provider/Instagram transactions and a priced estimate were not tested.

A copy of the pre-task article module was compared with the final module after removing modification-date lines: all pre-existing article content, including the two articles added earlier in this session, remains identical. The art manifest and cover files were retained. No commit or push was performed.

### Remaining owner work

Only the Search Console inspection/request actions and publishing from the owner’s LinkedIn account require the owner. The existing general-service URL is already reported as on Google. New and updated important URLs should be inspected separately; indexing and ranking are not established by this release. The documents above contain exact URLs and prepared public copy.
