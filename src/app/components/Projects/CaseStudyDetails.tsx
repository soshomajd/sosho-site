import Link from "next/link";

import { getBlogPostBySlug, getBlogPostHref } from "@/app/blogs/posts";
import { getService, getServiceHref } from "@/app/components/Services/data";
import type { Locale } from "@/app/i18n";
import type { Project } from "./data";

export default function CaseStudyDetails({ project, locale }: { project: Project; locale: Locale }) {
  const isFa = locale === "fa";
  const study = project.caseStudy;
  const service = getService(project.relatedServices[0])!;
  const articles = project.relatedArticles.flatMap((slug) => {
    const post = getBlogPostBySlug(slug);
    return post ? [post] : [];
  });
  return (
    <>
      <section aria-labelledby="case-study-challenge" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">{isFa ? "بررسی ساختار پروژه" : "Inside the project"}</p>
        <h2 id="case-study-challenge" className="mt-4 text-2xl font-bold text-foreground">{isFa ? "مسئلهٔ تجربهٔ کاربری" : "The user-experience challenge"}</h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-muted md:text-base">{study.challenge[locale]}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {study.decisions.map((decision) => (
            <div key={decision.title.en} className="rounded-2xl border border-foreground/10 bg-background/30 p-5">
              <h3 className="text-base font-bold text-foreground">{decision.title[locale]}</h3>
              <p className="mt-3 text-sm leading-8 text-muted">{decision.text[locale]}</p>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="case-study-journey" className="rounded-3xl border border-accent/20 bg-surface/20 p-6 sm:p-8">
        <h2 id="case-study-journey" className="text-xl font-bold text-foreground">{isFa ? "یک مسیر قابل بررسی در این سایت" : "A journey to explore on this site"}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {study.journey[locale].map((step, index) => (
            <li key={step} className="rounded-2xl bg-background/40 p-5 text-sm leading-8 text-muted">
              <span className="mb-2 block font-mono text-xs text-accent" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-4xl text-sm leading-8 text-muted">{study.takeaway[locale]}</p>
        <p className="mt-4 text-sm leading-8 text-muted" data-case-service>
          {isFa ? "برای تعریف پروژه‌ای با این نیاز، محدوده و مراحل " : "For a project with these needs, explore the scope and process for "}
          <Link href={getServiceHref(locale, service.slug)} className="font-bold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">{service.title[locale]}</Link>
          {isFa ? " را ببینید." : "."}
        </p>
      </section>
      {articles.length ? (
        <section aria-labelledby="case-study-reading">
          <h2 id="case-study-reading" className="text-xl font-bold text-foreground">{isFa ? "راهنمای آماده‌شدن برای پروژهٔ مشابه" : "Prepare for a similar project"}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {articles.map((post) => (
              <Link key={post.slug} href={getBlogPostHref(locale, post.slug)} className="rounded-2xl border border-foreground/10 bg-surface/20 p-5 text-sm font-semibold leading-8 text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">{post.title[locale]}</Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
