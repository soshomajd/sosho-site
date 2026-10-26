# Full-width About visual — October 26, 2026

The small square logo illustration in `About/index.tsx` was replaced by an owned panoramic 3D image spanning the full card width. Existing bilingual studio copy, proof points, process and stack remain in the Server Component below the image. No business claims, routes or schemas were changed.

## Asset provenance

Built-in `image_gen` generated the panorama using `public/brand/logo-mark-light.webp` as the exact brand-mark reference. The scene connects the extruded SoSho mark with glass interface layers, an idea/wireframe object and an architectural data structure. Navy/graphite, steel-blue light paths, restrained copper and orbital lines match the portrait hero.

Final prompt and bilingual alt text: `scripts/about-art-manifest.json`.

- Desktop: `public/brand/about-studio-panorama-20261026.webp`, 1800×720, 98,266 bytes.
- Mobile: `public/brand/about-studio-panorama-20261026-sm.webp`, 900×360, 32,602 bytes.
- Reproduction of optimization: `node scripts/build-about-art.mjs <selected-generated-PNG>`.

The native `picture` source selects the smaller asset at widths up to 767px. The image is lazy-loaded, has explicit aspect ratio/dimensions and bilingual descriptive alt text. It does not compete with the eager hero portrait.

## Motion and content

The existing `HomeMotion` effect-only island recognizes `data-reveal="cinematic"`. On first intersection it progressively enhances the already-visible figure with:

- an 1100ms inset-frame opening and upward settle;
- a 1500ms image zoom from 1.12 to 1;
- a finite 1300ms steel-blue/copper light sweep.

Heading and proof cards use the existing staggered reveals. No new client component, WebGL engine, animation library or repeating image animation was added. Reduced-motion changes cancel active Web Animations; static CSS leaves the complete image/content visible. With JavaScript disabled, the image, captions, copy and process remain normal HTML.

## Validation

- **Lint:** passed.
- **Automated suite:** 161 tests passed in 12 files; the same nonfatal Windows sandbox static-analysis warnings were present.
- **Build:** production static export and TypeScript passed, generating all 108 routes.
- **SEO audit:** all 90 localized HTML files retained a single H1, production canonical/alternates, correct language/direction and 180 valid JSON-LD blocks.
- **Desktop browser:** the visual spans the full 1214px interior of its 1216px card. Playwright observed all three reveal animations at 1100/1500/1300ms, and the final frame returned to opacity 1 with no clipping.
- **Mobile/no JavaScript:** a fresh English JS-disabled 320px context selected the 900×360 asset, retained the image/captions/copy and had no horizontal overflow. The visual fills the full card interior (286px of a 288px bordered card).
- **Reduced motion:** zero active visual animations, opacity 1 and no clipping. The complete image remains visible.
- **Payload:** no animation library or client component was added. The existing home interaction chunk is now 6,228 bytes gzip; the whole initial homepage JS list is 193,967 bytes gzip including shared Next/React.

The local preview remains at `http://127.0.0.1:3007/fa#about` and `/en#about`; no production deployment was performed.
