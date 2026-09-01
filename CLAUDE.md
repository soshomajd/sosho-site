# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

`AGENTS.md` at the repo root is the authoritative, detailed project guide (mission, content sources of truth, AI-sales invariants, deployment, known issues, change discipline). Read it and the root `README.md` (Persian) before editing. This file is the short orientation layer; when the two disagree, `AGENTS.md` wins and should be corrected.

The active application is the repository root itself. A former duplicate app was deliberately deleted — do not restore it from git history, and do not add a nested `package.json` or second app directory unless the owner explicitly asks.

## Branch rule (standing owner instruction)

**Do not touch `main` until the owner says the project is complete.** No merging into `main`, no PRs targeting `main`, no pushing to `main`. All work happens on `openai-chats` (or another feature branch the owner names). `main` is read-only reference — `git diff main...openai-chats` is fine. The whole AI sales system, admin dashboard, Telegram, and content/image generation exist only on `openai-chats`; `main` still holds just the older marketing site, and the owner wants the full branch reviewed and finished before it reaches `main`.

## Environment

- Windows host; the default shell is PowerShell 5.1, with a Bash tool also available. `npm run dev` orchestration and Wrangler are cross-platform.
- Node.js 22+ is required (pinned Wrangler needs it). Use `npm ci` (lockfile v3).
- Line endings: Persian source files have mixed historical CRLF/LF. Do not run repo-wide reformatting, import sorting, or EOL normalization; match each neighboring file.
- This repo was previously worked on with the OpenAI Codex CLI (there is a user-level `~/.codex/config.toml`). `AGENTS.md` is the shared cross-agent guide.

## Commands

```bash
npm ci                        # deterministic install (run from repo root only)
npm run dev                   # applies local D1 migrations, starts Worker :8787 + Next :3000, proxies /api/* to Worker
npm run dev:next              # Next only
npm run dev:worker            # Worker only (wrangler dev --config wrangler.dev.jsonc)
npm run db:migrate:local     # apply D1 migrations to the local dev DB
npm run lint                  # eslint (ignores .next, out, dist, build)
npm test                      # vitest run — Worker-runtime + D1 integration tests
npm run build                 # alias of build:sites — static export + custom Worker bundle into dist/
npm run build:next            # plain .next build (pair with `npm run start`)
npx wrangler deploy --dry-run # validate the production bundle
npm run deploy                # build:sites then wrangler deploy — CHANGES PRODUCTION, only with explicit authorization
npm run deploy:staging       # build + deploy sosho-site-staging on workers.dev (no prod routes)
npm run blog:cover -- --slug "post-slug" --tag "SEO"   # Playwright 1200x630 cover PNG
```

Run one test file / one test:

```bash
npx vitest run tests/worker.test.js
npx vitest run -t "name of the test case"
npx vitest tests/worker.test.js        # watch mode
```

There is no separate `typecheck`, `format`, or browser-E2E script. Playwright exists only for blog covers.

Pre-deploy / definition-of-done baseline (report each result separately): `npm run lint`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`. CI (`.github/workflows/ci.yml`) runs exactly these on every push/PR with `NEXT_PUBLIC_SITE_URL=https://sosho-studio.net`. `deploy.yml` is `workflow_dispatch`-only.

## Architecture

Two deployables in one package:

1. **Static marketing site** — Next.js 16 App Router, React 19, React Compiler, TypeScript strict, Tailwind CSS 4 (CSS-first, no `tailwind.config.*`). Bilingual `fa` (default, RTL) / `en` (LTR). Built with `output: "export"` when `SITES_STATIC_EXPORT=1`. Every dynamic route must stay statically enumerable via `generateStaticParams`. `@/*` → `src/*`.
2. **Cloudflare Worker** (`worker/`, plain ESM `.js`, no build step for local dev) — all runtime API, D1, OpenAI, Workers AI, R2, Instagram/Meta, and Telegram behavior. No Next API routes or server actions.

### Request path

- `src/proxy.ts` (and the built Worker) redirect locale-less, extensionless, non-asset/non-API paths to `/fa/...`.
- Production Worker (`worker/index.js` `worker.fetch`): `/api/*` → `handleApi`; `/` → 308 `/fa`; otherwise serve `dist/client` assets with `.html` / `index.html` fallback, then locale redirect. `run_worker_first: ["/"]` in `wrangler.jsonc`.
- `handleApi` is a flat sequence of `if (url.pathname === ... && method === ...)` / regex-match blocks ending in a 404. Every JSON response carries `requestId` + `x-request-id`.
- `worker.scheduled`: cron `*/5 * * * *` → webhook retry sweep; `15 3 * * *` → retention cleanup.

