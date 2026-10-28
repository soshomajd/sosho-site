import type { Locale } from "@/app/i18n";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiCheck,
  FiCode,
  FiCpu,
  FiLayers,
  FiPenTool,
  FiSearch,
  FiSmartphone,
} from "react-icons/fi";
import { SiEthereum, SiWordpress } from "react-icons/si";

type Localized<T> = { fa: T; en: T };

export type ServiceSlug =
  | "website-design-development"
  | "web-application-development"
  | "mobile-app-development"
  | "wordpress-woocommerce"
  | "seo-google-growth"
  | "ai-automation"
  | "web3-blockchain"
  | "ui-ux-brand-design"
  | "care-performance";

export type Service = {
  slug: ServiceSlug;
  title: Localized<string>;
  short: Localized<string>;
  Icon: IconType;
  seo: {
    title: Localized<string>;
    description: Localized<string>;
  };
  detail: {
    intro: Localized<string>;
    whatYouGetTitle: Localized<string>;
    whatYouGet: Localized<string[]>;
    processTitle: Localized<string>;
    process: Localized<string[]>;
    deliverablesTitle: Localized<string>;
    deliverables: Localized<string[]>;
  };
};

export const SERVICE_BULLET_ICON: IconType = FiCheck;

function serviceDetail(
  intro: Localized<string>,
  whatYouGet: Localized<string[]>,
  process: Localized<string[]>,
  deliverables: Localized<string[]>,
): Service["detail"] {
  return {
    intro,
    whatYouGetTitle: { fa: "چه چیزی تحویل می‌گیرید؟", en: "What you get" },
    whatYouGet,
    processTitle: { fa: "مسیر اجرا", en: "How we work" },
    process,
    deliverablesTitle: { fa: "خروجی نهایی", en: "Deliverables" },
    deliverables,
  };
}

