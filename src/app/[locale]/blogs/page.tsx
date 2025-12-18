import type { Metadata } from "next";
import type { Locale } from "@/app/i18n";
import { getDictionary, isLocale } from "@/app/i18n";
import Link from "next/link";
import { BLOG_POSTS, getBlogPostHref } from "@/app/blogs/posts";


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
                ? "مقالات مرتبط با فرانت‌اند، بک‌اند، طراحی وب، بلاک‌چین و قرارداد هوشمند."
                : "Articles about frontend, backend, web development, blockchain, and smart contracts.",
        alternates: {
            canonical: `/${locale}/blogs`,
            languages: { fa: "/fa/blogs", en: "/en/blogs" },
        },
        openGraph: {
            title: locale === "fa" ? "بلاگ" : "Blog",
            description:
                locale === "fa"
                    ? "مقالات مرتبط با فرانت‌اند، بک‌اند، طراحی وب، بلاک‌چین و قرارداد هوشمند."
                    : "Articles about frontend, backend, web development, blockchain, and smart contracts.",
            url: `/${locale}/blogs`,
            siteName: dict.siteName,
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
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
        <main className="container py-10">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-foreground md:text-5xl">
                    {isFa ? "بلاگ" : "Blog"}
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                    {isFa
                        ? "۱۰ مقاله کوتاه و کاربردی درباره فرانت‌اند، بک‌اند، طراحی وب و بلاک‌چین."
                        : "10 practical articles about frontend, backend, web development, and blockchain."}
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
