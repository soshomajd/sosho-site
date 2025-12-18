import Image from "next/image";
import type { Locale } from "@/app/i18n";

type Project = {
    title: { fa: string; en: string };
    description: { fa: string; en: string };
    imageSrc: string;
    imageAlt: { fa: string; en: string };
};

const PROJECTS: Project[] = [
    {
        title: { fa: "مدیریت داشبورد", en: "Admin Dashboard" },
        description: {
            fa: "داشبورد مدیریتی با طراحی مدرن و تجربه کاربری روان.",
            en: "An admin dashboard with a modern UI and smooth UX.",
        },
        imageSrc: "/projects/1.png",
        imageAlt: { fa: "پیش‌نمایش پروژه مدیریت داشبورد", en: "Admin dashboard preview" },
    },
    {
        title: { fa: "Travel و Booking Page", en: "Travel & Booking Page" },
        description: {
            fa: "صفحه‌ی سفر و رزرو با ساختار واضح و UI تمیز.",
            en: "A travel and booking page with clear layout and clean UI.",
        },
        imageSrc: "/projects/2.jpg",
        imageAlt: { fa: "پیش‌نمایش پروژه Travel و Booking", en: "Travel & booking preview" },
    },
    {
        title: { fa: "مزون بانوان", en: "Women’s Salon" },
        description: {
            fa: "لندینگ حرفه‌ای برای معرفی خدمات و نمونه‌کارها.",
            en: "A professional landing page for services and portfolio.",
        },
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

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(34,211,238,0.10),transparent_70%)] opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100" />

            <div className="relative flex h-full flex-col justify-end p-5">
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
