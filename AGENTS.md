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
- Services, projects, About, contact, and blog surfaces
- Three.js/React Three Fiber animated Hero
- Static service and article routes
- Metadata, canonical/alternate URLs, Open Graph, sitemap, robots, manifest, and JSON-LD
- Floating website sales assistant
- Admin-only Persian AI content campaign generation with validated multi-platform bundles
- Optional Telegram content approval and deduplicated sales notifications
- Persian RTL admin dashboard with bounded D1 views, HttpOnly sessions, and audited Campaign approval actions
- Cloudflare Workers AI content generation with JSON Schema output and one-model fallback
- Idempotent Workers AI main-image generation for approved campaigns with private R2 storage
- OpenAI Responses API for Sales Chat and an optional future content provider
- Cloudflare D1 lead/conversation/message persistence
- Signed and deduplicated Meta/Instagram webhook processing
- Cloudflare Workers/OpenAI Sites bundle generation

## Directory map

```text
/
|- AGENTS.md
|- README.md
|- src/
|  |- proxy.ts                           Default-locale redirect
|  `- app/                               Next.js pages and components
|- public/                               Static images and brand assets
|- worker/
|  |- index.js                           Runtime Worker and API source
|  |- admin-dashboard.js                 Admin session security and bounded read-only D1 queries
|  |- campaign-actions.js                Shared Dashboard/Telegram transitions, idempotency, and audit
|  |- core.js                            Validation, policy, retry utilities
|  |- content-generation.js              Content schema, validation, and provider selection
|  |- workers-ai-content-provider.js     Workers AI primary/fallback content provider
|  |- image-generation.js                Image prompt, binary validation, and private R2 adapter
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
|- .openai/hosting.json                  Sites project plus `DB` and `MEDIA` bindings
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
- Playwright exists only for blog-cover screenshots. Worker tests use Vitest 4 with the official Cloudflare Vitest plugin, Miniflare, D1 migrations, MSW, and `@msw/cloudflare`.
- There are no separate `typecheck`, `format`, or browser E2E scripts.
- `@/*` maps to `src/*`.
- Do not add a nested `package.json` or another application directory unless the owner explicitly asks to relocate the application.

## Frontend architecture

### Routes

- `/` redirects to `/fa`.
- `/{fa|en}` is the homepage.
- `/{fa|en}/services/{slug}` is a service detail page.
- `/{fa|en}/blogs` is the blog index.
- `/{fa|en}/blogs/{slug}` is an article page.
- `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest` are metadata routes.

`src/proxy.ts` redirects extensionless, non-asset/non-API paths without a locale prefix to the same path under `/fa`. The built Worker repeats static asset resolution, `.html`/`index.html` fallback, and default-locale redirect behavior in production.

All dynamic page routes must remain statically enumerable through `generateStaticParams`. Runtime behavior belongs in `worker/index.js`, not in Next API routes or server actions, unless the deployment architecture is intentionally changed.

### Layouts and page composition

- `src/app/layout.tsx` owns root metadata, HTML defaults, viewport, global CSS, and Speed Insights.
- `src/app/[locale]/layout.tsx` owns locale metadata, JSON-LD, Header, Footer, `HtmlLangDir`, and `SalesAssistant`.
- `src/app/[locale]/page.tsx` composes Hero, Services, Projects, About, BlogPreview, and Contact.
- Server Components are the default. Add `"use client"` only for hooks, browser APIs, portals, or interactive/WebGL behavior.
- Existing client boundaries include `MobileMenu`, `LanguageSwitch`, `HtmlLangDir`, `Hero3DClient`, `Hero3D`, and `SalesAssistant`.
- `Hero3DClient.tsx` is the `ssr: false` boundary around the WebGL scene. Preserve that separation.

### Localization and RTL/LTR

