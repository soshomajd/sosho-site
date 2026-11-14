import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import ConsultantButton from "@/app/components/Consultant/ConsultantButton";
import PortraitEyes from "@/app/components/Hero/PortraitEyes";
import RobotPortraitEyes from "@/app/components/Hero/RobotPortraitEyes";
import { STUDIO_TEAM } from "@/app/components/Hero/team-data";
import JsonLd from "@/app/components/JsonLd";
import RealProjectCards from "@/app/components/Projects/RealProjectCards";
import { getService, getServiceHref, type ServiceSlug } from "@/app/components/Services/data";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, SITE_CONTENT_UPDATED_AT, websiteId } from "@/app/seo";
import "@/app/components/Hero/hero.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

type Group = { title: string; services: ServiceSlug[] };

// Facts only: what the studio does, who is responsible and how work runs. No client counts, years or results.
const COPY = {
  fa: {
    title: "درباره سوشو استودیو؛ شرکت طراحی سایت و توسعه وب",
    description:
      "سوشو استودیو یک استودیوی طراحی سایت و توسعهٔ وب است؛ با بنیان‌گذار و راهبر فنی مشخص، همکاران هوش مصنوعی و فرایندی روشن از شناخت نیاز تا پشتیبانی.",
    crumb: "درباره ما",
    eyebrow: "استودیو طراحی سایت و توسعه وب",
    heading: "درباره سوشو استودیو",
    lead: "سوشو استودیو کار طراحی سایت را از شناخت نیاز تا طراحی، ساخت، انتشار و پشتیبانی یک‌جا انجام می‌دهد: سایت شرکتی و فروشگاهی، وب‌اپلیکیشن، اپلیکیشن موبایل و سئو، به فارسی و انگلیسی. کسی که پروژه را با شما شروع می‌کند، تا پایان پاسخ‌گوی آن می‌ماند.",
    contact: "تماس با ما",
    whatTitle: "چه کاری انجام می‌دهیم؟",
    what: [
      "بیشتر پروژه‌های ما سایت‌هایی هستند که باید یک کار مشخص انجام دهند: خدمات یک شرکت را روشن معرفی کنند، محصول بفروشند یا فرایندی را برای کاربر ساده کنند. برای همین کار را از هدف و مخاطب شروع می‌کنیم، نه از ظاهر.",
      "اگر دنبال یک شرکت طراحی سایت هستید که طراحی، برنامه‌نویسی، سئو و نگهداری را جدا از هم نبیند، این‌ها خدماتی است که می‌توانید به ما بسپارید:",
    ],
    groups: [
      { title: "طراحی سایت", services: ["corporate-website-design", "ecommerce-website-design", "website-design-development", "wordpress-woocommerce"] },
      { title: "محصول دیجیتال", services: ["web-application-development", "mobile-app-development", "ui-ux-brand-design"] },
      { title: "رشد و نگهداری", services: ["seo-google-growth", "care-performance"] },
      { title: "فناوری‌های تخصصی", services: ["ai-automation", "web3-blockchain"] },
    ] as Group[],
    teamTitle: "چه کسانی پشت کار هستند؟",
    team: "راهبری فنی و مسئولیت تحویل هر پروژه با بنیان‌گذار استودیو است. دو همکار هوش مصنوعی در نوشتن و بازبینی کد و طراحی رابط کمک می‌کنند و تصمیم نهایی با بنیان‌گذار می‌ماند. این دو ابزار هوش مصنوعی‌اند، نه کارمند انسانی، و نمایندهٔ شرکت‌های سازنده‌شان هم نیستند.",
    processTitle: "چطور کار می‌کنیم؟",
    process: [
      { title: "کشف", text: "هدف، مخاطب، محدودیت‌ها و معیار موفقیت را مشخص می‌کنیم. خروجی این مرحله یک محدودهٔ روشن است: چه صفحه‌ها و امکاناتی ساخته می‌شود و چه چیزهایی به فاز بعد می‌رود." },
      { title: "طراحی", text: "ساختار صفحه‌ها، مسیر کاربر و زبان بصری را پیش از توسعه نهایی می‌کنیم تا تغییرهای بزرگ روی طرح انجام شود، نه روی کد." },
      { title: "ساخت", text: "پیاده‌سازی مرحله‌ای است و در هر مرحله نسخه‌ای قابل دیدن و تست می‌گیرید. سرعت، نمایش موبایل، دسترس‌پذیری و سئوی فنی از ابتدا بخشی از کارند." },
      { title: "رشد", text: "پس از انتشار، سایت را اندازه می‌گیریم و بر اساس داده بهبود می‌دهیم. آموزش مدیریت محتوا و برنامهٔ نگهداری هم در همین مرحله مشخص می‌شود." },
    ],
    principlesTitle: "چه چیزهایی را وعده نمی‌دهیم",
    principles: [
      "رتبهٔ اول گوگل یا میزان فروش را تضمین نمی‌کنیم؛ کاری را انجام می‌دهیم که شانس دیده‌شدن و سفارش را بیشتر می‌کند و پیشرفت را با داده گزارش می‌دهیم.",
      "پیش از روشن‌شدن دامنهٔ کار، قیمت و زمان قطعی اعلام نمی‌کنیم.",
      "طرح مفهومی را به‌جای پروژهٔ واقعی نشان نمی‌دهیم؛ هر دو در نمونه‌کارها جدا و برچسب‌دار هستند.",
      "فناوری را قبل از شناخت نیاز انتخاب نمی‌کنیم؛ گاهی وردپرس کافی است و گاهی توسعهٔ اختصاصی لازم است.",
    ],
    workTitle: "نمونه‌کارهای واقعی",
    work: "سه سایتی که برای مشتری ساخته‌ایم و در دسترس‌اند. در صفحهٔ هر کدام مسئلهٔ طراحی، تصمیم‌ها و مسیر کاربر توضیح داده شده است.",
    allWork: "همهٔ نمونه‌کارها و طرح‌ها",
    faqTitle: "پرسش‌های متداول",
    faq: [
      { q: "سوشو استودیو با چه کسب‌وکارهایی کار می‌کند؟", a: "با شرکت‌ها و فروشگاه‌هایی که سایت برایشان ابزار کار است: معرفی خدمات، دریافت استعلام، فروش آنلاین یا یک وب‌اپلیکیشن اختصاصی. نمونه‌های واقعی در حوزهٔ قطعات الکترونیکی، کاغذ دیواری و تأمین تجهیزات صنعتی در صفحهٔ نمونه‌کارها هستند." },
      { q: "آیا در پروژه‌ها از هوش مصنوعی استفاده می‌کنید؟", a: "بله. از همکاران هوش مصنوعی برای نوشتن و بازبینی کد و طراحی رابط کمک می‌گیریم. تصمیم‌های فنی و مسئولیت نتیجه با بنیان‌گذار استودیو می‌ماند." },
      { q: "سایت را به چه زبان‌هایی می‌سازید؟", a: "فارسی راست‌به‌چپ و انگلیسی چپ‌به‌راست. سایت دوزبانه از ابتدا در ساختار دیده می‌شود، نه به‌عنوان ترجمه‌ای که بعداً اضافه شود." },
      { q: "بعد از تحویل هم پشتیبانی می‌کنید؟", a: "بله. نگهداری، به‌روزرسانی، بهبود سرعت و توسعهٔ امکانات جدید در قالب خدمت پشتیبانی انجام می‌شود و محدودهٔ آن پیش از شروع مشخص است." },
      { q: "چطور کار را شروع کنیم؟", a: "می‌توانید با برآورد هوشمند دامنهٔ پروژه را مشخص کنید یا از صفحهٔ تماس پیام بگذارید. پس از یک گفت‌وگوی کوتاه، مسیر مناسب و محدودهٔ اولیه را با شما در میان می‌گذاریم." },
    ],
    ctaTitle: "پروژه‌تان را برای ما بنویسید",
    cta: "هدفتان را بفرستید تا مسیر مناسب و محدودهٔ اولیه را با هم مشخص کنیم.",
  },
  en: {
    title: "About Sosho Studio: Web Design & Development Company",
    description:
      "Sosho Studio is a web design and development studio with a named founder and tech lead, AI collaborators and a clear process from discovery to support.",
    crumb: "About",
    eyebrow: "Web design and development studio",
    heading: "About Sosho Studio",
    lead: "Sosho Studio takes a website from discovery through design, build, launch and support in one place: corporate and ecommerce websites, web apps, mobile apps and SEO, in Persian and English. The person who starts the project with you stays accountable for it to the end.",
    contact: "Contact us",
    whatTitle: "What we do",
    what: [
      "Most of our projects are websites that have one clear job: explain a company's services, sell products or make a process simpler for its users. That is why we start from the goal and the audience rather than the look.",
      "If you are looking for a web design company that does not treat design, engineering, SEO and care as separate jobs, these are the services you can hand to us:",
    ],
    groups: [
      { title: "Website design", services: ["corporate-website-design", "ecommerce-website-design", "website-design-development", "wordpress-woocommerce"] },
      { title: "Digital products", services: ["web-application-development", "mobile-app-development", "ui-ux-brand-design"] },
      { title: "Growth and care", services: ["seo-google-growth", "care-performance"] },
      { title: "Specialist technology", services: ["ai-automation", "web3-blockchain"] },
    ] as Group[],
    teamTitle: "Who is behind the work?",
    team: "Technical direction and responsibility for delivery sit with the studio's founder. Two AI collaborators help write and review code and design interfaces, and the final decision stays with the founder. They are AI tools, not human employees, and they do not represent the companies that make them.",
    processTitle: "How we work",
    process: [
      { title: "Discover", text: "We define the goal, the audience, the constraints and what success means. The outcome is a clear scope: which pages and features are built now and what moves to a later phase." },
      { title: "Design", text: "We settle the page structure, the user journey and the visual language before development, so large changes happen in the design rather than in code." },
      { title: "Build", text: "Work is delivered in stages, and at each stage you get a version you can see and test. Speed, mobile layout, accessibility and technical SEO are part of the work from the start." },
      { title: "Grow", text: "After launch we measure the site and improve it from real data. Content-management training and a care plan are agreed at this stage too." },
    ],
    principlesTitle: "What we do not promise",
    principles: [
      "We do not guarantee a first position on Google or a sales figure. We do the work that improves your chances of being found and contacted, and report progress with data.",
      "We do not give a final price or date before the scope is clear.",
      "We do not show a design concept as if it were a client project; the two are separate and labelled in the portfolio.",
      "We do not pick the technology before understanding the need: sometimes WordPress is enough and sometimes a custom build is required.",
    ],
    workTitle: "Real projects",
    work: "Three websites we built for clients that are live today. Each project page explains the design problem, the decisions and the user journey.",
    allWork: "All projects and concepts",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Which businesses does Sosho Studio work with?", a: "Companies and stores for whom the website is a working tool: presenting services, receiving enquiries, selling online or running a custom web application. Real examples in electronic components, wallpaper and industrial supply are on the portfolio page." },
      { q: "Do you use AI in your projects?", a: "Yes. AI collaborators help write and review code and design interfaces. Technical decisions and responsibility for the result stay with the studio's founder." },
      { q: "Which languages do you build in?", a: "Persian (right to left) and English (left to right). A bilingual site is part of the structure from the start, not a translation added later." },
      { q: "Do you provide support after handover?", a: "Yes. Maintenance, updates, speed improvements and new features are delivered as a care service whose scope is agreed before it starts." },
      { q: "How do we get started?", a: "Define the scope with the smart estimate or leave a message on the contact page. After a short conversation we share the right approach and an initial scope with you." },
    ],
    ctaTitle: "Tell us about your project",
    cta: "Share the goal and we will define the right approach and an initial scope together.",
  },
} as const;

