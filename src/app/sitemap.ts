import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/app/blogs/posts";
import { PROJECTS } from "@/app/components/Projects/data";
import { SERVICES } from "@/app/components/Services/data";
import { TOOLS } from "@/app/components/Tools/data";
import { SITE_CONTENT_UPDATED_AT } from "@/app/seo";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");
  // Real "last changed" dates instead of the build time, so lastmod stays trustworthy.
  const latestPost = new Date(
    Math.max(...BLOG_POSTS.map((post) => Date.parse(post.updatedAt ?? post.publishedAt)))
  );
  const siteUpdated = new Date(SITE_CONTENT_UPDATED_AT);
  const homeUpdated = latestPost > siteUpdated ? latestPost : siteUpdated;
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
      lastModified: siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });

  const projectHubLanguages = {
    fa: `${base}/fa/projectcs`,
    en: `${base}/en/projectcs`,
    "x-default": `${base}/fa/projectcs`,
  };
  const projectHubEntries: MetadataRoute.Sitemap = (["fa", "en"] as const).map((locale) => ({
    url: `${base}/${locale}/projectcs`,
    lastModified: siteUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: { languages: projectHubLanguages },
  }));
  const projectEntries: MetadataRoute.Sitemap = PROJECTS.flatMap((project) => {
    const languages = {
      fa: `${base}/fa/projects/${project.slug}`,
      en: `${base}/en/projects/${project.slug}`,
      "x-default": `${base}/fa/projects/${project.slug}`,
    };
    return (["fa", "en"] as const).map((locale) => ({
      url: `${base}/${locale}/projects/${project.slug}`,
      lastModified: siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages },
      images: project.images.map((image) => `${base}${image.src}`),
    }));
  });

  const toolLanguages = {
    fa: `${base}/fa/tools`,
    en: `${base}/en/tools`,
    "x-default": `${base}/fa/tools`,
  };
  const toolEntries: MetadataRoute.Sitemap = [
    ...(["fa", "en"] as const).map((locale) => ({
      url: `${base}/${locale}/tools`,
      lastModified: siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: toolLanguages },
    })),
    ...TOOLS.flatMap((tool) => {
      const languages = {
        fa: `${base}/fa/tools/${tool.slug}`,
        en: `${base}/en/tools/${tool.slug}`,
        "x-default": `${base}/fa/tools/${tool.slug}`,
      };
      return (["fa", "en"] as const).map((locale) => ({
        url: `${base}/${locale}/tools/${tool.slug}`,
        lastModified: siteUpdated,
        changeFrequency: "monthly" as const,
        priority: 0.75,
        alternates: { languages },
      }));
    }),
  ];

  const postEntries: MetadataRoute.Sitemap = BLOG_POSTS.flatMap((post) => {
    const languages = {
      fa: `${base}/fa/blogs/${post.slug}`,
      en: `${base}/en/blogs/${post.slug}`,
      "x-default": `${base}/fa/blogs/${post.slug}`,
    };
    const lastModified = new Date(post.updatedAt ?? post.publishedAt);

    return (["fa", "en"] as const).map((locale) => ({
      url: `${base}/${locale}/blogs/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
      alternates: { languages },
      ...(post.coverImage ? { images: [`${base}${post.coverImage}`] } : {}),
    }));
  });

  return [
    {
      url: `${base}/fa`,
      lastModified: homeUpdated,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${base}/en`,
      lastModified: homeUpdated,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${base}/fa/blogs`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: blogLanguages },
    },
    {
      url: `${base}/en/blogs`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: blogLanguages },
    },
    ...serviceEntries,
    ...toolEntries,
    ...projectHubEntries,
    ...projectEntries,
    ...postEntries,
  ];
}
