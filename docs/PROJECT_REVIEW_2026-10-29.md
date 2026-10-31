# SoSho Studio project review — 2026-10-29

This is a local source review of the existing root application. It covers routing, public content and SEO, client boundaries, Worker endpoints and safeguards, schema ownership, build packaging, deployment configuration and developer guides. The working tree already contained extensive owner changes; they were preserved. No production deployment, remote migration, secret inspection, external message or infrastructure mutation was performed.

## Current architecture

| Area | Source-backed state |
| --- | --- |
| Application | One root npm package; Next.js 16 / React 19 / strict TypeScript / React Compiler / Tailwind 4. |
| Public routes | `fa` RTL and `en` LTR home, services, blog, projects, `/projectcs` archive and tools. All dynamic marketing routes enumerate static parameters. `/admin` is unlocalized Persian RTL. |
| Content | 9 services, 27 articles, 5 tools, 3 real projects and 10 labelled design concepts. Five projects appear at home, eight in the archive. Concepts have their own pages with `noindex` and no fabricated client/live-site claims. |
| Public interaction | Locale layout mounts the project consultant and direct-contact controls. The SalesAssistant widget and historical video/WebGL tour remain in source but are unmounted. |
| Hero | Three server-rendered collaborator slides with native radio selection, arrow enhancement and synchronized identity captions. Soheil retains the approved founder portrait; Claude and Codex are explicitly AI collaborators. No autoplay or runtime model call is involved. |
| Runtime | Custom `worker/index.js` owns APIs, D1 persistence, AI providers, Meta webhook handling, Telegram and static-page routing/headers. |
| Schema | 10 SQL migrations (`0000`–`0009`), 15 application tables; `db/schema.ts` mirrors them. Requests do not create schema. |
| Estimate | Separate consultant flow uses admin-entered, versioned D1 tariffs through `pricing-engine.js`. Without a valid tariff the result needs review. AI may interpret/summarize; it cannot price. Persistence/contact require consent. |
| Sales Chat | Application owns site type → budget band → name/phone, including fallback turns. `auto` provider selection uses OpenAI when a key exists, otherwise Workers AI. |
| Packaging | Build exports HTML/assets, fixes English HTML direction/language, mirrors Next RSC payload paths, copies Worker modules and packages all migrations/Sites metadata into `dist/`. |
| CI / release | Push/PR workflow validates lint, Worker tests, build and Wrangler dry-run. Production deployment is manual-only and applies remote migrations before deploy. |

## Findings requiring follow-up

These items are outside the requested Hero implementation and guide corrections. Priorities describe the practical impact supported by source, not a claim of a live incident.

### 1. Medium — legacy service aliases lack a static deployment redirect

`src/app/components/Services/data.ts` defines six aliases (`ui-ux`, `frontend`, `backend`, `website-0-100`, `crypto-payment-gateway`, `smart-contract-blockchain`). The service page resolves them and calls `permanentRedirect`, but its `generateStaticParams` emits only canonical service slugs. `public/_redirects` contains blog-image redirects only, and the Worker page router has no service-alias mapping.

In the static architecture, Next page logic cannot run for an alias that was never exported. Existing local export files contain canonical service pages only. A no-network Node probe of the actual Worker with a mocked asset binding returned 200 for `/fa/services/website-design-development` and 404 with no redirect for `/fa/services/frontend`. The live URL was not probed.

Follow-up: implement one deliberate redirect source for both locales at the Worker/asset layer and test every alias, query preservation and canonical target. Do not rename the canonical slugs.

### 2. Medium — contact submission has no finite client timeout

`src/app/components/ContactForm/index.tsx:120` sets `sending`, then awaits `fetch('/api/contact')` without an abort signal or timeout. A stalled connection can keep the form disabled until the request settles or the page reloads. The consultant and audit clients already have bounded requests.

Follow-up: use an AbortController with a finite timeout, release it on completion/unmount, and present the existing localized recoverable error. Preserve strict payload fields, honeypot and server limits.

### 3. Medium — mobile navigation modal does not contain or restore focus

`src/app/components/Header/MobileMenu.tsx:35` focuses the first link, handles Escape and locks body scrolling. Its `aria-modal` dialog does not trap Tab/Shift+Tab, make the background inert or restore focus to the trigger when it closes. Keyboard focus can escape behind the overlay; after Escape the focused link is removed.

