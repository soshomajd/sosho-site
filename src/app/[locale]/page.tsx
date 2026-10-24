import Link from "next/link";
import { FiArrowUpRight, FiPhone } from "react-icons/fi";
import { SiGmail, SiInstagram, SiLinkedin, SiTelegram, SiWhatsapp } from "react-icons/si";

import type { Locale } from "../i18n";
import { CONTACT_INFO } from "../contact-info";
import About from "../components/About";
import BlogPreview from "../components/BlogPreview";
import ContactForm from "../components/ContactForm";
import JsonLd from "../components/JsonLd";
import { baseUrl, languageTag, organizationId, websiteId } from "../seo";
import { seoContent } from "../seo-content";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Services from "../components/Services";
import { TOOLS } from "../components/Tools/data";
import ToolsGrid from "../components/Tools/ToolsGrid";

const contactChannels = [
  {
    href: CONTACT_INFO.phoneHref,
    external: false,
    Icon: FiPhone,
    label: { fa: "تماس تلفنی", en: "Phone" },
    value: CONTACT_INFO.phoneDisplay,
  },
  {
    href: CONTACT_INFO.whatsappUrl,
    external: true,
    Icon: SiWhatsapp,
    label: { fa: "واتس‌اپ", en: "WhatsApp" },
    value: CONTACT_INFO.phoneDisplay,
  },
  {
    href: CONTACT_INFO.telegramUrl,
    external: true,
    Icon: SiTelegram,
    label: { fa: "تلگرام", en: "Telegram" },
    value: CONTACT_INFO.telegramHandle,
  },
  {
    href: CONTACT_INFO.linkedinUrl,
    external: true,
    Icon: SiLinkedin,
    label: { fa: "لینکدین", en: "LinkedIn" },
    value: "Soheil Shokouhi Majd",
  },
  {
    href: `mailto:${CONTACT_INFO.email}`,
    external: false,
    Icon: SiGmail,
    label: { fa: "ایمیل", en: "Email" },
    value: CONTACT_INFO.email,
  },
  {
    href: CONTACT_INFO.instagramUrl,
    external: true,
    Icon: SiInstagram,
    label: { fa: "اینستاگرام", en: "Instagram" },
    value: "@sosho_studio",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-sm leading-7 text-muted md:col-span-4 md:text-base">
        {description}
      </p>
    </div>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isFa = locale === "fa";

  const pageUrl = `${baseUrl}/${locale}`;
  const content = seoContent[locale];

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: content.title,
          description: content.description,
          inLanguage: languageTag(locale),
          isPartOf: { "@id": websiteId },
          about: { "@id": organizationId },
          primaryImageOfPage: `${baseUrl}/og.jpg`,
        }}
      />
      <Hero locale={locale} />

      <div className="container items-stretch gap-24 py-20 md:gap-32 md:py-28">
        <section id="services" className="w-full scroll-mt-28">
          <SectionHeading
            eyebrow={isFa ? "از ایده تا اثر" : "From idea to impact"}
            title={isFa ? "هر چیزی که محصول دیجیتال شما نیاز دارد، زیر یک سقف" : "Everything your digital product needs, under one roof"}
            description={isFa ? "به‌جای هماهنگی چند تیم جدا، طراحی، توسعه، رشد و پشتیبانی را با یک مسیر یکپارچه جلو ببرید." : "Skip the handoffs between disconnected vendors. Design, engineering, growth, and support move forward as one system."}
          />
          <Services locale={locale} />
        </section>

        <section id="tools" className="w-full scroll-mt-28">
          <SectionHeading
            eyebrow={isFa ? "ابزارهای رایگان" : "Free tools"}
            title={isFa ? "سایت خودتان را همین الان بررسی کنید" : "Check your own website right now"}
            description={isFa ? "بررسی سئو، ساخت متاتگ و اسکیما و بررسی کنتراست رنگ؛ رایگان و بدون ثبت‌نام." : "SEO check, meta tag and schema builders, and a color contrast checker, free with no sign-up."}
          />
          <ToolsGrid locale={locale} tools={TOOLS.slice(0, 3)} />
          <div className="mt-6 flex justify-center">
            <Link
              href={`/${locale}/tools`}
              prefetch={false}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {isFa ? "دیدن همهٔ ابزارها" : "See all tools"}
              <FiArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section id="projects" className="w-full scroll-mt-28">
          <SectionHeading
            eyebrow={isFa ? "نمونه‌کارهای منتخب" : "Selected work"}
            title={isFa ? "ساخته‌شده برای وضوح، عملکرد و نتیجه" : "Built for clarity, performance, and real outcomes"}
            description={isFa ? "چند نمونه از تجربه‌هایی که با تمرکز بر نیاز کاربر، هویت برند و کیفیت اجرا طراحی شده‌اند." : "A selection of digital experiences shaped around user needs, brand character, and thoughtful execution."}
          />
          <Projects locale={locale} />
        </section>

        <section id="about" className="w-full scroll-mt-28">
          <SectionHeading
            eyebrow={isFa ? "چرا سوشو" : "Why Sosho"}
            title={isFa ? "یک شریک اجرایی، نه فقط یک تحویل‌دهنده" : "A delivery partner—not just another vendor"}
            description={isFa ? "از تصمیم‌های اولیه تا جزئیات فنی و رشد بعد از لانچ، یک تیم مسئول نتیجه می‌ماند." : "From early decisions to technical detail and post-launch growth, one team remains accountable for the result."}
          />
          <About locale={locale} />
        </section>

        <section id="blog" className="w-full scroll-mt-28">
          <SectionHeading
            eyebrow={isFa ? "بینش و تجربه" : "Ideas & practice"}
            title={isFa ? "یادداشت‌هایی برای تصمیم‌های بهتر دیجیتال" : "Notes for better digital decisions"}
            description={isFa ? "راهنماهای کاربردی درباره طراحی، تکنولوژی، سئو، هوش مصنوعی و ساخت محصول." : "Practical thinking on design, technology, SEO, AI, and building digital products."}
          />
          <BlogPreview locale={locale} />
        </section>

        <section id="contact" className="relative w-full scroll-mt-28 overflow-hidden rounded-[2rem] border border-accent/20 bg-surface/35 p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -end-20 -top-32 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 start-1/4 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                {isFa ? "پروژه بعدی شما" : "Your next project"}
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {isFa ? "ایده‌ای دارید؟ بیایید به یک محصول واقعی تبدیلش کنیم." : "Have an idea? Let’s turn it into something real."}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
                {isFa ? "کافی است هدفتان را برای ما بفرستید. مسیر مناسب، محدوده اولیه و قدم بعدی را شفاف با شما در میان می‌گذاریم." : "Send us the goal. We’ll come back with a clear recommendation, an initial scope, and the most useful next step."}
              </p>
            </div>

          </div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm locale={locale} />
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5">
              <p className="text-sm font-semibold text-foreground">
                {isFa ? "یا مستقیم با من در ارتباط باشید" : "Or reach me directly"}
              </p>
              {contactChannels.map(({ href, external, Icon, label, value }) => (
                <a
                  key={href}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-foreground/10 bg-background/30 px-5 py-4 transition-colors hover:border-accent/40 hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted">{isFa ? label.fa : label.en}</span>
                    <span dir="ltr" className={`block truncate text-sm font-bold text-foreground ${isFa ? "text-right" : "text-left"}`}>
                      {value}
                    </span>
                  </span>
                  {external ? (
                    <FiArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent rtl:-scale-x-100"
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
