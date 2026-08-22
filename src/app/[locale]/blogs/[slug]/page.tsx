import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { getDictionary, isLocale, locales } from "@/app/i18n";
import { BLOG_POSTS, getBlogPostBySlug } from "@/app/blogs/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const baseUrl = siteUrl.replace(/\/$/, "");
const ogImageUrl = new URL("/og.png", siteUrl).toString();
const siteName = "Sosho Studio";

export function generateStaticParams() {
    return locales.flatMap((locale) => BLOG_POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale, slug } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const dict = getDictionary(locale);

    const post = getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: locale === "fa" ? "مقاله پیدا نشد" : "Post not found",
            description:
                locale === "fa" ? "این مقاله وجود ندارد." : "This post does not exist.",
            alternates: {
                canonical: `/${locale}/blogs/${slug}`,
                languages: {
                    fa: `/fa/blogs/${slug}`,
                    en: `/en/blogs/${slug}`,
                },
            },
        };
    }

    const title = post.title[locale];
    const description = post.excerpt[locale];
    const articleImage = post.coverImage
        ? { url: new URL(post.coverImage, siteUrl).toString(), width: 1200, height: 630, alt: post.coverImageAlt?.[locale] ?? title }
        : { url: ogImageUrl, width: 1731, height: 909, alt: `${dict.siteName} — ${title}` };

    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}/blogs/${post.slug}`,
            languages: {
                fa: `/fa/blogs/${post.slug}`,
                en: `/en/blogs/${post.slug}`,
            },
        },
        openGraph: {
            type: "article",
            title,
            description,
            url: `/${locale}/blogs/${post.slug}`,
            siteName: dict.siteName,
            locale: locale === "fa" ? "fa_IR" : "en_US",
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt ?? post.publishedAt,
            authors: [dict.siteName],
            tags: post.tags,
            images: [articleImage],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [articleImage.url],
        },
    };
}

function ArticleStructuredData({ locale, post }: { locale: Locale; post: NonNullable<ReturnType<typeof getBlogPostBySlug>> }) {
    const title = post.title[locale];
    const description = post.excerpt[locale];
    const pageUrl = `${baseUrl}/${locale}/blogs/${post.slug}`;
    const imageUrl = post.coverImage ? new URL(post.coverImage, siteUrl).toString() : ogImageUrl;

    const data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": `${pageUrl}#article`,
                headline: title,
                description,
                image: [imageUrl],
                datePublished: post.publishedAt,
                dateModified: post.updatedAt ?? post.publishedAt,
                inLanguage: locale === "fa" ? "fa-IR" : "en-US",
                mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
                author: { "@type": "Organization", name: siteName, url: baseUrl },
                publisher: {
                    "@type": "Organization",
                    name: siteName,
                    logo: { "@type": "ImageObject", url: `${baseUrl}/sosho.svg` },
                },
                keywords: post.tags.join(", "),
            },
            ...(post.faq && post.faq.length > 0
                ? [
                        {
                            "@type": "FAQPage",
                            "@id": `${pageUrl}#faq`,
                            mainEntity: post.faq.map((item) => ({
                                "@type": "Question",
                                name: item.question[locale],
                                acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
                            })),
                        },
                    ]
                : []),
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale: rawLocale, slug } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const isFa = locale === "fa";

    const post = getBlogPostBySlug(slug);

    if (!post) {
        return (
            <main className="container py-10">
                <h1 className="text-3xl font-extrabold text-foreground">
                    {isFa ? "مقاله پیدا نشد" : "Post not found"}
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted">
                    {isFa ? "این مقاله وجود ندارد." : "This post does not exist."}
                </p>
                <div className="mt-6">
                    <Link
                        href={`/${locale}/blogs`}
                        className="inline-flex items-center justify-center rounded-xl border border-foreground/10 bg-surface/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface/30"
                    >
                        {isFa ? "بازگشت به بلاگ" : "Back to blog"}
                    </Link>
                </div>
            </main>
        );
    }

    const formattedDate = new Date(post.publishedAt).toLocaleDateString(isFa ? "fa-IR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="container py-10">
            <ArticleStructuredData locale={locale} post={post} />

            <div className="mb-6">
                <Link
                    href={`/${locale}/blogs`}
                    className="text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                    {isFa ? "← بازگشت به بلاگ" : "← Back to blog"}
                </Link>
            </div>

            <header className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface/10">
                <div className="relative aspect-video w-full overflow-hidden bg-background/30 sm:aspect-21/9">
                    {post.coverImage ? (
                        <Image
                            src={post.coverImage}
                            alt={post.coverImageAlt?.[locale] ?? post.title[locale]}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
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
                        {post.tags.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full border border-foreground/10 bg-background/10 px-3 py-1 text-xs font-semibold text-muted"
                            >
                                {t}
                            </span>
                        ))}
                        <time dateTime={post.publishedAt} className="ms-auto text-xs text-muted/80">
                            {formattedDate}
                        </time>
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">
                        {post.title[locale]}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                        {post.excerpt[locale]}
                    </p>
                </div>
            </header>

            {post.directAnswer ? (
                <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/6 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        {isFa ? "پاسخ کوتاه" : "Quick answer"}
                    </p>
                    <p className="mt-2 text-sm leading-8 text-foreground/90 md:text-base">
                        {post.directAnswer[locale]}
                    </p>
                </div>
            ) : null}

            <article className="mt-8 space-y-8">
                {post.sections.map((s) => (
                    <section key={s.heading.en} className="rounded-2xl border border-foreground/10 bg-background/10 p-6">
                        <h2 className="text-lg font-semibold text-foreground">{s.heading[locale]}</h2>

                        <div className="mt-3 space-y-3">
                            {s.paragraphs[locale].map((txt) => (
                                <p key={txt} className="text-sm leading-7 text-muted md:text-base">
                                    {txt}
                                </p>
                            ))}
                        </div>

                        {s.bullets ? (
                            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-muted md:text-base">
                                {s.bullets[locale].map((b) => (
                                    <li key={b} className="leading-7">
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                ))}

                {post.faq && post.faq.length > 0 ? (
                    <section className="rounded-2xl border border-foreground/10 bg-background/10 p-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            {isFa ? "پرسش‌های متداول" : "Frequently asked questions"}
                        </h2>
                        <div className="mt-4 space-y-5">
                            {post.faq.map((item) => (
                                <div key={item.question.en}>
                                    <h3 className="text-sm font-bold text-foreground md:text-base">
                                        {item.question[locale]}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-7 text-muted md:text-base">
                                        {item.answer[locale]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}
            </article>
        </main>
    );
}
