import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

import { getBlogPostBySlug, getBlogPostHref } from "@/app/blogs/posts";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import { getServiceHref, getService } from "@/app/components/Services/data";
import { TOOLS, getTool, type ToolSlug } from "@/app/components/Tools/data";
import { TOOL_GUIDE } from "@/app/components/Tools/guide";
import ContrastTool from "@/app/components/Tools/ContrastTool";
import FaqSchemaTool from "@/app/components/Tools/FaqSchemaTool";
import MetaTagTool from "@/app/components/Tools/MetaTagTool";
import RobotsSitemapTool from "@/app/components/Tools/RobotsSitemapTool";
import SeoAuditTool from "@/app/components/Tools/SeoAuditTool";
import ToolsGrid from "@/app/components/Tools/ToolsGrid";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

const TOOL_COMPONENTS: Record<ToolSlug, (props: { locale: Locale }) => React.ReactNode> = {
  "website-seo-audit": SeoAuditTool,
  "meta-tag-generator": MetaTagTool,
  "faq-schema-generator": FaqSchemaTool,
  "robots-sitemap-generator": RobotsSitemapTool,
  "contrast-checker": ContrastTool,
};

export function generateStaticParams() {
  return (["fa", "en"] as const).flatMap((locale) => TOOLS.map((tool) => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const tool = getTool(slug);
  if (!tool) return {};
  const dict = getDictionary(locale);
  const title = tool.seo.title[locale];
  const description = tool.seo.description[locale];
  const canonical = `/${locale}/tools/${tool.slug}`;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `/fa/tools/${tool.slug}`,
        en: `/en/tools/${tool.slug}`,
        "x-default": `/fa/tools/${tool.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: dict.siteName,
      title: `${title} | ${dict.siteName}`,
      description,
      images: [{ url: ogImageUrl, width: 1731, height: 909, alt: `${dict.siteName} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${dict.siteName}`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const tool = getTool(slug);
  if (!tool) notFound();

  const isFa = locale === "fa";
  const Icon = tool.Icon;
  const ToolComponent = TOOL_COMPONENTS[tool.slug];
  const title = tool.title[locale];
  const pageUrl = `${baseUrl}/${locale}/tools/${tool.slug}`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: isFa ? "ابزارها" : "Tools", path: `/${locale}/tools` },
    { name: title, path: `/${locale}/tools/${tool.slug}` },
  ];
  const service = getService(tool.service);
  const others = TOOLS.filter((entry) => entry.slug !== tool.slug).slice(0, 3);
  const guide = TOOL_GUIDE[tool.slug];
  const articles = guide.articles.flatMap((articleSlug) => getBlogPostBySlug(articleSlug) ?? []);

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "@id": `${pageUrl}#tool`,
              name: title,
              description: tool.seo.description[locale],
              url: pageUrl,
              inLanguage: languageTag(locale),
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any (web browser)",
              browserRequirements: "Requires JavaScript",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": organizationId },
            },
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: title,
              description: tool.seo.description[locale],
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
              mainEntity: { "@id": `${pageUrl}#tool` },
            },
            breadcrumbJsonLd(crumbs),
            {
              "@type": "HowTo",
              "@id": `${pageUrl}#howto`,
              name: title,
              inLanguage: languageTag(locale),
              step: tool.steps[locale].map((text, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                text,
              })),
            },
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              inLanguage: languageTag(locale),
              mainEntity: tool.faq.map((item) => ({
                "@type": "Question",
                name: item.question[locale],
                acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
              })),
            },
          ],
        }}
      />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />

      <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              {isFa ? "ابزار رایگان" : "Free tool"} · {tool.runsOn === "browser" ? (isFa ? "در مرورگر شما اجرا می‌شود" : "runs in your browser") : (isFa ? "بدون ثبت‌نام" : "no sign-up")}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{tool.intro[locale]}</p>
          </div>
          <div className="hidden lg:col-span-3 lg:flex lg:justify-end">
            <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-accent/20 bg-background/40 shadow-2xl shadow-primary/15">
              <Icon className="h-14 w-14 text-accent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      <section aria-label={title}>
        <ToolComponent locale={locale} />
      </section>

      <section aria-labelledby="tool-howto-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="tool-howto-title" className="text-xl font-bold text-foreground">
          {isFa ? "روش استفاده" : "How to use it"}
        </h2>
        <ol className="mt-5 grid gap-3">
          {tool.steps[locale].map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm leading-7 text-muted">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent/30 text-xs font-bold text-accent" aria-hidden="true">
                {isFa ? ["۱", "۲", "۳", "۴", "۵"][index] : index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="tool-when-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
          <h2 id="tool-when-title" className="text-xl font-bold text-foreground">
            {isFa ? "چه زمانی از این ابزار استفاده کنیم؟" : "When to use this tool"}
          </h2>
          <ul className="mt-4 grid gap-3">
            {guide.when[locale].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="tool-tips-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
          <h2 id="tool-tips-title" className="text-xl font-bold text-foreground">
            {isFa ? "نکته‌هایی برای نتیجه بهتر" : "Tips for a better result"}
          </h2>
          <ul className="mt-4 grid gap-3">
            {guide.tips[locale].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="tool-faq-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="tool-faq-title" className="text-xl font-bold text-foreground">
          {isFa ? "پرسش‌های متداول" : "Frequently asked questions"}
        </h2>
        <div className="mt-5 divide-y divide-foreground/10">
          {tool.faq.map((item) => (
            <div key={item.question.en} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-bold text-foreground md:text-base">{item.question[locale]}</h3>
              <p className="mt-1.5 text-sm leading-7 text-muted">{item.answer[locale]}</p>
            </div>
          ))}
        </div>
      </section>

      {articles.length > 0 ? (
        <section aria-labelledby="tool-articles-title">
          <h2 id="tool-articles-title" className="mb-4 text-xl font-bold text-foreground">
            {isFa ? "برای مطالعه بیشتر" : "Keep reading"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((post) => (
              <Link
                key={post.slug}
                href={getBlogPostHref(locale, post.slug)}
                prefetch={false}
                className="group rounded-2xl border border-foreground/10 bg-surface/20 p-5 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{isFa ? "مقاله" : "Article"}</p>
                <h3 className="mt-2 text-base font-bold leading-7 text-foreground transition-colors group-hover:text-accent">{post.title[locale]}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{post.excerpt[locale]}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="tool-more-title">
        <h2 id="tool-more-title" className="mb-4 text-xl font-bold text-foreground">
          {isFa ? "ابزارهای رایگان دیگر" : "More free tools"}
        </h2>
        <ToolsGrid locale={locale} tools={others} />
      </section>

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{isFa ? "قدم بعدی" : "Next step"}</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            {isFa ? "اصلاح‌ها را به ما بسپارید" : "Leave the fixing to us"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {isFa
              ? "ابزار مشکل را نشان می‌دهد؛ اجرای درست آن کار تیم ماست."
              : "A tool shows the problem; doing the fix properly is our team's job."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {service ? (
            <Link
              href={getServiceHref(locale, service.slug)}
              prefetch={false}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {service.title[locale]}
            </Link>
          ) : null}
          <Link
            href={`/${locale}#contact`}
            prefetch={false}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
          >
            {isFa ? "شروع گفتگو" : "Start a conversation"}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
