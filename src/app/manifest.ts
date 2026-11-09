import type { MetadataRoute } from "next";
import { THEME } from "./theme/tokens";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sosho Studio | Web Design, SEO, Web3 & AI",
    short_name: "Sosho Studio",
    description:
      "End-to-end web design and development, WordPress, SEO, Web3, and AI solutions.",
    start_url: "/fa",
    scope: "/",
    display: "standalone",
    lang: "fa",
    dir: "rtl",
    background_color: THEME.background,
    theme_color: THEME.background,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
