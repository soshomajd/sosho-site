import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HtmlLangDir from "../components/HtmlLangDir";
import { getDictionary, isLocale, locales, type Locale } from "../i18n";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    const dict = getDictionary(locale);

    const title =
        locale === "fa"
            ? `${dict.siteName} | فریلنسر`
            : `${dict.siteName} | Freelancer`;

    const description =
        locale === "fa"
            ? "نمونه‌کارها، خدمات و راه‌های ارتباطی."
            : "Freelancer portfolio: projects, services, and contact.";

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: title,
            template: `%s | ${dict.siteName}`,
        },
        description,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                fa: "/fa",
                en: "/en",
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "fa" ? "fa_IR" : "en_US",
            url: `/${locale}`,
            siteName: dict.siteName,
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        icons: {
            icon: "/favicon.ico",
        },
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

    return (
        <>
            <HtmlLangDir lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} />
            <Header locale={locale} labels={dict} />
            {children}
            <Footer locale={locale} />
        </>
    );
}
