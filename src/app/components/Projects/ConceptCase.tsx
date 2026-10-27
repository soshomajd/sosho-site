import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import type { Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

import { CONCEPT_PROJECTS, type ConceptProject } from "./concepts";
import { getProjectHref } from "./data";

/** SEO title and description for a concept page; nothing here claims a client, a result or a live site. */
export function conceptSeo(concept: ConceptProject, locale: Locale) {
  const isFa = locale === "fa";
  return {
    title: isFa ? `${concept.title.fa}؛ طرح مفهومی سوشو استودیو` : `${concept.title.en}: SoSho Studio Design Concept`,
    description: concept.summary[locale],
  };
}

const button =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none";

/** Detail page of one original design concept: its own page, clearly labelled as a concept. */
export default function ConceptCase({ concept, locale }: { concept: ConceptProject; locale: Locale }) {
  const isFa = locale === "fa";
  const title = concept.title[locale];
  const seo = conceptSeo(concept, locale);
  const pageUrl = `${baseUrl}/${locale}/projects/${concept.slug}`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: isFa ? "نمونه‌کارها" : "Work", path: `/${locale}#projects` },
    { name: title, path: `/${locale}/projects/${concept.slug}` },
  ];
  const index = CONCEPT_PROJECTS.findIndex((entry) => entry.slug === concept.slug);
  const others = [1, 2].map((step) => CONCEPT_PROJECTS[(index + step) % CONCEPT_PROJECTS.length]);
  const [hero, tablet, mobile] = concept.images;
  const interfaceLanguage =
    concept.language === "fa"
      ? isFa ? "فارسی، راست‌به‌چپ" : "Persian, right to left"
      : isFa ? "انگلیسی، چپ‌به‌راست" : "English, left to right";
  const overview = isFa
    ? [
        `«${title}» یک طرح مفهومی اصلی از سوشو استودیو است: جهت بصری و ساختار رابط برای یک پروژهٔ «${concept.service.fa}». این طرح پروژهٔ تحویل‌شده به مشتری نیست و آدرس زنده ندارد؛ برای نشان دادن سلیقهٔ طراحی و نوع تجربه‌ای است که می‌شود ساخت.`,
        "اگر ساختاری مشابه برای کسب‌وکار شما مناسب است، هدف، مخاطب و محتوای واقعی‌تان تعیین می‌کند چه بخش‌هایی نگه داشته شود و چه چیزهایی عوض شود؛ از همان‌جا طرح به یک سایت واقعی تبدیل می‌شود.",
      ]
    : [
        `“${title}” is an original SoSho Studio design concept: a visual direction and interface structure for a “${concept.service.en}” project. It is not a delivered client project and has no live address; it shows the design approach and the kind of experience that can be built.`,
        "If a similar structure fits your business, your real goal, audience and content decide what stays and what changes, and that is where the concept becomes an actual website.",
      ];

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
              name: seo.title,
              description: seo.description,
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
              description: concept.summary[locale],
              inLanguage: concept.language === "fa" ? "fa-IR" : "en",
              genre: concept.service[locale],
              creator: { "@id": organizationId },
              image: concept.images.map((image) => `${baseUrl}${image.src}`),
            },
            breadcrumbJsonLd(crumbs),
          ],
        }}
      />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />

      <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span>{concept.service[locale]}</span>
            <span className="project-concept-badge">{isFa ? "طرح مفهومی" : "Design concept"}</span>
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">{title}</h1>
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{concept.summary[locale]}</p>
          <Link href={`/${locale}#contact`} prefetch={false} className={`mt-7 ${button}`}>
            {isFa ? "طرحی مشابه برای کسب‌وکار من" : "A similar design for my business"}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <figure className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20">
        <Image src={hero.src} alt={hero.alt[locale]} width={hero.width} height={hero.height} preload sizes="(max-width: 1200px) 100vw, 1200px" className="h-auto w-full" />
        <figcaption className="px-5 py-3 text-xs text-muted">{hero.caption[locale]}</figcaption>
      </figure>

      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-labelledby="project-overview" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-8">
          <h2 id="project-overview" className="text-xl font-bold text-foreground">{isFa ? "دربارهٔ این طرح" : "About this concept"}</h2>
          <div className="mt-4 grid gap-4 text-sm leading-8 text-muted md:text-base">
            {overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <aside aria-labelledby="project-facts" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-4">
          <h2 id="project-facts" className="text-xl font-bold text-foreground">{isFa ? "مشخصات" : "At a glance"}</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "نوع کار" : "Type of work"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{concept.service[locale]}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "وضعیت" : "Status"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{isFa ? "طرح مفهومی؛ پروژهٔ مشتری نیست" : "Design concept; not a client project"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "زبان رابط" : "Interface language"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{interfaceLanguage}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-accent">{isFa ? "نماها" : "Views"}</dt>
              <dd className="mt-1 leading-7 text-foreground">{isFa ? "دسکتاپ، تبلت و موبایل" : "Desktop, tablet and mobile"}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section aria-labelledby="project-includes" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="project-includes" className="text-xl font-bold text-foreground">{isFa ? "بخش‌های نمایش‌داده‌شده در طرح" : "Sections shown in the concept"}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {concept.features[locale].map((item) => (
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
        <h2 id="project-more" className="mb-4 text-xl font-bold text-foreground">{isFa ? "طرح‌ها و نمونه‌کارهای دیگر" : "More work"}</h2>
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
        <div className="mt-6 flex justify-center">
          <Link href={`/${locale}/projectcs`} prefetch={false} className="project-card-link">
            {isFa ? "همهٔ نمونه‌کارها و طرح‌ها" : "All projects and concepts"}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{isFa ? "پروژهٔ بعدی" : "Your project"}</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">{isFa ? "سایت بعدی را با هم بسازیم" : "Let’s build your site next"}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {isFa
              ? "هدف و حوزهٔ کارتان را بفرستید تا مسیر مناسب و محدودهٔ اولیه را با هم مشخص کنیم."
              : "Send your goal and field of work and we will define the right approach and an initial scope together."}
          </p>
        </div>
        <Link href={`/${locale}#contact`} prefetch={false} className={button}>
          {isFa ? "شروع گفتگو" : "Start a conversation"}
          <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
