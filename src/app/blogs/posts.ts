import type { Locale } from "@/app/i18n";

export type BlogSection = {
  heading: { fa: string; en: string };
  paragraphs: { fa: string[]; en: string[] };
  bullets?: { fa: string[]; en: string[] };
};

export type BlogPost = {
  slug: string;
  title: { fa: string; en: string };
  excerpt: { fa: string; en: string };
  tags: string[];
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
];

export function getBlogPosts() {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getBlogPostHref(locale: Locale, slug: string) {
  return `/${locale}/blogs/${slug}`;
}
