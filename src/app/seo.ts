import type { Locale } from "@/app/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const baseUrl = siteUrl.replace(/\/$/, "");
export const siteName = "Sosho Studio";
export const organizationId = `${baseUrl}/#organization`;
export const websiteId = `${baseUrl}/#website`;

export type Crumb = { name: string; path: string };

export function languageTag(locale: Locale) {
  return locale === "fa" ? "fa-IR" : "en-US";
}

/** schema.org BreadcrumbList for the given trail (path = site-relative, e.g. "/fa/blogs"). */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const last = crumbs[crumbs.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}${last.path}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.path}`,
    })),
  };
}

/** Last meaningful edit to the homepage or service pages; bump it when they change (feeds sitemap lastmod). */
export const SITE_CONTENT_UPDATED_AT = "2026-10-29";
