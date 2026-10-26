import Link from "next/link";
import type { Locale } from "@/app/i18n";
import { SERVICES, getServiceHref } from "./data";
import { FiArrowUpRight } from "react-icons/fi";

export default function Services({ locale }: { locale: Locale }) {
  return (
    <ol className="service-list">
      {SERVICES.map(({ slug, title, short, Icon }, index) => (
        <li key={slug} className="service-row" data-reveal data-motion-delay={index * 45}>
          <span className="service-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>
              <Link href={getServiceHref(locale, slug)} className="service-link">
                {title[locale]}
                <FiArrowUpRight className="h-5 w-5 shrink-0 text-primary rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            </h3>
            <p className="service-description">{short[locale]}</p>
          </div>
          <span className="service-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        </li>
      ))}
    </ol>
  );
}
