# Claude Code guide for SoSho Studio

Read [AGENTS.md](./AGENTS.md) and [README.md](./README.md) before editing. `AGENTS.md` is the canonical project guide; this file is a short orientation, not a separate set of architecture or security rules. The dated [project review](./docs/PROJECT_REVIEW_2026-10-29.md) distinguishes local findings from unverified production state.

## Working rules

- The only application/package lives at the repository root. Run npm and Wrangler here. Do not restore the deliberately deleted duplicate app or create another root, package boundary or branch unless explicitly asked.
- Start with `git status --short`; preserve existing edits, assets and deletions. Match local style and historical CRLF/LF, especially in Persian source. Avoid repository-wide formatting or import cleanup.
- Edit source, never generated `.next/`, `out/`, `dist/`, `node_modules/`, `.wrangler/` or coverage output.
- Do not deploy, apply remote migrations, provision/delete infrastructure, rotate credentials, push changes or contact external users without the owner's explicit authorization for that action and target. A local source review does not establish production health.
- Never expose secrets or customer PII in commands, logs, fixtures, commits or handoffs.

## Commands

Node.js 22+ and npm are required; `package-lock.json` is v3. There is one root package.

When using Windows Node from WSL, run from the repository's canonical Windows path casing. In this checkout a lowercase-path invocation caused Vitest's “failed to find the runner” error before any test ran; the identical suite passed from the canonical path without changing test code.

```bash
npm ci                        # deterministic dependency install
npm run dev                   # local D1 migration, Worker :8787 + Next :3000, /api proxy
npm run dev:next              # Next only
npm run dev:worker            # Worker only, using wrangler.dev.jsonc
npm run db:migrate:local      # local DB only, using wrangler.dev.jsonc
npm run lint
npm test                      # Vitest in Cloudflare Worker runtime with local D1/mocks
npm run build                 # static export + Worker + metadata/migrations into dist/
npm run test:hero             # focused Playwright checks of that export; local API stubs only
npx wrangler deploy --dry-run # validate the generated production bundle without publishing
npm run build:next            # ordinary .next build, paired with npm run start
npm run blog:art              # verify manifest-listed ImageGen assets; --sheet <path> previews
npm run projects:og           # render 1200x630 project share cards with Playwright
npm run blog:cover -- --slug "post-slug" --tag "SEO"
```

For focused tests: `npx vitest run tests/worker.test.js` or `npx vitest run -t "case name"`. There is no separate typecheck or formatter script and no general site-wide browser E2E suite. `test:hero` requires a fresh build and Chromium; it serves the export locally and blocks external calls. Artifacts default to `.playwright-mcp/hero-team-eyes-20261031` (override `HERO_TEAM_ARTIFACT_DIR`; use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for an installed browser).

`npm run deploy` targets production domains. `npm run deploy:staging` and `npm run db:migrate:staging` also mutate remote state, using the separate staging config. `npm run seo:indexnow` submits the live sitemap externally after an authorized release. These are operational commands, not local validation steps.

CI validates lint, Worker tests, build and Wrangler dry-run. The deployment workflow is manual-only, validates first, applies migrations, then deploys. Report each validation result separately; do not equate successful compilation with browser or integration verification.

## Architecture and sources

- **Frontend:** Next.js 16 App Router, React 19, TypeScript strict, React Compiler and CSS-first Tailwind 4. `@/*` maps to `src/*`. Server Components are the default. `SITES_STATIC_EXPORT=1` enables static export and unoptimized images.
- **Runtime:** `worker/index.js` and the plain ESM modules in `worker/` own API, D1, AI providers, Meta/Instagram, Telegram and private ArvanCloud storage. Do not add Next API routes or server actions to this static architecture.
- **Routing:** `/` redirects to `/fa`; locales are `fa` RTL and `en` LTR. Marketing routes include services, blogs, project detail, the existing `/projectcs` archive spelling and tools. `/admin` is Persian RTL and unlocalized. Dynamic marketing routes must remain enumerable with `generateStaticParams`.
- **Packaging:** `scripts/build-sites.mjs` exports Next into `dist/client`, corrects English HTML language/direction, mirrors RSC segment payload filenames, copies the Worker into `dist/server` and packages every SQL migration/Sites metadata. Local Wrangler uses source; deployment Wrangler uses generated `dist/server/index.js`.
- **Headers/routing:** `public/_headers` controls asset headers. Worker-built pages repeat security headers from `PAGE_SECURITY_HEADERS`; change both together (routing tests check parity). Preserve canonical redirects, real 404 responses and admin no-store/noindex behavior.
- **Schema:** ordered `db/migrations/*.sql` is the only runtime source of truth. `db/schema.ts` is a mirror. Keep SQL, types, queries, tests and setup docs aligned; never execute DDL during requests. Local migrations currently run through `0009`; this does not establish remote migration state.

