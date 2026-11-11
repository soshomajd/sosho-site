import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import Projects from "@/app/components/Projects";
import { getProjectShareImage } from "@/app/components/Projects/data";
import { MORE_PROJECTS } from "@/app/components/Projects/showcase";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";
import "@/app/components/home-motion.css";

const META = {
  fa: {
    title: "نمونه‌کار طراحی سایت و رابط کاربری",
    description: "نمونه‌کارهای طراحی سایت سوشو استودیو: طرح‌های مفهومی فروشگاه، شرکتی، آموزشی، صنعتی، داشبورد و Web3 با نمای دسکتاپ، تبلت و موبایل.",
    heading: "نمونه‌کارهای طراحی سایت و رابط کاربری",
    intro: `ایده‌های متفاوت، برای تجربه‌های متفاوت؛ ${MORE_PROJECTS.length.toLocaleString("fa-IR")} طرح مفهومی با هویت و چیدمان متفاوت. نمای هیرو در دسکتاپ، تبلت و موبایل را کنار هم ببینید و توضیح هر طرح را در صفحهٔ خودش بخوانید.`,
    back: "بازگشت به نمونه‌کارهای منتخب",
  },
  en: {
    title: "Website and UI Design Portfolio",
    description: "SoSho Studio's website design portfolio: original commerce, corporate, education, industrial, dashboard and Web3 concepts with desktop, tablet and mobile views.",
    heading: "Website and UI design portfolio",
    intro: `Different ideas, distinct experiences. Explore ${MORE_PROJECTS.length} original design concepts, each with its own identity and composition. Compare desktop, tablet and mobile hero views and read the thinking behind each design on its own page.`,
    back: "Back to selected work",
  },
} as const;

export function generateStaticParams() {
  return (["fa", "en"] as const).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const meta = META[locale];
  const dict = getDictionary(locale);
  const image = { ...getProjectShareImage(locale, MORE_PROJECTS[0].slug), alt: MORE_PROJECTS[0].images[0].alt };
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}/projectcs`,
      languages: { fa: "/fa/projectcs", en: "/en/projectcs", "x-default": "/fa/projectcs" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}/projectcs`,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      siteName: dict.siteName,
      title: `${meta.title} | ${dict.siteName}`,
      description: meta.description,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt[locale] }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [image.src] },
  };
}

export default async function MoreProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const meta = META[locale];
  const pageUrl = `${baseUrl}/${locale}/projectcs`;
  const crumbs = [
    { name: locale === "fa" ? "خانه" : "Home", path: `/${locale}` },
    { name: locale === "fa" ? "نمونه‌کارهای بیشتر" : "More design work", path: `/${locale}/projectcs` },
  ];
  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch py-12 outline-none md:py-20">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage", "@id": `${pageUrl}#webpage`, url: pageUrl,
            name: meta.title, description: meta.description, inLanguage: languageTag(locale),
            isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
            breadcrumb: { "@id": `${pageUrl}#breadcrumb` }, mainEntity: { "@id": `${pageUrl}#projects` },
          },
          {
            "@type": "ItemList", "@id": `${pageUrl}#projects`, numberOfItems: MORE_PROJECTS.length,
            itemListElement: MORE_PROJECTS.map((project, index) => ({
              "@type": "ListItem", position: index + 1,
              item: { "@type": "CreativeWork", url: `${baseUrl}/${locale}/projects/${project.slug}`, name: project.title[locale], description: project.summary[locale], image: `${baseUrl}${project.images[0].src}`, genre: locale === "fa" ? "طرح مفهومی" : "Design concept" },
            })),
          },
          breadcrumbJsonLd(crumbs),
        ],
      }} />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />
      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">{locale === "fa" ? "سوشو استودیو · مجموعهٔ طراحی" : "Sosho Studio · Design collection"}</p>
        <h1 className="mt-5 text-4xl font-extrabold leading-snug text-foreground md:text-5xl">{meta.heading}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{meta.intro}</p>
        <Link href={`/${locale}#projects`} prefetch={false} className="project-card-link mt-6">{meta.back}</Link>
      </header>
      <Projects locale={locale} archive />
      <div className="mt-10 flex justify-center"><Link href={`/${locale}#projects`} prefetch={false} className="project-card-link">{meta.back}</Link></div>
    </main>
  );
}
