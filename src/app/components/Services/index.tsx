import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { SERVICES, getServiceHref } from "./data";
import { FiArrowUpRight } from "react-icons/fi";

export default function Services({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map(({ slug, title, short, Icon }, index) => (
                    <Link
                        key={slug}
                        href={getServiceHref(locale, slug)}
                        className={`group relative min-h-64 overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:bg-surface/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none ${index === 0 || index === SERVICES.length - 1 ? "lg:col-span-2" : ""}`}
                    >
                        <div className="pointer-events-none absolute -end-20 -top-20 h-52 w-52 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/0 to-transparent transition-colors group-hover:via-accent/50" />

                        <div className="relative flex h-full flex-col">
                            <div className="flex items-start justify-between gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-foreground/10 bg-background/35 transition-transform duration-300 group-hover:scale-105 group-hover:border-accent/25 motion-reduce:transform-none">
                                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                                </div>
                                <span className="font-mono text-xs text-muted/80">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <div className="mt-auto pt-10">
                                <h3 className="text-xl font-bold tracking-tight text-foreground">
                                    {isFa ? title.fa : title.en}
                                </h3>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
                                    {isFa ? short.fa : short.en}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-4 text-sm font-bold text-foreground/75 transition-colors group-hover:text-foreground">
                                <span>{isFa ? "مشاهده جزئیات" : "Explore service"}</span>
                                <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