- Supported locales are the `fa` and `en` tuple in `src/app/i18n.ts`; Persian is the default.
- `i18n.ts` contains only a small shared dictionary. Most translations are colocated as `{ fa, en }` records or `locale === "fa"` branches.
- Every user-facing feature must ship Persian and English copy, metadata, labels, errors, quick replies, and accessible names together.
- Prefer logical layout utilities such as `start`, `end`, `ms`, `me`, `ps`, and `pe`. Avoid hard-coded left/right behavior unless it is intentionally direction-independent.
- Slugs are currently shared across locales. `LanguageSwitch.tsx` swaps only the first path segment.
- Adding another locale requires coordinated changes to the locale tuple, proxy, static params, sitemap alternates, metadata/JSON-LD, fonts/direction, language switch, all localized data, and Worker replies.

### Styling and accessibility conventions

- Tailwind is CSS-first. Semantic colors in `src/app/globals.css` are `background`, `surface`, `primary`, `accent`, `foreground`, and `muted`.
- The custom `.container` is a centered flex column by default. Add `items-stretch`, `flex-row`, or other overrides where needed.
- Persian uses Tahoma/Arial/system fallbacks; English uses Trebuchet MS/Arial/system fallbacks. No hosted font fetch is required.
- Use `next/image` for site images, `next/link` for internal routes, and React Icons for interface icons.
- External links opened in a new tab must use `rel="noopener noreferrer"`.
- Preserve semantic elements, visible focus, keyboard operation, appropriate `aria-*` labels, and reduced-motion behavior.
- The Hero uses a `210svh` sticky scene, pointer parallax, intersection-based frame control, reduced DPR on compact screens, and a static reduced-motion fallback. Re-test all of these after Hero changes.
- Follow the neighboring file's style. Avoid repository-wide formatting, import sorting, encoding changes, or line-ending normalization; Persian files have mixed historical CRLF/LF behavior.

## Content sources of truth

| Area | Source | Notes |
| --- | --- | --- |
| Services | `src/app/components/Services/data.ts` | Typed canonical slugs, bilingual card/SEO/detail copy, icons, and legacy aliases |
| Blog | `src/app/blogs/posts.ts` | Bilingual article data, dates, tags, sections, cover, direct answer, and FAQ |
| Projects | `src/app/components/Projects/index.tsx` | Hard-coded project records backed by `public/projects/*` |
| About/process/stack | `src/app/components/About/index.tsx` | Homepage studio/process/tool content |
| Header dictionary | `src/app/i18n.ts` | Shared navigation labels only |
| Sales UI | `src/app/components/SalesAssistant/index.tsx` | Client state, localized UI copy, API contract, and quick replies |
| Sales backend | `worker/index.js` | Prompt, schema, persistence, fallback, rate limit, webhook, and API routing |

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
Website SalesAssistant
  -> POST /api/sales/chat
  -> strict schema/origin validation and IP rate limit
  -> resolve/create durable conversation
  -> conversation rate limit
  -> load D1 history and extracted lead profile
  -> OpenAI Responses API with strict JSON Schema
     or deterministic bilingual fallback
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
- `POST /api/sales/chat`: website chat endpoint.
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
- `GET /api/admin/conversations/:id`: returns at most 50 redacted message previews for one conversation.
- `GET /api/meta/webhook`: Meta verification handshake.
- `POST /api/meta/webhook`: signed inbound message webhook, processed with `ctx.waitUntil`.

### Data model

The ordered SQL migrations create and evolve:

