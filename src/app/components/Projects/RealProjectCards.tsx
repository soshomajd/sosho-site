import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { PROJECTS, getProjectHref, type Project } from "./data";

/** Compact cards for the real case studies, used where the full device views would be too heavy. */
export default function RealProjectCards({
  locale,
  projects = PROJECTS,
  headingLevel = "h3",
}: {
  locale: Locale;
  projects?: Project[];
  headingLevel?: "h2" | "h3";
}) {
  const isFa = locale === "fa";
  const Heading = headingLevel;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="contents">
          <Link
            href={getProjectHref(locale, project.slug)}
            prefetch={false}
            className="group flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 transition-colors hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <div className="relative aspect-video w-full overflow-hidden border-b border-foreground/10 bg-background/30">
              <Image
                src={project.images[0].src.replace(/\.webp$/, "-thumb.webp")}
                alt={project.images[0].alt[locale]}
                fill
                sizes="(max-width: 767px) 100vw, 400px"
                loading="lazy"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold leading-6 text-accent">{project.service[locale]}</p>
              <Heading className="mt-2 text-lg font-bold leading-8 text-foreground transition-colors group-hover:text-accent">
                {project.title[locale]}
              </Heading>
              <p className="mt-1 flex-1 text-sm leading-7 text-muted">{project.summary[locale]}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                {isFa ? "مشاهدهٔ نمونه‌کار" : "View case study"}
                <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
