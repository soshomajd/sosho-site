import { PROJECT_HERO_VIEWS } from "./hero-views";

import type { Project, ProjectImage } from "./data";

/** Original design concepts, with no delivered-client claims or external links. */
export type ConceptProject = Pick<Project, "slug" | "title" | "summary" | "service"> & {
  language: "fa" | "en";
  features: { fa: string[]; en: string[] };
  images: [ProjectImage, ProjectImage, ProjectImage];
};

export const CONCEPT_PROJECTS: ConceptProject[] = [
  {
    "slug": "sepid-medical",
    "language": "fa",
    "title": {
      "fa": "سپید؛ هویت دیجیتال کلینیک",
      "en": "Sepid · Medical brand"
    },
    "service": {
      "fa": "برندینگ پزشکی · طراحی سایت",
      "en": "Medical branding · Website design"
    },
    "summary": {
      "fa": "کانسپت یک تجربه پزشکی تعاملی با قلب شیشه‌ای سه‌بعدی، رد نور و شاخص‌های ظریف خدمات؛ ترکیب هویت دیجیتال پزشکی با تایپوگرافی درشت و مسیر نوبت‌گیری.",
      "en": "An immersive medical-brand concept with a glass 3D heart, flowing light traces, precise service indicators and a clear appointment entry."
    },
    "features": {
      "fa": [
        "معرفی پزشک",
        "خدمات کلینیک",
        "رزرو نوبت"
      ],
      "en": [
        "Doctor profile",
        "Clinic services",
        "Appointment flow"
      ]
    },
    "images": PROJECT_HERO_VIEWS["sepid-medical"]
  },
  {
    "slug": "nova-beauty",
    "language": "fa",
    "title": {
      "fa": "نُوا؛ فروشگاه زیبایی و مراقبت",
      "en": "Nova · Beauty and skincare"
    },
    "service": {
      "fa": "فروشگاه آرایشی · طراحی تجربه خرید",
      "en": "Beauty commerce · Shopping experience"
    },
    "summary": {
      "fa": "طرح فروشگاه زیبایی با محصولات معلق، روبان کروم مایع و تایپوگرافی جسورانه؛ ویترینی نمایشی برای کشف محصولات در یک ترکیب مجله‌ای و نامتقارن.",
      "en": "An expressive beauty-commerce concept with floating products, a liquid-chrome ribbon and oversized typography in an asymmetric editorial storefront."
    },
    "features": {
      "fa": [
        "ویترین محصول",
        "دسته‌بندی مراقبت",
        "کارت خرید"
      ],
      "en": [
        "Product showcase",
        "Skincare categories",
        "Shopping cards"
      ]
    },
    "images": PROJECT_HERO_VIEWS["nova-beauty"]
  },
  {
    "slug": "didar-admin",
    "language": "fa",
    "title": {
      "fa": "دیدار؛ پنل مدیریت فروشگاه",
      "en": "Didar · Commerce admin"
    },
    "service": {
      "fa": "پنل مدیریت · طراحی رابط کاربری",
      "en": "Admin panel · Interface design"
    },
    "summary": {
      "fa": "کانسپت مرکز کنترل فروش با مسیریابی بصری سفارش‌ها، نقشه موجودی و جدول عملیات؛ محیطی تیره و چندلایه برای نمایش یک محصول مدیریتی پیشرفته.",
      "en": "A commerce command-center concept combining visual order routing, inventory heatmaps and operations tables in a detailed dark workspace."
    },
    "features": {
      "fa": [
        "مدیریت سفارش",
        "نمای موجودی",
        "نمودار فروش"
      ],
      "en": [
        "Order management",
        "Inventory overview",
        "Sales chart"
      ]
    },
    "images": PROJECT_HERO_VIEWS["didar-admin"]
  },
  {
    "slug": "taraz-finance",
    "language": "fa",
    "title": {
      "fa": "تراز؛ داشبورد مالی کسب‌وکار",
      "en": "Taraz · Business finance"
    },
    "service": {
      "fa": "داشبورد مالی · طراحی محصول",
      "en": "Finance dashboard · Product design"
    },
    "summary": {
      "fa": "طرح داشبورد مالی با جریان نقدی سه‌بعدی، نمودار آبشاری و دفتر تراکنش‌ها؛ یک شبکه نامتقارن روشن با ناوبری افقی و تاکیدهای گرافیکی جسورانه.",
      "en": "A finance workspace concept featuring dimensional cash-flow ribbons, waterfall charts and a transaction ledger in an asymmetric light grid."
    },
    "features": {
      "fa": [
        "جریان نقدی",
        "دسته‌بندی هزینه",
        "فهرست تراکنش"
      ],
      "en": [
        "Cash flow",
        "Expense categories",
        "Transaction list"
      ]
    },
    "images": PROJECT_HERO_VIEWS["taraz-finance"]
  },
  {
    "slug": "ark-architecture",
    "language": "fa",
    "title": {
      "fa": "آرک؛ استودیو معماری",
      "en": "Ark · Architecture studio"
    },
    "service": {
      "fa": "هویت برند · سایت معماری",
      "en": "Brand identity · Architecture website"
    },
    "summary": {
      "fa": "کانسپت سایت معماری با تصویر سینمایی بنا، تایپوگرافی لایه‌ای و قاب‌های برش‌خورده پروژه؛ هویتی جسورانه با الهام از گرافیک بروتالیست.",
      "en": "An architectural website concept using cinematic building imagery, layered typography and masked project strips with a bold brutalist identity."
    },
    "features": {
      "fa": [
        "هویت بصری",
        "گالری آثار",
        "معرفی استودیو"
      ],
      "en": [
        "Visual identity",
        "Project gallery",
        "Studio story"
      ]
    },
    "images": PROJECT_HERO_VIEWS["ark-architecture"]
  },
  {
    "slug": "narvan-dining",
    "language": "fa",
    "title": {
      "fa": "نارون؛ تجربه رستوران ایرانی",
      "en": "Narvan · Persian dining"
    },
    "service": {
      "fa": "رستوران · طراحی سایت و منو",
      "en": "Restaurant · Website and menu"
    },
    "summary": {
      "fa": "طرح تجربه دیجیتال رستوران ایرانی با عکاسی نمایشی غذا، ترکیب مداری مواد اولیه و پنل عمودی منو؛ فضایی گرم و سینمایی برای کشف منو و رزرو میز.",
      "en": "A Persian dining concept with dramatic food imagery, orbital ingredient composition and a vertical menu panel in a warm cinematic layout."
    },
    "features": {
      "fa": [
        "منوی غذا",
        "معرفی فضا",
        "رزرو میز"
      ],
      "en": [
        "Food menu",
        "Restaurant story",
        "Table booking"
      ]
    },
    "images": PROJECT_HERO_VIEWS["narvan-dining"]
  },
  {
    "slug": "orbit-dex",
    "language": "en",
    "title": {
      "fa": "OrbitDEX؛ رابط صرافی غیرمتمرکز",
      "en": "OrbitDEX · Decentralized exchange"
    },
    "service": {
      "fa": "DEX · طراحی محصول Web3",
      "en": "DEX · Web3 product design"
    },
    "summary": {
      "fa": "کانسپت یک ترمینال DEX با نمودار معاملاتی، عمق بازار و فرم تبادل توکن؛ جریان داده و المان نقدینگی هولوگرافیک، ساختار فشرده محصول را شکل می‌دهند.",
      "en": "A DEX terminal concept with trading charts, market depth and token swapping, structured around a holographic liquidity visualization and data stream."
    },
    "features": {
      "fa": [
        "تبادل توکن",
        "انتخاب شبکه",
        "نمای بازار"
      ],
      "en": [
        "Token swapping",
        "Network selector",
        "Market overview"
      ]
    },
    "images": PROJECT_HERO_VIEWS["orbit-dex"]
  },
  {
    "slug": "vaulta-web3",
    "language": "en",
    "title": {
      "fa": "Vaulta؛ کیف پول و هویت Web3",
      "en": "Vaulta · Web3 wallet"
    },
    "service": {
      "fa": "Web3 · طراحی تجربه کیف پول",
      "en": "Web3 · Wallet experience design"
    },
    "summary": {
      "fa": "طرح کیف پول Web3 با حلقه کرومی، کارت شفاف و ترکیب بنتوی نامتقارن؛ اتصال گرافیک ادیتوریال به نمای دارایی‌ها و شبکه‌ها.",
      "en": "A Web3 wallet concept pairing a chrome vault ring and translucent asset card with asymmetric bento composition and editorial typography."
    },
    "features": {
      "fa": [
        "مدیریت دارایی",
        "نمای چندشبکه‌ای",
        "پیش‌نمایش کیف پول"
      ],
      "en": [
        "Asset management",
        "Multi-network view",
        "Wallet preview"
      ]
    },
    "images": PROJECT_HERO_VIEWS["vaulta-web3"]
  },
  {
    "slug": "metricflow-analytics",
    "language": "en",
    "title": {
      "fa": "MetricFlow؛ محصول تحلیل داده",
      "en": "MetricFlow · Analytics platform"
    },
    "service": {
      "fa": "SaaS · داشبورد و تحلیل داده",
      "en": "SaaS · Dashboard and analytics"
    },
    "summary": {
      "fa": "کانسپت پلتفرم تحلیل داده با تایپوگرافی جنبشی و روبان سه‌بعدی داده که به داشبورد می‌رسد؛ ترکیب آبی جسورانه و ابزارهای تحلیلی روشن.",
      "en": "An analytics platform concept with kinetic typography and a dimensional data ribbon flowing into a precise light dashboard on a bold cobalt canvas."
    },
    "features": {
      "fa": [
        "داشبورد تحلیلی",
        "قیف تبدیل",
        "گزارش مقایسه‌ای"
      ],
      "en": [
        "Analytics dashboard",
        "Conversion funnel",
        "Comparison reports"
      ]
    },
    "images": PROJECT_HERO_VIEWS["metricflow-analytics"]
  },
  {
    "slug": "nomad-travel",
    "language": "en",
    "title": {
      "fa": "Nomad House؛ سفر و اقامت",
      "en": "Nomad House · Travel and stays"
    },
    "service": {
      "fa": "گردشگری · طراحی سایت و رزرو",
      "en": "Travel · Website and booking"
    },
    "summary": {
      "fa": "طرح سایت سفر به سبک مجله تصویری با قاب‌های سینمایی مقصد، کلاژ نامتقارن و نوار رزرو؛ روایتی ماجراجویانه با عکس‌های متنوع و تایپوگرافی شاخص.",
      "en": "An editorial travel concept using cinematic destination panels, asymmetric photo collage and a slim booking rail with adventurous typography."
    },
    "features": {
      "fa": [
        "جست‌وجوی اقامت",
        "کارت مقصد",
        "عکاسی مقصد"
      ],
      "en": [
        "Stay search",
        "Destination cards",
        "Destination photography"
      ]
    },
    "images": PROJECT_HERO_VIEWS["nomad-travel"]
  }
];
