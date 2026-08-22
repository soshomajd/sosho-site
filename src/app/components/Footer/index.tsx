import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";
import {
    SiInstagram,
    SiGmail,
    SiWhatsapp,
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
        href: "https://wa.me/989120265102",
        Icon: SiWhatsapp,
    },
    {
        label: "Sosho Studio on Instagram",
        href: "https://www.instagram.com/sosho_studio/",
        Icon: SiInstagram,
    },
] as const;

export default function Footer({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    const links = isFa
        ? [
            { href: `/${locale}#services`, label: "خدمات" },
            { href: `/${locale}#projects`, label: "نمونه‌کارها" },
            { href: `/${locale}#about`, label: "درباره ما" },
            { href: `/${locale}#blog`, label: "مجله" },
            { href: `/${locale}#contact`, label: "شروع پروژه" },
        ]
        : [
            { href: `/${locale}#services`, label: "Services" },
            { href: `/${locale}#projects`, label: "Selected work" },
            { href: `/${locale}#about`, label: "About" },
            { href: `/${locale}#blog`, label: "Insights" },
            { href: `/${locale}#contact`, label: "Start a project" },
        ];

    return (
        <footer className="mt-16 border-t border-foreground/10 bg-surface/10">
            <div className="container py-10">
                <div className="grid gap-8 md:grid-cols-12 md:items-start">
                    <div className="space-y-3 md:col-span-5">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-3 rounded-lg text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            aria-label={isFa ? "صفحه اصلی سوشو استودیو" : "Sosho Studio home"}
                        >
                            <Image
                                src="/sosho.svg"
                                alt={isFa ? "لوگوی سوشو استودیو" : "Sosho Studio logo"}
                                width={150}
                                height={50}
                                className="h-auto w-36"
                            />
                        </Link>

                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "سوشو استودیو" : "Sosho Studio"}
                        </p>
                        <p className="text-sm text-muted">
                            {isFa
                                ? "طراحی و اجرای صفر تا صد وب، وردپرس، سئو، Web3 و راهکارهای هوش مصنوعی"
                                : "End-to-end web design, WordPress, SEO, Web3 and AI solutions"}
                        </p>
                        <p className="max-w-md text-xs leading-6 text-muted/80">
                            {isFa
                                ? "یک تیم برای استراتژی، طراحی، توسعه، لانچ و رشد مداوم محصول دیجیتال شما."
                                : "One team for strategy, design, engineering, launch, and continuous digital growth."}
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "لینک‌ها" : "Links"}
                        </p>
                        <nav className="mt-3 flex flex-col gap-1 text-sm">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="rounded-md py-1.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="md:col-span-4">
                        <p className="text-sm font-semibold text-foreground">
                            {isFa ? "شروع همکاری" : "Start a project"}
                        </p>

                        <div className="mt-3 flex flex-col gap-3">
                            <a
                                href="tel:+989120265102"
                                className="-ms-2 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                aria-label={isFa ? "تماس تلفنی" : "Phone call"}
                            >
                                <BsFillTelephoneOutboundFill className="h-5 w-5 shrink-0" aria-hidden="true" />
                                <span dir="ltr" className="text-sm">+98 912 026 5102</span>
                            </a>

                            <a
                                href="mailto:soheilshokouhimajd@gmail.com"
                                className="-ms-2 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                                aria-label={isFa ? "ارسال ایمیل" : "Send email"}
                            >
                                <SiGmail className="h-5 w-5 shrink-0" aria-hidden="true" />
                                <span dir="ltr" className="text-sm wrap-anywhere">soheilshokouhimajd@gmail.com</span>
                            </a>

                            <div className="-ms-2 flex flex-wrap items-center gap-1 pt-1">
                                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        title={label}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
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
                        © {new Date().getFullYear()} Sosho Studio. {isFa ? "تمام حقوق محفوظ است." : "All rights reserved."}
                    </p>
                    <p className="text-muted/80">
                        {isFa ? "از ایده تا طراحی، اجرا و رشد" : "From idea to launch and growth"}
                    </p>
                </div>
            </div>
        </footer>
    );
}
