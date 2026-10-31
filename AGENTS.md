# SoSho Studio Agent Guide

## Mission and authority

Read this file before changing the repository. It is the durable guide for the current project state.

The only active application lives directly at the repository root. A former duplicate application was intentionally removed by the owner. Do not restore it, create a nested replacement, or add another npm package boundary unless explicitly requested.

Run npm, Wrangler, migration, and build commands from the repository root. If the application location changes, update both this file and `README.md` in the same change.

## First actions for every task

1. Read this file and the root `README.md`.
2. Run `git status --short` and preserve all user-owned work.
3. Treat deletion of the former root app as intentional. Never recover those files from Git history unless the owner explicitly asks.
4. Identify the narrow source-of-truth files for the task before editing.
5. Work inside the current repository root and do not create another project/root/branch unless explicitly requested.
6. Do not edit generated output in `.next/`, `out/`, `dist/`, `node_modules/`, `.wrangler/`, or coverage directories.

## Project summary

SoSho Studio is a bilingual Persian/English marketing website with an AI-assisted sales qualification system. The frontend is statically exportable. Runtime API, database, OpenAI, and Instagram behavior lives in a custom Cloudflare Worker.

Primary capabilities:

- Persian RTL and English LTR marketing site
- Services, projects, About, contact, blog and five free-tool surfaces
- Owned founder portrait and explicitly labelled AI collaborator mascot carousel, with lightweight pupil tracking and homepage scroll motion
- Static service and article routes
- Metadata, canonical/alternate URLs, Open Graph, sitemap, robots, manifest, and JSON-LD
- Floating project estimate («برآورد هوشمند») and direct-contact controls; SalesAssistant is retained but unmounted
- Admin-only Persian AI content campaign generation with validated multi-platform bundles
- Optional Telegram content approval and deduplicated sales notifications
- Persian RTL admin dashboard with bounded D1 views, HttpOnly sessions, audited Campaign actions, and Human Handoff take-over
- Cloudflare Workers AI content generation with JSON Schema output and one-model fallback
- Idempotent Workers AI main-image generation for approved campaigns with private ArvanCloud object storage
- Sales Chat on the Cloudflare `AI` binding (Workers AI) by default, or the OpenAI Responses API when `OPENAI_API_KEY` is set; OpenAI is also an optional content provider
- Cloudflare D1 lead/conversation/message persistence
- Signed and deduplicated Meta/Instagram webhook processing
- Cloudflare Workers/OpenAI Sites bundle generation

## Directory map

```text
/
|- AGENTS.md
|- README.md / CLAUDE.md                Setup guide / short Claude orientation
|- src/
|  |- proxy.ts                           Default-locale redirect
|  `- app/                               Next.js pages and components
|- public/                               Static images and brand assets
|  `- _headers                           Security headers + asset cache policy (see below)
|- worker/
|  |- index.js                           Runtime Worker and API source
|  |- admin-dashboard.js                 Admin session security and bounded read-only D1 queries
|  |- campaign-actions.js                Shared Dashboard/Telegram transitions, idempotency, and audit
|  |- conversation-actions.js            Atomic Human Handoff/Take-over transitions and audit
|  |- sales-flow.js                      Application-owned three-step Sales Chat
|  |- workers-ai-sales-provider.js        Workers AI Sales provider and output repair
|  |- consultant*.js / pricing-engine.js  Guided estimate, consented requests and tariff pricing
|  |- site-audit.js                       Bounded public-site fetch and SSRF validation
|  |- core.js                            Validation, policy, retry utilities
|  |- content-generation.js              Content schema, validation, and provider selection
|  |- workers-ai-content-provider.js     Workers AI primary/fallback content provider
|  |- image-generation.js                Image prompt, binary validation, and private storage service
|  |- arvan-storage.js                   ArvanCloud (S3-compatible) private object storage adapter
|  |- workers-ai-image-provider.js       Workers AI FLUX image provider
|  `- telegram-service.js                Telegram Bot API transport, callbacks, and message safety
|- db/
|  |- schema.ts                          Type mirror; not schema authority
|  `- migrations/*.sql                  D1 schema source of truth
|- tests/                                Worker-runtime and D1 tests
|- scripts/
|  |- build-sites.mjs                    Static export + Worker packager
|  |- dev-all.mjs                        Local Next + Worker orchestrator
|  `- generate-cover.mjs                 1200x630 blog-cover renderer
|- docs/AI_SALES_SETUP.md                AI/Meta/D1 production notes
|- .env.example / .dev.vars.example      Variable names/placeholders only
|- .openai/hosting.json                  Sites project plus `DB` binding
|- .github/workflows/                    Root-discoverable CI/deploy workflows
|- next.config.ts / vitest.config.mjs
|- wrangler.jsonc / wrangler.staging.jsonc / wrangler.dev.jsonc
`- package.json / package-lock.json
```

## Technology and package rules

- Use npm. `package-lock.json` is lockfile v3; use `npm ci` for deterministic installation.
- Use Node.js 22 or newer. The pinned Wrangler release requires Node 22+.
- Core stack: Next.js 16 App Router, React 19, TypeScript 5 strict mode, React Compiler.
- CSS stack: Tailwind CSS 4 through `@tailwindcss/postcss`; there is no `tailwind.config.*`.
- Visual stack: Three.js, React Three Fiber, Drei, and React Icons.
- Deployment stack: Wrangler, Cloudflare Workers/assets, D1, and OpenAI Sites metadata.
- Playwright supports asset screenshots, project share cards, blog-art contact sheets and ad hoc browser checks. Worker tests use Vitest 4 with the official Cloudflare Vitest plugin, Miniflare, D1 migrations, MSW, and `@msw/cloudflare`.
- There are no separate `typecheck` or `format` scripts. `npm run test:hero` is a focused Playwright check of the built Hero; there is no general site-wide browser E2E suite.
- `@/*` maps to `src/*`.
- Do not add a nested `package.json` or another application directory unless the owner explicitly asks to relocate the application.

## Frontend architecture

### Routes

- `/` redirects to `/fa`.
- `/{fa|en}` is the homepage.
- `/{fa|en}/services/{slug}` is a service detail page.
- `/{fa|en}/blogs` is the blog index.
- `/{fa|en}/blogs/{slug}` is an article page.
- `/{fa|en}/projectcs` continues the portfolio with eight design concepts; the first five showcase items remain on the homepage.
- `/{fa|en}/projects/{slug}` renders three real case studies and ten labelled, `noindex` design concepts.
- `/{fa|en}/tools` and `/{fa|en}/tools/{slug}` expose five free tools.
- `/admin` and `/admin/{campaigns,leads,conversations,messages,consultant,tariffs}` are Persian admin surfaces; campaign, conversation and consultant details use `/detail?id=...` rather than dynamic route segments.
- `/llms.txt` and `/llms-full.txt` are statically generated text route handlers for AI answer engines.
- `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest` are metadata routes.

