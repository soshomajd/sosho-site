# Homepage collaborator carousel

The homepage hero now presents three portraits with synchronized names, roles and short biographies. Soheil is the founder and tech lead; Claude is an AI collaborator for backend development and DevOps; Codex is an AI collaborator for frontend development and design. Their AI identity is visible in Persian and English, rather than presented as human employment or provider endorsement.

## Sources and rendering

- `src/app/components/Hero/team-data.ts` holds canonical identities, bilingual copy, image references and alternative text.
- `TeamCarousel.tsx` server-renders every portrait/caption, a native radio group, native arrow labels, member indicators and progressive arrow buttons. The section has a localized accessible name; the existing studio H1 remains unchanged.
- The radio's checked state selects its entire figure, keeping the portrait and caption together. Without JavaScript, native labels and keyboard radio selection remain functional. There is no autoplay.
- `TeamCarouselMotion.tsx` adds permanent arrow buttons, RTL-aware arrow/Home/End keys, horizontal touch swipes, polite selected-member announcements and finite 320ms slide transitions. Outgoing content is inert and hidden from assistive technology while it exits. Interrupted transitions are cancelled before the next one; reduced motion removes transitions while retaining navigation.
- `hero.css` reserves a square image plane, caption space and 44–48px navigation targets, and preserves the existing palette and font. The `SOSHO STUDIO` wordmark occupies its own grid row above the slides with a 24px gap on desktop and mobile, keeping every head below the lettering. Mobile uses a single-column grid. Horizontal swipes preserve vertical panning and pinch zoom.
- The original founder image and `PortraitEyes.tsx` are unchanged. Server-rendered `RobotPortraitEyes.tsx` covers the baked mascot irises with sclera and iris layers clipped to each eye aperture. `HomeMotion.tsx` moves only the active slide's two pupils with a fine pointer; all six pupils reset on selection, pointer leave, window blur or when the Hero leaves the viewport. Reduced motion disables tracking; no JavaScript leaves the server-rendered eyes centered. The heads and eyelids stay fixed during pointer interaction. No historical body/neck rig, video or WebGL tour is mounted.

No backend request, AI model call or new dependency is required to navigate the carousel. The primary project action, estimate action, services and all existing localized routes remain available.

## Asset provenance

Built-in ImageGen generated two original fictional AI character portraits using the owned human portrait only as a visual reference. Both selected outputs were inspected, copied into the project, and optimized to real-alpha 1000×1000 WebP:

| Member | Final asset | Size |
| --- | --- | --- |
| Claude | `public/brand/claude-character-20261029.webp` | 119,344 bytes |
| Codex | `public/brand/codex-character-20261029.webp` | 85,406 bytes |

The full prompts and dimensions are in `scripts/hero-team-art-manifest.json`; `scripts/build-team-portraits.mjs <claude-PNG> <codex-PNG>` reproduces the optimization. The separate UI badges use `SiClaude` and the OpenAI brand mark `SiOpenai` from the existing React Icons package. The generated images contain no painted logo, so the interface keeps the marks crisp and proportional. The original founder portrait was not overwritten.

## Verification

`npm run build` prepares the static export. `npm run test:hero` then starts its own ephemeral localhost server, blocks external requests and exercises the built hero in Chromium. It verifies both languages, matching portraits/captions, arrows and wraparound, keyboard/focus, touch/swipe, no JavaScript, reduced motion, image loading, stable geometry, target sizes, pointer behavior and absence of page errors. Artifacts are written to ignored `.playwright-mcp/hero-team-eyes-20261031/`; there are no production API calls.

The UI UX Pro Max skill was applied to keyboard accessibility, touch alternatives, motion preference and the existing Next.js Server Component architecture. Browser checks drove the following corrections before the final run:

- Anchor visually hidden radios beside the navigation controls. Native arrow labels focus those inputs; leaving them at the top of the portrait had scrolled the landscape viewport away from the controls.
- Keep the wordmark in its own grid row, reserving a 24px gap above every square portrait.
- Gate native arrow controls to the non-enhanced state so they cannot cover the JavaScript buttons.
- Reserve enough caption space for the longer English Codex biography, eliminating the measured 4.67px movement between members.
- Clip only horizontal overflow at the carousel fieldset during incoming/outgoing slide motion; keep vertical focus outlines visible.
- Narrow the existing mobile `.project-card-head > .flex` rule to its first child. It had also changed the action column to block layout, placing concept badges and links side-by-side and widening the 320px page to 340px in Persian / 369px in English. The action column now keeps its intended vertical layout, without a global overflow workaround.

Validation completed for the 2026-10-31 spacing/eye follow-up:

- Repository ESLint passed with zero warnings; the final browser-script edit also passed focused ESLint.
- The static build passed TypeScript and exported all 137 routes. Both homepage exports contain one H1, six server-rendered pupils and unique eye-definition IDs.
- Wrangler deployment dry-run passed without publishing (355.79 KiB Worker, 82.43 KiB gzip).
- Playwright passed all 22 scenarios in Chromium. Both locales passed six responsive layouts, two no-JavaScript sizes, keyboard/pointer, reduced-motion and touch checks. All twelve responsive baselines measured a 24px wordmark-to-portrait gap. All three members passed active-only pupil tracking, hidden/reset behavior and fixed-head checks. Native landscape arrows retained their scroll position after focus settled.
- A separate focused keyboard/pointer rerun passed 2/2. Browser reports contain no page errors or image failures. The initial run exposed a test timing race: a finished Web Animation could precede its queued cleanup callback. The check now waits for both animation completion and outgoing-slide cleanup, retaining the exact-one-visible-slide assertion.
- The earlier Worker/D1 baseline in this task passed 194 tests across 14 files. The spacing/eye follow-up changed no backend source; those tests were not rerun for the frontend-only correction.

The final report is `.playwright-mcp/hero-team-eyes-20261031/report.json`. Desktop/mobile screenshots and `hero-team-preview.webm` are beside it; browser contexts and local verification servers close after the run. The palette is unchanged pending the owner's selection. No deployment, production API check or live provider verification was performed. Repository-wide findings from the separate source review remain in `PROJECT_REVIEW_2026-10-29.md`; this feature does not claim to resolve those unrelated issues.
