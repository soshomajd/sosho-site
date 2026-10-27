import Image from "next/image";
import Link from "next/link";
import type { Locale } from "../i18n";
import { PROJECTS, getProjectHref } from "./Projects/data";
import { CONCEPT_PROJECTS } from "./Projects/concepts";

const real = PROJECTS.map((project) => ({
  id: project.slug,
  src: project.images[0].src.replace(/\.webp$/, "-thumb.webp"),
  title: project.title,
  alt: project.images[0].alt,
  concept: false,
}));
const concepts = CONCEPT_PROJECTS.map((project) => ({
  id: project.slug,
  src: project.images[0].src.replace(/\.webp$/, "-thumb.webp"),
  title: project.title,
  alt: project.images[0].alt,
  concept: true,
}));
// Interleave actual homepage captures with concepts; all 13 logical items are unique.
const ITEMS = [real[0], concepts[0], concepts[6], real[1], concepts[1], concepts[7], real[2], concepts[2], concepts[8], concepts[3], concepts[4], concepts[9], concepts[5]];
const ROWS = [ITEMS.filter((_, index) => index % 2 === 0), ITEMS.filter((_, index) => index % 2 === 1)];

/** Server-rendered gallery. Native CSS/checkbox controls work without JavaScript. */
export default function WorkRibbon({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";
  return (
    <section className="work-ribbon" aria-label={isFa ? "نمونه‌کارها و طرح‌های منتخب" : "Selected projects and design concepts"}>
      <div className="container flex-row justify-between gap-4 pb-4">
        <p className="text-xs font-semibold text-muted">{isFa ? "از فروشگاه تا تجربه‌های تعاملی" : "From commerce to immersive experiences"}</p>
        <label className="work-ribbon-toggle">
          <input type="checkbox" className="h-4 w-4 accent-primary" />
          <span className="toggle-pause">{isFa ? "توقف حرکت" : "Pause motion"}</span>
          <span className="toggle-resume">{isFa ? "ادامه حرکت" : "Resume motion"}</span>
        </label>
      </div>
      {ROWS.map((items, row) => (
        <div className="work-ribbon-row" key={row} tabIndex={0} role="group" aria-label={isFa ? `گالری نمونه‌کارها، ردیف ${row + 1}` : `Project gallery, row ${row + 1}`}>
          <div className="work-ribbon-track">
            {[false, true].map((duplicate) => (
              <div className={`work-ribbon-group ${duplicate ? "work-ribbon-group--duplicate" : ""}`} key={String(duplicate)} aria-hidden={duplicate || undefined}>
                {items.map((item) => (
                  // Every tile opens that project's own page. The aria-hidden loop copy is not focusable.
                  <Link
                    key={item.id}
                    href={getProjectHref(locale, item.id)}
                    prefetch={false}
                    className="work-ribbon-link"
                    tabIndex={duplicate ? -1 : undefined}
                  >
                    <figure className="work-ribbon-tile" data-showcase-id={duplicate ? undefined : item.id}>
                      <Image src={item.src} alt={duplicate ? "" : item.alt[locale]} fill sizes="(max-width: 767px) 220px, 360px" loading="lazy" fetchPriority="low" className="object-cover object-top" />
                      <figcaption className="work-ribbon-caption" dir={isFa ? "rtl" : "ltr"}>
                        <span>{item.title[locale]}</span>
                        <span className="work-ribbon-kind">{item.concept ? (isFa ? "طرح مفهومی" : "Concept") : (isFa ? "پروژه" : "Project")}</span>
                      </figcaption>
                    </figure>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