Keep the existing public spelling `/projectcs`. `src/proxy.ts` redirects extensionless, non-asset/non-API paths without a locale prefix to the same path under `/fa`, while exempting `/admin` and its children. The built Worker repeats static asset resolution, `.html`/`index.html` fallback, and default-locale redirect behavior in production.

All dynamic page routes must remain statically enumerable through `generateStaticParams`. Runtime behavior belongs in `worker/index.js`, not in Next API routes or server actions, unless the deployment architecture is intentionally changed.

### Layouts and page composition

- `src/app/layout.tsx` owns root metadata, HTML defaults, viewport, global CSS and local font preloads. It does not mount Speed Insights.
- `src/app/[locale]/layout.tsx` owns locale metadata, JSON-LD, Header, Footer, `HtmlLangDir`, floating `ConsultantLauncher` («برآورد هوشمند»), `FloatingContact` and `ConsultantHost`. Since 2026-10-27 the floating corner button opens the project estimate: the owner asked for every smart-consultation button to be «برآورد هوشمند». The `SalesAssistant` widget files remain (the Sales Chat API still serves Instagram) but are not mounted on the website.
- `src/app/[locale]/page.tsx` composes Hero, WorkRibbon, About, Services, Projects, free-tool teaser, BlogPreview and the contact section with ContactForm.
- Server Components are the default. Add `"use client"` only for hooks, browser APIs, portals, or interactive/WebGL behavior.
- Active client boundaries include `MobileMenu`, `LanguageSwitch`, `HtmlLangDir`, `HomeMotion`, `TeamCarouselMotion`, `ContactForm`, the consultant UI, `FloatingContact`, individual tools and the admin dashboard. `SalesAssistant` and the historical WebGL tour are present but unmounted.
- The homepage hero (`src/app/components/Hero`) and `TeamCarousel.tsx` are Server Components. `team-data.ts` owns the three bilingual identities: Soheil (founder/tech lead), Claude (AI backend/DevOps collaborator) and Codex (AI frontend/design collaborator), including images, roles, bios and alt text. Keep AI labels explicit; do not imply human staff or provider endorsement. The approved transparent `public/brand/soheil-character-3d.webp` face and its `PortraitEyes.tsx` are preserved. The other slides use original 3D AI mascots with interface brand badges and server-rendered `RobotPortraitEyes.tsx` overlays clipped to each mascot's eye apertures. The `SOSHO STUDIO` wordmark occupies its own grid row above the carousel, with a 24px gap at every viewport size.
- Native radios and CSS select each complete portrait/caption together. `TeamCarouselMotion.tsx` is an effect-only island for actual arrow buttons, direction-aware keyboard navigation, swipe, announcements and finite slide transitions. Navigation remains usable with reduced motion; native radios/labels work without JavaScript. There is no autoplay or AI/API call. Do not replace the approved founder portrait or reintroduce a body/neck rig, video or WebGL tour without an explicit request.
- `HomeMotion.tsx` handles progressive section reveals, pupil tracking for the selected team member and gallery visibility. Only the active slide's two pupils move; all six reset on member changes, pointer leave, window blur or when the Hero leaves the viewport. `home-motion.css` handles CSS gallery loops and scroll-driven project stacking. The gallery has a native pause checkbox and pauses off-screen. All copy and links remain prerendered. Font provenance and the licence check are recorded in `public/fonts/iranyekan/LICENSE-NOTE.txt`.

### Localization and RTL/LTR

- Supported locales are the `fa` and `en` tuple in `src/app/i18n.ts`; Persian is the default.
- `i18n.ts` contains only a small shared dictionary. Most translations are colocated as `{ fa, en }` records or `locale === "fa"` branches.
- Every public-facing feature must ship Persian and English copy, metadata, labels, errors, quick replies, and accessible names together. The owner-facing admin dashboard is intentionally Persian RTL.
- Prefer logical layout utilities such as `start`, `end`, `ms`, `me`, `ps`, and `pe`. Avoid hard-coded left/right behavior unless it is intentionally direction-independent.
- Slugs are currently shared across locales. `LanguageSwitch.tsx` swaps only the first path segment.
- Adding another locale requires coordinated changes to the locale tuple, proxy, static params, sitemap alternates, metadata/JSON-LD, fonts/direction, language switch, all localized data, and Worker replies.

### Styling and accessibility conventions

- Tailwind is CSS-first. Semantic colors in `src/app/globals.css` use navy `background`, graphite `surface`, steel-blue `primary`, copper `accent`, `sage`, bone `foreground`, `muted`, and `success`/`warning`/`danger` status colors.
- The custom `.container` is a centered flex column by default. Add `items-stretch`, `flex-row`, or other overrides where needed.
- Both locales use self-hosted IRANYekan with system fallbacks from `src/app/globals.css`; regular and bold WOFF2 files are preloaded by the root layout. The font is proprietary: `public/fonts/iranyekan/LICENSE-NOTE.txt` records that web-use licence ownership must be confirmed; the repository does not prove a licence. No hosted font fetch is required.
- Use `next/image` for site images, `next/link` for internal routes, and React Icons for interface icons.
- External links opened in a new tab must use `rel="noopener noreferrer"`.
- Preserve semantic elements, visible focus, keyboard operation, appropriate `aria-*` labels, and reduced-motion behavior.
- Within each Hero slide, the head-only portrait is fixed; `PortraitEyes.tsx` supplies server-rendered brown iris layers on the founder, and `RobotPortraitEyes.tsx` supplies clipped sclera/iris overlays on Claude and Codex. Only the selected slide's pupils follow a fine pointer; pointer/scroll interaction never translates or rotates a head. Finite carousel transitions move the complete slide. Reduced motion disables slide animation, reveals, pupil tracking, gallery motion and sticky stacking while retaining navigation. Keep the portrait square so the 1000×1000 eye coordinates stay aligned. Re-test no-JavaScript content, pointer behavior, keyboard/swipe navigation, mobile layout and reduced motion after Hero changes. Avoid heavy client dependencies.
- The five homepage project cards stack from 1024px width and 760px height. Complete device frames adapt to viewport height through a server-rendered `--view-ratio`; do not disable the effect below 1000px height. All five cards have distinct offsets/scales. Archive cards, mobile and reduced motion keep normal flow.
- Follow the neighboring file's style. Avoid repository-wide formatting, import sorting, encoding changes, or line-ending normalization; Persian files have mixed historical CRLF/LF behavior.

## Content sources of truth

