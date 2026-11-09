import { PROJECT_HERO_VIEWS } from "./hero-views";
import type { ServiceSlug } from "@/app/components/Services/data";

// Portfolio case studies. Every statement about a site describes what its live pages show;
// no results, traffic or sales figures are claimed. Screenshots are real captures of the live
// sites (public/projects/hero/<slug>-{desktop,tablet,mobile}.webp) taken on 2026-10-26.

type Bilingual = { fa: string; en: string };
type BilingualList = { fa: string[]; en: string[] };

export type ProjectImage = { src: string; width: number; height: number; alt: Bilingual; caption: Bilingual };

export type Project = {
  slug: string;
  title: Bilingual;
  /** One or two sentences for the cards on the home page. */
  summary: Bilingual;
  service: Bilingual;
  industry: Bilingual;
  /** Live site address as the client uses it. */
  url: string;
  host: string;
  seo: { title: Bilingual; description: Bilingual };
  overview: BilingualList;
  updatedAt: string;
  relatedServices: ServiceSlug[];
  relatedArticles: string[];
  caseStudy: {
    challenge: Bilingual;
    decisions: { title: Bilingual; text: Bilingual }[];
    journey: BilingualList;
    takeaway: Bilingual;
  };
  /** What the delivered site contains, taken from its live pages. */
  includes: { title: Bilingual; items: BilingualList };
  images: [ProjectImage, ProjectImage, ProjectImage];
};

