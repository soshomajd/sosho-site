import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { BLOG_POSTS, getBlogPostHref } from "@/app/blogs/posts";

export default function BlogPreview({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    const posts = BLOG_POSTS.slice(0, 3);

    return (
        <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {posts.map((p) => (
                    <Link
                        key={p.slug}
                        href={getBlogPostHref(locale, p.slug)}
                        className="group rounded-2xl border border-foreground/10 bg-background/10 p-5 transition-transform duration-200 hover:-translate-y-1"
                    >
                        <div className="mb-3 inline-flex items-center rounded-full border border-foreground/10 bg-surface/20 px-3 py-1 text-xs font-semibold text-muted">
                            {p.tags[0]}
                        </div>
                        <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                            {p.title[locale]}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted">{p.excerpt[locale]}</p>
                    </Link>
                ))}
            </div>

            <div className="mt-6">
                <Link
                    href={`/${locale}/blogs`}
                    className="inline-flex items-center justify-center rounded-xl border border-foreground/10 bg-surface/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface/30"
                >
                    {isFa ? "مشاهده همه مقالات" : "View all articles"}
                </Link>
            </div>
        </div>
    );
}