| Area | Source | Notes |
| --- | --- | --- |
| Services | `src/app/components/Services/data.ts`, `faq.ts`, `guide.ts` | Typed canonical slugs, bilingual card/SEO/detail copy, icons, and legacy aliases. `guide.ts` holds the longer page copy (when you need it, approach, common mistakes, related services and tool): no numbers, results or guarantees. The footer links every service page on every page. Since 2026-10-28 there are nine services, including `web-application-development` (Next.js and React) and `mobile-app-development` (React Native); the Hero tag list, `seo-content.ts` offer catalog and keywords, and the blog tag mapping in `src/app/blogs/related.ts` were updated by hand with them. |
| Blog | `src/app/blogs/posts.ts` | Bilingual article data, dates, tags, sections, cover, direct answer, and FAQ |
| Projects | `src/app/components/Projects/index.tsx`, `showcase.ts`, `DeviceViews.tsx` | Five homepage items, eight more at `/{fa,en}/projectcs`, in shared order; three complete hero views per item |
| About/process/stack | `src/app/components/About/index.tsx` | Homepage studio/process/tool content plus a full-width owned 3D panorama. Responsive WebP assets in `public/brand/about-studio-panorama-20261026*.webp`; prompt/alt/dimensions in `scripts/about-art-manifest.json`, optimization in `scripts/build-about-art.mjs`. `data-reveal="cinematic"` uses the existing HomeMotion island for finite clip/zoom/light reveals; all content remains server-rendered and fully visible with no JS or reduced motion. |
| Header dictionary | `src/app/i18n.ts` | Shared navigation labels only |
| Hero team | `src/app/components/Hero/team-data.ts`, `TeamCarousel.tsx`, `TeamCarouselMotion.tsx`, `hero.css`, `PortraitEyes.tsx`, `RobotPortraitEyes.tsx` | Three complete bilingual SSR portrait/caption slides; approved Soheil face plus explicitly labelled Claude/Codex AI collaborators. Radios own selection; the small client island adds arrows/keyboard/swipe and optional finite motion. No autoplay or runtime AI call. |
| Hero mascot assets | `scripts/hero-team-art-manifest.json`, `scripts/build-team-portraits.mjs`, `public/brand/{claude,codex}-character-20261029.webp` | Original fictional head-only AI portraits, not official mascots. Manifest records prompts, dimensions and provenance. The optimizer accepts selected Claude/Codex PNGs and writes square 1000×1000 transparent WebPs; brand icons are rendered separately in the interface. Never overwrite the approved Soheil portrait with these outputs. |
| Portfolio | `src/app/components/Projects/data.ts`, `hero-views.ts`, `public/projects/hero/` | The three actual projects drive case-study routes, sitemap and llms.txt. Their desktop/tablet/mobile hero images are real captures from October 26. The shared showcase adds ten explicitly labeled design concepts; every item, real or concept, has its own page at `/{fa,en}/projects/[slug]` (concepts render `ConceptCase.tsx`: labelled as a design concept, `noindex` and kept out of the sitemap, no live link, no client or result claims). The home work ribbon (`WorkRibbon.tsx`) links every tile to that page and only its pause checkbox stops it (never hover or focus). Home shows the first five (three real, two concepts); `/projectcs` shows the remaining eight in order. Never add fictional client results to either dataset. |
| Project concepts and gallery | `src/app/components/Projects/concepts.ts`, `src/app/components/WorkRibbon.tsx`, `scripts/project-hero-art-manifest.json`, `scripts/project-hero-captures.json`, `scripts/project-hero-assets.json` | Ten ImageGen still-image concepts (six Persian RTL, four English LTR), each with separately composed desktop/tablet/mobile hero art. All 39 images live in `public/projects/hero/`; dimensions and bilingual alt text come from `hero-views.ts`. `DeviceViews` shows complete images without cropping. Ribbon uses 720px-wide desktop thumbnails for all 13 logical items. Native pause and reduced motion work without JS. `scripts/build-project-heroes.mjs <source-map.json>` optimizes assets and writes the image registry. Earlier concept assets/manifests remain as design references. |
| Free tools | `src/app/components/Tools/data.ts`, `guide.ts` (when to use, tips, two related articles per tool; the hub page adds a guide and an FAQ) (+ one component per tool, `ToolsGrid.tsx`) | Drives `/{fa,en}/tools`, `/{fa,en}/tools/[slug]`, the home teaser, nav/footer links, sitemap and llms.txt. Four tools run fully in the browser; the audit uses `/api/tools/audit`. `scripts/build-brand-assets.mjs` is unrelated (brand logos). Add a tool by adding a `TOOLS` entry, a component and a `TOOL_COMPONENTS` mapping in the slug page. |
| Project share cards | `scripts/build-project-og.mjs`, `public/projects/og/<slug>-<locale>.jpg` | 1200x630 JPEG og:image for every case study and concept, rendered with Playwright from the real hero captures; `getProjectShareImage` in `Projects/data.ts` points the project pages and `/projectcs` at them. Run `npm run projects:og` after adding a project or replacing its captures. |
| Blog art | `scripts/blog-art-manifest.json`, `public/blog/*-editorial-*.jpg` | Original ImageGen editorial covers, 1200x630 JPEG; manifest records prompts, bilingual alt text and dates (newer batches may store a per-asset prompt). `npm run blog:art` verifies manifest-listed assets; `--sheet <path>` previews them. `--legacy` explicitly selects the historical SVG renderer, whose files are not used by current posts. Each post carries `coverImage` and bilingual `coverImageAlt`; update the manifest and post together when replacing art. |
| Legacy cover URLs | `public/_redirects` | Asset-server 301 redirects preserve the 18 previous `/blog/<slug>.jpg` URLs after the ImageGen refresh. Keep these when replacing cover files again. |
| SEO/GEO extras | `src/app/llms-content.ts`, `src/app/llms.txt/`, `src/app/llms-full.txt/`, `src/app/blogs/related.ts`, `src/app/components/Services/faq.ts`, `public/<key>.txt` | `/llms.txt` and `/llms-full.txt` for AI answer engines (built from services, service FAQs, real projects, tools and posts); tag-based related posts and article→service links; per-service FAQ rendered with FAQPage schema; IndexNow key file. Posts accept optional `seoTitle`/`seoDescription` when the headline or excerpt is too long or short for search results; bump `updatedAt` on real edits and `SITE_CONTENT_UPDATED_AT` in `src/app/seo.ts` when home or service copy changes (both feed sitemap `lastmod`) |
| SEO helpers | `src/app/seo.ts`, `components/JsonLd.tsx`, `components/Breadcrumbs.tsx` | Base URL, `@id`s, BreadcrumbList builder, JSON-LD renderer, and visible breadcrumbs. Organization/Person/WebSite are site-wide (locale layout); every page emits its own WebPage node |
| Contact details | `src/app/contact-info.ts` | Phone, email, WhatsApp, Telegram, Instagram, and LinkedIn used by Header, mobile menu, Footer, the contact section, and JSON-LD `sameAs` |
| Project consultant | `worker/consultant-flow.js` (questions), `worker/consultant-scope.js`, `worker/pricing-engine.js`, `src/app/components/Consultant/*` | Six questions + one content follow-up, adaptive per project type; WordPress/WooCommerce/custom recommendation; economic and professional tiers; prices only from the admin tariff (`/admin/tariffs`). Opened by `ConsultantButton` (hero, contact section, service pages) or `#estimate`. Details: `docs/PROJECT_CONSULTANT.md`. |
| Contact form | `src/app/components/ContactForm/index.tsx` | Bilingual "leave a message" form posting to `/api/contact`; messages are read and answered in `/admin/messages` |
| Sales UI | `src/app/components/SalesAssistant/index.tsx` | Client state, localized UI copy, API contract, and quick replies |
| Sales backend | `worker/index.js`, `sales-flow.js`, `workers-ai-sales-provider.js`, `core.js` | Prompt, strict output validation, provider choice, fixed three-step flow, persistence, fallback, rate limit, webhook and API routing |

