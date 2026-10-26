import Link from "next/link";
import type { CSSProperties } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import type { Locale } from "@/app/i18n";
import { getProjectHref } from "./data";
import { HOME_PROJECTS, MORE_PROJECTS } from "./showcase";
import DeviceViews from "./DeviceViews";

export default function Projects({ locale, archive = false }: { locale: Locale; archive?: boolean }) {
  const projects = archive ? MORE_PROJECTS : HOME_PROJECTS;
  const Heading = archive ? "h2" : "h3";
  return (
    <>
    <div className={`project-stack ${archive ? "project-stack--archive" : ""}`}>
      {projects.map((project, index) => (
        <article
          key={project.slug}
          className="project-card project-card--devices"
          data-project-kind={project.kind}
          style={{ "--card-index": index, "--card-scale": archive ? 1 : 1 - (projects.length - index - 1) * 0.02 } as CSSProperties}
        >
          <div className="project-card-head">
            <div className="flex min-w-0 gap-5">
              <span className="project-card-number" aria-hidden="true">{String(index + (archive ? 6 : 1)).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-6 text-sage">{project.service[locale]}</p>
                <Heading className="mt-1 text-xl font-bold leading-8 text-foreground md:text-2xl">{project.title[locale]}</Heading>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{project.summary[locale]}</p>
                {project.kind === "concept" ? (
                  <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    {project.features[locale].map((feature) => <li key={feature} className="rounded-full border border-foreground/10 px-3 py-1.5">{feature}</li>)}
                  </ul>
                ) : null}
              </div>
            </div>
            {project.kind === "live" ? <Link href={getProjectHref(locale, project.slug)} prefetch={false} className="project-card-link">
              {locale === "fa" ? "مشاهدهٔ نمونه‌کار" : "View case study"}
              <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link> : <span className="project-concept-badge">{locale === "fa" ? "طرح مفهومی" : "Design concept"} · {project.language === "fa" ? (locale === "fa" ? "فارسی" : "Persian") : (locale === "fa" ? "انگلیسی" : "English")}</span>}
          </div>
          <DeviceViews images={project.images} locale={locale} />
        </article>
      ))}
    </div>
    {!archive ? <div className="mt-8 flex justify-center">
      <Link href={`/${locale}/projectcs`} prefetch={false} className="project-card-link">
        {locale === "fa" ? "۸ نمونه‌کار بیشتر" : "Explore 8 more projects"}
        <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
      </Link>
    </div> : null}
    </>
  );
}
