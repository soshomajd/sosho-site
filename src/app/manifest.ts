import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Soheil Shokouhi Majd | Freelancer",
    short_name: "Soheil",
    description: "Freelancer portfolio: projects, services, and contact.",
    start_url: "/",
    display: "standalone",
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
