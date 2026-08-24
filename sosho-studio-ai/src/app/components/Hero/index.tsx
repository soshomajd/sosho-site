import type { Locale } from "@/app/i18n";
import Hero3DClient from "./Hero3DClient";

const COPY = {
    fa: {
        eyebrow: "SOSHO STUDIO · طراحی × تکنولوژی × رشد",
        title: "از ایده تا یک تجربه دیجیتال ماندگار.",
        description:
            "صفر تا صد حضور دیجیتال شما را یکپارچه انجام می‌دهیم؛ از طراحی و توسعه سایت اختصاصی و وردپرس تا سئو و گوگل، Web3 و راهکارهای هوش مصنوعی.",
        primaryAction: "شروع یک پروژه",
        secondaryAction: "دیدن خدمات",
        scroll: "برای کشف مسیر اسکرول کنید",
        services: ["طراحی وب", "وردپرس", "سئو و گوگل", "Web3", "راهکارهای AI"],
    },
    en: {
        eyebrow: "SOSHO STUDIO · DESIGN × TECHNOLOGY × GROWTH",
        title: "From first idea to a digital experience built to grow.",
        description:
            "Your complete digital partner—from custom web design, development and WordPress to SEO, Google growth, Web3 and practical AI solutions.",
        primaryAction: "Start a project",
        secondaryAction: "Explore services",
        scroll: "Scroll to explore the system",
        services: ["Web Design", "WordPress", "SEO & Google", "Web3", "AI Solutions"],
    },
} as const;

export default function Hero({ locale }: { locale: Locale }) {
    const copy = COPY[locale];
    const isFa = locale === "fa";

    return (
        <section
            id="studio-hero"
            aria-labelledby="studio-hero-title"
            className="relative isolate min-h-[210svh] overflow-clip bg-background motion-reduce:min-h-[100svh]"
        >
            <div className="sticky top-0 min-h-[100svh] overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(99,102,241,0.18),transparent_36%),radial-gradient(circle_at_78%_62%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#0b0f14_0%,#090d12_100%)] rtl:bg-[radial-gradient(circle_at_28%_38%,rgba(99,102,241,0.18),transparent_36%),radial-gradient(circle_at_22%_62%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#0b0f14_0%,#090d12_100%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]"
                />

                <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                    <Hero3DClient sectionId="studio-hero" locale={locale} />
                </div>

                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 z-[1] ${
                        isFa
                            ? "bg-gradient-to-l from-background via-background/82 to-transparent lg:via-background/55"
                            : "bg-gradient-to-r from-background via-background/82 to-transparent lg:via-background/55"
                    }`}
                />

                <div className="container relative z-10 grid min-h-[100svh] w-full items-center gap-10 py-24 sm:py-28 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:py-32">
                    <div className="max-w-2xl self-center">
                        <p className="mb-5 flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-accent sm:text-xs sm:tracking-[0.22em]">
                            <span
                                aria-hidden="true"
                                className="h-px w-8 shrink-0 bg-gradient-to-r from-accent to-primary rtl:bg-gradient-to-l"
                            />
                            <span dir="ltr">{copy.eyebrow}</span>
                        </p>

                        <h1
                            id="studio-hero-title"
                            className="max-w-[13ch] text-[clamp(2.8rem,7.1vw,6.65rem)] font-black leading-[0.96] tracking-[-0.055em] text-foreground sm:max-w-[12ch]"
                        >
                            {copy.title}
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg sm:leading-9">
                            {copy.description}
                        </p>

                        <ul
                            aria-label={isFa ? "حوزه‌های تخصصی" : "Areas of expertise"}
                            className="mt-6 flex max-w-2xl flex-wrap gap-2"
                        >
                            {copy.services.map((service, index) => (
                                <li
                                    key={service}
                                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-surface/55 px-3 py-1.5 text-xs font-medium text-foreground/78 backdrop-blur-sm sm:text-sm"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            index % 2 === 0 ? "bg-accent" : "bg-primary"
                                        }`}
                                    />
                                    <span dir={service === "Web3" ? "ltr" : undefined}>{service}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="https://www.instagram.com/sosho_studio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background transition duration-300 hover:-translate-y-0.5 hover:bg-white motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {copy.primaryAction}
                                <span
                                    aria-hidden="true"
                                    className="text-lg transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                                >
                                    →
                                </span>
                            </a>
                            <a
                                href="#services"
                                className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/15 bg-surface/35 px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface/65 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                {copy.secondaryAction}
                            </a>
                        </div>
                    </div>

                    <div className="hidden min-h-[28rem] lg:block" aria-hidden="true" />
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden items-center justify-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted sm:flex motion-reduce:hidden">
                    <span>{copy.scroll}</span>
                    <span className="relative h-10 w-px overflow-hidden bg-foreground/15" aria-hidden="true">
                        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-accent to-transparent [animation:hero-scroll-pulse_1.8s_ease-in-out_infinite]" />
                    </span>
                </div>

                <style>{`
                    @keyframes hero-scroll-pulse {
                        0% { transform: translateY(-100%); opacity: 0; }
                        30% { opacity: 1; }
                        100% { transform: translateY(200%); opacity: 0; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        [class*="hero-scroll-pulse"] { animation: none !important; }
                    }
                `}</style>
            </div>
        </section>
    );
}
