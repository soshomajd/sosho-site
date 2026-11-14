import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import Projects from "@/app/components/Projects";
import RealProjectCards from "@/app/components/Projects/RealProjectCards";
import { PROJECTS, getProjectShareImage } from "@/app/components/Projects/data";
import { MORE_PROJECTS } from "@/app/components/Projects/showcase";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";
import "@/app/components/home-motion.css";

const META = {
  fa: {
    title: "نمونه‌کار طراحی سایت و رابط کاربری",
    description: "نمونه‌کارهای طراحی سایت سوشو استودیو: پروژه‌های واقعی فروشگاهی و شرکتی و طرح‌های مفهومی آموزشی، صنعتی، داشبورد و Web3 با نمای دسکتاپ، تبلت و موبایل.",
    heading: "نمونه‌کارهای طراحی سایت و رابط کاربری",
    intro: `${PROJECTS.length.toLocaleString("fa-IR")} پروژهٔ واقعی که سایتشان در دسترس است و ${MORE_PROJECTS.length.toLocaleString("fa-IR")} طرح مفهومی با هویت و چیدمان متفاوت. نمای هیرو در دسکتاپ، تبلت و موبایل را کنار هم ببینید و توضیح هر کار را در صفحهٔ خودش بخوانید.`,
    realTitle: "پروژه‌های واقعی",
    realIntro: "این سایت‌ها برای مشتری ساخته شده‌اند و آدرس زنده دارند. در صفحهٔ هر پروژه، مسئلهٔ طراحی، تصمیم‌ها و مسیر کاربر توضیح داده شده است.",
    conceptTitle: "طرح‌های مفهومی",
    conceptIntro: "این‌ها طرح‌های اصلی استودیو برای نشان دادن جهت بصری و ساختار رابط‌اند؛ پروژهٔ تحویل‌شده به مشتری نیستند و با برچسب «طرح مفهومی» مشخص شده‌اند.",
    back: "بازگشت به نمونه‌کارهای منتخب",
  },
  en: {
    title: "Website and UI Design Portfolio",
    description: "SoSho Studio's web design portfolio: real ecommerce and corporate projects plus original dashboard and Web3 concepts in desktop, tablet and mobile views.",
    heading: "Website and UI design portfolio",
    intro: `${PROJECTS.length} real projects with live websites and ${MORE_PROJECTS.length} original design concepts, each with its own identity and composition. Compare desktop, tablet and mobile hero views and read about each piece of work on its own page.`,
    realTitle: "Real projects",
    realIntro: "These websites were built for clients and are live. Each project page explains the design problem, the decisions and the user journey.",
    conceptTitle: "Design concepts",
    conceptIntro: "These are the studio's original studies of visual direction and interface structure. They are not delivered client projects and are labelled as design concepts.",
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
  const image = { ...getProjectShareImage(locale, PROJECTS[0].slug), alt: PROJECTS[0].images[0].alt };
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
    { name: locale === "fa" ? "نمونه‌کارها" : "Work", path: `/${locale}/projectcs` },
  ];
  const listItems = [
    ...PROJECTS.map((project) => ({ project, genre: locale === "fa" ? "نمونه‌کار واقعی" : "Case study" })),
    ...MORE_PROJECTS.map((project) => ({ project, genre: locale === "fa" ? "طرح مفهومی" : "Design concept" })),
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
            "@type": "ItemList", "@id": `${pageUrl}#projects`, numberOfItems: listItems.length,
            itemListElement: listItems.map(({ project, genre }, index) => ({
              "@type": "ListItem", position: index + 1,
              item: { "@type": "CreativeWork", url: `${baseUrl}/${locale}/projects/${project.slug}`, name: project.title[locale], description: project.summary[locale], image: `${baseUrl}${project.images[0].src}`, genre },
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
      <section aria-labelledby="portfolio-real-title" className="mt-12">
        <h2 id="portfolio-real-title" className="text-2xl font-bold text-foreground">{meta.realTitle}</h2>
        <p className="mt-3 mb-6 max-w-3xl text-sm leading-8 text-muted">{meta.realIntro}</p>
        <RealProjectCards locale={locale} />
      </section>
      <section aria-labelledby="portfolio-concepts-title" className="mt-14">
        <h2 id="portfolio-concepts-title" className="text-2xl font-bold text-foreground">{meta.conceptTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">{meta.conceptIntro}</p>
        <Projects locale={locale} archive />
      </section>
      <div className="mt-10 flex justify-center"><Link href={`/${locale}#projects`} prefetch={false} className="project-card-link">{meta.back}</Link></div>
    </main>
  );
}
