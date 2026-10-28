# Project consultant ("برآورد هوشمند پروژه")

A guided estimate on the website: at most six short questions (plus one follow-up about content for content-heavy sites), an AI reading of free text, a deterministic two-tier proposal priced only from admin tariffs, lead storage with consent, a Telegram report and an admin panel. The three-step Sales Chat is unchanged and separate.

## Architecture

| Part | File | Role |
| --- | --- | --- |
| Questions | `worker/consultant-flow.js` | The six questions, adaptive options per project type (features, size wording), the content follow-up, answer validation (strict enums, length caps, http(s)-only reference URL) and the public config (no rates). |
| Scope | `worker/consultant-scope.js` | Deterministic: technology recommendation (WordPress / WooCommerce / custom / mobile, with a reason and an alternative, never forced; a mobile app is always React Native with a Next.js PWA as the lighter alternative), static pages, dynamic templates, economic vs professional features (core features stay, the rest move to a later phase; the professional tier adds at most two explained suggestions), complexity, confidence, points needing review, consultation for "not sure". |
| Pricing | `worker/pricing-engine.js` | Hours from the tariff (base, pages, templates, items per 100, platform modules, features × factor) × design, multilingual and content factors, plus QA/deploy/training share; cost = hours × rate + one-time feature costs; range widened by confidence (and by features without a tariff); weeks from the critical path (discovery, design, build split across parallel developers, feedback rounds, buffer). One-time vs monthly/yearly costs are separate. The customer's budget and wished date are compared to the result, never used as it. No tariff → `needs_review`. |
| AI | `worker/consultant-ai.js` | Workers AI (Qwen3, thinking off; Llama fallback), bare JSON schema, output re-validated: free text → option ids (unknown ids dropped), short sales summary + ambiguities. Any money, currency, deadline or guarantee in the summary → replaced by a deterministic summary. Customer text is wrapped as data; the model never sets a price. Uses the shared Workers AI quota. |
| Report | `worker/consultant-report.js` | Plain-text Telegram report (no parse mode, so no markup injection) split into ≤ 3,800-character parts, max five, with the admin link. |
| Service | `worker/consultant.js` | D1 persistence, public handlers, report queue, cron flush, admin queries, retention. |
| Router | `worker/index.js` | Routes, Origin checks, per-IP rate limits, admin auth + CSRF. |
| Website | `src/app/components/Consultant/*` | `ConsultantButton` (any page), `ConsultantLauncher` (the floating «برآورد هوشمند» corner button on every page; it replaced the Sales Chat launcher), `ConsultantHost` (mounted once in the locale layout; loads the dialog code on first open or on `#estimate`), `ConsultantDialog`, `EstimateResult`, `api.ts`, bilingual `copy.ts`. |
| Admin | `src/app/admin/consultant/*`, `src/app/admin/tariffs/*` | Request list and detail (answers, both tiers with internal hours, summary, status changes), tariff editor with validation, history and a Telegram connection test. |

## API

Public (allowed Origin + JSON, rate limited per hashed IP, global daily cap):

- `GET /api/consultant/config?locale=fa|en` — questions and options, `pricingConfigured`, currency label. Never rates.
- `POST /api/consultant/interpret` — `{ locale, text, projectType? }` → `{ interpretation | null }` (null when AI is unavailable; the text stays a note).
- `POST /api/consultant/estimate` — `{ locale, answers, consent, clientRequestId }` or, to re-estimate after edits, `{ locale, answers, consent: true, consultantId, updateToken }`. Returns `scope`, `estimate` (ranges only, no hours), `summary`, and with consent `consultantId`, `publicRef` and (once, on create) `updateToken`. A repeated `clientRequestId` returns the first request and sends nothing new.
- `POST /api/consultant/requests/:id` — with `updateToken`: `{ action: "select", tier }` or `{ action: "contact", name, contact, notes?, consent: true, tier? }`. Only real changes bump `update_seq` and send an update report.

Admin (signed session; writes need CSRF + allowed Origin):

