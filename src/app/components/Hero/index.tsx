import type { Locale } from "@/app/i18n";
import Hero3DClient from "./Hero3DClient";

export default function Hero({ locale }: { locale: Locale }) {
    return (
        <section className="relative w-full h-96 overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <Hero3DClient />
            </div>

            <div className="container relative items-stretch py-12 gap-10">
                <div className="w-full md:max-w-xl">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                        {locale === "fa" ? "سلام، من سهیل هستم." : "Hi, I’m Soheil."}
                    </h1>
                    <p className="mt-4 text-base leading-7 text-muted md:text-3xl">
                        {locale === "fa"
                            ? "رابط‌های مدرن برای وب مدرن..."
                            : "Modern interfaces for the modern web..."}

                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a
                            href="#projects"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-background transition-colors duration-200 motion-reduce:transition-none hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {locale === "fa" ? "دیدن پروژه‌ها" : "View Projects"}
                        </a>
                        <a
                            href="#services"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/15 bg-surface/30 px-5 text-sm font-semibold text-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {locale === "fa" ? "خدمات" : "Services"}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
