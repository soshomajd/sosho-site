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
  excerpt: { fa: string; en: string };
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
      en: "WordPress or custom development: which should you choose?",
    },
    excerpt: {
      fa: "یک مقایسه کاربردی بر اساس سرعت لانچ، بودجه، مدیریت محتوا، توسعه‌پذیری و نیاز واقعی کسب‌وکار.",
      en: "A practical comparison based on launch speed, budget, content ownership, scalability, and real business needs.",
    },
    tags: ["WordPress", "Strategy"],
    publishedAt: "2026-02-03",
    coverImage: "/blog/wordpress-or-custom-website.jpg",
    coverImageAlt: {
      fa: "مقایسه یک قالب آماده وردپرس با کد سفارشی؛ دو پنجره مرورگر کنار هم",
      en: "A WordPress-style template layout beside a custom-code window, compared side by side",
    },
    sections: [
      {
        heading: { fa: "با تکنولوژی شروع نکنید", en: "Do not start with the technology" },
        paragraphs: {
          fa: [
            "انتخاب درست از هدف سایت شروع می‌شود: چه کسی از آن استفاده می‌کند، چه کاری باید انجام دهد و تیم شما بعد از لانچ چطور محتوا را مدیریت می‌کند.",
            "وردپرس و توسعه اختصاصی هر دو می‌توانند خروجی عالی بدهند؛ تفاوت در تناسب راهکار با مسئله است، نه در برنده بودن مطلق یکی از آن‌ها.",
          ],
          en: [
            "The right choice starts with the goal: who will use the site, what they need to accomplish, and how your team will manage it after launch.",
            "WordPress and custom development can both produce excellent results. The difference is fit—not one platform being universally better.",
          ],
        },
      },
      {
        heading: { fa: "چه زمانی وردپرس منطقی‌تر است؟", en: "When WordPress makes more sense" },
        paragraphs: {
          fa: ["برای سایت‌های شرکتی، محتوایی و فروشگاه‌هایی با فرایند استاندارد، وردپرس معمولاً مسیر سریع و اقتصادی‌تری است."],
          en: ["For business, editorial, and commerce sites with familiar workflows, WordPress is often the faster and more economical route."],
        },
        bullets: {
          fa: ["تیم محتوا باید بدون توسعه‌دهنده صفحات را مدیریت کند", "زمان لانچ کوتاه است و نیازها استاندارد هستند", "ووکامرس نیازهای اصلی فروشگاه را پوشش می‌دهد", "امکان نگهداری و به‌روزرسانی منظم وجود دارد"],
          en: ["The content team needs independent page editing", "The launch window is short and requirements are standard", "WooCommerce covers the main commerce workflows", "Regular maintenance and updates are planned"],
        },
      },
      {
        heading: { fa: "چه زمانی توسعه اختصاصی ارزش دارد؟", en: "When custom development earns its place" },
        paragraphs: {
          fa: ["اگر منطق محصول، نقش‌های کاربری، اتصال سرویس‌ها یا تجربه تعاملی شما خاص است، معماری اختصاصی کنترل و توسعه‌پذیری بیشتری می‌دهد."],
          en: ["When product logic, user roles, integrations, or interactive experience are distinctive, a custom architecture gives you more control and room to grow."],
        },
        bullets: {
          fa: ["محصول فراتر از یک سایت محتوایی است", "گردش‌کار یا پنل اختصاصی دارید", "عملکرد و مقیاس‌پذیری نیازمند کنترل دقیق است", "قابلیت‌های آینده از همین حالا روی معماری اثر می‌گذارند"],
          en: ["The product goes beyond a content website", "You need custom workflows or dashboards", "Performance and scale require tighter control", "Future capabilities already influence the architecture"],
        },
      },
    ],
  },
  {
    slug: "google-seo-launch-checklist",
    title: {
      fa: "چک‌لیست سئو و ابزارهای گوگل پیش از لانچ سایت",
      en: "The SEO and Google checklist before launching a website",
    },
    excerpt: {
      fa: "موارد فنی و اندازه‌گیری مهمی که بهتر است پیش از انتشار بررسی شوند؛ از ایندکس و اسکیما تا Search Console و GA4.",
      en: "The technical and measurement essentials to check before release—from indexation and schema to Search Console and GA4.",
    },
    tags: ["SEO", "Google"],
    publishedAt: "2026-02-17",
    coverImage: "/blog/google-seo-launch-checklist.jpg",
    coverImageAlt: {
      fa: "چک‌لیست سئو و ذره‌بین روی نمودار رشد، نمادی از آماده‌سازی سایت برای گوگل",
      en: "An SEO launch checklist next to a magnifying glass over a rising growth chart",
    },
    sections: [
      {
        heading: { fa: "اول مطمئن شوید سایت قابل کشف است", en: "First, make sure the site is discoverable" },
        paragraphs: {
          fa: ["ظاهر عالی زمانی ارزش تجاری پیدا می‌کند که موتور جست‌وجو بتواند صفحات درست را پیدا، درک و ایندکس کند."],
          en: ["A polished website creates business value only when search engines can find, understand, and index the right pages."],
        },
        bullets: {
          fa: ["robots.txt و meta robots محیط نهایی را بررسی کنید", "sitemap شامل مسیرهای اصلی و canonicalها صحیح باشد", "عنوان، توضیحات و H1 هر صفحه منحصربه‌فرد باشد", "داده ساختاریافته بدون خطا و مطابق محتوای قابل مشاهده باشد"],
          en: ["Review robots.txt and page-level robots directives in production", "Make sure the sitemap and canonical URLs are correct", "Give every key page a unique title, description, and H1", "Validate structured data against what users can actually see"],
        },
      },
      {
        heading: { fa: "اندازه‌گیری را قبل از ترافیک آماده کنید", en: "Set up measurement before traffic arrives" },
        paragraphs: {
          fa: ["اگر Search Console و Analytics بعداً اضافه شوند، نقطه شروع و بخشی از رفتار روزهای اول را از دست می‌دهید. رویدادهای مهم را قبل از لانچ تعریف و تست کنید."],
          en: ["Adding Search Console and Analytics later means losing the baseline and early user behavior. Define and test meaningful events before launch."],
        },
        bullets: {
          fa: ["اتصال دامنه به Google Search Console", "نصب GA4 یا تگ منیجر با رضایت و حریم خصوصی مناسب", "ثبت فرم، تماس، خرید یا اقدام اصلی به‌عنوان conversion", "بررسی Core Web Vitals روی موبایل واقعی"],
          en: ["Verify the domain in Google Search Console", "Install GA4 or Tag Manager with appropriate consent and privacy", "Track forms, calls, purchases, or the primary action as conversions", "Review Core Web Vitals on real mobile conditions"],
        },
      },
      {
        heading: { fa: "لانچ، شروع فرایند سئو است", en: "Launch is the start of SEO" },
        paragraphs: {
          fa: ["بعد از انتشار، گزارش پوشش ایندکس، کوئری‌ها، صفحات فرود و تبدیل‌ها را بررسی کنید. سئو با یک چک‌لیست تمام نمی‌شود؛ داده واقعی جهت مرحله بعد را مشخص می‌کند."],
          en: ["After release, watch index coverage, queries, landing pages, and conversions. SEO does not end with a checklist; real data shapes the next improvement."],
        },
      },
    ],
  },
  {
    slug: "practical-ai-automation",
    title: {
      fa: "چطور یک اتوماسیون هوش مصنوعی واقعاً مفید بسازیم؟",
      en: "How to build AI automation that is actually useful",
    },
    excerpt: {
      fa: "از انتخاب مسئله و ساخت نمونه کوچک تا اتصال امن داده‌ها و سنجش کیفیت خروجی در استفاده واقعی.",
      en: "From choosing the problem and prototyping to secure data integration and measuring quality in real use.",
    },
    tags: ["AI", "Automation"],
    publishedAt: "2026-03-03",
    coverImage: "/blog/practical-ai-automation.jpg",
    coverImageAlt: {
      fa: "شبکه‌ای از گره‌های متصل به یک تراشه هوش مصنوعی در مرکز",
      en: "Connected nodes around a central AI chip, representing workflow automation",
    },
    sections: [
      {
        heading: { fa: "از مدل شروع نکنید؛ از اصطکاک شروع کنید", en: "Start with friction, not a model" },
        paragraphs: {
          fa: [
            "اول یک کار تکراری، زمان‌بر و قابل اندازه‌گیری پیدا کنید. اگر نتوانید زمان، هزینه یا کیفیت فعلی را توضیح دهید، موفقیت راهکار AI هم قابل سنجش نخواهد بود.",
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
          fa: ["جست‌وجو و پاسخ بر اساس اسناد داخلی", "دسته‌بندی و خلاصه‌سازی درخواست‌های ورودی", "پیش‌نویس پاسخ پشتیبانی با تأیید انسان", "استخراج اطلاعات ساختاریافته از فایل و فرم"],
          en: ["Search and answers grounded in internal documents", "Classification and summarization of inbound requests", "Support reply drafts with human approval", "Structured information extraction from files and forms"],
        },
      },
      {
        heading: { fa: "کیفیت، امنیت و هزینه را با هم بسنجید", en: "Measure quality, security, and cost together" },
        paragraphs: {
          fa: ["یک دمو خوب الزاماً سیستم آماده تولید نیست. سطح دسترسی داده، ثبت خطا، هزینه هر درخواست، سرعت پاسخ و روش بازگشت به انسان باید پیش از استفاده واقعی مشخص باشند."],
          en: ["A strong demo is not automatically production-ready. Data access, failure logging, cost per request, response time, and human escalation all need to be designed before real use."],
        },
        bullets: {
          fa: ["برای پاسخ‌های کلیدی مجموعه تست واقعی بسازید", "اطلاعات حساس را حداقلی و کنترل‌شده در دسترس مدل قرار دهید", "برای اطمینان پایین یا خطا مسیر جایگزین تعریف کنید", "بازخورد کاربران را به چرخه بهبود برگردانید"],
          en: ["Build a real evaluation set for critical answers", "Minimize and control the sensitive data available to the model", "Create fallbacks for low confidence and failures", "Feed user feedback back into the improvement loop"],
        },
      },
    ],
  },
  {
    slug: "nextjs-performance-app-router",
    title: {
      fa: "بهینه‌سازی عملکرد در Next.js (App Router)",
      en: "Optimizing performance in Next.js (App Router)",
    },
    excerpt: {
      fa: "نکات عملی برای بهبود LCP/CLS، استفاده درست از Server/Client Components، dynamic import و بهینه‌سازی تصاویر.",
      en: "Practical tips for better LCP/CLS, correct Server/Client split, dynamic imports, and image optimization.",
    },
    tags: ["Next.js", "Frontend"],
    publishedAt: "2026-03-17",
    coverImage: "/blog/nextjs-performance-app-router.jpg",
    coverImageAlt: {
      fa: "سرعت‌سنج با عقربه در ناحیه سریع و نماد رعد برای عملکرد Next.js",
      en: "A speed gauge with the needle in the fast zone and a lightning bolt, for Next.js performance",
    },
    sections: [
      {
        heading: {
          fa: "تقسیم‌بندی درست کامپوننت‌ها",
          en: "Split components correctly",
        },
        paragraphs: {
          fa: [
            "اولین قدم اینه که منطق سنگین و stateful رو فقط جایی که لازم دارید Client کنید. هرچیزی که می‌تونه Server Component باشه، بهتره Server باقی بمونه.",
            "این کار هم حجم JS سمت کاربر رو کم می‌کنه و هم رندر اولیه سریع‌تر می‌شه.",
          ],
          en: [
            "Start by keeping heavy, stateful logic in Client Components only when necessary. Anything that can stay a Server Component should remain on the server.",
            "This reduces shipped JavaScript and makes the initial render faster.",
          ],
        },
      },
      {
        heading: { fa: "چک‌لیست سریع", en: "Quick checklist" },
        paragraphs: {
          fa: ["چند کار کوچک که معمولاً بیشترین اثر رو دارن:"],
          en: ["A few small things that usually give the biggest impact:"],
        },
        bullets: {
          fa: [
            "تصاویر را با next/image و سایزبندی درست استفاده کنید",
            "کامپوننت‌های سنگین را dynamic import کنید",
            "فقط CSS لازم را لود کنید و از layout shift جلوگیری کنید",
            "در جاهای مناسب از streaming و suspense استفاده کنید",
          ],
          en: [
            "Use next/image with proper sizing",
            "Dynamic import heavy components",
            "Prevent layout shifts with stable layout and correct dimensions",
            "Use streaming/Suspense where it makes sense",
          ],
        },
      },
    ],
  },
  {
    slug: "tailwind-clean-ui-patterns",
    title: {
      fa: "الگوهای UI تمیز با Tailwind",
      en: "Clean UI patterns with Tailwind",
    },
    excerpt: {
      fa: "چطور با توکن‌ها، کامپوننت‌های سبک و حالت‌های hover/focus یک UI حرفه‌ای و قابل نگهداری بسازیم.",
      en: "How to build a maintainable, professional UI with tokens, lightweight components, and proper hover/focus states.",
    },
    tags: ["UI/UX", "Tailwind"],
    publishedAt: "2026-03-31",
    coverImage: "/blog/tailwind-clean-ui-patterns.jpg",
    coverImageAlt: {
      fa: "کارت‌هایی از دکمه، کلید، فیلد ورودی و پروفایل که الگوهای رابط کاربری تمیز را نشان می‌دهند",
      en: "UI component cards (button, toggles, input field, profile) showing clean interface patterns",
    },
    sections: [
      {
        heading: { fa: "از توکن‌ها شروع کن", en: "Start with tokens" },
        paragraphs: {
          fa: [
            "اگر رنگ‌ها و spacing و radius در قالب توکن تعریف بشن، UI یک‌دست می‌مونه و تغییرات آینده خیلی راحت‌تر می‌شه.",
            "بعدش کامپوننت‌ها رو با همون توکن‌ها بسازید تا روی همه صفحات نتیجه یکسان باشه.",
          ],
          en: [
            "When colors, spacing, and radius are tokenized, your UI stays consistent and future changes become much easier.",
            "Then build components on top of those tokens so the whole site stays coherent.",
          ],
        },
      },
      {
        heading: { fa: "حالت‌های تعاملی", en: "Interactive states" },
        paragraphs: {
          fa: [
            "همیشه hover/focus-visible رو جدی بگیر. هم حرفه‌ای‌تره هم دسترس‌پذیری بهتر می‌شه.",
          ],
          en: [
            "Always invest in hover/focus-visible states. It looks more polished and improves accessibility.",
          ],
        },
        bullets: {
          fa: ["Hover subtle", "Focus ring مشخص", "motion-reduce برای انیمیشن"],
          en: [
            "Subtle hover",
            "Clear focus ring",
            "Respect prefers-reduced-motion",
          ],
        },
      },
    ],
  },
  {
    slug: "nodejs-clean-api-architecture",
    title: {
      fa: "معماری تمیز برای API در Node.js",
      en: "A clean Node.js API architecture",
    },
    excerpt: {
      fa: "ساختار پوشه‌ها، لایه service/repository، validation، مدیریت خطا و لاگینگ برای یک API قابل توسعه.",
      en: "Folders, service/repository layers, validation, error handling and logging for scalable APIs.",
    },
    tags: ["Node.js", "Backend"],
    publishedAt: "2026-04-14",
    coverImage: "/blog/nodejs-clean-api-architecture.jpg",
    coverImageAlt: {
      fa: "لایه‌های مسیر، سرویس و پایگاه داده در معماری تمیز API با Node.js",
      en: "Route, service and database layers in a clean Node.js API architecture",
    },
    sections: [
      {
        heading: { fa: "لایه‌ها را جدا کن", en: "Separate layers" },
        paragraphs: {
          fa: [
            "Route/Controller فقط وظیفه دریافت ورودی و برگرداندن پاسخ را داشته باشد.",
            "منطق کسب‌وکار در Service و دسترسی به دیتابیس در Repository قرار بگیرد.",
          ],
          en: [
            "Routes/Controllers should handle I/O only.",
            "Put business logic in Services and database access in Repositories.",
          ],
        },
        bullets: {
          fa: ["Validation ورودی", "خطای استاندارد", "Logging و tracing"],
          en: ["Input validation", "Standardized errors", "Logging & tracing"],
        },
      },
    ],
  },
  {
    slug: "mongodb-data-modeling",
    title: {
      fa: "MongoDB: مدل‌سازی داده برای پروژه‌های واقعی",
      en: "MongoDB: data modeling for real projects",
    },
    excerpt: {
      fa: "نکات مهم در schema design، indexها، و الگوهای رابطه‌ای/توکار برای کارایی بهتر.",
      en: "Key notes on schema design, indexes, and embedded vs referenced patterns for better performance.",
    },
    tags: ["MongoDB", "Backend"],
    publishedAt: "2026-04-28",
    coverImage: "/blog/mongodb-data-modeling.jpg",
    coverImageAlt: {
      fa: "سندهای JSON متصل با ارجاع و یک سند تو در تو برای مدل‌سازی داده در MongoDB",
      en: "JSON documents linked by references and an embedded sub-document, modelling data in MongoDB",
    },
    sections: [
      {
        heading: { fa: "Embed یا Reference؟", en: "Embed or reference?" },
        paragraphs: {
          fa: [
            "اگر داده همیشه همراه والد خوانده می‌شود، embed معمولاً بهتر است. اگر به‌صورت مستقل query می‌شود یا رشد زیادی دارد، reference منطقی‌تر است.",
            "مهم‌ترین نکته اینه که queryهای واقعی پروژه رو محور طراحی قرار بدی.",
          ],
          en: [
            "If data is always read with its parent, embedding is often better. If it’s queried independently or grows a lot, referencing is usually safer.",
            "Design around real queries, not theoretical models.",
          ],
        },
      },
    ],
  },
  {
    slug: "api-validation-security",
    title: {
      fa: "اعتبارسنجی ورودی‌ها و امنیت API",
      en: "API input validation & security basics",
    },
    excerpt: {
      fa: "چک‌لیست امنیتی برای جلوگیری از خطاهای رایج: validate، rate limit، CORS، و مدیریت secrets.",
      en: "A security checklist: validation, rate limiting, CORS, and secrets management.",
    },
    tags: ["Security", "Backend"],
    publishedAt: "2026-05-12",
    coverImage: "/blog/api-validation-security.jpg",
    coverImageAlt: {
      fa: "سپر امنیتی با علامت تأیید که درخواست معتبر را عبور می‌دهد و درخواست نامعتبر را رد می‌کند",
      en: "A security shield with a checkmark letting valid requests through and blocking an invalid one",
    },
    sections: [
      {
        heading: {
          fa: "اصل اول: هیچ ورودی قابل اعتماد نیست",
          en: "Rule #1: never trust input",
        },
        paragraphs: {
          fa: [
            "حتی اگر UI فیلدها را محدود کند، باز هم کاربر می‌تواند مستقیم request بسازد. بنابراین validation باید سمت سرور انجام شود.",
            "کنار validation، rate limiting و مدیریت درست خطاها جلوی خیلی از دردسرها را می‌گیرد.",
          ],
          en: [
            "Even if the UI restricts inputs, users can craft requests directly. Always validate on the server.",
            "Combine validation with rate limiting and safe error handling to avoid common issues.",
          ],
        },
        bullets: {
          fa: [
            "Validation schema",
            "Rate limit",
            "CORS دقیق",
            "Secrets در env",
          ],
          en: [
            "Schema validation",
            "Rate limiting",
            "Strict CORS",
            "Secrets in env",
          ],
        },
      },
    ],
  },
  {
    slug: "solidity-contract-design",
    title: {
      fa: "Solidity: اصول طراحی قرارداد هوشمند",
      en: "Solidity: smart contract design principles",
    },
    excerpt: {
      fa: "الگوهای ساده برای خوانایی، تست‌پذیری و کاهش ریسک: access control، events و error handling.",
      en: "Simple patterns for readability and lower risk: access control, events, and error handling.",
    },
    tags: ["Solidity", "Blockchain"],
    publishedAt: "2026-05-26",
    coverImage: "/blog/solidity-contract-design.jpg",
    coverImageAlt: {
      fa: "سند کد قرارداد هوشمند با قفل دسترسی و نماد اتریوم",
      en: "A smart contract code document with an access lock and an Ethereum-style diamond",
    },
    sections: [
      {
        heading: { fa: "طراحی برای تست", en: "Design for tests" },
        paragraphs: {
          fa: [
            "قرارداد خوب یعنی قرارداد قابل تست. توابع کوچک، وابستگی کم و رویدادهای واضح کمک می‌کنند رفتار قرارداد قابل بررسی باشد.",
            "همیشه access control را شفاف و minimal نگه دار.",
          ],
          en: [
            "Good contracts are testable. Small functions, low coupling, and clear events make behavior verifiable.",
            "Keep access control explicit and minimal.",
          ],
        },
      },
    ],
  },
  {
    slug: "hardhat-testing-deploy",
    title: {
      fa: "Hardhat: تست و دیپلوی قراردادها",
      en: "Hardhat: testing and deploying contracts",
    },
    excerpt: {
      fa: "ساخت تست‌های مطمئن، استفاده از fixtures، و دیپلوی مرحله‌ای با اسکریپت‌های تمیز.",
      en: "Writing solid tests, using fixtures, and clean scripted deployments.",
    },
    tags: ["Hardhat", "Solidity"],
    publishedAt: "2026-06-09",
    coverImage: "/blog/hardhat-testing-deploy.jpg",
    coverImageAlt: {
      fa: "فهرست تست‌های موفق و زنجیره‌ای از بلوک‌ها که استقرار مرحله‌ای قرارداد را نشان می‌دهد",
      en: "A list of passing tests followed by a chain of blocks, showing staged contract deployment",
    },
    sections: [
      {
        heading: {
          fa: "تست‌ها را نزدیک به سناریو بنویس",
          en: "Write scenario-driven tests",
        },
        paragraphs: {
          fa: [
            "تست‌ها را طوری بنویس که سناریوهای واقعی کاربر را پوشش دهند: موفق، شکست، دسترسی غیرمجاز و edge caseها.",
            "برای سرعت و تکرارپذیری از fixture استفاده کن.",
          ],
          en: [
            "Write tests around real user scenarios: success, failure, unauthorized access, and edge cases.",
            "Use fixtures to keep tests fast and repeatable.",
          ],
        },
        bullets: {
          fa: ["Fixtures", "Assertions واضح", "اسکریپت دیپلوی مرحله‌ای"],
          en: ["Fixtures", "Clear assertions", "Stage-based deploy scripts"],
        },
      },
    ],
  },
  {
    slug: "ethersjs-wallets-transactions",
    title: {
      fa: "ethers.js: کار با کیف پول و تراکنش‌ها",
      en: "ethers.js: wallets and transactions",
    },
    excerpt: {
      fa: "اتصال به شبکه‌ها، امضا، ارسال تراکنش، و مدیریت خطاها برای dAppهای واقعی.",
      en: "Connecting to networks, signing, sending transactions, and handling errors in real dApps.",
    },
    tags: ["ethers.js", "Blockchain"],
    publishedAt: "2026-06-23",
    coverImage: "/blog/ethersjs-wallets-transactions.jpg",
    coverImageAlt: {
      fa: "کیف پول، تراکنش امضاشده و دو گره شبکه در حال انتقال آن",
      en: "A wallet, a signed transaction and two network nodes exchanging it",
    },
    sections: [
      {
        heading: {
          fa: "مدیریت خطاها را جدی بگیر",
          en: "Handle errors seriously",
        },
        paragraphs: {
          fa: [
            "خطاهای RPC، کمبود گس، revertها و شبکه‌های مختلف را باید درست مدیریت کنی تا کاربر UX بد نگیرد.",
            "نمایش پیام خطای قابل فهم (نه raw error) به شدت مهم است.",
          ],
          en: [
            "RPC issues, out-of-gas, reverts, and network differences need careful handling to avoid a bad UX.",
            "Always show user-friendly messages instead of raw errors.",
          ],
        },
      },
    ],
  },
  {
    slug: "frontend-backend-api-contracts",
    title: {
      fa: "Frontend ↔ Backend: قرارداد API و DX",
      en: "Frontend ↔ Backend: API contracts and DX",
    },
    excerpt: {
      fa: "چطور با قراردادهای ثابت، تایپ‌ها و خطاهای استاندارد، توسعه تیمی سریع‌تر و کم‌خطاتر شود.",
      en: "How stable contracts, types, and standardized errors improve team speed and reduce bugs.",
    },
    tags: ["Frontend", "Backend"],
    publishedAt: "2026-07-07",
    coverImage: "/blog/frontend-backend-api-contracts.jpg",
    coverImageAlt: {
      fa: "رابط کاربری و سرور که با نشان قرارداد API به هم وصل شده‌اند",
      en: "A frontend window and a server stack connected by an API contract badge",
    },
    sections: [
      {
        heading: { fa: "قرارداد را ثابت نگه دار", en: "Keep contracts stable" },
        paragraphs: {
          fa: [
            "اگر shape پاسخ‌ها و خطاها ثابت باشد، فرانت سریع‌تر پیش می‌رود و باگ کمتر می‌شود.",
            "بهتر است ساختار errorها استاندارد و قابل پیش‌بینی باشد.",
          ],
          en: [
            "When response and error shapes are stable, frontend moves faster and bugs drop.",
            "Standardize errors so they’re predictable.",
          ],
        },
        bullets: {
          fa: [
            "Error code ثابت",
            "Validation message واضح",
            "نسخه‌بندی در صورت نیاز",
          ],
          en: [
            "Stable error codes",
            "Clear validation messages",
            "Versioning when needed",
          ],
        },
      },
    ],
  },
  {
    slug: "fast-seo-websites",
    title: {
      fa: "ساخت وب‌سایت سریع و سئو-محور",
      en: "Building fast, SEO-focused websites",
    },
    excerpt: {
      fa: "نکات کلیدی برای ساخت صفحات سریع، ساختار محتوایی درست، metadata و best practiceهای سئو.",
      en: "Key tips for fast pages, content structure, metadata, and SEO best practices.",
    },
    tags: ["Website", "SEO"],
    publishedAt: "2026-07-21",
    coverImage: "/blog/fast-seo-websites.jpg",
    coverImageAlt: {
      fa: "سه حلقه امتیاز عملکرد، سئو و دسترس‌پذیری داخل یک صفحه مرورگر",
      en: "Three score rings for performance, SEO and accessibility inside a browser window",
    },
    sections: [
      {
        heading: {
          fa: "سئو از محتوا شروع می‌شود",
          en: "SEO starts with content",
        },
        paragraphs: {
          fa: [
            "قبل از هر چیزی ساختار عنوان‌ها (H1/H2) و محتوای صفحه باید درست باشد. بعد سراغ metadata و OpenGraph برو.",
            "سرعت هم بخش مهم سئو است: تصاویر، فونت‌ها و کدهای اضافی را کنترل کن.",
          ],
          en: [
            "Get the content structure right first (H1/H2). Then add metadata and OpenGraph.",
            "Performance is a major part of SEO: optimize images, fonts, and avoid unnecessary JS.",
          ],
        },
        bullets: {
          fa: ["Title/Description درست", "OG/Twitter", "Core Web Vitals"],
          en: ["Good title/description", "OG/Twitter", "Core Web Vitals"],
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
    excerpt: {
      fa: "کاربران دیگر فقط در گوگل جست‌وجو نمی‌کنند؛ از ChatGPT و Perplexity هم جواب می‌گیرند. GEO و AEO یعنی محتوای شما را برای همان پاسخ‌ها آماده کنید.",
      en: "People no longer search only on Google—they ask ChatGPT and Perplexity too. GEO and AEO mean preparing your content to be the answer they get.",
    },
    tags: ["SEO", "GEO", "AEO"],
    publishedAt: "2026-08-20",
    coverImage: "/blog/geo-aeo-answer-engine-optimization.png",
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
    excerpt: {
      fa: "قرارداد هوشمند چیست، DEX و CEX چطور کار می‌کنند، کدام را بسازیم و امنیت، تحریم و الزامات بازار ایران و خارج از ایران چه تفاوتی ایجاد می‌کنند.",
      en: "What smart contracts are, how DEXs and CEXs actually work, which one to build, and how security, sanctions, and local-market constraints differ between Iran and the rest of the world.",
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
    excerpt: {
      fa: "راهنمای عملی برای مدیران: ERP چه مشکلی را حل می‌کند، چه ماژول‌هایی دارد، گزینه‌های ایرانی و خارجی کدام‌اند و چطور بدون شکست پیاده‌سازی کنیم.",
      en: "A practical guide for business owners: what problem ERP solves, which modules matter, how Iranian and international options compare, and how to implement without failing.",
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
    excerpt: {
      fa: "معماری، سناریوهای واقعی، حسابداری، امنیت و نکات ایران و بازار جهانی برای اتصال قرارداد هوشمند به ERP و CRM بدون ثبت تکراری و ناهماهنگی.",
      en: "Architecture, real scenarios, accounting, security, and Iran versus global considerations for wiring smart contracts into ERP and CRM without duplicate or mismatched records.",
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