Content rules:

- Keep slugs stable. Add aliases deliberately when old service URLs must continue working.
- Service data automatically drives cards, detail static params, and sitemap entries, but it does not update the fixed Hero expertise modules or locale-layout offer catalog. Review both manually.
- Blog dates must be valid ISO values. `getBlogPosts()` clones and sorts posts newest first.
- Optional blog cover, direct answer, and FAQ fields affect rendering, SEO, and structured data. Verify every affected output.
- Search globally before changing brand name, domain, phone, email, Instagram URL, or `NEXT_PUBLIC_SITE_URL`; these values are duplicated.
- Keep asset filenames and metadata dimensions accurate. Do not add large unreferenced media.

## AI sales system

### End-to-end flow

```text
Website SalesAssistant (retained, currently unmounted)
  -> POST /api/sales/chat
  -> strict schema/origin validation and IP rate limit
  -> resolve/create durable conversation
  -> conversation rate limit
  -> load D1 history and extracted lead profile
  -> configured OpenAI Responses / Workers AI provider with strict schema validation
     or deterministic bilingual fallback
  -> application-owned three-step sales flow (also on fallback turns)
  -> validate output shape and business-policy claims
  -> update lead + persist user/assistant messages
  -> return conversationId, reply, stage, quickReplies, isComplete, requestId

Instagram webhook
  -> verify Meta HMAC signature
  -> persist `received` event and atomically claim `processing`
  -> process through the same sales-turn pipeline
  -> persist event-linked response and reply through Meta Graph API
  -> mark `processed`, or `failed` with a retry time
```

### Worker endpoints

- `GET /api/health`: checks D1 connectivity, required tables/columns, and required provider settings; returns `200` ready or `503` not ready without exposing values.
- `GET /api/sales/status`: public `{ "available": boolean }` — `true` when a Sales Chat provider is configured (`OPENAI_API_KEY`, or the `AI` binding; see `resolveSalesProvider` in `worker/index.js`). The `SalesAssistant` widget (now unmounted from the website, see the layout note above) polled this on mount and rendered nothing until it was `true`.
- `POST /api/sales/chat`: website chat endpoint.
- `POST /api/contact`: public "leave a message" form (`name`, `contact` = phone or email, `message`, `locale`, honeypot `company`). Requires an allowed Origin and a JSON body, rejects unknown fields, is rate limited per hashed IP (`CONTACT_IP_HOURLY_LIMIT`, default 5/hour) plus a global daily cap (`CONTACT_DAILY_LIMIT`, default 200), and fails closed with `503` when D1 is down. A filled honeypot returns `201` without storing anything. The message is PII: never log it.
- Project consultant (`/api/consultant/config`, `/interpret`, `/estimate`, `/requests/:id`; admin `/api/admin/consultant/requests[/:id]`, `/tariffs`, `/telegram-test`): see `docs/PROJECT_CONSULTANT.md`. Answers are validated against fixed enums, prices come only from the D1 tariff (never the model), nothing is stored without consent, and the Telegram report goes through the `telegram_notifications` outbox (parked as `awaiting_config` when Telegram is not set).
- `POST /api/tools/audit`: free website audit behind `/{fa,en}/tools/website-seo-audit` (`{ "url": string }` only). Allowed Origin + JSON, rate limited per hashed IP (`AUDIT_IP_HOURLY_LIMIT`, default 10/hour) plus a global daily cap (`AUDIT_DAILY_LIMIT`, default 500). `worker/site-audit.js` fetches the page plus `/robots.txt` and `/sitemap.xml` and returns language-neutral checks (`id`, `status`, `value`) and a score; the website translates them (`src/app/components/Tools/audit-copy.ts`). SSRF guard: only public http(s) host names on ports 80/443 (no IP literals, localhost or internal suffixes), every redirect hop is revalidated, body/time/redirect caps. Nothing is stored; the lead form under the result posts to `/api/contact` with the URL and score in the message. Keep the guard and its tests (`tests/site-audit.test.js`) intact when touching this route.
- `POST /api/content/campaigns`: creates an admin-owned Persian content campaign.
- `POST /api/content/campaigns/:id/generate`: generates and validates its content bundle.
- `POST /api/content/campaigns/:id/generate-image`: generates one idempotent private main image for an approved campaign.
- `GET /api/content/campaigns/:id`: returns the campaign and latest valid bundle.
- `POST /api/webhooks/telegram`: validates admin callbacks and performs idempotent content actions.
- `POST|GET|DELETE /api/admin/session`: exchanges the existing admin token for, checks, or clears a short-lived HttpOnly session.
- `GET /api/admin/overview`: returns bounded real system counts and recent activity.
- `GET /api/admin/campaigns`, `/api/admin/leads`, and `/api/admin/conversations`: return filtered, paginated, read-only admin views.
- `GET /api/admin/campaigns/:id`: returns one safe full Campaign bundle, provenance, approval, and media state.
- `POST /api/admin/campaigns/:id/{approve|reject|regenerate}`: performs session-only, CSRF-protected, idempotent Campaign actions.
- `GET /api/admin/contact-messages`: lists visitor messages (newest first, max 50 per page, optional `status` filter, plus the `new` count). Unlike leads, these are shown in full because the owner must read and answer them; they stay behind the admin session.
- `POST /api/admin/contact-messages/:id`: sets one message to `new|read|replied|archived` (`{ "status": ... }`) with session, Origin, JSON, and CSRF validation.
- `GET /api/admin/conversations/:id`: returns at most 50 redacted message previews for one conversation.
- `POST /api/admin/conversations/:id/take-over`: atomically claims a requested Human Handoff with session, Origin, JSON, CSRF, and idempotency validation.
- `GET /api/meta/webhook`: Meta verification handshake.
- `POST /api/meta/webhook`: signed inbound message webhook, processed with `ctx.waitUntil`.

