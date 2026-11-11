import { PROJECT_HERO_VIEWS } from "./hero-views";

import type { Project, ProjectImage } from "./data";

/** Original design concepts, with no delivered-client claims or external links. */
export type ConceptProject = Pick<Project, "slug" | "title" | "summary" | "service"> & {
  language: "fa" | "en";
  indexable?: boolean;
  updatedAt?: string;
  study?: {
    heading: { fa: string; en: string };
    paragraphs: { fa: string[]; en: string[] };
  }[];
  features: { fa: string[]; en: string[] };
  images: [ProjectImage, ProjectImage, ProjectImage];
};

/** Only complete written design studies opt into indexing; older image-only concepts stay noindex. */
export function isIndexableConcept(concept: ConceptProject) {
  return concept.indexable === true && Boolean(concept.updatedAt) && Boolean(concept.study?.length);
}

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
  },
  {
    "slug": "rava-logistics",
    "language": "fa",
    "title": {
      "fa": "راوا؛ لجستیک و رهگیری مرسوله",
      "en": "Rava · Freight and shipment tracking"
    },
    "service": {
      "fa": "طراحی سایت حمل‌ونقل · تجربهٔ رهگیری",
      "en": "Logistics website · Tracking experience"
    },
    "summary": {
      "fa": "طرح مفهومی یک سایت لجستیک با نقشهٔ مسیرهای حمل، تصاویر بندر و کانتینر و فرم رهگیری در مرکز توجه؛ طراحی نارنجی و جوهری با ساختار فارسی راست‌به‌چپ.",
      "en": "A Persian logistics website concept pairing a route map and port photography with a prominent shipment-tracking panel, in a sharp orange and ink identity."
    },
    "features": {
      "fa": [
        "نقشهٔ مسیرهای حمل",
        "ورود کد رهگیری",
        "تفکیک خدمات زمینی، دریایی و هوایی"
      ],
      "en": [
        "Freight route map",
        "Shipment-code entry",
        "Land, sea and air service navigation"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "رهگیری باید قبل از معرفی شرکت پیدا شود",
          "en": "Make tracking easy to find"
        },
        "paragraphs": {
          "fa": [
            "مخاطب این طرح دو نیاز متفاوت دارد: فرستنده‌ای که می‌خواهد وضعیت بارش را بداند و کسب‌وکاری که دنبال روش مناسب حمل است. فرم رهگیری کنار تیتر اصلی قرار گرفته تا کاربر برای وارد کردن کد، میان منوها نگردد. ریل خدمات هم مسیر جداگانه‌ای برای بررسی حمل زمینی، هوایی و دریایی پیشنهاد می‌کند.",
            "نقشه نقش معرفی محدودهٔ فعالیت را دارد و تصویر کانتینرها موضوع کار را سریع روشن می‌کند. مسیرها و برچسب‌های تصویر نمایشی‌اند؛ در یک پروژهٔ واقعی باید با شبکهٔ حمل، مقصدها و اطلاعات تأییدشدهٔ همان شرکت جایگزین شوند."
          ],
          "en": [
            "The concept serves two different intentions: a sender checking a shipment and a business comparing freight services. Tracking sits beside the headline rather than behind a menu. A separate service rail provides an entry into land, air and sea transport without making an existing customer repeat the sales journey.",
            "The map introduces the transport context while container photography makes the subject immediately recognisable. Its routes and labels are illustrative. An actual implementation would replace them with the operator’s verified destinations, coverage and service information."
          ]
        }
      },
      {
        "heading": {
          "fa": "نقشهٔ بزرگ، فرم خوانا در هر اندازه",
          "en": "A large map with a readable tracking panel"
        },
        "paragraphs": {
          "fa": [
            "سطح روشن فرم از نقشهٔ تیره جدا شده و نارنجی فقط برای نقاط مسیر و اقدام اصلی استفاده می‌شود. در تبلت، نقشه و رهگیری فضای متعادل‌تری می‌گیرند؛ در موبایل، تیتر و ورودی کد اولویت دارند و جزئیات نقشه نقش پس‌زمینه پیدا می‌کنند. این سه تصویر، ترکیب‌بندی‌های جداگانهٔ همین ایده‌اند.",
            "برای تبدیل طرح به محصول، اتصال به سامانهٔ مرسوله، پیام کد نامعتبر، حالت بارگذاری و محافظت از اطلاعات مشتری لازم است. حرکت پیشنهادی فقط یک رد کوتاه روی مسیر است؛ وضعیت بار باید با متن خوانا هم منتقل شود و به حرکت یا رنگ وابسته نباشد."
          ],
          "en": [
            "A light form surface separates the task from the dark map. Orange marks route points and the main action. Tablet gives the map and form more balanced space; mobile prioritises the heading and code input, with simplified geographic detail. The three views are separate compositions of the same design direction.",
            "Turning the concept into a product requires shipment-system integration, invalid-code feedback, loading states and customer-data protection. A proposed short route trace would be decorative. Shipment status must also be available as readable text, independent of motion or colour."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["rava-logistics"]
  },
  {
    "slug": "mehr-solar",
    "language": "fa",
    "title": {
      "fa": "مهر؛ انرژی خورشیدی و خدمات نصب",
      "en": "Mehr · Solar energy and installation"
    },
    "service": {
      "fa": "طراحی سایت انرژی · دریافت درخواست پروژه",
      "en": "Energy website · Project enquiries"
    },
    "summary": {
      "fa": "طرح مفهومی سایت انرژی خورشیدی با عکس تمام‌صفحهٔ پنل‌ها، تیتر زرد زاویه‌دار و ورودی کوتاه بررسی پروژه؛ ترکیبی صنعتی و روشن برای معرفی خدمات نصب.",
      "en": "A solar-energy website concept with full-bleed panel photography, an angular yellow headline and a compact project enquiry, built around an industrial visual identity."
    },
    "features": {
      "fa": [
        "معرفی راهکار خورشیدی",
        "انتخاب نوع و محل پروژه",
        "مسیر درخواست بررسی"
      ],
      "en": [
        "Solar-solution introduction",
        "Project type and location inputs",
        "Assessment enquiry entry"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "از تصویر پنل تا یک درخواست قابل بررسی",
          "en": "From panel photography to a useful enquiry"
        },
        "paragraphs": {
          "fa": [
            "برای مخاطبی که تازه نصب پنل خورشیدی را بررسی می‌کند، شروع با جدول‌های تخصصی می‌تواند گیج‌کننده باشد. این طرح ابتدا نوع خدمت را با تصویر محیط نصب و تیتر کوتاه توضیح می‌دهد، سپس فقط نوع پروژه و محل اجرا را می‌پرسد. اطلاعات فنی مفصل می‌تواند در مرحلهٔ بعد و با راهنمایی کارشناس جمع شود.",
            "در این ایده، فرم دعوت به بررسی است و وعدهٔ تولید برق یا بازگشت سرمایه نمی‌دهد. عددهای مصرف، ظرفیت، قیمت و شرایط اتصال باید پس از بررسی محل و با دادهٔ واقعی تعیین شوند؛ هیچ نتیجهٔ اقتصادی از روی تصویر قابل برداشت نیست."
          ],
          "en": [
            "A visitor exploring solar installation may not be ready for a technical specification table. This concept first establishes the service through installation photography and a short statement, then asks for project type and location. A specialist could collect more detailed site information in the next step.",
            "The enquiry requests an assessment rather than promising an energy output or financial return. Consumption, capacity, pricing and connection requirements need verified site-specific information. The concept image does not establish technical suitability or economic results."
          ]
        }
      },
      {
        "heading": {
          "fa": "هویت خورشیدی بدون شلوغی رابط",
          "en": "A solar identity without a crowded interface"
        },
        "paragraphs": {
          "fa": [
            "زرد پررنگ مثل یک تابلوی صنعتی روی عکس قرار گرفته و خطوط باریک قوس خورشید به جهت نور اشاره می‌کنند. فرم سفید از پس‌زمینهٔ پرجزئیات جداست تا ورودی‌ها راحت پیدا شوند. در نماهای باریک‌تر، تیتر چندخطی و فرم یک‌ستونه می‌شوند و پنل‌ها همچنان موضوع اصلی تصویر می‌مانند.",
            "در اجرای واقعی می‌توان قوس نور را با یک حرکت کوتاه ظاهر کرد، اما عکس و متن اصلی باید از ابتدا در HTML حاضر باشند. فشرده‌سازی تصویر، اندازهٔ مناسب برای موبایل و توقف حرکت در حالت کاهش انیمیشن، بخشی از مسیر اجرای پیشنهادی‌اند؛ این صفحه یک مطالعهٔ طراحی است و سامانهٔ نصب فعال نیست."
          ],
          "en": [
            "Saturated yellow acts like an industrial sign over the photograph, while thin sun arcs echo the direction of the light. A white enquiry area separates controls from the detailed landscape. Narrower compositions wrap the headline and stack the form while keeping the panels visually central.",
            "A short light-arc reveal could support the visual idea in a real build. The primary photograph and text should already be present in the page HTML. Responsive image delivery and reduced-motion handling belong in that implementation; this page documents a visual study rather than an operating installation service."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["mehr-solar"]
  },
  {
    "slug": "dena-motors",
    "language": "fa",
    "title": {
      "fa": "دنا؛ تجربهٔ دیجیتال خودرو",
      "en": "Dena · Automotive digital experience"
    },
    "service": {
      "fa": "طراحی سایت خودرو · تجربهٔ معرفی مدل",
      "en": "Automotive website · Model discovery"
    },
    "summary": {
      "fa": "طرح مفهومی نمایشگاه خودرو با نمای سینمایی یک کوپه، تایپوگرافی خطی بسیار بزرگ و انتخاب‌گر عمودی مدل؛ هویتی زرشکی، گرافیتی و نقره‌ای با تمرکز بر محصول.",
      "en": "An automotive showroom concept built around a cinematic coupe, oversized outline typography and a vertical model selector, using burgundy, graphite and silver."
    },
    "features": {
      "fa": [
        "معرفی تصویری مدل",
        "انتخاب‌گر خودرو",
        "مرور مشخصات اولیه"
      ],
      "en": [
        "Vehicle-led introduction",
        "Model selector",
        "Initial specification navigation"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "خودرو نقش اصلی صفحه را دارد",
          "en": "Give the vehicle the leading role"
        },
        "paragraphs": {
          "fa": [
            "این مطالعه برای معرفی مدل خودرو طراحی شده؛ جایی که فرم بدنه، نور و جزئیات محصول بخشی از تصمیم اولیهٔ بازدیدکننده‌اند. به‌جای چند کارت مشابه، یک خودرو بیشتر فضای هیرو را می‌گیرد. انتخاب‌گر عمودی در کنار آن نشان می‌دهد که می‌توان مدل‌های دیگر را بررسی کرد، بدون اینکه تصویر اصلی با دکمه‌های فراوان پوشانده شود.",
            "نورهای زرشکی تونل، خطوط تیتر و زاویهٔ خودرو یک جهت بصری مشترک می‌سازند. خودرو و نام تجاری این مجموعه نمایشی‌اند. این صفحه به سازندهٔ واقعی، موجودی فروشگاه یا مشخصات تأییدشدهٔ یک مدل اشاره نمی‌کند."
          ],
          "en": [
            "This study explores vehicle discovery, where body shape, lighting and product detail influence a visitor’s first impression. One car occupies most of the hero instead of competing with a grid of similar cards. A vertical selector suggests model browsing without covering the product in interface controls.",
            "Burgundy tunnel lights, outline lettering and the vehicle angle share a strong visual direction. The vehicle and brand belong to an illustrative concept. This page does not represent a manufacturer, dealer inventory or a verified specification sheet."
          ]
        }
      },
      {
        "heading": {
          "fa": "نمای محصول در موبایل هم باید کامل بماند",
          "en": "Keep product recognition on smaller screens"
        },
        "paragraphs": {
          "fa": [
            "در ترکیب دسکتاپ، تیتر پشت خودرو فضای زیادی دارد؛ در موبایل باید خوانایی عنوان و دیده‌شدن شکل اصلی بدنه حفظ شود. به همین دلیل چیدمان باریک، بازطراحی شده و صرفاً برش تصویر عریض نیست. مشخصات فرعی و انتخاب مدل، جای کمتری می‌گیرند تا اقدام اصلی به حاشیه نرود.",
            "در صورت ساخت سایت واقعی، جابه‌جایی مدل می‌تواند یک گذار کوتاه تصویر داشته باشد. قیمت، شرایط خرید، تصاویر هر تیپ و درخواست بازدید باید به دادهٔ معتبر متصل شوند. چرخش دائمی سه‌بعدی برای چنین هیرویی ضروری نیست؛ تصویر بهینه و انتخاب‌گر قابل استفاده با صفحه‌کلید، پایهٔ سبک‌تری برای شروع است."
          ],
          "en": [
            "The desktop composition gives the outline headline room behind the car. Mobile must preserve both a readable title and a recognisable body silhouette. The narrow view is therefore recomposed rather than cut from the wide image. Supporting specifications and model controls take less space so the main action remains clear.",
            "A real model selector could use a short image transition. Pricing, variants, photography and visit requests would require reliable product data. A continuously rotating 3D scene is unnecessary for this direction; optimised imagery and keyboard-operable selection offer a lighter starting point."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["dena-motors"]
  },
  {
    "slug": "luma-jewelry",
    "language": "fa",
    "title": {
      "fa": "لوما؛ فروشگاه زیورآلات",
      "en": "Luma · Fine jewellery storefront"
    },
    "service": {
      "fa": "طراحی فروشگاه زیورآلات · هویت محصول",
      "en": "Jewellery ecommerce · Product identity"
    },
    "summary": {
      "fa": "طرح مفهومی فروشگاه زیورآلات با عکس ماکرو از انگشتر و مروارید، قاب بیضی نامتقارن و نوار زاویه‌های محصول؛ تجربه‌ای گرم و مجله‌ای با فضای خالی حساب‌شده.",
      "en": "A jewellery storefront concept combining macro ring photography, an asymmetric oval and a vertical product-angle strip in a warm editorial composition."
    },
    "features": {
      "fa": [
        "گالری زاویه‌های محصول",
        "ورود به مجموعه‌ها",
        "ناوبری جست‌وجو و سبد خرید"
      ],
      "en": [
        "Product-angle gallery",
        "Collection discovery",
        "Search and bag navigation"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "جزئیات جنس، پیش از فهرست محصولات",
          "en": "Let material detail introduce the collection"
        },
        "paragraphs": {
          "fa": [
            "مخاطب یک فروشگاه زیورآلات می‌خواهد بافت، رنگ و ظرافت محصول را ببیند. در این جهت طراحی، یک عکس نزدیک از انگشتر با مروارید روی پارچهٔ روشن، نقش ویترین را دارد. نوار عکس‌های کناری، ایدهٔ دیدن زاویه‌های دیگر را معرفی می‌کند و تیتر کوتاه، فضا را برای خود محصول باز می‌گذارد.",
            "کادر بیضی و خطوط طلایی ظریف از زبان بصری مجله استفاده می‌کنند؛ هویت لوما به کارت‌های تخفیف و بنرهای متراکم وابسته نیست. شیء نمایش‌داده‌شده تصویر مفهومی است و ادعایی دربارهٔ جنس، عیار، قیمت یا موجودی محصول واقعی ندارد."
          ],
          "en": [
            "Jewellery shoppers need to inspect texture, colour and fine detail. Here a close photograph of a pearl ring on pale fabric serves as the storefront window. A side strip introduces alternate angles, while the short headline leaves room for the object itself.",
            "The oval aperture and fine gold rules borrow from magazine art direction rather than discount-led retail banners. The pictured object is concept artwork. It does not establish the material, purity, price or availability of a real product."
          ]
        }
      },
      {
        "heading": {
          "fa": "ویترین زیبا باید به خرید روشن برسد",
          "en": "Connect the editorial window to clear shopping"
        },
        "paragraphs": {
          "fa": [
            "در تبلت، عکس و معرفی محصول تعادل نزدیک‌تری دارند؛ در موبایل، انتخاب تصویر و ورود به مجموعه در مسیر عمودی قرار می‌گیرند. هدف این است که جزئیات انگشتر کوچک و نامفهوم نشود. هر سه نما، فقط هیرو را نشان می‌دهند و طراحی تمام مراحل خرید در این تصاویر ادعا نشده است.",
            "برای اجرای فروشگاه، عکس‌های واقعی، اندازه و وزن، راهنمای سایز، شرایط ارسال و مرجوعی باید کنار اطلاعات هر محصول قرار بگیرند. حرکت پیشنهادی یک محوشدن کوتاه بین زاویه‌هاست. تصویر جای متن مشخصات را نمی‌گیرد و کنترل گالری باید برای لمس، صفحه‌کلید و حالت کاهش حرکت هم قابل استفاده باشد."
          ],
          "en": [
            "Tablet balances product imagery and introduction more evenly. Mobile moves image selection and collection discovery into a vertical sequence, keeping the ring large enough to inspect. All three views cover the hero; they do not claim that a complete checkout journey has been designed or implemented.",
            "A working store would need real photography, dimensions, weight, sizing guidance, delivery details and return terms beside each product. A brief fade between angles could provide motion. Images must not replace written specifications, and gallery controls should support touch, keyboard use and reduced motion."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["luma-jewelry"]
  },
  {
    "slug": "mizan-legal",
    "language": "fa",
    "title": {
      "fa": "میزان؛ هویت و سایت خدمات حقوقی",
      "en": "Mizan · Legal-services identity"
    },
    "service": {
      "fa": "طراحی سایت حقوقی · هویت خدمات حرفه‌ای",
      "en": "Legal website · Professional-services identity"
    },
    "summary": {
      "fa": "طرح مفهومی سایت خدمات حقوقی با ستون‌بندی تحریریه‌ای، عکس معماری سنگی، فهرست موضوعات و فرم کوتاه طرح پرسش؛ هویتی آرام با سرمه‌ای، کاغذی و مسی.",
      "en": "A legal-services website concept using an editorial grid, stone architecture, a topic index and a short enquiry selector in navy, parchment and copper."
    },
    "features": {
      "fa": [
        "فهرست موضوعات حقوقی",
        "انتخاب موضوع مشاوره",
        "ورودی طرح پرسش"
      ],
      "en": [
        "Legal-topic index",
        "Consultation-topic selection",
        "Initial enquiry entry"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "اعتماد از وضوح شروع می‌شود",
          "en": "Begin with clear scope and language"
        },
        "paragraphs": {
          "fa": [
            "کاربر سایت حقوقی ممکن است نام تخصصی مسئله‌اش را نداند. فهرست عمودی میزان کمک می‌کند موضوعی مثل قرارداد یا امور کسب‌وکار را پیدا کند و سپس پرسش اولیه را مطرح کند. صفحه با ادعای پیروزی در پرونده شروع نمی‌شود؛ معرفی آرام خدمات و مسیر مشخص تماس، اساس این ایده است.",
            "عکس ستون‌های سنگی، خط‌کشی‌های ظریف و سطح کاغذی، حس یک نشریهٔ جدی را می‌سازند. رنگ مسی برای اقدام اصلی نگه داشته شده تا میان تیتر، فهرست و فرم رقابت زیادی ایجاد نشود. تصویر معماری نشانهٔ وابستگی به دادگاه یا نهاد رسمی نیست."
          ],
          "en": [
            "A visitor to a legal-services website may not know the formal name of their problem. Mizan’s vertical index helps them choose a subject such as contracts or business matters before raising an initial question. The concept focuses on understandable scope and a clear contact route rather than promises about case outcomes.",
            "Stone-column photography, fine ruling lines and a paper-like surface create a serious editorial identity. Copper is reserved for the main action to reduce competition between the headline, index and form. The architecture does not imply affiliation with a court or public institution."
          ]
        }
      },
      {
        "heading": {
          "fa": "فرم اولیه جای پروندهٔ محرمانه نیست",
          "en": "Separate the first enquiry from sensitive case material"
        },
        "paragraphs": {
          "fa": [
            "در نسخه‌های تبلت و موبایل، فهرست بلند به ناوبری جمع‌وجورتر تبدیل می‌شود و انتخاب موضوع در دسترس می‌ماند. برای یک محصول واقعی بهتر است فرم عمومی فقط اطلاعات لازم برای تماس را بگیرد؛ ارسال اسناد محرمانه باید مسیر امن و توضیح روشن دربارهٔ دسترسی و نگهداری داشته باشد.",
            "این طرح تصویری، مشاورهٔ حقوقی یا دفتر فعال نیست. پیش از اجرا، عنوان‌های مجاز، مشخصات ارائه‌دهنده، حوزهٔ خدمات و متن رضایت باید توسط صاحب کسب‌وکار تأیید شوند. حرکت مناسب این هویت، ظاهرشدن کوتاه ستون‌هاست؛ خواندن محتوا نباید به انیمیشن وابسته شود."
          ],
          "en": [
            "Tablet and mobile condense the long index while keeping topic selection accessible. In an actual service, a public first-contact form should ask only for what is necessary to arrange contact. Confidential documents need a separate secure process and clear explanations of access and retention.",
            "This visual study is neither legal advice nor an operating practice. Provider details, permitted titles, service scope and consent language would need owner verification before launch. A brief column reveal suits the identity, but reading the content should never depend on an animation completing."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["mizan-legal"]
  },
  {
    "slug": "roshan-learning",
    "language": "fa",
    "title": {
      "fa": "روشن؛ پلتفرم آموزش مهارت",
      "en": "Roshan · Skills learning platform"
    },
    "service": {
      "fa": "طراحی پلتفرم آموزشی · تجربهٔ انتخاب مسیر",
      "en": "Learning platform · Path discovery"
    },
    "summary": {
      "fa": "طرح مفهومی آموزش مهارت با تایپوگرافی پلکانی، کلاژ کاغذی ابزارهای یادگیری و کارت پیش‌نمایش دوره؛ ترکیبی پرانرژی از آبی، مرجانی و زرد.",
      "en": "A skills-learning concept with staircase typography, a tactile paper-cut collage and a course preview, using expressive cobalt, coral and yellow colour blocking."
    },
    "features": {
      "fa": [
        "انتخاب حوزهٔ یادگیری",
        "پیش‌نمایش دوره",
        "معرفی مسیر مهارتی"
      ],
      "en": [
        "Subject selection",
        "Course preview",
        "Learning-path introduction"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "اول مسیر، بعد فهرست بلند دوره‌ها",
          "en": "Start with a direction, then explore courses"
        },
        "paragraphs": {
          "fa": [
            "فهرست طولانی دوره‌ها برای کسی که تازه می‌خواهد مهارتی یاد بگیرد کافی نیست. روشن از انتخاب حوزه شروع می‌کند: برنامه‌نویسی، طراحی، داده یا موضوع دیگر. یک کارت نمونه نشان می‌دهد که داخل مسیر چه نوع محتوایی می‌تواند وجود داشته باشد، بدون اینکه صفحهٔ اول به جدول پیچیدهٔ درس‌ها تبدیل شود.",
            "دفتر، مداد و قطعه‌های کاغذی، یادگیری را به ساختن و تمرین پیوند می‌دهند. تیتر پلکانی هم ریتم پیشرفت را در ترکیب‌بندی نشان می‌دهد. نام دوره و نقاط پیشرفت در تصویر، دادهٔ نمونه‌اند و به دورهٔ فروخته‌شده یا نتیجهٔ آموزشی واقعی اشاره ندارند."
          ],
          "en": [
            "A long course catalogue is not enough for someone deciding what to learn. Roshan begins with a subject choice such as coding, design or data. A single preview suggests what a learning path might contain without turning the opening screen into a dense lesson table.",
            "Notebook, pencil and paper-cut coding pieces connect learning with making and practice. Staircase lettering gives the composition a sense of progression. Course names and progress marks are sample interface content, not evidence of a sold course or a learner’s actual achievement."
          ]
        }
      },
      {
        "heading": {
          "fa": "انرژی بصری با مسیر قابل خواندن",
          "en": "Keep an expressive layout easy to read"
        },
        "paragraphs": {
          "fa": [
            "آبی زمینهٔ یکپارچه می‌سازد و زرد و مرجانی به تیتر و اقدام اصلی ریتم می‌دهند. در موبایل، کلاژ از متن فاصله می‌گیرد تا حروف روی اشیای شلوغ قرار نگیرند. نوار موضوعات باید در اجرای نهایی کنترل واضحی برای انتخاب داشته باشد و فقط به کشیدن افقی با انگشت وابسته نباشد.",
            "برای ساخت پلتفرم، سطح دوره، پیش‌نیاز، نمونهٔ درس، مدت و شیوهٔ پشتیبانی باید به زبان ساده مشخص شوند. حرکت پیشنهادی یک ورود کوتاه قطعه‌های کاغذ است؛ پخش خودکار ویدئو یا حرکت دائمی برای انتقال این ایده لازم نیست. این مطالعه فقط جهت بصری و ورودی انتخاب مسیر را پوشش می‌دهد."
          ],
          "en": [
            "Cobalt provides a continuous canvas, with yellow and coral setting the rhythm of the title and action. Mobile separates the collage from the text so letters do not sit over busy objects. A production subject rail should provide explicit selection controls rather than depending entirely on horizontal swiping.",
            "A real platform would need understandable levels, prerequisites, sample lessons, duration and support details. A short paper-piece entrance could express the direction; autoplay video or continuous movement is unnecessary. This study covers the visual identity and path-discovery entry, not a functioning learning management system."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["roshan-learning"]
  },
  {
    "slug": "parto-automation",
    "language": "fa",
    "title": {
      "fa": "پرتو؛ اتوماسیون و تجهیزات صنعتی",
      "en": "Parto · Industrial automation"
    },
    "service": {
      "fa": "طراحی سایت صنعتی · کاتالوگ تجهیزات",
      "en": "Industrial website · Equipment catalogue"
    },
    "summary": {
      "fa": "طرح مفهومی اتوماسیون صنعتی با بازوی رباتیک، خطوط نقشه‌کشی فنی و فرم بررسی نیاز؛ ترکیب عکس ماشین با محیط روشن و ساختاری شبیه میز مهندسی.",
      "en": "An industrial-automation concept combining a robotic arm, fine CAD-style annotations and a technical enquiry in a bright engineering-workspace composition."
    },
    "features": {
      "fa": [
        "ناوبری کاتالوگ تجهیزات",
        "نمای فنی ماشین",
        "فرم شرح نیاز صنعتی"
      ],
      "en": [
        "Equipment catalogue navigation",
        "Machine-detail illustration",
        "Technical requirement enquiry"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "ظاهر فنی در خدمت پرسش خرید",
          "en": "Use technical detail to support an enquiry"
        },
        "paragraphs": {
          "fa": [
            "خریدار صنعتی معمولاً با یک نیاز مشخص وارد می‌شود؛ مثل اتوماسیون یک مرحله از خط تولید یا بررسی تجهیز مناسب. پرتو مسیر کاتالوگ و فرم شرح نیاز را در همان هیرو کنار هم می‌گذارد. تصویر ربات حوزهٔ کار را روشن می‌کند و ستون دسته‌بندی، راه ورود به تجهیزات دیگر را نشان می‌دهد.",
            "خطوط اندازه‌گذاری و نمای بازشدهٔ قطعات به طرح شخصیت مهندسی می‌دهند. با این حال اندازه‌ها و مشخصات روی تصویر صرفاً بخشی از تصویرسازی‌اند و نقشهٔ قابل ساخت یا دیتاشیت محصول نیستند. مشخصات اجرایی باید از سازنده و اسناد معتبر همان تجهیز بیایند."
          ],
          "en": [
            "An industrial buyer often arrives with a specific requirement, such as automating one production step or finding suitable equipment. Parto places catalogue discovery and a requirement enquiry together in the opening workspace. The robot establishes the field while a category spine offers routes to other equipment.",
            "Dimension lines and exploded-part details give the design an engineering character. The illustrated measurements are visual concept material, not a manufacturing drawing or product datasheet. Production specifications must come from the actual equipment manufacturer and verified documentation."
          ]
        }
      },
      {
        "heading": {
          "fa": "از نقشهٔ شلوغ تا درخواست ساده",
          "en": "Turn a detailed workspace into a simple next step"
        },
        "paragraphs": {
          "fa": [
            "در دسکتاپ، عکس بزرگ و فرم روبه‌روی هم قرار دارند؛ در موبایل، نام خدمت، تصویر اصلی و فرم به ترتیب دیده می‌شوند. یادداشت‌های فنی فرعی باید کم شوند تا ریزنوشته‌های تصویر جای اطلاعات قابل خواندن را نگیرند. متن مشخصات در سایت واقعی باید خارج از عکس هم در دسترس باشد.",
            "پیش از پیاده‌سازی، دسته‌بندی تجهیزات، فایل‌های فنی، واحدها و فرآیند پاسخ‌گویی به استعلام باید مشخص شوند. یک حرکت کوتاه برای خطوط نقشه می‌تواند کافی باشد؛ حرکت پیوستهٔ ماشین نباید مزاحم فرم شود. این نمونه، جهت طراحی کاتالوگ است و کنترل‌گر صنعتی یا سامانهٔ عملیاتی ندارد."
          ],
          "en": [
            "Desktop places the large machine and enquiry opposite each other. Mobile sequences the service heading, primary illustration and form. Secondary annotations need simplification so tiny image lettering does not stand in for readable product information. Real specifications should also exist as accessible page text.",
            "Implementation would begin with equipment taxonomy, technical files, units and an enquiry-handling process. A brief line-drawing reveal could add motion without a permanently moving machine competing with the form. This is a catalogue design direction, not an industrial controller or an operational automation system."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["parto-automation"]
  },
  {
    "slug": "nava-live",
    "language": "fa",
    "title": {
      "fa": "نوا؛ اجراهای زنده و رزرو رویداد",
      "en": "Nava · Live events and booking"
    },
    "service": {
      "fa": "طراحی پلتفرم رویداد · تجربهٔ کشف اجرا",
      "en": "Event platform · Live-show discovery"
    },
    "summary": {
      "fa": "طرح مفهومی کشف اجرای زنده با نور صحنه، تایپوگرافی پوستر، نوار تاریخ و کارت شبیه بلیت؛ چیدمانی پرانرژی برای جست‌وجو بر اساس شهر و سبک موسیقی.",
      "en": "A live-event discovery concept mixing stage photography, poster typography, a date rail and ticket-shaped details with city and genre search."
    },
    "features": {
      "fa": [
        "مرور تاریخ اجرا",
        "انتخاب شهر و سبک",
        "ورود به فهرست رویدادها"
      ],
      "en": [
        "Event-date browsing",
        "City and genre filters",
        "Show-list discovery"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "از حال‌وهوای صحنه تا انتخاب اجرا",
          "en": "Connect stage atmosphere with event discovery"
        },
        "paragraphs": {
          "fa": [
            "سایت رویداد باید هم حس اجرا را منتقل کند و هم به پرسش سادهٔ «چه زمانی و کجا؟» جواب بدهد. در نوا، عکس صحنه و حروف درشت نقش پوستر را دارند؛ نوار تاریخ در کنار صفحه و جست‌وجوی شهر و سبک، مسیر کاربردی را اضافه می‌کنند. کارت شبیه بلیت، ایدهٔ انتخاب یک اجرای مشخص را نشان می‌دهد.",
            "بافت چاپی و رنگ‌های سرخابی و زردآلویی، این طرح را از یک سایت شرکتی جدا می‌کنند. تاریخ‌ها، نام اجرا و وضعیت‌های تصویر نمایشی‌اند. هیچ بلیت واقعی، برنامهٔ قطعی یا همکاری با هنرمند مشخصی در این مفهوم عرضه نشده است."
          ],
          "en": [
            "An event website must communicate atmosphere while answering a practical question: when and where? Nava uses stage photography and large lettering like a cultural poster, then adds a date rail and city/genre search. A ticket-shaped highlight suggests selecting a particular show.",
            "Print texture, fuchsia and apricot give this direction a different identity from a corporate landing page. Dates, event names and interface states are illustrative. The concept does not offer real tickets, confirm a programme or imply an association with an artist."
          ]
        }
      },
      {
        "heading": {
          "fa": "جست‌وجو باید از جلوه‌ها جلوتر بماند",
          "en": "Keep discovery ahead of visual effects"
        },
        "paragraphs": {
          "fa": [
            "در نمای موبایل، تاریخ و ورودی جست‌وجو باید با دسترسی آسان باقی بمانند و پوستر نباید همهٔ ارتفاع را بگیرد. برای همین هر اندازه ترکیب خودش را دارد. زمان، محل و وضعیت فروش در اجرای واقعی باید با متن روشن بیان شوند؛ رنگ کارت یا جلوهٔ نور به‌تنهایی کافی نیست.",
            "سامانهٔ فروش واقعی به ظرفیت معتبر، انتخاب صندلی در صورت نیاز، پرداخت، وضعیت رزرو و قوانین لغو وابسته است. حرکت پیشنهادی می‌تواند ورود کوتاه بلیت و روشن‌شدن محدود نور صحنه باشد. پخش خودکار صدا، چشمک مداوم و ادعای ساخت این زیرساخت‌ها در یک تصویر، بخشی از این نمونه نیست."
          ],
          "en": [
            "On mobile, date and search access must survive without the poster consuming the whole screen. Each viewport therefore has its own composition. A production interface should state time, venue and sale availability in text rather than communicating them only through card colour or lighting.",
            "Actual ticket sales require reliable capacity, seating where applicable, payment, reservation states and cancellation terms. A short ticket entrance and restrained stage-light reveal could support the identity. Autoplay audio and continuous flashing would undermine discovery; this artwork does not claim that a booking backend exists."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["nava-live"]
  },
  {
    "slug": "tide-liquidity",
    "language": "en",
    "title": {
      "fa": "Tide؛ داشبورد نقدینگی DEX",
      "en": "Tide · DEX liquidity workspace"
    },
    "service": {
      "fa": "طراحی محصول Web3 · رابط DEX",
      "en": "Web3 product design · DEX interface"
    },
    "summary": {
      "fa": "طرح مفهومی محیط تبادل غیرمتمرکز با نقشهٔ توپوگرافیک نقدینگی، عمق بازار و پنل بازبینی مبادله؛ رابط انگلیسی متراکم با سبز فسفری روی زمینهٔ جنگلی تیره.",
      "en": "A DEX workspace concept with topographic liquidity contours, market-depth bars and a swap-review panel, using a dense forest-black and acid-lime interface."
    },
    "features": {
      "fa": [
        "نمایش مسیر مبادله",
        "تصویرسازی عمق نقدینگی",
        "پنل پیش‌نمایش و بازبینی"
      ],
      "en": [
        "Swap-route exploration",
        "Liquidity-depth visualisation",
        "Preview and review panel"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "جداکردن تحلیل بازار از تأیید مبادله",
          "en": "Separate exploration from transaction review"
        },
        "paragraphs": {
          "fa": [
            "Tide یک مطالعهٔ رابط DEX است که دو کار را جدا می‌کند: بررسی مسیر و نقدینگی در سمت اصلی و مرور جزئیات مبادله در پنل مستقل. نقشهٔ توپوگرافیک، استعاره‌ای تصویری برای لایه‌های نقدینگی است. نوار مسیر کمک می‌کند کاربر بداند مبادلهٔ پیشنهادی از چه مراحلی عبور می‌کند، پیش از آنکه به تأیید برسد.",
            "رنگ سبز برای انتخاب‌ها و اقدام اصلی استفاده شده و خطوط باریک، محیطی شبیه ترمینال می‌سازند. توکن‌ها، اعداد و مسیرهای تصویر دادهٔ نمایشی‌اند؛ این صفحه قیمت زنده، بازده یا پیشنهاد سرمایه‌گذاری ارائه نمی‌کند و به کیف پول متصل نیست."
          ],
          "en": [
            "Tide separates two tasks: exploring routes and liquidity in the main workspace, then reviewing a swap in its own panel. The topographic map is a visual metaphor for liquidity layers. A route strip helps a user understand the proposed path before reaching a confirmation step.",
            "Lime highlights selection and the main action while fine separators create a terminal-like environment. Tokens, amounts and routes are demonstration data. This page supplies no live quotes, investment recommendation or yield claim, and it is not connected to a wallet."
          ]
        }
      },
      {
        "heading": {
          "fa": "بازبینی تراکنش باید از جلوهٔ نقشه مهم‌تر باشد",
          "en": "Keep review details ahead of the visualisation"
        },
        "paragraphs": {
          "fa": [
            "در تبلت و موبایل، فضای نمودار کاهش پیدا می‌کند تا پنل بازبینی همچنان قابل تشخیص بماند. اجرای واقعی باید شبکه، دارایی، مقدار، هزینهٔ برآوردی و وضعیت تأیید را با متن روشن نشان دهد. حالت اتصال‌نداشتن کیف پول، رد امضا و تغییر قیمت هم بخشی از طراحی محصول‌اند و در یک تصویر ثابت قابل آزمودن نیستند.",
            "حرکت پیشنهادی برای خطوط نقشه محدود و قابل توقف است؛ دادهٔ مهم نباید تنها داخل تصویر یا انیمیشن باشد. ساخت محصول عملیاتی به منبع قیمت، منطق مسیر، یکپارچه‌سازی کیف پول و بررسی امنیتی مستقل نیاز دارد. این نمونه جهت طراحی و اولویت‌بندی رابط را نشان می‌دهد و ادعای ساخت صرافی فعال ندارد."
          ],
          "en": [
            "Tablet and mobile reduce the visualisation footprint while preserving the identity of the review panel. A real product must state network, asset, amount, estimated fee and approval state in understandable text. Disconnected wallets, rejected signatures and changing quotes also need designed states that cannot be tested in a still image.",
            "Proposed contour motion would be bounded and pausable. Important data must not exist only in artwork or animation. An operational exchange requires reliable quotes, routing logic, wallet integration and independent security review. This study demonstrates interface priorities rather than claiming a working exchange."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["tide-liquidity"]
  },
  {
    "slug": "cinder-dao",
    "language": "en",
    "title": {
      "fa": "Cinder؛ رأی‌گیری و حاکمیت DAO",
      "en": "Cinder · DAO governance"
    },
    "service": {
      "fa": "طراحی Web3 · تجربهٔ حاکمیت DAO",
      "en": "Web3 design · DAO governance experience"
    },
    "summary": {
      "fa": "طرح مفهومی حاکمیت DAO با سبک روزنامه‌ای، پیشنهادهای کاغذی، مهر قرمز و تفکیک گفت‌وگو از رأی‌گیری؛ یک هویت Web3 روشن و متفاوت از داشبوردهای نئونی.",
      "en": "A DAO governance concept with a civic newspaper identity, tactile proposal sheets, red seals and distinct discussion and voting areas rather than a neon dashboard."
    },
    "features": {
      "fa": [
        "مرور پیشنهادها",
        "تفکیک بحث و رأی‌گیری",
        "نمای وضعیت پیشنهاد"
      ],
      "en": [
        "Proposal discovery",
        "Separate discussion and voting areas",
        "Proposal-status overview"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "پیشنهاد باید پیش از رأی خوانده شود",
          "en": "Make the proposal readable before the vote"
        },
        "paragraphs": {
          "fa": [
            "Cinder برای بررسی این پرسش طراحی شده که یک جامعهٔ Web3 چطور می‌تواند پیشنهادها را خواناتر مرور کند. تیتر اصلی دعوت به مشارکت است و کارت فعال، موضوع تصمیم را معرفی می‌کند. بخش گفت‌وگو و بخش رأی از هم جدا هستند تا بازدیدکننده میان مطالعهٔ دلیل‌ها و ثبت موضع تفاوت بگذارد.",
            "کاغذهای لایه‌لایه، خط قرمز و حروف درشت، استعاره‌ای از صورت‌جلسه و نشریهٔ عمومی می‌سازند. این زبان بصری نشان می‌دهد که محصول Web3 الزاماً به سکهٔ سه‌بعدی و پس‌زمینهٔ تیره نیاز ندارد. پیشنهادها و مهرهای تصویر نمونه‌اند و نتیجهٔ رأی‌گیری واقعی نیستند."
          ],
          "en": [
            "Cinder explores how a Web3 community might review proposals more clearly. The opening statement invites participation while an active-proposal strip names the decision under discussion. Discussion and voting have different areas so reading the arguments and recording a position are visibly separate actions.",
            "Layered paper, red rules and strong lettering borrow from minutes and civic publishing. The direction demonstrates that a Web3 product does not require floating coins or a dark neon canvas. Proposal names and stamps are sample content rather than records of real governance outcomes."
          ]
        }
      },
      {
        "heading": {
          "fa": "وضعیت تصمیم، فقط یک مهر تزئینی نیست",
          "en": "Treat governance status as information"
        },
        "paragraphs": {
          "fa": [
            "در صفحهٔ باریک‌تر، تیتر و پیشنهاد شاخص بالاتر می‌آیند و پنل‌های مشارکت جمع‌وجور می‌شوند. در اجرای واقعی، پیش‌نویس، بحث، رأی‌گیری و بسته‌شدن باید توضیح متنی داشته باشند. تاریخ پایان، شرایط مشارکت و اثر رأی باید کنار کنترل‌ها مشخص باشد تا کاربر فقط از ظاهر مهر برداشت نکند.",
            "حرکت محدود ورق‌ها می‌تواند ورود به صفحه را جذاب کند، اما متن پیشنهاد باید مستقل از آن خوانده شود. اتصال به قرارداد حاکمیت، نقش نمایندگان، اعتبار امضا و تاریخچهٔ رأی، کارهای جداگانهٔ پیاده‌سازی‌اند. این نمونه یک مطالعهٔ هویت و تجربهٔ مشارکت است؛ DAO واقعی یا موجودی خزانه‌ای پشت آن اعلام نشده است."
          ],
          "en": [
            "Narrower screens bring the main statement and featured proposal forward while condensing participation panels. A production system should explain draft, discussion, voting and closed states in text. Deadlines, eligibility and the effect of voting belong beside the controls, not only in a decorative stamp.",
            "A brief paper entrance could add character without delaying access to the proposal. Governance-contract integration, delegation roles, signature validation and voting history are separate implementation work. This is an identity and participation study, not a claim about an operating DAO or treasury balance."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["cinder-dao"]
  },
  {
    "slug": "kora-collectibles",
    "language": "en",
    "title": {
      "fa": "Kora؛ تجربهٔ کلکسیون دیجیتال Web3",
      "en": "Kora · Web3 digital collectibles"
    },
    "service": {
      "fa": "طراحی Web3 · گالری کلکسیون دیجیتال",
      "en": "Web3 design · Digital-collectible gallery"
    },
    "summary": {
      "fa": "طرح مفهومی گالری Web3 با شیء هنری سه‌بعدی اصلی، قاب دایره‌ای بزرگ و انتخاب جنس و نسخه؛ چیدمانی موزه‌ای با یاسی، مشکی و سبز یشمی روشن.",
      "en": "A Web3 collectible-gallery concept featuring original sculptural artwork, a large circular aperture and material/edition selection in lilac, black and pale jade."
    },
    "features": {
      "fa": [
        "نمای نزدیک شیء هنری",
        "انتخاب جنس و نسخه",
        "نوار مرور آثار"
      ],
      "en": [
        "Large artwork inspection",
        "Material and edition selection",
        "Object-browsing filmstrip"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "کلکسیون با خود اثر معرفی می‌شود",
          "en": "Introduce a collection through the object itself"
        },
        "paragraphs": {
          "fa": [
            "در Kora، اثر هنری به‌جای قیمت یا دکمهٔ خرید فوری، نقش اول را دارد. موجود انتزاعی با پوستهٔ حلقه‌ای داخل دهانهٔ دایره‌ای قرار گرفته و نوار کناری، شکل‌های متفاوت دیگری را پیشنهاد می‌کند. کنترل جنس و نسخه، ایدهٔ بررسی تفاوت آثار را به تصویر اضافه می‌کند.",
            "نور نرم و سطح نیمه‌شفاف یاسی، حس گالری می‌سازند؛ متن مشکی و کنترل‌های یشمی از تصویر جدا می‌مانند. آثار برای این مفهوم ساخته شده‌اند و از شخصیت یا مجموعهٔ شناخته‌شدهٔ NFT استفاده نشده است. هیچ ادعایی دربارهٔ فروش، کمیابی واقعی یا ارزش آیندهٔ آن‌ها وجود ندارد."
          ],
          "en": [
            "Kora gives the artwork priority over pricing or an immediate purchase button. An abstract loop-shell creature sits in a large circular aperture, while the side filmstrip suggests other distinct objects. Material and edition controls introduce the idea of comparing variations.",
            "Soft light and translucent lilac surfaces establish a gallery atmosphere, with black text and jade controls remaining visually separate. The artwork was created for this concept rather than copied from a recognised NFT character or collection. It makes no claim about sales, actual scarcity or future value."
          ]
        }
      },
      {
        "heading": {
          "fa": "ظاهر اثر و حقوق مالکیت دو موضوع جدا هستند",
          "en": "Separate visual exploration from ownership information"
        },
        "paragraphs": {
          "fa": [
            "تبلت و موبایل اندازهٔ اثر را حفظ می‌کنند و کنترل‌ها را در مسیر عمودی می‌چینند. در محصول واقعی باید عنوان اثر، پدیدآورنده، مجوز استفاده و معنای هر نسخه با متن روشن توضیح داده شود. انتخاب یک رنگ در رابط به‌خودی‌خود نشانهٔ مالکیت یا امکان مینت نیست.",
            "یک گذار کوتاه بین جنس‌ها یا آثار برای حرکت این هویت کافی است. اگر پروژه به بلاک‌چین متصل شود، شبکه، قرارداد، هزینه، وضعیت تراکنش و محدودیت حقوقی باید جداگانه تعریف و بررسی شوند. این صفحه فقط مطالعهٔ طراحی گالری و سه نمای پاسخ‌گوی آن است؛ فروشگاه یا قرارداد فعال ارائه نمی‌کند."
          ],
          "en": [
            "Tablet and mobile retain a generous artwork scale and move controls into a vertical sequence. An actual product needs written titles, creator details, usage permissions and an explanation of each edition. Choosing a material in the interface does not itself establish ownership or a minting capability.",
            "A short transition between materials or objects is enough motion for this identity. Blockchain integration would require a defined network, contract, fee presentation, transaction states and a separate review of rights. This page documents a responsive gallery design study rather than an active marketplace or deployed contract."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["kora-collectibles"]
  },
  {
    "slug": "aster-observability",
    "language": "en",
    "title": {
      "fa": "Aster؛ پایش سرویس و داشبورد ابری",
      "en": "Aster · Cloud observability"
    },
    "service": {
      "fa": "طراحی SaaS · داشبورد پایش ابری",
      "en": "SaaS design · Cloud observability dashboard"
    },
    "summary": {
      "fa": "طرح مفهومی SaaS پایش سرویس با نقشهٔ وابستگی و خط زمانی رخداد در پنجره‌های لایه‌ای؛ رابطی روشن با خطوط فنی و مسیر سیگنال نیلی.",
      "en": "A cloud-observability SaaS concept with layered dependency and incident-timeline windows, set on a light technical blueprint with a precise indigo signal line."
    },
    "features": {
      "fa": [
        "نقشهٔ وابستگی سرویس‌ها",
        "خط زمانی رخداد",
        "ورود به دموی محصول"
      ],
      "en": [
        "Service-dependency map",
        "Incident timeline",
        "Product-demo entry"
      ]
    },
    "indexable": true,
    "updatedAt": "2026-11-10",
    "study": [
      {
        "heading": {
          "fa": "داشبوردی که رابطهٔ سرویس‌ها را توضیح دهد",
          "en": "Show how services connect to an incident"
        },
        "paragraphs": {
          "fa": [
            "Aster یک مفهوم برای معرفی محصول پایش ابری است. به‌جای بنر پر از درصد و ادعای سرعت، دو نمای کاربردی نشان می‌دهد: نقشهٔ ارتباط سرویس‌ها و زمان‌بندی رسیدگی به یک رخداد. خط نیلی میان تیتر و پنجره‌ها، ایدهٔ دنبال‌کردن یک سیگنال در سیستم را به هم وصل می‌کند.",
            "زمینهٔ روشن و حروف باریک، حال‌وهوای نقشهٔ فنی می‌سازند. پنجره‌های لایه‌ای به عمق محصول اشاره می‌کنند، اما نام سرویس‌ها، وضعیت‌ها و زمان‌ها همگی دادهٔ نمایشی‌اند. این صفحه شاهدی برای پایش زیرساخت مشتری یا تضمین دسترس‌پذیری نیست."
          ],
          "en": [
            "Aster introduces an observability product through two practical views: service relationships and the timeline of an incident. Rather than a banner filled with performance percentages, the hero gives the visitor an idea of what they would inspect. An indigo line connects the headline and windows as a visual metaphor for following a signal.",
            "The bright canvas and light typography establish a technical blueprint identity. Layered windows suggest product depth, but service names, states and times are demonstration content. They do not document a customer’s infrastructure or establish an uptime guarantee."
          ]
        }
      },
      {
        "heading": {
          "fa": "پیش‌نمایش محصول با خوانایی داده فرق دارد",
          "en": "Distinguish a product preview from operational data"
        },
        "paragraphs": {
          "fa": [
            "در تبلت، پنجره‌ها زیر تیتر جمع می‌شوند و در موبایل، ترتیب مشاهدهٔ نقشه و رخداد روشن‌تر می‌شود. برای داشبورد عملیاتی، نمودار باید نمای ساده و متن همراه داشته باشد؛ نقطهٔ قرمز به‌تنهایی برای فهم خطا کافی نیست. کاربر باید بتواند به سرویس و جزئیات رخداد با صفحه‌کلید برسد.",
            "در پیاده‌سازی می‌توان خط سیگنال را یک‌بار رسم کرد و سپس متوقف نگه داشت. اتصال به دادهٔ پایش، سطح دسترسی تیم، تازه‌بودن داده و حالت قطع ارتباط، مرحله‌های جداگانهٔ ساخت‌اند. این مطالعه جهت معرفی و ساختار بصری را پوشش می‌دهد و سرویس پایش واقعی پشت تصاویر اجرا نشده است."
          ],
          "en": [
            "Tablet groups the windows beneath the statement, while mobile makes the inspection order more explicit. An operational dashboard needs a simpler graph alternative and supporting text; a red dot alone cannot explain an error. Keyboard access should reach both a service and its incident details.",
            "The signal line could draw once and then remain still. Monitoring ingestion, team permissions, data freshness and disconnected states are separate implementation concerns. This study covers product introduction and visual structure, not a monitoring service running behind the images."
          ]
        }
      }
    ],
    "images": PROJECT_HERO_VIEWS["aster-observability"]
  }
];
