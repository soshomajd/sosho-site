import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";
import {
    SiInstagram,
    SiGmail,
    SiLinkedin,
    SiTelegram,
    SiWhatsapp,
    SiX,
} from "react-icons/si";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";

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

export default function Footer({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    const links = isFa
        ? [
            { href: `/${locale}#projects`, label: "پروژه‌ها" },
            { href: `/${locale}#services`, label: "خدمات" },
            { href: `/${locale}#about`, label: "درباره ما" },
        ]
        : [
            { href: `/${locale}#projects`, label: "Projects" },
            { href: `/${locale}#services`, label: "Services" },
            { href: `/${locale}#about`, label: "About" },
        ];

    return (
        <footer className="mt-16 border-t border-foreground/10 bg-surface/10">
            <div className="container py-10">
                <div className="grid gap-8 md:grid-cols-12 md:items-start">
                    <div className="space-y-3 md:col-span-5">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-3 text-foreground transition-colors hover:text-accent"
                            aria-label={isFa ? "صفحه اصلی" : "Home"}
                        >
                            <Image
                                src="/sosho.svg"
                                alt={isFa ? "لوگو" : "Logo"}
                                width={140}
                                height={140}
                                className="rounded-md"
                            />
                        </Link>

                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "سهیل شکوهی مجد" : "Soheil Shokouhi Majd"}
                        </p>
                        <p className="text-sm text-muted">
                            {isFa
                                ? "طراحی و توسعه وب با کیفیت و تحویل سریع"
                                : "Web design & development with fast delivery"}
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "لینک‌ها" : "Links"}
                        </p>
                        <nav className="mt-3 flex flex-col gap-2 text-sm">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="text-muted transition-colors hover:text-foreground"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="md:col-span-4">
                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "تماس" : "Contact"}
                        </p>

                        <div className="mt-3 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <a
                                    href="tel:+989120265102"
                                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                                    aria-label={isFa ? "تماس تلفنی" : "Phone call"}
                                >
                                    <BsFillTelephoneOutboundFill className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-sm">+98 912 026 5102</span>
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href="mailto:soheilshokouhimajd@gmail.com"
                                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                                    aria-label={isFa ? "ارسال ایمیل" : "Send email"}
                                >
                                    <SiGmail className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-sm">soheilshokouhimajd@gmail.com</span>
                                </a>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        title={label}
                                        className="text-muted transition-colors hover:text-accent"
                                    >
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-2 border-t border-foreground/10 pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} {isFa ? "تمام حقوق محفوظ است" : "All rights reserved"}
                    </p>
                    <p className="text-muted/80">{isFa ? "ساخته‌شده با Next.js" : "Built with Next.js"}</p>
                </div>
            </div>
        </footer>
    );
}
