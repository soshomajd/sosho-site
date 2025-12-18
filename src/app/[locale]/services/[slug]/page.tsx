import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import {
    getService,
    SERVICES,
    SERVICE_BULLET_ICON,
} from "@/app/components/Services/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
        title: `${title} | ${dict.siteName}`,
        description,
        alternates: {
            canonical,
            languages: {
                fa: `/fa/services/${service.slug}`,
                en: `/en/services/${service.slug}`,
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
            url: canonical,
            siteName: dict.siteName,
            title: `${title} | ${dict.siteName}`,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${dict.siteName}`,
            description,
        },
        icons: {
            icon: "/favicon.ico",
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
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-foreground/10 bg-surface/20 p-6">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
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

    const title = locale === "fa" ? service.title.fa : service.title.en;

    const detail = service.detail;
    const intro = locale === "fa" ? detail.intro.fa : detail.intro.en;
    const whatTitle = locale === "fa" ? detail.whatYouGetTitle.fa : detail.whatYouGetTitle.en;
    const processTitle = locale === "fa" ? detail.processTitle.fa : detail.processTitle.en;
    const deliverablesTitle =
        locale === "fa" ? detail.deliverablesTitle.fa : detail.deliverablesTitle.en;

    const what = locale === "fa" ? detail.whatYouGet.fa : detail.whatYouGet.en;
    const process = locale === "fa" ? detail.process.fa : detail.process.en;
    const deliverables = locale === "fa" ? detail.deliverables.fa : detail.deliverables.en;

    return (
        <main className="container py-10 gap-6 items-stretch">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-muted">
                        {locale === "fa" ? "خدمات" : "Services"}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{intro}</p>
                </div>

                <Link
                    href={`/${locale}#services`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/15 bg-surface/30 px-5 text-sm font-semibold text-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {locale === "fa" ? "بازگشت" : "Back"}
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Section title={whatTitle}>
                    <BulletList items={what} />
                </Section>

                <Section title={processTitle}>
                    <BulletList items={process} />
                </Section>

                <Section title={deliverablesTitle}>
                    <BulletList items={deliverables} />
                </Section>
            </div>
        </main>
    );
}
