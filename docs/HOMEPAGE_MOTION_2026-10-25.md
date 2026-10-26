# SoSho homepage theme and motion

The subsequent October 26 gallery expansion supersedes the original three-card gallery description below: see [project showcase notes](PROJECT_SHOWCASE_2026-10-26.md) for the 13-item CSS gallery and ten additional concept cards. The head-only portrait and pupil-tracking implementation remain unchanged.

Reference reviewed with Playwright: [MotionSites 3D Portfolio / Jack](https://motionsites.ai/?prompt=3d-jack-portfolio-hero). Its publicly available generation prompt was used as design guidance. No locked source code, external portraits, GIF collections or third-party project images were copied.

## Palette

Global tokens in `src/app/globals.css`: navy `#111820`, graphite `#1D2935`, steel blue `#8DAFC5`, sage `#9EAD98`, copper `#C98B62`, bone `#ECEEE9`, muted `#A6B2BC`. Primary buttons use dark text on steel blue. Semantic status colors remain distinct; the search-preview and color-contrast tools retain their functional preview colors.

## Rendering and motion

- The existing static-export architecture is preserved: Server Components render the page at build time. This is SSG, not request-time SSR. Headlines, services, actual project links, tools, articles, contact information, canonical/alternate metadata and JSON-LD remain available without JavaScript.
- Hero uses an owned transparent head-only render, not a live rigged 3D model. The head remains fixed. `PortraitEyes.tsx` server-renders centered brown iris/pupil groups over blank sclera; only these inner groups move toward a fine pointer, within a 12×7 image-unit limit and fixed eyelid masks. No Three.js, GSAP, Framer Motion or Lenis import is needed by the homepage.
- `HomeMotion.tsx` renders nothing and adds one-shot Web Animations reveals, fine-pointer pupil tracking and a magnetic CTA. Pupil updates use one scheduled frame per pointer event burst, suspend off-screen and reset on pointer exit/window blur. Touch and reduced motion retain centered pupils. Preference changes clean up active effects. No text is split into Persian characters or hidden awaiting hydration.
- `WorkRibbon.tsx` renders existing project screenshots on the server. Two rows move in opposite directions with native view timelines; the fallback uses a passive scroll listener and one scheduled frame only while visible. No autoplay video/GIF downloads.
- Three real project cards stack only on sufficiently wide/tall viewports; mobile and reduced motion use normal document flow. Tools, blog cards, about text, process and contact progressively reveal while retaining all existing content.
- Home order: hero, decorative work ribbon, about, services, projects, tools, blog, contact. Existing route slugs, translations, API contracts and SEO schema structure are preserved.

## Image provenance

Built-in `image_gen` was used with the owner's supplied `sosho.jpg` as identity reference. Final selected animation base: `public/brand/soheil-character-3d.webp` (1000×1000, transparent alpha, 143,958 bytes). This intentionally contains blank sclera: centered brown pupils are supplied by the server-rendered SVG, including without JavaScript. The earlier bust was replaced at the owner's request on October 26. Optimization: `node scripts/build-character-asset.mjs <selected-generated-PNG>`. The original personal photograph is not copied into the public repository.

Earlier bust generation prompt (second pass, subsequently replaced):

> Use case: style-transfer. Image1 identity reference, image2 previous edit target. Make the man MUCH MORE stylized, unmistakably a cute polished 3D cartoon character rather than a photograph. Keep recognizable identity: side swept dark undercut, brown eyes, recognizable eyebrows/nose, dark short beard with few gray strands, mature adult. Like a high-end animated character portfolio mascot: head about 1.4x normal proportion, bigger friendly expressive eyes, rounder cheeks and larger rounded nose, sculpted chunky locks of hair, groomed beard made of softly sculpted shapes, smooth matte toy-like skin with no photographic pores or individually rendered beard strands. Warm kind reassuring CLOSED-MOUTH SMILE, slight raised smile cheeks, not serious or sad. Keep dark navy overshirt and charcoal crewneck from image2 with restrained copper stitching. Bust only, centered front facing, head and shoulders entirely in frame with clear margins, cropped at middle chest. Premium cinematic 3D character rendering, friendly engineer and creative studio founder. Real transparent alpha background, no background, no floor, no props, no text/logos/watermark, no glasses/earrings/hat. Focus on changing visual medium and expression; preserve likeness and outfit.

Palette and outfit were established in the initial generation: navy `#111820`, graphite `#1D2935`, steel blue `#8DAFC5`, restrained copper `#C98B62`; dark overshirt over a charcoal crewneck, soft studio lighting and steel-blue rim light. Bilingual descriptive alt text is colocated in the Hero Server Component.

Final head-only generation prompt (October 26, built-in ImageGen, previous portrait plus original identity reference):

> Use case: identity-preserve, style-transfer. Input1 is the existing cartoon portrait to replace. Input2 is the user's real face identity reference. Produce a SINGLE FLOATING HEAD ONLY for an interactive website, in a much more stylized cute premium 3D cartoon style like a rounded animated-film character. Keep this same mature adult man's identity: short dark side-swept undercut, brown eyebrows, recognizable nose, trimmed dark beard and moustache with small gray detail. Friendly warm gentle closed-mouth smile, kind intelligent expression. Slightly oversized round head, soft simplified toy-like features and sculpted hair/beard, smooth stylized skin, NOT a photograph. Strict front view with level symmetric eyes and no head tilt, looking directly forward. HEAD ONLY from hair to bottom of beard, NO NECK, NO SHOULDERS, NO BODY, NO CLOTHING. Entire head centered within square composition and occupying about 85% of image height, full ears and hair visible, clean transparent margins on all four sides. Transparent alpha background, studio soft light and gentle steel-blue rim light suitable for dark navy page. IMPORTANT ANIMATION LAYER REQUIREMENT: render BOTH eye openings as natural off-white blank sclera with natural dimensional eyelids, but WITHOUT IRIS, WITHOUT PUPILS, WITHOUT painted eye highlights; the website will supply brown iris/pupil layers over these eye openings to follow the mouse. Keep the eyelids and expression friendly and not startled, not angry; this is a layered animation base asset. Do not add props, graphics, letters, words, watermark, jewelry, glasses or any background.

## Validation

Completed October 26, 2026. No live deployment was performed.

- **Lint:** `npm.cmd run lint` passed. Temporary audit scripts use ESM and remain in the ignored `.playwright-mcp` directory.
- **Automated suite:** `npm.cmd test` passed all 161 tests across 12 files (October 25 run). The Windows sandbox emitted nonfatal static-analysis directory warnings; runtime tests completed successfully. Backend behavior was not changed by this work.
- **Build:** `npm.cmd run build` passed after the head/pupil update; TypeScript passed and all 108 static routes were generated.
- **Wrangler dry-run:** passed against the final bundle (1,284 asset files). The default filesystem sandbox blocked esbuild's parent-directory resolution; the authorized local dry-run succeeded outside that filesystem sandbox. Nothing was uploaded or deployed.
- **Static SEO audit:** all 90 localized HTML pages have exactly one H1, the correct initial `lang`/`dir`, production-origin canonical, language alternates and current palette. All 180 JSON-LD blocks parsed successfully. Existing content/slugs, OG metadata, service/project/article links and SEO structures remain intact.
- **No-JavaScript checks:** fresh JS-disabled browser contexts for `/fa` and `/en` retained the hero, centered pupils, all seven service links, three project links, six content sections and schemas. This verifies SSG content availability; it does not claim request-time SSR.
- **Browser:** Playwright inspected Persian/English homepages, mobile 320px/390px and desktop 1440px layouts, plus representative service, project, article, tools and admin-login pages. The mobile menu opened and closed with Escape. The 320px touch context had no horizontal overflow and no pupil tracking; projects used normal flow.
- **Interaction:** moving the mouse from left to right changed both pupil transforms while the head bounding box remained exactly unchanged. Switching reduced motion on reset pupils and disabled reveals, ribbon animation, emblem animation and sticky cards. Touch retains the centered gaze.
- **Payload:** the transparent head is 143,958 bytes; the homepage-specific JS chunk containing the motion island and other home interactions is 6,186 bytes gzip. All initial homepage script tags total 193,925 bytes gzip, including shared Next/React code. No live 3D engine or old hero video is loaded. These are build sizes, not a Core Web Vitals score.
- **Scope of preview:** the local static preview returns sales-unavailable and does not connect to production APIs. Public contact submission, authenticated admin writes and live chat were not exercised. The existing favicon manifest-size warning is outside this design change.

Local preview while the preview process runs: `http://127.0.0.1:3007/fa` and `/en`. Browser screenshots and the temporary static audit report are under `.playwright-mcp/` and are not committed product files.
