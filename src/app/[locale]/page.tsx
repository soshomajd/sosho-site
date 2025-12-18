import type { Locale } from "../i18n";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Services from "../components/Services";
import About from "../components/About";
import BlogPreview from "../components/BlogPreview";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <Hero locale={locale} />

      <div className="container py-10 gap-14 items-stretch">

        <section id="projects" className="scroll-mt-24">
          <h2 className="text-6xl font-extrabold text-foreground">
            {locale === "fa" ? "پروژه‌ها" : "Projects"}
          </h2>
          <Projects locale={locale} />
        </section>

        <section id="services" className="scroll-mt-24">
          <h2 className="text-6xl font-extrabold text-foreground">
            {locale === "fa" ? "خدمات" : "Services"}
          </h2>
          <Services locale={locale} />
        </section>

        <section id="about" className="scroll-mt-24">
          <h2 className="text-6xl font-extrabold text-foreground">
            {locale === "fa" ? "درباره" : "About"}
          </h2>
          <About locale={locale} />
        </section>

        <section id="blog" className="scroll-mt-24">
          <h2 className="text-6xl font-extrabold text-foreground">
            {locale === "fa" ? "بلاگ" : "Blog"}
          </h2>
          <BlogPreview locale={locale} />
        </section>
      </div>
    </main>
  );
}