export function generateStaticParams() {
  return (["fa", "en"] as const).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const dict = getDictionary(locale);
  const copy = COPY[locale];
  const canonical = `/${locale}/about`;
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: copy.title },
    description: copy.description,
    alternates: {
      canonical,
      languages: { fa: "/fa/about", en: "/en/about", "x-default": "/fa/about" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: dict.siteName,
      title: copy.title,
      description: copy.description,
      images: [{ url: ogImageUrl, width: 1731, height: 909, alt: `${dict.siteName} — ${copy.heading}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [ogImageUrl],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isFa = locale === "fa";
  const copy = COPY[locale];
  const pageUrl = `${baseUrl}/${locale}/about`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: copy.crumb, path: `/${locale}/about` },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: copy.title,
              description: copy.description,
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              about: { "@id": organizationId },
              mainEntity: { "@id": organizationId },
              dateModified: SITE_CONTENT_UPDATED_AT,
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
            },
            breadcrumbJsonLd(crumbs),
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              inLanguage: languageTag(locale),
              mainEntity: copy.faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }}
      />
      <Breadcrumbs locale={locale} items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))} />

      <header className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface/25 p-7 sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">{copy.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">{copy.heading}</h1>
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{copy.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ConsultantButton locale={locale} variant="primary" />
            <Link
              href={`/${locale}/contact`}
              prefetch={false}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 bg-surface/40 px-6 text-sm font-bold text-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {copy.contact}
              <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="about-what-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="about-what-title" className="text-xl font-bold text-foreground">{copy.whatTitle}</h2>
        <div className="mt-4 grid max-w-4xl gap-3 text-sm leading-8 text-muted md:text-base">
          {copy.what.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-foreground/10 bg-background/25 p-5">
              <h3 className="text-sm font-bold text-foreground">{group.title}</h3>
              <ul className="mt-3 grid gap-1">
                {group.services.map((slug) => {
                  const service = getService(slug)!;
                  return (
                    <li key={slug}>
                      <Link
                        href={getServiceHref(locale, slug)}
                        prefetch={false}
                        className="flex min-h-10 items-center rounded-md text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                      >
                        {service.title[locale]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-team-title">
        <h2 id="about-team-title" className="text-xl font-bold text-foreground">{copy.teamTitle}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-8 text-muted md:text-base">{copy.team}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {STUDIO_TEAM.map((member) => (
            <li key={member.id} className="flex flex-col items-center rounded-3xl border border-foreground/10 bg-surface/20 p-6 text-center">
              <div className="w-40 sm:w-48">
                <div className="sh-portrait">
                  <Image src={member.image} alt={member.alt[locale]} width={1000} height={1000} sizes="192px" loading="lazy" className="sh-character" />
                  {member.id === "soheil" ? <PortraitEyes /> : <RobotPortraitEyes member={member.id} />}
                </div>
              </div>
              <p className="mt-4 text-xs font-bold leading-6 text-primary">{member.kind[locale]}</p>
              <h3 className="mt-1 text-lg font-bold text-foreground" dir={member.id === "soheil" ? undefined : "ltr"}>{member.name[locale]}</h3>
              <p className="mt-1 text-sm font-semibold text-foreground">{member.role[locale]}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{member.bio[locale]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-process-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="about-process-title" className="text-xl font-bold text-foreground">{copy.processTitle}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {copy.process.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-foreground/10 bg-background/25 p-5">
              <span className="font-mono text-xs text-accent" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-base font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="about-principles-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="about-principles-title" className="text-xl font-bold text-foreground">{copy.principlesTitle}</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {copy.principles.map((text) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-7 text-muted">
              <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-work-title">
        <h2 id="about-work-title" className="text-xl font-bold text-foreground">{copy.workTitle}</h2>
        <p className="mt-3 mb-6 max-w-3xl text-sm leading-8 text-muted">{copy.work}</p>
        <RealProjectCards locale={locale} />
        <div className="mt-6">
          <Link
            href={`/${locale}/projectcs`}
            prefetch={false}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            {copy.allWork}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="about-faq-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="about-faq-title" className="text-xl font-bold text-foreground">{copy.faqTitle}</h2>
        <div className="mt-5 divide-y divide-foreground/10">
          {copy.faq.map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-bold text-foreground md:text-base">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-7 text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{isFa ? "قدم بعدی" : "Next step"}</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">{copy.ctaTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{copy.cta}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ConsultantButton locale={locale} variant="secondary" />
          <Link
            href={`/${locale}/contact`}
            prefetch={false}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
          >
            {copy.contact}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
