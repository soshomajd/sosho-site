import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

import Breadcrumbs from "@/app/components/Breadcrumbs";
import ConsultantButton from "@/app/components/Consultant/ConsultantButton";
import ContactChannels from "@/app/components/ContactChannels";
import ContactForm from "@/app/components/ContactForm";
import JsonLd from "@/app/components/JsonLd";
import { getToolHref } from "@/app/components/Tools/data";
import { getDictionary, isLocale, type Locale } from "@/app/i18n";
import { baseUrl, breadcrumbJsonLd, languageTag, organizationId, SITE_CONTENT_UPDATED_AT, websiteId } from "@/app/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();

const COPY = {
  fa: {
    title: "تماس با سوشو استودیو؛ سفارش طراحی سایت و مشاوره",
    description:
      "برای سفارش طراحی سایت، مشاوره یا پرسش دربارهٔ پروژه با سوشو استودیو تماس بگیرید: فرم پیام، تلفن، واتس‌اپ، تلگرام و ایمیل. پاسخ با بنیان‌گذار استودیو است.",
    crumb: "تماس با ما",
    eyebrow: "سفارش طراحی سایت و مشاوره",
    heading: "تماس با سوشو استودیو",
    lead: "برای سفارش طراحی سایت، مشاورهٔ پیش از شروع یا پرسش دربارهٔ یک پروژه، از هر راهی که راحت‌ترید پیام بدهید. پیام‌ها را خودم می‌خوانم و پاسخ می‌دهم.",
    channels: "راه‌های تماس مستقیم",
    briefTitle: "برای پاسخ دقیق‌تر چه بنویسید؟",
    brief: [
      "نوع کسب‌وکار و کاری که سایت باید انجام دهد",
      "آدرس سایت فعلی یا نمونهٔ سایت‌هایی که می‌پسندید",
      "وضعیت متن، عکس و اطلاعات محصول یا خدمات",
      "زمان‌بندی مدنظر و هر محدودیتی که باید بدانیم",
    ],
    estimateTitle: "هنوز نمی‌دانید چه چیزی لازم دارید؟",
    estimate: "با چند سؤال کوتاه، دامنهٔ کار و پیشنهاد اولیهٔ پروژه را ببینید؛ بعد با یک تصویر روشن‌تر صحبت می‌کنیم.",
    estimateLink: "دربارهٔ برآورد هزینه طراحی سایت",
    faqTitle: "پرسش‌های متداول",
    faq: [
      { q: "پیام من را چه کسی می‌خواند؟", a: "بنیان‌گذار استودیو پیام‌ها را می‌خواند و از همان راه تماسی که نوشته‌اید پاسخ می‌دهد." },
      { q: "برای گرفتن قیمت طراحی سایت چه کار کنم؟", a: "قیمت به دامنهٔ کار بستگی دارد. با برآورد هوشمند یا یک پیام کوتاه دربارهٔ نیازتان شروع کنید؛ مبلغ پس از روشن‌شدن محدوده اعلام می‌شود." },
      { q: "از خارج از ایران هم می‌توانم سفارش بدهم؟", a: "بله. ارتباط و تحویل پروژه به فارسی و انگلیسی انجام می‌شود." },
    ],
  },
  en: {
    title: "Contact Sosho Studio: Website Projects and Consultation",
    description:
      "Contact Sosho Studio about a website project or a question by message form, phone, WhatsApp, Telegram or email. The studio's founder replies personally.",
    crumb: "Contact",
    eyebrow: "Website projects and consultation",
    heading: "Contact Sosho Studio",
    lead: "For a website project, a consultation before you start or a question about your project, use whichever channel suits you. I read the messages and reply personally.",
    channels: "Direct channels",
    briefTitle: "What helps us answer precisely?",
    brief: [
      "Your type of business and the job the website has to do",
      "Your current site address or examples of sites you like",
      "How ready your copy, images and product or service information are",
      "Your preferred timing and any constraint we should know about",
    ],
    estimateTitle: "Not sure what you need yet?",
    estimate: "Answer a few short questions to see the scope and a first proposal for your project; then we talk with a clearer picture.",
    estimateLink: "About the website cost estimate",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Who reads my message?", a: "The studio's founder reads the messages and replies using the contact detail you leave." },
      { q: "How do I get a price for a website?", a: "The price depends on the scope. Start with the smart estimate or a short message about what you need; the amount follows once the scope is clear." },
      { q: "Can I order from outside Iran?", a: "Yes. Communication and delivery are handled in Persian and English." },
    ],
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
  const canonical = `/${locale}/contact`;
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: copy.title },
    description: copy.description,
    alternates: {
      canonical,
      languages: { fa: "/fa/contact", en: "/en/contact", "x-default": "/fa/contact" },
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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isFa = locale === "fa";
  const copy = COPY[locale];
  const pageUrl = `${baseUrl}/${locale}/contact`;
  const crumbs = [
    { name: isFa ? "خانه" : "Home", path: `/${locale}` },
    { name: copy.crumb, path: `/${locale}/contact` },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="container items-stretch gap-8 py-14 outline-none md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: copy.title,
              description: copy.description,
              inLanguage: languageTag(locale),
              isPartOf: { "@id": websiteId },
              about: { "@id": organizationId },
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
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section aria-labelledby="contact-form-title" className="lg:col-span-7">
          <h2 id="contact-form-title" className="sr-only">{isFa ? "فرم تماس" : "Contact form"}</h2>
          <ContactForm locale={locale} />
        </section>
        <section aria-labelledby="contact-channels-title" className="flex flex-col gap-3 lg:col-span-5">
          <h2 id="contact-channels-title" className="text-sm font-semibold text-foreground">{copy.channels}</h2>
          <ContactChannels locale={locale} />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section aria-labelledby="contact-brief-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-7">
          <h2 id="contact-brief-title" className="text-xl font-bold text-foreground">{copy.briefTitle}</h2>
          <ul className="mt-4 grid gap-3">
            {copy.brief.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-7 text-muted">
                <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="contact-estimate-title" className="flex flex-col items-start rounded-3xl border border-accent/25 bg-surface/30 p-6 sm:p-8 lg:col-span-5">
          <h2 id="contact-estimate-title" className="text-xl font-bold text-foreground">{copy.estimateTitle}</h2>
          <p className="mt-3 text-sm leading-8 text-muted">{copy.estimate}</p>
          <ConsultantButton locale={locale} variant="primary" className="mt-5" />
          <Link
            href={getToolHref(locale, "website-cost-estimate")}
            prefetch={false}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-bold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            {copy.estimateLink}
            <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </section>
      </div>

      <section aria-labelledby="contact-faq-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
        <h2 id="contact-faq-title" className="text-xl font-bold text-foreground">{copy.faqTitle}</h2>
        <div className="mt-5 divide-y divide-foreground/10">
          {copy.faq.map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-bold text-foreground md:text-base">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-7 text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