Follow-up: complete the dialog focus lifecycle and check long/small viewports, both directions, Escape, overlay close, navigation close and trigger focus. This was already acknowledged by the previous guide; it remains unresolved.

### 4. Low — the newest blog cover is absent from its art manifest

There are 27 posts in `src/app/blogs/posts.ts`; the post `internet-shutdown-instagram-own-website` references an existing 1200×630 editorial cover. `scripts/blog-art-manifest.json` lists 26 covers and omits that slug. `scripts/generate-blog-art.mjs:417` verifies only manifest entries, so `npm run blog:art` can succeed without checking every published cover or recording this asset's provenance.

Follow-up: recover the real prompt/provenance for the existing asset, add its accurate manifest entry, and compare post cover references against the manifest. Do not invent a generation prompt or regenerate approved art merely to fill the record.

### 5. Owner verification — local font files do not establish a web-use licence

`public/fonts/iranyekan/LICENSE-NOTE.txt` identifies IRANYekan as proprietary and says the files came from an npm package rather than FontIran directly. It asks for confirmation of a SoSho Studio web-use licence. The earlier guide described the font as licensed; that assertion has been corrected. This review did not inspect a purchase or licence record.

### 6. Low — setup documentation and example settings trail the runtime

- `docs/AI_SALES_SETUP.md` table inventory omits `contact_messages`, `pricing_tariffs` and `consultant_requests`.
- `docs/PROJECT_CONSULTANT.md` local command uses the production-config database name with `--local`; the project-standard local command is `npm run db:migrate:local`, which selects `wrangler.dev.jsonc` and its local state. Mixing these can leave two local databases with different migrations.
- Environment examples omit optional Sales provider/Workers AI Sales, consultant, contact and audit limit knobs. Runtime defaults exist, so this is a discoverability/configuration drift issue.
- README retains historical provisioning notes. Configured resource IDs, prior deployment notes and secret-name listings do not establish current remote readiness. `AGENTS.md` now states that boundary explicitly.

Follow-up: synchronize setup docs and optional environment names in a focused configuration documentation change. Never copy actual secrets into examples.

## Safeguards confirmed in source

The inspected paths retain strict public request contracts and Origin checks, D1 fail-closed Sales Chat/contact behavior, hashed rate limits, bounded provider timeouts/retries/quotas, output schema/policy validation, Meta HMAC and event deduplication, shared audited campaign actions, session/CSRF protection, atomic handoff claims, consented consultant persistence, private validated image storage, Telegram outbox/deduplication and bounded audit fetches with SSRF guards. Tests use local D1 migrations and outbound mocks.

This confirms the presence and intended wiring of safeguards. It is not a penetration test or evidence that external AI, Meta, Telegram, ArvanCloud, DNS, credentials, billing or production migrations currently work.

## Guide changes made

`AGENTS.md` remains canonical and now describes the full current route/module/data inventory, mounted consultant controls, provider choice, tariff pricing, local font setup, Playwright uses and build postprocessing. Contradictory Sales fallback/pricing statements were removed. Old deployment/secret/zone claims are bounded as historical records, rather than presented as today's status. Root/package constraints, bilingual public UI, static-export architecture and security/business invariants were preserved.

`CLAUDE.md` is a shorter orientation linking to the canonical guide, with current commands, architecture, sources and invariants. Outdated branch-merge history, video-Hero instructions and OpenAI-only widget assumptions were removed. Both guides describe the new Hero source, asset provenance and focused `test:hero` script. README received focused capability, Hero, endpoint-inventory and guide-link updates with its CRLF line endings preserved.

## Verification boundary

This documentation audit checked source inventories, local Markdown links, README line-ending preservation and whitespace with `git -c core.whitespace=cr-at-eol diff --check`. It also reproduced the service-alias finding with the actual Worker and a mocked asset binding. Repository lint, Worker tests, production build, Wrangler dry-run and focused Hero browser results are reported separately by the implementation handoff; they must be recorded as pass/fail only when actually run. No fresh production verification is claimed.

The accompanying Hero work also identified and fixed an existing 320px mobile layout issue in `home-motion.css`: a broad child-flex selector turned the project action column into block layout. Narrowing it to the heading group preserves the intended vertical actions and prevents viewport expansion. This correction is separate from the six follow-ups above.
