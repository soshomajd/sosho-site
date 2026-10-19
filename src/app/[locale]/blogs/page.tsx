import type { Metadata } from "next";
import type { Locale } from "@/app/i18n";
import { getDictionary, isLocale } from "@/app/i18n";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostHref, getBlogPosts } from "@/app/blogs/posts";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const dict = getDictionary(locale);

    return {
        title:
            locale === "fa"
                ? "مجله سوشو؛ راهنمای طراحی سایت، سئو و Web3"
                : "Sosho Insights: Web Design, SEO, Web3 & AI Guides",
        description:
            locale === "fa"
                ? "راهنماها و تجربه‌های سوشو استودیو درباره طراحی سایت، وردپرس، سئو و گوگل، توسعه وب، قرارداد هوشمند و Web3، سیستم ERP و CRM و هوش مصنوعی."
                : "Practical Sosho Studio guides on web design, WordPress, SEO and Google, web development, smart contracts and Web3, ERP and CRM systems, and AI.",
        alternates: {
            canonical: `/${locale}/blogs`,
            languages: { fa: "/fa/blogs", en: "/en/blogs", "x-default": "/fa/blogs" },
        },
        openGraph: {
            title: locale === "fa" ? "مجله سوشو؛ راهنمای طراحی سایت، سئو و Web3" : "Sosho Insights: Web Design, SEO, Web3 & AI Guides",
            description:
                locale === "fa"
                    ? "راهنماها و تجربه‌های سوشو استودیو درباره طراحی سایت، وردپرس، سئو، Web3 و هوش مصنوعی."
                    : "Sosho Studio guides on web design, WordPress, SEO, Web3, and AI.",
            url: `/${locale}/blogs`,
            siteName: dict.siteName,
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
            images: [{ url: ogImageUrl, width: 1731, height: 909, alt: locale === "fa" ? "مجله سوشو استودیو" : "Sosho Studio Insights" }],
        },
        twitter: {
            card: "summary_large_image",
            images: [ogImageUrl],
        },
    };
}

export default async function BlogsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const isFa = locale === "fa";
    const posts = getBlogPosts();
    const pageUrl = `${baseUrl}/${locale}/blogs`;
    const crumbs = [
        { name: isFa ? "خانه" : "Home", path: `/${locale}` },
        { name: isFa ? "مجله" : "Insights", path: `/${locale}/blogs` },
    ];

    return (
        <main id="main-content" tabIndex={-1} className="container items-stretch py-14 outline-none md:py-20">
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "CollectionPage",
                            "@id": `${pageUrl}#webpage`,
                            url: pageUrl,
                            name: isFa ? "مجله سوشو" : "Sosho Insights",
                            inLanguage: languageTag(locale),
                            isPartOf: { "@id": websiteId },
                            breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
                            mainEntity: { "@id": `${pageUrl}#blog` },
                        },
                        {
                            "@type": "Blog",
                            "@id": `${pageUrl}#blog`,
                            name: isFa ? "مجله سوشو" : "Sosho Insights",
                            url: pageUrl,
                            inLanguage: languageTag(locale),
                            publisher: { "@id": organizationId },
                            blogPost: posts.map((post) => ({
                                "@type": "BlogPosting",
                                headline: post.title[locale],
                                url: `${baseUrl}${getBlogPostHref(locale, post.slug)}`,
                                datePublished: post.publishedAt,
                                ...(post.coverImage ? { image: `${baseUrl}${post.coverImage}` } : {}),
                            })),
                        },
                        breadcrumbJsonLd(crumbs),
                    ],
                }}
            />
            <div className="mb-6 w-full">
                <Breadcrumbs
                    locale={locale}
                    items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
                />
            </div>
            <header className="mb-10 w-full">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                    SOSHO STUDIO
                </p>
                <h1 className="mt-3 text-4xl font-extrabold text-foreground md:text-6xl">
                    {isFa ? "مجله سوشو" : "Sosho Insights"}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
                    {isFa
                        ? "یادداشت‌های کوتاه و کاربردی برای تصمیم‌های بهتر در طراحی، وردپرس، سئو، تکنولوژی، Web3 و هوش مصنوعی."
                        : "Practical notes for better decisions across design, WordPress, SEO, technology, Web3, and AI."}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {posts.map((p) => (
                    <article key={p.slug} className="contents">
                    <Link
                        href={getBlogPostHref(locale, p.slug)}
                        className="group overflow-hidden rounded-2xl border border-foreground/10 bg-surface/10 transition-colors hover:bg-surface/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-background/30">
                            {p.coverImage ? (
                                <Image
                                    src={p.coverImage}
                                    alt={p.coverImageAlt?.[locale] ?? p.title[locale]}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(34,211,238,0.28),transparent_55%),linear-gradient(180deg,#0b0f14_0%,#090d12_100%)]"
                                />
                            )}
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                {p.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="inline-flex items-center rounded-full border border-foreground/10 bg-background/10 px-3 py-1 text-xs font-semibold text-muted"
                                    >
                                        {t}
                                    </span>
                                ))}
                                <time dateTime={p.publishedAt} className="ms-auto text-xs text-muted/80">
                                    {new Date(p.publishedAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                                {p.title[locale]}
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-muted">
                                {p.excerpt[locale]}
                            </p>
                            <div className="mt-4 text-sm font-semibold text-foreground/80">
                                {locale === "fa" ? "ادامه مطلب" : "Read more"}
                            </div>
                        </div>
                    </Link>
                    </article>
                ))}
            </div>
        </main>
    );
}
