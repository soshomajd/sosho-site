import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { getBlogPostHref, getBlogPosts } from "@/app/blogs/posts";

export default function BlogPreview({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    const posts = getBlogPosts().slice(0, 3);

    return (
        <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {posts.map((p) => (
                    <Link
                        key={p.slug}
                        href={getBlogPostHref(locale, p.slug)}
                        className="group overflow-hidden rounded-2xl border border-foreground/10 bg-background/10 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-surface/30">
                            {p.coverImage ? (
                                <Image
                                    src={p.coverImage}
                                    alt={p.coverImageAlt?.[locale] ?? p.title[locale]}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(34,211,238,0.28),transparent_55%),linear-gradient(180deg,#0b0f14_0%,#090d12_100%)]"
                                />
                            )}
                        </div>

                        <div className="p-5">
                            <div className="inline-flex items-center rounded-full border border-foreground/10 bg-surface/20 px-3 py-1 text-xs font-semibold text-muted">
                                {p.tags[0]}
                            </div>
                            <h3 className="mt-3 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                                {p.title[locale]}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-muted">{p.excerpt[locale]}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-6">
                <Link
                    href={`/${locale}/blogs`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-foreground/10 bg-surface/20 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {isFa ? "مشاهده همه یادداشت‌ها" : "View all insights"}
                </Link>
            </div>
        </div>
    );
}
