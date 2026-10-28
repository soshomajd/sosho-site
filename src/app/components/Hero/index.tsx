import type { Locale } from "@/app/i18n";
import Image from "next/image";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import ConsultantButton from "../Consultant/ConsultantButton";
import PortraitEyes from "./PortraitEyes";
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
        services: ["طراحی وب", "وب‌اپلیکیشن", "اپ موبایل", "وردپرس", "سئو و گوگل", "Web3", "راهکارهای AI"],
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
        services: ["Web Design", "Web Apps", "Mobile Apps", "WordPress", "SEO & Google", "Web3", "AI Solutions"],
    },
} as const;

export default function Hero({ locale }: { locale: Locale }) {
    const copy = HERO_COPY[locale];
    const isFa = locale === "fa";

    return (
        <section id="studio-hero" aria-labelledby="studio-hero-title" className="sh-hero">
            <div className="sh-stage">
                <p className="sh-eyebrow" data-reveal>{copy.eyebrow}</p>
                <p className="sh-wordmark" aria-hidden="true" dir="ltr">SOSHO STUDIO</p>
                <div className="sh-portrait">
                    <Image
                        src="/brand/soheil-character-3d.webp"
                        alt={isFa ? "چهرهٔ کارتونی سه‌بعدی سهیل شکوهی مجد، بنیان‌گذار سوشو استودیو" : "3D cartoon portrait of Soheil Shokouhi Majd, founder of Sosho Studio"}
                        width={1000}
                        height={1000}
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 540px"
                        fetchPriority="high"
                        loading="eager"
                        className="sh-character"
                    />
                    <PortraitEyes />
                </div>
                <div className="sh-intro" data-reveal>
                    <h1 id="studio-hero-title" className="sh-title">{copy.title}</h1>
                    <p className="sh-sub">{copy.description}</p>
                </div>
                <div className="sh-actions" data-reveal data-motion-delay="120">
                    <a className="sh-cta" href={`/${locale}#contact`}>
                        <span>{copy.primaryAction}</span>
                        <FiArrowUpRight aria-hidden="true" className="rtl:-scale-x-100" />
                    </a>
                    <ConsultantButton locale={locale} variant="bare" className="sh-secondary sh-estimate" />
                    <a className="sh-secondary" href={`/${locale}#services`}>{copy.secondaryAction}</a>
                </div>
            </div>
            <div className="sh-bottom">
                <ul className="sh-feats" aria-label={isFa ? "حوزه‌های تخصصی" : "Areas of expertise"}>
                    {copy.services.map((service) => <li key={service}><span dir={service === "Web3" ? "ltr" : undefined}>{service}</span></li>)}
                </ul>
                <a className="sh-scroll" href="#about"><span>{copy.scroll}</span><FiArrowDown aria-hidden="true" /></a>
            </div>
        </section>
    );
}
