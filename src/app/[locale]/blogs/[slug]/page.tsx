import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { getDictionary, isLocale, locales } from "@/app/i18n";
import { BLOG_POSTS, getBlogPostBySlug } from "@/app/blogs/posts";

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
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
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

    return (
        <main className="container py-10">
            <div className="mb-6">
                <Link
                    href={`/${locale}/blogs`}
                    className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
                >
                    {isFa ? "← بازگشت به بلاگ" : "← Back to blog"}
                </Link>
            </div>

            <header className="rounded-2xl border border-foreground/10 bg-surface/10 p-6">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                        <span
                            key={t}
                            className="inline-flex items-center rounded-full border border-foreground/10 bg-background/10 px-3 py-1 text-xs font-semibold text-muted"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">
                    {post.title[locale]}
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                    {post.excerpt[locale]}
                </p>
            </header>

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
            </article>
        </main>
    );
}
