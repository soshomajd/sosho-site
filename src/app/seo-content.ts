import type { Locale } from "@/app/i18n";

/** Homepage SEO copy shared by the locale layout metadata and the homepage JSON-LD. */
export const seoContent: Record<
    Locale,
    {
        title: string;
        description: string;
        keywords: string[];
        catalogName: string;
        services: string[];
    }
> = {
    fa: {
        title: "سوشو استودیو | طراحی سایت شرکتی و فروشگاهی، وب‌اپ و سئو",
        description:
            "سوشو استودیو؛ طراحی سایت شرکتی و فروشگاهی با نمونه‌کار واقعی، وردپرس و توسعهٔ اختصاصی، وب‌اپ و اپلیکیشن موبایل؛ از شناخت نیاز تا انتشار و پشتیبانی.",
        keywords: [
            "سوشو استودیو",
            "طراحی سایت",
            "طراحی سایت اختصاصی",
            "طراحی سایت شرکتی",
            "طراحی سایت فروشگاهی",
            "طراحی وب اپلیکیشن",
            "ساخت اپلیکیشن موبایل",
            "طراحی سایت وردپرس",
            "سئو سایت",
            "سئو گوگل",
            "طراحی Web3",
            "هوش مصنوعی",
        ],
        catalogName: "خدمات طراحی، توسعه و رشد دیجیتال",
        services: [
            "طراحی و توسعه سایت اختصاصی",
            "طراحی سایت شرکتی",
            "طراحی سایت فروشگاهی",
            "طراحی و توسعه وب‌اپلیکیشن با Next.js و React",
            "طراحی و ساخت اپلیکیشن موبایل اندروید و iOS",
            "طراحی و توسعه سایت وردپرسی",
            "سئو و بهینه‌سازی برای گوگل",
            "طراحی و توسعه تجربه‌های Web3",
            "اتوماسیون و یکپارچه‌سازی هوش مصنوعی",
        ],
    },
    en: {
        title: "Sosho Studio | Corporate Websites, Ecommerce & Web Apps",
        description:
            "Sosho Studio designs corporate websites and ecommerce stores, with real case studies, WordPress and custom development, web apps, mobile apps and ongoing care.",
        keywords: [
            "Sosho Studio",
            "web design studio",
            "custom web development",
            "corporate website design",
            "ecommerce website design",
            "web app development",
            "mobile app development",
            "WordPress design",
            "SEO services",
            "Google SEO",
            "Web3 development",
            "AI integration",
        ],
        catalogName: "Web design, development and growth services",
        services: [
            "Custom website design and development",
            "Corporate website design",
            "Ecommerce website design",
            "Web application development with Next.js and React",
            "Android and iOS mobile app development",
            "WordPress design and development",
            "SEO and Google optimization",
            "Web3 experience design and development",
            "AI automation and integration",
        ],
    },
};
