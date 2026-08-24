import { FiArrowUpRight } from "react-icons/fi";
import { SiInstagram, SiWhatsapp } from "react-icons/si";

import type { Locale } from "../i18n";
import About from "../components/About";
import BlogPreview from "../components/BlogPreview";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Services from "../components/Services";

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

  return (
    <main>
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

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <a
                href="https://www.instagram.com/sosho_studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
              >
                <SiInstagram className="h-4 w-4" aria-hidden="true" />
                {isFa ? "پیام در اینستاگرام" : "Message on Instagram"}
                <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/989120265102"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 bg-background/25 px-5 text-sm font-bold text-foreground transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <SiWhatsapp className="h-4 w-4 text-accent" aria-hidden="true" />
                {isFa ? "واتس‌اپ" : "WhatsApp"}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