### Data model

The ordered SQL migrations create and evolve:

- `leads`: source, locale, qualification status, project type/tier/budget, and extracted requirements.
- `conversations`: lead/channel relationship and active state.
- `conversations` also carries the Human Handoff state, request time, and single safe admin owner claim.
- `messages`: ordered user/assistant history, metadata, retention, and event-linked idempotency.
- `webhook_events`: `received -> processing -> processed|failed`, attempts, retry schedule, provider response cache, and payload retention.
- `rate_limit_counters`: atomic IP, conversation, Instagram-user, and OpenAI quota windows.
- `content_campaigns`: admin content requests and `draft -> generating -> generated|failed` state.
- `content_items`: validated generated bundles linked to campaigns, including the actual provider/model used.
- `content_media`: unique campaign media claims, private ArvanCloud object keys, validated MIME/size, provider/model, storage state, and a `superseded_at` marker set when a text regeneration invalidates a stored image.
- `campaign_action_audit`: idempotency keys and safe actor/action/outcome audit records shared by Dashboard and Telegram.
- `conversation_action_audit`: safe actor, timestamp, transition, outcome, and idempotency records for handoff requests and take-over.
- `telegram_updates`: deduplicated Telegram update/callback processing records.
- `telegram_notifications`: deduplicated content preview and sales notification delivery state.
- `contact_messages`: website contact-form messages (name, phone/email, text, locale, `new|read|replied|archived` status, read/replied timestamps) with an `expires_at` removed by the daily retention cron (`CONTACT_MESSAGE_RETENTION_DAYS`, default 365).
- `pricing_tariffs`: versioned, admin-entered tariff JSON; the newest valid tariff is active. No real price ships in code.
- `consultant_requests`: consented answers, scope, internal estimate, tariff version, summary, contact, hashed update token, report state and retention dates.

The repository currently contains migrations `0000` through `0009` and 15 application tables. This is a local source inventory, not confirmation that a remote database has applied them.

`db/migrations/*.sql` is the only runtime schema source of truth. `db/schema.ts` is a TypeScript mirror and never creates tables. Worker requests must not execute DDL or bootstrap schema. Use standard `wrangler d1 migrations apply` commands and keep the SQL, type mirror, queries, tests, build, and setup docs synchronized.

### AI/backend invariants

- Chat messages are limited to 2000 characters.
- D1 is mandatory. The sales endpoint fails closed with `503` if it is unavailable.
- Website traffic is rate-limited independently by hashed IP and conversation ID. Instagram is rate-limited by hashed user ID. Production hashing requires `RATE_LIMIT_SALT`.
- OpenAI attempts have configurable global hourly and daily quotas in D1.
- Only the most recent 20 stored messages are loaded into model context.
- OpenAI requests use `store: false`, a strict JSON Schema, and a maximum output token limit.
- Content generation defaults to the `AI` binding, requests JSON Schema output, validates every bundle locally, and invokes the configured fallback model at most once.
- `CONTENT_AI_PROVIDER=workers_ai` must never call OpenAI. The OpenAI content provider remains available only when explicitly selected.
- Image generation requires a generated and approved campaign, validates Base64 and binary type/size, stores only through the ArvanCloud object storage adapter (`worker/arvan-storage.js`, S3-compatible, signed requests via `aws4fetch`), and never returns a public or presigned URL.
- One `main_image` row and deterministic object key are allowed per campaign. Repeated successful requests return existing metadata without another model call. Regenerating campaign text marks a stored image `superseded_at`; the next `generate-image` call rebuilds it in place.
- Missing `AI` or ArvanCloud credentials (`ARVAN_S3_ACCESS_KEY`/`ARVAN_S3_SECRET_KEY`/`ARVAN_S3_ENDPOINT`/`ARVAN_S3_BUCKET`) return `configuration_missing`; they must not crash the Worker or affect text generation, Telegram, Sales Chat, or Instagram. Staging may run without them (`/api/health` still reports `mediaStorage: false` but stays ready); production is expected to have them.
- Sales Chat flow (`worker/sales-flow.js`, applied after any model turn): exactly three steps — site type (10 fixed options), budget band (about 50 / 100 / 150 / 200 million Toman, over 300 million), then full name and phone — after which the reply is a fixed thank-you and the lead becomes `proposal_ready` (this fires the Telegram notification). The application owns every question and option; the model only writes one short lead-in sentence for real free-text messages (never after a tapped option, greeting or thank-you), and its questions, "I understand" openers, requests and contact promises are dropped. The widget's starter replies must match `SITE_TYPES` labels. Budget bands are options the customer picks, never quotes. Scripted fallback turns (no model) also run the flow. Returning customers: the widget forgets its stored `conversationId` once a request is complete (a reload starts a fresh conversation); on the server, a site type chosen after `flowDone` starts a new request (`profile.inquiry` 2, 3, ...) that keeps the name and phone, asks the budget again and gets its own `proposal_ready` Telegram event (`sales:proposal_ready:<conversation>:<n>`). Telegram events are deduplicated per conversation, never per IP. The flow also runs on scripted turns (no model answer), and `extractName` reads the name from the message when the model did not.
- Sales Chat provider: `SALES_AI_PROVIDER` (`auto` default, `openai`, `workers_ai`). `auto` uses OpenAI when `OPENAI_API_KEY` is set, otherwise the `AI` binding (`worker/workers-ai-sales-provider.js`: Qwen3 with thinking switched off, one Llama fallback, output repaired by `normalizeSalesOutput`, then the same schema and business-policy validation as OpenAI). Workers AI turns have their own global caps (`WORKERS_AI_SALES_HOURLY_LIMIT` 300, `WORKERS_AI_SALES_DAILY_LIMIT` 1500). Qwen3 on Workers AI puts the JSON in `message.reasoning` when thinking is off; `extractSalesOutput` reads it.
- If no Sales Chat provider is configured, provider quota is exhausted, the model call fails/times out, or the returned payload fails schema/policy validation, fixed bilingual discovery questions are used.
- The assistant may recommend an economic, professional, or exclusive tier, but must not invent exact prices, discounts, delivery promises, legal terms, or unsupported features.
- Sales Chat never prices. The separate project consultant has deterministic pricing in `worker/pricing-engine.js`, using only the latest valid admin tariff in D1; without one it returns `needs_review` («نیازمند بررسی کارشناسی»). The model may interpret free text and summarize, but it cannot supply prices or deadlines.
- The website client must send only `conversationId`, `locale`, and `message`. Never accept client-owned `source`, `externalUserId`, message counts, or Instagram fields.
- Website conversation IDs are cryptographically random UUIDv4 values stored in `localStorage`. Frontend calls use `AbortController` and a finite timeout.
- Keep Worker response stages/types compatible with `SalesAssistant` (`discovery`, `qualification`, `proposal_ready`, `handoff`).
- Conversation Handoff states are `ai_active`, `handoff_requested`, `human_active`, and `resolved`. The current active transitions are only `ai_active -> handoff_requested` and `handoff_requested -> human_active`.
- In `handoff_requested` and `human_active`, inbound messages are persisted but no AI provider response is generated. The one-time Telegram handoff notification is deduplicated by conversation.
- Preserve Meta signature verification and deduplication. Do not bypass either for production or convenience.
- Preserve event-linked message uniqueness and cached webhook responses: retries must never recreate a completed sales turn.
- Telegram is optional. Missing or failing Telegram configuration must never fail content persistence, Sales Chat, or Instagram processing.
- Telegram callbacks must be limited to the configured admin chat/user, acknowledged with `answerCallbackQuery`, and deduplicated before side effects.
- Dashboard Campaign writes require a valid signed session, an allowed Origin, JSON Content-Type, a session-bound CSRF token, and a UUID idempotency key.
- Dashboard Conversation take-over uses the same write protections and a conditional D1 update so concurrent claims cannot create two owners.
- Dashboard and Telegram approval/regeneration must use `campaign-actions.js`; direct approval-status writes in route handlers are not allowed.
- OpenAI and Meta calls use finite timeouts, bounded exponential retry, and PII-safe structured logs carrying `requestId`.
- Retention cron deletes expired messages/counters, anonymizes selected lead PII, purges raw Meta payloads, and later deletes webhook records.
- Leads can contain PII such as names, phone numbers, budgets, and business details. Do not log, commit, or use production records as fixtures. Anonymize test data.

