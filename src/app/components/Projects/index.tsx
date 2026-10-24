import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { PROJECTS, getProjectHref, type Project } from "./data";

function ProjectTile({
    locale,
    project,
    className,
    priority,
}: {
    locale: Locale;
    project: Project;
    className: string;
    priority?: boolean;
}) {
    const cover = project.images[0];
    return (
        <article
            className={
                "group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface/20 " +
                "transition-transform duration-300 motion-reduce:transition-none hover:-translate-y-1 " +
                "focus-within:ring-2 focus-within:ring-accent/60 focus-within:ring-offset-2 focus-within:ring-offset-background " +
                className
            }
        >
            {/* The screenshot already contains its own headline, so the text sits in a solid panel below it
                instead of on top of the picture. */}
            <div className="relative min-h-44 flex-1 overflow-hidden">
                <Image
                    src={cover.src}
                    alt={cover.alt[locale]}
                    fill
                    preload={priority}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                />
            </div>

            {/* Not positioned on purpose: the stretched title link must size itself to the whole card. */}
            <div className="border-t border-foreground/10 bg-background/90 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    {project.service[locale]}
                </p>
                <h3 className="text-base font-semibold text-foreground">
                    {/* The title link stretches over the whole card so the card is one click target. */}
                    <Link
                        href={getProjectHref(locale, project.slug)}
                        prefetch={false}
                        className="focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
                    >
                        {project.title[locale]}
                    </Link>
                </h3>
                <p className="mt-1 text-sm text-muted">{project.summary[locale]}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                    {locale === "fa" ? "مشاهدهٔ نمونه‌کار" : "View case study"}
                    <FiArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </span>
            </div>
        </article>
    );
}

export default function Projects({ locale }: { locale: Locale }) {
    const [first, second, third] = PROJECTS;
    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <ProjectTile
                    locale={locale}
                    project={first}
                    className="md:col-span-7 md:row-span-2 min-h-80 md:min-h-105"
                />
                <ProjectTile locale={locale} project={second} className="md:col-span-5 min-h-60" />
                <ProjectTile locale={locale} project={third} className="md:col-span-5 min-h-60" />
            </div>
        </div>
    );
}
