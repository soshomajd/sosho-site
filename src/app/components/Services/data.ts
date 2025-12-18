import type { Locale } from "@/app/i18n";
import type { IconType } from "react-icons";
import {
  FiFigma,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";
import { SiEthereum } from "react-icons/si";

export type ServiceSlug =
  | "ui-ux"
  | "frontend"
  | "backend"
  | "website-0-100"
  | "crypto-payment-gateway"
  | "smart-contract-blockchain";

export type Service = {
  slug: ServiceSlug;
  title: { fa: string; en: string };
  short: { fa: string; en: string };
  Icon: IconType;
  seo: {
    title: { fa: string; en: string };
    description: { fa: string; en: string };
  };
  detail: {
    intro: { fa: string; en: string };
    whatYouGetTitle: { fa: string; en: string };
    whatYouGet: { fa: string[]; en: string[] };
    processTitle: { fa: string; en: string };
    process: { fa: string[]; en: string[] };
    deliverablesTitle: { fa: string; en: string };
    deliverables: { fa: string[]; en: string[] };
  };
};

export const SERVICE_BULLET_ICON: IconType = FiCheck;

export const SERVICES: Service[] = [
  {
    slug: "ui-ux",
    title: { fa: "طراحی UI/UX", en: "UI/UX Design" },
    short: {
      fa: "وایرفریم، UI Kit و تجربه کاربری دقیق.",
      en: "Wireframes, UI kit, and thoughtful UX.",
    },
    Icon: FiFigma,
    seo: {
      title: { fa: "طراحی UI/UX", en: "UI/UX Design" },
      description: {
        fa: "طراحی تجربه کاربری و رابط کاربری: وایرفریم، طراحی UI و سیستم طراحی.",
        en: "UI/UX design: wireframes, UI design, and design systems.",
      },
    },
    detail: {
      intro: {
        fa: "اگر می‌خوای محصولت حرفه‌ای، قابل استفاده و قابل توسعه باشه، طراحی UI/UX نقطه شروعه. این سرویس از تحقیق و ساختار تا طراحی نهایی رو پوشش می‌ده.",
        en: "If you want a product that feels professional, usable, and scalable, UI/UX is the foundation. This service covers everything from structure to final design.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "وایرفریم و ساختار صفحات (User Flow)",
          "طراحی UI با تم و کامپوننت‌های یکپارچه",
          "بهینه‌سازی تجربه کاربری (UX) و دسترسی‌پذیری",
          "پروتوتایپ برای تست مسیرها و تعاملات",
        ],
        en: [
          "Wireframes and user flows",
          "Consistent UI with reusable components",
          "UX improvements and accessibility considerations",
          "Prototype for validating interactions",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "نیازسنجی و بررسی هدف محصول",
          "طراحی جریان‌ها و وایرفریم",
          "طراحی UI و اجزای سیستم طراحی",
          "بازبینی و بهینه‌سازی براساس فیدبک",
        ],
        en: [
          "Requirements and product goals",
          "Flows and wireframes",
          "UI design and design system components",
          "Review iterations based on feedback",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: [
          "فایل طراحی (Figma)",
          "کامپوننت‌ها و استایل‌ها",
          "پروتوتایپ قابل کلیک",
        ],
        en: ["Figma file", "Components & styles", "Clickable prototype"],
      },
    },
  },
  {
    slug: "frontend",
    title: { fa: "فرانت‌اند", en: "Front-End" },
    short: {
      fa: "پیاده‌سازی UI سریع، ریسپانسیو و تمیز.",
      en: "Fast, responsive, clean UI implementation.",
    },
    Icon: FiCode,
    seo: {
      title: { fa: "توسعه فرانت‌اند", en: "Front-End Development" },
      description: {
        fa: "پیاده‌سازی رابط کاربری با استانداردهای مدرن، ریسپانسیو و بهینه.",
        en: "Modern front-end implementation: responsive, accessible, optimized.",
      },
    },
    detail: {
      intro: {
        fa: "فرانت‌اند یعنی تبدیل طراحی به یک تجربه سریع و دقیق. تمرکز من روی کیفیت UI، ریسپانسیو بودن، و جزئیات تعاملاته.",
        en: "Front-end is turning design into a fast, accurate experience. My focus is UI quality, responsiveness, and interaction details.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "پیاده‌سازی پیکسل‌پرفکت براساس طراحی",
          "ریسپانسیو برای موبایل/تبلت/دسکتاپ",
          "استانداردهای دسترسی‌پذیری (A11y)",
          "بهینه‌سازی عملکرد (Performance)",
        ],
        en: [
          "Pixel-perfect implementation",
          "Responsive layout across devices",
          "Accessibility best practices",
          "Performance optimization",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "بررسی طراحی و مشخص‌کردن کامپوننت‌ها",
          "پیاده‌سازی صفحات و کامپوننت‌ها",
          "بهینه‌سازی و تست در اندازه‌های مختلف",
          "تحویل و پشتیبانی برای اصلاحات نهایی",
        ],
        en: [
          "Break down design into components",
          "Build pages and components",
          "Optimize and test across sizes",
          "Delivery and final polish",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: [
          "کد تمیز و قابل توسعه",
          "کامپوننت‌های قابل استفاده مجدد",
          "سئو و پرفورمنس بهتر",
        ],
        en: [
          "Clean, scalable code",
          "Reusable components",
          "Better SEO/performance",
        ],
      },
    },
  },
  {
    slug: "backend",
    title: { fa: "بک‌اند", en: "Back-End" },
    short: {
      fa: "API، دیتابیس و منطق سمت سرور.",
      en: "APIs, database, and server-side logic.",
    },
    Icon: FiDatabase,
    seo: {
      title: { fa: "توسعه بک‌اند", en: "Back-End Development" },
      description: {
        fa: "طراحی و پیاده‌سازی API، دیتابیس و منطق امن و مقیاس‌پذیر.",
        en: "Build secure, scalable APIs and backend systems.",
      },
    },
    detail: {
      intro: {
        fa: "بک‌اند ستون اصلی اپلیکیشنه: مدیریت داده، احراز هویت، و منطق تجاری. هدف این سرویس ساخت یک هسته قابل اعتماد و قابل توسعه است.",
        en: "Back-end is the backbone: data, auth, and business logic. This service focuses on building a reliable, scalable core.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "طراحی API استاندارد و قابل توسعه",
          "مدل‌سازی دیتابیس و روابط",
          "احراز هویت/سطوح دسترسی",
          "لاگ، خطاگیری و مانیتورینگ پایه",
        ],
        en: [
          "Scalable API design",
          "Database modeling",
          "Authentication and roles",
          "Logging and basic monitoring",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "تحلیل نیازمندی‌ها و دیتامدل",
          "پیاده‌سازی API و تست",
          "اتصال به فرانت‌اند و تست یکپارچه",
          "بهینه‌سازی و آماده‌سازی برای استقرار",
        ],
        en: [
          "Requirements and data modeling",
          "API implementation and tests",
          "Integration with front-end",
          "Optimization and deployment readiness",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: ["API مستند", "دیتابیس ساخت‌یافته", "ساختار امن و قابل توسعه"],
        en: [
          "Documented API",
          "Structured database",
          "Secure scalable foundation",
        ],
      },
    },
  },
  {
    slug: "website-0-100",
    title: { fa: "طراحی سایت ۰ تا ۱۰۰", en: "Website 0→100" },
    short: {
      fa: "از ایده تا اجرا و استقرار.",
      en: "From idea to launch and deployment.",
    },
    Icon: FiGlobe,
    seo: {
      title: { fa: "طراحی سایت ۰ تا ۱۰۰", en: "Website From 0 to 100" },
      description: {
        fa: "طراحی کامل سایت: UI/UX، فرانت‌اند، بک‌اند، استقرار و بهینه‌سازی.",
        en: "End-to-end website: design, front-end, back-end, deployment, optimization.",
      },
    },
    detail: {
      intro: {
        fa: "اگر می‌خوای صفر تا صد سایتت رو یکجا بسازی، این سرویس دقیقاً برای همینه: طراحی، توسعه، اتصال دیتابیس، و آماده‌سازی برای لانچ.",
        en: "If you want an end-to-end website build, this is it: design, development, data, and launch readiness.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "طراحی UI/UX اختصاصی",
          "پیاده‌سازی فرانت‌اند",
          "بک‌اند و دیتابیس (در صورت نیاز)",
          "استقرار (Deployment) و تنظیمات دامنه",
        ],
        en: [
          "Custom UI/UX design",
          "Front-end implementation",
          "Back-end & database (if needed)",
          "Deployment and domain setup",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "جلسه نیازسنجی و تعیین scope",
          "طراحی و تایید اولیه",
          "توسعه و تست",
          "لانچ و پشتیبانی اولیه",
        ],
        en: [
          "Scope and requirements",
          "Design and approval",
          "Development and testing",
          "Launch and initial support",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: ["سایت آماده لانچ", "سورس کد", "مستندات پایه و راه‌اندازی"],
        en: ["Launch-ready website", "Source code", "Basic docs and setup"],
      },
    },
  },
  {
    slug: "crypto-payment-gateway",
    title: { fa: "درگاه پرداخت ارز دیجیتال", en: "Crypto Payment Gateway" },
    short: {
      fa: "اتصال پرداخت و گردش مالی کریپتویی.",
      en: "Crypto payment integrations and flows.",
    },
    Icon: FiCreditCard,
    seo: {
      title: { fa: "درگاه پرداخت ارز دیجیتال", en: "Crypto Payment Gateway" },
      description: {
        fa: "پیاده‌سازی جریان پرداخت کریپتویی، ساختار سفارش و تایید تراکنش.",
        en: "Crypto payment flow: orders, confirmations, and settlement structure.",
      },
    },
    detail: {
      intro: {
        fa: "این سرویس برای پروژه‌هایی‌ست که پرداخت با ارز دیجیتال می‌خوان: از ساخت سفارش تا تایید پرداخت و ثبت وضعیت تراکنش.",
        en: "For products that need crypto payments: from order creation to confirmation and transaction status tracking.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "ساختار سفارش و فاکتور",
          "ثبت و پیگیری وضعیت تراکنش",
          "وبهوک/پولینگ برای تایید پرداخت",
          "پنل ساده برای مدیریت پرداخت‌ها",
        ],
        en: [
          "Order and invoice structure",
          "Transaction status tracking",
          "Webhook/polling confirmation flow",
          "Simple admin view for payments",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "تعریف سناریوی پرداخت و وضعیت‌ها",
          "پیاده‌سازی API و ذخیره‌سازی",
          "اتصال به فرانت‌اند و تست سناریوها",
          "افزودن لاگ و خطاگیری",
        ],
        en: [
          "Define payment states and scenarios",
          "Implement APIs and persistence",
          "Integrate with UI and test scenarios",
          "Add logging and error handling",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: ["جریان پرداخت قابل استفاده", "API و دیتامدل", "پنل مدیریت ساده"],
        en: [
          "Usable payment flow",
          "APIs and data model",
          "Simple admin panel",
        ],
      },
    },
  },
  {
    slug: "smart-contract-blockchain",
    title: {
      fa: "اسمارت کانترکت و بلاک‌چین",
      en: "Smart Contracts & Blockchain",
    },
    short: {
      fa: "قرارداد هوشمند و راهکارهای بلاک‌چینی.",
      en: "Smart contracts and blockchain solutions.",
    },
    Icon: SiEthereum,
    seo: {
      title: {
        fa: "اسمارت کانترکت و بلاک‌چین",
        en: "Smart Contracts & Blockchain",
      },
      description: {
        fa: "طراحی و توسعه قرارداد هوشمند و اتصال به اپلیکیشن.",
        en: "Smart contract development and app integration.",
      },
    },
    detail: {
      intro: {
        fa: "برای پروژه‌های Web3، هدف ساخت یک قرارداد قابل اعتماد و سپس اتصال آن به اپلیکیشن است.",
        en: "For Web3 projects, the goal is a reliable contract and a solid app integration.",
      },
      whatYouGetTitle: { fa: "چی دریافت می‌کنی؟", en: "What you get" },
      whatYouGet: {
        fa: [
          "طراحی ساختار قرارداد و رویدادها",
          "پیاده‌سازی و نسخه‌بندی قرارداد",
          "اتصال به فرانت‌اند (Wallet / Web3)",
          "تست سناریوهای اصلی",
        ],
        en: [
          "Contract structure and events",
          "Implementation and versioning",
          "Front-end integration (wallet/Web3)",
          "Testing core scenarios",
        ],
      },
      processTitle: { fa: "فرآیند انجام کار", en: "Process" },
      process: {
        fa: [
          "تعریف نیازمندی و سناریوها",
          "طراحی قرارداد و پیاده‌سازی",
          "تست سناریوهای کلیدی",
          "اتصال به اپلیکیشن و تحویل",
        ],
        en: [
          "Define requirements and scenarios",
          "Design and implement contract",
          "Test key scenarios",
          "Integrate with app and deliver",
        ],
      },
      deliverablesTitle: { fa: "خروجی‌ها", en: "Deliverables" },
      deliverables: {
        fa: ["سورس قرارداد", "راهنمای استفاده", "نمونه اتصال به اپ"],
        en: ["Contract source", "Usage notes", "App integration sample"],
      },
    },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getServiceHref(locale: Locale, slug: ServiceSlug) {
  return `/${locale}/services/${slug}`;
}