Find exact frontend sources in the content table in `AGENTS.md`: services in `Services/{data,faq,guide}.ts`, blog in `blogs/posts.ts`, real projects in `Projects/data.ts`, concepts/showcase/hero views in neighboring files, tools in `Tools/{data,guide}.ts`, contacts in `contact-info.ts`, SEO in `seo.ts`/`seo-content.ts`. Slugs are shared across languages and must stay stable. New services also need manual Hero tag, offer-catalog and related-article review. Concept work must stay explicitly labelled with no fabricated client claims.

The locale layout mounts `ConsultantLauncher`, `FloatingContact` and `ConsultantHost`. The retained `SalesAssistant` and historical video/WebGL tour are unmounted. Public features require aligned Persian/English copy, accessible controls and reduced-motion behavior. Both locales use local IRANYekan; see its proprietary font licence note before asserting redistribution rights.

The Hero keeps the approved original Soheil portrait and uses `Hero/team-data.ts` + server `TeamCarousel.tsx` for three complete portrait/caption slides. The `SOSHO STUDIO` wordmark has its own grid row with a 24px gap above the slides. `PortraitEyes.tsx` preserves the founder's eyes; server `RobotPortraitEyes.tsx` overlays the mascot eyes. `HomeMotion.tsx` tracks only the active slide's pupils and resets all six on selection, pointer leave, window blur or leaving the viewport; reduced motion disables tracking. Native radios own selection; `TeamCarouselMotion.tsx` adds arrows/keyboard/swipe and finite animation without autoplay or backend calls. Claude and Codex are labelled AI collaborators, not human employees or provider endorsements. Mascot prompts/provenance are in `scripts/hero-team-art-manifest.json`; `scripts/build-team-portraits.mjs` optimizes their selected PNGs without touching Soheil. Follow `AGENTS.md` for square portrait alignment, no-JavaScript/reduced-motion navigation and pupil-only pointer motion; do not restore historical head/body rigs or video assets without an explicit request.

## Backend invariants to preserve

- D1 is mandatory for Sales Chat; database failure returns 503. The website client sends only `conversationId`, `locale`, `message`; validate strict fields, origin, lengths and per-IP/conversation rate limits.
- `sales-flow.js` owns three steps (site type, budget band, name/phone), applied even after provider fallback. The model cannot invent questions, quotes, discounts, deadlines or legal terms.
- `SALES_AI_PROVIDER=auto` selects OpenAI when its key exists, otherwise Workers AI. Explicit provider selections stay explicit. `CONTENT_AI_PROVIDER=workers_ai` never calls OpenAI. Providers have bounded timeouts/retries/quotas and validated output.
- The separate project consultant prices only through `pricing-engine.js` and an admin-entered D1 tariff; no valid tariff means `needs_review`. AI only interprets free text/summarizes and cannot create prices or deadlines. Persist requests/contact only with consent. See `docs/PROJECT_CONSULTANT.md`.
- Preserve Meta HMAC verification, event claim/deduplication, cached responses and event-linked message uniqueness. Retried webhooks must never recreate completed turns.
- Handoff-requested/human-active conversations store inbound messages without generating an AI answer. Take-over is atomic and audited.
- Admin writes require signed HttpOnly session, allowed Origin, JSON, session-bound CSRF and, for campaign/take-over actions, UUID idempotency. Dashboard and Telegram campaign transitions share `campaign-actions.js`; never write approval state directly in a handler.
- Image generation needs an approved campaign, validates bytes/type/size, reuses its unique media claim and stores privately through ArvanCloud. No public/presigned URL. Missing media configuration does not break unrelated features.
- Telegram is optional, gated to the configured admin, callback-acknowledged and deduplicated. Notifications/reports use the outbox and must not break persistence if delivery fails.
- Keep audit SSRF guards (public HTTP(S) hostnames only, every redirect revalidated, time/body/redirect caps), retention and PII-safe logs. `/api/health` exposes readiness booleans, never configuration values.

## Validation and delivery

Use the relevant lint, Worker tests, build and dry-run checks from `AGENTS.md`. For public UI also check `/fa` and `/en`, 320px/mobile/desktop, keyboard/focus, no-JavaScript HTML and reduced motion. Provider mocks and local D1 do not prove live AI, Telegram, Meta, object storage, DNS or production credentials.

Keep guide/setup documentation accurate when architecture changes. Report actual changes, checks and remaining limitations; leave production status unverified unless the intended environment was explicitly checked.
