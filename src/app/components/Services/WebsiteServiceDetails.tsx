import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/app/i18n";
import { getProjectHref, projectsForService } from "@/app/components/Projects/data";
import { getToolHref } from "@/app/components/Tools/data";
import type { ServiceSlug } from "./data";

export const WEBSITE_SERVICE_DETAILS: Partial<Record<ServiceSlug, {
  costFactors: { fa: string[]; en: string[] };
  preparation: { fa: string[]; en: string[] };
}>> = {
  "corporate-website-design": {
    costFactors: {
      fa: ["تنوع قالب‌های صفحه و عمق معرفی هر خدمت", "آمادگی متن، تصاویر و نمونه‌کارهای قابل انتشار", "زبان‌ها و مسئول تهیه و تأیید ترجمه", "مدیریت محتوا، فرم‌ها و اتصال به سیستم‌های موجود"],
      en: ["Page-template variety and service-content depth", "Readiness of copy, imagery and publishable project examples", "Languages and responsibility for translation and approval", "Editing tools, forms and integrations with existing systems"],
    },
    preparation: {
      fa: ["خدمات اصلی و نوع مشتری هرکدام", "نمونه‌کارها و مدارکی که مجاز به انتشارند", "متن و تصویر موجود و بخش‌هایی که باید تهیه شوند", "اطلاعات تماس و مسئول پاسخ به درخواست‌ها"],
      en: ["Core services and the customer for each", "Project examples and material authorised for publication", "Available copy and imagery, and missing items", "Contact information and the person who handles enquiries"],
    },
  },
  "ecommerce-website-design": {
    costFactors: {
      fa: ["ساختار کالا، ویژگی‌ها، تنوع‌ها و وضعیت دادهٔ محصول", "جست‌وجو، فیلتر و تفاوت قالب‌های صفحهٔ محصول", "روش‌های پرداخت و ارسال و گردش‌کار مدیریت سفارش", "اتصال به انبار، حسابداری یا سرویس‌های دیگر پس از بررسی"],
      en: ["Product structure, attributes, variants and data readiness", "Search, filters and variations in product-page templates", "Payment and delivery options and order-management workflows", "Inventory, accounting or other integrations after assessment"],
    },
    preparation: {
      fa: ["نمونهٔ کالا با عکس، مشخصات و دسته‌بندی", "قواعد قیمت، موجودی و تنوع محصول", "شرایط ارسال، مرجوعی و مسئول اجرای سفارش", "سرویس‌های فعلی و اتصال‌های ضروری نسخهٔ اول"],
      en: ["Sample products with images, specifications and categories", "Pricing, availability and variant rules", "Delivery and returns terms, and an order-fulfilment owner", "Existing services and essential first-release integrations"],
    },
  },
};

export default function WebsiteServiceDetails({ locale, slug }: { locale: Locale; slug: ServiceSlug }) {
  const details = WEBSITE_SERVICE_DETAILS[slug];
  if (!details) return null;
  const isFa = locale === "fa";
  const projects = projectsForService(slug);
  return (
    <>
      <section aria-labelledby="website-projects-title">
        <h2 id="website-projects-title" className="text-2xl font-bold text-foreground">
          {isFa ? "نمونه‌کار واقعی مرتبط با این خدمت" : "Real work relevant to this service"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-muted">
          {isFa ? "مسیر انتخاب و قابلیت‌های هر پروژه را در صفحهٔ خودش ببینید. امکانات پروژهٔ شما بر اساس نیاز و محدودهٔ توافق‌شده تعیین می‌شوند." : "Explore each project’s selection journey and features. Your own features are defined by requirements and the agreed scope."}
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={getProjectHref(locale, project.slug)} prefetch={false} className="group overflow-hidden rounded-3xl border border-foreground/10 bg-surface/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
              <Image src={project.images[0].src} alt={project.images[0].alt[locale]} width={project.images[0].width} height={project.images[0].height} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full" />
              <div className="p-6">
                <p className="text-xs font-bold text-accent">{project.service[locale]}</p>
                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-accent">{project.title[locale]}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{project.summary[locale]}</p>
                <span className="mt-4 inline-block text-sm font-bold text-primary">{isFa ? "بررسی ساختار و مسیر کاربر" : "Explore the structure and user journey"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="website-cost-title" className="rounded-3xl border border-accent/20 bg-surface/20 p-6 sm:p-8">
          <h2 id="website-cost-title" className="text-xl font-bold text-foreground">{isFa ? "هزینهٔ طراحی این سایت چگونه مشخص می‌شود؟" : "How is this website estimated?"}</h2>
          <p className="mt-3 text-sm leading-8 text-muted">{isFa ? "پیش از اعلام هزینه، محدودهٔ کار را با این موارد روشن می‌کنیم. برآورد هوشمند می‌تواند نقطهٔ شروع باشد؛ مبلغ و زمان اجرای نهایی پس از بررسی نیازها مشخص می‌شوند." : "These factors define the scope before a quote. The project estimate can start the discussion; final cost and timing follow a review of the requirements."}</p>
          <ul className="mt-4 list-disc space-y-3 ps-5 text-sm leading-7 text-muted">{details.costFactors[locale].map((item) => <li key={item}>{item}</li>)}</ul>
          <Link href={getToolHref(locale, "website-cost-estimate")} prefetch={false} className="mt-5 inline-block text-sm font-bold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">{isFa ? "برآورد هزینه طراحی سایت" : "Website cost estimate"}</Link>
        </section>
        <section aria-labelledby="website-brief-title" className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8">
          <h2 id="website-brief-title" className="text-xl font-bold text-foreground">{isFa ? "برای شروع چه چیزی آماده کنید؟" : "What should you prepare?"}</h2>
          <p className="mt-3 text-sm leading-8 text-muted">{isFa ? "اگر بخشی از اطلاعات آماده نیست، وضعیت آن را مشخص کنید تا تهیهٔ محتوا یا ورود داده در محدودهٔ پروژه دیده شود." : "If an item is missing, identify it so content preparation or data entry can be included in the scope."}</p>
          <ul className="mt-4 list-disc space-y-3 ps-5 text-sm leading-7 text-muted">{details.preparation[locale].map((item) => <li key={item}>{item}</li>)}</ul>
          <Link href={`/${locale}/blogs/website-content-preparation-checklist`} className="mt-5 inline-block text-sm font-bold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">{isFa ? "چک‌لیست آماده‌سازی متن و عکس سایت" : "Website copy and image preparation checklist"}</Link>
        </section>
      </div>
    </>
  );
}
