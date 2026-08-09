import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";
import LanguageSwitch from "./LanguageSwitch";
import {
    SiInstagram,
    SiWhatsapp,
} from "react-icons/si";


type HeaderLabels = {
    siteName: string;
    tagline: string;
    nav: {
        projects: string;
        services: string;
        about: string;
        blog: string;
    };
};

const SOCIAL_LINKS = [
    {
        label: "WhatsApp",
        href: "https://wa.me/989120265102",
        Icon: SiWhatsapp,
    },
    {
        label: "Sosho Studio on Instagram",
        href: "https://www.instagram.com/sosho_studio/",
        Icon: SiInstagram,
    },
] as const;

export default function Header({
    locale,
    labels,
}: {
    locale: Locale;
    labels: HeaderLabels;
}) {
    const NAV_ITEMS = [
        { label: labels.nav.services, href: `/${locale}#services`, variant: "default" },
        { label: labels.nav.projects, href: `/${locale}#projects`, variant: "primary" },
        { label: labels.nav.about, href: `/${locale}#about`, variant: "default" },
        { label: labels.nav.blog, href: `/${locale}#blog`, variant: "default" },
    ] as const;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/75 backdrop-blur-xl">
            <div className="container flex-row items-center justify-between gap-3 py-3">
                <Link
                    href={`/${locale}`}
                    aria-label={locale === "fa" ? "صفحه اصلی سوشو استودیو" : "Sosho Studio home"}
                    className="group inline-flex shrink-0 items-center gap-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <Image
                        src="/sosho.svg"
                        alt={locale === "fa" ? "لوگوی سوشو استودیو" : "Sosho Studio logo"}
                        width={132}
                        height={44}
                        className="h-auto w-28 sm:w-32"
                        priority
                    />
                    <span className="hidden rounded-full border border-foreground/10 px-2 py-1 text-[9px] font-bold tracking-[0.22em] text-muted sm:inline-flex">
                        STUDIO
                    </span>
                </Link>

                <nav
                    aria-label={locale === "fa" ? "پیمایش اصلی" : "Primary navigation"}
                    className="hidden items-center gap-x-5 text-sm font-medium lg:flex"
                >
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3 text-sm">
                    <LanguageSwitch />
                    <span className="hidden h-4 w-px bg-foreground/10 sm:block" aria-hidden="true" />
                    <div className="hidden items-center gap-3 sm:flex">
                        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="text-muted transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                    <a
                        href={`/${locale}#contact`}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-xs font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none sm:text-sm"
                    >
                        {locale === "fa" ? "شروع پروژه" : "Start a project"}
                    </a>
                </div>
            </div>
        </header>
    );
}
