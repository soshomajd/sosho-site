import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { TOOLS, getToolHref, type Tool } from "./data";

/** Cards for the free tools; shared by the hub page and the home teaser. The hub sits right under its h1, so it passes "h2". */
export default function ToolsGrid({
  locale,
  tools = TOOLS,
  headingLevel = "h3",
}: {
  locale: Locale;
  tools?: Tool[];
  headingLevel?: "h2" | "h3";
}) {
  const isFa = locale === "fa";
  const Heading = headingLevel;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        const Icon = tool.Icon;
        return (
          <li key={tool.slug} className="contents">
            <Link
              href={getToolHref(locale, tool.slug)}
              prefetch={false}
              data-reveal
              className="group flex flex-col rounded-3xl border border-foreground/10 bg-surface/20 p-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/20 bg-background/40 text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-sage/30 px-3 py-1 text-[11px] font-bold text-sage">
                  {isFa ? "رایگان" : "Free"}
                </span>
              </div>
              <Heading className="mt-5 text-lg font-bold leading-8 text-foreground transition-colors group-hover:text-accent">
                {tool.title[locale]}
              </Heading>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted">{tool.summary[locale]}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
                {isFa ? "استفاده از ابزار" : "Use the tool"}
                <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