export const SERVICES: Service[] = [
  {
    slug: "website-design-development",
    title: { fa: "طراحی و توسعه سایت", en: "Website Design & Development" },
    short: {
      fa: "طراحی اختصاصی، کدنویسی و لانچ کامل؛ از اولین ایده تا محصول نهایی.",
      en: "Strategy, custom design, engineering, and launch—from first idea to final product.",
    },
    Icon: FiCode,
    seo: {
      title: { fa: "طراحی و توسعه سایت از صفر تا صد", en: "Custom Website & Web App Development" },
      description: {
        fa: "طراحی و توسعه صفر تا صد سایت و وب‌اپلیکیشن اختصاصی با UI/UX، فرانت‌اند و بک‌اند سریع، سئوی فنی، استقرار و پشتیبانی؛ از ایده تا لانچ با سوشو استودیو.",
        en: "End-to-end custom websites and web apps: UI/UX, fast front-end and back-end, technical SEO, deployment, and support, from idea to launch with Sosho Studio.",
      },
    },
    detail: serviceDetail(
      {
        fa: "برای پروژه‌هایی که یک خروجی حرفه‌ای و یکپارچه می‌خواهند، تمام مسیر را در سوشو استودیو مدیریت می‌کنیم: استراتژی، تجربه کاربری، طراحی، توسعه، تست و لانچ.",
        en: "For teams that want one accountable partner, Sosho Studio handles the complete journey: strategy, UX, design, engineering, testing, and launch.",
      },
      {
        fa: ["معماری محتوا و تجربه کاربری متناسب با هدف کسب‌وکار", "طراحی واکنش‌گرا و اختصاصی برای موبایل و دسکتاپ", "فرانت‌اند، بک‌اند، پنل مدیریت و اتصال سرویس‌های موردنیاز", "استقرار، آنالیتیکس و زیرساخت فنی سئوی اولیه"],
        en: ["Content architecture and UX aligned with business goals", "Custom responsive design for mobile and desktop", "Front-end, back-end, admin tools, and service integrations", "Deployment, analytics, and a solid technical SEO foundation"],
      },
      {
        fa: ["جلسه شناخت، تعیین هدف و محدوده پروژه", "وایرفریم، طراحی بصری و تأیید مسیر", "توسعه مرحله‌ای همراه با گزارش شفاف", "تست نهایی، لانچ و تحویل مستندات"],
        en: ["Discovery, goals, and project scope", "Wireframes, visual design, and direction approval", "Milestone-based development with clear updates", "Final QA, launch, and documented handoff"],
      },
      {
        fa: ["محصول آماده لانچ و بهینه برای همه دستگاه‌ها", "سورس‌کد تمیز و قابل توسعه", "راهنمای مدیریت و پشتیبانی پس از انتشار"],
        en: ["A launch-ready product optimized for every screen", "Clean, scalable source code", "Management guide and post-launch support"],
      },
    ),
  },
  {
    slug: "web-application-development",
    title: { fa: "وب‌اپلیکیشن با Next.js و React", en: "Web Apps with Next.js & React" },
    short: {
      fa: "داشبورد، پنل کاربری، SaaS و سیستم اختصاصی؛ سریع، امن و آماده رشد.",
      en: "Dashboards, user portals, SaaS and custom systems: fast, secure, and ready to grow.",
    },
    Icon: FiLayers,
    seo: {
      title: { fa: "طراحی و توسعه وب‌اپلیکیشن با Next.js و React", en: "Web Application Development with Next.js & React" },
      description: {
        fa: "طراحی و توسعه وب‌اپلیکیشن اختصاصی با Next.js و React: پنل کاربری، داشبورد مدیریتی، SaaS، نقش‌ها و سطح دسترسی، API و اتصال به سرویس‌ها، با تست، استقرار و پشتیبانی.",
        en: "Custom web application development with Next.js and React: user portals, admin dashboards, SaaS, roles and permissions, APIs and integrations, with testing, deployment, and support.",
      },
    },
    detail: serviceDetail(
      {
        fa: "وقتی کسب‌وکار شما بیشتر از یک سایت معرفی لازم دارد، یعنی کاربر باید وارد شود، داده ثبت کند، گزارش ببیند یا کاری را انجام دهد، یک وب‌اپلیکیشن اختصاصی با Next.js و React می‌سازیم که سریع باز می‌شود، امن است و با رشد شما بزرگ می‌شود.",
        en: "When your business needs more than a brochure site, where people sign in, enter data, see reports or get work done, we build a custom web application with Next.js and React that loads fast, stays secure, and grows with you.",
      },
      {
        fa: ["تحلیل نیاز، نقش‌های کاربری و طراحی جریان کار", "رابط کاربری واکنش‌گرا با React و Next.js برای موبایل و دسکتاپ", "بک‌اند، API، پایگاه داده، ورود و سطح دسترسی", "اتصال به درگاه پرداخت، پیامک، CRM و سرویس‌های دیگر"],
        en: ["Requirements analysis, user roles, and workflow design", "Responsive React and Next.js interface for mobile and desktop", "Back-end, APIs, database, sign-in, and permissions", "Integrations with payment gateways, SMS, CRM, and other services"],
      },
      {
        fa: ["جلسه شناخت و تعریف نسخه اول (MVP)", "طراحی جریان‌ها و صفحه‌های کلیدی", "توسعه مرحله‌ای با نسخه قابل‌تست در هر مرحله", "تست، استقرار، آموزش و تحویل مستندات"],
        en: ["Discovery and a defined first version (MVP)", "Design of the key flows and screens", "Milestone builds with a testable version at each step", "Testing, deployment, training, and documented handoff"],
      },
      {
        fa: ["وب‌اپلیکیشن آماده استفاده روی دامنه شما", "سورس‌کد تمیز، تست‌شده و قابل توسعه", "مستندات فنی، راهنمای استفاده و برنامه پشتیبانی"],
        en: ["A production-ready web app on your domain", "Clean, tested, extensible source code", "Technical documentation, a user guide, and a support plan"],
      },
    ),
  },
  {
    slug: "mobile-app-development",
    title: { fa: "اپلیکیشن موبایل", en: "Mobile Apps" },
    short: {
      fa: "اپ اندروید و iOS با React Native؛ از طراحی تا انتشار در استورها.",
      en: "Android and iOS apps with React Native, from design to store release.",
    },
    Icon: FiSmartphone,
    seo: {
      title: { fa: "طراحی و ساخت اپلیکیشن موبایل اندروید و iOS", en: "Mobile App Development for Android & iOS" },
      description: {
        fa: "طراحی و ساخت اپلیکیشن موبایل اندروید و iOS با React Native: طراحی رابط کاربری، ورود و پرداخت، اعلان، اتصال به سایت و API، پنل مدیریت و انتشار در گوگل‌پلی، اپ‌استور، بازار و مایکت.",
        en: "Android and iOS app development with React Native: UI design, sign-in and payments, push notifications, website and API integration, an admin panel, and release on Google Play and the App Store.",
      },
    },
    detail: serviceDetail(
      {
        fa: "اپلیکیشن موبایل را با React Native می‌سازیم: یک کد برای اندروید و iOS، با حس و سرعت اپ واقعی. اپ، سایت و پنل مدیریت را یکپارچه طراحی می‌کنیم تا داده‌ها یکجا بمانند و مدیریتش برای تیم شما ساده باشد.",
        en: "We build mobile apps with React Native: one codebase for Android and iOS, with the feel and speed of a real app. The app, the website and the admin panel are designed as one system, so data stays in one place and your team can run it easily.",
      },
      {
        fa: ["طراحی تجربه و رابط کاربری مخصوص موبایل", "اپ اندروید و iOS با یک کد مشترک (React Native)", "ورود، پرداخت، اعلان (Push) و اتصال به API و سایت", "پنل مدیریت محتوا و کاربران برای تیم شما"],
        en: ["Mobile-first UX and interface design", "Android and iOS apps from one shared codebase (React Native)", "Sign-in, payments, push notifications, and API or website integration", "A content and user admin panel for your team"],
      },
      {
        fa: ["تعریف هدف، کاربران و امکانات نسخه اول", "طراحی صفحه‌ها و پروتوتایپ قابل‌لمس", "توسعه مرحله‌ای و نسخه آزمایشی روی گوشی شما", "تست روی دستگاه‌های مختلف، انتشار در استورها و پشتیبانی"],
        en: ["Define the goal, users, and first-version features", "Screen design and a tappable prototype", "Milestone builds with a test version on your phone", "Testing on different devices, store release, and support"],
      },
      {
        fa: ["اپ آماده انتشار برای اندروید و iOS", "سورس‌کد اپ و بک‌اند، با مستندات", "راهنمای انتشار، به‌روزرسانی و برنامه پشتیبانی"],
        en: ["A release-ready app for Android and iOS", "App and back-end source code, with documentation", "Release, update, and support guidance"],
      },
    ),
  },
  {
    slug: "wordpress-woocommerce",
    title: { fa: "وردپرس و ووکامرس", en: "WordPress & WooCommerce" },
    short: {
      fa: "سایت شرکتی، فروشگاهی و محتوایی سریع، امن و قابل مدیریت.",
      en: "Fast, secure, easy-to-manage business, content, and commerce websites.",
    },
    Icon: SiWordpress,
    seo: {
      title: { fa: "طراحی سایت وردپرس و فروشگاه ووکامرس", en: "WordPress & WooCommerce Development" },
      description: {
        fa: "طراحی سایت وردپرسی و فروشگاه ووکامرس اختصاصی با تمرکز بر سرعت، امنیت، سئو، درگاه پرداخت و مدیریت آسان محتوا؛ مناسب کسب‌وکارهایی که می‌خواهند سریع راه بیفتند.",
        en: "Custom WordPress websites and WooCommerce stores built for speed, security, SEO, payments, and easy content management, ideal when you need to launch fast.",
      },
    },
    detail: serviceDetail(
      {
        fa: "وقتی سرعت راه‌اندازی و مدیریت آسان محتوا مهم است، یک راهکار وردپرسی سبک و اصولی می‌سازیم؛ بدون ظاهر قالبی و افزونه‌های اضافه.",
        en: "When launch speed and easy content management matter, we build a lean WordPress solution without the generic template feel or plugin bloat.",
      },
      {
        fa: ["طراحی قالب اختصاصی یا بازطراحی کامل سایت فعلی", "راه‌اندازی ووکامرس، پرداخت، ارسال و فرایند سفارش", "ساخت پنل و بلوک‌های محتوایی ساده برای تیم شما", "بهینه‌سازی سرعت، امنیت، بکاپ و سئوی فنی"],
        en: ["A custom theme or a complete redesign of your current site", "WooCommerce, payments, shipping, and order workflows", "Simple content blocks and admin experience for your team", "Performance, security, backups, and technical SEO"],
      },
      {
        fa: ["بررسی نیازها و انتخاب معماری مناسب وردپرس", "طراحی صفحات و ساخت سیستم محتوایی", "پیاده‌سازی، ورود محتوا و تست خرید", "آموزش مدیریت، انتقال و انتشار نهایی"],
        en: ["Requirements review and the right WordPress architecture", "Page design and content-system setup", "Implementation, content entry, and checkout testing", "Admin training, migration, and final launch"],
      },
      {
        fa: ["سایت وردپرسی سریع و قابل توسعه", "پنل مدیریت شخصی‌سازی‌شده", "آموزش، بکاپ و برنامه نگهداری"],
        en: ["A fast, extensible WordPress website", "A tailored management experience", "Training, backups, and a maintenance plan"],
      },
    ),
  },
  {
    slug: "seo-google-growth",
    title: { fa: "سئو و رشد در گوگل", en: "SEO & Google Growth" },
    short: {
      fa: "زیرساخت فنی، محتوا و داده برای دیده‌شدن و رشد پایدار.",
      en: "Technical foundations, content, and data for sustainable search growth.",
    },
    Icon: FiSearch,
    seo: {
      title: { fa: "سئو سایت و خدمات گوگل", en: "SEO & Google Growth Services" },
      description: {
        fa: "سئوی فنی و محتوایی، تحقیق کلمات کلیدی، راه‌اندازی سرچ کنسول و آنالیتیکس، بهینه‌سازی برای GEO و AEO و برنامه رشد شفاف و داده‌محور در گوگل.",
        en: "Technical and on-page SEO, keyword research, Search Console and Analytics setup, GEO/AEO for AI answers, and a data-led Google growth plan.",
      },
    },
    detail: serviceDetail(
      {
        fa: "سئو را با وعده رتبه یک نمی‌فروشیم؛ سایت، محتوا و داده را اصولی می‌چینیم تا شانس دیده‌شدن، جذب مخاطب درست و رشد پایدار بیشتر شود.",
        en: "We do not sell guaranteed rankings. We improve the website, content, and measurement system so the right audience can find you and growth can compound.",
      },
      {
        fa: ["ممیزی فنی، Core Web Vitals و رفع موانع ایندکس", "تحقیق کلمات کلیدی و معماری محتوای هدفمند", "بهینه‌سازی صفحات، اسکیما و لینک‌سازی داخلی", "راه‌اندازی Search Console، GA4 و گزارش‌های قابل فهم"],
        en: ["Technical audit, Core Web Vitals, and indexation fixes", "Keyword research and intent-led content architecture", "On-page optimization, schema, and internal linking", "Search Console, GA4, and clear performance reporting"],
      },
      {
        fa: ["ثبت وضعیت فعلی و تعریف شاخص‌های واقعی", "اولویت‌بندی مشکلات فنی و فرصت‌های محتوایی", "اجرای اصلاحات و انتشار محتوای هدفمند", "اندازه‌گیری، گزارش و بهبود مستمر"],
        en: ["Baseline audit and meaningful success metrics", "Prioritize technical issues and content opportunities", "Implement fixes and publish focused content", "Measure, report, and iterate continuously"],
      },
      {
        fa: ["گزارش ممیزی و نقشه راه اولویت‌بندی‌شده", "تنظیم کامل ابزارهای گوگل و رهگیری تبدیل", "برنامه اجرایی سئو و محتوای ماهانه"],
        en: ["An audit report and prioritized roadmap", "Google tooling and conversion tracking setup", "An actionable monthly SEO and content plan"],
      },
    ),
  },
  {
    slug: "ai-automation",
    title: { fa: "هوش مصنوعی و اتوماسیون", en: "AI & Automation" },
    short: {
      fa: "دستیار هوشمند، چت‌بات و گردش‌کارهایی که واقعاً زمان ذخیره می‌کنند.",
      en: "Assistants, chatbots, and workflows that save real operating time.",
    },
    Icon: FiCpu,
    seo: {
      title: { fa: "راهکارهای هوش مصنوعی و اتوماسیون کسب‌وکار", en: "AI Integration & Business Automation" },
      description: {
        fa: "طراحی و پیاده‌سازی چت‌بات و دستیار هوشمند، جست‌وجوی دانشی، اتصال به CRM و اتوماسیون فرایندهای تکراری؛ هوش مصنوعی کاربردی متناسب با نیاز واقعی کسب‌وکار.",
        en: "AI chatbots and assistants, knowledge search, CRM integrations, and automation of repetitive workflows: practical AI designed around real business needs.",
      },
    },
    detail: serviceDetail(
      {
        fa: "هوش مصنوعی باید یک مسئله واقعی را حل کند. از نصب و اتصال مدل‌ها تا ساخت دستیار اختصاصی و اتوماسیون، راهکاری می‌سازیم که با فرایند فعلی شما کار کند.",
        en: "AI should solve a real problem. From model setup and integration to custom assistants and automation, we build tools that fit the way your team already works.",
      },
      {
        fa: ["چت‌بات پشتیبانی و دستیار داخلی متصل به اطلاعات شما", "جست‌وجوی هوشمند و سیستم‌های RAG برای اسناد و محتوا", "اتوماسیون کارهای تکراری و اتصال ابزارهای موجود", "انتخاب مدل، کنترل دسترسی و ثبت مصرف و کیفیت"],
        en: ["Support chatbots and internal assistants grounded in your data", "Intelligent search and RAG systems for documents and content", "Workflow automation across the tools you already use", "Model selection, access control, usage, and quality monitoring"],
      },
      {
        fa: ["شناسایی کار پرهزینه یا تکراری با بیشترین بازده", "ساخت نمونه کوچک و سنجش کیفیت واقعی", "اتصال امن به داده‌ها و ابزارهای کسب‌وکار", "استقرار، آموزش تیم و بهبود بر اساس بازخورد"],
        en: ["Identify the highest-value repetitive workflow", "Prototype quickly and evaluate real output quality", "Connect securely to business data and tools", "Deploy, train the team, and improve from feedback"],
      },
      {
        fa: ["راهکار AI آماده استفاده و متصل به فرایند شما", "پنل یا رابط کاربری اختصاصی", "مستندات، آموزش و برنامه پایش کیفیت"],
        en: ["A production-ready AI solution integrated into your workflow", "A tailored interface or management panel", "Documentation, training, and a quality-monitoring plan"],
      },
    ),
  },
  {
    slug: "web3-blockchain",
    title: { fa: "وب۳ و بلاک‌چین", en: "Web3 & Blockchain" },
    short: {
      fa: "dApp، اسمارت‌کانترکت، کیف پول و جریان‌های پرداخت کریپتویی.",
      en: "dApps, smart contracts, wallet experiences, and crypto payment flows.",
    },
    Icon: SiEthereum,
    seo: {
      title: { fa: "طراحی و توسعه Web3 و قرارداد هوشمند", en: "Web3 & Smart Contract Development" },
      description: {
        fa: "طراحی و توسعه قرارداد هوشمند، dApp، اتصال کیف پول، پرداخت رمزارز و اتصال بلاکچین به ERP و CRM با تست، بازبینی امنیتی و مستندات کامل.",
        en: "Smart contract, dApp, wallet and crypto payment development, plus blockchain-to-ERP/CRM integration, with testing, security review, and documentation.",
      },
    },
    detail: serviceDetail(
      {
        fa: "از تجربه کاربری dApp تا منطق قرارداد هوشمند و اتصال کیف پول، محصول Web3 را یکپارچه طراحی و توسعه می‌کنیم تا پیچیدگی بلاک‌چین برای کاربر ساده بماند.",
        en: "From dApp UX to smart-contract logic and wallet integration, we design the Web3 product as one system so blockchain complexity stays out of the user's way.",
      },
      {
        fa: ["طراحی تجربه کاربری dApp و اتصال انواع کیف پول", "توسعه قرارداد هوشمند و سناریوهای تست خودکار", "توکن، NFT، پرداخت کریپتویی و رهگیری تراکنش", "اتصال فرانت‌اند، شبکه آزمایشی و آماده‌سازی استقرار"],
        en: ["dApp UX and multi-wallet connection flows", "Smart-contract development and automated scenario tests", "Tokens, NFTs, crypto payments, and transaction tracking", "Front-end integration, testnet, and deployment readiness"],
      },
      {
        fa: ["تعریف دقیق نقش‌ها، دارایی‌ها و وضعیت‌های تراکنش", "طراحی قرارداد و بازبینی سناریوهای ریسک", "پیاده‌سازی قرارداد، رابط کاربری و تست یکپارچه", "استقرار کنترل‌شده و تحویل مستندات"],
        en: ["Define roles, assets, and transaction states", "Design the contract and review risk scenarios", "Implement contracts, interface, and end-to-end tests", "Controlled deployment and documented handoff"],
      },
      {
        fa: ["سورس قرارداد و تست‌های اصلی", "dApp واکنش‌گرا و تجربه اتصال کیف پول", "راهنمای استقرار، استفاده و نگهداری"],
        en: ["Contract source and core test suite", "A responsive dApp and wallet experience", "Deployment, usage, and maintenance guidance"],
      },
    ),
  },
  {
    slug: "ui-ux-brand-design",
    title: { fa: "برند، UI و UX", en: "Brand, UI & UX" },
    short: {
      fa: "هویت بصری و تجربه‌ای منسجم که برند شما را به‌یادماندنی می‌کند.",
      en: "A cohesive identity and experience that makes your brand memorable.",
    },
    Icon: FiPenTool,
    seo: {
      title: { fa: "طراحی هویت بصری، رابط و تجربه کاربری", en: "Brand Identity, UI & UX Design" },
      description: {
        fa: "طراحی هویت بصری و لوگو، وایرفریم، رابط و تجربه کاربری، پروتوتایپ تعاملی و دیزاین سیستم برای وب‌سایت و محصول دیجیتال، به فارسی و انگلیسی.",
        en: "Brand identity and logo, wireframes, UI and UX design, interactive prototypes, and design systems for websites and digital products, in Persian and English.",
      },
    },
    detail: serviceDetail(
      {
        fa: "ظاهر خوب کافی نیست؛ طراحی باید هویت برند را منتقل کند و کاربر را بدون اصطکاک به هدف برساند. ما برند و محصول را به‌صورت یک تجربه منسجم می‌بینیم.",
        en: "Looking good is not enough. Design should express the brand and help people reach their goal without friction. We treat brand and product as one coherent experience.",
      },
      {
        fa: ["جهت هنری، پالت رنگ، تایپوگرافی و زبان بصری", "نقشه سفر کاربر، معماری اطلاعات و وایرفریم", "طراحی رابط واکنش‌گرا و پروتوتایپ تعاملی", "کامپوننت‌ها و دیزاین سیستم آماده توسعه"],
        en: ["Art direction, color, typography, and visual language", "User journeys, information architecture, and wireframes", "Responsive interface design and interactive prototypes", "Developer-ready components and design system"],
      },
      {
        fa: ["شناخت مخاطب، جایگاه برند و هدف محصول", "طراحی ساختار و تست مسیرهای کلیدی", "توسعه زبان بصری و صفحات اصلی", "تکمیل سیستم طراحی و تحویل به تیم توسعه"],
        en: ["Understand the audience, brand position, and product goals", "Design the structure and test critical journeys", "Develop the visual language and key screens", "Complete the design system and developer handoff"],
      },
      {
        fa: ["فایل طراحی مرتب و قابل توسعه", "پروتوتایپ مسیرهای اصلی", "راهنمای هویت و دیزاین سیستم"],
        en: ["Organized, extensible design files", "Prototype of the key journeys", "Brand guidance and design system"],
      },
    ),
  },
  {
    slug: "care-performance",
    title: { fa: "پشتیبانی و بهینه‌سازی", en: "Care & Performance" },
    short: {
      fa: "سرعت، امنیت، به‌روزرسانی و توسعه مستمر بعد از لانچ.",
      en: "Performance, security, updates, and continuous improvement after launch.",
    },
    Icon: FiActivity,
    seo: {
      title: { fa: "پشتیبانی، نگهداری و افزایش سرعت سایت", en: "Website Care, Maintenance & Performance" },
      description: {
        fa: "پشتیبانی فنی سایت، افزایش سرعت و بهبود Core Web Vitals، رفع خطا، امنیت، بکاپ منظم و توسعه قابلیت‌های جدید برای سایت‌های وردپرسی و اختصاصی.",
        en: "Website care: speed and Core Web Vitals improvements, bug fixes, security hardening, regular backups, and new features for WordPress and custom sites.",
      },
    },
    detail: serviceDetail(
      {
        fa: "لانچ پایان کار نیست. با یک برنامه نگهداری شفاف، سایت را سریع، امن و به‌روز نگه می‌داریم و بر اساس داده و نیاز کسب‌وکار توسعه می‌دهیم.",
        en: "Launch is not the finish line. A clear care plan keeps your website fast, secure, current, and improving as your business evolves.",
      },
      {
        fa: ["پایش وضعیت، رفع خطا و به‌روزرسانی منظم", "بهبود سرعت و شاخص‌های Core Web Vitals", "امنیت، بکاپ و برنامه بازیابی", "طراحی و توسعه قابلیت‌ها و صفحات جدید"],
        en: ["Health monitoring, bug fixes, and regular updates", "Performance and Core Web Vitals improvements", "Security, backups, and recovery planning", "Design and development of new pages and features"],
      },
      {
        fa: ["ارزیابی فنی و ثبت وضعیت اولیه", "رفع موارد حیاتی و ایجاد برنامه نگهداری", "پایش و گزارش دوره‌ای", "بهبود مستمر بر اساس اولویت کسب‌وکار"],
        en: ["Technical review and baseline health report", "Resolve critical issues and establish the care plan", "Ongoing monitoring and periodic reporting", "Continuous improvement by business priority"],
      },
      {
        fa: ["سایت پایدار، سریع و به‌روز", "گزارش روشن از اقدامات و وضعیت", "زمان پاسخ مشخص و مسیر توسعه مداوم"],
        en: ["A stable, fast, up-to-date website", "Clear reporting on work and system health", "Defined response times and an ongoing improvement path"],
      },
    ),
  },
];

const SERVICE_ALIASES: Record<string, ServiceSlug> = {
  "ui-ux": "ui-ux-brand-design",
  frontend: "website-design-development",
  backend: "website-design-development",
  "website-0-100": "website-design-development",
  "crypto-payment-gateway": "web3-blockchain",
  "smart-contract-blockchain": "web3-blockchain",
};

export function getService(slug: string): Service | undefined {
  const resolvedSlug = SERVICE_ALIASES[slug] ?? slug;
  return SERVICES.find((service) => service.slug === resolvedSlug);
}

export function getServiceHref(locale: Locale, slug: ServiceSlug) {
  return `/${locale}/services/${slug}`;
}
