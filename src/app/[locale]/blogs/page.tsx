import type { Metadata } from "next";
import type { Locale } from "@/app/i18n";
import { getDictionary, isLocale } from "@/app/i18n";
import Link from "next/link";
import { BLOG_POSTS, getBlogPostHref } from "@/app/blogs/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.png", siteUrl).toString();

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const dict = getDictionary(locale);

    return {
        title: locale === "fa" ? "بلاگ" : "Blog",
        description:
            locale === "fa"
                ? "راهنماها و تجربه‌های سوشو استودیو درباره طراحی سایت، وردپرس، سئو و گوگل، توسعه وب، Web3 و هوش مصنوعی."
                : "Practical Sosho Studio guides on web design, WordPress, SEO and Google, web development, Web3, and AI.",
        alternates: {
            canonical: `/${locale}/blogs`,
            languages: { fa: "/fa/blogs", en: "/en/blogs" },
        },
        openGraph: {
            title: locale === "fa" ? "بلاگ" : "Blog",
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

    return (
        <main className="container items-stretch py-14 md:py-20">
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
                {BLOG_POSTS.map((p) => (
                    <Link
                        key={p.slug}
                        href={getBlogPostHref(locale, p.slug)}
                        className="group rounded-2xl border border-foreground/10 bg-surface/10 p-6 transition-colors hover:bg-surface/15"
                    >
                        <div className="flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                                <span
                                    key={t}
                                    className="inline-flex items-center rounded-full border border-foreground/10 bg-background/10 px-3 py-1 text-xs font-semibold text-muted"
                                >
                                    {t}
                                </span>
                            ))}
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
                    </Link>
                ))}
            </div>
        </main>
    );
}
