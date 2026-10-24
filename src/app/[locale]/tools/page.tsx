import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import { TOOLS, getToolHref } from "@/app/components/Tools/data";
import ToolsGrid from "@/app/components/Tools/ToolsGrid";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

export function generateStaticParams() {
  return (["fa", "en"] as const).map((locale) => ({ locale }));
}

const META = {
  fa: {
    title: "ابزارهای رایگان سئو و طراحی وب",
    description:
      "ابزارهای رایگان و بدون ثبت‌نام: بررسی سئوی سایت، ساخت متاتگ، اسکیمای FAQ، robots.txt، sitemap و بررسی کنتراست رنگ.",
    heading: "ابزارهای رایگان برای سایت شما",
    intro:
      "این ابزارها را خودمان برای کارهای روزمرهٔ سئو و طراحی ساخته‌ایم و رایگان در اختیار شما می‌گذاریم. بیشتر آن‌ها داخل مرورگر شما کار می‌کنند و چیزی ذخیره نمی‌شود.",
    cta: "از سایتتان بیشتر می‌خواهید؟",
    ctaBody: "اگر نتیجهٔ ابزارها نشان داد سایت‌تان کار دارد، اصلاح آن را به ما بسپارید.",
    ctaButton: "شروع گفتگو",
  },
  en: {
    title: "Free SEO and Web Design Tools",
    description:
      "Free tools with no sign-up: website SEO check, meta tag generator, FAQ schema, robots.txt, sitemap and color contrast checker.",
    heading: "Free tools for your website",
    intro:
      "We built these tools for our own day-to-day SEO and design work and share them for free. Most run in your browser and nothing is stored.",
    cta: "Want more from your site?",
    ctaBody: "If the tools show your site needs work, leave the fixing to us.",
    ctaButton: "Start a conversation",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const dict = getDictionary(locale);
  const meta = META[locale];
  const canonical = `/${locale}/tools`;
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: { fa: "/fa/tools", en: "/en/tools", "x-default": "/fa/tools" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: dict.siteName,
      title: `${meta.title} | ${dict.siteName}`,
      description: meta.description,
      images: [{ url: ogImageUrl, width: 1731, height: 909, alt: `${dict.siteName} — ${meta.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ${dict.siteName}`,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isFa = locale === "fa";
  const meta = META[locale];
  const pageUrl = `${baseUrl}/${locale}/tools`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: isFa ? "ابزارها" : "Tools", path: `/${locale}/tools` },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: meta.title,
              description: meta.description,
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              publisher: { "@id": organizationId },
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
              mainEntity: { "@id": `${pageUrl}#tools` },
            },
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#tools`,
              itemListElement: TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.title[locale],
                url: `${baseUrl}${getToolHref(locale, tool.slug)}`,
              })),
            },
            breadcrumbJsonLd(crumbs),
          ],
        }}
      />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />

      <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            {isFa ? "ابزارهای رایگان سوشو" : "Sosho free tools"}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">{meta.heading}</h1>
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{meta.intro}</p>
        </div>
      </header>

      <ToolsGrid locale={locale} />

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{meta.cta}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{meta.ctaBody}</p>
        </div>
        <Link
          href={`/${locale}#contact`}
          prefetch={false}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
        >
          {meta.ctaButton}
          <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