## Build system

`next.config.ts` enables React Compiler. When `SITES_STATIC_EXPORT=1`, it also enables `output: "export"` and unoptimized Next images.

`scripts/build-sites.mjs`:

1. Runs the root-local Next binary with `SITES_STATIC_EXPORT=1`.
2. Requires `out/index.html`.
3. Recursively replaces `dist/`.
4. Copies the export to `dist/client/`.
5. Rewrites English HTML `lang`/`dir` and mirrors nested RSC segment payloads to the dot-joined filenames requested by the Next client.
6. Copies the Worker module tree to `dist/server/`.
7. Verifies `dist/server/index.js` exists.
8. Copies Sites metadata and every SQL migration to `dist/.openai/` (migrations under `drizzle/`).

Production Wrangler uses generated `dist/server/index.js`; local Wrangler uses `worker/index.js`. Never inject migrations into the Worker bundle.

### Response headers

`public/_headers` is the single source for security headers and static-asset cache policy. The static export copies `public/` into `out/`, and step 4 above copies it into `dist/client/`, so it ships as `dist/client/_headers`.

- `/*` sets Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and Cross-Origin-Opener-Policy.
- `/_next/static/*` overrides the asset-server default (`public, max-age=0, must-revalidate`) with `public, max-age=31536000, immutable`, which is safe because those filenames are content-hashed.
- `/admin` and `/admin/*` add `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: no-store` on top of the `noindex` metadata already in `src/app/admin/layout.tsx`.

- `/fonts/*` is `immutable` for a year (rename a font file when replacing it); `/blog/*`, `/brand/*`, `/projects/*`, and `/og.jpg` get a week (day for og.jpg) plus `stale-while-revalidate`.

Cloudflare applies `_headers` only to responses the asset server returns directly, never to responses built inside `worker/index.js`. Page routes (`/`, `/fa*`, `/en*`, `/admin*`, `*.html`, `/404`) run the Worker first (see `run_worker_first` in `wrangler.jsonc`), so the Worker re-applies the `/*` security headers itself from `PAGE_SECURITY_HEADERS` (plus the admin `noindex`/`no-store` pair); `tests/routing.test.js` fails if that constant drifts from `public/_headers`, so **change both together**. Hashed bundles, fonts, images, and RSC `.txt` payloads stay asset-first and are covered by `_headers` directly. The CSP is `default-src 'self'` plus the two CloudFront hosts of the hero poster (`img-src`) and video (`media-src`), with `'unsafe-inline'` for scripts and styles because a static export cannot issue per-request nonces and pages emit inline JSON-LD and inline CSS (`experimental.inlineCss`). Verify with `curl -I https://sosho-studio.net/fa` after any deploy that touches this file.

## Commands

Preferred from repository root:

```bash
npm ci
npm run dev
npm run dev:next
npm run dev:worker
npm run db:migrate:local
npm run db:migrate:staging
npm run lint
npm test
npm run build:next
npm run start
npm run build
npm run test:hero               # focused local Playwright checks of dist/client, no live API calls
npx wrangler deploy --dry-run
npm run deploy
npm run deploy:staging
npm run blog:cover -- --slug "post-slug" --tag "SEO"
npm run projects:og              # rebuild the 1200x630 project share cards in public/projects/og/
npm run blog:art                 # verify current ImageGen covers; --sheet <path> previews them; prompts live in scripts/blog-art-manifest.json
npm run seo:indexnow             # after a production deploy: submit the live sitemap URLs to IndexNow (Bing, Yandex...)
```

Command semantics:

- `dev`: applies local D1 migrations and starts both Worker on port 8787 and Next on port 3000; Next proxies `/api/*` to the Worker. Cloudflare auth is needed for the remote `AI` binding even during local dev. Prior setup records report OAuth bot challenges on the owner's network; when applicable use `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in a git-ignored root `.env`, with values supplied by the owner. Do not print credentials or assume network/token permissions are unchanged.
- `dev:next` and `dev:worker`: start either side independently.
- `test`: runs Worker-runtime unit/integration tests with isolated local D1 storage and outbound provider mocks.
- `test:hero`: serves the existing `dist/client` export locally and checks both locales, selected portraits/captions, arrows/radios/keyboard/swipe, pointer behavior, no-JavaScript and reduced-motion layouts. Build first and provide installed Chromium (or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). Artifacts default to `.playwright-mcp/hero-team-eyes-20261031`; `HERO_TEAM_ARTIFACT_DIR` overrides the location. It stubs API failures and blocks external requests, so it does not validate the live Worker.
- `lint`: runs ESLint; config ignores `.next`, `out`, `dist`, `build`, and `.wrangler`.
- `build:next`: ordinary `.next` build. Pair this with `start`.
- `build`: aliases `build:sites`.
- `build:sites`: creates the static client and custom Worker bundle under `dist/`.
- `deploy`: runs `build:sites` and then `wrangler deploy`; this changes production.
- `deploy:staging`: builds and deploys only `sosho-site-staging` to its `workers.dev` URL; it has no production routes.
- `blog:cover`: uses Playwright/Chromium to create a 1200x630 text-free PNG.

