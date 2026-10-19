import type { Locale } from "@/app/i18n";

export type BlogSection = {
  heading: { fa: string; en: string };
  paragraphs: { fa: string[]; en: string[] };
  bullets?: { fa: string[]; en: string[] };
};

export type BlogFaqItem = {
  question: { fa: string; en: string };
  answer: { fa: string; en: string };
};

export type BlogPost = {
  slug: string;
  title: { fa: string; en: string };
  /** Shorter <title> when the headline is too long for search results (keep under ~50 characters). */
  seoTitle?: { fa: string; en: string };
  excerpt: { fa: string; en: string };
  /** Meta description when the card excerpt is not 110-160 characters. */
  seoDescription?: { fa: string; en: string };
  tags: string[];
  /** ISO date (YYYY-MM-DD). Required so Article schema and sitemaps carry real dates. */
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: { fa: string; en: string };
  /** A short, self-contained answer shown right under the title—written for featured snippets and AI answer engines (AEO/GEO). */
  directAnswer?: { fa: string; en: string };
  faq?: BlogFaqItem[];
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "wordpress-or-custom-website",
    title: {
      fa: "وردپرس یا سایت اختصاصی؛ کدام انتخاب بهتری است؟",
      en: "WordPress or Custom Development: Which Should You Choose?",
    },
    seoTitle: {
      fa: "وردپرس یا سایت اختصاصی؟ راهنمای انتخاب",
      en: "WordPress vs Custom Website: Which to Choose?",
    },
    excerpt: {
      fa: "مقایسه کاربردی وردپرس و توسعه اختصاصی بر اساس بودجه، زمان لانچ، مدیریت محتوا، سرعت، امنیت و توسعه‌پذیری، همراه با یک چک‌لیست ساده برای تصمیم‌گیری.",
      en: "A practical WordPress vs custom development comparison: budget, launch time, content editing, speed, security, scalability, plus a simple decision checklist.",
    },
    tags: ["WordPress", "Strategy"],
    publishedAt: "2026-02-03",
    updatedAt: "2026-10-19",
    coverImage: "/blog/wordpress-or-custom-website.jpg",
    coverImageAlt: {
      fa: "مقایسه یک قالب آماده وردپرس با کد سفارشی؛ دو پنجره مرورگر کنار هم",
      en: "A WordPress-style template layout beside a custom-code window, compared side by side",
    },
    directAnswer: {
      fa: "اگر سایت شما شرکتی، محتوایی یا فروشگاهی با فرایندهای رایج است و تیمتان باید بدون برنامه‌نویس محتوا را مدیریت کند، وردپرس معمولاً سریع‌تر و اقتصادی‌تر است. اگر محصولتان منطق اختصاصی، پنل‌های پیچیده، نقش‌های کاربری متعدد، اتصال زیاد به سرویس‌های دیگر یا نیاز جدی به سرعت و مقیاس دارد، توسعه اختصاصی کنترل بیشتری می‌دهد. معیار درست، نیاز واقعی کسب‌وکار و هزینه نگهداری در چند سال آینده است، نه محبوبیت یک ابزار.",
      en: "If your site is a business, content, or commerce site with common workflows and your team must edit content without a developer, WordPress is usually faster and cheaper. If your product has custom logic, complex dashboards, many user roles, heavy integrations, or serious speed and scale requirements, custom development gives you more control. The right yardstick is your real business need and the cost of maintenance over the next few years, not the popularity of a tool.",
    },
    sections: [
      {
        heading: { fa: "با تکنولوژی شروع نکنید", en: "Do not start with the technology" },
        paragraphs: {
          fa: [
            "انتخاب درست از هدف سایت شروع می‌شود: چه کسی از آن استفاده می‌کند، چه کاری باید انجام دهد و تیم شما بعد از لانچ چطور محتوا را مدیریت می‌کند. سایتی که فقط معرفی خدمات و جذب سرنخ است با پلتفرمی که سفارش، پرداخت، پنل کاربری و گزارش‌گیری دارد، نیازهای بسیار متفاوتی دارد.",
            "وردپرس و توسعه اختصاصی هر دو می‌توانند خروجی عالی بدهند؛ تفاوت در تناسب راهکار با مسئله است، نه در برنده بودن مطلق یکی از آن‌ها. پیش از انتخاب، فهرست کارهایی را که سایت باید در یک سال آینده انجام دهد بنویسید.",
          ],
          en: [
            "The right choice starts with the goal: who will use the site, what it must do, and how your team will manage content after launch. A site that presents services and collects leads has very different needs from a platform with orders, payments, user dashboards, and reporting.",
            "WordPress and custom development can both produce excellent results. The difference is fit, not one platform being universally better. Before choosing, write down what the site must do over the next year.",
          ],
        },
      },
      {
        heading: { fa: "چه زمانی وردپرس منطقی‌تر است؟", en: "When WordPress makes more sense" },
        paragraphs: {
          fa: ["برای سایت‌های شرکتی، محتوایی و فروشگاه‌هایی با فرایند استاندارد، وردپرس معمولاً مسیر سریع‌تر و اقتصادی‌تری است، چون بخش بزرگی از نیازها از قبل آماده و آزموده شده است."],
          en: ["For business, editorial, and commerce sites with familiar workflows, WordPress is often the faster and more economical route, because much of what you need already exists and has been tested at scale."],
        },
        bullets: {
          fa: [
            "تیم محتوا باید بدون توسعه‌دهنده صفحات و مقالات را مدیریت کند",
            "زمان لانچ کوتاه است و نیازها استاندارد هستند",
            "ووکامرس نیازهای اصلی فروشگاه، از سبد خرید تا درگاه پرداخت، را پوشش می‌دهد",
            "برنامه‌ای برای به‌روزرسانی منظم هسته، قالب و افزونه‌ها وجود دارد",
          ],
          en: [
            "The content team needs to edit pages and posts without a developer",
            "The launch window is short and requirements are standard",
            "WooCommerce covers the core store needs, from cart to payment gateway",
            "There is a plan for regular core, theme, and plugin updates",
          ],
        },
      },
      {
        heading: { fa: "چه زمانی توسعه اختصاصی ارزش دارد؟", en: "When custom development earns its place" },
        paragraphs: {
          fa: ["اگر منطق محصول، نقش‌های کاربری، اتصال سرویس‌ها یا تجربه تعاملی شما خاص است، معماری اختصاصی کنترل و توسعه‌پذیری بیشتری می‌دهد و از اتکا به ده‌ها افزونه جلوگیری می‌کند."],
          en: ["When product logic, user roles, integrations, or interactive experience are distinctive, a custom architecture gives you more control and room to grow, and avoids depending on dozens of plugins."],
        },
        bullets: {
          fa: [
            "محصول فراتر از یک سایت محتوایی است و پنل یا گردش‌کار اختصاصی دارد",
            "اتصال به ERP، CRM، درگاه‌ها یا سرویس‌های دیگر بخش اصلی کار است",
            "سرعت، امنیت و مقیاس‌پذیری نیازمند کنترل دقیق روی کد است",
            "قابلیت‌های آینده از همین حالا روی معماری اثر می‌گذارند",
          ],
          en: [
            "The product goes beyond a content site and needs custom dashboards or workflows",
            "Integrations with ERP, CRM, payment gateways, or other services are central",
            "Speed, security, and scale require precise control over the code",
            "Future capabilities already influence the architecture",
          ],
        },
      },
      {
        heading: { fa: "مقایسه در شش معیار کلیدی", en: "A comparison across six key criteria" },
        paragraphs: {
          fa: ["این مقایسه کلی است و در هر پروژه باید با جزئیات واقعی سنجیده شود:"],
          en: ["This is a general comparison; weigh it against the real details of your project:"],
        },
        bullets: {
          fa: [
            "هزینه اولیه: وردپرس معمولاً کمتر؛ اختصاصی بیشتر، اما بدون هزینه افزونه‌های متعدد",
            "زمان لانچ: وردپرس سریع‌تر؛ اختصاصی به طراحی و توسعه کامل نیاز دارد",
            "مدیریت محتوا: وردپرس آماده و آشنا؛ در اختصاصی باید پنل مدیریت یا CMS در نظر گرفته شود",
            "سرعت: هر دو می‌توانند سریع باشند؛ وردپرس با افزونه‌های زیاد کند می‌شود و اختصاصی کنترل بیشتری دارد",
            "امنیت و نگهداری: وردپرس به به‌روزرسانی منظم نیاز دارد؛ اختصاصی سطح حمله کوچک‌تری دارد ولی تیم فنی می‌خواهد",
            "توسعه‌پذیری: اختصاصی برای منطق پیچیده انعطاف بیشتری دارد؛ وردپرس برای قابلیت‌های رایج کافی است",
          ],
          en: [
            "Upfront cost: WordPress is usually lower; custom is higher but avoids paying for many plugins",
            "Time to launch: WordPress is faster; custom requires full design and development",
            "Content editing: WordPress is ready and familiar; custom needs an admin panel or a CMS",
            "Speed: both can be fast; WordPress slows down with many plugins, custom gives more control",
            "Security and maintenance: WordPress needs regular updates; custom has a smaller attack surface but needs a technical team",
            "Scalability: custom is more flexible for complex logic; WordPress is enough for common features",
          ],
        },
      },
      {
        heading: { fa: "مسیر سوم: ترکیبی یا Headless", en: "A third path: hybrid or headless" },
        paragraphs: {
          fa: [
            "لازم نیست انتخاب صفر و یکی باشد. در معماری headless، وردپرس فقط نقش سیستم مدیریت محتوا را دارد و سایت با فریم‌ورکی مثل Next.js ساخته می‌شود. نتیجه، مدیریت محتوای آشنا به‌همراه سرعت و انعطاف کد اختصاصی است.",
            "این مسیر پیچیدگی و هزینه نگهداری بیشتری از وردپرس معمولی دارد و وقتی ارزش دارد که هم تیم محتوای فعال دارید و هم تجربه کاربری یا سرعت برایتان حیاتی است.",
          ],
          en: [
            "The choice does not have to be all or nothing. In a headless architecture, WordPress acts only as the content management system and the site itself is built with a framework such as Next.js. You get familiar content editing plus the speed and flexibility of custom code.",
            "This path costs more to build and maintain than standard WordPress, and it is worth it when you have an active content team and the user experience or speed is critical.",
          ],
        },
      },
      {
        heading: { fa: "یک چک‌لیست ساده برای تصمیم", en: "A simple decision checklist" },
        paragraphs: {
          fa: ["به این پرسش‌ها صادقانه پاسخ دهید؛ اگر بیشتر پاسخ‌ها «بله» است، توسعه اختصاصی را جدی بگیرید:"],
          en: ["Answer these honestly; if most answers are yes, take custom development seriously:"],
        },
        bullets: {
          fa: [
            "آیا کاربران پس از ورود کارهایی فراتر از دیدن محتوا انجام می‌دهند؟",
            "آیا سایت باید به سیستم‌های داخلی مثل حسابداری، انبار یا CRM وصل شود؟",
            "آیا برای انجام کارهای اصلی به بیش از چند افزونه نیاز دارید؟",
            "آیا قرار است ظرف یک تا دو سال قابلیت‌های جدید و خاص اضافه شود؟",
            "آیا تیم یا شریک فنی برای نگهداری بلندمدت کد دارید؟",
          ],
          en: [
            "Do signed-in users do more than read content?",
            "Must the site connect to internal systems such as accounting, inventory, or CRM?",
            "Would the core features need more than a handful of plugins?",
            "Will new, distinctive features be added within one to two years?",
            "Do you have a team or technical partner for long-term maintenance of the code?",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا وردپرس برای سئو مناسب است؟", en: "Is WordPress good for SEO?" },
        answer: {
          fa: "بله، به شرط تنظیم درست. سئو به ساختار فنی، سرعت، محتوای مفید و لینک‌سازی بستگی دارد. وردپرس با قالب سبک، افزونه‌های محدود و تنظیم صحیح عنوان‌ها، نقشه سایت و داده ساختاریافته می‌تواند در گوگل عملکرد بسیار خوبی داشته باشد.",
          en: "Yes, when it is set up properly. SEO depends on technical structure, speed, useful content, and links. With a lightweight theme, few plugins, and correct titles, sitemap, and structured data, WordPress can perform very well in Google.",
        },
      },
      {
        question: { fa: "آیا وردپرس امن است؟", en: "Is WordPress secure?" },
        answer: {
          fa: "هسته وردپرس به‌طور منظم به‌روزرسانی امنیتی می‌شود. بیشتر مشکلات از افزونه‌ها یا قالب‌های قدیمی و بی‌کیفیت، رمزهای ضعیف و نبود بکاپ می‌آید. با به‌روزرسانی منظم، افزونه‌های معتبر، دسترسی محدود و بکاپ خودکار، ریسک به‌شدت کاهش می‌یابد.",
          en: "The WordPress core receives regular security updates. Most problems come from outdated or low-quality plugins and themes, weak passwords, and missing backups. Regular updates, reputable plugins, limited access, and automatic backups reduce the risk significantly.",
        },
      },
      {
        question: { fa: "اگر الان وردپرس انتخاب کنم، بعداً می‌توانم به سایت اختصاصی مهاجرت کنم؟", en: "If I choose WordPress now, can I move to a custom site later?" },
        answer: {
          fa: "بله. محتوا قابل انتقال است و با حفظ ساختار آدرس‌ها یا ریدایرکت ۳۰۱ صحیح، رتبه سئو حفظ می‌شود. فقط هزینه مهاجرت را از ابتدا در برنامه در نظر بگیرید.",
          en: "Yes. Content can be migrated, and by keeping the URL structure or adding correct 301 redirects you preserve SEO rankings. Just budget for the migration from the start.",
        },
      },
    ],
  },
  {
    slug: "google-seo-launch-checklist",
    title: {
      fa: "چک‌لیست سئو و ابزارهای گوگل پیش از لانچ سایت",
      en: "The SEO and Google Checklist Before Launching a Website",
    },
    seoTitle: {
      fa: "چک‌لیست سئو پیش از لانچ سایت",
      en: "SEO Checklist Before Launching a Website",
    },
    excerpt: {
      fa: "پیش از انتشار سایت این موارد را بررسی کنید: ایندکس، robots و sitemap، canonical و hreflang، داده ساختاریافته، سرعت، ریدایرکت‌ها، Search Console و GA4.",
      en: "Check these before launch: indexing, robots.txt and sitemap, canonical and hreflang, structured data, speed, redirects, Search Console, and GA4.",
    },
    tags: ["SEO", "Google"],
    publishedAt: "2026-02-17",
    updatedAt: "2026-10-19",
    coverImage: "/blog/google-seo-launch-checklist.jpg",
    coverImageAlt: {
      fa: "چک‌لیست سئو و ذره‌بین روی نمودار رشد، نمادی از آماده‌سازی سایت برای گوگل",
      en: "An SEO launch checklist next to a magnifying glass over a rising growth chart",
    },
    directAnswer: {
      fa: "پیش از لانچ مطمئن شوید: سایت فقط روی یک نسخه HTTPS و یک دامنه اصلی در دسترس است؛ robots.txt صفحات مهم را مسدود نمی‌کند و تگ noindex محیط آزمایشی حذف شده؛ نقشه سایت (sitemap) و canonical هر صفحه درست است؛ عنوان، توضیح و H1 هر صفحه یکتاست؛ داده ساختاریافته معتبر است؛ سرعت روی موبایل قابل قبول است؛ آدرس‌های قدیمی با ریدایرکت ۳۰۱ منتقل شده‌اند؛ و Search Console و GA4 از روز اول نصب و تست شده‌اند.",
      en: "Before launch, make sure: the site resolves to a single HTTPS version on one main domain; robots.txt does not block important pages and the staging noindex tag is gone; the sitemap and each page's canonical are correct; every page has a unique title, description, and H1; structured data validates; mobile speed is acceptable; old URLs are moved with 301 redirects; and Search Console and GA4 are installed and tested from day one.",
    },
    sections: [
      {
        heading: { fa: "اول مطمئن شوید سایت قابل کشف است", en: "First, make sure the site is discoverable" },
        paragraphs: {
          fa: ["ظاهر عالی زمانی ارزش تجاری پیدا می‌کند که موتور جست‌وجو بتواند صفحات درست را پیدا، درک و ایندکس کند. رایج‌ترین خطای لانچ، باقی ماندن تنظیمات محیط آزمایشی روی سایت اصلی است."],
          en: ["A polished website creates business value only when search engines can find, understand, and index the right pages. The most common launch mistake is leaving staging settings on the live site."],
        },
        bullets: {
          fa: [
            "robots.txt و meta robots محیط نهایی را بررسی کنید و noindex آزمایشی را بردارید",
            "فقط یک نسخه سایت در دسترس باشد: HTTPS و با یا بدون www، و بقیه با ۳۰۱ به آن منتقل شوند",
            "نقشه سایت XML فقط آدرس‌های نهایی و قابل ایندکس را داشته باشد",
            "صفحات خطا با کد واقعی ۴۰۴ پاسخ دهند، نه ۲۰۰",
          ],
          en: [
            "Review robots.txt and page-level robots directives in production and remove the staging noindex",
            "Expose a single version of the site, HTTPS with or without www, and 301 everything else to it",
            "Keep only final, indexable URLs in the XML sitemap",
            "Make error pages answer with a real 404 status, not 200",
          ],
        },
      },
      {
        heading: { fa: "آدرس‌ها، canonical و زبان‌ها", en: "URLs, canonicals, and languages" },
        paragraphs: {
          fa: [
            "هر صفحه باید یک آدرس اصلی و ثابت داشته باشد و تگ canonical به همان اشاره کند. نسخه‌های تکراری مثل آدرس با و بدون اسلش پایانی یا پارامترهای اضافه، اعتبار صفحه را تقسیم می‌کنند.",
            "اگر سایت چندزبانه است، برای هر زبان آدرس جدا و تگ hreflang دوطرفه بگذارید و یک نسخه پیش‌فرض با x-default تعیین کنید. اگر سایت قبلی دارید، فهرست آدرس‌های قدیمی را تهیه و برای هر کدام ریدایرکت ۳۰۱ به معادل جدید تعریف کنید.",
          ],
          en: [
            "Each page needs one stable primary URL, and its canonical tag should point to it. Duplicates such as with and without a trailing slash, or extra parameters, split a page's authority.",
            "For multilingual sites, give each language its own URL with reciprocal hreflang tags and set a default with x-default. If you are replacing an older site, list the old URLs and map each one to its new equivalent with a 301 redirect.",
          ],
        },
      },
      {
        heading: { fa: "محتوای هر صفحه را برای انسان و ماشین بنویسید", en: "Write every page for people and machines" },
        paragraphs: {
          fa: ["گوگل و موتورهای پاسخ‌گوی هوش مصنوعی صفحه‌ای را بهتر درک می‌کنند که ساختار روشن و هدف مشخص دارد."],
          en: ["Google and AI answer engines understand a page better when its structure is clear and its purpose is obvious."],
        },
        bullets: {
          fa: [
            "عنوان (title) یکتا و حدوداً تا ۶۰ کاراکتر، و توضیح متا جذاب بین ۱۲۰ تا ۱۶۰ کاراکتر",
            "یک H1 روشن در هر صفحه و H2/H3 به ترتیب منطقی",
            "متن جایگزین (alt) توصیفی برای تصاویر مهم",
            "لینک داخلی از صفحات مرتبط به صفحات خدمات و مقالات کلیدی",
            "داده ساختاریافته مثل Organization، Article، BreadcrumbList و FAQPage، دقیقاً مطابق محتوای قابل مشاهده",
          ],
          en: [
            "A unique title of roughly up to 60 characters and a compelling meta description of 120 to 160",
            "One clear H1 per page with H2/H3 in a logical order",
            "Descriptive alt text for meaningful images",
            "Internal links from related pages to key services and articles",
            "Structured data such as Organization, Article, BreadcrumbList, and FAQPage that matches the visible content exactly",
          ],
        },
      },
      {
        heading: { fa: "سرعت و تجربه کاربری روی موبایل", en: "Speed and user experience on mobile" },
        paragraphs: {
          fa: [
            "گوگل ایندکس را بر اساس نسخه موبایل انجام می‌دهد. شاخص‌های Core Web Vitals را روی موبایل واقعی بسنجید: LCP تا ۲٫۵ ثانیه، INP تا ۲۰۰ میلی‌ثانیه و CLS تا ۰٫۱ در محدوده خوب قرار می‌گیرند.",
            "تصاویر بزرگ و فشرده‌نشده، فونت‌های سنگین، اسکریپت‌های شخص ثالث و ویدیوهای حجیم، رایج‌ترین دلایل کندی در روز لانچ هستند.",
          ],
          en: [
            "Google indexes the mobile version of your site. Measure Core Web Vitals on real mobile conditions: LCP up to 2.5 seconds, INP up to 200 milliseconds, and CLS up to 0.1 count as good.",
            "Large uncompressed images, heavy fonts, third-party scripts, and oversized videos are the most common reasons a site is slow on launch day.",
          ],
        },
      },
      {
        heading: { fa: "اندازه‌گیری را قبل از ترافیک آماده کنید", en: "Set up measurement before traffic arrives" },
        paragraphs: {
          fa: ["اگر Search Console و Analytics بعداً اضافه شوند، نقطه شروع و بخشی از رفتار روزهای اول را از دست می‌دهید. رویدادهای مهم را قبل از لانچ تعریف و تست کنید."],
          en: ["Adding Search Console and Analytics later means losing the baseline and early user behavior. Define and test meaningful events before launch."],
        },
        bullets: {
          fa: [
            "اتصال دامنه به Google Search Console و ارسال نقشه سایت",
            "نصب GA4 یا تگ منیجر با رضایت و حریم خصوصی مناسب",
            "ثبت فرم، تماس، خرید یا اقدام اصلی به‌عنوان conversion",
            "ثبت سایت در Bing Webmaster Tools، که برای دیده‌شدن در برخی موتورهای پاسخ‌گو هم مفید است",
          ],
          en: [
            "Verify the domain in Google Search Console and submit the sitemap",
            "Install GA4 or Tag Manager with appropriate consent and privacy",
            "Track forms, calls, purchases, or the primary action as conversions",
            "Register the site in Bing Webmaster Tools, which also helps visibility in some AI answer engines",
          ],
        },
      },
      {
        heading: { fa: "لانچ، شروع فرایند سئو است", en: "Launch is the start of SEO" },
        paragraphs: {
          fa: ["بعد از انتشار، گزارش پوشش ایندکس، کوئری‌ها، صفحات فرود و تبدیل‌ها را هفتگی بررسی کنید. خطاهای ۴۰۴، صفحات ایندکس‌نشده و افت ناگهانی کلیک را سریع پیگیری کنید. سئو با یک چک‌لیست تمام نمی‌شود؛ داده واقعی جهت مرحله بعد را مشخص می‌کند."],
          en: ["After release, review index coverage, queries, landing pages, and conversions every week. Follow up quickly on 404 errors, pages that are not indexed, and sudden drops in clicks. SEO does not end with a checklist; real data shapes the next improvement."],
        },
      },
    ],
    faq: [
      {
        question: { fa: "چقدر طول می‌کشد تا گوگل سایت جدید را ایندکس کند؟", en: "How long does Google take to index a new site?" },
        answer: {
          fa: "معمولاً از چند روز تا چند هفته. ارسال نقشه سایت و درخواست ایندکس صفحات مهم در Search Console این روند را سریع‌تر می‌کند، اما زمان دقیق تضمین‌شده‌ای وجود ندارد.",
          en: "Usually from a few days to a few weeks. Submitting the sitemap and requesting indexing for key pages in Search Console speeds it up, but there is no guaranteed timeline.",
        },
      },
      {
        question: { fa: "آیا نسخه آزمایشی سایت باید noindex باشد؟", en: "Should the staging site be noindex?" },
        answer: {
          fa: "بله. محیط آزمایشی را با رمز یا noindex از دسترس موتورها دور نگه دارید و دقیقاً هنگام لانچ مطمئن شوید این تنظیم روی سایت اصلی منتقل نشده است.",
          en: "Yes. Keep staging away from search engines with a password or noindex, and at launch make sure that setting has not carried over to the live site.",
        },
      },
      {
        question: { fa: "آیا هم Search Console لازم است و هم GA4؟", en: "Do I need both Search Console and GA4?" },
        answer: {
          fa: "بله، چون کارشان متفاوت است. Search Console نشان می‌دهد سایت در جست‌وجوی گوگل چگونه دیده می‌شود؛ GA4 نشان می‌دهد کاربران پس از ورود به سایت چه می‌کنند.",
          en: "Yes, because they do different jobs. Search Console shows how the site appears in Google Search; GA4 shows what users do once they arrive.",
        },
      },
    ],
  },
  {
    slug: "practical-ai-automation",
    title: {
      fa: "چطور یک اتوماسیون هوش مصنوعی واقعاً مفید بسازیم؟",
      en: "How to Build AI Automation That Is Actually Useful",
    },
    seoTitle: {
      fa: "ساخت اتوماسیون هوش مصنوعی کاربردی",
      en: "How to Build Useful AI Automation",
    },
    excerpt: {
      fa: "از انتخاب مسئله درست و ساخت نمونه کوچک تا اتصال امن داده‌ها، سنجش کیفیت، کنترل هزینه و نقش انسان؛ راهنمای عملی اتوماسیون هوش مصنوعی برای کسب‌وکار.",
      en: "From choosing the right problem and a small pilot to secure data access, quality evaluation, cost control, and human review: a practical guide to business AI automation.",
    },
    seoDescription: {
      fa: "از انتخاب مسئله درست و ساخت نمونه کوچک تا اتصال امن داده‌ها، سنجش کیفیت، کنترل هزینه و نقش انسان؛ راهنمای عملی اتوماسیون هوش مصنوعی برای کسب‌وکار.",
      en: "Choose the right problem, pilot small, connect data securely, evaluate quality, control cost, and keep humans in the loop: a practical AI automation guide.",
    },
    tags: ["AI", "Automation"],
    publishedAt: "2026-03-03",
    updatedAt: "2026-10-19",
    coverImage: "/blog/practical-ai-automation.jpg",
    coverImageAlt: {
      fa: "شبکه‌ای از گره‌های متصل به یک تراشه هوش مصنوعی در مرکز",
      en: "Connected nodes around a central AI chip, representing workflow automation",
    },
    directAnswer: {
      fa: "اتوماسیون هوش مصنوعی وقتی مفید است که یک کار تکراری، زمان‌بر و قابل اندازه‌گیری را بهتر یا ارزان‌تر انجام دهد. با یک مسئله کوچک و روشن شروع کنید، مدل را فقط به داده‌های لازم وصل کنید، با مجموعه تست واقعی کیفیت را بسنجید، برای اطمینان پایین مسیر ارجاع به انسان بگذارید و هزینه هر درخواست را از ابتدا کنترل کنید. دموی خوب با سیستم آماده استفاده واقعی فرق دارد.",
      en: "AI automation is useful when it does a repetitive, time-consuming, measurable task better or more cheaply. Start with a small, clear problem, connect the model only to the data it needs, measure quality with a real test set, route low-confidence cases to a person, and control the cost per request from the start. A good demo is not the same as a system ready for real use.",
    },
    sections: [
      {
        heading: { fa: "از مدل شروع نکنید؛ از اصطکاک شروع کنید", en: "Start with friction, not a model" },
        paragraphs: {
          fa: [
            "اول یک کار تکراری، زمان‌بر و قابل اندازه‌گیری پیدا کنید. اگر نتوانید زمان، هزینه یا کیفیت فعلی را توضیح دهید، موفقیت راهکار هوش مصنوعی هم قابل سنجش نخواهد بود.",
            "بهترین پروژه اول معمولاً کوچک است: محدوده روشن، داده قابل دسترس و انسانی که بتواند خروجی را ارزیابی کند.",
          ],
          en: [
            "Find a repetitive, expensive, and measurable workflow first. If current time, cost, or quality cannot be described, AI success will be impossible to evaluate.",
            "The best first project is usually small: clear scope, available data, and a knowledgeable person who can judge the output.",
          ],
        },
      },
      {
        heading: { fa: "نمونه‌های مناسب برای شروع", en: "Good first use cases" },
        paragraphs: {
          fa: ["کارهایی که پاسخ قابل بررسی دارند و در صورت اطمینان پایین می‌توانند به اپراتور انسانی ارجاع شوند، گزینه‌های امن‌تری برای شروع هستند."],
          en: ["Workflows with reviewable answers and a clear human fallback are safer, more useful places to start."],
        },
        bullets: {
          fa: [
            "جست‌وجو و پاسخ بر اساس اسناد داخلی سازمان",
            "دسته‌بندی، اولویت‌بندی و خلاصه‌سازی درخواست‌ها و تیکت‌های ورودی",
            "پیش‌نویس پاسخ پشتیبانی یا فروش با تأیید انسان",
            "استخراج اطلاعات ساختاریافته از فاکتور، فرم و فایل",
          ],
          en: [
            "Search and answers grounded in internal documents",
            "Classifying, prioritizing, and summarizing inbound requests and tickets",
            "Support or sales reply drafts with human approval",
            "Structured data extraction from invoices, forms, and files",
          ],
        },
      },
      {
        heading: { fa: "معماری پیشنهادی: داده، ابزار و انسان در حلقه", en: "A recommended architecture: data, tools, and a human in the loop" },
        paragraphs: {
          fa: [
            "برای پاسخ بر اساس اسناد، الگوی بازیابی و تولید (RAG) معمولاً از آموزش دوباره مدل مناسب‌تر است: اسناد مرتبط جست‌وجو می‌شوند و مدل فقط بر اساس همان‌ها پاسخ می‌دهد. این کار پاسخ را قابل ردیابی و به‌روز نگه می‌دارد.",
            "وقتی سیستم باید کاری انجام دهد، مثل ثبت تیکت یا به‌روزرسانی CRM، مدل را به ابزارهای محدود و مشخص وصل کنید و کارهای حساس را به تأیید انسان بسپارید. هر اقدام باید ثبت و قابل بازگشت باشد.",
          ],
          en: [
            "For answers based on documents, retrieval-augmented generation (RAG) usually beats retraining a model: relevant documents are retrieved and the model answers only from them. This keeps answers traceable and current.",
            "When the system must act, such as filing a ticket or updating the CRM, connect the model to a small set of well-defined tools and leave sensitive actions to human approval. Every action should be logged and reversible.",
          ],
        },
      },
      {
        heading: { fa: "کیفیت، امنیت و هزینه را با هم بسنجید", en: "Measure quality, security, and cost together" },
        paragraphs: {
          fa: ["یک دموی خوب الزاماً سیستم آماده تولید نیست. سطح دسترسی داده، ثبت خطا، هزینه هر درخواست، سرعت پاسخ و روش بازگشت به انسان باید پیش از استفاده واقعی مشخص باشند."],
          en: ["A strong demo is not automatically production-ready. Data access, failure logging, cost per request, response time, and human escalation all need to be designed before real use."],
        },
        bullets: {
          fa: [
            "برای پاسخ‌های کلیدی مجموعه تست واقعی بسازید و پیش از هر تغییر اجرا کنید",
            "اطلاعات حساس را حداقلی، ناشناس و کنترل‌شده در دسترس مدل قرار دهید",
            "برای اطمینان پایین، خطا یا موضوعات حساس مسیر جایگزین و ارجاع به انسان تعریف کنید",
            "برای مصرف روزانه سقف هزینه بگذارید و بازخورد کاربران را به چرخه بهبود برگردانید",
          ],
          en: [
            "Build a real evaluation set for critical answers and run it before every change",
            "Give the model only minimal, anonymized, controlled access to sensitive data",
            "Define fallbacks and human escalation for low confidence, failures, or sensitive topics",
            "Cap daily spend and feed user feedback back into the improvement loop",
          ],
        },
      },
      {
        heading: { fa: "از نمونه تا استفاده واقعی در چهار مرحله", en: "From pilot to real use in four stages" },
        paragraphs: {
          fa: ["مرحله‌ای جلو رفتن، ریسک را کنترل و اعتماد تیم را جلب می‌کند:"],
          en: ["Moving in stages controls risk and earns the team's trust:"],
        },
        bullets: {
          fa: [
            "۱. نمونه کوچک روی داده واقعی و ارزیابی دستی خروجی‌ها",
            "۲. ساخت مجموعه تست و تعیین معیار موفقیت، مثل دقت یا زمان صرفه‌جویی‌شده",
            "۳. استفاده محدود با تأیید انسان برای همه خروجی‌ها",
            "۴. خودکارسازی موارد کم‌ریسک و پایش مداوم کیفیت و هزینه",
          ],
          en: [
            "1. A small pilot on real data with manual review of outputs",
            "2. An evaluation set and a success metric such as accuracy or time saved",
            "3. Limited use with human approval of every output",
            "4. Automating low-risk cases with continuous monitoring of quality and cost",
          ],
        },
      },
      {
        heading: { fa: "ملاحظات کسب‌وکارهای ایرانی", en: "Considerations for businesses in Iran" },
        paragraphs: {
          fa: [
            "برخی سرویس‌های هوش مصنوعی خارجی برای کاربران ایرانی در دسترس نیستند یا پرداخت آن‌ها ممکن نیست. پیش از طراحی، دسترسی پایدار به مدل را بررسی کنید. مدل‌های متن‌باز که روی سرور خودتان اجرا می‌شوند یا سرویس‌های در دسترس، جایگزین‌های رایج هستند و داده را هم نزد شما نگه می‌دارند.",
            "معماری را طوری بسازید که تغییر ارائه‌دهنده مدل بدون بازنویسی کل سیستم ممکن باشد؛ این کار هم ریسک دسترسی و هم هزینه را کنترل می‌کند.",
          ],
          en: [
            "Some foreign AI services are not available to users in Iran, or cannot be paid for. Check stable access to the model before designing anything. Open-source models running on your own server, or accessible providers, are common alternatives and also keep data with you.",
            "Build the architecture so the model provider can be swapped without rewriting the whole system; this controls both access risk and cost.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا اتوماسیون هوش مصنوعی گران است؟", en: "Is AI automation expensive?" },
        answer: {
          fa: "به حجم استفاده و مدل بستگی دارد. هزینه معمولاً به ازای هر درخواست محاسبه می‌شود؛ با یک نمونه کوچک، انتخاب مدل متناسب و سقف هزینه روزانه می‌توان پیش از سرمایه‌گذاری بزرگ، صرفه اقتصادی را سنجید.",
          en: "It depends on volume and the model. Cost is usually charged per request; a small pilot, a right-sized model, and a daily spending cap let you measure the return before a large investment.",
        },
      },
      {
        question: { fa: "آیا هوش مصنوعی جای کارکنان را می‌گیرد؟", en: "Will AI replace staff?" },
        answer: {
          fa: "در بیشتر کسب‌وکارها، هوش مصنوعی کارهای تکراری را سریع‌تر می‌کند و کارکنان روی تصمیم‌ها و ارتباط انسانی تمرکز می‌کنند. بهترین نتایج معمولاً با حضور انسان در حلقه تأیید به دست می‌آید.",
          en: "In most businesses AI speeds up repetitive work while staff focus on decisions and human relationships. The best results usually come with a person in the approval loop.",
        },
      },
      {
        question: { fa: "چطور داده‌های کسب‌وکار امن بماند؟", en: "How do we keep business data safe?" },
        answer: {
          fa: "فقط داده لازم را به مدل بدهید، اطلاعات شخصی را حذف یا ناشناس کنید، دسترسی‌ها را محدود و همه درخواست‌ها را ثبت کنید، و شرایط نگهداری داده ارائه‌دهنده مدل را پیش از استفاده بخوانید.",
          en: "Send the model only the data it needs, remove or anonymize personal information, restrict access and log every request, and read the model provider's data retention terms before use.",
        },
      },
    ],
  },
  {
    slug: "nextjs-performance-app-router",
    title: {
      fa: "بهینه‌سازی عملکرد در Next.js (App Router)",
      en: "Optimizing Performance in Next.js (App Router)",
    },
    excerpt: {
      fa: "راهنمای عملی سریع‌تر کردن سایت‌های Next.js با App Router: تفکیک Server و Client Components، تصاویر، فونت‌ها، رندر استاتیک و کش، dynamic import و Core Web Vitals.",
      en: "A practical guide to faster Next.js App Router sites: Server vs Client Components, images, fonts, static rendering and caching, dynamic imports, and Core Web Vitals.",
    },
    seoDescription: {
      fa: "راهنمای عملی سریع‌تر کردن سایت Next.js با App Router: Server Components، تصاویر و فونت‌ها، رندر استاتیک و کش، dynamic import و Core Web Vitals.",
      en: "Make Next.js App Router sites faster: Server Components, images and fonts, static rendering and caching, dynamic imports, and Core Web Vitals.",
    },
    tags: ["Next.js", "Frontend"],
    publishedAt: "2026-03-17",
    updatedAt: "2026-10-19",
    coverImage: "/blog/nextjs-performance-app-router.jpg",
    coverImageAlt: {
      fa: "سرعت‌سنج با عقربه در ناحیه سریع و نماد رعد برای عملکرد Next.js",
      en: "A speed gauge with the needle in the fast zone and a lightning bolt, for Next.js performance",
    },
    directAnswer: {
      fa: "برای سریع‌تر کردن سایت Next.js بیشتر صفحه را Server Component نگه دارید و فقط بخش‌های تعاملی را Client کنید؛ تصاویر را با next/image و ابعاد درست بارگذاری کنید و priority را فقط به تصویر اصلی بالای صفحه بدهید؛ فونت‌ها را با next/font و بدون جابه‌جایی صفحه لود کنید؛ صفحات قابل پیش‌ساخت را استاتیک بسازید و داده را آگاهانه کش کنید؛ کتابخانه‌های سنگین را با dynamic import عقب بیندازید؛ و نتیجه را با Core Web Vitals روی موبایل واقعی بسنجید.",
      en: "To speed up a Next.js site, keep most of the page as Server Components and make only interactive parts Client Components; load images with next/image at the right size and give priority only to the main above-the-fold image; load fonts with next/font without layout shift; pre-render pages statically where possible and cache data deliberately; defer heavy libraries with dynamic import; and measure the result with Core Web Vitals on real mobile devices.",
    },
    sections: [
      {
        heading: { fa: "تقسیم‌بندی درست Server و Client Components", en: "Split Server and Client Components correctly" },
        paragraphs: {
          fa: [
            "در App Router کامپوننت‌ها به‌صورت پیش‌فرض Server Component هستند و جاوااسکریپتی به مرورگر نمی‌فرستند. هر جا \"use client\" بنویسید، آن کامپوننت و همه چیزهایی که import می‌کند وارد باندل کاربر می‌شوند؛ پس این مرز را تا حد ممکن پایین و نزدیک به همان دکمه یا فرم تعاملی بگذارید.",
            "یک الگوی مفید این است که بخش‌های ثابت را در Server Component بسازید و به‌صورت children به کامپوننت تعاملی بدهید. به این ترتیب منو یا اسلایدر تعاملی می‌ماند، اما محتوای داخلش جاوااسکریپت اضافه نمی‌سازد.",
          ],
          en: [
            "In the App Router, components are Server Components by default and ship no JavaScript to the browser. Wherever you write \"use client\", that component and everything it imports enter the user's bundle, so push that boundary as low as possible, close to the actual interactive button or form.",
            "A useful pattern is to build static parts in a Server Component and pass them as children to the interactive component. The menu or slider stays interactive, but the content inside it adds no extra JavaScript.",
          ],
        },
      },
      {
        heading: { fa: "تصاویر و LCP", en: "Images and LCP" },
        paragraphs: {
          fa: ["در بیشتر صفحات، بزرگ‌ترین عنصر بالای صفحه یک تصویر است و همان، شاخص LCP را تعیین می‌کند."],
          en: ["On most pages the largest above-the-fold element is an image, and it decides your LCP."],
        },
        bullets: {
          fa: [
            "از next/image با width و height یا fill همراه با sizes درست استفاده کنید تا CLS صفر بماند",
            "فقط به تصویر اصلی بالای صفحه priority بدهید؛ بقیه به‌صورت تنبل بارگذاری شوند",
            "تصویر LCP را هیچ‌وقت lazy-load نکنید و از فرمت‌های WebP یا AVIF استفاده کنید",
            "تصاویر را متناسب با بیشترین اندازه نمایش، و نه چند برابر آن، ذخیره کنید",
          ],
          en: [
            "Use next/image with width and height, or fill with correct sizes, so CLS stays at zero",
            "Give priority only to the main above-the-fold image; let the rest lazy-load",
            "Never lazy-load the LCP image, and use WebP or AVIF formats",
            "Store images at their largest display size, not several times larger",
          ],
        },
      },
      {
        heading: { fa: "فونت‌ها بدون جابه‌جایی صفحه", en: "Fonts without layout shift" },
        paragraphs: {
          fa: [
            "next/font فونت را روی همان دامنه سایت میزبانی می‌کند، فقط زیرمجموعه لازم را می‌سازد و با تنظیم فونت جایگزین، جابه‌جایی متن هنگام لود فونت اصلی را کم می‌کند. برای فونت‌های فارسی هم فقط وزن‌هایی را بارگذاری کنید که واقعاً در طراحی استفاده می‌شوند و فرمت woff2 را ترجیح دهید.",
          ],
          en: [
            "next/font self-hosts fonts on your own domain, builds only the subset you need, and tunes a fallback font to reduce text shifting when the real font loads. For Persian fonts too, load only the weights you actually use and prefer the woff2 format.",
          ],
        },
      },
      {
        heading: { fa: "رندر استاتیک، استریم و کش", en: "Static rendering, streaming, and caching" },
        paragraphs: {
          fa: [
            "صفحه‌ای که برای همه کاربران یکسان است باید هنگام build ساخته شود؛ برای مسیرهای پویا مثل مقاله‌ها از generateStaticParams استفاده کنید. خواندن cookies یا headers، صفحه را به رندر پویا می‌برد؛ فقط وقتی واقعاً لازم است از آن‌ها استفاده کنید.",
            "اگر بخشی از صفحه کند است، آن را در Suspense بگذارید تا بقیه صفحه زودتر استریم و نمایش داده شود. در نسخه‌های جدید Next.js رفتار کش داده باید صریح تعریف شود؛ پیش از تصمیم، مستندات همان نسخه‌ای را که استفاده می‌کنید بخوانید.",
          ],
          en: [
            "A page that is the same for every user should be built at build time; for dynamic routes such as articles, use generateStaticParams. Reading cookies or headers moves a page to dynamic rendering, so use them only when really needed.",
            "If part of a page is slow, wrap it in Suspense so the rest streams and displays sooner. In recent Next.js versions, data caching has to be declared explicitly; read the documentation for the exact version you use before deciding.",
          ],
        },
      },
      {
        heading: { fa: "بودجه جاوااسکریپت", en: "A JavaScript budget" },
        paragraphs: {
          fa: ["هر کیلوبایت جاوااسکریپت روی موبایل باید دانلود، پردازش و اجرا شود و مستقیماً روی INP و زمان تعامل اثر می‌گذارد."],
          en: ["Every kilobyte of JavaScript must be downloaded, parsed, and executed on mobile, and it directly affects INP and time to interactive."],
        },
        bullets: {
          fa: [
            "نمودار، ویرایشگر، نقشه و صحنه سه‌بعدی را با dynamic import و فقط هنگام نیاز بارگذاری کنید",
            "باندل را با ابزار تحلیل باندل بررسی و کتابخانه‌های بزرگ کم‌استفاده را جایگزین کنید",
            "اسکریپت‌های شخص ثالث را با next/script و استراتژی مناسب، مثل lazyOnload، عقب بیندازید",
            "ویجت‌هایی که فقط گاهی لازم‌اند را تا پیش از تعامل کاربر بارگذاری نکنید",
          ],
          en: [
            "Load charts, editors, maps, and 3D scenes with dynamic import only when needed",
            "Inspect the bundle with an analyzer and replace large, rarely used libraries",
            "Defer third-party scripts with next/script and a suitable strategy such as lazyOnload",
            "Do not load occasionally needed widgets until the user interacts",
          ],
        },
      },
      {
        heading: { fa: "اندازه‌گیری درست", en: "Measure the right way" },
        paragraphs: {
          fa: [
            "شاخص‌های Core Web Vitals برای تجربه خوب: LCP تا ۲٫۵ ثانیه، INP تا ۲۰۰ میلی‌ثانیه و CLS تا ۰٫۱. Lighthouse داده آزمایشگاهی می‌دهد و برای یافتن مشکل مفید است، اما معیار گوگل داده کاربران واقعی است که در PageSpeed Insights و Search Console دیده می‌شود.",
            "پس از هر تغییر مهم، همان صفحات کلیدی را دوباره روی موبایل بسنجید و تغییرات را با هم مقایسه کنید.",
          ],
          en: [
            "Core Web Vitals thresholds for a good experience: LCP up to 2.5 seconds, INP up to 200 milliseconds, and CLS up to 0.1. Lighthouse gives lab data that helps find problems, but Google's yardstick is real-user data, visible in PageSpeed Insights and Search Console.",
            "After every significant change, measure the same key pages on mobile again and compare the results.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا App Router از Pages Router سریع‌تر است؟", en: "Is the App Router faster than the Pages Router?" },
        answer: {
          fa: "می‌تواند باشد، چون Server Components جاوااسکریپت کمتری به مرورگر می‌فرستند و امکان استریم دارند. اما سرعت نهایی به پیاده‌سازی بستگی دارد؛ یک App Router پر از Client Component می‌تواند کند باشد.",
          en: "It can be, because Server Components send less JavaScript and support streaming. But final speed depends on the implementation; an App Router full of Client Components can still be slow.",
        },
      },
      {
        question: { fa: "INP چیست؟", en: "What is INP?" },
        answer: {
          fa: "Interaction to Next Paint زمان واکنش صفحه به تعامل کاربر، مثل کلیک یا تایپ، را می‌سنجد و از مارس ۲۰۲۴ جای FID را در Core Web Vitals گرفته است. مقدار تا ۲۰۰ میلی‌ثانیه خوب محسوب می‌شود.",
          en: "Interaction to Next Paint measures how quickly a page responds to user interactions such as clicks or typing, and it replaced FID in Core Web Vitals in March 2024. Up to 200 milliseconds counts as good.",
        },
      },
      {
        question: { fa: "آیا همه صفحات باید استاتیک باشند؟", en: "Should every page be static?" },
        answer: {
          fa: "هر صفحه‌ای که برای همه یکسان است بهتر است استاتیک باشد. صفحاتی که به کاربر وابسته‌اند، مثل داشبورد یا سبد خرید، باید پویا بمانند و فقط داده‌های قابل اشتراک کش شوند.",
          en: "Any page that is the same for everyone is best static. User-specific pages, such as dashboards or carts, should stay dynamic, with only shareable data cached.",
        },
      },
    ],
  },
  {
    slug: "tailwind-clean-ui-patterns",
    title: {
      fa: "الگوهای رابط کاربری تمیز با Tailwind CSS",
      en: "Clean UI Patterns with Tailwind CSS",
    },
    excerpt: {
      fa: "چطور با Tailwind CSS یک رابط کاربری تمیز، یک‌دست و قابل نگهداری بسازیم: توکن‌های طراحی، کامپوننت‌های سبک، حالت‌های hover و focus، راست‌چین و دسترس‌پذیری.",
      en: "Build a clean, consistent, maintainable UI with Tailwind CSS: design tokens, lightweight components, hover and focus states, RTL support, and accessibility.",
    },
    tags: ["UI/UX", "Tailwind"],
    publishedAt: "2026-03-31",
    updatedAt: "2026-10-19",
    coverImage: "/blog/tailwind-clean-ui-patterns.jpg",
    coverImageAlt: {
      fa: "کارت‌هایی از دکمه، کلید، فیلد ورودی و پروفایل که الگوهای رابط کاربری تمیز را نشان می‌دهند",
      en: "UI component cards (button, toggles, input field, profile) showing clean interface patterns",
    },
    directAnswer: {
      fa: "رابط تمیز با Tailwind از توکن‌های طراحی شروع می‌شود: رنگ، فاصله، شعاع گوشه و تایپوگرافی را یک‌بار تعریف کنید (در Tailwind نسخه ۴ با @theme داخل CSS) و همه کامپوننت‌ها را روی همان‌ها بسازید. الگوهای تکراری را به کامپوننت تبدیل کنید، نه به کلاس‌های سفارشی طولانی؛ برای هر عنصر تعاملی حالت‌های hover، focus-visible و disabled طراحی کنید؛ در سایت فارسی از کلاس‌های منطقی مثل ms، me، ps و pe استفاده کنید؛ و انیمیشن‌ها را با motion-reduce برای کاربرانی که حرکت کمتر می‌خواهند غیرفعال کنید.",
      en: "A clean Tailwind UI starts with design tokens: define color, spacing, radius, and typography once (in Tailwind v4 with @theme in CSS) and build every component on them. Turn repeated patterns into components rather than long custom classes; design hover, focus-visible, and disabled states for every interactive element; use logical utilities such as ms, me, ps, and pe for right-to-left sites; and switch animations off with motion-reduce for users who prefer less motion.",
    },
    sections: [
      {
        heading: { fa: "از توکن‌ها شروع کنید", en: "Start with tokens" },
        paragraphs: {
          fa: [
            "اگر رنگ‌ها، فاصله‌ها و شعاع گوشه‌ها به‌صورت توکن تعریف شوند، رابط یک‌دست می‌ماند و تغییرات آینده بسیار ساده‌تر می‌شود. در Tailwind نسخه ۴ این توکن‌ها مستقیماً در CSS و با @theme تعریف می‌شوند و به‌صورت متغیر CSS هم در دسترس‌اند.",
            "به‌جای رنگ‌های پراکنده مثل چند طیف آبی متفاوت، نام‌های معنایی مثل primary، accent، surface و muted بسازید تا حالت تیره یا تغییر برند فقط با عوض کردن چند مقدار انجام شود.",
          ],
          en: [
            "When colors, spacing, and radius are tokens, your UI stays consistent and future changes become much easier. In Tailwind v4 these tokens are defined directly in CSS with @theme and are also available as CSS variables.",
            "Instead of scattered colors such as several slightly different blues, create semantic names like primary, accent, surface, and muted, so dark mode or a rebrand only requires changing a few values.",
          ],
        },
      },
      {
        heading: { fa: "کامپوننت بسازید، نه کلاس‌های طولانی", en: "Build components, not class soups" },
        paragraphs: {
          fa: [
            "وقتی یک دکمه یا کارت در چند جا تکرار می‌شود، آن را کامپوننت کنید و حالت‌هایش، مثل اندازه و نوع، را به‌صورت پارامتر بگیرید. کتابخانه‌هایی مثل class-variance-authority برای مدیریت این حالت‌ها کمک می‌کنند.",
            "استفاده زیاد از @apply برای ساختن کلاس‌های سفارشی، مزیت Tailwind را از بین می‌برد و دوباره به CSS سنتی شلوغ می‌رسید. @apply را برای موارد کم و پایه نگه دارید.",
          ],
          en: [
            "When a button or card repeats in several places, make it a component and take its variants, such as size and kind, as props. Libraries like class-variance-authority help manage those variants.",
            "Heavy use of @apply to build custom classes throws away Tailwind's advantage and brings back cluttered traditional CSS. Keep @apply for a few basic cases.",
          ],
        },
      },
      {
        heading: { fa: "ریتم فاصله و تایپوگرافی", en: "Spacing and typography rhythm" },
        paragraphs: {
          fa: ["بیشتر رابط‌های «تمیز» فقط یک راز دارند: فاصله‌ها و اندازه‌های متن از یک مقیاس ثابت پیروی می‌کنند."],
          en: ["Most clean interfaces share one secret: spacing and text sizes follow a fixed scale."],
        },
        bullets: {
          fa: [
            "از مقیاس فاصله Tailwind خارج نشوید و مقدارهای دلخواه را استثنا نگه دارید",
            "طول سطر متن را محدود کنید تا خواندن راحت باشد",
            "برای متن فارسی فاصله سطر بیشتری نسبت به انگلیسی در نظر بگیرید",
            "سلسله‌مراتب عنوان‌ها را با اندازه و وزن مشخص کنید، نه فقط با رنگ",
          ],
          en: [
            "Stay on Tailwind's spacing scale and keep arbitrary values as exceptions",
            "Limit line length so text stays comfortable to read",
            "Give Persian text more line height than English",
            "Express heading hierarchy with size and weight, not color alone",
          ],
        },
      },
      {
        heading: { fa: "حالت‌های تعاملی", en: "Interactive states" },
        paragraphs: {
          fa: ["هر عنصر قابل کلیک باید حالت‌های مشخصی داشته باشد؛ هم حرفه‌ای‌تر است و هم دسترس‌پذیری را بهتر می‌کند."],
          en: ["Every clickable element needs clear states; it looks more polished and improves accessibility."],
        },
        bullets: {
          fa: [
            "hover ملایم و focus-visible واضح با حلقه رنگی، به‌جای حذف outline",
            "حالت disabled و در حال بارگذاری برای دکمه‌ها و فرم‌ها",
            "پیام خطای کنار فیلد، نه فقط رنگ قرمز",
            "سطح لمسی حداقل حدود ۴۴ پیکسل در موبایل",
          ],
          en: [
            "A subtle hover and a clear focus-visible ring instead of removing the outline",
            "Disabled and loading states for buttons and forms",
            "An error message next to the field, not just red color",
            "A touch target of at least about 44 pixels on mobile",
          ],
        },
      },
      {
        heading: { fa: "راست‌چین و سایت‌های دوزبانه", en: "Right-to-left and bilingual sites" },
        paragraphs: {
          fa: [
            "برای پشتیبانی هم‌زمان از فارسی و انگلیسی، به‌جای left و right از کلاس‌های منطقی مثل ms، me، ps، pe، start و end استفاده کنید تا با تغییر dir صفحه، چیدمان خودکار برعکس شود. برای موارد خاص از پیشوند rtl: کمک بگیرید.",
            "آیکون‌هایی که جهت دارند، مثل فلش، باید در حالت راست‌چین قرینه شوند؛ اما شماره تلفن، ایمیل و کد باید با dir=\"ltr\" نمایش داده شوند تا به‌هم نریزند.",
          ],
          en: [
            "To support Persian and English together, use logical utilities such as ms, me, ps, pe, start, and end instead of left and right, so the layout flips automatically when the page dir changes. Use the rtl: prefix for special cases.",
            "Directional icons such as arrows should mirror in right-to-left mode, but phone numbers, email addresses, and code must render with dir=\"ltr\" so they do not scramble.",
          ],
        },
      },
      {
        heading: { fa: "دسترس‌پذیری و حرکت", en: "Accessibility and motion" },
        paragraphs: {
          fa: [
            "کنتراست متن معمولی باید دست‌کم ۴٫۵ به ۱ باشد تا با استاندارد WCAG در سطح AA سازگار باشد. از عناصر معنایی HTML مثل button، nav و main استفاده کنید و برای انیمیشن‌ها کلاس motion-reduce بگذارید تا کاربرانی که حرکت کمتر را انتخاب کرده‌اند اذیت نشوند.",
          ],
          en: [
            "Normal text needs a contrast ratio of at least 4.5 to 1 to meet WCAG level AA. Use semantic HTML elements such as button, nav, and main, and add motion-reduce to animations so users who choose reduced motion are not disturbed.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا Tailwind برای پروژه‌های بزرگ مناسب است؟", en: "Is Tailwind suitable for large projects?" },
        answer: {
          fa: "بله، به شرطی که توکن‌های طراحی و کامپوننت‌های قابل استفاده مجدد داشته باشید. بدون این دو، کلاس‌ها در کل پروژه پراکنده و نگهداری سخت می‌شود.",
          en: "Yes, as long as you have design tokens and reusable components. Without both, classes scatter across the project and maintenance gets hard.",
        },
      },
      {
        question: { fa: "آیا Tailwind حجم CSS را زیاد می‌کند؟", en: "Does Tailwind make the CSS large?" },
        answer: {
          fa: "خیر. Tailwind فقط کلاس‌هایی را که در کد استفاده شده‌اند تولید می‌کند و خروجی CSS معمولاً کوچک است. چیزی که بیشتر می‌شود، تعداد کلاس‌ها در HTML است که با کامپوننت‌سازی کنترل می‌شود.",
          en: "No. Tailwind generates only the classes used in your code, so the CSS output is usually small. What grows is the number of classes in the HTML, which components keep under control.",
        },
      },
      {
        question: { fa: "چطور با Tailwind سایت راست‌چین بسازیم؟", en: "How do I build a right-to-left site with Tailwind?" },
        answer: {
          fa: "ویژگی dir=\"rtl\" را روی صفحه بگذارید، از کلاس‌های منطقی مثل ms و pe به‌جای ml و pr استفاده کنید و موارد خاص را با پیشوند rtl: تنظیم کنید.",
          en: "Set dir=\"rtl\" on the page, use logical utilities such as ms and pe instead of ml and pr, and handle special cases with the rtl: prefix.",
        },
      },
    ],
  },
  {
    slug: "nodejs-clean-api-architecture",
    title: {
      fa: "معماری تمیز برای API در Node.js",
      en: "A Clean Node.js API Architecture",
    },
    excerpt: {
      fa: "ساختار پیشنهادی برای API قابل توسعه در Node.js: لایه‌های route، service و repository، اعتبارسنجی ورودی، مدیریت خطای استاندارد، لاگ، تنظیمات و تست.",
      en: "A proven structure for maintainable Node.js APIs: route, service, and repository layers, input validation, standard errors, logging, configuration, and testing.",
    },
    tags: ["Node.js", "Backend"],
    publishedAt: "2026-04-14",
    updatedAt: "2026-10-19",
    coverImage: "/blog/nodejs-clean-api-architecture.jpg",
    coverImageAlt: {
      fa: "لایه‌های مسیر، سرویس و پایگاه داده در معماری تمیز API با Node.js",
      en: "Route, service and database layers in a clean Node.js API architecture",
    },
    directAnswer: {
      fa: "یک API تمیز در Node.js سه لایه جدا دارد: route یا controller فقط ورودی را می‌گیرد، اعتبارسنجی می‌کند و پاسخ را برمی‌گرداند؛ service منطق کسب‌وکار را اجرا می‌کند؛ و repository تنها جایی است که با پایگاه داده حرف می‌زند. کنار این لایه‌ها، یک قالب خطای ثابت، لاگ ساختاریافته با شناسه درخواست، تنظیمات اعتبارسنجی‌شده از متغیرهای محیطی و تست برای هر لایه، توسعه و نگهداری را ساده و قابل پیش‌بینی می‌کند.",
      en: "A clean Node.js API has three separate layers: the route or controller only receives input, validates it, and returns the response; the service runs business logic; and the repository is the only place that talks to the database. Around them, a consistent error format, structured logs with a request id, validated configuration from environment variables, and tests for each layer make development and maintenance simple and predictable.",
    },
    sections: [
      {
        heading: { fa: "لایه‌ها را جدا کنید", en: "Separate the layers" },
        paragraphs: {
          fa: [
            "Route یا Controller فقط وظیفه دریافت ورودی و برگرداندن پاسخ را دارد. منطق کسب‌وکار در Service و دسترسی به پایگاه داده در Repository قرار می‌گیرد. این جداسازی باعث می‌شود تغییر پایگاه داده یا فریم‌ورک HTTP، منطق اصلی را درگیر نکند.",
          ],
          en: [
            "The route or controller only receives input and returns a response. Business logic lives in services and database access in repositories. This separation means changing the database or the HTTP framework does not touch the core logic.",
          ],
        },
        bullets: {
          fa: [
            "routes/: تعریف مسیرها و اتصال به controller",
            "services/: قواعد کسب‌وکار، بدون وابستگی به HTTP",
            "repositories/: کوئری‌ها و دسترسی به داده",
            "schemas/: طرح اعتبارسنجی ورودی و خروجی",
            "lib/: لاگ، تنظیمات، خطاها و ابزارهای مشترک",
          ],
          en: [
            "routes/: route definitions wired to controllers",
            "services/: business rules with no HTTP dependency",
            "repositories/: queries and data access",
            "schemas/: input and output validation schemas",
            "lib/: logging, configuration, errors, and shared utilities",
          ],
        },
      },
      {
        heading: { fa: "اعتبارسنجی را در ورودی انجام دهید", en: "Validate at the edge" },
        paragraphs: {
          fa: [
            "هر درخواست را پیش از رسیدن به service با یک طرح مشخص، مثلاً با Zod، Joi یا JSON Schema، بررسی کنید: بدنه، پارامترهای مسیر و query. فیلدهای ناشناخته را رد کنید تا کسی نتواند داده‌ای را که نباید تغییر دهد، دستکاری کند.",
            "وقتی طرح اعتبارسنجی منبع نوع‌ها هم باشد، کد سرویس با داده مطمئن و تایپ‌شده کار می‌کند و دیگر لازم نیست در هر تابع دوباره ورودی را بررسی کنید.",
          ],
          en: [
            "Check every request against a defined schema, for example with Zod, Joi, or JSON Schema, before it reaches a service: body, path parameters, and query. Reject unknown fields so nobody can tamper with data they should not change.",
            "When the validation schema is also the source of types, service code works with trusted, typed data and you no longer re-check input in every function.",
          ],
        },
      },
      {
        heading: { fa: "خطاهای استاندارد و قابل پیش‌بینی", en: "Standard, predictable errors" },
        paragraphs: {
          fa: [
            "یک middleware مرکزی برای خطا بسازید که خطاهای دامنه، مثل «پیدا نشد» یا «دسترسی ندارید»، را به کد HTTP درست تبدیل کند. قالب پاسخ خطا را در همه API ثابت نگه دارید؛ استاندارد Problem Details (RFC 9457) گزینه خوبی است.",
            "هرگز stack trace یا جزئیات داخلی پایگاه داده را به کاربر برنگردانید؛ آن‌ها را فقط در لاگ و همراه شناسه درخواست ثبت کنید.",
          ],
          en: [
            "Build a central error middleware that maps domain errors such as not found or forbidden to the right HTTP status. Keep the error response format identical across the API; the Problem Details standard (RFC 9457) is a good choice.",
            "Never return stack traces or internal database details to the client; record them only in logs, together with the request id.",
          ],
        },
      },
      {
        heading: { fa: "لاگ، پایش و ردیابی", en: "Logging, monitoring, and tracing" },
        paragraphs: {
          fa: ["بدون لاگ خوب، پیدا کردن خطا در محیط واقعی حدس‌زدن است."],
          en: ["Without good logs, finding a production bug is guesswork."],
        },
        bullets: {
          fa: [
            "لاگ ساختاریافته JSON با شناسه درخواست برای هر لاگ",
            "هیچ رمز، توکن یا اطلاعات شخصی در لاگ ثبت نشود",
            "شاخص‌هایی مثل زمان پاسخ و نرخ خطا برای هر مسیر",
            "ردیابی توزیع‌شده، مثلاً با OpenTelemetry، وقتی چند سرویس دارید",
          ],
          en: [
            "Structured JSON logs with a request id on every line",
            "No passwords, tokens, or personal data in logs",
            "Metrics such as latency and error rate per route",
            "Distributed tracing, for example with OpenTelemetry, once you have several services",
          ],
        },
      },
      {
        heading: { fa: "تنظیمات و وابستگی‌ها", en: "Configuration and dependencies" },
        paragraphs: {
          fa: [
            "تنظیمات را از متغیرهای محیطی بخوانید و هنگام شروع برنامه اعتبارسنجی کنید تا اگر چیزی کم است، برنامه همان ابتدا با پیام روشن متوقف شود، نه وسط یک درخواست.",
            "repository را به‌صورت وابستگی به service بدهید، نه اینکه service آن را مستقیماً بسازد. این کار تست را ساده می‌کند، چون می‌توان نسخه جعلی repository را جایگزین کرد. خاموش شدن تمیز (graceful shutdown) را هم فراموش نکنید تا درخواست‌های در حال اجرا نیمه‌کاره نمانند.",
          ],
          en: [
            "Read configuration from environment variables and validate it at startup, so a missing value stops the app immediately with a clear message instead of in the middle of a request.",
            "Pass the repository into the service as a dependency instead of letting the service create it. This makes testing simple, because a fake repository can be swapped in. Do not forget graceful shutdown so in-flight requests are not cut off.",
          ],
        },
      },
      {
        heading: { fa: "تست در هر لایه", en: "Testing at every layer" },
        paragraphs: {
          fa: [
            "service را با repository جعلی و تست واحد بسنجید، مسیرها را با تست یکپارچه روی پایگاه داده واقعی در کانتینر، و قرارداد API را با تست‌هایی که پاسخ‌ها و خطاها را بررسی می‌کنند. تست‌ها باید پیش از هر استقرار به‌صورت خودکار اجرا شوند.",
          ],
          en: [
            "Test services with fake repositories in unit tests, routes with integration tests against a real database in a container, and the API contract with tests that check responses and errors. Tests should run automatically before every deployment.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "Express، Fastify یا NestJS؟", en: "Express, Fastify, or NestJS?" },
        answer: {
          fa: "هر سه می‌توانند API خوبی بسازند و معماری مهم‌تر از فریم‌ورک است. Fastify سریع و سبک است، Express ساده و رایج، و NestJS ساختار آماده و مشخص‌تری برای تیم‌های بزرگ‌تر دارد.",
          en: "All three can build a good API, and architecture matters more than the framework. Fastify is fast and light, Express is simple and widespread, and NestJS gives larger teams a more opinionated structure.",
        },
      },
      {
        question: { fa: "Monolith یا میکروسرویس؟", en: "Monolith or microservices?" },
        answer: {
          fa: "بیشتر پروژه‌ها بهتر است با یک monolith ماژولار شروع کنند. وقتی مرز ماژول‌ها و نیاز مقیاس روشن شد، جدا کردن یک سرویس مستقل ساده‌تر و کم‌ریسک‌تر است.",
          en: "Most projects should start as a modular monolith. Once module boundaries and scaling needs are clear, splitting out an independent service is simpler and less risky.",
        },
      },
      {
        question: { fa: "نسخه‌بندی API را چطور انجام دهیم؟", en: "How should we version an API?" },
        answer: {
          fa: "رایج‌ترین روش، پیشوند مسیر مثل /v1 است. مهم‌تر از روش، پرهیز از تغییرات شکننده است: فیلد جدید اضافه کنید، فیلد قدیمی را بی‌خبر حذف نکنید و زمان بازنشستگی نسخه‌ها را اعلام کنید.",
          en: "The most common approach is a path prefix such as /v1. More important than the method is avoiding breaking changes: add new fields, never silently remove old ones, and announce deprecation timelines.",
        },
      },
    ],
  },
  {
    slug: "mongodb-data-modeling",
    title: {
      fa: "MongoDB: مدل‌سازی داده برای پروژه‌های واقعی",
      en: "MongoDB: Data Modeling for Real Projects",
    },
    excerpt: {
      fa: "اصول مدل‌سازی داده در MongoDB برای پروژه واقعی: embed یا reference، الگوهای رایج، ایندکس‌گذاری درست، اعتبارسنجی schema و خطاهایی که سرعت را از بین می‌برند.",
      en: "MongoDB data modeling for real projects: embedding vs referencing, common patterns, the right indexes, schema validation, and the mistakes that kill performance.",
    },
    tags: ["MongoDB", "Backend"],
    publishedAt: "2026-04-28",
    updatedAt: "2026-10-19",
    coverImage: "/blog/mongodb-data-modeling.jpg",
    coverImageAlt: {
      fa: "سندهای JSON متصل با ارجاع و یک سند تو در تو برای مدل‌سازی داده در MongoDB",
      en: "JSON documents linked by references and an embedded sub-document, modelling data in MongoDB",
    },
    directAnswer: {
      fa: "در MongoDB مدل داده را بر اساس پرسش‌های واقعی برنامه طراحی کنید، نه جدول‌های رابطه‌ای. داده‌ای را که همیشه همراه والد خوانده می‌شود و رشد محدود دارد embed کنید؛ داده‌ای را که مستقل خوانده می‌شود، زیاد رشد می‌کند یا بین چند سند مشترک است reference کنید. برای هر کوئری پرتکرار ایندکس مناسب بسازید (معمولاً ایندکس ترکیبی به ترتیب برابری، مرتب‌سازی و بازه)، آرایه‌های بی‌سقف نسازید و با اعتبارسنجی $jsonSchema جلوی ورود داده نامعتبر را بگیرید.",
      en: "In MongoDB, design the data model around the application's real queries, not relational tables. Embed data that is always read with its parent and has bounded growth; reference data that is read independently, grows a lot, or is shared by many documents. Build the right index for every frequent query (usually a compound index ordered by equality, sort, then range), avoid unbounded arrays, and block invalid data with $jsonSchema validation.",
    },
    sections: [
      {
        heading: { fa: "طراحی را از کوئری‌ها شروع کنید", en: "Start the design from your queries" },
        paragraphs: {
          fa: [
            "در پایگاه داده رابطه‌ای معمولاً اول جدول‌ها را نرمال می‌کنیم و بعد کوئری می‌نویسیم. در MongoDB برعکس است: فهرست صفحه‌ها و گزارش‌هایی را که برنامه نیاز دارد بنویسید و مدل را طوری بچینید که هر کدام با کمترین تعداد کوئری و بدون پردازش اضافه جواب داده شود.",
          ],
          en: [
            "With a relational database we usually normalize tables first and write queries later. MongoDB is the reverse: list the screens and reports your application needs, then shape the model so each one is answered with as few queries and as little extra processing as possible.",
          ],
        },
      },
      {
        heading: { fa: "Embed یا Reference؟", en: "Embed or reference?" },
        paragraphs: {
          fa: ["قاعده ساده این است: چیزی که با هم خوانده می‌شود، با هم ذخیره شود؛ به شرط اینکه رشدش محدود باشد. هر سند در MongoDB حداکثر ۱۶ مگابایت حجم دارد."],
          en: ["The simple rule: what is read together is stored together, as long as its growth is bounded. Each MongoDB document can be at most 16 MB."],
        },
        bullets: {
          fa: [
            "Embed: رابطه یک به چند محدود، مثل آدرس‌های یک مشتری یا اقلام یک سفارش",
            "Embed: داده‌ای که تقریباً همیشه همراه والد نمایش داده می‌شود",
            "Reference: رابطه یک به بسیار زیاد، مثل نظرهای یک محصول پرطرفدار",
            "Reference: داده مستقل یا مشترک بین چند سند، مثل نویسنده یا دسته‌بندی",
          ],
          en: [
            "Embed: bounded one-to-few relations, such as a customer's addresses or an order's line items",
            "Embed: data that is almost always displayed with its parent",
            "Reference: one-to-very-many relations, such as reviews of a popular product",
            "Reference: independent data shared by several documents, such as an author or a category",
          ],
        },
      },
      {
        heading: { fa: "الگوهای رایج مدل‌سازی", en: "Common modeling patterns" },
        paragraphs: {
          fa: ["چند الگوی شناخته‌شده که در پروژه‌های واقعی بارها استفاده می‌شوند:"],
          en: ["A few well-known patterns that come up again and again in real projects:"],
        },
        bullets: {
          fa: [
            "Subset: فقط چند مورد اخیر، مثل ده نظر آخر، را embed کنید و بقیه را جدا نگه دارید",
            "Extended reference: چند فیلد پرکاربرد سند مرجع، مثل نام مشتری، را کپی کنید تا نیاز به join کم شود",
            "Computed: مقادیری مثل تعداد یا جمع را هنگام نوشتن محاسبه و ذخیره کنید، نه هنگام هر خواندن",
            "Bucket و time series: داده‌های زمانی را دسته‌بندی کنید یا از کالکشن time series استفاده کنید",
          ],
          en: [
            "Subset: embed only the most recent items, such as the last ten reviews, and keep the rest separate",
            "Extended reference: copy a few frequently used fields of the referenced document, such as a customer's name, to reduce joins",
            "Computed: calculate values such as counts or totals on write instead of on every read",
            "Bucket and time series: group time-based data or use a time series collection",
          ],
        },
      },
      {
        heading: { fa: "ایندکس‌گذاری درست", en: "Indexing correctly" },
        paragraphs: {
          fa: [
            "بدون ایندکس مناسب، MongoDB کل کالکشن را می‌خواند و با رشد داده همه چیز کند می‌شود. برای ایندکس ترکیبی قاعده ESR را به کار ببرید: اول فیلدهای برابری، بعد فیلد مرتب‌سازی و در آخر فیلدهای بازه‌ای.",
            "با explain بررسی کنید کوئری واقعاً از ایندکس استفاده می‌کند. ایندکس اضافه هم بی‌هزینه نیست و هر نوشتن را کندتر می‌کند؛ ایندکس‌های بی‌استفاده را حذف کنید. برای داده‌ای که باید بعد از مدتی پاک شود، ایندکس TTL مفید است.",
          ],
          en: [
            "Without the right index, MongoDB scans the whole collection and everything slows down as data grows. For compound indexes apply the ESR rule: equality fields first, then the sort field, then range fields.",
            "Use explain to check that a query really uses the index. Extra indexes are not free and slow down every write, so remove unused ones. For data that must expire after a while, a TTL index is useful.",
          ],
        },
      },
      {
        heading: { fa: "اعتبارسنجی و یکپارچگی داده", en: "Validation and data integrity" },
        paragraphs: {
          fa: [
            "انعطاف MongoDB به معنای بی‌قانونی نیست. با اعتبارسنجی $jsonSchema در سطح کالکشن، فیلدهای الزامی و نوع داده را تعیین کنید تا خطای برنامه داده خراب وارد نکند.",
            "MongoDB از تراکنش چندسندی پشتیبانی می‌کند، اما بهترین طراحی معمولاً طوری است که عملیات مهم روی یک سند و به‌صورت اتمیک انجام شود و تراکنش فقط برای موارد واقعاً لازم بماند.",
          ],
          en: [
            "MongoDB's flexibility does not mean no rules. With collection-level $jsonSchema validation, define required fields and types so an application bug cannot insert broken data.",
            "MongoDB supports multi-document transactions, but the best design usually keeps important operations atomic on a single document and reserves transactions for cases that truly need them.",
          ],
        },
      },
      {
        heading: { fa: "خطاهای رایج که سرعت را از بین می‌برند", en: "Common mistakes that kill performance" },
        paragraphs: {
          fa: ["این اشتباه‌ها در پروژه‌های تازه زیاد دیده می‌شوند:"],
          en: ["These mistakes show up often in young projects:"],
        },
        bullets: {
          fa: [
            "آرایه‌هایی که بی‌سقف رشد می‌کنند، مثل همه سفارش‌های یک مشتری داخل سند مشتری",
            "استفاده از $lookup برای هر صفحه، به‌جای مدل‌سازی متناسب با کوئری",
            "نبود ایندکس برای کوئری‌های پرتکرار و مرتب‌سازی",
            "ذخیره فایل‌های بزرگ داخل سند، به‌جای فضای ذخیره‌سازی فایل",
          ],
          en: [
            "Arrays that grow without limit, such as every order a customer ever placed inside the customer document",
            "Using $lookup on every page instead of modeling for the query",
            "Missing indexes for frequent queries and sorts",
            "Storing large files inside documents instead of in file storage",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا MongoDB از تراکنش پشتیبانی می‌کند؟", en: "Does MongoDB support transactions?" },
        answer: {
          fa: "بله. MongoDB تراکنش‌های چندسندی ACID را پشتیبانی می‌کند، اما هزینه کارایی دارند؛ بهتر است مدل داده طوری طراحی شود که بیشتر عملیات‌ها روی یک سند و اتمیک باشند.",
          en: "Yes. MongoDB supports multi-document ACID transactions, but they have a performance cost; it is better to design the model so most operations are atomic on a single document.",
        },
      },
      {
        question: { fa: "چه زمانی MongoDB انتخاب مناسبی نیست؟", en: "When is MongoDB not the right choice?" },
        answer: {
          fa: "وقتی داده به‌شدت رابطه‌ای است، joinهای پیچیده و گزارش‌های مالی دقیق بخش اصلی کار هستند، یک پایگاه داده رابطه‌ای مثل PostgreSQL معمولاً انتخاب ساده‌تر و مطمئن‌تری است.",
          en: "When data is highly relational and complex joins and precise financial reporting are central, a relational database such as PostgreSQL is usually the simpler and safer choice.",
        },
      },
      {
        question: { fa: "کوئری‌های کند را چطور پیدا کنیم؟", en: "How do we find slow queries?" },
        answer: {
          fa: "با explain برنامه اجرای کوئری را ببینید، profiler پایگاه داده را برای ثبت کوئری‌های کند فعال کنید و ابزارهای پیشنهاد ایندکس را بررسی کنید. نبود ایندکس رایج‌ترین دلیل کندی است.",
          en: "Use explain to view a query's execution plan, enable the database profiler to log slow queries, and review index suggestion tools. A missing index is the most common cause of slowness.",
        },
      },
    ],
  },
  {
    slug: "api-validation-security",
    title: {
      fa: "اعتبارسنجی ورودی‌ها و امنیت API",
      en: "API Input Validation and Security Basics",
    },
    excerpt: {
      fa: "چک‌لیست عملی امنیت API: اعتبارسنجی ورودی، احراز هویت و کنترل دسترسی در سطح هر شیء، محدودیت نرخ، CORS، مدیریت رمزها، پیام خطای امن و ثبت رویدادها.",
      en: "A practical API security checklist: input validation, authentication and object-level authorization, rate limiting, CORS, secrets, safe errors, and logging.",
    },
    tags: ["Security", "Backend"],
    publishedAt: "2026-05-12",
    updatedAt: "2026-10-19",
    coverImage: "/blog/api-validation-security.jpg",
    coverImageAlt: {
      fa: "سپر امنیتی با علامت تأیید که درخواست معتبر را عبور می‌دهد و درخواست نامعتبر را رد می‌کند",
      en: "A security shield with a checkmark letting valid requests through and blocking an invalid one",
    },
    directAnswer: {
      fa: "امنیت API با یک اصل شروع می‌شود: هیچ ورودی قابل اعتماد نیست. هر درخواست را با طرح مشخص اعتبارسنجی و فیلدهای ناشناخته را رد کنید؛ در هر درخواست بررسی کنید کاربر واقعاً به همان شیء دسترسی دارد، چون این رایج‌ترین آسیب‌پذیری API است؛ برای ورود و مسیرهای حساس محدودیت نرخ بگذارید؛ CORS را فقط برای دامنه‌های مجاز باز کنید؛ رمزها را در متغیرهای محیطی یا مدیر رمز نگه دارید؛ پیام خطا را بدون جزئیات داخلی برگردانید؛ و رویدادهای امنیتی را بدون ثبت اطلاعات حساس لاگ کنید.",
      en: "API security starts with one principle: no input can be trusted. Validate every request against a defined schema and reject unknown fields; on every request check that the user really has access to that specific object, because this is the most common API vulnerability; rate-limit login and sensitive routes; open CORS only to allowed origins; keep secrets in environment variables or a secrets manager; return errors without internal details; and log security events without recording sensitive data.",
    },
    sections: [
      {
        heading: { fa: "اصل اول: هیچ ورودی قابل اعتماد نیست", en: "Principle one: no input can be trusted" },
        paragraphs: {
          fa: [
            "بدنه درخواست، پارامترهای آدرس، query، هدرها و حتی فایل‌های آپلودی، همه می‌توانند دستکاری شوند. نوع، طول، قالب و محدوده هر فیلد را با یک طرح اعتبارسنجی مشخص کنید و هر چیز خارج از آن را رد کنید.",
            "برای جلوگیری از تزریق، کوئری پایگاه داده را همیشه پارامتری بسازید و هرگز رشته ورودی را مستقیم داخل کوئری نچسبانید. برای فایل‌ها نوع و حجم را بررسی کنید و آن‌ها را بیرون از مسیر اجرای برنامه ذخیره کنید.",
          ],
          en: [
            "Request bodies, URL parameters, query strings, headers, and even uploaded files can all be manipulated. Define the type, length, format, and range of every field in a validation schema and reject anything outside it.",
            "To prevent injection, always build database queries with parameters and never paste an input string directly into a query. For files, check type and size and store them outside the application's executable path.",
          ],
        },
      },
      {
        heading: { fa: "احراز هویت و کنترل دسترسی", en: "Authentication and authorization" },
        paragraphs: {
          fa: [
            "احراز هویت می‌گوید کاربر کیست؛ کنترل دسترسی می‌گوید اجازه چه کاری دارد. خطرناک‌ترین اشتباه این است که API فقط وارد شدن کاربر را بررسی کند و نه مالکیت شیء را؛ در این حالت کاربر با تغییر یک شناسه در آدرس، اطلاعات دیگران را می‌بیند.",
            "در هر درخواست، مالکیت یا مجوز روی همان رکورد را در سرور بررسی کنید. نقش یا سطح دسترسی را هرگز از ورودی کاربر نخوانید، توکن‌ها را کوتاه‌مدت نگه دارید و برای نشست مرورگر از کوکی HttpOnly و Secure استفاده کنید.",
          ],
          en: [
            "Authentication tells you who the user is; authorization tells you what they may do. The most dangerous mistake is an API that checks only that a user is signed in, not that they own the object; then changing an id in the URL exposes other people's data.",
            "On every request, check ownership or permission for that exact record on the server. Never read a role or permission level from user input, keep tokens short-lived, and use HttpOnly, Secure cookies for browser sessions.",
          ],
        },
      },
      {
        heading: { fa: "مهم‌ترین موارد فهرست OWASP API Top 10", en: "The key items of the OWASP API Top 10" },
        paragraphs: {
          fa: ["فهرست OWASP API Security Top 10 (نسخه ۲۰۲۳) رایج‌ترین ریسک‌های API را جمع‌بندی می‌کند. این موارد در بیشتر پروژه‌ها اولویت دارند:"],
          en: ["The OWASP API Security Top 10 (2023 edition) summarizes the most common API risks. These are the priorities in most projects:"],
        },
        bullets: {
          fa: [
            "کنترل دسترسی ناقص در سطح شیء: دسترسی به رکورد دیگران با تغییر شناسه",
            "احراز هویت ناقص: رمز ضعیف، نبود محدودیت تلاش و توکن‌های بی‌انقضا",
            "کنترل دسترسی ناقص در سطح ویژگی: برگرداندن یا پذیرفتن فیلدهایی که کاربر نباید ببیند یا تغییر دهد",
            "مصرف نامحدود منابع: نبود محدودیت نرخ، حجم و صفحه‌بندی",
            "کنترل دسترسی ناقص در سطح تابع: دسترسی کاربر عادی به عملیات مدیریتی",
            "پیکربندی امنیتی نادرست و مصرف ناامن APIهای دیگر، از جمله SSRF",
          ],
          en: [
            "Broken object level authorization: reaching other users' records by changing an id",
            "Broken authentication: weak passwords, no attempt limits, and tokens that never expire",
            "Broken object property level authorization: returning or accepting fields the user should not see or change",
            "Unrestricted resource consumption: no limits on rate, payload size, or page size",
            "Broken function level authorization: regular users reaching admin operations",
            "Security misconfiguration and unsafe consumption of other APIs, including SSRF",
          ],
        },
      },
      {
        heading: { fa: "محدودیت نرخ و منابع", en: "Rate and resource limits" },
        paragraphs: {
          fa: [
            "برای هر کاربر یا IP سقف درخواست تعیین کنید، به‌خصوص برای ورود، ثبت‌نام، بازیابی رمز و فرم‌های عمومی. حجم بدنه درخواست، تعداد آیتم در هر صفحه و زمان اجرای هر درخواست را هم محدود کنید تا یک درخواست سنگین سرور را از کار نیندازد.",
            "برای عملیات‌هایی مثل پرداخت، کلید یکتای تکرار (idempotency key) بخواهید تا ارسال دوباره یک درخواست، دو بار پول جابه‌جا نکند.",
          ],
          en: [
            "Set a request cap per user or IP, especially for sign-in, sign-up, password reset, and public forms. Also limit request body size, items per page, and execution time so one heavy request cannot take the server down.",
            "For operations such as payments, require an idempotency key so a retried request does not move money twice.",
          ],
        },
      },
      {
        heading: { fa: "CORS، هدرها و رمزها", en: "CORS, headers, and secrets" },
        paragraphs: {
          fa: ["چند تنظیم ساده که جلوی بخش بزرگی از حمله‌ها را می‌گیرد:"],
          en: ["A few simple settings that stop a large share of attacks:"],
        },
        bullets: {
          fa: [
            "CORS را فقط برای دامنه‌های مشخص باز کنید و هرگز * را با کوکی یا اعتبارنامه ترکیب نکنید",
            "برای درخواست‌های تغییردهنده از کوکی، محافظت CSRF و بررسی Origin داشته باشید",
            "رمزها و کلیدها را در متغیر محیطی یا مدیر رمز نگه دارید، نه در مخزن کد",
            "کلیدها را به‌صورت دوره‌ای عوض کنید و دسترسی هر کلید را حداقلی نگه دارید",
          ],
          en: [
            "Open CORS only to specific origins and never combine * with cookies or credentials",
            "For cookie-based state-changing requests, add CSRF protection and Origin checks",
            "Keep secrets and keys in environment variables or a secrets manager, never in the repository",
            "Rotate keys periodically and keep each key's permissions minimal",
          ],
        },
      },
      {
        heading: { fa: "خطا، لاگ و پایش", en: "Errors, logging, and monitoring" },
        paragraphs: {
          fa: [
            "پیام خطا باید به کاربر کمک کند، نه به مهاجم. جزئیات فنی، stack trace و پیام پایگاه داده را فقط در لاگ و با شناسه درخواست ثبت کنید و به کاربر یک پیام عمومی و کد خطای مشخص برگردانید.",
            "تلاش‌های ناموفق ورود، خطاهای دسترسی و جهش ناگهانی درخواست‌ها را ثبت کنید و برایشان هشدار بگذارید؛ اما رمز، توکن و اطلاعات شخصی را هرگز در لاگ ننویسید.",
          ],
          en: [
            "Error messages should help the user, not the attacker. Record technical details, stack traces, and database messages only in logs with a request id, and return a generic message with a specific error code.",
            "Log failed sign-ins, authorization errors, and sudden traffic spikes, and alert on them; but never write passwords, tokens, or personal data to logs.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا HTTPS برای امنیت API کافی است؟", en: "Is HTTPS enough to secure an API?" },
        answer: {
          fa: "خیر. HTTPS فقط مسیر انتقال را رمزنگاری می‌کند و لازم است، اما جلوی دسترسی غیرمجاز، تزریق یا سوءاستفاده از منطق برنامه را نمی‌گیرد. اعتبارسنجی، کنترل دسترسی و محدودیت نرخ همچنان ضروری‌اند.",
          en: "No. HTTPS only encrypts the connection; it is necessary, but it does not stop unauthorized access, injection, or abuse of application logic. Validation, authorization, and rate limiting are still essential.",
        },
      },
      {
        question: { fa: "BOLA یا کنترل دسترسی ناقص در سطح شیء چیست؟", en: "What is BOLA, broken object level authorization?" },
        answer: {
          fa: "یعنی API بررسی نمی‌کند که رکورد درخواستی متعلق به همان کاربر است. مثلاً کاربر با تغییر شماره سفارش در آدرس، سفارش دیگران را می‌بیند. راه‌حل، بررسی مالکیت یا مجوز در سرور برای هر درخواست است.",
          en: "It means the API does not check that the requested record belongs to that user. For example, changing an order number in the URL reveals other people's orders. The fix is a server-side ownership or permission check on every request.",
        },
      },
      {
        question: { fa: "آیا توکن JWT امن است؟", en: "Are JWT tokens secure?" },
        answer: {
          fa: "به پیاده‌سازی بستگی دارد. امضا و الگوریتم را همیشه بررسی کنید، زمان انقضا را کوتاه نگه دارید، برای باطل‌کردن توکن برنامه داشته باشید و توکن را در جای امن، مثل کوکی HttpOnly، نگه دارید.",
          en: "It depends on the implementation. Always verify the signature and algorithm, keep expiry short, plan for revoking tokens, and store the token somewhere safe, such as an HttpOnly cookie.",
        },
      },
    ],
  },
  {
    slug: "solidity-contract-design",
    title: {
      fa: "Solidity: اصول طراحی قرارداد هوشمند امن",
      en: "Solidity: Principles of Secure Smart Contract Design",
    },
    seoTitle: {
      fa: "اصول طراحی قرارداد هوشمند امن با Solidity",
      en: "Secure Smart Contract Design in Solidity",
    },
    excerpt: {
      fa: "اصول طراحی قرارداد هوشمند با Solidity برای کد خوانا، قابل تست و کم‌ریسک: کنترل دسترسی، رویدادها، خطاهای سفارشی، الگوی بررسی-اثر-تعامل، ارتقاپذیری و گس.",
      en: "Design principles for readable, testable, low-risk Solidity contracts: access control, events, custom errors, checks-effects-interactions, upgradeability, and gas.",
    },
    tags: ["Solidity", "Blockchain"],
    publishedAt: "2026-05-26",
    updatedAt: "2026-10-19",
    coverImage: "/blog/solidity-contract-design.jpg",
    coverImageAlt: {
      fa: "سند کد قرارداد هوشمند با قفل دسترسی و نماد اتریوم",
      en: "A smart contract code document with an access lock and an Ethereum-style diamond",
    },
    directAnswer: {
      fa: "قرارداد هوشمند خوب در Solidity کوچک، ساده و قابل تست است: کنترل دسترسی حداقلی و صریح دارد، مثلاً با Ownable یا AccessControl از OpenZeppelin؛ برای هر تغییر مهم رویداد منتشر می‌کند؛ با خطاهای سفارشی دلیل شکست را ارزان و روشن اعلام می‌کند؛ الگوی بررسی-اثر-تعامل را رعایت می‌کند تا در برابر reentrancy امن بماند؛ از کتابخانه‌های بازبینی‌شده به‌جای کد دست‌ساز استفاده می‌کند؛ و پیش از mainnet تست کامل و ممیزی مستقل را می‌گذراند.",
      en: "A good Solidity contract is small, simple, and testable: it has minimal, explicit access control, for example OpenZeppelin's Ownable or AccessControl; it emits an event for every important change; it reports failures cheaply and clearly with custom errors; it follows checks-effects-interactions to stay safe from reentrancy; it uses reviewed libraries instead of hand-rolled code; and it passes thorough testing and an independent audit before mainnet.",
    },
    sections: [
      {
        heading: { fa: "سادگی، اولین ویژگی امنیتی", en: "Simplicity is the first security feature" },
        paragraphs: {
          fa: [
            "قرارداد مستقرشده معمولاً قابل تغییر نیست و هر خط کد، سطح حمله را بزرگ‌تر می‌کند. هر قرارداد را برای یک مسئولیت روشن بنویسید، توابع را کوتاه نگه دارید و منطق پیچیده‌ای را که می‌تواند بیرون از زنجیره انجام شود، روی زنجیره نیاورید.",
            "قرارداد خوب یعنی قرارداد قابل تست. توابع کوچک، وابستگی کم و رویدادهای واضح کمک می‌کنند رفتار قرارداد قابل بررسی باشد.",
          ],
          en: [
            "A deployed contract usually cannot be changed, and every line of code widens the attack surface. Write each contract for one clear responsibility, keep functions short, and do not bring complex logic on-chain if it can run off-chain.",
            "A good contract is a testable contract. Small functions, few dependencies, and clear events make behavior verifiable.",
          ],
        },
      },
      {
        heading: { fa: "کنترل دسترسی صریح و حداقلی", en: "Explicit, minimal access control" },
        paragraphs: {
          fa: ["هر تابعی که وضعیت مهمی را تغییر می‌دهد باید روشن بگوید چه کسی اجازه اجرایش را دارد."],
          en: ["Every function that changes important state should state clearly who may call it."],
        },
        bullets: {
          fa: [
            "برای یک مدیر از Ownable یا نسخه دومرحله‌ای آن برای انتقال امن مالکیت استفاده کنید",
            "برای چند نقش، AccessControl و نقش‌های جدا برای هر کار را به کار ببرید",
            "مالکیت قرارداد مهم را به کیف پول چندامضایی و در صورت امکان timelock بسپارید",
            "برای احراز هویت هرگز از tx.origin استفاده نکنید؛ msg.sender معیار درست است",
          ],
          en: [
            "Use Ownable, or its two-step variant for safe ownership transfer, for a single admin",
            "Use AccessControl with separate roles per task when there are several roles",
            "Put ownership of important contracts in a multisig wallet, with a timelock where possible",
            "Never use tx.origin for authorization; msg.sender is the right check",
          ],
        },
      },
      {
        heading: { fa: "رویدادها و خطاهای سفارشی", en: "Events and custom errors" },
        paragraphs: {
          fa: [
            "برای هر تغییر مهم، مثل انتقال، تغییر تنظیمات یا تغییر نقش، رویداد منتشر کنید. رویدادها برای داشبورد، ایندکسرها و اتصال به سیستم‌هایی مثل ERP و CRM منبع اصلی داده هستند.",
            "به‌جای پیام‌های متنی طولانی در revert، از خطاهای سفارشی (custom errors) استفاده کنید؛ هم گس کمتری مصرف می‌کنند و هم پارامترهای مفید، مثل مقدار مجاز و مقدار درخواستی، را به برنامه برمی‌گردانند.",
          ],
          en: [
            "Emit an event for every important change, such as transfers, configuration updates, or role changes. Events are the primary data source for dashboards, indexers, and integrations with systems such as ERP and CRM.",
            "Instead of long text messages in revert, use custom errors; they cost less gas and return useful parameters, such as the allowed and requested amounts, to the application.",
          ],
        },
      },
      {
        heading: { fa: "الگوی بررسی-اثر-تعامل و reentrancy", en: "Checks-effects-interactions and reentrancy" },
        paragraphs: {
          fa: [
            "در هر تابع، اول شرط‌ها را بررسی کنید، بعد وضعیت قرارداد را به‌روز کنید و در آخر با قرارداد یا آدرس بیرونی تعامل کنید. اگر پول را پیش از به‌روزرسانی موجودی بفرستید، قرارداد مهاجم می‌تواند دوباره تابع را صدا بزند و چند بار برداشت کند.",
            "برای توابعی که پول جابه‌جا می‌کنند، محافظ reentrancy اضافه کنید و تا جای ممکن الگوی برداشت توسط خود کاربر (pull) را به ارسال خودکار به چند آدرس (push) ترجیح دهید.",
          ],
          en: [
            "In every function, check conditions first, then update the contract's state, and only then interact with external contracts or addresses. If you send funds before updating the balance, an attacker's contract can call back into the function and withdraw several times.",
            "Add a reentrancy guard to functions that move funds, and where possible prefer letting users withdraw (pull) over automatically sending to many addresses (push).",
          ],
        },
      },
      {
        heading: { fa: "ارتقاپذیری: موافق و مخالف", en: "Upgradeability: pros and cons" },
        paragraphs: {
          fa: [
            "الگوهای proxy، مثل UUPS یا transparent proxy، امکان تغییر منطق قرارداد را می‌دهند، اما ریسک‌های خودشان را دارند: چیدمان حافظه نباید به‌هم بخورد، تابع initializer باید فقط یک بار اجرا شود و کاربران باید به مدیر ارتقا اعتماد کنند.",
            "اگر قرارداد ساده است، نسخه غیرقابل ارتقا شفاف‌تر و امن‌تر است. اگر ارتقا لازم است، کلید آن را به multisig و timelock بسپارید تا تغییرات پیش از اجرا قابل مشاهده باشند.",
          ],
          en: [
            "Proxy patterns such as UUPS or transparent proxies let you change contract logic, but they carry their own risks: storage layout must not break, the initializer must run only once, and users must trust whoever controls upgrades.",
            "If the contract is simple, a non-upgradeable version is more transparent and safer. If upgrades are needed, put the upgrade key in a multisig with a timelock so changes are visible before they take effect.",
          ],
        },
      },
      {
        heading: { fa: "گس و هزینه", en: "Gas and cost" },
        paragraphs: {
          fa: ["نوشتن در حافظه دائمی گران‌ترین عملیات است؛ چند عادت ساده هزینه کاربران را کم می‌کند:"],
          en: ["Writing to storage is the most expensive operation; a few simple habits lower users' costs:"],
        },
        bullets: {
          fa: [
            "برای مقادیر ثابت از constant و immutable استفاده کنید",
            "متغیرهای کوچک را کنار هم تعریف کنید تا در یک اسلات حافظه جا شوند",
            "روی آرایه‌های بی‌سقف حلقه نزنید؛ ممکن است تابع برای همیشه غیرقابل اجرا شود",
            "پارامترهای ورودی توابع external را از نوع calldata بگیرید",
          ],
          en: [
            "Use constant and immutable for fixed values",
            "Declare small variables next to each other so they pack into one storage slot",
            "Do not loop over unbounded arrays; the function may become impossible to execute",
            "Take external function parameters as calldata",
          ],
        },
      },
      {
        heading: { fa: "تست و ممیزی پیش از mainnet", en: "Testing and audit before mainnet" },
        paragraphs: {
          fa: [
            "تست واحد برای هر تابع، تست fuzz و invariant برای یافتن حالت‌های غیرمنتظره، ابزارهای تحلیل ایستا مثل Slither، و در نهایت ممیزی مستقل برای قراردادهایی که پول واقعی نگه می‌دارند. بعد از انتشار هم یک برنامه bug bounty و پایش رویدادها، آخرین لایه دفاع است.",
          ],
          en: [
            "Unit tests for every function, fuzz and invariant tests to find unexpected states, static analysis tools such as Slither, and finally an independent audit for contracts that hold real money. After launch, a bug bounty program and event monitoring are the last line of defense.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "از کدام نسخه Solidity استفاده کنیم؟", en: "Which Solidity version should we use?" },
        answer: {
          fa: "آخرین نسخه پایدار سری 0.8 که ابزارها و کتابخانه‌های شما پشتیبانی می‌کنند. نسخه را در pragma دقیق و ثابت کنید تا قرارداد نهایی دقیقاً با همان کامپایلری ساخته شود که تست شده است.",
          en: "The latest stable 0.8.x release that your tools and libraries support. Pin the exact version in the pragma so the final contract is compiled with exactly the compiler you tested.",
        },
      },
      {
        question: { fa: "آیا قراردادهای OpenZeppelin امن هستند؟", en: "Are OpenZeppelin contracts safe?" },
        answer: {
          fa: "این کتابخانه بارها ممیزی شده و بسیار پرکاربرد است و معمولاً از کد دست‌ساز امن‌تر است. با این حال، نسخه را به‌روز نگه دارید و نحوه ترکیب آن با کد خودتان را هم تست و بازبینی کنید.",
          en: "The library has been audited repeatedly and is very widely used, so it is usually safer than hand-written code. Still, keep the version up to date and test and review how you combine it with your own code.",
        },
      },
      {
        question: { fa: "آیا قرارداد را بعد از استقرار می‌توان تغییر داد؟", en: "Can a contract be changed after deployment?" },
        answer: {
          fa: "به‌صورت پیش‌فرض خیر. فقط با الگوی قابل ارتقا (proxy) می‌توان منطق را عوض کرد، که خودش ریسک و نیاز به اعتماد کاربران به مدیر ارتقا را به همراه دارد.",
          en: "Not by default. Only an upgradeable (proxy) pattern lets you change the logic, and that brings its own risk and requires users to trust whoever controls upgrades.",
        },
      },
    ],
  },
  {
    slug: "hardhat-testing-deploy",
    title: {
      fa: "Hardhat: تست و دیپلوی قراردادهای هوشمند",
      en: "Hardhat: Testing and Deploying Smart Contracts",
    },
    excerpt: {
      fa: "راهنمای تست و دیپلوی قرارداد هوشمند با Hardhat: سناریوهای تست، fixture، شبکه محلی و fork، پوشش کد، تست fuzz، دیپلوی مرحله‌ای و تأیید سورس روی اکسپلورر.",
      en: "Testing and deploying smart contracts with Hardhat: scenario tests, fixtures, local and forked networks, coverage, fuzzing, staged deployments, and source verification.",
    },
    seoDescription: {
      fa: "راهنمای تست و دیپلوی قرارداد هوشمند با Hardhat: سناریوهای تست، fixture، شبکه محلی و fork، پوشش کد، تست fuzz، دیپلوی مرحله‌ای و تأیید سورس روی اکسپلورر.",
      en: "Test and deploy smart contracts with Hardhat: scenario tests, fixtures, forked networks, coverage, fuzzing, staged deployments, and source verification.",
    },
    tags: ["Hardhat", "Solidity"],
    publishedAt: "2026-06-09",
    updatedAt: "2026-10-19",
    coverImage: "/blog/hardhat-testing-deploy.jpg",
    coverImageAlt: {
      fa: "فهرست تست‌های موفق و زنجیره‌ای از بلوک‌ها که استقرار مرحله‌ای قرارداد را نشان می‌دهد",
      en: "A list of passing tests followed by a chain of blocks, showing staged contract deployment",
    },
    directAnswer: {
      fa: "با Hardhat ابتدا قرارداد را روی شبکه محلی و با تست‌های سناریومحور بسنجید: مسیر موفق، شکست‌ها، دسترسی غیرمجاز و حالت‌های مرزی. برای سرعت و تکرارپذیری از fixture استفاده کنید، برای تعامل با پروتکل‌های واقعی شبکه اصلی را fork کنید، پوشش کد و تست fuzz را اضافه کنید، سپس با یک اسکریپت یا ماژول دیپلوی تکرارپذیر، مثل Hardhat Ignition، اول روی testnet و بعد روی mainnet مستقر کنید و سورس را روی اکسپلورر تأیید کنید. کلید خصوصی دیپلوی هرگز نباید در مخزن کد باشد.",
      en: "With Hardhat, first test the contract on a local network with scenario-based tests: the happy path, failures, unauthorized access, and edge cases. Use fixtures for speed and repeatability, fork mainnet to interact with real protocols, add coverage and fuzz tests, then deploy with a repeatable script or module such as Hardhat Ignition, to a testnet first and mainnet after, and verify the source on the block explorer. The deployment private key must never be in the repository.",
    },
    sections: [
      {
        heading: { fa: "تست‌ها را نزدیک به سناریو بنویسید", en: "Write scenario-driven tests" },
        paragraphs: {
          fa: [
            "تست‌ها را طوری بنویسید که سناریوهای واقعی کاربر را پوشش دهند، نه فقط تک‌تک توابع را. برای هر تابع مهم دست‌کم این چهار حالت را بسنجید: مسیر موفق، شکست با خطای درست، دسترسی غیرمجاز و حالت‌های مرزی مثل صفر، حداکثر مقدار یا فراخوانی دوباره.",
            "علاوه بر مقدار بازگشتی، رویدادهای منتشرشده و تغییر موجودی حساب‌ها را هم بررسی کنید؛ بسیاری از باگ‌ها در همین جزئیات پنهان‌اند.",
          ],
          en: [
            "Write tests that cover real user scenarios, not just individual functions. For every important function test at least four cases: the happy path, failure with the right error, unauthorized access, and edge cases such as zero, the maximum value, or a repeated call.",
            "Besides return values, check emitted events and changes in account balances; many bugs hide in exactly those details.",
          ],
        },
      },
      {
        heading: { fa: "fixture، شبکه محلی و fork", en: "Fixtures, the local network, and forking" },
        paragraphs: {
          fa: [
            "شبکه محلی Hardhat تراکنش‌ها را فوری استخراج می‌کند و امکان کنترل زمان و حساب‌ها را می‌دهد. با fixture، وضعیت اولیه، مثل استقرار قرارداد و تقسیم توکن، یک بار ساخته و برای هر تست بازگردانده می‌شود؛ تست‌ها سریع و مستقل از هم می‌مانند.",
            "اگر قرارداد شما با پروتکل‌های موجود مثل یک DEX یا اوراکل کار می‌کند، شبکه اصلی را fork کنید تا تست‌ها روی وضعیت واقعی همان قراردادها اجرا شوند.",
          ],
          en: [
            "Hardhat's local network mines transactions instantly and lets you control time and accounts. With fixtures, the initial state, such as deploying contracts and distributing tokens, is built once and restored for every test, so tests stay fast and independent.",
            "If your contract works with existing protocols such as a DEX or an oracle, fork mainnet so tests run against the real state of those contracts.",
          ],
        },
      },
      {
        heading: { fa: "فراتر از تست واحد", en: "Beyond unit tests" },
        paragraphs: {
          fa: ["قراردادی که پول نگه می‌دارد به لایه‌های بیشتری از اطمینان نیاز دارد:"],
          en: ["A contract that holds funds needs more layers of assurance:"],
        },
        bullets: {
          fa: [
            "گزارش پوشش کد برای یافتن مسیرهای تست‌نشده",
            "تست fuzz با ورودی‌های تصادفی برای یافتن حالت‌های غیرمنتظره",
            "تست invariant برای قواعدی که همیشه باید درست بمانند، مثل برابری مجموع موجودی‌ها",
            "تحلیل ایستا، مثلاً با Slither، پیش از هر انتشار",
          ],
          en: [
            "Code coverage reports to find untested paths",
            "Fuzz tests with random inputs to uncover unexpected states",
            "Invariant tests for rules that must always hold, such as total balances adding up",
            "Static analysis, for example with Slither, before every release",
          ],
        },
      },
      {
        heading: { fa: "دیپلوی تکرارپذیر و مرحله‌ای", en: "Repeatable, staged deployments" },
        paragraphs: {
          fa: [
            "دیپلوی را با دست و تک‌تک فرمان‌ها انجام ندهید. یک اسکریپت یا ماژول اعلامی، مثل Hardhat Ignition، ترتیب استقرار، پارامترها و آدرس‌های نهایی را ثبت می‌کند و اگر وسط کار خطا رخ دهد، از همان نقطه ادامه می‌دهد.",
            "مسیر امن همیشه یکسان است: شبکه محلی، سپس شبکه آزمایشی مثل Sepolia برای اتریوم یا شبکه آزمایشی همان لایه دو، و در نهایت mainnet. آدرس‌ها و پارامترهای هر شبکه را در مخزن نگه دارید تا همه بدانند کدام نسخه کجا مستقر است.",
          ],
          en: [
            "Do not deploy by hand, one command at a time. A script or a declarative module such as Hardhat Ignition records deployment order, parameters, and final addresses, and resumes from the same point if something fails midway.",
            "The safe path is always the same: the local network, then a testnet such as Sepolia for Ethereum or the matching layer-2 testnet, and finally mainnet. Keep each network's addresses and parameters in the repository so everyone knows which version is deployed where.",
          ],
        },
      },
      {
        heading: { fa: "امنیت کلید و پس از دیپلوی", en: "Key security and after deployment" },
        paragraphs: {
          fa: ["چند قاعده ساده که از رایج‌ترین فاجعه‌ها جلوگیری می‌کند:"],
          en: ["A few simple rules that prevent the most common disasters:"],
        },
        bullets: {
          fa: [
            "کلید خصوصی را هرگز در کد یا فایل‌های commit‌شده نگذارید؛ از متغیر محیطی یا keystore رمزگذاری‌شده استفاده کنید",
            "کیف پول دیپلوی را جدا از کیف پول نگهداری دارایی نگه دارید",
            "بعد از استقرار، مالکیت قرارداد را به کیف پول چندامضایی منتقل کنید",
            "سورس قرارداد را روی اکسپلورر تأیید کنید و رویدادهای مهم را پایش کنید",
          ],
          en: [
            "Never put a private key in code or committed files; use an environment variable or an encrypted keystore",
            "Keep the deployer wallet separate from the wallet that holds assets",
            "After deployment, transfer contract ownership to a multisig wallet",
            "Verify the contract source on the explorer and monitor important events",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "Hardhat یا Foundry؟", en: "Hardhat or Foundry?" },
        answer: {
          fa: "هر دو ابزارهای عالی‌اند. Foundry با تست‌های Solidity و fuzz بسیار سریع شناخته می‌شود و Hardhat با اکوسیستم جاوااسکریپت و تایپ‌اسکریپت و افزونه‌های فراوان. بسیاری از تیم‌ها از هر دو در کنار هم استفاده می‌کنند.",
          en: "Both are excellent. Foundry is known for very fast Solidity-native tests and fuzzing, and Hardhat for its JavaScript and TypeScript ecosystem and many plugins. Many teams use both side by side.",
        },
      },
      {
        question: { fa: "روی کدام شبکه آزمایشی تست کنیم؟", en: "Which testnet should we use?" },
        answer: {
          fa: "برای برنامه‌های اتریوم معمولاً Sepolia. اگر روی یک لایه دو مثل Arbitrum یا Base مستقر می‌کنید، از شبکه آزمایشی همان لایه دو استفاده کنید تا رفتار و هزینه‌ها واقعی‌تر باشد.",
          en: "Usually Sepolia for Ethereum apps. If you deploy on a layer 2 such as Arbitrum or Base, use that layer 2's own testnet so behavior and costs are more realistic.",
        },
      },
      {
        question: { fa: "چرا باید سورس قرارداد را تأیید کنیم؟", en: "Why verify the contract source?" },
        answer: {
          fa: "تأیید سورس به همه اجازه می‌دهد کد واقعی قرارداد را روی اکسپلورر بخوانند و با آن تعامل کنند. این کار شفافیت و اعتماد کاربران را بالا می‌برد و برای ممیزی و پشتیبانی هم ضروری است.",
          en: "Source verification lets anyone read the contract's real code on the explorer and interact with it. It increases transparency and user trust, and it is essential for audits and support.",
        },
      },
    ],
  },
  {
    slug: "ethersjs-wallets-transactions",
    title: {
      fa: "ethers.js: کار با کیف پول و تراکنش‌ها",
      en: "ethers.js: Working with Wallets and Transactions",
    },
    excerpt: {
      fa: "راهنمای عملی ethers.js نسخه ۶ برای dAppها: اتصال کیف پول، شبکه درست، خواندن و نوشتن روی قرارداد، ارسال و پیگیری تراکنش، کار با BigInt و نمایش خطای قابل فهم.",
      en: "A practical ethers.js v6 guide for dApps: connecting wallets, the right network, reading and writing contracts, tracking transactions, BigInt, and clear errors.",
    },
    tags: ["ethers.js", "Blockchain"],
    publishedAt: "2026-06-23",
    updatedAt: "2026-10-19",
    coverImage: "/blog/ethersjs-wallets-transactions.jpg",
    coverImageAlt: {
      fa: "کیف پول، تراکنش امضاشده و دو گره شبکه در حال انتقال آن",
      en: "A wallet, a signed transaction and two network nodes exchanging it",
    },
    directAnswer: {
      fa: "در ethers.js نسخه ۶ برای خواندن داده از یک provider، مثل JsonRpcProvider یا BrowserProvider، و برای نوشتن از signer کاربر استفاده کنید: کیف پول را با BrowserProvider و getSigner وصل کنید، پیش از هر تراکنش شبکه را بررسی و در صورت نیاز عوض کنید، تابع قرارداد را صدا بزنید و با tx.wait() منتظر تأیید بمانید. مقادیر توکن را با parseUnits و formatUnits و نوع BigInt مدیریت کنید و خطاهایی مثل رد تراکنش توسط کاربر، کمبود موجودی یا revert قرارداد را به پیام قابل فهم تبدیل کنید.",
      en: "In ethers.js v6, use a provider such as JsonRpcProvider or BrowserProvider to read data and the user's signer to write: connect the wallet with BrowserProvider and getSigner, check and if needed switch the network before every transaction, call the contract function, and wait for confirmation with tx.wait(). Handle token amounts with parseUnits, formatUnits, and BigInt, and turn errors such as a user rejection, insufficient funds, or a contract revert into clear messages.",
    },
    sections: [
      {
        heading: { fa: "Provider و Signer: خواندن در برابر نوشتن", en: "Provider and signer: reading versus writing" },
        paragraphs: {
          fa: [
            "provider اتصال فقط‌خواندنی به شبکه است: موجودی، وضعیت قرارداد و رویدادها را می‌خواند و به کیف پول کاربر نیازی ندارد. signer حسابی است که می‌تواند تراکنش را امضا کند و معمولاً از کیف پول کاربر، مثل MetaMask، می‌آید.",
            "بخش خواندن را از یک RPC پایدار انجام دهید تا صفحه حتی بدون اتصال کیف پول اطلاعات را نشان دهد، و signer را فقط هنگام نوشتن درخواست کنید.",
          ],
          en: [
            "A provider is a read-only connection to the network: it reads balances, contract state, and events and does not need the user's wallet. A signer is an account that can sign transactions, usually coming from the user's wallet, such as MetaMask.",
            "Do reads through a reliable RPC so the page shows data even without a connected wallet, and request the signer only when writing.",
          ],
        },
      },
      {
        heading: { fa: "اتصال کیف پول و شبکه درست", en: "Connecting the wallet and the right network" },
        paragraphs: {
          fa: ["بیشتر خطاهای کاربران از اتصال به شبکه اشتباه یا تغییر حساب در میانه کار است."],
          en: ["Most user errors come from being on the wrong network or switching accounts mid-flow."],
        },
        bullets: {
          fa: [
            "برای پیدا کردن کیف پول‌های نصب‌شده از استاندارد EIP-6963 استفاده کنید تا چند کیف پول با هم تداخل نکنند",
            "پیش از هر تراکنش chainId را بررسی کنید و در صورت نیاز درخواست تغییر شبکه بدهید",
            "به رویدادهای تغییر حساب و تغییر شبکه گوش دهید و وضعیت صفحه را به‌روز کنید",
            "آدرس کاربر را کوتاه‌شده نمایش دهید و امکان کپی کامل آن را بگذارید",
          ],
          en: [
            "Use the EIP-6963 standard to discover installed wallets so several wallets do not conflict",
            "Check the chainId before every transaction and request a network switch if needed",
            "Listen for account and network change events and update the page state",
            "Show the user's address shortened, with an option to copy it in full",
          ],
        },
      },
      {
        heading: { fa: "خواندن و نوشتن روی قرارداد", en: "Reading and writing contracts" },
        paragraphs: {
          fa: [
            "با ABI و آدرس، یک نمونه Contract بسازید؛ اگر آن را به provider وصل کنید فقط می‌خواند و اگر به signer وصل کنید می‌تواند تراکنش بفرستد. پیش از ارسال تراکنش واقعی، با staticCall آن را شبیه‌سازی کنید تا اگر revert می‌شود، پیش از پرداخت کارمزد به کاربر بگویید.",
            "برای فهرست کردن رخدادهای گذشته از فیلتر رویدادها استفاده کنید، اما برای تاریخچه‌های طولانی یک ایندکسر جدا بسازید؛ خواندن مستقیم بلوک‌های زیاد از RPC کند و محدود است.",
          ],
          en: [
            "Create a Contract instance from the ABI and address; connected to a provider it only reads, connected to a signer it can send transactions. Before sending a real transaction, simulate it with staticCall so that if it would revert, you can tell the user before they pay a fee.",
            "Use event filters to list past events, but build a separate indexer for long histories; reading many blocks directly from RPC is slow and rate-limited.",
          ],
        },
      },
      {
        heading: { fa: "اعداد بزرگ و واحدها", en: "Big numbers and units" },
        paragraphs: {
          fa: [
            "در ethers.js نسخه ۶ مقادیر به‌صورت BigInt بومی جاوااسکریپت هستند. هرگز مقدار توکن را با عدد اعشاری معمولی محاسبه نکنید؛ دقت از دست می‌رود.",
            "هر توکن تعداد رقم اعشار خودش را دارد؛ مثلاً اتر ۱۸ رقم و USDT روی بسیاری از شبکه‌ها ۶ رقم. برای تبدیل ورودی کاربر از parseUnits و برای نمایش از formatUnits با همان تعداد رقم اعشار استفاده کنید.",
          ],
          en: [
            "In ethers.js v6, amounts are native JavaScript BigInt values. Never compute token amounts with regular floating-point numbers; precision is lost.",
            "Each token has its own number of decimals, for example 18 for ether and 6 for USDT on many networks. Use parseUnits to convert user input and formatUnits to display, with the token's decimals.",
          ],
        },
      },
      {
        heading: { fa: "ارسال و پیگیری تراکنش", en: "Sending and tracking transactions" },
        paragraphs: {
          fa: [
            "بعد از ارسال، هش تراکنش را بلافاصله نشان دهید و لینک آن روی اکسپلورر را بدهید. وضعیت «در انتظار تأیید» را تا پایان tx.wait() نگه دارید و برای مبالغ مهم، تعداد تأیید بیشتری صبر کنید.",
            "تراکنش ممکن است با کارمزد بالاتر جایگزین یا لغو شود؛ این حالت را مدیریت کنید و صفحه را در وضعیت نامعلوم رها نکنید.",
          ],
          en: [
            "After sending, show the transaction hash immediately with a link to the explorer. Keep a pending state until tx.wait() resolves, and wait for more confirmations for significant amounts.",
            "A transaction may be replaced with a higher fee or cancelled; handle that case and never leave the page in an unknown state.",
          ],
        },
      },
      {
        heading: { fa: "مدیریت خطا را جدی بگیرید", en: "Take error handling seriously" },
        paragraphs: {
          fa: ["پیام خطای خام RPC برای کاربر بی‌معناست. خطاها را بر اساس کد آن‌ها به پیام روشن تبدیل کنید:"],
          en: ["Raw RPC error messages mean nothing to users. Map errors by their code to clear messages:"],
        },
        bullets: {
          fa: [
            "ACTION_REJECTED: کاربر تراکنش را در کیف پول رد کرده است",
            "INSUFFICIENT_FUNDS: موجودی برای مبلغ یا کارمزد کافی نیست",
            "CALL_EXCEPTION: قرارداد تراکنش را رد کرده است؛ دلیل یا خطای سفارشی را نمایش دهید",
            "خطای شبکه یا RPC: برای خواندن از چند RPC پشتیبان استفاده کنید و دوباره تلاش کنید",
          ],
          en: [
            "ACTION_REJECTED: the user rejected the transaction in the wallet",
            "INSUFFICIENT_FUNDS: the balance does not cover the amount or the fee",
            "CALL_EXCEPTION: the contract reverted; show the reason or custom error",
            "Network or RPC errors: use several fallback RPCs for reads and retry",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "تفاوت ethers.js نسخه ۵ و ۶ چیست؟", en: "What changed between ethers.js v5 and v6?" },
        answer: {
          fa: "نسخه ۶ به‌جای BigNumber از BigInt بومی استفاده می‌کند، BrowserProvider جای Web3Provider را گرفته و توابع کمکی مثل parseEther مستقیماً از ریشه کتابخانه در دسترس‌اند. مهاجرت معمولاً به تغییر همین بخش‌ها محدود است.",
          en: "Version 6 uses native BigInt instead of BigNumber, BrowserProvider replaces Web3Provider, and helpers such as parseEther are available directly from the library root. Migration is usually limited to those areas.",
        },
      },
      {
        question: { fa: "چرا تراکنش ناموفق بود ولی کارمزد کسر شد؟", en: "Why did a failed transaction still cost a fee?" },
        answer: {
          fa: "اگر تراکنش در زنجیره اجرا و سپس revert شود، کارمزد اجرای آن پرداخت می‌شود. با شبیه‌سازی تراکنش پیش از ارسال می‌توان بیشتر این شکست‌ها را پیش از پرداخت کارمزد تشخیص داد.",
          en: "If a transaction executes on-chain and then reverts, the fee for its execution is still paid. Simulating the transaction before sending catches most of these failures before any fee is paid.",
        },
      },
      {
        question: { fa: "منتظر چند تأیید بمانیم؟", en: "How many confirmations should we wait for?" },
        answer: {
          fa: "به شبکه و مبلغ بستگی دارد. برای به‌روزرسانی رابط کاربری معمولاً یک تأیید کافی است، اما برای تسویه مالی یا تحویل کالا باید تا نهایی شدن معتبر همان شبکه صبر کرد.",
          en: "It depends on the network and the amount. One confirmation is usually enough to update the interface, but financial settlement or delivering goods should wait for that network's reliable finality.",
        },
      },
    ],
  },
  {
    slug: "frontend-backend-api-contracts",
    title: {
      fa: "قرارداد API بین فرانت‌اند و بک‌اند: سرعت بیشتر، باگ کمتر",
      en: "API Contracts Between Frontend and Backend: Faster Teams, Fewer Bugs",
    },
    seoTitle: {
      fa: "قرارداد API بین فرانت‌اند و بک‌اند",
      en: "Frontend and Backend API Contracts",
    },
    excerpt: {
      fa: "چطور با قرارداد API ثابت، مستندات OpenAPI، تایپ‌های مشترک، قالب خطای استاندارد، صفحه‌بندی و نسخه‌بندی، توسعه فرانت‌اند و بک‌اند سریع‌تر و کم‌خطاتر شود.",
      en: "How a stable API contract, OpenAPI docs, shared types, a standard error format, pagination, and versioning make frontend and backend teams faster with fewer bugs.",
    },
    tags: ["Frontend", "Backend"],
    publishedAt: "2026-07-07",
    updatedAt: "2026-10-19",
    coverImage: "/blog/frontend-backend-api-contracts.jpg",
    coverImageAlt: {
      fa: "رابط کاربری و سرور که با نشان قرارداد API به هم وصل شده‌اند",
      en: "A frontend window and a server stack connected by an API contract badge",
    },
    directAnswer: {
      fa: "قرارداد API توافق نوشته‌شده‌ای است درباره اینکه هر endpoint چه ورودی‌ای می‌گیرد و چه خروجی و خطایی برمی‌گرداند. وقتی این قرارداد پیش از کدنویسی، مثلاً با OpenAPI، نوشته شود، فرانت‌اند می‌تواند با داده نمونه هم‌زمان جلو برود، تایپ‌ها از روی آن تولید می‌شوند، قالب خطا و صفحه‌بندی همه‌جا یکسان می‌ماند و هر تغییر شکننده پیش از رسیدن به کاربر در تست‌ها دیده می‌شود.",
      en: "An API contract is a written agreement about what input each endpoint accepts and what output and errors it returns. When the contract is written before coding, for example with OpenAPI, the frontend can progress in parallel against mock data, types are generated from it, error and pagination formats stay identical everywhere, and any breaking change shows up in tests before it reaches users.",
    },
    sections: [
      {
        heading: { fa: "قرارداد را اول بنویسید", en: "Write the contract first" },
        paragraphs: {
          fa: [
            "در روش «قرارداد اول»، تیم‌ها پیش از نوشتن کد بک‌اند درباره شکل درخواست و پاسخ توافق می‌کنند و آن را در قالبی ماشین‌خوان مثل OpenAPI ثبت می‌کنند. از همان سند می‌توان سرور نمونه (mock) ساخت تا فرانت‌اند بدون انتظار برای بک‌اند کار کند.",
            "این کار بحث‌ها را به اول پروژه می‌آورد، جایی که تغییر ارزان است، نه به روز آخر که هر تغییر هم فرانت‌اند و هم بک‌اند را درگیر می‌کند.",
          ],
          en: [
            "With a contract-first approach, teams agree on request and response shapes before writing backend code and record them in a machine-readable format such as OpenAPI. A mock server can be generated from the same document so the frontend can work without waiting for the backend.",
            "This moves debates to the start of the project, where change is cheap, instead of the last day, when every change affects both frontend and backend.",
          ],
        },
      },
      {
        heading: { fa: "تایپ‌های مشترک و کلاینت خودکار", en: "Shared types and generated clients" },
        paragraphs: {
          fa: [
            "به‌جای تعریف دستی تایپ‌ها در دو طرف، آن‌ها را از قرارداد تولید کنید. ابزارهای تولید کد از روی OpenAPI، تایپ‌های TypeScript و حتی کلاینت کامل می‌سازند؛ در یک monorepo تمام‌تایپ‌اسکریپتی، ابزارهایی مثل tRPC هم همین هدف را بدون سند جدا دنبال می‌کنند.",
            "نتیجه این است که اگر بک‌اند نام یا نوع یک فیلد را تغییر دهد، کامپایلر فرانت‌اند پیش از اجرا خطا می‌دهد.",
          ],
          en: [
            "Instead of defining types by hand on both sides, generate them from the contract. OpenAPI code generators produce TypeScript types and even complete clients; in an all-TypeScript monorepo, tools such as tRPC pursue the same goal without a separate document.",
            "The result: if the backend renames a field or changes its type, the frontend compiler fails before anything runs.",
          ],
        },
      },
      {
        heading: { fa: "قالب ثابت برای خطا", en: "A consistent error format" },
        paragraphs: {
          fa: ["اگر هر endpoint خطا را به شکلی متفاوت برگرداند، فرانت‌اند مجبور است برای هر کدام کد جدا بنویسد."],
          en: ["If every endpoint returns errors differently, the frontend needs separate code for each one."],
        },
        bullets: {
          fa: [
            "یک قالب خطا برای همه API، مثلاً بر اساس استاندارد Problem Details (RFC 9457)",
            "کد خطای ثابت و ماشین‌خوان، مثل invalid_email، کنار پیام انسانی",
            "خطاهای اعتبارسنجی به تفکیک فیلد تا فرم بتواند کنار هر فیلد پیام نشان دهد",
            "ترجمه پیام‌ها در فرانت‌اند بر اساس کد خطا، برای سایت‌های دوزبانه",
          ],
          en: [
            "One error format for the whole API, for example based on Problem Details (RFC 9457)",
            "Stable, machine-readable error codes such as invalid_email next to the human message",
            "Validation errors per field so forms can show a message next to each field",
            "Messages translated on the frontend by error code, for bilingual sites",
          ],
        },
      },
      {
        heading: { fa: "صفحه‌بندی، فیلتر و مرتب‌سازی یکسان", en: "Consistent pagination, filtering, and sorting" },
        paragraphs: {
          fa: [
            "نام پارامترها و شکل پاسخ فهرست‌ها را در همه API یکسان کنید. برای فهرست‌های بزرگ یا داده‌ای که مدام اضافه می‌شود، صفحه‌بندی مبتنی بر cursor پایدارتر از offset است. حداکثر اندازه صفحه را هم در سرور محدود کنید.",
          ],
          en: [
            "Use the same parameter names and response shape for every list in the API. For large lists or constantly growing data, cursor-based pagination is more stable than offsets. Cap the maximum page size on the server as well.",
          ],
        },
      },
      {
        heading: { fa: "نسخه‌بندی و تغییر بدون شکستن", en: "Versioning and non-breaking change" },
        paragraphs: {
          fa: [
            "بیشتر تغییرات را می‌توان بدون شکستن انجام داد: فیلد جدید اضافه کنید، فیلد اختیاری بسازید و فیلد قدیمی را پیش از حذف، منسوخ اعلام کنید. فقط برای تغییرات واقعاً شکننده نسخه جدید، مثل /v2، بسازید.",
            "تست قرارداد (contract testing) در هر استقرار بررسی می‌کند که پاسخ‌های واقعی هنوز با سند قرارداد سازگارند؛ این ارزان‌ترین بیمه در برابر خراب شدن ناگهانی فرانت‌اند است.",
          ],
          en: [
            "Most changes can be made without breaking anything: add new fields, make fields optional, and mark old fields as deprecated before removing them. Create a new version such as /v2 only for genuinely breaking changes.",
            "Contract testing on every deployment checks that real responses still match the contract document; it is the cheapest insurance against a suddenly broken frontend.",
          ],
        },
      },
      {
        heading: { fa: "تجربه توسعه‌دهنده (DX)", en: "Developer experience (DX)" },
        paragraphs: {
          fa: ["API خوب برای توسعه‌دهنده‌ها هم محصول است:"],
          en: ["A good API is also a product for developers:"],
        },
        bullets: {
          fa: [
            "مستندات به‌روز با نمونه درخواست و پاسخ برای هر endpoint",
            "محیط آزمایشی جدا از داده واقعی",
            "شناسه درخواست در هر پاسخ تا ردیابی خطا بین فرانت و بک ساده باشد",
            "فهرست تغییرات (changelog) برای هر انتشار",
          ],
          en: [
            "Current documentation with request and response examples for every endpoint",
            "A sandbox environment separate from real data",
            "A request id in every response so tracing errors across frontend and backend is easy",
            "A changelog for every release",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "REST بهتر است یا GraphQL؟", en: "Is REST or GraphQL better?" },
        answer: {
          fa: "هر دو با قرارداد خوب کار می‌کنند. REST ساده‌تر و با کش HTTP سازگارتر است؛ GraphQL وقتی ارزش دارد که کلاینت‌های مختلف به ترکیب‌های متفاوتی از داده نیاز دارند. در هر دو، قرارداد و تایپ‌های مشترک مهم‌ترین عامل است.",
          en: "Both work well with a good contract. REST is simpler and friendlier to HTTP caching; GraphQL earns its place when different clients need different combinations of data. Either way, the contract and shared types matter most.",
        },
      },
      {
        question: { fa: "تست قرارداد (contract testing) چیست؟", en: "What is contract testing?" },
        answer: {
          fa: "تستی است که بررسی می‌کند پاسخ‌های واقعی API همچنان با سند قرارداد سازگارند. اگر بک‌اند ناخواسته یک فیلد را تغییر دهد، تست پیش از استقرار شکست می‌خورد.",
          en: "It is a test that checks real API responses still match the contract document. If the backend accidentally changes a field, the test fails before deployment.",
        },
      },
      {
        question: { fa: "مالک قرارداد API کیست؟", en: "Who owns the API contract?" },
        answer: {
          fa: "هر دو تیم. بک‌اند آن را پیاده‌سازی می‌کند و فرانت‌اند مصرف‌کننده اصلی است؛ بهترین نتیجه وقتی است که هر تغییر قرارداد مثل کد، بازبینی و تأیید مشترک شود.",
          en: "Both teams. The backend implements it and the frontend is its main consumer; the best results come when every contract change is reviewed and approved jointly, like code.",
        },
      },
    ],
  },
  {
    slug: "fast-seo-websites",
    title: {
      fa: "ساخت وب‌سایت سریع و سئو-محور",
      en: "Building Fast, SEO-Focused Websites",
    },
    excerpt: {
      fa: "چطور سایتی بسازیم که هم سریع باشد و هم در گوگل و موتورهای پاسخ‌گو دیده شود: ساختار محتوا، Core Web Vitals، تصاویر و فونت‌ها، رندر سمت سرور، متادیتا و داده ساختاریافته.",
      en: "How to build a site that is fast and visible in Google and AI answer engines: content structure, Core Web Vitals, images and fonts, server rendering, metadata, and structured data.",
    },
    seoDescription: {
      fa: "چطور سایتی سریع بسازیم که در گوگل و موتورهای پاسخ‌گو دیده شود: ساختار محتوا، Core Web Vitals، تصاویر و فونت‌ها، رندر سمت سرور و داده ساختاریافته.",
      en: "Build a site that is fast and visible in Google and AI answers: content structure, Core Web Vitals, images and fonts, server rendering, and structured data.",
    },
    tags: ["Website", "SEO"],
    publishedAt: "2026-07-21",
    updatedAt: "2026-10-19",
    coverImage: "/blog/fast-seo-websites.jpg",
    coverImageAlt: {
      fa: "سه حلقه امتیاز عملکرد، سئو و دسترس‌پذیری داخل یک صفحه مرورگر",
      en: "Three score rings for performance, SEO and accessibility inside a browser window",
    },
    directAnswer: {
      fa: "سایت سریع و سئو-محور از ساختار شروع می‌شود: هر صفحه یک هدف، یک H1 روشن و پاسخ مستقیم به پرسش کاربر دارد. سپس HTML از سمت سرور یا به‌صورت استاتیک تحویل داده می‌شود تا موتورها محتوا را بدون اجرای جاوااسکریپت سنگین ببینند؛ تصاویر فشرده با ابعاد درست، فونت‌های سبک و جاوااسکریپت کم، Core Web Vitals را در محدوده خوب نگه می‌دارند؛ و عنوان، توضیح، canonical، hreflang و داده ساختاریافته به گوگل و موتورهای هوش مصنوعی کمک می‌کنند صفحه را درست بفهمند و نقل کنند.",
      en: "A fast, SEO-focused site starts with structure: each page has one purpose, one clear H1, and a direct answer to the user's question. HTML is then delivered server-side or statically so engines can see content without running heavy JavaScript; compressed, correctly sized images, light fonts, and little JavaScript keep Core Web Vitals in the good range; and the title, description, canonical, hreflang, and structured data help Google and AI engines understand and quote the page correctly.",
    },
    sections: [
      {
        heading: { fa: "سئو از ساختار محتوا شروع می‌شود", en: "SEO starts with content structure" },
        paragraphs: {
          fa: [
            "قبل از هر چیز، ساختار عنوان‌ها و محتوای صفحه باید درست باشد: یک H1 که موضوع صفحه را دقیق می‌گوید، H2ها به شکل پرسش‌های واقعی کاربر و پاراگراف اولی که مستقیم به پرسش اصلی جواب می‌دهد.",
            "هر صفحه باید یک کار انجام دهد. صفحه‌ای که هم معرفی خدمات است، هم مقاله و هم فرم استخدام، برای هیچ‌کدام از این جست‌وجوها خوب رتبه نمی‌گیرد.",
          ],
          en: [
            "First, the heading structure and page content must be right: one H1 that states the topic precisely, H2s phrased as real user questions, and an opening paragraph that answers the main question directly.",
            "Each page should do one job. A page that is a service overview, an article, and a hiring form at once ranks well for none of those searches.",
          ],
        },
      },
      {
        heading: { fa: "HTML قابل خواندن برای موتورها", en: "HTML that engines can read" },
        paragraphs: {
          fa: [
            "گوگل می‌تواند جاوااسکریپت اجرا کند، اما با تأخیر و محدودیت؛ بسیاری از خزنده‌های موتورهای پاسخ‌گوی هوش مصنوعی اصلاً جاوااسکریپت اجرا نمی‌کنند. پس محتوای اصلی را با رندر سمت سرور یا تولید استاتیک در HTML اولیه قرار دهید.",
            "لینک‌های داخلی را با تگ a و آدرس واقعی بسازید، نه با رویداد کلیک، تا خزنده بتواند مسیر صفحات را دنبال کند.",
          ],
          en: [
            "Google can execute JavaScript, but with delays and limits; many AI answer-engine crawlers do not execute JavaScript at all. So put the main content in the initial HTML through server rendering or static generation.",
            "Build internal links with a tags and real URLs, not click handlers, so crawlers can follow the path between pages.",
          ],
        },
      },
      {
        heading: { fa: "Core Web Vitals در عمل", en: "Core Web Vitals in practice" },
        paragraphs: {
          fa: ["سه شاخص اصلی و مهم‌ترین اهرم بهبود هر کدام:"],
          en: ["The three core metrics and the main lever for each:"],
        },
        bullets: {
          fa: [
            "LCP (تا ۲٫۵ ثانیه): تصویر یا متن اصلی بالای صفحه را زود و با اولویت بالا بارگذاری کنید",
            "INP (تا ۲۰۰ میلی‌ثانیه): جاوااسکریپت کمتر و کارهای سنگین را به بعد از تعامل منتقل کنید",
            "CLS (تا ۰٫۱): برای تصاویر، ویدیو و بنرها ابعاد ثابت بگذارید و فونت را بدون جابه‌جایی لود کنید",
          ],
          en: [
            "LCP (up to 2.5 s): load the main above-the-fold image or text early and with high priority",
            "INP (up to 200 ms): ship less JavaScript and move heavy work out of the interaction path",
            "CLS (up to 0.1): reserve fixed dimensions for images, video, and banners and load fonts without shifts",
          ],
        },
      },
      {
        heading: { fa: "تصاویر، فونت‌ها و ویدیو", en: "Images, fonts, and video" },
        paragraphs: {
          fa: [
            "تصاویر را با فرمت WebP یا AVIF و در اندازه واقعی نمایش ذخیره کنید و همه تصاویر زیر صفحه را lazy-load کنید، به‌جز تصویر اصلی بالای صفحه. فونت‌ها را با فرمت woff2، فقط در وزن‌های لازم و روی همان دامنه سایت بارگذاری کنید.",
            "ویدیوی پس‌زمینه زیبا است، اما می‌تواند ده‌ها مگابایت حجم داشته باشد. ویدیو را فشرده کنید، یک تصویر پوستر سبک بگذارید، بارگذاری را تا پس از لود صفحه عقب بیندازید و در حالت صرفه‌جویی داده یا اینترنت کند فقط پوستر را نشان دهید.",
          ],
          en: [
            "Store images as WebP or AVIF at their real display size and lazy-load everything below the fold except the main above-the-fold image. Load fonts as woff2, only in the weights you need, from your own domain.",
            "Background video looks great but can weigh tens of megabytes. Compress it, add a light poster image, defer loading until after the page loads, and show only the poster in data-saver mode or on slow connections.",
          ],
        },
      },
      {
        heading: { fa: "متادیتا و داده ساختاریافته", en: "Metadata and structured data" },
        paragraphs: {
          fa: ["این‌ها به موتورها می‌گویند صفحه درباره چیست و در نتایج چطور نمایش داده شود:"],
          en: ["These tell engines what a page is about and how to show it in results:"],
        },
        bullets: {
          fa: [
            "عنوان یکتا و توضیح متای جذاب برای هر صفحه",
            "canonical برای جلوگیری از محتوای تکراری و hreflang برای نسخه‌های زبانی",
            "Open Graph و Twitter Card برای نمایش درست در شبکه‌های اجتماعی",
            "داده ساختاریافته Organization، Article، BreadcrumbList و FAQPage مطابق محتوای صفحه",
          ],
          en: [
            "A unique title and compelling meta description for every page",
            "Canonicals against duplicate content and hreflang for language versions",
            "Open Graph and Twitter Card tags for correct social previews",
            "Organization, Article, BreadcrumbList, and FAQPage structured data that matches the page",
          ],
        },
      },
      {
        heading: { fa: "آماده برای موتورهای پاسخ‌گو (GEO و AEO)", en: "Ready for answer engines (GEO and AEO)" },
        paragraphs: {
          fa: [
            "کاربران حالا از ChatGPT، Perplexity و پاسخ‌های هوش مصنوعی گوگل هم جواب می‌گیرند. برای دیده‌شدن در این پاسخ‌ها، بالای صفحه یک جواب کوتاه و خودکفا بنویسید، بخش پرسش‌های متداول اضافه کنید، اطلاعات کسب‌وکار و نویسنده را شفاف و یکسان نگه دارید و خزنده‌های جست‌وجوی هوش مصنوعی را در robots.txt مسدود نکنید.",
          ],
          en: [
            "Users now also get answers from ChatGPT, Perplexity, and Google's AI answers. To appear in those answers, put a short, self-contained answer at the top of the page, add an FAQ section, keep business and author information clear and consistent, and do not block AI search crawlers in robots.txt.",
          ],
        },
      },
    ],
    faq: [
      {
        question: { fa: "آیا سرعت سایت روی رتبه گوگل اثر دارد؟", en: "Does site speed affect Google rankings?" },
        answer: {
          fa: "بله، به‌عنوان بخشی از تجربه صفحه. اما مرتبط بودن و کیفیت محتوا همچنان عامل اصلی است؛ سرعت بیشتر وقتی کمک می‌کند که محتوای خوب هم وجود داشته باشد، و روی نرخ تبدیل هم اثر مستقیم دارد.",
          en: "Yes, as part of page experience. But relevance and content quality remain the main factors; speed helps most when the content is good, and it directly affects conversion rates too.",
        },
      },
      {
        question: { fa: "آیا لازم است امتیاز Lighthouse صد باشد؟", en: "Do I need a Lighthouse score of 100?" },
        answer: {
          fa: "خیر. هدف، قرار گرفتن Core Web Vitals کاربران واقعی در محدوده خوب است. امتیاز Lighthouse ابزار خوبی برای یافتن مشکل است، اما معیار نهایی نیست.",
          en: "No. The goal is real-user Core Web Vitals in the good range. The Lighthouse score is a good tool for finding problems, but it is not the final yardstick.",
        },
      },
      {
        question: { fa: "آیا سایت‌های تک‌صفحه‌ای جاوااسکریپتی برای سئو بد هستند؟", en: "Are JavaScript single-page apps bad for SEO?" },
        answer: {
          fa: "اگر محتوا فقط پس از اجرای جاوااسکریپت در مرورگر ساخته شود، ایندکس کندتر و ناقص‌تر می‌شود و بسیاری از موتورهای هوش مصنوعی آن را نمی‌بینند. رندر سمت سرور یا استاتیک، مسیر امن‌تری است.",
          en: "If content is built only after JavaScript runs in the browser, indexing becomes slower and less complete, and many AI engines do not see it at all. Server or static rendering is the safer path.",
        },
      },
    ],
  },
  {
    slug: "geo-aeo-answer-engine-optimization",
    title: {
      fa: "سئوی نسل جدید: GEO و AEO چیست و چرا برای ۲۰۲۶ اهمیت دارد؟",
      en: "The Next SEO: What GEO and AEO Mean for 2026",
    },
    seoTitle: {
      fa: "GEO و AEO چیست؟ سئوی نسل جدید در ۲۰۲۶",
      en: "What GEO and AEO Mean for SEO in 2026",
    },
    excerpt: {
      fa: "کاربران دیگر فقط در گوگل جست‌وجو نمی‌کنند؛ از ChatGPT و Perplexity هم جواب می‌گیرند. GEO و AEO یعنی محتوای شما را برای همان پاسخ‌ها آماده کنید.",
      en: "People no longer search only on Google—they ask ChatGPT and Perplexity too. GEO and AEO mean preparing your content to be the answer they get.",
    },
    tags: ["SEO", "GEO", "AEO"],
    publishedAt: "2026-08-20",
    coverImage: "/blog/geo-aeo-answer-engine-optimization.jpg",
    coverImageAlt: {
      fa: "پوستر مقاله سئوی نسل جدید: GEO و AEO",
      en: "Cover art for The Next SEO: GEO and AEO",
    },
    directAnswer: {
      fa: "GEO (بهینه‌سازی برای موتورهای مولد) یعنی محتوای شما طوری نوشته و ساختاردهی شود که ابزارهایی مثل ChatGPT، Perplexity و Gemini بتوانند آن را به‌عنوان منبع پاسخ نقل‌قول کنند؛ AEO (بهینه‌سازی برای موتورهای پاسخ‌گو) همان هدف را برای جعبه‌های پاسخ گوگل، دستیار صوتی و «مردم همچنین می‌پرسند» دنبال می‌کند. هر دو روی یک اصل مشترک تکیه دارند: یک پاسخ مستقیم و خودکفا در بالای صفحه، ساختار عنوان‌بندی شفاف، و داده ساختاریافته (Schema) که پاسخ را برای ماشین هم قابل استخراج کند.",
      en: "GEO (Generative Engine Optimization) means writing and structuring content so tools like ChatGPT, Perplexity, and Gemini can cite it as a source. AEO (Answer Engine Optimization) chases the same goal for Google's answer boxes, voice assistants, and \"People also ask.\" Both rest on the same core practice: a direct, self-contained answer near the top of the page, a clear heading structure, and structured data (schema) that makes the answer machine-extractable too.",
    },
    sections: [
      {
        heading: {
          fa: "GEO و AEO دقیقاً چه فرقی با سئوی سنتی دارند؟",
          en: "How are GEO and AEO actually different from classic SEO?",
        },
        paragraphs: {
          fa: [
            "سئوی سنتی برای این بهینه می‌شود که صفحه شما در فهرست نتایج گوگل بالا بیاید و کاربر روی لینک کلیک کند. GEO و AEO یک قدم جلوتر می‌روند: هدف این است که پاسخ شما مستقیماً داخل چت‌بات، جعبه پاسخ یا دستیار صوتی نمایش داده شود—گاهی حتی بدون اینکه کاربر کلیکی انجام دهد.",
            "این یعنی معیار موفقیت هم تغییر می‌کند. رتبه یک دیگر تنها هدف نیست؛ «نقل‌قول‌شدن» و «انتخاب‌شدن به‌عنوان منبع» اهمیت پیدا می‌کند. محتوایی که مبهم، پرحاشیه یا فقط تبلیغاتی باشد، برای این موتورها قابل استخراج و قابل استناد نیست.",
          ],
          en: [
            "Classic SEO optimizes for ranking high in Google's results so a user clicks through. GEO and AEO go one step further: the goal is for your answer to appear directly inside a chatbot reply, an answer box, or a voice response—sometimes without a click happening at all.",
            "That shifts what \"winning\" means. Rank #1 is no longer the only goal; being quoted and chosen as the source matters just as much. Vague, hedge-everything, or purely promotional content is hard for these engines to extract and cite.",
          ],
        },
      },
      {
        heading: {
          fa: "چطور محتوا را برای موتورهای پاسخ‌گو بنویسیم؟",
          en: "How do you write content for answer engines?",
        },
        paragraphs: {
          fa: [
            "بهترین نقطه شروع، جواب دادن به سؤال اصلی در همان چند خط اول است—دقیقاً همان‌طور که در بالای همین مقاله انجام شده. بعد از آن می‌توانید توضیح، استثنا و جزئیات را باز کنید.",
          ],
          en: [
            "The best starting point is answering the core question in the first few lines—exactly like the top of this article does. Everything after that can unpack nuance, exceptions, and detail.",
          ],
        },
        bullets: {
          fa: [
            "یک پاراگراف پاسخ مستقیم و خودکفا (بدون نیاز به خواندن بقیه صفحه) درست زیر عنوان",
            "عنوان‌های H2/H3 را به شکل سؤال واقعی کاربر بنویسید",
            "بخش پرسش‌های متداول (FAQ) با پاسخ‌های کوتاه و دقیق اضافه کنید",
            "به‌جای صفت‌های تبلیغاتی، عدد، منبع و مثال واقعی بیاورید",
          ],
          en: [
            "A direct, self-contained answer paragraph right under the heading",
            "Write H2/H3 headings as the real questions users ask",
            "Add an FAQ section with short, precise answers",
            "Replace marketing adjectives with numbers, sources, and real examples",
          ],
        },
      },
      {
        heading: {
          fa: "چک‌لیست فنی GEO/AEO",
          en: "The technical GEO/AEO checklist",
        },
        paragraphs: {
          fa: [
            "نوشتن خوب کافی نیست؛ ماشین‌ها هم باید بتوانند محتوای شما را بخوانند، درک کنند و به آن استناد دهند.",
          ],
          en: [
            "Good writing is not enough—machines also need to be able to read, parse, and cite your content.",
          ],
        },
        bullets: {
          fa: [
            "داده ساختاریافته Article و FAQPage روی هر مقاله (دقیقاً مطابق محتوای قابل‌مشاهده)",
            "ربات‌های هوش مصنوعی (GPTBot، ClaudeBot، PerplexityBot، Google-Extended) را در robots.txt مسدود نکنید",
            "تاریخ انتشار و به‌روزرسانی را واقعی و به‌روز نگه دارید",
            "به منابع معتبر لینک بدهید و ادعاهای مهم را با داده پشتیبانی کنید",
            "یک HTML تمیز و قابل رندر سمت سرور—محتوای پشت جاوااسکریپت سنگین برای بسیاری از این خزنده‌ها قابل دیدن نیست",
          ],
          en: [
            "Article and FAQPage structured data on every post (matching the visible content exactly)",
            "Don't block AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) in robots.txt",
            "Keep published/updated dates real and current",
            "Link to credible sources and back key claims with data",
            "Clean, server-rendered HTML—content hidden behind heavy client-side JS is invisible to many of these crawlers",
          ],
        },
      },
      {
        heading: {
          fa: "جمع‌بندی: سئوی سنتی را کنار نگذارید",
          en: "The takeaway: don't abandon classic SEO",
        },
        paragraphs: {
          fa: [
            "GEO و AEO جایگزین سئو نیستند؛ لایه‌ای روی همان پایه‌اند. سایتی که سرعت خوب، ساختار فنی درست و محتوای واقعاً مفید دارد، برای هر دو دنیا—نتایج گوگل و پاسخ‌های هوش مصنوعی—آماده‌تر است.",
          ],
          en: [
            "GEO and AEO don't replace SEO; they're a layer on the same foundation. A site with strong performance, solid technical structure, and genuinely useful content is better positioned for both worlds—Google's results and AI-generated answers.",
          ],
        },
      },
    ],
    faq: [
      {
        question: {
          fa: "GEO با AEO چه فرقی دارد؟",
          en: "What's the difference between GEO and AEO?",
        },
        answer: {
          fa: "AEO روی جعبه‌های پاسخ گوگل، دستیار صوتی و «مردم همچنین می‌پرسند» تمرکز دارد؛ GEO مشخصاً روی نقل‌قول‌شدن توسط موتورهای مولد مثل ChatGPT، Perplexity و Gemini. تکنیک‌های بهینه‌سازی—پاسخ مستقیم، ساختار شفاف، داده ساختاریافته—بین این دو مشترک است.",
          en: "AEO focuses on Google's answer boxes, voice assistants, and \"People also ask.\" GEO specifically targets being cited by generative engines like ChatGPT, Perplexity, and Gemini. The optimization techniques—direct answers, clear structure, structured data—largely overlap between the two.",
        },
      },
      {
        question: {
          fa: "آیا باید ربات‌های هوش مصنوعی را در robots.txt مسدود کنم؟",
          en: "Should I block AI crawlers in robots.txt?",
        },
        answer: {
          fa: "برای دیده‌شدن در پاسخ‌های AI باید اجازه دسترسی بدهید. مسدودکردن GPTBot یا Google-Extended یعنی محتوای شما هرگز به‌عنوان منبع پاسخ استفاده نمی‌شود.",
          en: "To appear in AI answers, you need to allow access. Blocking GPTBot or Google-Extended means your content can never be used as a cited source.",
        },
      },
      {
        question: {
          fa: "آیا داده ساختاریافته (Schema) واقعاً روی نتیجه اثر دارد؟",
          en: "Does structured data (schema) really make a difference?",
        },
        answer: {
          fa: "بله. Schema به‌تنهایی رتبه نمی‌سازد، اما استخراج و درک محتوا را برای موتورهای جست‌وجو و موتورهای مولد قابل‌اعتمادتر و سریع‌تر می‌کند—و همین باعث افزایش شانس نقل‌قول‌شدن می‌شود.",
          en: "Yes. Schema alone doesn't create rankings, but it makes content extraction more reliable and faster for both search and generative engines—which raises your odds of being quoted.",
        },
      },
    ],
  },
  {
    slug: "smart-contracts-web3-dex-cex-guide",
    title: {
      fa: "قرارداد هوشمند و Web3: راهنمای کامل ساخت DEX و CEX برای کسب‌وکارهای ایرانی و بین‌المللی",
      en: "Smart Contracts and Web3: A Complete Guide to Building DEXs and CEXs for Iranian and International Businesses",
    },
    seoTitle: {
      fa: "ساخت DEX و CEX با قرارداد هوشمند؛ راهنمای Web3",
      en: "Building a DEX or CEX with Smart Contracts",
    },
    excerpt: {
      fa: "قرارداد هوشمند چیست، DEX و CEX چطور کار می‌کنند، کدام را بسازیم و امنیت، تحریم و الزامات بازار ایران و خارج از ایران چه تفاوتی ایجاد می‌کنند.",
      en: "What smart contracts are, how DEXs and CEXs actually work, which one to build, and how security, sanctions, and local-market constraints differ between Iran and the rest of the world.",
    },
    seoDescription: {
      fa: "قرارداد هوشمند چیست، DEX و CEX چطور کار می‌کنند، کدام را بسازیم و امنیت، تحریم و الزامات بازار ایران و جهان چه تفاوتی ایجاد می‌کنند.",
      en: "What smart contracts are, how DEXs and CEXs work, which to build, and how security, sanctions, and local rules differ in Iran and worldwide.",
    },
    tags: ["Web3", "Blockchain", "Smart Contract", "DEX", "CEX"],
    publishedAt: "2026-10-19",
    coverImage: "/blog/smart-contracts-web3-dex-cex-guide.jpg",
    coverImageAlt: {
      fa: "دفتر سفارش صرافی متمرکز کنار منحنی استخر نقدینگی صرافی غیرمتمرکز",
      en: "A centralized exchange order book beside the liquidity-pool curve of a decentralized exchange",
    },
    directAnswer: {
      fa: "قرارداد هوشمند برنامه‌ای است که روی بلاکچین اجرا می‌شود و بدون واسطه، شرط‌هایی را که از قبل نوشته شده اعمال می‌کند. صرافی متمرکز (CEX) مثل یک بانک عمل می‌کند: دارایی کاربر را نزد خود نگه می‌دارد و سفارش‌ها را روی سرورهای خودش تطبیق می‌دهد. صرافی غیرمتمرکز (DEX) همین کار را با قراردادهای هوشمند انجام می‌دهد و کاربر دارایی‌اش را خودش نگه می‌دارد. ساخت CEX بیشتر مسئله امنیت زیرساخت، نقدینگی و الزامات قانونی است؛ ساخت DEX بیشتر مسئله امنیت کد و جذب نقدینگی. هیچ‌کدام برای همه مناسب نیستند و انتخاب درست به مخاطب، بازار هدف و توان نگهداری تیم بستگی دارد.",
      en: "A smart contract is a program that runs on a blockchain and enforces pre-written rules without an intermediary. A centralized exchange (CEX) works like a bank: it holds user funds and matches orders on its own servers. A decentralized exchange (DEX) does the same job with smart contracts while users keep custody of their assets. Building a CEX is mostly a problem of infrastructure security, liquidity, and regulation; building a DEX is mostly a problem of code security and liquidity bootstrapping. Neither fits everyone, and the right choice depends on your audience, target market, and the team's ability to operate it long term.",
    },
    sections: [
      {
        heading: {
          fa: "قرارداد هوشمند دقیقاً چیست و چه چیزی نیست؟",
          en: "What exactly is a smart contract, and what is it not?",
        },
        paragraphs: {
          fa: [
            "قرارداد هوشمند یک برنامه کوچک است که روی یک بلاکچین مثل اتریوم مستقر می‌شود. هر کس می‌تواند توابع آن را صدا بزند و نتیجه را همه گره‌های شبکه تأیید می‌کنند. مثال ساده: قراردادی که می‌گوید «اگر خریدار مبلغ را واریز کرد، توکن به او منتقل شود». این منطق بدون نیاز به شرکت، بانک یا وکیل اجرا می‌شود.",
            "اما چند تصور غلط رایج وجود دارد. قرارداد هوشمند «هوشمند» به معنای هوش مصنوعی نیست؛ فقط کدی است که دقیقاً همان چیزی را انجام می‌دهد که نوشته شده، چه درست باشد و چه اشتباه. همچنین «قرارداد» به معنای حقوقی کلمه نیست و بدون چارچوب قانونی، خودبه‌خود قابل پیگیری قضایی نیست. و مهم‌تر از همه: اگر قراردادی مستقر شد، تغییر آن سخت یا غیرممکن است. اشتباه در کد، یعنی اشتباه در پولی که دست آن کد است.",
            "به همین دلیل کیفیت مهندسی، تست و بازبینی امنیتی در پروژه‌های Web3 از بقیه نرم‌افزارها جدی‌تر است. در وب‌سایت معمولی، باگ را فردا اصلاح می‌کنید؛ در یک قرارداد مستقرشده، ممکن است همان شب دارایی کاربران از بین برود.",
          ],
          en: [
            "A smart contract is a small program deployed to a blockchain such as Ethereum. Anyone can call its functions, and every node on the network verifies the result. A simple example: a contract that says, if the buyer pays the agreed amount, transfer the token to them. That logic runs without a company, a bank, or a lawyer in the middle.",
            "A few misconceptions are common. Smart does not mean artificial intelligence; the contract is just code that does exactly what it was written to do, right or wrong. Contract also does not mean a legal contract, and without a legal framework it is not automatically enforceable in court. Most importantly, once a contract is deployed it is hard or impossible to change. A bug in the code is a bug in whatever money that code controls.",
            "That is why engineering quality, testing, and security review matter more in Web3 than in most software. On a normal website you fix a bug tomorrow; on a deployed contract, user funds can be gone the same night.",
          ],
        },
      },
      {
        heading: {
          fa: "کدام شبکه و کدام زبان؟ انتخاب بستر فنی",
          en: "Which chain and which language? Choosing the technical foundation",
        },
        paragraphs: {
          fa: [
            "اکثر پروژه‌ها از شبکه‌های سازگار با EVM شروع می‌کنند، چون ابزارها، کتابخانه‌ها و توسعه‌دهندگان بیشتری دارند. زبان اصلی آن‌ها Solidity است و ابزارهای رایج برای تست و استقرار، Hardhat و Foundry هستند. کتابخانه‌هایی مثل OpenZeppelin پیاده‌سازی‌های بازبینی‌شده استانداردهایی مثل ERC-20 را در اختیار می‌گذارند و بهتر است به‌جای نوشتن از صفر، از همین‌ها استفاده شود.",
            "انتخاب شبکه به هزینه تراکنش، سرعت و مخاطب بستگی دارد. اتریوم اصلی امنیت و اعتبار بالایی دارد اما کارمزد آن در زمان شلوغی بالا می‌رود. شبکه‌های لایه دوم مثل Arbitrum، Optimism و Base کارمزد کمتری دارند و همچنان به امنیت اتریوم تکیه می‌کنند. TRON برای انتقال USDT بسیار رایج است و Solana معماری و زبان متفاوتی دارد (Rust) که مسیر توسعه را جدا می‌کند.",
          ],
          en: [
            "Most projects start on EVM-compatible chains because the tooling, libraries, and developer pool are largest there. The main language is Solidity, and the usual tools for testing and deployment are Hardhat and Foundry. Libraries such as OpenZeppelin ship reviewed implementations of standards like ERC-20, and it is almost always better to use those than to write them from scratch.",
            "Choosing a network comes down to transaction cost, speed, and where your users are. Ethereum mainnet offers strong security and credibility but fees rise when the network is busy. Layer-2 networks such as Arbitrum, Optimism, and Base cost less while inheriting Ethereum's security. TRON is widely used for USDT transfers, and Solana uses a different architecture and language (Rust), which splits the development path entirely.",
          ],
        },
        bullets: {
          fa: [
            "استاندارد توکن‌های fungible: ERC-20؛ توکن‌های یکتا (NFT): ERC-721 و ERC-1155",
            "ابتدا روی testnet مستقر کنید و فقط بعد از تست و بازبینی، به mainnet بروید",
            "تصمیم بگیرید قرارداد قابل ارتقا (upgradeable) باشد یا ثابت؛ هر کدام ریسک و مزیت خودش را دارد",
          ],
          en: [
            "Fungible token standard: ERC-20; unique tokens (NFTs): ERC-721 and ERC-1155",
            "Deploy to a testnet first, and move to mainnet only after testing and review",
            "Decide whether the contract is upgradeable or fixed; each has its own risks and benefits",
          ],
        },
      },
      {
        heading: {
          fa: "صرافی متمرکز (CEX) چطور کار می‌کند؟",
          en: "How does a centralized exchange (CEX) work?",
        },
        paragraphs: {
          fa: [
            "در CEX کاربر ثبت‌نام و احراز هویت می‌کند، دارایی‌اش را به کیف پول صرافی واریز می‌کند و در عمل صرافی نگهدار دارایی او می‌شود. سفارش‌های خرید و فروش وارد یک موتور تطبیق (matching engine) روی سرورهای صرافی می‌شوند و معامله‌ها در پایگاه داده صرافی ثبت می‌شوند، نه روی بلاکچین. بلاکچین فقط هنگام واریز و برداشت وارد کار می‌شود.",
            "این معماری سرعت و تجربه کاربری عالی می‌دهد: سفارش‌های حدی و بازاری، اهرم، پشتیبانی مشتری و درگاه ریالی یا فیات. اما قیمتش اعتماد است. کاربر باید به امنیت و صداقت صرافی اعتماد کند، و تاریخ بازار نمونه‌های متعددی از هک شدن یا ورشکستگی صرافی‌ها را نشان داده است؛ فروپاشی FTX در سال ۲۰۲۲ شناخته‌شده‌ترین مثال است.",
            "ساخت یک CEX جدی فقط نوشتن یک موتور تطبیق نیست. باید مدیریت کیف پول گرم و سرد، سیستم دفتر کل دقیق، احراز هویت و AML، پایش تقلب، پشتیبانی، و مهم‌تر از همه نقدینگی و مجوزهای لازم را در نظر گرفت.",
          ],
          en: [
            "On a CEX the user signs up, completes identity verification, deposits assets into the exchange's wallets, and effectively lets the exchange hold them. Buy and sell orders go into a matching engine on the exchange's servers, and trades are recorded in the exchange's database, not on the blockchain. The blockchain only gets involved at deposit and withdrawal time.",
            "That architecture delivers speed and a polished experience: limit and market orders, leverage, customer support, and fiat gateways. The price is trust. Users must trust the exchange's security and honesty, and market history is full of exchange hacks and collapses; the FTX failure in 2022 is the best-known example.",
            "Building a serious CEX is far more than writing a matching engine. You need hot and cold wallet management, an accurate ledger, KYC and AML, fraud monitoring, support, and above all liquidity and the right licenses.",
          ],
        },
        bullets: {
          fa: [
            "مزیت‌ها: سرعت بالا، سفارش‌های پیشرفته، پشتیبانی انسانی، امکان درگاه فیات",
            "ریسک‌ها: نگهداری دارایی کاربران، هک، الزامات قانونی و مجوز، اعتماد کاربر",
            "هزینه اصلی: زیرساخت امنیتی، تیم عملیات و انطباق (compliance)، نه فقط توسعه",
          ],
          en: [
            "Strengths: high speed, advanced order types, human support, fiat gateway options",
            "Risks: custody of user funds, hacks, regulation and licensing, user trust",
            "Main cost: security infrastructure, operations, and compliance teams, not just development",
          ],
        },
      },
      {
        heading: {
          fa: "صرافی غیرمتمرکز (DEX) چطور کار می‌کند؟",
          en: "How does a decentralized exchange (DEX) work?",
        },
        paragraphs: {
          fa: [
            "در DEX کاربر با کیف پول خودش (مثل MetaMask) وصل می‌شود و دارایی‌اش هیچ‌وقت به حساب صرافی نمی‌رود. معامله مستقیم با یک قرارداد هوشمند انجام می‌شود. محبوب‌ترین مدل، AMM یا بازارساز خودکار است: به‌جای دفتر سفارش، یک استخر نقدینگی شامل دو توکن وجود دارد و قیمت بر اساس نسبت موجودی استخر محاسبه می‌شود. در ساده‌ترین حالت (مدل Uniswap نسخه ۲) حاصل‌ضرب موجودی دو توکن ثابت می‌ماند: x × y = k.",
            "نقدینگی را کاربرانی به نام liquidity provider تأمین می‌کنند و در ازای آن سهمی از کارمزد معاملات می‌گیرند. این مدل ریسک‌هایی هم دارد: ضرر ناپایدار (impermanent loss)، لغزش قیمت (slippage) در استخرهای کم‌عمق، و حملاتی مثل front-running و MEV که در آن‌ها ربات‌ها از ترتیب تراکنش‌ها سود می‌برند.",
            "نکته مهم: کپی کردن کد یک DEX معروف از نظر فنی ساده است، اما بخش سخت کسب‌وکار، جذب نقدینگی و کاربر است. بدون نقدینگی، قیمت‌ها بد می‌شوند و کاربر برنمی‌گردد. پس برنامه جذب نقدینگی را از روز اول با طراحی فنی کنار هم بنویسید.",
          ],
          en: [
            "On a DEX the user connects their own wallet (such as MetaMask) and the assets never move into an exchange account. Trades happen directly against a smart contract. The most popular model is the AMM, or automated market maker: instead of an order book there is a liquidity pool holding two tokens, and the price is computed from the pool's balances. In the simplest form (Uniswap v2), the product of the two balances stays constant: x × y = k.",
            "Liquidity is supplied by users called liquidity providers, who earn a share of trading fees. The model has its own risks: impermanent loss, slippage in shallow pools, and attacks such as front-running and MEV, where bots profit from transaction ordering.",
            "One important point: copying a well-known DEX's code is technically easy, but the hard business problem is attracting liquidity and users. Without liquidity, prices are poor and users do not return, so plan liquidity acquisition together with the technical design from day one.",
          ],
        },
        bullets: {
          fa: [
            "مزیت‌ها: کاربر دارایی‌اش را خودش نگه می‌دارد، شفافیت کد و تراکنش‌ها، دسترسی بدون ثبت‌نام",
            "ریسک‌ها: باگ قرارداد، دستکاری اوراکل قیمت، تجربه کاربری سخت‌تر برای تازه‌کارها",
            "هزینه اصلی: امنیت کد، ممیزی مستقل و جذب نقدینگی",
          ],
          en: [
            "Strengths: users keep custody, code and transactions are transparent, no signup required",
            "Risks: contract bugs, price-oracle manipulation, a harder experience for newcomers",
            "Main cost: code security, independent audits, and liquidity acquisition",
          ],
        },
      },
      {
        heading: {
          fa: "DEX یا CEX؟ چطور انتخاب کنیم",
          en: "DEX or CEX? How to choose",
        },
        paragraphs: {
          fa: [
            "جواب به یک پرسش ساده برمی‌گردد: چه کسی دارایی کاربر را نگه می‌دارد و شما چه مسئولیتی را حاضرید بپذیرید؟ اگر مخاطب شما کاربران عادی و تازه‌کار است که پشتیبانی و درگاه ریالی می‌خواهند، مدل متمرکز طبیعی‌تر است، با همه الزامات و ریسک‌هایش. اگر مخاطب کاربران آشنا با کیف پول و DeFi است و می‌خواهید بازار یک توکن یا دارایی مشخص را راه بیندازید، DEX یا یک استخر نقدینگی ساده معمولاً مسیر کوتاه‌تری است.",
            "بسیاری از پروژه‌ها اصلاً به ساخت صرافی کامل نیاز ندارند. اگر هدف شما ساخت توکن، پاداش وفاداری، فروش اولیه، استخر staking یا بازار NFT است، یک یا چند قرارداد هوشمند به‌همراه یک فرانت‌اند خوب کافی است و هزینه و ریسک بسیار کمتری دارد.",
          ],
          en: [
            "It comes down to one question: who holds the user's assets, and what responsibility are you willing to take on? If your audience is everyday, less technical users who want support and a local-currency gateway, the centralized model is more natural, along with all its obligations and risks. If your audience already uses wallets and DeFi and you want a market for a specific token or asset, a DEX or a simple liquidity pool is usually the shorter path.",
            "Many projects do not need a full exchange at all. If the goal is a token, loyalty rewards, an initial sale, a staking pool, or an NFT marketplace, one or a few smart contracts plus a good frontend are enough, at much lower cost and risk.",
          ],
        },
        bullets: {
          fa: [
            "کاربر عادی + درگاه ریالی + پشتیبانی → CEX یا همکاری با صرافی موجود",
            "کاربر آشنا با کیف پول + بازار توکن مشخص → DEX یا استخر نقدینگی",
            "فقط توکن، staking یا NFT → چند قرارداد هوشمند و یک dApp، بدون ساخت صرافی",
          ],
          en: [
            "Everyday users + local-currency gateway + support → CEX or partnering with an existing exchange",
            "Wallet-native users + a specific token market → DEX or a liquidity pool",
            "Just a token, staking, or NFTs → a few smart contracts and a dApp, no exchange needed",
          ],
        },
      },
      {
        heading: {
          fa: "امنیت: جایی که پروژه‌های Web3 زمین می‌خورند",
          en: "Security: where Web3 projects fail",
        },
        paragraphs: {
          fa: [
            "بیشتر حمله‌های بزرگ به پروژه‌های Web3 از چند الگوی مشخص می‌آیند و بیشتر آن‌ها قابل پیشگیری هستند. نکته مهم این است که امنیت یک مرحله پایانی نیست؛ از روز اول باید در طراحی باشد.",
          ],
          en: [
            "Most major attacks on Web3 projects come from a handful of known patterns, and most are preventable. Security is not a final step; it has to be part of the design from day one.",
          ],
        },
        bullets: {
          fa: [
            "Reentrancy: قرارداد پیش از به‌روزرسانی وضعیت، به قرارداد دیگر پول می‌دهد. الگوی checks-effects-interactions و محافظ reentrancy آن را کنترل می‌کند",
            "کنترل دسترسی ضعیف: توابع حساس بدون محدودیت صدا زده می‌شوند. دسترسی را حداقلی و شفاف نگه دارید",
            "دستکاری اوراکل قیمت: قیمت لحظه‌ای یک استخر کوچک را نباید به‌تنهایی مبنای تصمیم گذاشت",
            "کلیدهای خصوصی و ادمین: از multisig و timelock استفاده کنید تا یک کلید لو رفته کل پروژه را نبرد",
            "تست و ممیزی: تست واحد، fuzzing، بازبینی داخلی و سپس ممیزی مستقل پیش از mainnet؛ در نهایت یک برنامه bug bounty",
            "در Solidity نسخه ۰٫۸ به بعد، سرریز عددی به‌صورت پیش‌فرض خطا می‌دهد، اما بقیه باگ‌های منطقی هنوز با خود شماست",
          ],
          en: [
            "Reentrancy: the contract sends funds to another contract before updating its own state. The checks-effects-interactions pattern and a reentrancy guard control it",
            "Weak access control: sensitive functions callable by anyone. Keep permissions minimal and explicit",
            "Price oracle manipulation: never base decisions solely on the spot price of a small pool",
            "Admin and private keys: use multisig and timelocks so one leaked key cannot take down the whole project",
            "Testing and audits: unit tests, fuzzing, internal review, then an independent audit before mainnet, and finally a bug bounty",
            "Since Solidity 0.8, arithmetic overflow reverts by default, but logic bugs remain entirely your responsibility",
          ],
        },
      },
      {
        heading: {
          fa: "ایران و بازار بین‌المللی: چه تفاوتی در عمل وجود دارد؟",
          en: "Iran and international markets: what actually differs in practice",
        },
        paragraphs: {
          fa: [
            "از نظر فنی، قرارداد هوشمند در همه‌جا یکسان است؛ تفاوت اصلی در محیط پیرامونی است. در بازار بین‌المللی، مهم‌ترین مسئله پیروی از قوانین هر کشور هدف است: مجوز ارائه خدمات دارایی دیجیتال، الزامات KYC/AML و محدودیت‌های جغرافیایی. این الزامات بین کشورها تفاوت زیادی دارند و باید پیش از ساخت از مشاور حقوقی همان بازار پرسید.",
            "برای کسب‌وکارهایی که در ایران فعالیت می‌کنند یا کاربر ایرانی دارند، چند عامل دیگر هم مطرح است. تحریم‌ها و محدودیت‌های پرداخت، دسترسی به برخی خدمات بین‌المللی (از جمله بعضی صرافی‌ها، پرداخت‌ها و سرویس‌های ابری) را محدود می‌کند و انتخاب زیرساخت را تحت تأثیر قرار می‌دهد. مقررات داخلی حوزه رمزارز نیز ممکن است مرتب تغییر کند. ما مشاوره حقوقی نمی‌دهیم و پیشنهاد می‌کنیم پیش از هر تصمیم، آخرین وضعیت قوانین و الزامات را از منابع رسمی و متخصص حقوقی بررسی کنید؛ نباید هیچ پروژه‌ای بر دور زدن قوانین بنا شود.",
            "از نظر محصول هم تفاوت‌هایی هست: کاربران ایرانی معمولاً به رابط فارسی و راست‌چین، پشتیبانی به زبان فارسی و تجربه ساده‌ای برای واریز و برداشت نیاز دارند، و بازار داخلی به‌شدت به تبدیل ریال و ثبات قیمت حساس است. در مقابل، بازار بین‌المللی انتظار مستندات انگلیسی، ممیزی عمومی قراردادها و شفافیت بیشتر دارد. به همین دلیل پروژه‌هایی که هر دو بازار را هدف می‌گیرند، معمولاً از ابتدا دوزبانه، با معماری ماژولار و رعایت استانداردهای امنیتی بین‌المللی ساخته می‌شوند.",
          ],
          en: [
            "Technically a smart contract is the same everywhere; what differs is the surrounding environment. In international markets the main concern is compliance with each target country's rules: licensing for digital-asset services, KYC/AML requirements, and geographic restrictions. These vary widely between countries, and you should consult legal counsel in the specific market before you build.",
            "For businesses operating in Iran or serving Iranian users, a few more factors apply. Sanctions and payment restrictions limit access to some international services (including certain exchanges, payment providers, and cloud services) and shape infrastructure choices. Domestic crypto regulation may also change frequently. We do not provide legal advice, and we recommend checking the current rules with official sources and a qualified lawyer before deciding anything; no project should be built on circumventing the law.",
            "Product expectations differ too: Iranian users usually need a Persian, right-to-left interface, Persian-language support, and a simple deposit and withdrawal experience, and the domestic market is highly sensitive to currency conversion and price stability. International markets expect English documentation, public contract audits, and more transparency. That is why projects targeting both markets are usually built bilingual from the start, with a modular architecture and international security standards.",
          ],
        },
      },
      {
        heading: {
          fa: "مسیر پیشنهادی برای شروع یک پروژه",
          en: "A suggested path for starting a project",
        },
        paragraphs: {
          fa: [
            "ساخت پروژه Web3 با یک مرحله سنگین و ناگهانی شروع نمی‌شود. مسیر منطقی، قدم‌به‌قدم است و در هر مرحله می‌توانید ادامه دهید یا متوقف شوید.",
          ],
          en: [
            "A Web3 project should not begin with one heavy, sudden step. A sensible path is incremental, and at each stage you can continue or stop.",
          ],
        },
        bullets: {
          fa: [
            "۱. تعریف مسئله: چه کسی استفاده می‌کند؟ چه دارایی‌ای در گردش است؟ آیا واقعاً به بلاکچین نیاز دارید؟",
            "۲. معماری و مدل تهدید: انتخاب شبکه، استانداردها، نقش‌ها و نقاط ریسک",
            "۳. توسعه قراردادها با کتابخانه‌های بازبینی‌شده و تست سناریومحور (Hardhat یا Foundry)",
            "۴. استقرار روی testnet، ساخت فرانت‌اند dApp و اتصال کیف پول",
            "۵. ممیزی مستقل، بازبینی نتایج و انتشار تدریجی با سقف محدود",
            "۶. پایش، پشتیبانی و برنامه به‌روزرسانی بعد از انتشار",
          ],
          en: [
            "1. Define the problem: who uses it, what assets move, and do you genuinely need a blockchain?",
            "2. Architecture and threat model: chain choice, standards, roles, and risk points",
            "3. Build the contracts with reviewed libraries and scenario-driven tests (Hardhat or Foundry)",
            "4. Deploy to a testnet, build the dApp frontend, and connect wallets",
            "5. Independent audit, fix findings, and release gradually with capped limits",
            "6. Monitoring, support, and an update plan after launch",
          ],
        },
      },
      {
        heading: {
          fa: "جمع‌بندی",
          en: "The takeaway",
        },
        paragraphs: {
          fa: [
            "قرارداد هوشمند ابزار قدرتمندی است، اما فقط وقتی که مسئله درستی را حل کند. پیش از ساخت DEX یا CEX از خودتان بپرسید که آیا واقعاً یک صرافی لازم است یا یک توکن و چند قرارداد ساده کافی است. بعد از آن، امنیت، نقدینگی و پیروی از قوانین را همان‌قدر جدی بگیرید که خود کد را.",
            "اگر قصد ساخت یک پروژه Web3 دارید، تیم سوشو استودیو می‌تواند در طراحی معماری، توسعه و تست قراردادهای هوشمند و ساخت فرانت‌اند dApp همراه شما باشد. با توضیح هدف و بازار هدف‌تان از بخش تماس شروع کنید.",
          ],
          en: [
            "A smart contract is a powerful tool, but only when it solves the right problem. Before building a DEX or CEX, ask yourself whether you truly need an exchange or whether a token and a few simple contracts are enough. After that, treat security, liquidity, and compliance as seriously as the code itself.",
            "If you plan a Web3 project, the Sosho Studio team can help with architecture, smart contract development and testing, and building the dApp frontend. Start from the contact section by describing your goal and target market.",
          ],
        },
      },
    ],
    faq: [
      {
        question: {
          fa: "تفاوت اصلی DEX و CEX چیست؟",
          en: "What is the main difference between a DEX and a CEX?",
        },
        answer: {
          fa: "در CEX صرافی دارایی کاربر را نگه می‌دارد و سفارش‌ها را روی سرورهای خودش تطبیق می‌دهد. در DEX معامله با قرارداد هوشمند انجام می‌شود و کاربر دارایی‌اش را در کیف پول خودش نگه می‌دارد.",
          en: "On a CEX the exchange holds user assets and matches orders on its own servers. On a DEX trades execute against a smart contract and users keep their assets in their own wallets.",
        },
      },
      {
        question: {
          fa: "ساخت یک DEX ساده‌تر است یا CEX؟",
          en: "Is it easier to build a DEX or a CEX?",
        },
        answer: {
          fa: "از نظر فنی کد یک DEX پایه کوچک‌تر است، اما امنیت قرارداد و جذب نقدینگی چالش اصلی است. CEX به زیرساخت امنیتی بزرگ‌تر، تیم عملیات و انطباق قانونی نیاز دارد. هیچ‌کدام ساده نیست و هزینه و ریسک هر دو به مقیاس پروژه بستگی دارد.",
          en: "Technically a basic DEX has less code, but contract security and liquidity acquisition are the main challenges. A CEX needs larger security infrastructure, operations, and regulatory compliance. Neither is simple, and the cost and risk of both depend on the project's scale.",
        },
      },
      {
        question: {
          fa: "آیا برای هر پروژه Web3 باید ممیزی امنیتی انجام داد؟",
          en: "Does every Web3 project need a security audit?",
        },
        answer: {
          fa: "اگر قرارداد دارایی واقعی کاربران را نگه می‌دارد یا جابه‌جا می‌کند، ممیزی مستقل پیش از انتشار اکیداً توصیه می‌شود. برای نمونه‌های آزمایشی روی testnet لازم نیست، اما تست و بازبینی داخلی همیشه ضروری است.",
          en: "If the contract holds or moves real user assets, an independent audit before release is strongly recommended. It is not needed for experimental testnet prototypes, but testing and internal review are always necessary.",
        },
      },
      {
        question: {
          fa: "آیا می‌توان قرارداد هوشمند را بعد از استقرار تغییر داد؟",
          en: "Can a smart contract be changed after deployment?",
        },
        answer: {
          fa: "به‌صورت پیش‌فرض خیر. اگر از الگوی قرارداد قابل ارتقا (proxy) استفاده شود، می‌توان منطق را تغییر داد، اما این کار ریسک‌های خودش را دارد و اعتماد کاربر به مدیر ارتقا را می‌طلبد؛ معمولاً با multisig و timelock کنترل می‌شود.",
          en: "Not by default. With an upgradeable (proxy) pattern the logic can be changed, but it brings its own risks and requires users to trust whoever controls upgrades; this is usually controlled with a multisig and a timelock.",
        },
      },
      {
        question: {
          fa: "آیا ساخت صرافی رمزارز در ایران و برای بازار جهانی قانونی است؟",
          en: "Is building a crypto exchange legal in Iran and for global markets?",
        },
        answer: {
          fa: "این به قوانین هر بازار و وضعیت مجوزها بستگی دارد و مرتباً تغییر می‌کند. ما مشاوره حقوقی نمی‌دهیم؛ پیش از ساخت، آخرین مقررات و محدودیت‌ها (از جمله تحریم‌ها) را از منابع رسمی و یک متخصص حقوقی همان بازار بررسی کنید.",
          en: "It depends on each market's laws and licensing situation, and it changes often. We do not give legal advice; before building, check the current rules and restrictions (including sanctions) with official sources and a qualified lawyer in that market.",
        },
      },
    ],
  },
  {
    slug: "erp-system-guide-buy-or-build",
    title: {
      fa: "سیستم ERP چیست؟ چه زمانی به آن نیاز دارید و خرید بهتر است یا ساخت اختصاصی؟",
      en: "What Is an ERP System? When You Need One and Whether to Buy or Build",
    },
    seoTitle: {
      fa: "سیستم ERP چیست؟ خرید یا ساخت اختصاصی",
      en: "What Is an ERP System? Buy or Build",
    },
    excerpt: {
      fa: "راهنمای عملی برای مدیران: ERP چه مشکلی را حل می‌کند، چه ماژول‌هایی دارد، گزینه‌های ایرانی و خارجی کدام‌اند و چطور بدون شکست پیاده‌سازی کنیم.",
      en: "A practical guide for business owners: what problem ERP solves, which modules matter, how Iranian and international options compare, and how to implement without failing.",
    },
    seoDescription: {
      fa: "ERP چه مشکلی را حل می‌کند، چه ماژول‌هایی دارد، گزینه‌های ایرانی و خارجی کدام‌اند و چطور بدون شکست پیاده‌سازی کنیم؛ راهنمای عملی برای مدیران.",
      en: "What ERP solves, which modules matter, how Iranian and international options compare, and how to implement it without failing: a practical guide.",
    },
    tags: ["ERP", "Business", "Automation"],
    publishedAt: "2026-10-19",
    coverImage: "/blog/erp-system-guide-buy-or-build.jpg",
    coverImageAlt: {
      fa: "هاب مرکزی ERP متصل به ماژول‌های مالی، انبار، فروش، مشتری و تولید",
      en: "A central ERP hub connected to finance, inventory, sales, customer and operations modules",
    },
    directAnswer: {
      fa: "ERP (برنامه‌ریزی منابع سازمان) نرم‌افزاری است که بخش‌های مختلف کسب‌وکار مثل حسابداری، انبار، خرید، فروش و منابع انسانی را روی یک پایگاه داده مشترک و یکپارچه اجرا می‌کند تا اطلاعات فقط یک‌بار ثبت شود و همه از همان یک منبع درست استفاده کنند. وقتی با اکسل و چند نرم‌افزار جدا، ناهماهنگی موجودی، گزارش دیر یا ثبت تکراری اطلاعات دارید، زمان بررسی ERP است. در اغلب موارد، پیاده‌سازی یک محصول آماده یا متن‌باز با سفارشی‌سازی محدود، منطقی‌تر از ساخت کامل از صفر است؛ ساخت اختصاصی فقط وقتی ارزش دارد که فرایندهای شما واقعاً با محصولات موجود جور نباشد.",
      en: "ERP (enterprise resource planning) is software that runs the different parts of a business, such as accounting, inventory, purchasing, sales, and HR, on one shared, integrated database, so data is entered once and everyone works from the same source of truth. When spreadsheets and disconnected tools cause stock mismatches, slow reports, or duplicate data entry, it is time to evaluate ERP. In most cases, implementing a ready-made or open-source product with limited customization makes more sense than building from scratch; a fully custom build is worth it only when your processes genuinely do not fit existing products.",
    },
    sections: [
      {
        heading: {
          fa: "ERP دقیقاً چه مشکلی را حل می‌کند؟",
          en: "What problem does ERP actually solve?",
        },
        paragraphs: {
          fa: [
            "بیشتر کسب‌وکارها در شروع کار با ابزارهای پراکنده شروع می‌کنند: یک فایل اکسل برای انبار، یک نرم‌افزار حسابداری، یک فایل دیگر برای فروش و پیام‌رسان برای هماهنگی. تا وقتی کار کوچک است این روش جواب می‌دهد، اما با رشد حجم کار، مشکل‌ها شروع می‌شوند: موجودی انبار با واقعیت نمی‌خواند، گزارش فروش و حسابداری عدد متفاوتی نشان می‌دهند و بستن حساب آخر ماه چند روز طول می‌کشد.",
            "ریشه همه این مشکلات یکی است: اطلاعات در چند جا نگهداری می‌شوند و باید دستی هماهنگ شوند. ERP این مسئله را با یک پایگاه داده مشترک حل می‌کند. وقتی فاکتور فروش ثبت می‌شود، همان لحظه موجودی انبار کم می‌شود، حساب مشتری به‌روز می‌شود و سند حسابداری ساخته می‌شود؛ بدون اینکه کسی سه بار اطلاعات را وارد کند.",
          ],
          en: [
            "Most businesses start with scattered tools: a spreadsheet for stock, an accounting application, another file for sales, and a messaging app to coordinate. That works while the business is small, but as volume grows the problems begin: stock levels do not match reality, sales and accounting reports show different numbers, and closing the books at month-end takes days.",
            "All of these share one root cause: information lives in several places and has to be reconciled by hand. ERP solves this with a shared database. When a sales invoice is recorded, stock is reduced at that moment, the customer's balance updates, and the accounting entry is created, without anyone typing the data three times.",
          ],
        },
      },
      {
        heading: {
          fa: "ماژول‌های اصلی یک ERP",
          en: "The core modules of an ERP",
        },
        paragraphs: {
          fa: [
            "ERP یک نرم‌افزار واحد نیست، مجموعه‌ای از ماژول‌هاست که به هم وصل‌اند. لازم نیست همه را یک‌جا راه‌اندازی کنید؛ بهتر است با ماژولی شروع کنید که بیشترین درد را دارد.",
          ],
          en: [
            "ERP is not a single program but a set of connected modules. You do not need to launch all of them at once; it is better to begin with the module where the pain is greatest.",
          ],
        },
        bullets: {
          fa: [
            "مالی و حسابداری: اسناد، حساب‌های دریافتنی و پرداختنی، چک، بانک و گزارش‌های مالی",
            "انبار و موجودی: ورود و خروج کالا، چند انبار، شماره سریال و حداقل موجودی",
            "خرید و فروش: پیش‌فاکتور، سفارش، فاکتور، قیمت‌گذاری و مدیریت تأمین‌کننده",
            "مدیریت ارتباط با مشتری (CRM): سرنخ‌ها، پیگیری‌ها و تاریخچه مشتری",
            "تولید: فرمول ساخت (BOM)، دستور کار و بهای تمام‌شده",
            "منابع انسانی و حقوق: پرسنل، حضور و غیاب، حقوق و دستمزد",
            "گزارش‌گیری و داشبورد: دید لحظه‌ای مدیر به فروش، موجودی و سودآوری",
          ],
          en: [
            "Finance and accounting: journal entries, receivables and payables, cheques, banking, and financial reports",
            "Inventory: stock in and out, multiple warehouses, serial numbers, and reorder levels",
            "Purchasing and sales: quotes, orders, invoices, pricing, and supplier management",
            "Customer relationship management (CRM): leads, follow-ups, and customer history",
            "Manufacturing: bills of materials, work orders, and cost of goods",
            "HR and payroll: employee records, attendance, and salaries",
            "Reporting and dashboards: a live view of sales, stock, and profitability",
          ],
        },
      },
      {
        heading: {
          fa: "نشانه‌هایی که می‌گویند وقت ERP رسیده است",
          en: "Signs it is time for an ERP",
        },
        paragraphs: {
          fa: [
            "ERP یک سرمایه‌گذاری و تغییر سازمانی است، نه فقط خرید نرم‌افزار. اگر مشکلات زیر برای شما آشناست، ارزش بررسی دارد؛ اگر نه، شاید یک اصلاح فرایند یا یک ابزار ساده‌تر کافی باشد.",
          ],
          en: [
            "ERP is an investment and an organizational change, not just a software purchase. If the problems below sound familiar it is worth evaluating; if not, a process fix or a simpler tool may be enough.",
          ],
        },
        bullets: {
          fa: [
            "یک اطلاعات را در چند فایل یا نرم‌افزار دو یا چند بار وارد می‌کنید",
            "موجودی انبار با شمارش واقعی همیشه اختلاف دارد",
            "تهیه یک گزارش ساده مدیریتی چند ساعت یا چند روز زمان می‌برد",
            "رشد کار، شعبه یا انبار جدید، هماهنگی را بسیار سخت کرده است",
            "فروشگاه آنلاین، انبار و حسابداری با هم هماهنگ نیستند",
            "اطلاعات مهم در ذهن یا فایل شخصی چند نفر است و با رفتن آن‌ها از بین می‌رود",
          ],
          en: [
            "You enter the same data two or more times across files or programs",
            "Stock levels never match the physical count",
            "A simple management report takes hours or days to prepare",
            "Growth, a new branch, or a new warehouse has made coordination painful",
            "Your online store, warehouse, and accounting are out of sync",
            "Critical knowledge lives in a few people's heads or personal files and leaves when they do",
          ],
        },
      },
      {
        heading: {
          fa: "خرید ERP آماده، متن‌باز یا ساخت اختصاصی؟",
          en: "Buy a ready-made ERP, use open source, or build custom?",
        },
        paragraphs: {
          fa: [
            "سه مسیر اصلی وجود دارد و هر کدام برای شرایط متفاوتی مناسب است. انتخاب باید بر اساس فرایندهای واقعی شما باشد، نه تبلیغات محصولات.",
            "محصولات آماده (مثل SAP، Microsoft Dynamics 365 و Oracle NetSuite در سطح بین‌المللی و نرم‌افزارهایی مانند سپیدار، هلو، راهکاران و همکاران سیستم در ایران) سریع‌ترین راه‌اندازی را دارند و پشتیبانی رسمی ارائه می‌دهند. معمولاً هزینه لایسنس یا اشتراک دارند و سفارشی‌سازی عمیق آن‌ها محدود یا گران است. ERP متن‌باز (مثل Odoo و ERPNext) انعطاف بیشتری دارد: می‌توانید روی سرور خودتان نصب کنید و ماژول‌های اختصاصی اضافه کنید. در عوض به یک تیم فنی برای نصب، سفارشی‌سازی و نگهداری نیاز دارید. ساخت اختصاصی بیشترین کنترل را می‌دهد اما گران‌ترین و پرریسک‌ترین راه است، چون باید همه چیز از حسابداری تا گزارش را خودتان بسازید و سال‌ها نگه دارید.",
            "قاعده خوب این است: تا جایی که ممکن است استاندارد بمانید و فقط جایی سفارشی‌سازی کنید که مزیت رقابتی شما آنجاست. ساخت کامل از صفر فقط وقتی منطقی است که فرایند اصلی کسب‌وکارتان آن‌قدر خاص باشد که هیچ محصول موجودی با آن جور نشود.",
          ],
          en: [
            "There are three main paths, each suited to different situations. The choice should follow your real processes, not product marketing.",
            "Ready-made products (such as SAP, Microsoft Dynamics 365, and Oracle NetSuite internationally, and Sepidar, Holoo, Rahkaran, and Hamkaran System in Iran) are the fastest to start and come with official support. They usually carry license or subscription costs, and deep customization is limited or expensive. Open-source ERPs (such as Odoo and ERPNext) are more flexible: you can host them yourself and add custom modules, but you need a technical team to install, customize, and maintain them. A fully custom build offers the most control but is the most expensive and riskiest path, because you must build everything from accounting to reporting and maintain it for years.",
            "A good rule is to stay as standard as possible and customize only where your competitive advantage lives. Building from scratch is sensible only when your core process is so specific that no existing product fits.",
          ],
        },
        bullets: {
          fa: [
            "محصول آماده: راه‌اندازی سریع، پشتیبانی رسمی؛ سفارشی‌سازی محدود",
            "متن‌باز (Odoo، ERPNext): انعطاف‌پذیر، بدون وابستگی به یک فروشنده؛ نیازمند تیم فنی",
            "ساخت اختصاصی: کنترل کامل؛ گران، زمان‌بر و پرریسک",
            "ترکیبی (هیبریدی): یک هسته آماده یا متن‌باز به‌علاوه سرویس‌ها و اتصالات اختصاصی؛ اغلب بهترین تعادل",
          ],
          en: [
            "Ready-made: quick start, official support; limited customization",
            "Open source (Odoo, ERPNext): flexible, no single-vendor lock-in; needs a technical team",
            "Custom build: full control; expensive, slow, and risky",
            "Hybrid: a ready-made or open-source core plus custom services and integrations; often the best balance",
          ],
        },
      },
      {
        heading: {
          fa: "ملاحظات ویژه کسب‌وکارهای ایرانی",
          en: "Considerations specific to Iranian businesses",
        },
        paragraphs: {
          fa: [
            "ERP در ایران چند نیاز خاص دارد که در محصولات خارجی معمولاً به‌صورت پیش‌فرض وجود ندارند. تقویم شمسی و رابط فارسی راست‌چین، مدیریت چک (دریافتی و پرداختی با وضعیت‌های مختلف)، اسناد حسابداری مطابق روال رایج کشور، مالیات بر ارزش افزوده و ارتباط با سامانه مودیان مالیاتی برای صدور صورتحساب الکترونیکی از مهم‌ترین آن‌هاست. همچنین نوسان قیمت و تورم بر قیمت‌گذاری، ارزش‌گذاری موجودی و بهای تمام‌شده اثر مستقیم دارد.",
            "از طرف دیگر، دسترسی به برخی محصولات بین‌المللی ابری یا پرداخت اشتراک آن‌ها از ایران ممکن است با محدودیت روبه‌رو شود. این یکی از دلایلی است که راهکارهای داخلی یا ERP متن‌باز قابل نصب روی سرور خودتان در ایران محبوب‌اند. هر راهکاری را پیش از تصمیم نهایی روی سناریوهای واقعی خودتان آزمایش کنید: ثبت فاکتور، چک، گزارش مالیاتی و بستن ماه.",
            "اگر بازار بین‌المللی هم دارید، مثلاً صادرات یا شرکت زیرمجموعه خارجی، ممکن است به چند ارز، چند زبان و گزارش‌های استاندارد بین‌المللی هم نیاز داشته باشید. این موضوع باید در همان انتخاب اول در نظر گرفته شود، چون تغییر آن بعداً پرهزینه است.",
          ],
          en: [
            "ERP in Iran has several specific needs that foreign products usually do not provide out of the box. The Jalali (Solar Hijri) calendar and a Persian right-to-left interface, cheque management (received and issued, with many statuses), accounting entries aligned with common local practice, VAT, and integration with the national tax system (Moadian) for electronic invoicing are among the most important. Price volatility and inflation also directly affect pricing, inventory valuation, and cost of goods.",
            "On the other hand, access to some international cloud products, or paying for their subscriptions from Iran, may be restricted. That is one reason domestic solutions, or open-source ERPs you can host on your own server in Iran, are popular. Whatever you choose, test it on your real scenarios before the final decision: recording an invoice, a cheque, a tax report, and closing a month.",
            "If you also serve international markets, for example through exports or a foreign subsidiary, you may need multiple currencies, languages, and standard international reports. Factor that into the very first choice, because changing it later is costly.",
          ],
        },
      },
      {
        heading: {
          fa: "چطور پیاده‌سازی کنیم که شکست نخورد؟",
          en: "How to implement without failing",
        },
        paragraphs: {
          fa: [
            "بیشتر پروژه‌های ERP به‌خاطر نرم‌افزار شکست نمی‌خورند؛ به‌خاطر مسیر پیاده‌سازی شکست می‌خورند. این‌ها رایج‌ترین دلایل و راه جلوگیری از آن‌هاست:",
          ],
          en: [
            "Most ERP projects do not fail because of the software; they fail because of how they were implemented. Here are the most common causes and how to avoid them:",
          ],
        },
        bullets: {
          fa: [
            "اول فرایند، بعد نرم‌افزار: فرایندهای فعلی را روی کاغذ بیاورید. خودکارسازی یک فرایند خراب فقط خرابی را سریع‌تر می‌کند",
            "کوچک شروع کنید: ماژول به ماژول جلو بروید (مثلاً انبار و فروش، سپس حسابداری) به‌جای راه‌اندازی همه‌چیز در یک روز",
            "تمیزکاری داده: کالاهای تکراری، مشتریان ناقص و موجودی غلط را قبل از انتقال به سیستم جدید اصلاح کنید",
            "مسئول پروژه از داخل سازمان: یک نفر باید صاحب پروژه باشد و تصمیم بگیرد؛ پیمانکار به‌تنهایی کافی نیست",
            "آموزش کاربران: بهترین سیستم هم اگر کاربر از آن استفاده نکند بی‌فایده است",
            "سفارشی‌سازی با احتیاط: هر سفارشی‌سازی هزینه به‌روزرسانی و نگهداری آینده دارد",
            "دوره اجرای موازی: برای مدتی سیستم قدیم و جدید را کنار هم نگه دارید و نتایج را مقایسه کنید",
          ],
          en: [
            "Process first, software second: document your current processes. Automating a broken process only makes the breakage faster",
            "Start small: go module by module (for example inventory and sales first, then accounting) instead of launching everything in one day",
            "Clean the data: fix duplicate items, incomplete customers, and wrong stock before migrating to the new system",
            "An internal project owner: someone inside the company must own the project and make decisions; a contractor alone is not enough",
            "Train users: even the best system is useless if people do not use it",
            "Customize with caution: every customization adds future upgrade and maintenance cost",
            "Run in parallel for a while: keep the old and new systems side by side and compare results",
          ],
        },
      },
      {
        heading: {
          fa: "اتصال ERP به سایت، فروشگاه آنلاین و بقیه سیستم‌ها",
          en: "Connecting ERP to your website, online store, and other systems",
        },
        paragraphs: {
          fa: [
            "ارزش واقعی ERP وقتی کامل می‌شود که به بقیه سیستم‌ها وصل باشد. فروشگاه آنلاین (مثلاً ووکامرس یا یک فروشگاه اختصاصی) می‌تواند موجودی را از ERP بخواند و سفارش‌ها را مستقیم به آن بفرستد، درگاه پرداخت می‌تواند وضعیت پرداخت را به سند حسابداری وصل کند، و پیامک یا ایمیل می‌توانند به‌صورت خودکار از وضعیت سفارش ارسال شوند. این اتصال‌ها معمولاً از طریق API ساخته می‌شوند.",
            "داشبوردهای مدیریتی سفارشی هم از همین راه ساخته می‌شوند: به‌جای باز کردن چند گزارش، مدیر در یک صفحه فروش امروز، موجودی کم‌شده و مطالبات معوق را می‌بیند. اتوماسیون‌های مبتنی بر هوش مصنوعی هم می‌توانند روی داده‌های ERP کار کنند، مثلاً خلاصه‌سازی گزارش‌ها یا پیش‌بینی نیاز به سفارش مجدد.",
            "تیم سوشو استودیو در طراحی سایت و فروشگاه، ساخت API و اتصال سیستم‌ها و ساخت داشبورد و اتوماسیون تجربه دارد و می‌تواند این لایه اتصال را برای ERP انتخابی شما بسازد.",
          ],
          en: [
            "ERP's real value shows when it is connected to your other systems. An online store (for example WooCommerce or a custom shop) can read stock from the ERP and push orders straight into it, a payment gateway can tie payment status to the accounting entry, and SMS or email can be sent automatically from order status. These connections are usually built through APIs.",
            "Custom management dashboards are built the same way: instead of opening several reports, a manager sees today's sales, low stock, and overdue receivables on one page. AI-based automation can also work on ERP data, for example summarizing reports or predicting reorder needs.",
            "The Sosho Studio team has experience in website and store design, building APIs and system integrations, and creating dashboards and automation, and can build this integration layer for whichever ERP you choose.",
          ],
        },
      },
      {
        heading: {
          fa: "جمع‌بندی",
          en: "The takeaway",
        },
        paragraphs: {
          fa: [
            "ERP جادو نیست؛ ابزاری است که فرایندهای خوب را سریع‌تر و قابل‌اعتمادتر می‌کند. قبل از انتخاب نرم‌افزار، فرایندها و مشکل اصلی‌تان را مشخص کنید، با ماژول کوچکی شروع کنید و تا حد ممکن استاندارد بمانید. در بیشتر موارد، یک محصول آماده یا متن‌باز به‌همراه چند اتصال اختصاصی، منطقی‌ترین و اقتصادی‌ترین مسیر است.",
          ],
          en: [
            "ERP is not magic; it is a tool that makes good processes faster and more reliable. Before choosing software, define your processes and your core problem, start with a small module, and stay as standard as you can. In most cases a ready-made or open-source product plus a few custom integrations is the most sensible and economical route.",
          ],
        },
      },
    ],
    faq: [
      {
        question: {
          fa: "ERP با نرم‌افزار حسابداری چه فرقی دارد؟",
          en: "How is ERP different from accounting software?",
        },
        answer: {
          fa: "نرم‌افزار حسابداری فقط بخش مالی را پوشش می‌دهد. ERP علاوه بر مالی، انبار، خرید، فروش، تولید و منابع انسانی را هم روی یک پایگاه داده مشترک اجرا می‌کند تا اطلاعات بین بخش‌ها خودکار هماهنگ شود.",
          en: "Accounting software covers only finance. ERP also runs inventory, purchasing, sales, manufacturing, and HR on one shared database, so data stays in sync across departments automatically.",
        },
      },
      {
        question: {
          fa: "پیاده‌سازی ERP چقدر طول می‌کشد؟",
          en: "How long does ERP implementation take?",
        },
        answer: {
          fa: "بسته به اندازه سازمان، تعداد ماژول‌ها و کیفیت داده‌ها از چند هفته تا چند ماه متغیر است. شروع با یک یا دو ماژول مهم و گسترش مرحله‌ای، معمولاً سریع‌تر و کم‌ریسک‌تر از راه‌اندازی یک‌باره است.",
          en: "It ranges from a few weeks to several months depending on company size, number of modules, and data quality. Starting with one or two key modules and expanding in stages is usually faster and less risky than a single big launch.",
        },
      },
      {
        question: {
          fa: "آیا شرکت کوچک هم به ERP نیاز دارد؟",
          en: "Does a small company need an ERP?",
        },
        answer: {
          fa: "همیشه نه. اگر حجم کار کم است و اطلاعات هماهنگ هستند، یک نرم‌افزار حسابداری و انبار ساده کافی است. وقتی ثبت تکراری، اختلاف موجودی یا گزارش‌های دیر به مشکل تبدیل شد، زمان بررسی ERP است.",
          en: "Not always. If volume is low and information is consistent, simple accounting and inventory software is enough. When duplicate entry, stock mismatches, or slow reports become a problem, it is time to evaluate ERP.",
        },
      },
      {
        question: {
          fa: "ساخت ERP اختصاصی بهتر است یا خرید ERP آماده؟",
          en: "Is a custom ERP better than a ready-made one?",
        },
        answer: {
          fa: "در بیشتر موارد خرید یا استفاده از ERP متن‌باز با سفارشی‌سازی محدود اقتصادی‌تر و کم‌ریسک‌تر است. ساخت اختصاصی فقط وقتی ارزش دارد که فرایند اصلی کسب‌وکار شما با هیچ محصول موجودی سازگار نباشد.",
          en: "In most cases a ready-made or open-source ERP with limited customization is cheaper and less risky. A custom build is worth it only when your core process fits no existing product.",
        },
      },
      {
        question: {
          fa: "آیا می‌توان ERP را به فروشگاه آنلاین وصل کرد؟",
          en: "Can an ERP be connected to an online store?",
        },
        answer: {
          fa: "بله. با API یا افزونه‌های اختصاصی می‌توان موجودی، سفارش‌ها و وضعیت پرداخت را بین فروشگاه آنلاین و ERP به‌صورت خودکار همگام کرد و ثبت دستی را حذف نمود.",
          en: "Yes. Through an API or custom plugins, stock, orders, and payment status can sync automatically between the online store and the ERP, removing manual entry.",
        },
      },
    ],
  },
  {
    slug: "smart-contract-erp-crm-integration",
    title: {
      fa: "قرارداد هوشمند و ERP/CRM: چطور داده بلاکچین را به فرایند کسب‌وکار وصل کنیم؟",
      en: "Smart Contracts Meet ERP and CRM: Connecting On-Chain Data to Your Business Processes",
    },
    seoTitle: {
      fa: "اتصال قرارداد هوشمند به ERP و CRM",
      en: "Connecting Smart Contracts to ERP and CRM",
    },
    excerpt: {
      fa: "معماری، سناریوهای واقعی، حسابداری، امنیت و نکات ایران و بازار جهانی برای اتصال قرارداد هوشمند به ERP و CRM بدون ثبت تکراری و ناهماهنگی.",
      en: "Architecture, real scenarios, accounting, security, and Iran versus global considerations for wiring smart contracts into ERP and CRM without duplicate or mismatched records.",
    },
    seoDescription: {
      fa: "معماری، سناریوهای واقعی، حسابداری و امنیت برای اتصال قرارداد هوشمند به ERP و CRM، بدون ثبت تکراری و ناهماهنگی داده؛ با نکات ایران و بازار جهانی.",
      en: "Architecture, real scenarios, accounting, and security for wiring smart contracts into ERP and CRM without duplicate or mismatched records.",
    },
    tags: ["Web3", "ERP", "CRM", "Smart Contract", "Integration"],
    publishedAt: "2026-10-19",
    coverImage: "/blog/smart-contract-erp-crm-integration.jpg",
    coverImageAlt: {
      fa: "زنجیره‌ای از بلوک‌ها که از طریق یک دروازه به داشبورد ERP و CRM وصل می‌شود",
      en: "A chain of blocks connected through a gateway to an ERP and CRM dashboard",
    },
    directAnswer: {
      fa: "برای اتصال قرارداد هوشمند به ERP یا CRM، قرارداد را منبع رویداد بدانید: یک سرویس میانی (listener یا indexer) رویدادهای معتبر را بعد از تعداد کافی تأیید از بلاکچین می‌خواند، تبدیل و اعتبارسنجی می‌کند و با API به ERP (سند حسابداری، موجودی، تسویه) یا CRM (وضعیت معامله و مشتری) می‌فرستد. ERP و CRM مستقیم به بلاکچین وصل نمی‌شوند و کلید خصوصی هرگز نباید داخل آن‌ها باشد؛ لایه میانی با کلید یکتای تراکنش، مدیریت خطا، تطبیق دوره‌ای و پایش جلوی ثبت تکراری و ناهماهنگی را می‌گیرد.",
      en: "To connect a smart contract to an ERP or CRM, treat the contract as an event source: a middle service (a listener or indexer) reads valid events from the chain after enough confirmations, validates and maps them, and posts them through an API to the ERP (accounting entries, stock, settlement) or the CRM (deal and customer status). The ERP and CRM never talk to the blockchain directly and private keys must never live inside them; the middle layer prevents duplicate and mismatched records through unique transaction keys, error handling, periodic reconciliation, and monitoring.",
    },
    sections: [
      {
        heading: {
          fa: "چرا قرارداد هوشمند را به ERP و CRM وصل کنیم؟",
          en: "Why connect a smart contract to your ERP and CRM?",
        },
        paragraphs: {
          fa: [
            "بلاکچین و قرارداد هوشمند در یک کار خوب‌اند: ثبت و اجرای قواعد مشترک بین طرف‌هایی که به هم اعتماد کامل ندارند، مثل پرداخت، امانت‌داری یا مالکیت یک دارایی. اما کسب‌وکار شما فقط تسویه نیست؛ فاکتور، موجودی، مشتری، قیمت، تحویل و گزارش هم دارد، و این‌ها در ERP و CRM زندگی می‌کنند.",
            "اگر این دو دنیا به هم وصل نباشند، یک نفر باید هر روز تراکنش‌های بلاکچین را باز کند، با فاکتورها تطبیق دهد و دستی در سیستم حسابداری وارد کند. این کار کند و پرخطاست و خیلی زود به همان اکسل‌هایی برمی‌گردد که ERP برای حذفشان آمده بود. اتصال درست یعنی هر رویداد مهم روی زنجیره، خودکار و قابل ردیابی، به رکورد درست در سیستم داخلی تبدیل شود.",
          ],
          en: [
            "Blockchains and smart contracts are good at one thing: recording and enforcing shared rules between parties that do not fully trust each other, such as payments, escrow, or ownership of an asset. But your business is not only settlement; it has invoices, stock, customers, pricing, delivery, and reporting, and those live in the ERP and CRM.",
            "If the two worlds are not connected, someone has to open blockchain transactions every day, match them to invoices, and key them into accounting by hand. That is slow and error-prone, and it quickly drifts back to the spreadsheets an ERP was meant to remove. A proper integration turns every important on-chain event into the right internal record, automatically and traceably.",
          ],
        },
      },
      {
        heading: {
          fa: "سه سناریوی عملی",
          en: "Three practical scenarios",
        },
        paragraphs: {
          fa: [
            "این الگو در چند مورد واقعی بیشتر از بقیه دیده می‌شود. در هر سه، قرارداد هوشمند فقط بخشی از کار را انجام می‌دهد و بقیه با سیستم‌های داخلی هماهنگ می‌شود.",
          ],
          en: [
            "This pattern shows up most often in a few real situations. In all three the smart contract does only part of the job and the rest is coordinated with internal systems.",
          ],
        },
        bullets: {
          fa: [
            "پرداخت فاکتور با استیبل‌کوین: قرارداد یا آدرس دریافت، پرداخت را ثبت می‌کند و سیستم میانی بعد از تأیید کافی، فاکتور را در ERP تسویه می‌کند و سند حسابداری می‌سازد",
            "امانت‌داری مرحله‌ای پروژه (escrow): با تحویل هر مرحله، بخشی از مبلغ آزاد می‌شود و CRM وضعیت معامله را از «در انتظار پرداخت» به «در حال اجرا» یا «تحویل‌شده» تغییر می‌دهد",
            "باشگاه مشتریان توکنی: امتیاز یا توکن وفاداری روی زنجیره صادر می‌شود و CRM همان را به پروفایل مشتری و کمپین‌های بعدی وصل می‌کند",
            "ردیابی زنجیره تأمین: ثبت مراحل حمل و تحویل روی زنجیره، موجودی و وضعیت سفارش را در ERP به‌روز می‌کند",
          ],
          en: [
            "Invoice payment with a stablecoin: a contract or receiving address records the payment, and after enough confirmations the middle service settles the invoice in the ERP and creates the accounting entry",
            "Milestone escrow for a project: each delivered milestone releases part of the funds, and the CRM moves the deal from awaiting payment to in progress or delivered",
            "A token-based loyalty program: points or loyalty tokens are issued on-chain and the CRM links them to the customer profile and later campaigns",
            "Supply-chain tracking: shipping and delivery steps recorded on-chain update stock and order status in the ERP",
          ],
        },
      },
      {
        heading: {
          fa: "معماری پیشنهادی: یک لایه میانی، نه اتصال مستقیم",
          en: "The recommended architecture: a middle layer, not a direct link",
        },
        paragraphs: {
          fa: [
            "ERP و CRM برای کار با تراکنش‌های بلاکچین ساخته نشده‌اند. بیشتر آن‌ها از طریق API، وب‌هوک یا میان‌افزار به سیستم‌های بیرونی وصل می‌شوند، و همین مسیر برای بلاکچین هم درست است. بین زنجیره و سیستم داخلی یک سرویس واسط بگذارید که تنها همین کار را انجام دهد.",
            "اجزای اصلی این لایه ساده‌اند و هر کدام جلوی یک خطای مشخص را می‌گیرند.",
          ],
          en: [
            "ERPs and CRMs were not built to handle blockchain transactions. Most connect to outside systems through APIs, webhooks, or middleware, and the same route is right for a blockchain. Put a dedicated service between the chain and the internal system that does only this job.",
            "The main pieces of that layer are simple, and each one prevents a specific class of failure.",
          ],
        },
        bullets: {
          fa: [
            "شنونده رویداد (listener یا indexer): رویدادهای قرارداد را از یک یا چند RPC می‌خواند",
            "صف و پردازشگر: رویداد را بعد از تعداد تأیید کافی پردازش می‌کند و در خطا دوباره تلاش می‌کند",
            "نگاشت و اعتبارسنجی: مقدار، ارز، شناسه فاکتور یا سفارش را با رکورد داخلی تطبیق می‌دهد",
            "کلید یکتای تراکنش (idempotency): با ترکیب شناسه تراکنش و شماره رویداد، یک رویداد را فقط یک بار در ERP یا CRM ثبت می‌کند",
            "اتصال‌دهنده ERP/CRM: همه نوشتن‌ها از طریق API رسمی و با مجوز محدود انجام می‌شود",
            "تطبیق دوره‌ای و پایش: هر شب موجودی و تراکنش‌های دو طرف را مقایسه و ناهماهنگی را اعلام می‌کند",
          ],
          en: [
            "Event listener or indexer: reads contract events from one or more RPC providers",
            "Queue and worker: processes an event after enough confirmations and retries on failure",
            "Mapping and validation: matches amount, currency, and invoice or order id against the internal record",
            "Idempotency key: combines the transaction id and log index so an event is written to the ERP or CRM only once",
            "ERP/CRM connector: every write goes through the official API with narrowly scoped permissions",
            "Reconciliation and monitoring: a nightly job compares both sides and flags mismatches",
          ],
        },
      },
      {
        heading: {
          fa: "از زنجیره به ERP/CRM: جزئیاتی که خطا می‌سازند",
          en: "From chain to ERP/CRM: the details that cause errors",
        },
        paragraphs: {
          fa: [
            "ساده‌ترین اشتباه این است که به محض دیدن تراکنش، فاکتور را تسویه کنید. تراکنشی که هنوز تأیید کافی ندارد ممکن است در بازسازی زنجیره (reorg) از بین برود. قاعده امن این است که فقط بعد از تعداد تأیید مشخص برای همان شبکه ثبت کنید و پیش از آن، حداکثر وضعیت «در انتظار تأیید» نشان دهید.",
            "نکته بعدی تطبیق است. اگر در پرداخت نشانه‌ای از فاکتور نباشد، تطبیق خودکار سخت می‌شود. بهتر است شناسه فاکتور را در داده رویداد قرارداد، یا با یک آدرس دریافت اختصاصی برای هر فاکتور، همراه پرداخت کنید. مبلغ ناقص، اضافه، یا ارز اشتباه هم باید مسیر مشخص داشته باشد: نه تسویه کامل خودکار و نه نادیده گرفتن، بلکه ارجاع به بررسی انسانی.",
          ],
          en: [
            "The simplest mistake is settling an invoice the moment you see a transaction. A transaction without enough confirmations can disappear in a chain reorganization. The safe rule is to record only after a defined number of confirmations for that network and, before that, show at most a pending status.",
            "The next issue is matching. If a payment carries no sign of the invoice, automatic matching is hard. It is better to attach the invoice id in the contract's event data, or to use a dedicated receiving address per invoice. Underpayment, overpayment, or the wrong currency also need a defined path: neither full automatic settlement nor ignoring it, but a handoff to human review.",
          ],
        },
      },
      {
        heading: {
          fa: "از ERP/CRM به قرارداد: کلید و تأیید",
          en: "From ERP/CRM to the contract: keys and approvals",
        },
        paragraphs: {
          fa: [
            "جهت برعکس حساس‌تر است، چون اینجا پول از سیستم شما بیرون می‌رود. کلید خصوصی نباید داخل ERP، CRM یا پایگاه داده آن‌ها باشد. تراکنش‌های خروجی را از یک سرویس امضا یا کیف پول چندامضایی (multisig) عبور دهید، سقف مبلغ و فهرست مقصدهای مجاز تعریف کنید و بالاتر از یک آستانه، تأیید انسانی بخواهید.",
            "هر درخواست پرداخت باید یک شناسه یکتا داشته باشد تا با تکرار درخواست (مثلاً به‌خاطر خطای شبکه) دو بار پول ارسال نشود. و همه چیز را ثبت کنید: چه کسی تأیید کرد، کدام رکورد ERP مبنا بود، شناسه تراکنش چه بود.",
          ],
          en: [
            "The reverse direction is more sensitive because money leaves your system here. Private keys must not live inside the ERP, the CRM, or their databases. Route outgoing transactions through a signing service or a multisig wallet, define amount limits and an allowlist of destinations, and require human approval above a threshold.",
            "Every payment request needs a unique id so that a retried request (for example after a network error) does not send funds twice. And record everything: who approved it, which ERP record it was based on, and what the transaction id was.",
          ],
        },
      },
      {
        heading: {
          fa: "حسابداری و داده شخصی",
          en: "Accounting and personal data",
        },
        paragraphs: {
          fa: [
            "برای حسابداری، هر تراکنش را با شناسه تراکنش، ارز، مقدار و نرخ تبدیل لحظه ثبت در سند ذخیره کنید تا بعداً قابل حسابرسی باشد. نحوه شناسایی دارایی دیجیتال در حسابداری و مالیات به قوانین هر کشور بستگی دارد و باید با حسابدار یا مشاور مالیاتی خود روشن شود؛ این مقاله مشاوره مالی یا حقوقی نیست.",
            "نکته مهم دیگر داده شخصی است. چیزی که روی بلاکچین نوشته شود تقریباً برای همیشه می‌ماند. نام، شماره تماس، ایمیل یا هر اطلاعات شخصی مشتری را هرگز روی زنجیره ننویسید؛ فقط یک شناسه ناشناس یا هش را روی زنجیره بگذارید و داده واقعی را در CRM و ERP نگه دارید.",
          ],
          en: [
            "For accounting, store each transaction with its transaction id, currency, amount, and the conversion rate at posting time so it can be audited later. How digital assets are recognized for accounting and tax depends on each country and should be settled with your accountant or tax adviser; this article is not financial or legal advice.",
            "Personal data is the other key point. Whatever is written to a blockchain stays almost forever. Never write a customer's name, phone number, email, or any personal data on-chain; put only an anonymous identifier or a hash on-chain and keep the real data in the CRM and ERP.",
          ],
        },
      },
      {
        heading: {
          fa: "ایران و بازار جهانی: انتخاب ERP و CRM",
          en: "Iran and global markets: choosing the ERP and CRM",
        },
        paragraphs: {
          fa: [
            "در بازار جهانی، گزینه‌هایی مثل Odoo، ERPNext، NetSuite، Microsoft Dynamics یا SAP برای ERP و HubSpot، Salesforce، Zoho یا SuiteCRM برای CRM رایج‌اند و همه API یا وب‌هوک دارند. در ایران، نرم‌افزارهای حسابداری و ERP داخلی مثل سپیدار، هلو یا راهکاران بیشتر روی نیازهای مالیاتی و مالی داخلی تمرکز دارند و اتصال آن‌ها به بلاکچین معمولاً با یک سرویس واسط اختصاصی انجام می‌شود. قابلیت‌ها و API هر محصول را پیش از تصمیم از فروشنده بپرسید و روی نسخه آزمایشی امتحان کنید.",
            "برای کسب‌وکارهایی که در ایران کار می‌کنند یا کاربر ایرانی دارند، تحریم‌ها و محدودیت‌های پرداخت می‌تواند دسترسی به برخی سرویس‌های ابری و پرداخت‌های بین‌المللی را محدود کند. ERP و CRM متن‌باز روی سرور خودتان معمولاً وابستگی کمتری ایجاد می‌کند و داده‌ها را نزد شما نگه می‌دارد. ما مشاوره حقوقی نمی‌دهیم؛ قوانین و محدودیت‌های مرتبط با رمزارز، تحریم و پرداخت را پیش از اجرا از منابع رسمی و متخصص حقوقی بررسی کنید.",
          ],
          en: [
            "In global markets, options such as Odoo, ERPNext, NetSuite, Microsoft Dynamics, or SAP for ERP and HubSpot, Salesforce, Zoho, or SuiteCRM for CRM are common, and all offer APIs or webhooks. In Iran, domestic accounting and ERP products such as Sepidar, Holoo, or Rahkaran focus mostly on local tax and financial needs, and connecting them to a blockchain is usually done through a custom middle service. Ask each vendor about capabilities and APIs before deciding and test on a trial version.",
            "For businesses operating in Iran or serving Iranian users, sanctions and payment restrictions can limit access to some cloud services and international payments. A self-hosted open-source ERP and CRM usually creates less dependency and keeps data with you. We do not give legal advice; check the rules on crypto, sanctions, and payments with official sources and a qualified lawyer before building.",
          ],
        },
      },
      {
        heading: {
          fa: "مسیر اجرا: از فقط‌خواندنی تا خودکار",
          en: "Rollout: from read-only to automated",
        },
        paragraphs: {
          fa: [
            "کم‌ریسک‌ترین راه این است که اتصال را مرحله‌ای بسازید و در هر مرحله نتیجه را با انسان تطبیق دهید.",
          ],
          en: [
            "The lowest-risk way is to build the integration in stages and reconcile each stage against a human check.",
          ],
        },
        bullets: {
          fa: [
            "۱. فقط خواندن: رویدادهای زنجیره را در یک داشبورد نشان دهید و با رکوردهای ERP/CRM مقایسه کنید",
            "۲. پیش‌نویس: رکورد را به‌صورت پیش‌نویس در ERP/CRM بسازید و یک نفر تأیید کند",
            "۳. ثبت خودکار: برای موارد ساده و کم‌مبلغ ثبت مستقیم را فعال کنید و موارد غیرعادی را به بررسی بفرستید",
            "۴. دوطرفه: درخواست‌های پرداخت از ERP/CRM را با تأیید و امضای امن به قرارداد برگردانید",
            "هر مرحله را اول روی شبکه آزمایشی و محیط آزمایشی ERP/CRM امتحان کنید",
          ],
          en: [
            "1. Read-only: show chain events on a dashboard and compare them with ERP/CRM records",
            "2. Draft: create the record as a draft in the ERP/CRM and have a person confirm it",
            "3. Automatic posting: enable direct posting for simple, low-value cases and send unusual ones to review",
            "4. Two-way: send payment requests from the ERP/CRM back to the contract with secure approval and signing",
            "Test every stage first on a test network and a sandbox ERP/CRM",
          ],
        },
      },
      {
        heading: {
          fa: "جمع‌بندی",
          en: "The takeaway",
        },
        paragraphs: {
          fa: [
            "قرارداد هوشمند و ERP/CRM رقیب هم نیستند؛ یکی تسویه و اعتماد بین طرف‌ها را حل می‌کند و دیگری عملیات و حافظه کسب‌وکار را. اتصال امن آن‌ها به یک لایه میانی ساده، کلید یکتا برای هر رویداد، تأیید کافی پیش از ثبت و تطبیق دوره‌ای نیاز دارد.",
            "اگر قصد دارید قرارداد هوشمند یا یک dApp را به ERP و CRM خود وصل کنید، تیم سوشو استودیو می‌تواند در طراحی معماری، ساخت قرارداد و سرویس واسط، API و داشبورد همراه شما باشد. هدف و سیستم‌های فعلی‌تان را از بخش تماس برای ما بنویسید.",
          ],
          en: [
            "Smart contracts and ERP/CRM are not rivals; one solves settlement and trust between parties and the other holds the operations and memory of the business. Connecting them safely takes a simple middle layer, a unique key for every event, enough confirmations before posting, and periodic reconciliation.",
            "If you plan to connect a smart contract or a dApp to your ERP and CRM, the Sosho Studio team can help with the architecture, building the contract and the middle service, the APIs, and the dashboard. Tell us your goal and current systems through the contact section.",
          ],
        },
      },
    ],
    faq: [
      {
        question: {
          fa: "آیا ERP یا CRM می‌تواند مستقیم به بلاکچین وصل شود؟",
          en: "Can an ERP or CRM connect to a blockchain directly?",
        },
        answer: {
          fa: "بیشتر آن‌ها قابلیت بومی خواندن تراکنش بلاکچین ندارند. روش رایج این است که یک سرویس میانی رویدادها را بخواند و از طریق API یا وب‌هوک به ERP یا CRM بفرستد. قابلیت‌های هر محصول را از فروشنده بپرسید.",
          en: "Most do not natively read blockchain transactions. The usual approach is a middle service that reads events and sends them to the ERP or CRM through an API or webhook. Ask each vendor about its capabilities.",
        },
      },
      {
        question: {
          fa: "چه زمانی با خیال راحت فاکتور را تسویه کنیم؟",
          en: "When is it safe to settle an invoice?",
        },
        answer: {
          fa: "فقط بعد از تعداد تأیید مشخص برای همان شبکه. پیش از آن فقط وضعیت «در انتظار تأیید» نشان دهید، چون تراکنش تأییدنشده ممکن است در بازسازی زنجیره از بین برود.",
          en: "Only after a defined number of confirmations for that network. Before that, show only a pending status, because an unconfirmed transaction can vanish in a chain reorganization.",
        },
      },
      {
        question: {
          fa: "آیا اطلاعات مشتری را می‌توان روی بلاکچین نوشت؟",
          en: "Can customer data be written on the blockchain?",
        },
        answer: {
          fa: "توصیه نمی‌شود. داده روی بلاکچین عملاً ماندگار است. فقط یک شناسه ناشناس یا هش بگذارید و اطلاعات واقعی مشتری را در CRM و ERP نگه دارید.",
          en: "It is not recommended. Data on a blockchain is effectively permanent. Put only an anonymous identifier or a hash on-chain and keep the real customer information in the CRM and ERP.",
        },
      },
      {
        question: {
          fa: "کلید خصوصی کجا باید نگهداری شود؟",
          en: "Where should the private key be kept?",
        },
        answer: {
          fa: "بیرون از ERP و CRM، در یک سرویس امضای امن یا کیف پول چندامضایی، با سقف مبلغ، فهرست مقصدهای مجاز و تأیید انسانی برای مبالغ بالا.",
          en: "Outside the ERP and CRM, in a secure signing service or a multisig wallet, with amount limits, an allowlist of destinations, and human approval for large amounts.",
        },
      },
      {
        question: {
          fa: "از کجا شروع کنیم؟",
          en: "Where should we start?",
        },
        answer: {
          fa: "با یک سناریوی کوچک و فقط‌خواندنی: رویدادهای زنجیره را روی داشبورد نشان دهید و با ERP یا CRM مقایسه کنید. بعد به پیش‌نویس با تأیید انسانی و در نهایت ثبت خودکار بروید.",
          en: "With one small read-only scenario: show chain events on a dashboard and compare them with the ERP or CRM. Then move to drafts with human approval and finally automatic posting.",
        },
      },
    ],
  },
];

export function getBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getBlogPostHref(locale: Locale, slug: string) {
  return `/${locale}/blogs/${slug}`;
}