### Worker module map

| File | Role |
| --- | --- |
| `worker/index.js` (~2.2k lines) | Router, health/readiness, sales-turn pipeline, Instagram webhook state machine, content-campaign + image endpoints, retention/retry crons |
| `worker/core.js` | Shared validation, business-policy checks, sales JSON Schema, `ServiceError`, `fetchWithTimeout`, `retryWithBackoff`, id/hash helpers |
| `worker/admin-dashboard.js` | Admin session issue/verify (constant-time token compare → signed 8h HttpOnly cookie), CSRF, bounded read-only D1 list/detail queries (max 50 rows), PII redaction |
| `worker/campaign-actions.js` | Single source for approve/reject/regenerate transitions — idempotency via `campaign_action_audit` claim, shared by Dashboard route handlers and Telegram callbacks. Route handlers must never write approval status directly. |
| `worker/content-generation.js` | Content bundle schema, local validation, provider selection |
| `worker/workers-ai-content-provider.js` | Default `AI`-binding content provider: Qwen primary, one Llama fallback |
| `worker/image-generation.js` + `worker/workers-ai-image-provider.js` | FLUX main-image generation, Base64/binary validation, private-R2 (`MEDIA`) adapter — never returns a public/signed URL |
| `worker/telegram-service.js` | Telegram Bot API transport, admin chat/user gating, `answerCallbackQuery`, multipart photo upload |

### Data / schema

`db/migrations/*.sql` (ordered, additive-only) is the **only** schema source of truth. `db/schema.ts` is a hand-maintained TypeScript mirror that creates nothing. The Worker never runs DDL at request time; migrations are applied with `wrangler d1 migrations apply` before deploy. `vitest.config.mjs` feeds the same migrations into Miniflare D1 for tests. Keep SQL, the type mirror, queries, tests, and docs in sync in one change.

### Frontend content sources of truth

Editing these drives cards / static params / sitemap / SEO — see the table in `AGENTS.md`. Key ones: `src/app/components/Services/data.ts`, `src/app/blogs/posts.ts`, `src/app/components/Projects/index.tsx`, `src/app/i18n.ts` (nav labels only). Slugs are shared across locales and must stay stable (add aliases deliberately). New services do **not** auto-update the fixed Hero modules or the locale-layout offer catalog.

`/admin` is a Persian RTL dashboard (`src/app/admin/`, `noindex`); client components talk to `/api/admin/*`. Server Components are the default everywhere; add `"use client"` only for hooks/browser APIs/WebGL. `Hero3DClient.tsx` is the `ssr: false` boundary around the Three.js scene — keep that separation.

## Non-negotiable invariants (see AGENTS.md "AI sales system" for the full list)

- D1 is mandatory; `/api/sales/chat` fails closed with `503` when it is down.
- The website client sends only `conversationId`, `locale`, `message`. Never accept client-supplied `source`, `externalUserId`, message counts, or Instagram fields.
- Preserve Meta HMAC signature verification and event-id deduplication; retries must never recreate a completed sales turn.
- `CONTENT_AI_PROVIDER=workers_ai` (the default) must never call OpenAI. `OPENAI_API_KEY` powers Sales Chat + the optional OpenAI content provider only.
- Missing `AI` / `MEDIA` bindings return `configuration_missing` and must not crash the Worker or affect text/Telegram/Sales/Instagram paths.
- The assistant may recommend an economic/professional/exclusive tier but must not invent prices, discounts, delivery promises, or legal terms. There is no deterministic pricing engine.
- Dashboard campaign writes require signed session + allowed Origin + JSON content-type + session-bound CSRF token + UUID idempotency key.
- `/api/health` returns booleans only — never leak config values.
- Every user-facing feature ships Persian and English copy/metadata/labels/errors together. Prefer logical CSS (`start`/`end`/`ms`/`me`/`ps`/`pe`).
- Leads hold real PII — never log it, commit it, or use production records as fixtures.
- Edit source, not generated output (`.next/`, `out/`, `dist/`, `.wrangler/`, coverage).
- The production D1 `database_id` in `wrangler.jsonc` is an intentional all-zero placeholder until the owner provisions the database.

## Current working state

Branch `openai-chats` has uncommitted work (Codex-authored) adding audited admin campaign approve/reject/regenerate: new `worker/campaign-actions.js`, `db/migrations/0005_campaign_admin_actions.sql`, `src/app/admin/campaigns/detail/`, `src/app/admin/admin-session.tsx`, plus edits across `worker/index.js`, `worker/admin-dashboard.js`, admin UI, docs, and tests. Preserve this in-flight work; `git status` should contain only intended changes plus this pre-existing set.
