import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { SERVICES, getServiceHref } from "./data";

export default function Services({ locale }: { locale: Locale }) {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map(({ slug, title, short, Icon }) => (
                    <Link
                        key={slug}
                        href={getServiceHref(locale, slug)}
                        className={
                            "group block rounded-2xl border border-foreground/10 bg-surface/20 p-5 " +
                            "transition-transform duration-300 motion-reduce:transition-none hover:-translate-y-1 " +
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        }
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={
                                    "grid h-12 w-12 place-items-center rounded-xl border border-foreground/10 bg-background/30 " +
                                    "transition-transform duration-300 motion-reduce:transition-none group-hover:scale-110"
                                }
                            >
                                <Icon className="h-7 w-7 text-accent" aria-hidden={true} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {locale === "fa" ? title.fa : title.en}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-muted">
                                    {locale === "fa" ? short.fa : short.en}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 h-px w-full bg-foreground/10" />

                        <div className="mt-4 text-sm font-semibold text-foreground/80 transition-colors duration-200 motion-reduce:transition-none group-hover:text-foreground">
                            {locale === "fa" ? "جزئیات بیشتر" : "Learn more"}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
