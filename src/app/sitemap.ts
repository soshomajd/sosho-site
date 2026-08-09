import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/app/blogs/posts";
import { SERVICES } from "@/app/components/Services/data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");
  const now = new Date();
  const homeLanguages = {
    fa: `${base}/fa`,
    en: `${base}/en`,
    "x-default": `${base}/fa`,
  };
  const blogLanguages = {
    fa: `${base}/fa/blogs`,
    en: `${base}/en/blogs`,
    "x-default": `${base}/fa/blogs`,
  };

  const serviceEntries: MetadataRoute.Sitemap = SERVICES.flatMap((service) => {
    const languages = {
      fa: `${base}/fa/services/${service.slug}`,
      en: `${base}/en/services/${service.slug}`,
      "x-default": `${base}/fa/services/${service.slug}`,
    };

    return (["fa", "en"] as const).map((locale) => ({
      url: `${base}/${locale}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });

  const postEntries: MetadataRoute.Sitemap = BLOG_POSTS.flatMap((post) => {
    const languages = {
      fa: `${base}/fa/blogs/${post.slug}`,
      en: `${base}/en/blogs/${post.slug}`,
      "x-default": `${base}/fa/blogs/${post.slug}`,
    };

    return (["fa", "en"] as const).map((locale) => ({
      url: `${base}/${locale}/blogs/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
      alternates: { languages },
    }));
  });

  return [
    {
      url: `${base}/fa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${base}/fa/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: blogLanguages },
    },
    {
      url: `${base}/en/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: blogLanguages },
    },
    ...serviceEntries,
    ...postEntries,
  ];
}
