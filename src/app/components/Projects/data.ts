// Portfolio case studies. Every statement about a site describes what its live pages show;
// no results, traffic or sales figures are claimed. Screenshots are real captures of the live
// sites (public/projects/<slug>-{cover,2,mobile}.webp) taken on 2026-10-24.

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
    images: [
      {
        src: "/projects/tino-electronic-cover.webp",
        width: 1440,
        height: 900,
        alt: { fa: "صفحهٔ اصلی فروشگاه تینو الکترونیک با دسته‌بندی‌ها و قطعات الکترونیکی", en: "Tino Electronic store home page with categories and electronic components" },
        caption: { fa: "صفحهٔ اصلی: جست‌وجو، دسته‌بندی‌ها و اسلایدر", en: "Home page: search, categories and slider" },
      },
      {
        src: "/projects/tino-electronic-2.webp",
        width: 1440,
        height: 900,
        alt: { fa: "بخش محصولات تخفیف‌دار در فروشگاه تینو الکترونیک با قیمت و وضعیت موجودی", en: "Discounted products section of the Tino Electronic store with prices and stock status" },
        caption: { fa: "محصولات تخفیف‌دار با قیمت و موجودی", en: "Discounted products with price and stock" },
      },
      {
        src: "/projects/tino-electronic-mobile.webp",
        width: 560,
        height: 1212,
        alt: { fa: "نمای موبایل فروشگاه تینو الکترونیک", en: "Mobile view of the Tino Electronic store" },
        caption: { fa: "نمای موبایل", en: "Mobile view" },
      },
    ],
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
    images: [
      {
        src: "/projects/wallpaper-consortium-cover.webp",
        width: 1440,
        height: 900,
        alt: { fa: "صفحهٔ اصلی فروشگاه آنلاین کنسرسیوم کاغذ دیواری با اسلایدر و دسته‌ها", en: "Home page of the Wallpaper Consortium online store with slider and categories" },
        caption: { fa: "صفحهٔ اصلی: اسلایدر، آلبوم‌ها، سبک‌ها و رنگ‌ها", en: "Home page: slider, albums, styles and colors" },
      },
      {
        src: "/projects/wallpaper-consortium-2.webp",
        width: 1440,
        height: 900,
        alt: { fa: "برندهای عضو و آلبوم‌های منتخب در سایت کنسرسیوم کاغذ دیواری", en: "Member brands and featured albums on the Wallpaper Consortium site" },
        caption: { fa: "برندهای عضو و آلبوم‌های منتخب", en: "Member brands and featured albums" },
      },
      {
        src: "/projects/wallpaper-consortium-mobile.webp",
        width: 560,
        height: 1212,
        alt: { fa: "نمای موبایل سایت کنسرسیوم کاغذ دیواری با نوار پیمایش پایین", en: "Mobile view of the Wallpaper Consortium site with the bottom navigation bar" },
        caption: { fa: "نمای موبایل با نوار پیمایش پایین", en: "Mobile view with bottom navigation" },
      },
    ],
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
    url: "https://nirootejaratatieh.com/",
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
    images: [
      {
        src: "/projects/niroo-tejarat-atieh-cover.webp",
        width: 1440,
        height: 900,
        alt: { fa: "صفحهٔ اصلی سایت نیرو تجارت آتیه با تصویر تجهیزات الکتریکی و عنوان «قدرت در مدار، دقت در انتخاب»", en: "Niroo Tejarat Atieh home page with electrical equipment imagery and the headline “Power in the circuit, precision in the choice”" },
        caption: { fa: "صفحهٔ اصلی با اسلایدر تصویری", en: "Home page with image slider" },
      },
      {
        src: "/projects/niroo-tejarat-atieh-2.webp",
        width: 1440,
        height: 900,
        alt: { fa: "بخش اول صفحهٔ اصلی نیرو تجارت آتیه با عنوان «تجهیزات مکانیکی، دقیق و قابل اتکا»", en: "First slide of the Niroo Tejarat Atieh home page with the headline “Mechanical equipment, precise and dependable”" },
        caption: { fa: "اسلاید تجهیزات مکانیکی با شمارنده‌های کلیدی", en: "Mechanical equipment slide with key counters" },
      },
      {
        src: "/projects/niroo-tejarat-atieh-mobile.webp",
        width: 560,
        height: 1212,
        alt: { fa: "نمای موبایل سایت نیرو تجارت آتیه", en: "Mobile view of the Niroo Tejarat Atieh site" },
        caption: { fa: "نمای موبایل", en: "Mobile view" },
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getProjectHref(locale: "fa" | "en", slug: string) {
  return `/${locale}/projects/${slug}`;
}
