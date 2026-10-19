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
        title: "سوشو استودیو | طراحی سایت، وردپرس، سئو، Web3 و هوش مصنوعی",
        description:
            "سوشو استودیو از ایده تا اجرا، طراحی و توسعه سایت‌های اختصاصی و وردپرسی، سئو و رشد در گوگل، راهکارهای Web3 و یکپارچه‌سازی هوش مصنوعی را انجام می‌دهد.",
        keywords: [
            "سوشو استودیو",
            "طراحی سایت",
            "طراحی سایت اختصاصی",
            "طراحی سایت وردپرس",
            "سئو سایت",
            "سئو گوگل",
            "طراحی Web3",
            "هوش مصنوعی",
        ],
        catalogName: "خدمات طراحی، توسعه و رشد دیجیتال",
        services: [
            "طراحی و توسعه سایت اختصاصی",
            "طراحی و توسعه سایت وردپرسی",
            "سئو و بهینه‌سازی برای گوگل",
            "طراحی و توسعه تجربه‌های Web3",
            "اتوماسیون و یکپارچه‌سازی هوش مصنوعی",
        ],
    },
    en: {
        title: "Sosho Studio | Web Design, WordPress, SEO, Web3 & AI",
        description:
            "Sosho Studio delivers end-to-end web design and development, WordPress, SEO and Google growth, Web3 experiences, and practical AI integrations.",
        keywords: [
            "Sosho Studio",
            "web design studio",
            "custom web development",
            "WordPress design",
            "SEO services",
            "Google SEO",
            "Web3 development",
            "AI integration",
        ],
        catalogName: "Web design, development and growth services",
        services: [
            "Custom website design and development",
            "WordPress design and development",
            "SEO and Google optimization",
            "Web3 experience design and development",
            "AI automation and integration",
        ],
    },
};
