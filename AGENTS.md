# SoSho Studio Agent Guide

## Mission and authority

Read this file before changing the repository. It is the durable guide for the current project state.

The old application that used to live at the repository root was intentionally removed by the owner. Do not restore it. The only active application is:

```text
sosho-studio-ai/
```

The repository root is now a documentation and Git boundary, not an npm package boundary. Run application commands from `sosho-studio-ai/` or use `npm --prefix sosho-studio-ai ...`.

If the application is later moved to the repository root, update both this file and `README.md` in the same change.

## First actions for every task

1. Read this file and the root `README.md`.
2. Run `git status --short` and preserve all user-owned work.
3. Treat deletion of the former root app as intentional. Never recover those files from Git history unless the owner explicitly asks.
4. Identify the narrow source-of-truth files for the task before editing.
5. Work only inside `sosho-studio-ai/` unless updating repository-level documentation or workflow configuration.
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
- OpenAI Responses API with strict structured output and deterministic fallback
- Cloudflare D1 lead/conversation/message persistence
- Signed and deduplicated Meta/Instagram webhook processing
- Cloudflare Workers/OpenAI Sites bundle generation

## Directory map

```text
/
|- AGENTS.md
|- README.md
`- sosho-studio-ai/
   |- src/
   |  |- proxy.ts                         Default-locale redirect
   |  `- app/
   |     |- layout.tsx                    Root HTML, metadata, Speed Insights
   |     |- page.tsx                      `/` -> `/fa`
   |     |- globals.css                   Tailwind theme and global styles
   |     |- i18n.ts                       Locale tuple and header dictionary
   |     |- robots.ts                     `/robots.txt`
   |     |- sitemap.ts                    `/sitemap.xml`
   |     |- manifest.ts                   `/manifest.webmanifest`
   |     |- blogs/posts.ts                Blog data source
   |     |- [locale]/                     Localized pages and metadata
   |     `- components/                   Shared page/UI components
   |- public/                              Static images and brand assets
   |- worker/index.js                      Runtime Worker and API source
   |- db/
   |  |- schema.ts                         Type-level D1 model mirror
   |  `- migrations/0000_ai_sales.sql     Runtime schema/migration source
   |- scripts/
   |  |- build-sites.mjs                  Static export + Worker packager
   |  `- generate-cover.mjs               1200x630 blog-cover renderer
   |- docs/AI_SALES_SETUP.md               AI/Meta/D1 setup notes
   |- .env.example                         Secret names only
   |- .openai/hosting.json                 Sites project and `DB` binding
   |- .github/workflows/deploy.yml         Nested/inactive GitHub workflow
   |- next.config.ts
   |- eslint.config.mjs
   |- tsconfig.json
   |- wrangler.jsonc
   `- package.json / package-lock.json
```

## Technology and package rules

- Use npm. `package-lock.json` is lockfile v3; use `npm ci` for deterministic installation.
- Use Node.js 22 or newer. The pinned Wrangler release requires Node 22+.
- Core stack: Next.js 16 App Router, React 19, TypeScript 5 strict mode, React Compiler.
- CSS stack: Tailwind CSS 4 through `@tailwindcss/postcss`; there is no `tailwind.config.*`.
- Visual stack: Three.js, React Three Fiber, Drei, and React Icons.
- Deployment stack: Wrangler, Cloudflare Workers/assets, D1, and OpenAI Sites metadata.
- Playwright exists only for blog-cover screenshots. There is no Playwright test configuration.
- There are no `test`, `typecheck`, `format`, preview, or Worker-dev npm scripts.
- `@/*` maps to `sosho-studio-ai/src/*` when commands run from the application directory.
- Do not add a second root `package.json` or install dependencies at repository root unless the owner explicitly asks to relocate the application.

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
  -> validate input and resolve/create conversation
  -> load D1 history and extracted lead profile
  -> OpenAI Responses API with strict JSON Schema
     or deterministic bilingual fallback
  -> update lead + persist user/assistant messages
  -> return conversationId, leadId, reply, stage, quickReplies, isComplete

Instagram webhook
  -> verify Meta HMAC signature
  -> deduplicate event in D1
  -> process through the same sales-turn pipeline
  -> reply through Meta Graph API
