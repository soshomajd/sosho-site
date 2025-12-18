import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";
import LanguageSwitch from "./LanguageSwitch";
import {
    SiInstagram,
    SiGmail,
    SiLinkedin,
    SiTelegram,
    SiWhatsapp,
    SiX
} from "react-icons/si";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";


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
        label: "Email",
        href: "mailto:soheilshokouhimajd@gmail.com",
        Icon: SiGmail,
    },
    {
        label: "WhatsApp",
        href: "https://wa.me/09120265102",
        Icon: SiWhatsapp,
    },
    {
        label: "Telegram",
        href: "https://t.me/s0h3ill",
        Icon: SiTelegram,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/soheil_shokouhi_majd?igsh=NnhmM2l0ZW91endn&utm_source=qr",
        Icon: SiInstagram,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/soheil-shokouhi-majd-100144244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
        Icon: SiLinkedin,
    },
    {
        label: "X",
        href: "https://x.com/majdsoheil84888?s=21",
        Icon: SiX,
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
        { label: labels.nav.projects, href: "#projects", variant: "primary" },
        { label: labels.nav.services, href: "#services", variant: "default" },
        { label: labels.nav.about, href: "#about", variant: "default" },
        { label: labels.nav.blog, href: "#blog", variant: "default" },
    ] as const;

    return (
        <header className="sticky top-0 z-50 w-full border-b  border-foreground/10 bg-surface/40 backdrop-blur-md">
            <div className="container flex-row flex-wrap items-center justify-between gap-4 py-4">
                <Link
                    href={`/${locale}`}
                    className="group inline-flex items-center gap-3 text-base font-semibold tracking-tight text-foreground transition-colors duration-200 motion-reduce:transition-none hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <Image
                        src="/sosho.svg"
                        alt={`${labels.siteName} logo`}
                        width={180}
                        height={180}
                        className="rounded-md"
                        priority
                    />


                </Link>

                <nav
                    aria-label="Primary"
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium"
                >
                    {NAV_ITEMS.map((item, index) => (
                        <span
                            key={`${item.href}-${index}`}
                            className="inline-flex items-center gap-x-6"
                        >
                            {index > 0 ? (
                                <span
                                    className="text-foreground/20"
                                    aria-hidden="true"
                                >
                                    ·
                                </span>
                            ) : null}

                            <a
                                href={item.href}
                                className={
                                    "relative text-sm font-semibold text-muted transition-all duration-200 motion-reduce:transition-none hover:text-foreground hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                }
                            >
                                {item.label}
                            </a>
                        </span>
                    ))}
                </nav>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                    <a
                        href="tel:+989120265102"
                        className="text-muted transition-all duration-200 motion-reduce:transition-none hover:text-foreground hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <BsFillTelephoneOutboundFill className="inline-block h-5 w-5 mr-1" aria-hidden="true" />
                    </a>

                    <span className="hidden sm:inline-block h-4 w-px bg-foreground/10" />

                    <div className="flex items-center gap-3">
                        <LanguageSwitch />
                        <span
                            className="hidden sm:inline-block h-4 w-px bg-foreground/10"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="text-muted transition-all duration-200 motion-reduce:transition-none hover:text-accent hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
