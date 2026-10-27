import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import JsonLd from "@/app/components/JsonLd";
import { TOOLS, getToolHref } from "@/app/components/Tools/data";
import ToolsGrid from "@/app/components/Tools/ToolsGrid";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

export function generateStaticParams() {
  return (["fa", "en"] as const).map((locale) => ({ locale }));
}

const GUIDE_ORDER_SLUGS = ["website-seo-audit", "meta-tag-generator", "robots-sitemap-generator", "faq-schema-generator", "contrast-checker"] as const;

const META = {
  fa: {
    title: "ابزارهای رایگان سئو و طراحی وب",
    description:
      "ابزارهای رایگان و بدون ثبت‌نام: بررسی سئوی سایت، ساخت متاتگ، اسکیمای FAQ، robots.txt، sitemap و بررسی کنتراست رنگ.",
    heading: "ابزارهای رایگان برای سایت شما",
    intro:
      "این ابزارها را خودمان برای کارهای روزمرهٔ سئو و طراحی ساخته‌ایم و رایگان در اختیار شما می‌گذاریم. بیشتر آن‌ها داخل مرورگر شما کار می‌کنند و چیزی ذخیره نمی‌شود.",
    guideTitle: "از کدام ابزار شروع کنیم؟",
    guide: [
      "اگر سایتتان تازه راه افتاده، ترتیب پیشنهادی ما این است: اول بررسی سئو و سلامت سایت را بزنید تا مشکل‌های فنی مشخص شوند؛ بعد با تولیدکنندهٔ متاتگ عنوان و توضیحات صفحه‌های مهم را مرتب کنید.",
      "سپس robots.txt و sitemap را بسازید و در Search Console ثبت کنید. برای صفحه‌هایی که پرسش‌های تکراری دارند اسکیمای FAQ اضافه کنید و پیش از تحویل طراحی، کنتراست رنگ‌ها را بسنجید.",
      "هیچ‌کدام از این ابزارها جای تحلیل انسانی را نمی‌گیرند و رتبه در گوگل را تضمین نمی‌کنند؛ فقط کمک می‌کنند اشتباه‌های رایج را زودتر پیدا کنید. بیشتر آن‌ها داخل مرورگر شما اجرا می‌شوند و متن یا آدرسی که وارد می‌کنید ذخیره نمی‌شود.",
    ],
    guideOrder: ["بررسی سئو و سلامت سایت", "ساخت متاتگ و Open Graph", "ساخت robots.txt و sitemap", "ساخت اسکیمای FAQ", "بررسی کنتراست رنگ"],
    faqTitle: "پرسش‌های متداول دربارهٔ ابزارها",
    faq: [
      { q: "آیا استفاده از ابزارها واقعاً رایگان است؟", a: "بله. برای استفاده نیاز به ثبت‌نام، پرداخت یا نصب برنامه نیست. اگر بخواهید اصلاح مشکل‌ها را به ما بسپارید، از طریق فرم تماس می‌توانید درخواست بدهید." },
      { q: "اطلاعاتی که وارد می‌کنم ذخیره می‌شود؟", a: "ابزارهای متاتگ، اسکیما، robots.txt و کنتراست داخل مرورگر شما اجرا می‌شوند و چیزی به سرور ما فرستاده نمی‌شود. بررسی سئو آدرسی را که وارد می‌کنید یک بار از طریق سرور ما باز می‌کند تا نتیجه را بسازد و آن را ذخیره نمی‌کند." },
      { q: "آیا ابزارها برای سایت فارسی و انگلیسی کار می‌کنند؟", a: "بله. رابط همهٔ ابزارها فارسی و انگلیسی است و می‌توانید سایت‌های فارسی، انگلیسی یا دوزبانه را بررسی کنید." },
      { q: "امتیاز بالا یعنی رتبهٔ بهتر در گوگل؟", a: "نه. امتیاز نشان می‌دهد پایهٔ فنی سایت چقدر سالم است. رتبه به کیفیت محتوا، اعتبار سایت و رقابت هم بستگی دارد و هیچ ابزاری آن را تضمین نمی‌کند." },
    ],
    cta: "از سایتتان بیشتر می‌خواهید؟",
    ctaBody: "اگر نتیجهٔ ابزارها نشان داد سایت‌تان کار دارد، اصلاح آن را به ما بسپارید.",
    ctaButton: "شروع گفتگو",
  },
  en: {
    title: "Free SEO and Web Design Tools",
    description:
      "Free tools with no sign-up: website SEO check, meta tag generator, FAQ schema, robots.txt, sitemap and color contrast checker.",
    heading: "Free tools for your website",
    intro:
      "We built these tools for our own day-to-day SEO and design work and share them for free. Most run in your browser and nothing is stored.",
    guideTitle: "Which tool should you start with?",
    guide: [
      "If your site has just launched, this is the order we suggest: run the SEO and health check first so the technical problems are clear, then tidy the title and description of your key pages with the meta tag generator.",
      "Next, build robots.txt and a sitemap and submit it in Search Console. Add FAQ schema to pages with recurring questions, and check colour contrast before handing a design over.",
      "None of these tools replaces human analysis or guarantees a Google ranking; they help you find common mistakes sooner. Most run in your browser, and the text or address you enter is not stored.",
    ],
    guideOrder: ["Website SEO and health check", "Meta tag and Open Graph generator", "robots.txt and sitemap generator", "FAQ schema generator", "Colour contrast checker"],
    faqTitle: "Questions about the tools",
    faq: [
      { q: "Are the tools really free?", a: "Yes. There is no sign-up, payment or software to install. If you want us to fix the issues they find, you can ask through the contact form." },
      { q: "Is what I enter stored?", a: "The meta tag, schema, robots.txt and contrast tools run in your browser and nothing is sent to our server. The SEO check opens the address you enter once through our server to build the result and does not store it." },
      { q: "Do the tools work for Persian and English sites?", a: "Yes. Every tool has a Persian and an English interface, and you can check Persian, English or bilingual sites." },
      { q: "Does a high score mean a better Google ranking?", a: "No. The score shows how sound the technical base of a site is. Ranking also depends on content quality, site authority and competition, and no tool can guarantee it." },
    ],
    cta: "Want more from your site?",
    ctaBody: "If the tools show your site needs work, leave the fixing to us.",
    ctaButton: "Start a conversation",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const dict = getDictionary(locale);
  const meta = META[locale];
  const canonical = `/${locale}/tools`;
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: { fa: "/fa/tools", en: "/en/tools", "x-default": "/fa/tools" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: dict.siteName,
      title: `${meta.title} | ${dict.siteName}`,
      description: meta.description,
      images: [{ url: ogImageUrl, width: 1731, height: 909, alt: `${dict.siteName} — ${meta.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ${dict.siteName}`,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isFa = locale === "fa";
  const meta = META[locale];
  const pageUrl = `${baseUrl}/${locale}/tools`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: isFa ? "ابزارها" : "Tools", path: `/${locale}/tools` },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: meta.title,
              description: meta.description,
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              publisher: { "@id": organizationId },
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
              mainEntity: { "@id": `${pageUrl}#tools` },
            },
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#tools`,
              itemListElement: TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.title[locale],
                url: `${baseUrl}${getToolHref(locale, tool.slug)}`,
              })),
            },
            breadcrumbJsonLd(crumbs),
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              inLanguage: languageTag(locale),
              mainEntity: meta.faq.map((item) => ({
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            {isFa ? "ابزارهای رایگان سوشو" : "Sosho free tools"}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">{meta.heading}</h1>
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{meta.intro}</p>
        </div>
      </header>

      <ToolsGrid locale={locale} />

      <section aria-labelledby="tools-guide-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="tools-guide-title" className="text-xl font-bold text-foreground">{meta.guideTitle}</h2>
        <div className="mt-4 grid gap-3 text-sm leading-8 text-muted md:text-base">
          {meta.guide.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ol className="mt-5 grid gap-2 text-sm text-foreground">
          {GUIDE_ORDER_SLUGS.map((slug, index) => (
            <li key={slug} className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent/30 text-xs font-bold text-accent" aria-hidden="true">
                {isFa ? ["۱", "۲", "۳", "۴", "۵"][index] : index + 1}
              </span>
              <Link href={getToolHref(locale, slug)} prefetch={false} className="rounded-md underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
                {meta.guideOrder[index]}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tools-faq-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="tools-faq-title" className="text-xl font-bold text-foreground">{meta.faqTitle}</h2>
        <div className="mt-5 divide-y divide-foreground/10">
          {meta.faq.map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-bold text-foreground md:text-base">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-7 text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-6 rounded-3xl border border-accent/20 bg-surface/30 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{meta.cta}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{meta.ctaBody}</p>
        </div>
        <Link
          href={`/${locale}#contact`}
          prefetch={false}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
        >
          {meta.ctaButton}
          <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
