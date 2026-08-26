import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HtmlLangDir from "../components/HtmlLangDir";
import SalesAssistant from "../components/SalesAssistant";
import { getDictionary, isLocale, locales, type Locale } from "../i18n";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const baseUrl = siteUrl.replace(/\/$/, "");
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();
const siteName = "Sosho Studio";
const instagramUrl = "https://www.instagram.com/sosho_studio/";

const seoContent: Record<
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

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const { title, description, keywords } = seoContent[locale];

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: title,
            template: `%s | ${siteName}`,
        },
        description,
        keywords,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                fa: "/fa",
                en: "/en",
                "x-default": "/fa",
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
            alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
            url: `/${locale}`,
            siteName,
            title,
            description,
            images: [{
                url: ogImageUrl,
                width: 1731,
                height: 909,
                alt: locale === "fa" ? "سوشو استودیو؛ طراحی، تکنولوژی و رشد" : "Sosho Studio — Design, Technology & Growth",
            }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl],
        },
        icons: {
            icon: "/favicon.ico",
        },
    };
}

function createStructuredData(locale: Locale) {
    const content = seoContent[locale];
    const language = locale === "fa" ? "fa-IR" : "en-US";
    const pageUrl = `${baseUrl}/${locale}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${baseUrl}/#organization`,
                name: siteName,
                alternateName: "سوشو استودیو",
                url: baseUrl,
                logo: `${baseUrl}/sosho.svg`,
                description: content.description,
                email: "mailto:soheilshokouhimajd@gmail.com",
                telephone: "+989120265102",
                areaServed: "Worldwide",
                sameAs: [instagramUrl],
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    telephone: "+989120265102",
                    email: "soheilshokouhimajd@gmail.com",
                    availableLanguage: ["Persian", "English"],
                },
                hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: content.catalogName,
                    itemListElement: content.services.map((service) => ({
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: service,
                        },
                    })),
                },
            },
            {
                "@type": "WebSite",
                "@id": `${baseUrl}/#website`,
                url: baseUrl,
                name: siteName,
                alternateName: "سوشو استودیو",
                inLanguage: ["fa-IR", "en-US"],
                publisher: { "@id": `${baseUrl}/#organization` },
            },
            {
                "@type": "WebPage",
                "@id": `${pageUrl}/#webpage`,
                url: pageUrl,
                name: content.title,
                description: content.description,
                inLanguage: language,
                isPartOf: { "@id": `${baseUrl}/#website` },
                about: { "@id": `${baseUrl}/#organization` },
            },
        ],
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
    const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
    const dict = getDictionary(locale);
    const structuredData = createStructuredData(locale);

    return (
        <>
            <script
                id={`sosho-studio-structured-data-${locale}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
                }}
            />
            <HtmlLangDir lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} />
            <Header locale={locale} labels={dict} />
            {children}
            <Footer locale={locale} />
            <SalesAssistant locale={locale} />
        </>
    );
}
