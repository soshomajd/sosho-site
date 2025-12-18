import Image from "next/image";
import type { Locale } from "@/app/i18n";
import type { IconType } from "react-icons";
import {
    SiCss3,
    SiEthereum,
    SiHtml5,
    SiJavascript,
    SiMongodb,
    SiNextdotjs,
    SiNodedotjs,
    SiReact,
    SiSolidity,
} from "react-icons/si";
import { PiHardHatFill } from "react-icons/pi";

export default function About({ locale }: { locale: Locale }) {
    const title = locale === "fa" ? "درباره ما" : "About";

    const intro =
        locale === "fa"
            ? "من یک برنامه‌نویس فرانت‌اند هستم و در حوزه بلاک‌چین و اسمارت کانترکت هم فعالیت می‌کنم."
            : "I’m a front-end developer and I also work in blockchain and smart contracts.";

    const team =
        locale === "fa"
            ? "یک تیم کامل شامل بک‌اند و طراحی UI/UX باتجربه داریم تا محصول را از ۰ تا ۱۰۰ با کیفیت بالا تحویل دهیم."
            : "I work with an experienced team (back-end + UI/UX) to deliver full products end-to-end with high quality.";

    const points =
        locale === "fa"
            ? [
                "۱۲ سال سابقه کاری",
                "قیمت منصفانه + بهترین کیفیت",
                "تحویل سریع و دقیق",
                "سابقه همکاری با شرکت‌ها و صرافی‌های بزرگ",
                "هدف ما رضایت مشتری و ارائه بهترین خدمات است",
            ]
            : [
                "12+ years of experience",
                "Fair pricing with strong quality",
                "Fast, reliable delivery",
                "Experience working with large companies and exchanges",
                "Customer satisfaction and top service quality",
            ];

    const techTitle = locale === "fa" ? "تکنولوژی‌ها" : "Technologies";
    const technologies: Array<{
        name: string;
        Icon?: IconType;
        iconClassName?: string;
    }> = [
            { name: "HTML", Icon: SiHtml5, iconClassName: "text-orange-500" },
            { name: "CSS", Icon: SiCss3, iconClassName: "text-blue-500" },
            { name: "JavaScript", Icon: SiJavascript, iconClassName: "text-yellow-400" },
            { name: "React", Icon: SiReact, iconClassName: "text-cyan-400" },
            { name: "Next.js", Icon: SiNextdotjs, iconClassName: "text-foreground/80" },
            { name: "React Native", Icon: SiReact, iconClassName: "text-cyan-400" },
            { name: "Solidity", Icon: SiSolidity, iconClassName: "text-purple-400" },
            { name: "Smart Contracts", Icon: SiEthereum, iconClassName: "text-indigo-400" },
            { name: "Node.js", Icon: SiNodedotjs, iconClassName: "text-green-500" },
            { name: "MongoDB", Icon: SiMongodb, iconClassName: "text-emerald-500" },
            { name: "ethers.js", Icon: SiEthereum, iconClassName: "text-sky-400" },
            { name: "Hardhat", Icon: PiHardHatFill, iconClassName: "text-amber-400" },
        ];

    const testimonials =
        locale === "fa"
            ? [
                {
                    quote: "خیلی سریع و دقیق تحویل داد و در طول کار هم مرتب گزارش می‌داد. خروجی نهایی دقیقاً مطابق نیاز ما بود و از نتیجه واقعاً راضی هستیم.",
                    name: "سارا محمدی",
                    avatarSrc: "/customers/client1.jpg",
                    dir: "rtl" as const,
                },
                {
                    quote: "ارتباط عالی بود و همه جزئیات رو با حوصله بررسی کرد. کیفیت اجرا بالا بود و دقیقاً همون چیزی شد که انتظار داشتیم—حتماً دوباره همکاری می‌کنیم.",
                    name: "علی رضایی",
                    avatarSrc: "/customers/client2.jpg",
                    dir: "rtl" as const,
                },
                {
                    quote: "Great communication from day one and a very clean implementation overall. Everything was delivered on time, and the final result matched the spec perfectly.",
                    name: "Emma Carter",
                    avatarSrc: "/customers/client3.jpg",
                    dir: "ltr" as const,
                },
                {
                    quote: "Professional attention to UI details plus solid performance optimizations. The site feels faster, looks better, and the handoff was well-documented.",
                    name: "James Walker",
                    avatarSrc: "/customers/client4.jpg",
                    dir: "ltr" as const,
                },
            ]
            : [
                {
                    quote: "Great communication from day one and a very clean implementation overall. Everything was delivered on time, and the final result matched the spec perfectly.",
                    name: "Emma Carter",
                    avatarSrc: "/customers/client1.jpg",
                    dir: "ltr" as const,
                },
                {
                    quote: "Professional attention to UI details plus solid performance optimizations. The site feels faster, looks better, and the handoff was well-documented.",
                    name: "James Walker",
                    avatarSrc: "/customers/client2.jpg",
                    dir: "ltr" as const,
                },
                {
                    quote: "خیلی سریع و دقیق تحویل داد و در طول کار هم مرتب گزارش می‌داد. خروجی نهایی دقیقاً مطابق نیاز ما بود و از نتیجه واقعاً راضی هستیم.",
                    name: "سارا محمدی",
                    avatarSrc: "/customers/client3.jpg",
                    dir: "rtl" as const,
                },
                {
                    quote: "ارتباط عالی بود و همه جزئیات رو با حوصله بررسی کرد. کیفیت اجرا بالا بود و دقیقاً همون چیزی شد که انتظار داشتیم—حتماً دوباره همکاری می‌کنیم.",
                    name: "علی رضایی",
                    avatarSrc: "/customers/client4.jpg",
                    dir: "rtl" as const,
                },
            ];

    return (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-surface/20 p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent_72%)]" />

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
                <div className="md:col-span-5">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-foreground/10 bg-background/20">
                        <Image
                            src="/me/sosho.png"
                            alt={locale === "fa" ? "عکس سهیل" : "Soheil photo"}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="md:col-span-7">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {title}
                        </span>
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                        <span className="text-foreground/90">{intro}</span>
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted md:text-base">{team}</p>

                    <div className="mt-5 grid gap-2">
                        {points.map((text) => (
                            <div
                                key={text}
                                className="flex items-start gap-2 rounded-xl border border-foreground/10 bg-background/10 px-3 py-2 text-sm text-muted"
                            >
                                <span
                                    className="mt-1 inline-block h-2 w-2 rounded-full bg-accent/80"
                                    aria-hidden="true"
                                />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">{techTitle}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {technologies.map(({ name, Icon, iconClassName }) => (
                                <span
                                    key={name}
                                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/10 px-3 py-1.5 text-xs font-semibold text-foreground/90"
                                >
                                    {Icon ? (
                                        <Icon
                                            className={`h-4 w-4 ${iconClassName ?? "text-muted"}`}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full bg-accent/80"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="text-muted">{name}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mt-8">
                <div className="mb-4 h-px w-full bg-foreground/10" />
                <h4 className="text-base font-semibold text-foreground">
                    {locale === "fa" ? "نظر مشتریان" : "Testimonials"}
                </h4>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {testimonials.map((t) => (
                        <figure
                            key={`${t.name}-${t.quote}`}
                            dir={t.dir}
                            className={`rounded-2xl border border-foreground/10 bg-background/10 p-5 ${t.dir === "rtl" ? "text-right" : "text-left"}`}
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={t.avatarSrc}
                                    alt={t.name}
                                    width={44}
                                    height={44}
                                    className="h-11 w-11 rounded-full border border-foreground/10 object-cover"
                                />
                                <figcaption className="text-sm font-semibold text-foreground/90">
                                    {t.name}
                                </figcaption>
                            </div>

                            <blockquote className="text-sm leading-7 text-muted">{t.quote}</blockquote>
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    );
}