The build/dev scripts resolve binaries from root `node_modules`. Use root `npm ci`.

## Environment and secrets

Frontend/public configuration:

- `NEXT_PUBLIC_SITE_URL`: absolute production origin used by metadata, canonical/alternate links, Open Graph, JSON-LD, sitemap, and robots. The local fallback is `http://localhost:3000`; never publish a production bundle with that fallback.

Worker bindings and secrets:

- `DB`: D1 binding.
- `AI`: Cloudflare Workers AI binding used by default content/image generation, Sales Chat when selected, and optional consultant interpretation.
- `ARVAN_S3_ACCESS_KEY`, `ARVAN_S3_SECRET_KEY`: ArvanCloud Object Storage (S3-compatible) credentials for private generated campaign media. This project uses ArvanCloud rather than R2; no public bucket URL is exposed.
- `ARVAN_S3_ENDPOINT`, `ARVAN_S3_BUCKET`: non-secret ArvanCloud Object Storage endpoint and bucket name.
- `OPENAI_API_KEY`: optional. In `SALES_AI_PROVIDER=auto`, selects OpenAI for Sales Chat; otherwise `auto` uses the `AI` binding. Also enables the explicitly selected OpenAI content provider.
- `SALES_AI_PROVIDER`: `auto` (default), `openai` or `workers_ai`; explicit selections do not silently change providers.
- `ADMIN_API_TOKEN`: protects every `/api/content/*` endpoint and is exchanged only through the admin login POST for a short-lived signed HttpOnly cookie; it must never be bundled, persisted in browser storage, placed in URLs, or logged.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `TELEGRAM_ADMIN_USER_ID`, and `TELEGRAM_WEBHOOK_SECRET`: optional Telegram approval/notification configuration.
- `OPENAI_MODEL`: optional; current fallback in code is `gpt-5.6-luna`.
- `META_VERIFY_TOKEN`: callback verification token.
- `META_APP_SECRET`: webhook HMAC secret.
- `META_INSTAGRAM_ACCESS_TOKEN`: sends Instagram replies.
- `META_GRAPH_VERSION`: optional; current code fallback is `v26.0`.
- `RATE_LIMIT_SALT`: required production secret used to pseudonymize IP and Instagram identifiers in rate-limit keys.

Non-secret content provider settings:

- `CONTENT_AI_PROVIDER`: defaults to `workers_ai`; `openai` remains available explicitly.
- `WORKERS_AI_CONTENT_MODEL`: defaults to `@cf/qwen/qwen3-30b-a3b-fp8`.
- `WORKERS_AI_FALLBACK_MODEL`: defaults to `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- `IMAGE_AI_PROVIDER`: defaults to `workers_ai`.
- `WORKERS_AI_IMAGE_MODEL`: defaults to `@cf/black-forest-labs/flux-1-schnell`.
- `IMAGE_AI_TIMEOUT_MS` / `IMAGE_MAX_BYTES`: bounded image generation and binary acceptance limits.
- `ARVAN_S3_TIMEOUT_MS`: bounded timeout for ArvanCloud object storage requests; defaults to 15000.

Non-secret limits, timeouts, retry counts, origins, model/version choices, and retention windows live under `vars` in Wrangler config. Keep `.env.example`, `.dev.vars.example`, `wrangler.jsonc`, `wrangler.dev.jsonc`, Worker defaults, tests, and setup documentation aligned.

Rules:

- Never commit real secrets. `.env.example` must contain names/placeholders only.
- Use the hosting platform's secret manager for production values.
- Do not print secrets in logs, screenshots, test output, commits, or handoff notes.
- Do not expose secrets or configuration values through `/api/health`; readiness and check fields are booleans (plus the standard request identifier).

## Deployment and CI

- `wrangler.jsonc` targets Worker `sosho-site`, assets in `dist/client`, Worker entry `dist/server/index.js`, and the live domains `sosho-studio.net` and `www.sosho-studio.net`.
- `wrangler.staging.jsonc` targets the isolated `sosho-site-staging` Worker and `sosho-sales-staging` D1 database on `workers.dev`; it must never declare the production routes.
- Observability is enabled.
- `.openai/hosting.json` identifies the Sites project and declares D1 binding `DB`.
- `wrangler.jsonc` declares `DB`, its migration directory, vars and cron triggers. It contains the production D1 database ID (`sosho-sales`) and ArvanCloud endpoint/bucket (`https://s3.ir-thr-at1.arvanstorage.ir`, `soshosite`). Treat these as deployment targets; source inspection does not verify remote resources or credentials.
- Root `.github/workflows/ci.yml` validates pushes/PRs. Root `.github/workflows/deploy.yml` is manual-only, validates first, applies remote D1 migrations, then deploys.
- A deployment request must specify the target environment. Before deploying, verify branch, cwd, generated bundle, domain, Sites project, D1 binding/migrations, `NEXT_PUBLIC_SITE_URL`, and secrets.
- Never deploy, migrate production data, provision/delete infrastructure, rotate credentials, or contact external users without explicit authorization.

### Production records and verification boundary

The checked-in production target is Worker `sosho-site`, D1 `sosho-sales`, the apex/`www` domains and private ArvanCloud bucket `soshosite`. Staging is a separate Worker/D1 target without production routes. Prior setup records identify the production Cloudflare account as `soheilshokoohi.23@gmail.com`; confirm the intended account with `wrangler whoami` before an authorized remote action.

Earlier notes record successful deployments, media probes, Telegram webhook setup and applied migrations on particular dates. They do **not** establish today's live version, database migrations, credentials, provider billing, webhook health or zone settings. The 2026-10-29 project review is local source review only. Do not infer runtime readiness from configured resource IDs or from a secret name appearing in a listing.

Before an authorized release, compare the current generated bundle and all local migrations with the intended environment, then perform scoped readiness and smoke checks. The website currently mounts the project consultant; Sales Chat provider availability is determined by `resolveSalesProvider` and can use Workers AI without an OpenAI key. Meta and Telegram remain separate integrations with separate configuration requirements. Historical credential-rotation and admin-smoke-test reminders must be confirmed with the owner, never treated as proof that a current secret is exposed or a current test passed.

