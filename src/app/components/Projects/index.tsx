import Image from "next/image";
import type { Locale } from "@/app/i18n";

type Project = {
    title: { fa: string; en: string };
    description: { fa: string; en: string };
    service: { fa: string; en: string };
    imageSrc: string;
    imageAlt: { fa: string; en: string };
};

const PROJECTS: Project[] = [
    {
        title: { fa: "داشبورد مدیریتی", en: "Operations Dashboard" },
        description: {
            fa: "معماری اطلاعات و رابطی متمرکز برای تصمیم‌گیری سریع‌تر و مدیریت روان‌تر.",
            en: "Focused information architecture and interface design for faster decisions and smoother operations.",
        },
        service: { fa: "طراحی محصول · توسعه اختصاصی", en: "Product design · Custom development" },
        imageSrc: "/projects/1.png",
        imageAlt: { fa: "پیش‌نمایش پروژه مدیریت داشبورد", en: "Admin dashboard preview" },
    },
    {
        title: { fa: "پلتفرم سفر و رزرو", en: "Travel & Booking Platform" },
        description: {
            fa: "تجربه‌ای تصویری و ساده برای کشف مقصد، مقایسه و تکمیل رزرو.",
            en: "A visual, low-friction experience for discovery, comparison, and booking.",
        },
        service: { fa: "UI/UX · فرانت‌اند", en: "UI/UX · Front-end" },
        imageSrc: "/projects/2.jpg",
        imageAlt: { fa: "پیش‌نمایش پروژه Travel و Booking", en: "Travel & booking preview" },
    },
    {
        title: { fa: "مزون بانوان", en: "Women’s Salon" },
        description: {
            fa: "لندینگ برندمحور برای معرفی خدمات، نمایش نمونه‌ها و شروع ارتباط با مشتری.",
            en: "A brand-led landing experience for services, featured work, and customer enquiries.",
        },
        service: { fa: "هویت بصری · طراحی سایت", en: "Visual identity · Web design" },
        imageSrc: "/projects/3.jpg",
        imageAlt: { fa: "پیش‌نمایش پروژه مزون بانوان", en: "Women’s salon preview" },
    },
];

function ProjectTile({
    locale,
    project,
    className,
    priority,
}: {
    locale: Locale;
    project: Project;
    className: string;
    priority?: boolean;
}) {
    return (
        <article
            className={
                "group relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface/20 " +
                "transition-transform duration-300 motion-reduce:transition-none hover:-translate-y-1 " +
                "focus-within:ring-2 focus-within:ring-accent/60 focus-within:ring-offset-2 focus-within:ring-offset-background " +
                className
            }
        >
            <div className="absolute inset-0">
                <Image
                    src={project.imageSrc}
                    alt={locale === "fa" ? project.imageAlt.fa : project.imageAlt.en}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/90 via-background/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(34,211,238,0.10),transparent_70%)] opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

            <div className="relative flex h-full flex-col justify-end p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    {locale === "fa" ? project.service.fa : project.service.en}
                </p>
                <h3 className="text-base font-semibold text-foreground">
                    {locale === "fa" ? project.title.fa : project.title.en}
                </h3>
                <p className="mt-1 text-sm text-muted">
                    {locale === "fa" ? project.description.fa : project.description.en}
                </p>
            </div>
        </article>
    );
}

export default function Projects({ locale }: { locale: Locale }) {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <ProjectTile
                    locale={locale}
                    project={PROJECTS[0]}
                    className="md:col-span-7 md:row-span-2 min-h-80 md:min-h-105"
                    priority
                />

                <ProjectTile
                    locale={locale}
                    project={PROJECTS[1]}
                    className="md:col-span-5 min-h-60"
                />

                <ProjectTile
                    locale={locale}
                    project={PROJECTS[2]}
                    className="md:col-span-5 min-h-60"
                />
            </div>
        </div>
    );
}
