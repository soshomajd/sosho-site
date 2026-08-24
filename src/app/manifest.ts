import type { MetadataRoute } from "next";

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
    background_color: "#0B0F14",
    theme_color: "#0B0F14",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
