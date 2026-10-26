import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";

import { getBlogPostHref } from "@/app/blogs/posts";
import { postsForService } from "@/app/blogs/related";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { SERVICE_FAQ } from "@/app/components/Services/faq";
import JsonLd from "@/app/components/JsonLd";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";
import {
    getService,
    SERVICES,
    SERVICE_BULLET_ICON,
} from "@/app/components/Services/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

export function generateStaticParams() {
    // Pre-generate all locale + service combinations.
    const locales: Locale[] = ["fa", "en"];
    return locales.flatMap((locale) =>
        SERVICES.map((service) => ({ locale, slug: service.slug }))
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale, slug } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";

    const dict = getDictionary(locale);
    const service = getService(slug);
    if (!service) return {};

    const title = locale === "fa" ? service.seo.title.fa : service.seo.title.en;
    const description =
        locale === "fa" ? service.seo.description.fa : service.seo.description.en;

    const canonical = `/${locale}/services/${service.slug}`;

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        alternates: {
            canonical,
            languages: {
                fa: `/fa/services/${service.slug}`,
                en: `/en/services/${service.slug}`,
                "x-default": `/fa/services/${service.slug}`,
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

function BulletList({
    items,
}: {
    items: string[];
}) {
    const Icon = SERVICE_BULLET_ICON;

    return (
        <ul className="mt-3 grid gap-2">
            {items.map((text) => (
                <li key={text} className="flex items-start gap-2 text-sm text-muted">
                    <Icon className="mt-0.5 h-4 w-4 text-accent" aria-hidden={true} />
                    <span>{text}</span>
                </li>
            ))}
        </ul>
    );
}

function Section({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 transition-colors hover:border-accent/20">
            <span className="font-mono text-xs text-accent/80">{number}</span>
            <h2 className="mt-5 text-lg font-bold text-foreground">{title}</h2>
            {children}
        </section>
    );
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale: rawLocale, slug } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";

    const service = getService(slug);
    if (!service) notFound();

    if (slug !== service.slug) {
        permanentRedirect(`/${locale}/services/${service.slug}`);
    }

    const title = locale === "fa" ? service.title.fa : service.title.en;
    const isFa = locale === "fa";
    const ServiceIcon = service.Icon;

    const detail = service.detail;
    const intro = locale === "fa" ? detail.intro.fa : detail.intro.en;
    const whatTitle = locale === "fa" ? detail.whatYouGetTitle.fa : detail.whatYouGetTitle.en;
    const processTitle = locale === "fa" ? detail.processTitle.fa : detail.processTitle.en;
    const deliverablesTitle =
        locale === "fa" ? detail.deliverablesTitle.fa : detail.deliverablesTitle.en;

    const what = locale === "fa" ? detail.whatYouGet.fa : detail.whatYouGet.en;
    const process = locale === "fa" ? detail.process.fa : detail.process.en;
    const deliverables = locale === "fa" ? detail.deliverables.fa : detail.deliverables.en;

    const pageUrl = `${baseUrl}/${locale}/services/${service.slug}`;
    const seoDescription = locale === "fa" ? service.seo.description.fa : service.seo.description.en;
    const crumbs = [
        { name: isFa ? "خانه" : "Home", path: `/${locale}` },
        { name: isFa ? "خدمات" : "Services", path: `/${locale}#services` },
        { name: title, path: `/${locale}/services/${service.slug}` },
    ];
    const faq = SERVICE_FAQ[service.slug];
    const articles = postsForService(service.slug, 3);

    return (
        <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Service",
                            "@id": `${pageUrl}#service`,
                            name: title,
                            serviceType: title,
                            description: seoDescription,
                            url: pageUrl,
                            inLanguage: languageTag(locale),
                            areaServed: "Worldwide",
                            provider: { "@id": organizationId },
                        },
                        {
                            "@type": "WebPage",
                            "@id": `${pageUrl}#webpage`,
                            url: pageUrl,
                            name: title,
                            description: seoDescription,
                            inLanguage: languageTag(locale),
                            isPartOf: { "@id": websiteId },
                            breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
                            mainEntity: { "@id": `${pageUrl}#service` },
                        },
                        breadcrumbJsonLd([crumbs[0], crumbs[2]]),
                        {
                            "@type": "FAQPage",
                            "@id": `${pageUrl}#faq`,
                            inLanguage: languageTag(locale),
                            mainEntity: faq.map((item) => ({
                                "@type": "Question",
                                name: item.question[locale],
                                acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
                            })),
                        },
                    ],
                }}
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Breadcrumbs
                    locale={locale}
                    items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
                />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    SOSHO STUDIO
                </span>
            </div>

            <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-14">
                <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                            {isFa ? "خدمات سوشو استودیو" : "Sosho Studio services"}
                        </p>
                        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
                            {title}
                        </h1>
                        <p className="mt-5 max-w-3xl text-base leading-8 text-muted md:text-lg">{intro}</p>
                    </div>
                    <div className="lg:col-span-4 lg:flex lg:justify-end">
                        <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-accent/20 bg-background/40 shadow-2xl shadow-primary/15 sm:h-40 sm:w-40">
                            <ServiceIcon className="h-14 w-14 text-accent sm:h-16 sm:w-16" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Section number="01" title={whatTitle}>
                    <BulletList items={what} />
                </Section>

                <Section number="02" title={processTitle}>
                    <BulletList items={process} />
                </Section>

                <Section number="03" title={deliverablesTitle}>
                    <BulletList items={deliverables} />
                </Section>
            </div>

            <section aria-labelledby="service-faq-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
                <h2 id="service-faq-title" className="text-xl font-bold text-foreground">
                    {isFa ? "پرسش‌های متداول" : "Frequently asked questions"}
                </h2>
                <div className="mt-5 divide-y divide-foreground/10">
                    {faq.map((item) => (
                        <div key={item.question.en} className="py-4 first:pt-0 last:pb-0">
                            <h3 className="text-sm font-bold text-foreground md:text-base">{item.question[locale]}</h3>
                            <p className="mt-1.5 text-sm leading-7 text-muted">{item.answer[locale]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {articles.length > 0 ? (
                <section aria-labelledby="service-articles-title">
                    <h2 id="service-articles-title" className="text-xl font-bold text-foreground">
                        {isFa ? "مقاله‌های مرتبط" : "Related articles"}
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {articles.map((post) => (
                            <article key={post.slug} className="contents">
                                <Link
                                    href={getBlogPostHref(locale, post.slug)}
                                    className="group overflow-hidden rounded-2xl border border-foreground/10 bg-background/10 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                >
                                    {post.coverImage ? (
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            <Image
                                                src={post.coverImage}
                                                alt={post.coverImageAlt?.[locale] ?? post.title[locale]}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : null}
                                    <h3 className="p-4 text-sm font-semibold leading-7 text-foreground transition-colors group-hover:text-accent">
                                        {post.title[locale]}
                                    </h3>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        {isFa ? "قدم بعدی" : "Next step"}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-foreground">
                        {isFa ? "درباره پروژه‌تان صحبت کنیم" : "Let’s discuss your project"}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted">
                        {isFa ? "هدفتان را بفرستید تا مسیر مناسب و محدوده اولیه را با هم مشخص کنیم." : "Share the goal and we’ll help define the right approach and an initial scope."}
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
