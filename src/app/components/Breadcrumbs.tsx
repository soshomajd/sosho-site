import Link from "next/link";

import type { Locale } from "@/app/i18n";

export type BreadcrumbItem = { name: string; href: string };

/** Visible breadcrumb trail; the last item is the current page. Mirrors the BreadcrumbList JSON-LD. */
export default function Breadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  return (
    <nav aria-label={locale === "fa" ? "مسیر صفحه" : "Breadcrumb"} className="w-full">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-foreground/90">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-muted/60 rtl:-scale-x-100">
                    ›
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