## Validation and definition of done

Baseline after installing root-local dependencies:

```bash
npm run lint
npm test
npm run build
npx wrangler deploy --dry-run
```

Report lint, Worker tests, build, Wrangler dry-run and any focused browser checks separately. `npm test` covers backend behavior, while `npm run test:hero` covers the exported Hero. Neither establishes full-site browser behavior or live Meta/provider integration.

Additional checks by change type:

- Frontend/content: `/fa`, `/en`, both directions, mobile/desktop, keyboard focus, language switch, and 320px minimum width.
- Routing: blog index/detail, service detail, aliases, missing slug, proxy redirects, static params, sitemap, and metadata.
- SEO: canonical/alternate URLs, OG image path/dimensions, JSON-LD scope, robots host, and production `NEXT_PUBLIC_SITE_URL`.
- Hero: prerendered portraits/captions and selected radio state, arrow/radio/keyboard navigation, synchronized localized name/role/AI labels, client dependency size, centered pupils, pupil-only fine-pointer interaction, no-JavaScript output, mobile layout and reduced-motion fallback.
- Sales UI: open/close/reset, localized greeting/error/quick replies, pending/disabled states, max length, and API error recovery.
- Worker: health, invalid JSON, empty/oversize input, successful AI output, model fallback, persistence, history ordering, rate limit, and missing binding behavior.
- Instagram: verification challenge, valid/invalid signatures, echo filtering, duplicate event IDs, background processing, and send failures.
- Build/deployment: inspect `dist/client/index.html`, `dist/server/index.js`, packaged migration, and Sites metadata.

A change is done only when:

- It edits the correct source files, not generated output.
- Persian and English behavior remain aligned.
- Runtime types/contracts and D1 schema stay synchronized where relevant.
- Relevant lint/build/manual checks are complete or explicitly reported as blocked.
- No secrets or production PII were exposed.
- `git status` contains only intended changes plus pre-existing user work.
- `README.md`, `AGENTS.md`, and `docs/AI_SALES_SETUP.md` are updated when architecture or setup changes.

## Known issues and maintenance traps

The dated review in `docs/PROJECT_REVIEW_2026-10-29.md` records source findings and remaining verification gaps. It is not a production health report.

These are documented facts, not permission to expand an unrelated task:

1. The shared root layout renders `lang="fa" dir="rtl"`; `scripts/build-sites.mjs` rewrites every exported `/en` HTML file to `lang="en" dir="ltr"` (and `HtmlLangDir` keeps them in sync after hydration). Keep that rewrite if the export layout changes.
2. Unknown URLs are answered by the Worker with the exported `404.html` (`src/app/not-found.tsx`) and a real `404` status plus `x-robots-tag: noindex`; the blog page's in-component missing-post view only matters in `next dev`.
3. Fixed: the locale layout title is `absolute` and service pages no longer add the brand themselves, so titles carry the brand once.
4. Fixed: only Organization, founder Person, and WebSite are site-wide; each page (home, blog index, article, service) emits its own WebPage/CollectionPage node.
5. `LanguageSwitch` replaces only the first path segment, drops query strings/hashes, and assumes identical localized slugs.
6. New services do not automatically update fixed Hero modules or the locale-layout offer catalog.
7. The mobile menu handles Escape, initial focus, and scroll locking, but lacks a full focus trap and trigger-focus restoration.
8. There are no route-level `loading.tsx` or `error.tsx` files; the only `not-found.tsx` is the root one used for `404.html`.
9. Contact details live in `src/app/contact-info.ts` and SEO constants in `src/app/seo.ts` / `src/app/seo-content.ts`; a few legacy literals (for example the Instagram URL in the locale layout) remain.
10. Sales Chat never prices. The only prices on the site come from the project consultant's deterministic engine (`worker/pricing-engine.js`) and only from the admin-entered tariff; without one it shows «نیازمند بررسی کارشناسی». The committed browser script covers the Hero only; broader browser checks remain manual/ad hoc.
11. Production D1 and ArvanCloud resource names are configured in `wrangler.jsonc`. Remote secret availability, applied migrations and readiness require an explicitly authorized environment check; configuration files cannot prove them.
12. The Sales Chat OpenAI model, Workers AI content models, and Meta Graph version are configurable; external compatibility must be reviewed before production changes.
13. Content generation creates bundles and one private main image for an approved campaign; text overlay, scheduling, and social publishing are intentionally not implemented.
14. Telegram sends generated-image previews by reading the private ArvanCloud object and uploading it directly with multipart; social publishing is not implemented.
15. Private campaign media storage uses ArvanCloud Object Storage (`worker/arvan-storage.js`, S3-compatible via `aws4fetch`, path-style URLs). Prior setup records report an R2 billing limitation. Staging deliberately omits `ARVAN_S3_*` config and has a separate secret store; provision isolated media storage only when authorized.
16. RSC prefetch payloads: the static export writes dynamic-segment payloads as nested paths (`fa/__next.$d$locale/__PAGE__.txt`) while the Next client requests them dot-joined (`fa/__next.$d$locale.__PAGE__.txt`). `scripts/build-sites.mjs` mirrors every nested payload to the dot-joined name, which removes the console 404s and lets `<Link>` prefetch work. Re-check after each Next upgrade; drop the mirror step once Next writes the requested names itself.
17. Links that point to the homepage use `prefetch={false}` to avoid unnecessary homepage requests. Keep this for new links to `/${locale}` or `/${locale}#...`.
18. The old hero video/poster remain historical source only; the homepage no longer requests those remote assets. The owned character is a transparent 1000×1000 WebP. `scripts/build-character-asset.mjs <selected-PNG>` reproduces its optimization; provenance and motion decisions live in `docs/HOMEPAGE_MOTION_2026-10-25.md`. Do not reintroduce or download the historical provider video.
19. Cloudflare zone settings can override repository SEO behavior. Prior 2026-10-19/20 records report HTTPS enabled and AI Crawl Control's Bot Preference Sync/crawler blocks disabled to preserve the app robots.txt and crawler access. Those external settings, token permissions and old Lighthouse scores were not reverified by the 2026-10-29 source review; do not report them as current guarantees.

## Change discipline

- Preserve unrelated and user-created changes, including deletion of the old root application.
- Prefer focused patches and exact searches. Do not perform broad cleanup merely because a nearby issue exists.
- Do not change public slugs, database columns, API payloads, response stages, or webhook behavior without tracing every consumer and compatibility effect.
- Keep static-export constraints in mind before adding Next runtime features.
- Do not silently change business rules in the system prompt, tier definitions, qualification fields, privacy behavior, or sales completion criteria.
- If this guide becomes inaccurate, update it before finishing the task.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
