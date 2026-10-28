import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";
import {
    SiInstagram,
    SiGmail,
    SiLinkedin,
    SiTelegram,
    SiWhatsapp,
} from "react-icons/si";
import { FiMail, FiPhone } from "react-icons/fi";
import { CONTACT_INFO } from "@/app/contact-info";
import { SERVICES, getServiceHref } from "@/app/components/Services/data";
import ConsultantButton from "@/app/components/Consultant/ConsultantButton";

const SOCIAL_LINKS = [
    {
        label: "Email",
        href: `mailto:${CONTACT_INFO.email}`,
        Icon: SiGmail,
    },
    {
        label: "WhatsApp",
        href: CONTACT_INFO.whatsappUrl,
        Icon: SiWhatsapp,
    },
    {
        label: "Telegram",
        href: CONTACT_INFO.telegramUrl,
        Icon: SiTelegram,
    },
    {
        label: "Sosho Studio on Instagram",
        href: CONTACT_INFO.instagramUrl,
        Icon: SiInstagram,
    },
    {
        label: "Soheil Shokouhi Majd on LinkedIn",
        href: CONTACT_INFO.linkedinUrl,
        Icon: SiLinkedin,
    },
] as const;

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
// 44px tall rows on touch screens, a tighter list from md up.
const LIST_LINK = `flex min-h-11 items-center rounded-md text-sm text-muted transition-colors hover:text-foreground md:min-h-9 ${FOCUS_RING}`;
const HEADING = "flex items-center gap-2 text-sm font-bold text-foreground before:h-px before:w-4 before:bg-accent";

export default function Footer({ locale }: { locale: Locale }) {
    const isFa = locale === "fa";

    const links = isFa
        ? [
            { href: `/${locale}#services`, label: "خدمات" },
            { href: `/${locale}#projects`, label: "نمونه‌کارها" },
            { href: `/${locale}#about`, label: "درباره ما" },
            { href: `/${locale}#blog`, label: "مجله" },
            { href: `/${locale}/tools`, label: "ابزارهای رایگان" },
            { href: `/${locale}#contact`, label: "شروع پروژه" },
        ]
        : [
            { href: `/${locale}#services`, label: "Services" },
            { href: `/${locale}#projects`, label: "Selected work" },
            { href: `/${locale}#about`, label: "About" },
            { href: `/${locale}#blog`, label: "Insights" },
            { href: `/${locale}/tools`, label: "Free tools" },
            { href: `/${locale}#contact`, label: "Start a project" },
        ];

    const contacts = [
        {
            href: CONTACT_INFO.phoneHref,
            label: isFa ? "تماس تلفنی" : "Call",
            value: CONTACT_INFO.phoneDisplay,
            Icon: FiPhone,
        },
        {
            href: `mailto:${CONTACT_INFO.email}`,
            label: isFa ? "ایمیل" : "Email",
            value: CONTACT_INFO.email,
            Icon: FiMail,
        },
    ];

    return (
        <footer className="relative mt-16 overflow-hidden border-t border-foreground/10 bg-linear-to-b from-surface/25 to-background">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-3xl rtl:translate-x-1/2"
            />

            <div className="container relative pt-12 pb-28 md:pb-24">
                <div className="flex w-full flex-col gap-5 rounded-3xl border border-foreground/10 bg-surface/30 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                        <p className="text-lg font-bold text-foreground sm:text-xl">
                            {isFa ? "ایده‌ای برای پروژه بعدی دارید؟" : "Have a project in mind?"}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted">
                            {isFa
                                ? "با چند سؤال کوتاه، دامنه کار و برآورد اولیه پروژه‌تان را ببینید یا مستقیم با ما صحبت کنید."
                                : "Answer a few short questions to see your project's scope and a first estimate, or talk to us directly."}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                        <ConsultantButton locale={locale} variant="primary" />
                        <a
                            href={CONTACT_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 bg-background/30 px-6 text-sm font-bold text-foreground transition-colors hover:border-sage/60 hover:text-sage ${FOCUS_RING}`}
                        >
                            <SiWhatsapp className="h-4 w-4" aria-hidden="true" />
                            {isFa ? "گفتگو در واتساپ" : "Chat on WhatsApp"}
                        </a>
                    </div>
                </div>

                <div className="mt-12 grid w-full gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link
                            href={`/${locale}`}
                            prefetch={false}
                            className={`inline-flex rounded-lg ${FOCUS_RING} focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                            aria-label={isFa ? "صفحه اصلی سوشو استودیو" : "Sosho Studio home"}
                        >
                            <Image
                                src="/brand/logo-full-light.webp"
                                alt={isFa ? "لوگوی سوشو استودیو" : "Sosho Studio logo"}
                                width={824}
                                height={640}
                                className="h-auto w-28"
                            />
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
                            {isFa
                                ? "طراحی و اجرای صفر تا صد سایت، وب‌اپلیکیشن، اپ موبایل، سئو و راهکارهای هوش مصنوعی؛ یک تیم از استراتژی تا لانچ و رشد."
                                : "End-to-end websites, web apps, mobile apps, SEO and AI solutions: one team from strategy to launch and growth."}
                        </p>

                        <address className="mt-6 flex flex-col gap-2 not-italic">
                            {contacts.map(({ href, label, value, Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className={`group -ms-2 flex min-h-12 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-foreground/5 ${FOCUS_RING}`}
                                >
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-foreground/10 bg-surface/40 text-accent transition-colors group-hover:border-accent/40">
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-xs text-muted">{label}</span>
                                        <span dir="ltr" className="block text-sm text-foreground wrap-anywhere">{value}</span>
                                    </span>
                                </a>
                            ))}
                        </address>

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    title={label}
                                    className={`grid h-11 w-11 place-items-center rounded-full border border-foreground/10 bg-surface/30 text-muted transition-colors hover:border-accent/50 hover:text-accent ${FOCUS_RING}`}
                                >
                                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className={HEADING}>{isFa ? "دسترسی سریع" : "Quick links"}</h2>
                        <nav
                            aria-label={isFa ? "پیوندهای پاورقی" : "Footer navigation"}
                            className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1"
                        >
                            {links.map((l) => (
                                <Link key={l.href} href={l.href} prefetch={false} className={LIST_LINK}>
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Site-wide links to every service page: these pages were never crawled while only the home page linked to them. */}
                    <div className="md:col-span-2 lg:col-span-6">
                        <h2 className={HEADING}>{isFa ? "خدمات" : "Services"}</h2>
                        <nav
                            aria-label={isFa ? "خدمات سوشو استودیو" : "Sosho Studio services"}
                            className="mt-4 grid gap-x-6 sm:grid-cols-2"
                        >
                            {SERVICES.map(({ slug, title, Icon }) => (
                                <Link
                                    key={slug}
                                    href={getServiceHref(locale, slug)}
                                    prefetch={false}
                                    className={`group gap-2.5 ${LIST_LINK}`}
                                >
                                    <Icon className="h-4 w-4 shrink-0 text-accent/70 transition-colors group-hover:text-accent" aria-hidden="true" />
                                    <span>{title[locale]}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="mt-12 flex w-full flex-col gap-2 border-t border-foreground/10 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
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