- `GET /api/admin/consultant/requests?status=&page=&limit=`, `GET /api/admin/consultant/requests/:id`, `POST /api/admin/consultant/requests/:id` `{ status }`
- `GET|PUT /api/admin/consultant/tariffs` (`PUT { config, note }` → new version, 400 with field paths when invalid)
- `POST /api/admin/consultant/telegram-test`

## Data

Migration `db/migrations/0009_project_consultant.sql` (mirrored in `db/schema.ts`):

- `pricing_tariffs` — versioned tariff JSON; the newest valid row is active.
- `consultant_requests` — answers, scope, estimate (internal, with hours), tariff version, AI summary, selected tier, contact (only after explicit consent), hashed update token, `update_seq`, Telegram state, retention dates.

Consent: nothing is stored unless the customer ticks the processing consent (or sends the contact form, which has its own required consent). Contact fields are blanked after `LEAD_PII_RETENTION_DAYS` (365); the request is deleted after `CONSULTANT_RETENTION_DAYS` (365). The daily cron does both.

## Telegram

The request is stored first; the report is sent after the response through the existing `telegram_notifications` outbox, one key per part and update (`consultant:<id>:<seq>:p<n>`), so retries never duplicate and failed parts are retried by the 5-minute cron. Without `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ADMIN_CHAT_ID` the request is kept with `telegram_state = 'awaiting_config'` and the 5-minute cron sends the latest report once Telegram is configured. Admin → تعرفه‌ها → «تست اتصال تلگرام» checks the connection.

## Setting the tariffs

Admin → «تعرفه‌ها». Start from the empty template (every amount is `null`; no price ships in code), fill the numbers, save. The `mobile` architecture prices Android/iOS apps (React Native); its `staticPageHours` is the hours per app screen. Validation lists every missing or out-of-range field. Each save is a new version; estimates record the version they used. Until a valid tariff exists the customer sees «نیازمند بررسی کارشناسی» instead of a price, and the budget question offers only «پیشنهاد شما». Field meanings are shown next to the editor.

## Environment variables

Existing secrets cover everything: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `ADMIN_API_TOKEN`, `RATE_LIMIT_SALT`, and the `AI` binding. Optional knobs: `CONSULTANT_ESTIMATE_IP_HOURLY_LIMIT` (15), `CONSULTANT_INTERPRET_IP_HOURLY_LIMIT` (30), `CONSULTANT_UPDATE_IP_HOURLY_LIMIT` (30), `CONSULTANT_DAILY_LIMIT` (1000 per action), `CONSULTANT_AI_TIMEOUT_MS` (20000), `CONSULTANT_RETENTION_DAYS` (365).

## Local run

```bash
npx wrangler d1 migrations apply sosho-sales --local
npm run dev          # or build + wrangler dev for the production bundle
```

## Deploy

1. `npx wrangler d1 migrations apply sosho-sales --remote` (adds the two tables; additive only) — before deploying the code.
2. `npm run deploy`.
3. Admin → تعرفه‌ها: save the real tariff; «تست اتصال تلگرام».

## Tests

- `tests/consultant-engine.test.js` — questions, scope, technology rules, tiers, pricing arithmetic, tariff validation, AI output filtering, report.
- `tests/consultant-api.test.js` — config, consent, duplicate submits, tier/contact updates, re-estimate, Telegram parked and flushed, AI price rejection, interpret fallback, Origin/payload/rate limits, admin auth/CSRF, tariff versioning, Telegram test, retention.
- Browser (Playwright, local stack): company/store/booking/platform flows, "not sure" and "I don't know", free text, edit and project-type change, refresh and close/reopen, keyboard trap, English LTR, mobile tabs, slow network, reduced motion, admin list/detail/tariffs.

## Limits and next steps

- Prices appear only after the owner enters real tariffs.
- The reference site URL is shown to the team, never fetched.
- The summary download is a UTF-8 text file (no PDF).
- The quick Sales Chat is no longer shown on the website (its API still serves Instagram); it asks only type, budget band and contact and does not price.