export const PROJECTS: Project[] = [
  {
    slug: "tino-electronic",
    title: { fa: "تینو الکترونیک", en: "Tino Electronic" },
    summary: {
      fa: "فروشگاه اینترنتی تخصصی قطعات الکترونیکی با دسته‌بندی کامل، جست‌وجو و پیشنهادهای ویژه.",
      en: "A specialist online store for electronic components with full categories, search and special offers.",
    },
    service: { fa: "فروشگاه اینترنتی · طراحی و توسعه", en: "Online store · Design and development" },
    industry: { fa: "قطعات و لوازم الکترونیکی", en: "Electronic components and supplies" },
    url: "https://tinoelec.com/",
    host: "tinoelec.com",
    seo: {
      title: { fa: "تینو الکترونیک؛ نمونه‌کار فروشگاه اینترنتی قطعات الکترونیکی", en: "Tino Electronic: Electronics Online Store Case Study" },
      description: {
        fa: "نمونه‌کار طراحی و توسعهٔ فروشگاه اینترنتی تینو الکترونیک؛ دسته‌بندی قطعات، جست‌وجو، پیشنهادهای تخفیف‌دار و مشاوره و استعلام قطعه.",
        en: "Case study of the Tino Electronic online store: part categories, search, discounted offers and parts advice and inquiries.",
      },
    },
    overview: {
      fa: [
        "تینو الکترونیک یک فروشگاه تخصصی قطعات و لوازم الکترونیکی است؛ از مقاومت و خازن تا ماژول، برد آردوینو و ابزار. کسی که مشغول ساختن یک مدار است باید قطعهٔ درست را سریع پیدا کند، قیمت و موجودی را ببیند و در صورت تردید از فروشنده راهنمایی بگیرد.",
        "این سایت همین مسیر را کوتاه می‌کند: دسته‌بندی روشن، جست‌وجو در همهٔ صفحه‌ها، کارت محصول با قیمت و وضعیت موجودی، و یک مسیر مشخص برای مشاوره و استعلام قطعه.",
      ],
      en: [
        "Tino Electronic is a specialist store for electronic components and supplies, from resistors and capacitors to modules, Arduino boards and tools. Someone building a circuit needs to find the right part fast, see its price and stock, and ask the seller when unsure.",
        "The website shortens that path: clear categories, search on every page, product cards with price and stock status, and a defined route for part advice and inquiries.",
      ],
    },
    includes: {
      title: { fa: "چه چیزهایی در سایت هست", en: "What the site includes" },
      items: {
        fa: [
          "دسته‌بندی گسترده: قطعات و تجهیزات الکترونیکی، سنسور و ماژول، رباتیک و مکاترونیک، مینی‌کامپیوتر، بردهای آردوینو، هوشمندسازی، منابع تغذیه، تجهیزات برقی خودرو و بیشتر",
          "جست‌وجوی قطعه یا کالا در بالای همهٔ صفحه‌ها",
          "کارت محصول با قیمت به تومان، درصد تخفیف و وضعیت موجودی",
          "بخش‌های پیشنهاد تخفیف‌دار، محصولات ویژه و تازه‌های فروشگاه",
          "اسلایدر صفحهٔ اصلی با سه مسیر: دنیای قطعات، پیشنهادهای ویژه و مشاوره و استعلام",
          "سبد خرید و حساب کاربری",
          "وبلاگ، صفحهٔ دربارهٔ ما و تماس با ما",
          "نمایش کامل و راحت روی موبایل",
        ],
        en: [
          "A broad category tree: electronic components, sensors and modules, robotics and mechatronics, mini computers, Arduino boards, smart home, power supplies, car electronics and more",
          "Part and product search at the top of every page",
          "Product cards with price in toman, discount percentage and stock status",
          "Discounted offers, featured products and newly arrived items",
          "A home-page slider with three paths: the world of parts, special offers, and advice and inquiries",
          "Shopping cart and customer account",
          "A blog, an about page and a contact page",
          "A full, comfortable layout on phones",
        ],
      },
    },
    "updatedAt": "2026-11-08",
    "relatedServices": [
      "ecommerce-website-design",
      "website-design-development",
      "care-performance"
    ],
    "relatedArticles": [
      "ecommerce-website-launch-guide",
      "ecommerce-product-page-seo"
    ],
    "caseStudy": {
      "challenge": {
        "fa": "در فروشگاه قطعات الکترونیکی، همهٔ مشتری‌ها از یک نقطه شروع نمی‌کنند. یک نفر نام قطعه را می‌داند و جست‌وجو می‌کند؛ دیگری از کاربرد یا دستهٔ محصول به انتخاب می‌رسد. اطلاعات قیمت و موجودی هم باید هنگام بررسی کالا در دسترس باشد. مسئلهٔ طراحی، کنار هم قرارگرفتن این مسیرها در یک فروشگاه قابل فهم است.",
        "en": "Electronic-component buyers do not all start in the same place. One knows the part name and searches directly; another chooses by category or use. Price and availability also need to be visible during selection. The design problem is to support these journeys within a coherent store."
      },
      "decisions": [
        {
          "title": {
            "fa": "جست‌وجو در کنار دسته‌بندی",
            "en": "Search alongside categories"
          },
          "text": {
            "fa": "جست‌وجوی بالای صفحه مسیر مستقیم پیدا کردن قطعه را فراهم می‌کند. دسته‌بندی کالاها مسیر مرور را نگه می‌دارد تا کاربری که هنوز نام دقیق را نمی‌داند هم نقطهٔ شروع داشته باشد.",
            "en": "Search at the top of the page provides a direct route to a part. Categories preserve a browsing path for customers who do not yet know the exact name."
          }
        },
        {
          "title": {
            "fa": "اطلاعات تصمیم در کارت محصول",
            "en": "Decision information on product cards"
          },
          "text": {
            "fa": "قیمت، وضعیت موجودی و تخفیف در کارت محصول دیده می‌شوند. این چیدمان اجازه می‌دهد چند گزینه در همان فهرست مقایسه شوند و کاربر برای هر دادهٔ اولیه ناچار به بازکردن صفحهٔ جدا نباشد.",
            "en": "Cards display price, stock status and discounts. Customers can compare initial information in the listing rather than opening a separate page for every basic detail."
          }
        },
        {
          "title": {
            "fa": "راه ارتباط برای انتخاب نامطمئن",
            "en": "An advice route when the choice is uncertain"
          },
          "text": {
            "fa": "در کنار مسیر خرید، بخش مشاوره و استعلام قطعه وجود دارد. این مسیر برای حالتی است که مشخصات کالا یا انتخاب جایگزین به توضیح فروشنده نیاز دارد.",
            "en": "Advice and parts enquiries sit alongside the shopping journey, providing a route for questions about specifications or a suitable alternative."
          }
        }
      ],
      "journey": {
        "fa": [
          "جست‌وجوی نام قطعه یا ورود از دسته‌بندی مرتبط",
          "بررسی کارت‌ها و جزئیات کالای مناسب",
          "استفاده از مسیر سبد خرید یا مشاوره و استعلام"
        ],
        "en": [
          "Search for the part or enter a relevant category",
          "Review cards and the appropriate product details",
          "Continue through the cart or the advice and enquiry route"
        ]
      },
      "takeaway": {
        "fa": "اگر کالاهای شما نام فنی، گروه‌های متنوع و سؤال پیش از خرید دارند، ساختار اطلاعات و جست‌وجو باید در تعریف پروژه بررسی شوند. این نمونه نشان‌دهندهٔ قابلیت‌های رابط فروشگاه است؛ آمار فروش یا اثر سئو از آن نتیجه‌گیری نمی‌شود.",
        "en": "For products with technical names, varied groups and pre-purchase questions, information structure and search belong in the project brief. This example demonstrates interface features; it is not evidence of measured sales or SEO outcomes."
      }
    },
    images: PROJECT_HERO_VIEWS["tino-electronic"],
  },
  {
    slug: "wallpaper-consortium",
    title: { fa: "کنسرسیوم کاغذ دیواری ایران", en: "Iran Wallpaper Consortium" },
    summary: {
      fa: "فروشگاه آنلاین واحد برندهای کاغذ دیواری با آلبوم، سبک، رنگ و جست‌وجوی کد طرح.",
      en: "A single online store for wallpaper brands with albums, styles, colors and design-code search.",
    },
    service: { fa: "فروشگاه چندبرندی · طراحی و توسعه", en: "Multi-brand store · Design and development" },
    industry: { fa: "کاغذ دیواری و دکوراسیون", en: "Wallpaper and interior decoration" },
    url: "https://wallpaper-consortium.ir/fa",
    host: "wallpaper-consortium.ir",
    seo: {
      title: { fa: "کنسرسیوم کاغذ دیواری؛ نمونه‌کار فروشگاه آنلاین چندبرندی", en: "Wallpaper Consortium: Multi-brand Online Store Case Study" },
      description: {
        fa: "نمونه‌کار طراحی و توسعهٔ فروشگاه آنلاین کنسرسیوم کاغذ دیواری ایران؛ آلبوم‌ها و برندها، انتخاب بر اساس سبک و رنگ، جست‌وجوی کد طرح و ثبت سفارش.",
        en: "Case study of the Iran Wallpaper Consortium online store: albums and brands, choosing by style and color, design-code search and ordering.",
      },
    },
    overview: {
      fa: [
        "کنسرسیوم یک فروشگاه آنلاین واحد در صنعت کاغذ دیواری است که برندهای مختلف، فروشندگان، عاملان فروش و فعالان این حوزه را در یک فضای دیجیتال کنار هم می‌آورد. خریدار به‌جای گشتن میان چند سایت جدا، آلبوم‌ها و کاغذ دیواری‌های برندهای عضو را در یک جا می‌بیند.",
        "چالش این‌گونه کاتالوگ‌ها حجم طرح‌هاست: هر برند چند آلبوم و هر آلبوم صدها طرح دارد. سایت راه‌های مختلفی برای رسیدن به طرح مناسب می‌دهد: انتخاب بر اساس سبک، رنگ و نوع فضا یا جست‌وجوی مستقیم کد طرح و آلبوم.",
      ],
      en: [
        "The Consortium is a single online store for the wallpaper industry that brings together brands, sellers, sales agents and professionals in one digital space. Instead of hopping between separate sites, a buyer sees the albums and wallpapers of all member brands in one place.",
        "The challenge with catalogs like this is volume: each brand has several albums and each album hundreds of designs. The site offers several ways to reach the right design: choosing by style, color and room type, or searching a design code or album directly.",
      ],
    },
    includes: {
      title: { fa: "چه چیزهایی در سایت هست", en: "What the site includes" },
      items: {
        fa: [
          "صفحهٔ برندهای عضو با تعداد آلبوم و طرح هر برند",
          "مرور بر اساس آلبوم، سبک، رنگ، برند و جدیدترین‌ها",
          "انتخاب بر اساس سبک، رنگ و فضا و جست‌وجوی طرح بر اساس رنگ",
          "جست‌وجوی مستقیم کد طرح یا آلبوم در بالای صفحه",
          "نمایش آلبوم‌های منتخب و کالکشن‌های جدید",
          "سبد خرید، ورود کاربران و مسیر مشخص ثبت سفارش و استعلام",
          "صفحه‌های راهنما: آموزش ثبت سفارش، سوالات متداول، شرایط و قوانین و سیاست حریم خصوصی",
          "نوار پیمایش ثابت پایین صفحه در موبایل، مثل یک اپلیکیشن",
        ],
        en: [
          "A member-brands page showing each brand's number of albums and designs",
          "Browsing by album, style, color, brand and newest additions",
          "Choosing by style, color and room, plus searching designs by color",
          "Direct search for a design code or album at the top of the page",
          "Featured albums and new collections",
          "Shopping cart, customer login and a defined route for ordering and inquiries",
          "Help pages: how to order, FAQ, terms and conditions and privacy policy",
          "A fixed bottom navigation bar on phones, like an app",
        ],
      },
    },
    "updatedAt": "2026-11-08",
    "relatedServices": [
      "ecommerce-website-design",
      "website-design-development",
      "ui-ux-brand-design"
    ],
    "relatedArticles": [
      "ecommerce-website-launch-guide",
      "website-content-preparation-checklist"
    ],
    "caseStudy": {
      "challenge": {
        "fa": "خریدار کاغذ دیواری ممکن است کد دقیق طرح را داشته باشد یا فقط رنگ و حال‌وهوای فضا را بشناسد. در یک فروشگاه چندبرندی، برند، آلبوم و ویژگی بصری هم‌زمان روی انتخاب اثر می‌گذارند. مسئلهٔ تجربه کاربری، ارائهٔ مسیر مناسب برای هرکدام از این شیوه‌های انتخاب است.",
        "en": "A wallpaper buyer may have an exact design code or only a preferred colour and room style. In a multi-brand catalogue, brand, album and visual attributes all influence the choice. The interface needs entry points suited to each way of choosing."
      },
      "decisions": [
        {
          "title": {
            "fa": "ورود از کد یا ویژگی بصری",
            "en": "Start from a code or a visual attribute"
          },
          "text": {
            "fa": "جست‌وجوی مستقیم کد طرح یا آلبوم در کنار انتخاب بر اساس سبک، رنگ و فضا قرار دارد. مسیر انتخاب فقط به دانستن نام محصول وابسته نیست.",
            "en": "Direct design-code and album search accompanies browsing by style, colour and room. Choosing does not depend solely on knowing a product name."
          }
        },
        {
          "title": {
            "fa": "حفظ رابطهٔ برند و آلبوم",
            "en": "Preserve brand and album relationships"
          },
          "text": {
            "fa": "صفحهٔ برندها، آلبوم‌ها و مجموعه‌های منتخب، ساختار کاتالوگ را قابل مرور می‌کنند. کاربر می‌تواند از یک برند شروع کند یا مجموعه‌های جدید را ببیند و سپس انتخابش را دقیق‌تر کند.",
            "en": "Brand pages, albums and selected collections make the catalogue browsable. Visitors can begin with a brand or a new collection and then refine their selection."
          }
        },
        {
          "title": {
            "fa": "ادامهٔ مسیر روی موبایل",
            "en": "Keep the journey available on mobile"
          },
          "text": {
            "fa": "پیمایش ثابت پایین صفحه در نمای موبایل، ورودی بخش‌های اصلی را نزدیک دست نگه می‌دارد. سبد، ورود کاربر و راهنمای ثبت سفارش هم در ساختار فروشگاه دیده می‌شوند.",
            "en": "Fixed bottom navigation keeps main destinations within reach on phones. The store also exposes the cart, customer login and ordering guidance."
          }
        }
      ],
      "journey": {
        "fa": [
          "ورود از برند، آلبوم یا جست‌وجوی کد طرح",
          "محدودکردن انتخاب با سبک، رنگ و فضای موردنظر",
          "بررسی طرح و ادامه از مسیر سفارش یا استعلام"
        ],
        "en": [
          "Enter through a brand, album or design-code search",
          "Narrow the choice by style, colour and room",
          "Review the design and continue to ordering or an enquiry"
        ]
      },
      "takeaway": {
        "fa": "برای کاتالوگ‌های چندبرندی، کیفیت دادهٔ محصول و رابطهٔ میان ویژگی‌ها پیش از طراحی فیلتر مهم است. این نمونه می‌تواند مبنای گفت‌وگو دربارهٔ ساختار فروشگاه شما باشد؛ قابلیت‌های مشابه فقط پس از بررسی داده و محدوده انتخاب می‌شوند.",
        "en": "In multi-brand catalogues, product data and attribute relationships need attention before filters are designed. This example can inform a discussion about your store; similar features are selected only after reviewing data and scope."
      }
    },
    images: PROJECT_HERO_VIEWS["wallpaper-consortium"],
  },
  {
    slug: "niroo-tejarat-atieh",
    title: { fa: "نیرو تجارت آتیه", en: "Niroo Tejarat Atieh" },
    summary: {
      fa: "سایت شرکتی تأمین قطعات یدکی و تجهیزات نیروگاهی و پتروشیمی، با هویت تیره و طلایی.",
      en: "A corporate site for supplying spare parts and equipment to power plants and petrochemicals, in a dark and gold identity.",
    },
    service: { fa: "سایت شرکتی · طراحی و توسعه", en: "Corporate website · Design and development" },
    industry: { fa: "تأمین تجهیزات نیروگاهی و پتروشیمی", en: "Power-plant and petrochemical equipment supply" },
    url: "https://www.nirootejaratatieh.com/",
    host: "nirootejaratatieh.com",
    seo: {
      title: { fa: "نیرو تجارت آتیه؛ نمونه‌کار سایت شرکتی تأمین تجهیزات صنعتی", en: "Niroo Tejarat Atieh: Industrial Supply Corporate Website Case Study" },
      description: {
        fa: "نمونه‌کار طراحی و توسعهٔ سایت شرکتی نیرو تجارت آتیه؛ توانمندی‌ها، شبکهٔ تأمین آلمان و چین، گواهینامه‌ها، پروژه‌های شاخص و درخواست مشاوره.",
        en: "Case study of the Niroo Tejarat Atieh corporate site: capabilities, the Germany and China supply network, certificates, flagship projects and consultation requests.",
      },
    },
    overview: {
      fa: [
        "نیرو تجارت آتیه قطعات یدکی و تجهیزات مکانیکی و الکتریکی نیروگاه‌های برق‌آبی و حرارتی و صنایع پتروشیمی را از مسیر آلمان و چین تأمین می‌کند و پیش از خرید مشاورهٔ فنی می‌دهد. مخاطب سایت مدیر خرید یا مهندسی است که در صنعتی کار می‌کند که توقف در آن گران تمام می‌شود.",
        "سایت باید اعتماد بسازد، نه فقط اطلاعات بدهد. برای همین توانمندی‌ها، بازارها، شبکهٔ تأمین، گواهینامه‌ها و پروژه‌های شاخص با لحنی دقیق و مهندسی چیده شده‌اند و مسیر «درخواست مشاوره» همیشه در دسترس است.",
      ],
      en: [
        "Niroo Tejarat Atieh supplies spare parts and mechanical and electrical equipment for hydro and thermal power plants and petrochemical plants through Germany and China, and gives technical advice before purchase. The audience is a procurement manager or engineer in an industry where downtime is expensive.",
        "The site has to build trust, not just inform. So capabilities, markets, the supply network, certificates and flagship projects are laid out in a precise, engineering tone, with a clear route to request a consultation throughout.",
      ],
    },
    includes: {
      title: { fa: "چه چیزهایی در سایت هست", en: "What the site includes" },
      items: {
        fa: [
          "هویت بصری تیره و طلایی با تصاویر صنعتی در اسلایدر صفحهٔ اصلی",
          "شمارنده‌های کلیدی: پروژه‌های شاخص، قراردادهای امضاشده و هاب‌های تأمین",
          "چهار توانمندی کلیدی: قطعات یدکی و تجهیزات مکانیکی، تجهیزات الکتریکی، ساخت تجهیزات سفارشی و مشاوره پیش از خرید",
          "بازارها و مشتریان: نیروگاه‌های برق‌آبی و حرارتی، صنایع پتروشیمی و زیرساخت‌های لجستیکی",
          "معرفی شبکهٔ تأمین در آلمان و چین",
          "بخش پروژه‌های شاخص با تصویر",
          "بخش گواهینامه‌ها: ایزو ۹۰۰۱، ۱۴۰۰۱، ۴۵۰۰۱، سیستم مدیریت یکپارچه، HSE-MS، ایزو ۱۰۰۰۴ و عضویت اتاق بازرگانی",
          "راه‌های تماس: تماس تلفنی، واتس‌اپ، تلگرام، ایمیل و دکمهٔ درخواست مشاوره در سربرگ",
          "فونت وزیرمتن و طراحی راست‌به‌چین، سازگار با موبایل",
        ],
        en: [
          "A dark and gold visual identity with industrial imagery in the home-page slider",
          "Key counters: flagship projects, signed contracts and supply hubs",
          "Four key capabilities: spare parts and mechanical equipment, electrical equipment, custom equipment manufacturing and pre-purchase advice",
          "Markets and customers: hydro and thermal power plants, petrochemical industry and logistics infrastructure",
          "An introduction to the supply network in Germany and China",
          "A flagship projects section with images",
          "A certificates section: ISO 9001, 14001 and 45001, the integrated management system, HSE-MS, ISO 10004 and chamber of commerce membership",
          "Ways to get in touch: phone, WhatsApp, Telegram, email and a request-a-consultation button in the header",
          "The Vazirmatn font and a right-to-left layout that works on phones",
        ],
      },
    },
    "updatedAt": "2026-11-08",
    "relatedServices": [
      "corporate-website-design",
      "website-design-development",
      "ui-ux-brand-design"
    ],
    "relatedArticles": [
      "corporate-website-pages-features-guide",
      "website-content-preparation-checklist"
    ],
    "caseStudy": {
      "challenge": {
        "fa": "مخاطب تأمین‌کنندهٔ تجهیزات صنعتی، پیش از تماس می‌خواهد حوزهٔ توانمندی، بازارهای تحت پوشش و راه ارتباط مناسب را بفهمد. اطلاعات شرکت، شبکهٔ تأمین و مدارک معرفی باید به‌گونه‌ای مرتب شوند که مدیر خرید یا مهندس بتواند مرتبط‌بودن پیشنهاد را بررسی کند.",
        "en": "Before contacting an industrial supplier, a procurement manager or engineer needs to understand capabilities, served markets and the appropriate contact route. Company information, the supply network and supporting credentials need an organised presentation that helps assess relevance."
      },
      "decisions": [
        {
          "title": {
            "fa": "جداکردن توانمندی و بازار هدف",
            "en": "Separate capabilities and target markets"
          },
          "text": {
            "fa": "خدمات تأمین و مشاوره در بخش توانمندی‌ها معرفی می‌شوند و بازارهایی مثل نیروگاه و پتروشیمی مسیر خودشان را دارند. این تفکیک، موضوع فعالیت شرکت را از کاربرد آن برای مخاطب جدا و خواناتر می‌کند.",
            "en": "Supply and advice appear as capabilities, while markets such as power generation and petrochemicals have their own presentation. This separates what the company does from where those capabilities apply."
          }
        },
        {
          "title": {
            "fa": "قرارگرفتن مدارک کنار معرفی شرکت",
            "en": "Keep supporting material beside the company story"
          },
          "text": {
            "fa": "پروژه‌های شاخص، شبکهٔ تأمین و بخش گواهینامه‌ها در ساختار سایت دیده می‌شوند. این‌ها اطلاعات قابل مشاهدهٔ سایت مشتری‌اند؛ ادعای مستقلی دربارهٔ اعتبارسنجی مدارک یا نتیجهٔ تجاری پروژه مطرح نمی‌کنیم.",
            "en": "Flagship projects, the supply network and a certificates section are visible within the site. These describe the client’s published presentation; we make no separate claim about credential verification or measured commercial outcomes."
          }
        },
        {
          "title": {
            "fa": "تماس در امتداد بررسی خدمت",
            "en": "Continue from a service to an enquiry"
          },
          "text": {
            "fa": "دکمهٔ درخواست مشاوره در سربرگ و راه‌های تماس تلفنی، پیام‌رسان و ایمیل، ادامهٔ بررسی را مشخص می‌کنند. ظاهر تیره و طلایی همراه تصاویر صنعتی، زبان بصری مشترکی برای معرفی توانمندی‌ها می‌سازد.",
            "en": "The header consultation action and phone, messaging and email routes provide a next step after reviewing a service. Dark and gold styling with industrial imagery gives the capabilities a consistent visual presentation."
          }
        }
      ],
      "journey": {
        "fa": [
          "شناخت توانمندی مرتبط با نیاز صنعتی",
          "مرور بازارها، پروژه‌ها و اطلاعات شرکت",
          "انتخاب راه تماس و ارسال درخواست مشاوره"
        ],
        "en": [
          "Identify the capability relevant to the industrial need",
          "Review markets, projects and company information",
          "Choose a contact route and request a consultation"
        ]
      },
      "takeaway": {
        "fa": "برای سایت شرکتی صنعتی، معرفی توانمندی و مسیر درخواست باید کنار هم طراحی شوند. پیش از شروع پروژه، متن خدمات، نمونه‌های مجاز و اطلاعات تماس را آماده کنید تا صفحه‌ها بر اساس اطلاعات واقعی شرکت ساخته شوند.",
        "en": "An industrial corporate website needs to connect capabilities with an enquiry route. Prepare service copy, authorised examples and contact information so the page structure is grounded in the company’s actual material."
      }
    },
    images: PROJECT_HERO_VIEWS["niroo-tejarat-atieh"],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getProjectHref(locale: "fa" | "en", slug: string) {
  return `/${locale}/projects/${slug}`;
}

/** The 1200x630 share card made by scripts/build-project-og.mjs (case studies and concepts alike). */
export function getProjectShareImage(locale: "fa" | "en", slug: string) {
  return { src: `/projects/og/${slug}-${locale}.jpg`, width: 1200, height: 630 };
}

/** Real case studies relevant to a service; concepts are intentionally excluded. */
export function projectsForService(slug: ServiceSlug): Project[] {
  return PROJECTS.filter((project) => project.relatedServices.includes(slug));
}
