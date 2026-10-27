import type { ToolSlug } from "@/app/components/Tools/data";

import type { ServiceSlug } from "./data";

type List = { fa: string[]; en: string[] };

/**
 * Longer, practical copy for each service page: when you need it, how we work, common mistakes,
 * plus the related services and free tool the page links to. No numbers, results or guarantees.
 */
export type ServiceGuide = {
  when: List;
  approach: List;
  mistakes: List;
  related: [ServiceSlug, ServiceSlug];
  tool?: ToolSlug;
};

export const SERVICE_GUIDE: Record<ServiceSlug, ServiceGuide> = {
  "website-design-development": {
    when: {
      fa: [
        "سایت فعلی‌تان کند است، روی موبایل خوب نمایش داده نمی‌شود یا نمی‌توانید خودتان محتوا را عوض کنید",
        "کسب‌وکارتان رشد کرده و قالب آماده دیگر نیازتان را (فرم سفارش، پنل، اتصال به سیستم داخلی) جواب نمی‌دهد",
        "می‌خواهید محصول یا خدمت جدیدی را با وب‌اپلیکیشن عرضه کنید و تیمی می‌خواهید که از طراحی تا استقرار مسئولیتش را بپذیرد",
        "سایتی دارید که بازدید می‌گیرد اما تماس و سفارش نمی‌آورد و مسیر کاربر باید بازطراحی شود",
      ],
      en: [
        "Your current site is slow, poor on mobile, or you cannot update the content yourself",
        "Your business has outgrown an off-the-shelf theme: order forms, dashboards or links to internal systems are needed",
        "You want to launch a new product or service as a web app and need a team that owns it from design to deployment",
        "Your site gets visits but not enquiries or orders, and the visitor journey needs a redesign",
      ],
    },
    approach: {
      fa: [
        "پروژه را از هدف شروع می‌کنیم، نه از ظاهر: چه کسی سایت را می‌بیند، چه کاری باید انجام دهد و چه چیزی را اندازه می‌گیریم. بعد محتوا، ساختار صفحه‌ها و مسیر تماس یا خرید را طراحی می‌کنیم تا طراحی بصری روی پایه‌ای روشن بنشیند.",
        "ساخت با ابزارهای مدرن مثل Next.js انجام می‌شود، با صفحه‌های سبک و سئوی فنی از همان ابتدا، نه بعد از لانچ. سایت دوزبانه و راست‌به‌چپ هم از اول در معماری دیده می‌شود. در هر مرحله نمونه قابل‌دیدن تحویل می‌دهیم تا پیش از نسخه نهایی بازخورد بدهید.",
      ],
      en: [
        "We start from the goal, not the look: who visits the site, what they should do, and what we measure. Then we design the content, page structure and the contact or purchase path so the visual design sits on a clear foundation.",
        "We build with modern tools such as Next.js, with light pages and technical SEO from the start rather than after launch. A bilingual, right-to-left capable site is part of the architecture from day one. At every stage you get something you can see, so feedback arrives before the final version.",
      ],
    },
    mistakes: {
      fa: [
        "شروع طراحی بدون مشخص کردن هدف و مخاطب",
        "نوشتن محتوا بعد از طراحی، که باعث می‌شود متن در قالب جا نشود",
        "رها کردن سرعت و نمایش موبایل تا لحظه آخر",
        "فراموش کردن سئو، آنالیتیکس و فرم‌ها تا بعد از انتشار",
      ],
      en: [
        "Starting the design before the goal and audience are defined",
        "Writing content after the design, so the text no longer fits the layout",
        "Leaving speed and mobile layout until the last moment",
        "Postponing SEO, analytics and forms until after launch",
      ],
    },
    related: ["wordpress-woocommerce", "seo-google-growth"],
    tool: "website-seo-audit",
  },
  "wordpress-woocommerce": {
    when: {
      fa: [
        "می‌خواهید سریع راه بیفتید و تیمتان بدون برنامه‌نویس محتوا را عوض کند",
        "فروشگاه اینترنتی دارید یا می‌خواهید راه بیندازید و درگاه پرداخت، ارسال و موجودی را یکجا مدیریت کنید",
        "سایت وردپرسی فعلی‌تان کند، پر از افزونه یا ناامن شده است",
        "قالب آماده ظاهری شبیه بقیه دارد و برندتان در آن دیده نمی‌شود",
      ],
      en: [
        "You want to launch fast and let your team change content without a developer",
        "You run or plan an online store and want payments, shipping and stock managed in one place",
        "Your WordPress site has become slow, plugin-heavy or insecure",
        "A ready-made theme looks like everyone else's and your brand does not show",
      ],
    },
    approach: {
      fa: [
        "وردپرس را سبک نگه می‌داریم: قالب اختصاصی یا ساده‌شده، فقط افزونه‌های لازم، و تنظیمات سرعت و امنیت از ابتدا. هدف این است که مدیریت سایت برای تیم شما ساده باشد و ظاهرش قالبی نباشد.",
        "در ووکامرس مسیر خرید را از دید مشتری می‌بینیم: صفحه محصول، سبد، پرداخت و پیگیری سفارش. پیش از انتشار یک خرید آزمایشی کامل انجام می‌دهیم و آموزش مدیریت سایت را تحویل می‌دهیم.",
      ],
      en: [
        "We keep WordPress lean: a custom or simplified theme, only the plugins that are needed, and speed and security settings from the start. The aim is a site that is easy for your team to manage and does not look templated.",
        "In WooCommerce we look at the purchase path as the customer sees it: product page, cart, checkout and order tracking. Before launch we run a full test purchase and hand over training on managing the site.",
      ],
    },
    mistakes: {
      fa: [
        "نصب افزونه برای هر نیاز کوچک",
        "انتخاب قالب آماده سنگین با امکاناتی که استفاده نمی‌شود",
        "نداشتن بکاپ و برنامه به‌روزرسانی",
        "نسنجیدن مسیر خرید روی موبایل",
      ],
      en: [
        "Installing a plugin for every small need",
        "Choosing a heavy ready-made theme with features nobody uses",
        "Having no backups and no update routine",
        "Never testing the checkout on a phone",
      ],
    },
    related: ["care-performance", "seo-google-growth"],
    tool: "website-seo-audit",
  },
  "seo-google-growth": {
    when: {
      fa: [
        "سایت دارید ولی در گوگل پیدا نمی‌شود یا فقط با نام برندتان پیدا می‌شود",
        "در Search Console صفحه‌های «کراول‌شده ولی ایندکس‌نشده» یا خطای ایندکس می‌بینید",
        "می‌خواهید محتوا بنویسید اما نمی‌دانید درباره چه موضوعاتی و با چه ساختاری",
        "می‌خواهید در پاسخ‌های هوش مصنوعی و جست‌وجوی پاسخ‌محور (GEO و AEO) هم دیده شوید",
      ],
      en: [
        "Your site exists but does not show up on Google, or only for your brand name",
        "Search Console shows pages as “Crawled, currently not indexed” or other indexing errors",
        "You want to publish content but do not know which topics or what structure",
        "You want to be visible in AI answers and answer-led search (GEO and AEO) too",
      ],
    },
    approach: {
      fa: [
        "ابتدا وضعیت فعلی را اندازه می‌گیریم: ایندکس، سرعت، ساختار صفحه‌ها و لینک‌های داخلی. بعد مشکلات را بر اساس اثر و هزینه مرتب می‌کنیم، چون در سئو ترتیب کارها اهمیت دارد.",
        "وعده رتبه نمی‌دهیم. محتوا را بر پایه نیت جست‌وجوی مخاطب می‌نویسیم، صفحه‌های اصلی را به هم لینک می‌کنیم، داده ساختاریافته اضافه می‌کنیم و نتیجه را در Search Console و آنالیتیکس دنبال می‌کنیم. برای سایت‌های جدید هم زمان طبیعی ایندکس شدن را توضیح می‌دهیم.",
      ],
      en: [
        "First we measure where you are: indexing, speed, page structure and internal links. Then we order the problems by impact and cost, because in SEO the order of work matters.",
        "We do not promise rankings. We write content around the searcher's intent, link the key pages together, add structured data and follow the result in Search Console and analytics. For new sites we also explain the natural time indexing takes.",
      ],
    },
    mistakes: {
      fa: [
        "خرید لینک و میان‌برهایی که به‌جای رشد، ریسک جریمه می‌آورد",
        "ساختن صفحه‌های زیاد و کم‌محتوا که گوگل ایندکس نمی‌کند",
        "نداشتن لینک داخلی به صفحه‌های مهم",
        "قضاوت دربارهٔ نتیجه بعد از چند روز",
      ],
      en: [
        "Buying links or taking shortcuts that risk a penalty instead of growth",
        "Publishing many thin pages that Google chooses not to index",
        "Having no internal links to the important pages",
        "Judging the result after a few days",
      ],
    },
    related: ["website-design-development", "care-performance"],
    tool: "website-seo-audit",
  },
  "ai-automation": {
    when: {
      fa: [
        "تیم پشتیبانی هر روز به سؤال‌های تکراری مشتری پاسخ می‌دهد",
        "اسناد، قراردادها یا فاکتورهای زیادی دارید که باید دستی خوانده و دسته‌بندی شوند",
        "سرنخ‌های فروش از کانال‌های مختلف (سایت، اینستاگرام، تلگرام) پراکنده‌اند و پیگیری‌شان عقب می‌افتد",
        "به دستیاری برای جست‌وجو در دانش و آیین‌نامه‌های سازمان نیاز دارید",
      ],
      en: [
        "Your support team answers the same customer questions every day",
        "You have many documents, contracts or invoices that are read and sorted by hand",
        "Sales leads are scattered across channels (website, Instagram, Telegram) and follow-up slips",
        "You need an assistant to search your organisation's knowledge and policies",
      ],
    },
    approach: {
      fa: [
        "با یک کار مشخص و پرتکرار شروع می‌کنیم، نه یک پروژه بزرگ و مبهم. اول نمونه کوچکی می‌سازیم، کیفیت پاسخ‌ها را روی نمونه‌های واقعی می‌سنجیم و فقط اگر نتیجه قابل‌قبول بود گسترش می‌دهیم.",
        "داده شما در اولویت است: انتخاب مدل با توجه به مجوز و دسترسی، کنترل اینکه دستیار چه چیزی را می‌تواند بگوید، و ارجاع به انسان وقتی مطمئن نیست. دستیار نباید قیمت، تخفیف یا تعهد حقوقی از خودش بسازد.",
      ],
      en: [
        "We start with one specific, repetitive task, not a large vague project. First a small prototype, then a check of answer quality on real examples, and we expand only if the result is acceptable.",
        "Your data comes first: choosing models with licence and access in mind, controlling what the assistant may say, and handing over to a person when it is unsure. An assistant must not invent prices, discounts or legal commitments.",
      ],
    },
    mistakes: {
      fa: [
        "ساختن چت‌بات بدون داده و دانش درست پشت آن",
        "اعتماد کامل به خروجی مدل بدون بازبینی انسانی",
        "فرستادن داده حساس به سرویس خارجی بدون بررسی",
        "نداشتن شاخص برای سنجیدن اینکه واقعاً زمان صرفه‌جویی شده یا نه",
      ],
      en: [
        "Building a chatbot without the right data and knowledge behind it",
        "Trusting model output fully without human review",
        "Sending sensitive data to an outside service without checking",
        "Having no measure of whether time was actually saved",
      ],
    },
    related: ["website-design-development", "care-performance"],
  },
  "web3-blockchain": {
    when: {
      fa: [
        "می‌خواهید توکن، NFT یا قرارداد هوشمند برای یک سناریوی واقعی بسازید",
        "می‌خواهید کیف پول را به سایت یا اپلیکیشن وصل کنید و پرداخت یا احراز هویت با آن انجام دهید",
        "رویدادهای بلاک‌چین باید به ERP، CRM یا حسابداری شما وصل شوند",
        "قرارداد یا کد فعلی‌تان به بازبینی و تست بیشتر نیاز دارد",
      ],
      en: [
        "You want to build a token, NFT or smart contract for a real scenario",
        "You want to connect wallets to a site or app and use them for payment or sign-in",
        "Blockchain events must feed your ERP, CRM or accounting",
        "Your existing contract or code needs more review and testing",
      ],
    },
    approach: {
      fa: [
        "اول می‌پرسیم آیا اصلاً به بلاک‌چین نیاز دارید؛ برای بسیاری از کارها یک پایگاه داده معمولی ساده‌تر و ارزان‌تر است. اگر نیاز بود، نقش‌ها، دارایی‌ها و وضعیت‌های تراکنش را روی کاغذ مشخص می‌کنیم.",
        "قرارداد را با تست خودکار می‌نویسیم، روی شبکه آزمایشی اجرا می‌کنیم و پیش از انتشار روی شبکه اصلی بازبینی ریسک انجام می‌دهیم، چون قرارداد منتشرشده را نمی‌شود به‌سادگی اصلاح کرد. داده شخصی هرگز روی زنجیره نوشته نمی‌شود.",
      ],
      en: [
        "First we ask whether you need a blockchain at all; for many jobs an ordinary database is simpler and cheaper. If you do, we define roles, assets and transaction states on paper.",
        "We write the contract with automated tests, run it on a test network and review the risks before a mainnet release, because a deployed contract cannot easily be changed. Personal data is never written on-chain.",
      ],
    },
    mistakes: {
      fa: [
        "ساختن قرارداد پیچیده برای مسئله‌ای که به بلاک‌چین نیاز ندارد",
        "انتشار روی شبکه اصلی بدون تست و بازبینی",
        "نوشتن داده شخصی روی زنجیره",
        "نگه‌داشتن دارایی کاربران بدون توجه به مجوز و مقررات",
      ],
      en: [
        "Building a complex contract for a problem that does not need a blockchain",
        "Releasing on mainnet without testing and review",
        "Writing personal data on-chain",
        "Holding users' assets without considering licensing and regulation",
      ],
    },
    related: ["ai-automation", "website-design-development"],
  },
  "ui-ux-brand-design": {
    when: {
      fa: [
        "برندتان هنوز لوگو، رنگ و تایپوگرافی منسجم ندارد یا هر کانال ظاهر متفاوتی دارد",
        "کاربران وسط مسیر خرید یا ثبت‌نام رها می‌کنند و دلیلش را نمی‌دانید",
        "می‌خواهید پیش از هزینه توسعه، ایده را به‌صورت پروتوتایپ ببینید و آزمایش کنید",
        "تیم توسعه‌تان به دیزاین سیستم و فایل‌های مرتب نیاز دارد",
      ],
      en: [
        "Your brand has no consistent logo, colours and typography, or every channel looks different",
        "Users drop off mid-purchase or mid-sign-up and you do not know why",
        "You want to see and test the idea as a prototype before paying for development",
        "Your developers need a design system and tidy files",
      ],
    },
    approach: {
      fa: [
        "طراحی را از مخاطب و هدف شروع می‌کنیم: چه کسی استفاده می‌کند، در چه موقعیتی و چه چیزی مانعش می‌شود. بعد ساختار و وایرفریم، سپس زبان بصری و صفحه‌های اصلی.",
        "فارسی و انگلیسی را با هم طراحی می‌کنیم: جهت راست‌به‌چپ، تایپوگرافی فارسی و خوانایی از ابتدا در نظر گرفته می‌شوند و بعداً به طرح اضافه نمی‌شوند. خروجی در فایل‌های مرتب و کامپوننت‌هایی تحویل می‌شود که تیم توسعه مستقیم بتواند استفاده کند.",
      ],
      en: [
        "We start from the audience and the goal: who uses it, in what situation, and what gets in their way. Then structure and wireframes, then the visual language and key screens.",
        "We design Persian and English together: right-to-left direction, Persian typography and legibility are considered from the start, not added later. The output is tidy files and components your developers can use directly.",
      ],
    },
    mistakes: {
      fa: [
        "انتخاب سبک بصری پیش از شناخت مخاطب",
        "طراحی فقط نسخه دسکتاپ و رها کردن موبایل",
        "نادیده گرفتن خوانایی و کنتراست رنگ‌ها",
        "طراحی جداگانه فارسی و انگلیسی که یکدست نیست",
      ],
      en: [
        "Choosing a visual style before understanding the audience",
        "Designing only desktop and leaving mobile for later",
        "Ignoring legibility and colour contrast",
        "Designing Persian and English separately so they do not match",
      ],
    },
    related: ["website-design-development", "wordpress-woocommerce"],
    tool: "contrast-checker",
  },
  "care-performance": {
    when: {
      fa: [
        "سایت کند شده یا در گزارش‌های سرعت و Core Web Vitals ضعیف است",
        "بعد از لانچ کسی مسئول به‌روزرسانی، بکاپ و رفع خطا نیست",
        "می‌خواهید صفحه یا قابلیت جدید اضافه کنید اما تیم قبلی در دسترس نیست",
        "سایت وردپرسی‌تان هک شده یا افزونه‌هایش سال‌هاست به‌روز نشده‌اند",
      ],
      en: [
        "The site has become slow or scores poorly in speed and Core Web Vitals reports",
        "After launch nobody owns updates, backups and bug fixes",
        "You want a new page or feature but the previous team is unavailable",
        "Your WordPress site was hacked or its plugins have not been updated for years",
      ],
    },
    approach: {
      fa: [
        "با یک بررسی فنی و ثبت وضعیت فعلی شروع می‌کنیم: سرعت، خطاها، امنیت و بکاپ. اول موارد حیاتی را رفع می‌کنیم، بعد برنامه نگهداری را مشخص می‌کنیم.",
        "گزارش‌ها ساده و قابل‌فهم‌اند: چه کاری انجام شد، چه چیزی بهتر شد و کار بعدی چیست. بهبودها بر اساس اولویت کسب‌وکار انجام می‌شوند، نه فقط بر اساس امتیاز یک ابزار.",
      ],
      en: [
        "We begin with a technical review and a baseline of speed, errors, security and backups. Critical items are fixed first, then the care plan is defined.",
        "Reports stay simple: what was done, what improved and what comes next. Improvements follow business priority, not just the score of one tool.",
      ],
    },
    mistakes: {
      fa: [
        "نگاه کردن فقط به امتیاز ابزارهای سرعت و نسنجیدن تجربه واقعی کاربر",
        "بکاپ‌گیری بدون آزمودن بازیابی",
        "عقب انداختن به‌روزرسانی‌های امنیتی",
        "اضافه کردن قابلیت جدید روی کدی که تست و مستندات ندارد",
      ],
      en: [
        "Looking only at speed-tool scores and not at real user experience",
        "Taking backups without ever testing a restore",
        "Postponing security updates",
        "Adding features on top of code that has no tests or documentation",
      ],
    },
    related: ["wordpress-woocommerce", "seo-google-growth"],
    tool: "website-seo-audit",
  },
};