```

### Worker endpoints

- `GET /api/health`: returns only configuration booleans.
- `POST /api/sales/chat`: website chat endpoint.
- `GET /api/meta/webhook`: Meta verification handshake.
- `POST /api/meta/webhook`: signed inbound message webhook, processed with `ctx.waitUntil`.

### Data model

The initial SQL migration creates:

- `leads`: source, locale, qualification status, project type/tier/budget, and extracted requirements.
- `conversations`: lead/channel relationship and active state.
- `messages`: ordered user/assistant history and metadata.
- `webhook_events`: external event IDs, payloads, and processing status for idempotency.

`db/migrations/0000_ai_sales.sql` is the runtime schema source. `db/schema.ts` is a TypeScript mirror and is not used by the build to create tables. Keep the SQL, TypeScript model, Worker queries, build script, and setup documentation synchronized.

### AI/backend invariants

- Chat messages are limited to 2000 characters.
- With D1 available, each conversation is limited to 30 user messages per hour.
- Only the most recent 20 stored messages are loaded into model context.
- OpenAI requests use `store: false`, a strict JSON Schema, and a maximum output token limit.
- If `OPENAI_API_KEY` is missing or the model call fails, fixed bilingual discovery questions are used.
- The assistant may recommend an economic, professional, or exclusive tier, but must not invent exact prices, discounts, delivery promises, legal terms, or unsupported features.
- Deterministic pricing is not implemented yet. Do not present model-generated amounts as authoritative.
- D1 is required for durable leads, history, webhook deduplication, and effective rate limiting. Without `DB`, conversation IDs are ephemeral and cross-turn history is lost.
- Keep Worker response stages/types compatible with `SalesAssistant` (`discovery`, `qualification`, `proposal_ready`, `handoff`).
- Preserve Meta signature verification and deduplication. Do not bypass either for production or convenience.
- Leads can contain PII such as names, phone numbers, budgets, and business details. Do not log, commit, or use production records as fixtures. Anonymize test data.

## Build system

`next.config.ts` enables React Compiler. When `SITES_STATIC_EXPORT=1`, it also enables `output: "export"` and unoptimized Next images.

`scripts/build-sites.mjs`:

1. Runs the app-local Next binary with `SITES_STATIC_EXPORT=1`.
2. Requires `out/index.html`.
3. Recursively replaces app-local `dist/`.
4. Copies the export to `dist/client/`.
5. Splits `db/migrations/0000_ai_sales.sql` on `-- statement-breakpoint`.
6. Replaces the `__SCHEMA_STATEMENTS__` placeholder in `worker/index.js`.
7. Writes the deployable Worker to `dist/server/index.js`.
8. Copies Sites metadata and the migration to `dist/.openai/`.

Never deploy `worker/index.js` directly; it is a build template. Deploy the generated `dist/server/index.js`.

## Commands

Preferred from repository root:

```bash
npm --prefix sosho-studio-ai ci
npm --prefix sosho-studio-ai run dev
npm --prefix sosho-studio-ai run lint
npm --prefix sosho-studio-ai run build:next
npm --prefix sosho-studio-ai run start
npm --prefix sosho-studio-ai run build
npm --prefix sosho-studio-ai run build:sites
npm --prefix sosho-studio-ai run deploy
npm --prefix sosho-studio-ai run blog:cover -- --slug "post-slug" --tag "SEO"
```

Equivalent commands can be run after `cd sosho-studio-ai`.

Command semantics:

- `dev`: starts only the Next frontend. It does not run Worker APIs or D1.
- `lint`: runs ESLint; the nested config ignores `.next`, `out`, `dist`, and `build`.
- `build:next`: ordinary `.next` build. Pair this with `start`.
- `build`: aliases `build:sites`.
- `build:sites`: creates the static client and custom Worker bundle under `dist/`.
- `deploy`: runs `build:sites` and then `wrangler deploy`; this changes production.
- `blog:cover`: uses Playwright/Chromium to create a 1200x630 text-free PNG.

The build script resolves `sosho-studio-ai/node_modules/next/dist/bin/next` explicitly. Installing dependencies only at repository root is insufficient.

## Environment and secrets

Frontend/public configuration:

- `NEXT_PUBLIC_SITE_URL`: absolute production origin used by metadata, canonical/alternate links, Open Graph, JSON-LD, sitemap, and robots. The local fallback is `http://localhost:3000`; never publish a production bundle with that fallback.