- `leads`: source, locale, qualification status, project type/tier/budget, and extracted requirements.
- `conversations`: lead/channel relationship and active state.
- `messages`: ordered user/assistant history, metadata, retention, and event-linked idempotency.
- `webhook_events`: `received -> processing -> processed|failed`, attempts, retry schedule, provider response cache, and payload retention.
- `rate_limit_counters`: atomic IP, conversation, Instagram-user, and OpenAI quota windows.
- `content_campaigns`: admin content requests and `draft -> generating -> generated|failed` state.
- `content_items`: validated generated bundles linked to campaigns, including the actual provider/model used.
- `content_media`: unique campaign media claims, private R2 keys, validated MIME/size, provider/model, and storage state.
- `campaign_action_audit`: idempotency keys and safe actor/action/outcome audit records shared by Dashboard and Telegram.
- `telegram_updates`: deduplicated Telegram update/callback processing records.
- `telegram_notifications`: deduplicated content preview and sales notification delivery state.

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
- Image generation requires a generated and approved campaign, validates Base64 and binary type/size, stores only through `MEDIA`, and never returns a public R2 URL.
- One `main_image` row and deterministic R2 key are allowed per campaign. Repeated successful requests return existing metadata without another model call.
- Missing `AI` or `MEDIA` bindings return `configuration_missing`; they must not crash the Worker or affect text generation, Telegram, Sales Chat, or Instagram.
- If `OPENAI_API_KEY` is missing, provider quota is exhausted, the model call fails/times out, or the returned payload fails schema/policy validation, fixed bilingual discovery questions are used.
- The assistant may recommend an economic, professional, or exclusive tier, but must not invent exact prices, discounts, delivery promises, legal terms, or unsupported features.
- Deterministic pricing is not implemented yet. Do not present model-generated amounts as authoritative.
- The website client must send only `conversationId`, `locale`, and `message`. Never accept client-owned `source`, `externalUserId`, message counts, or Instagram fields.
- Website conversation IDs are cryptographically random UUIDv4 values stored in `localStorage`. Frontend calls use `AbortController` and a finite timeout.
- Keep Worker response stages/types compatible with `SalesAssistant` (`discovery`, `qualification`, `proposal_ready`, `handoff`).
- Preserve Meta signature verification and deduplication. Do not bypass either for production or convenience.
- Preserve event-linked message uniqueness and cached webhook responses: retries must never recreate a completed sales turn.
- Telegram is optional. Missing or failing Telegram configuration must never fail content persistence, Sales Chat, or Instagram processing.
- Telegram callbacks must be limited to the configured admin chat/user, acknowledged with `answerCallbackQuery`, and deduplicated before side effects.
- Dashboard Campaign writes require a valid signed session, an allowed Origin, JSON Content-Type, a session-bound CSRF token, and a UUID idempotency key.
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
5. Copies the Worker module tree to `dist/server/`.
6. Verifies `dist/server/index.js` exists.
7. Copies Sites metadata and every SQL migration to `dist/.openai/`.

