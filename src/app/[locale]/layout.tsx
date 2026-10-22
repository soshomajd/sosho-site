import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HtmlLangDir from "../components/HtmlLangDir";
import SalesAssistantGate from "../components/SalesAssistant/Gate";
import { CONTACT_INFO } from "../contact-info";
import { getDictionary, isLocale, locales, type Locale } from "../i18n";
import JsonLd from "../components/JsonLd";
import { baseUrl, organizationId, siteName, websiteId } from "../seo";
import { seoContent } from "../seo-content";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.jpg", siteUrl).toString();
const instagramUrl = "https://www.instagram.com/sosho_studio/";
const founderId = `${baseUrl}/#founder`;

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
            absolute: title,
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
    };
}

function createStructuredData(locale: Locale) {
    const content = seoContent[locale];

    // Organization, founder and WebSite are site-wide. The per-page WebPage node
    // lives in each page, so descendants never claim to be the locale homepage.
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": organizationId,
                name: siteName,
                alternateName: "سوشو استودیو",
                url: baseUrl,
                logo: `${baseUrl}/brand/logo-mark-512.png`,
                description: content.description,
                email: CONTACT_INFO.email,
                telephone: CONTACT_INFO.phoneE164,
                areaServed: "Worldwide",
                founder: { "@id": founderId },
                sameAs: [instagramUrl, CONTACT_INFO.linkedinUrl, CONTACT_INFO.telegramUrl],
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    telephone: CONTACT_INFO.phoneE164,
                    email: CONTACT_INFO.email,
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
                "@type": "Person",
                "@id": founderId,
                name: "Soheil Shokouhi Majd",
                jobTitle: locale === "fa" ? "مؤسس سوشو استودیو" : "Founder of Sosho Studio",
                worksFor: { "@id": organizationId },
                sameAs: [CONTACT_INFO.linkedinUrl, CONTACT_INFO.telegramUrl],
            },
            {
                "@type": "WebSite",
                "@id": websiteId,
                url: baseUrl,
                name: siteName,
                alternateName: "سوشو استودیو",
                inLanguage: ["fa-IR", "en-US"],
                publisher: { "@id": organizationId },
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
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-background"
            >
                {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
            </a>
            <JsonLd id={`sosho-studio-structured-data-${locale}`} data={structuredData} />
            <HtmlLangDir lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} />
            <Header locale={locale} labels={dict} />
            {children}
            <Footer locale={locale} />
            <SalesAssistantGate locale={locale} />
        </>
    );
}
