import type { Locale } from "@/app/i18n";
import HeroVideo from "./HeroVideo";
import { HERO_POSTER } from "./hero-assets";
import "./hero.css";

export const HERO_COPY = {
    fa: {
        eyebrow: "SOSHO STUDIO · طراحی × تکنولوژی × رشد",
        title: "از ایده تا یک تجربه دیجیتال ماندگار.",
        titleLines: ["از ایده تا یک تجربه", "دیجیتال ماندگار."],
        description:
            "صفر تا صد حضور دیجیتال شما را یکپارچه انجام می‌دهیم؛ از طراحی و توسعه سایت اختصاصی و وردپرس تا سئو و گوگل، Web3 و راهکارهای هوش مصنوعی.",
        descriptionLines: [
            "صفر تا صد حضور دیجیتال شما را یکپارچه انجام می‌دهیم؛",
            "از طراحی و توسعه سایت اختصاصی و وردپرس تا سئو و گوگل، Web3 و راهکارهای هوش مصنوعی.",
        ],
        primaryAction: "شروع یک پروژه",
        secondaryAction: "دیدن خدمات",
        scroll: "برای کشف مسیر اسکرول کنید",
        services: ["طراحی وب", "وردپرس", "سئو و گوگل", "Web3", "راهکارهای AI"],
    },
    en: {
        eyebrow: "SOSHO STUDIO · DESIGN × TECHNOLOGY × GROWTH",
        title: "From first idea to a digital experience built to grow.",
        titleLines: ["From first idea to a", "digital experience built to grow."],
        description:
            "Your complete digital partner—from custom web design, development and WordPress to SEO, Google growth, Web3 and practical AI solutions.",
        descriptionLines: [
            "Your complete digital partner—",
            "from custom web design, development and WordPress to SEO, Google growth, Web3 and practical AI solutions.",
        ],
        primaryAction: "Start a project",
        secondaryAction: "Explore services",
        scroll: "Scroll to explore the system",
        services: ["Web Design", "WordPress", "SEO & Google", "Web3", "AI Solutions"],
    },
} as const;

export default function Hero({ locale }: { locale: Locale }) {
    const copy = HERO_COPY[locale];
    const isFa = locale === "fa";

    return (
        <section id="studio-hero" aria-labelledby="studio-hero-title" className="sh-hero">
            {/* React hoists this into <head>, so the poster is fetched first instead of queueing behind the video. */}
            <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />
            <HeroVideo />
            <div className="sh-veil" aria-hidden="true" />
            <div className="sh-fade" aria-hidden="true" />

            <div className="sh-inner">
                <h1 id="studio-hero-title" className="sh-title">
                    <span>{copy.titleLines[0]}</span>
                    <span>{copy.titleLines[1]}</span>
                </h1>

                <p className="sh-sub">
                    <span>{copy.descriptionLines[0]}</span>
                    <span>{copy.descriptionLines[1]}</span>
                </p>

                <a className="sh-cta" href={`/${locale}#contact`}>
                    <span>{copy.primaryAction}</span>
                    <svg className="sh-arrow" viewBox="0 0 16 11" aria-hidden="true">
                        <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8" />
                    </svg>
                </a>

                <ul className="sh-feats" aria-label={isFa ? "حوزه‌های تخصصی" : "Areas of expertise"}>
                    {copy.services.map((service) => (
                        <li key={service}>
                            <svg className="sh-chev" viewBox="0 0 11 20" aria-hidden="true">
                                <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
                            </svg>
                            <span dir={service === "Web3" ? "ltr" : undefined}>{service}</span>
                        </li>
                    ))}
                </ul>

                <span className="sh-rule" aria-hidden="true" />
            </div>

            <p className="sh-foot">
                <span>{copy.scroll}</span>
            </p>
        </section>
    );
}