Production Wrangler uses generated `dist/server/index.js`; local Wrangler uses `worker/index.js`. Never inject migrations into the Worker bundle.

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
npx wrangler deploy --dry-run
npm run deploy
npm run deploy:staging
npm run blog:cover -- --slug "post-slug" --tag "SEO"
```

Command semantics:

- `dev`: applies local D1 migrations and starts both Worker on port 8787 and Next on port 3000; Next proxies `/api/*` to the Worker.
- `dev:next` and `dev:worker`: start either side independently.
- `test`: runs Worker-runtime unit/integration tests with isolated local D1 storage and outbound provider mocks.
- `lint`: runs ESLint; config ignores `.next`, `out`, `dist`, and `build`.
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
- `AI`: Cloudflare Workers AI binding used by the default content provider.
- `MEDIA`: private R2 binding for generated campaign media; no public bucket URL is exposed.
- `OPENAI_API_KEY`: enables Sales Chat model responses and the optional OpenAI content provider.
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

Non-secret limits, timeouts, retry counts, origins, model/version choices, and retention windows live under `vars` in Wrangler config. Keep `.env.example`, `.dev.vars.example`, `wrangler.jsonc`, `wrangler.dev.jsonc`, Worker defaults, tests, and setup documentation aligned.

Rules:

- Never commit real secrets. `.env.example` must contain names/placeholders only.
- Use the hosting platform's secret manager for production values.
- Do not print secrets in logs, screenshots, test output, commits, or handoff notes.
- Do not expose configuration values through `/api/health`; keep it boolean-only.

## Deployment and CI

- `wrangler.jsonc` targets Worker `sosho-site`, assets in `dist/client`, Worker entry `dist/server/index.js`, and the live domains `sosho-studio.net` and `www.sosho-studio.net`.
- `wrangler.staging.jsonc` targets the isolated `sosho-site-staging` Worker and `sosho-sales-staging` D1 database on `workers.dev`; it must never declare the production routes.
- Observability is enabled.
- `.openai/hosting.json` identifies the Sites project and declares D1 binding `DB`.
- `wrangler.jsonc` declares `DB`, its migration directory, vars, and cron triggers. Its zero UUID is an intentional placeholder that must be replaced with the manually created production D1 ID before deployment.
- Root `.github/workflows/ci.yml` validates pushes/PRs. Root `.github/workflows/deploy.yml` is manual-only, validates first, applies remote D1 migrations, then deploys.
- A deployment request must specify the target environment. Before deploying, verify branch, cwd, generated bundle, domain, Sites project, D1 binding/migrations, `NEXT_PUBLIC_SITE_URL`, and secrets.
- Never deploy, migrate production data, provision/delete infrastructure, rotate credentials, or contact external users without explicit authorization.

## Validation and definition of done

Baseline after installing root-local dependencies:

```bash
npm run lint
npm test
npm run build
npx wrangler deploy --dry-run
```

Report lint, automated tests, build, and Wrangler dry-run separately. The suite covers backend behavior, not browser layout or full Meta staging behavior.

Additional checks by change type:

- Frontend/content: `/fa`, `/en`, both directions, mobile/desktop, keyboard focus, language switch, and 320px minimum width.
- Routing: blog index/detail, service detail, aliases, missing slug, proxy redirects, static params, sitemap, and metadata.
- SEO: canonical/alternate URLs, OG image path/dimensions, JSON-LD scope, robots host, and production `NEXT_PUBLIC_SITE_URL`.
- Hero: WebGL client boundary, scroll performance, compact viewport DPR, pointer interaction, and reduced-motion fallback.
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

These are documented facts, not permission to expand an unrelated task:

1. Root HTML is server-rendered as `lang="fa" dir="rtl"` for all routes. `HtmlLangDir` changes English pages after hydration, so `/en` may initially have incorrect language/direction semantics and a visible direction/font flash.
2. Unknown service slugs call `notFound()`, while unknown blog slugs render a custom missing-post view without `notFound()`, producing a soft HTTP 200 404.
3. Locale title templates and service metadata may duplicate the site-name suffix.
4. Locale-layout homepage `WebPage` JSON-LD also appears on service/blog descendants while still identifying the locale homepage URL.
5. `LanguageSwitch` replaces only the first path segment, drops query strings/hashes, and assumes identical localized slugs.
6. New services do not automatically update fixed Hero modules or the locale-layout offer catalog.
7. The mobile menu handles Escape, initial focus, and scroll locking, but lacks a full focus trap and trigger-focus restoration.
8. There are no route-level `loading.tsx`, `error.tsx`, or `not-found.tsx` files.
9. Contact and SEO constants are duplicated across layouts and components.
10. There is no deterministic pricing engine or browser E2E suite.
11. The production D1 UUID in `wrangler.jsonc` is a placeholder until the owner provisions the database.
12. The Sales Chat OpenAI model, Workers AI content models, and Meta Graph version are configurable; external compatibility must be reviewed before production changes.
13. Content generation creates bundles and one private main image for an approved campaign; text overlay, scheduling, and social publishing are intentionally not implemented.
14. Telegram sends generated-image previews by reading private R2 objects and uploading them directly with multipart; social publishing is not implemented.
15. The R2 binding names are declared, but staging and production buckets must be provisioned manually only after explicit owner authorization.

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