Worker bindings and secrets:

- `DB`: D1 binding.
- `OPENAI_API_KEY`: enables model responses.
- `OPENAI_MODEL`: optional; current fallback in code is `gpt-5.6-luna`.
- `META_VERIFY_TOKEN`: callback verification token.
- `META_APP_SECRET`: webhook HMAC secret.
- `META_INSTAGRAM_ACCESS_TOKEN`: sends Instagram replies.
- `META_GRAPH_VERSION`: optional; current code fallback is `v26.0`.

Rules:

- Never commit real secrets. `.env.example` must contain names/placeholders only.
- Use the hosting platform's secret manager for production values.
- Do not print secrets in logs, screenshots, test output, commits, or handoff notes.
- Do not expose configuration values through `/api/health`; keep it boolean-only.

## Deployment and CI

- `wrangler.jsonc` targets Worker `sosho-site`, assets in `dist/client`, Worker entry `dist/server/index.js`, and the live domains `sosho-studio.net` and `www.sosho-studio.net`.
- Observability is enabled.
- `.openai/hosting.json` identifies the Sites project and declares D1 binding `DB`.
- `wrangler.jsonc` does not currently contain a `d1_databases` section. Standalone Cloudflare deployment requires explicit D1 creation, migration, and binding.
- `sosho-studio-ai/.github/workflows/deploy.yml` is nested below the repository root and GitHub Actions will not discover it there. Automatic deployment is currently inactive unless repository-level workflow configuration exists outside this snapshot.
- A deployment request must specify the target environment. Before deploying, verify branch, cwd, generated bundle, domain, Sites project, D1 binding/migrations, `NEXT_PUBLIC_SITE_URL`, and secrets.
- Never deploy, migrate production data, provision/delete infrastructure, rotate credentials, or contact external users without explicit authorization.

## Validation and definition of done

Baseline after installing app-local dependencies:

```bash
npm --prefix sosho-studio-ai run lint
npm --prefix sosho-studio-ai run build
```

There is no automated test suite. Report lint and build as lint and build, not as “all tests passed.”

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

1. Plain `npm run dev` cannot exercise `/api/sales/chat`; the custom Worker needs its own test/runtime environment.
2. Root HTML is server-rendered as `lang="fa" dir="rtl"` for all routes. `HtmlLangDir` changes English pages after hydration, so `/en` may initially have incorrect language/direction semantics and a visible direction/font flash.
3. Unknown service slugs call `notFound()`, while unknown blog slugs render a custom missing-post view without `notFound()`, producing a soft HTTP 200 404.
4. Locale title templates and service metadata may duplicate the site-name suffix.
5. Locale-layout homepage `WebPage` JSON-LD also appears on service/blog descendants while still identifying the locale homepage URL.
6. `LanguageSwitch` replaces only the first path segment, drops query strings/hashes, and assumes identical localized slugs.
7. New services do not automatically update fixed Hero modules or the locale-layout offer catalog.
8. The mobile menu handles Escape, initial focus, and scroll locking, but lacks a full focus trap and trigger-focus restoration.
9. There are no route-level `loading.tsx`, `error.tsx`, or `not-found.tsx` files.
10. Contact and SEO constants are duplicated across layouts and components.
11. There is no deterministic pricing engine, automated test suite, Worker preview script, or active root-level GitHub deployment workflow.
12. The default AI model and Meta Graph version are hard-coded fallbacks; configuration and external compatibility must be reviewed before production changes.

## Change discipline

- Preserve unrelated and user-created changes, including deletion of the old root application.
- Prefer focused patches and exact searches. Do not perform broad cleanup merely because a nearby issue exists.
- Do not change public slugs, database columns, API payloads, response stages, or webhook behavior without tracing every consumer and compatibility effect.
- Keep static-export constraints in mind before adding Next runtime features.
- Do not silently change business rules in the system prompt, tier definitions, qualification fields, privacy behavior, or sales completion criteria.
- If this guide becomes inaccurate, update it before finishing the task.
