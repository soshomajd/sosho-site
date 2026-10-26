import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowUpRight, FiCheck, FiExternalLink } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import { PROJECTS, getProject, getProjectHref } from "@/app/components/Projects/data";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return (["fa", "en"] as const).flatMap((locale) => PROJECTS.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const project = getProject(slug);
  if (!project) return {};
  const dict = getDictionary(locale);
  const title = project.seo.title[locale];
  const description = project.seo.description[locale];
  const canonical = `/${locale}/projects/${project.slug}`;
  const image = new URL(project.images[0].src, siteUrl).toString();
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `/fa/projects/${project.slug}`,
        en: `/en/projects/${project.slug}`,
        "x-default": `/fa/projects/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: dict.siteName,
      title: `${title} | ${dict.siteName}`,
      description,
      images: [{ url: image, width: project.images[0].width, height: project.images[0].height, alt: project.images[0].alt[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${dict.siteName}`,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const project = getProject(slug);
  if (!project) notFound();

  const isFa = locale === "fa";
  const title = project.title[locale];
  const pageUrl = `${baseUrl}/${locale}/projects/${project.slug}`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: isFa ? "نمونه‌کارها" : "Work", path: `/${locale}#projects` },
    { name: title, path: `/${locale}/projects/${project.slug}` },
  ];
  const others = PROJECTS.filter((entry) => entry.slug !== project.slug);
  const [hero, tablet, mobile] = project.images;

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: project.seo.title[locale],
              description: project.seo.description[locale],
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
              mainEntity: { "@id": `${pageUrl}#work` },
              primaryImageOfPage: `${baseUrl}${hero.src}`,
            },
            {
              "@type": "CreativeWork",
              "@id": `${pageUrl}#work`,
              name: title,
              description: project.summary[locale],
              url: project.url,
              inLanguage: "fa-IR",
              genre: project.service[locale],
              about: project.industry[locale],
              creator: { "@id": organizationId },
              image: project.images.map((image) => `${baseUrl}${image.src}`),
            },
            breadcrumbJsonLd(crumbs),
          ],
        }}
      />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />

      <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{project.service[locale]}</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">{title}</h1>
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{project.summary[locale]}</p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
          >
            {isFa ? "مشاهدهٔ سایت زنده" : "Visit the live site"}
            <span dir="ltr" className="text-xs font-semibold opacity-70">{project.host}</span>
            <FiExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <figure className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20">
        <Image
          src={hero.src}
          alt={hero.alt[locale]}
          width={hero.width}
          height={hero.height}
          preload
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="h-auto w-full"
        />
        <figcaption className="px-5 py-3 text-xs text-muted">{hero.caption[locale]}</figcaption>
      </figure>

      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-labelledby="project-overview" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-8">
          <h2 id="project-overview" className="text-xl font-bold text-foreground">
            {isFa ? "دربارهٔ این پروژه" : "About this project"}
          </h2>
          <div className="mt-4 grid gap-4 text-sm leading-8 text-muted md:text-base">
            {project.overview[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <aside aria-labelledby="project-facts" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-4">
          <h2 id="project-facts" className="text-xl font-bold text-foreground">
            {isFa ? "مشخصات" : "At a glance"}
          </h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "نوع کار" : "Type of work"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{project.service[locale]}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "حوزهٔ فعالیت" : "Industry"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{project.industry[locale]}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "زبان سایت" : "Site language"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{isFa ? "فارسی، راست‌به‌چین" : "Persian, right to left"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "آدرس" : "Address"}</dt>
              <dd className="mt-1">
                <a href={project.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="break-all text-foreground underline underline-offset-4 hover:text-accent">
                  {project.host}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section aria-labelledby="project-includes" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="project-includes" className="text-xl font-bold text-foreground">{project.includes.title[locale]}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {project.includes.items[locale].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted">
              <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="project-views" className="grid gap-4 md:grid-cols-12">
        <h2 id="project-views" className="sr-only">{isFa ? "تصویرهای بیشتر" : "More views"}</h2>
        <figure className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 md:col-span-8">
          <Image src={tablet.src} alt={tablet.alt[locale]} width={tablet.width} height={tablet.height} sizes="(max-width: 480px) 90vw, 448px" className="mx-auto h-auto w-full max-w-md" />
          <figcaption className="px-5 py-3 text-xs text-muted">{tablet.caption[locale]}</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 md:col-span-4">
          <Image src={mobile.src} alt={mobile.alt[locale]} width={mobile.width} height={mobile.height} sizes="(max-width: 768px) 80vw, 33vw" className="mx-auto h-auto w-full max-w-xs" />
          <figcaption className="px-5 py-3 text-xs text-muted">{mobile.caption[locale]}</figcaption>
        </figure>
      </section>

      <section aria-labelledby="project-more">
        <h2 id="project-more" className="mb-4 text-xl font-bold text-foreground">
          {isFa ? "نمونه‌کارهای دیگر" : "More work"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={getProjectHref(locale, other.slug)}
              prefetch={false}
              className="group overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <Image src={other.images[0].src} alt={other.images[0].alt[locale]} width={other.images[0].width} height={other.images[0].height} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{other.service[locale]}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground transition-colors group-hover:text-accent">{other.title[locale]}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{other.summary[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{isFa ? "پروژهٔ بعدی" : "Your project"}</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            {isFa ? "سایت بعدی را با هم بسازیم" : "Let’s build your site next"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {isFa
              ? "هدف و حوزهٔ کارتان را بفرستید تا مسیر مناسب و محدودهٔ اولیه را با هم مشخص کنیم."
              : "Send your goal and field of work and we will define the right approach and an initial scope together."}
          </p>
        </div>
        <Link
          href={`/${locale}#contact`}
          prefetch={false}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
        >
          {isFa ? "شروع گفتگو" : "Start a conversation"}
          <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
