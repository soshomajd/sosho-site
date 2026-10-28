import type { ServiceSlug } from "./data";

type Localized = { fa: string; en: string };
export type ServiceFaqItem = { question: Localized; answer: Localized };

// Short, factual answers rendered on each service page and mirrored as FAQPage
// structured data. They never quote prices, discounts, or delivery dates.
export const SERVICE_FAQ: Record<ServiceSlug, ServiceFaqItem[]> = {
  "website-design-development": [
    {
      question: { fa: "طراحی سایت اختصاصی شامل چه مراحلی است؟", en: "What steps does a custom website project include?" },
      answer: {
        fa: "شناخت نیاز و محدوده، طراحی تجربه و رابط کاربری، توسعه فرانت‌اند و بک‌اند، تست، استقرار و پشتیبانی. هر مرحله پس از تأیید شما به مرحله بعد می‌رود.",
        en: "Discovery and scope, UX and UI design, front-end and back-end development, testing, deployment, and support. Each stage moves on only after your approval.",
      },
    },
    {
      question: { fa: "هزینه و زمان ساخت سایت چطور مشخص می‌شود؟", en: "How are the cost and timeline of a website determined?" },
      answer: {
        fa: "بر اساس محدوده کار، صفحات و قابلیت‌ها، اتصال به سرویس‌های دیگر و آمادگی محتوا. پس از جلسه شناخت، برآورد شفاف و مرحله‌بندی‌شده ارائه می‌شود.",
        en: "By the scope, pages and features, integrations with other services, and content readiness. After a discovery session you receive a clear, phased estimate.",
      },
    },
    {
      question: { fa: "آیا سایت برای سئو و موبایل بهینه است؟", en: "Is the site optimized for SEO and mobile?" },
      answer: {
        fa: "بله. سئوی فنی پایه، سرعت، ساختار عنوان‌ها، داده ساختاریافته و طراحی واکنش‌گرا برای موبایل، بخشی از کار اصلی است، نه یک افزونه جدا.",
        en: "Yes. Technical SEO basics, speed, heading structure, structured data, and responsive mobile design are part of the core work, not an add-on.",
      },
    },
  ],
  "web-application-development": [
    {
      question: { fa: "فرق وب‌اپلیکیشن با سایت معمولی چیست؟", en: "How is a web app different from a regular website?" },
      answer: {
        fa: "سایت معمولی بیشتر اطلاعات نشان می‌دهد؛ وب‌اپلیکیشن کاری انجام می‌دهد: کاربر وارد می‌شود، داده ثبت می‌کند، گزارش می‌بیند یا سفارش و درخواستش را پیگیری می‌کند. برای همین به بک‌اند، پایگاه داده و سطح دسترسی نیاز دارد.",
        en: "A regular website mostly presents information; a web app gets work done: people sign in, enter data, see reports, or track orders and requests. That is why it needs a back-end, a database, and permissions.",
      },
    },
    {
      question: { fa: "چرا Next.js و React؟", en: "Why Next.js and React?" },
      answer: {
        fa: "React برای رابط‌های پیچیده و تعاملی ساخته شده و Next.js صفحه‌ها را سریع و قابل ایندکس در گوگل تحویل می‌دهد. هر دو پرکاربرد و پشتیبانی‌شده‌اند، پس بعداً هم برای توسعه کد، برنامه‌نویس پیدا می‌شود.",
        en: "React is built for complex, interactive interfaces and Next.js serves pages fast and indexable by Google. Both are widely used and supported, so developers will be available to extend the code later.",
      },
    },
    {
      question: { fa: "می‌شود با یک نسخه ساده شروع کرد؟", en: "Can we start with a simple version?" },
      answer: {
        fa: "بله و معمولاً بهتر است. نسخه اول (MVP) فقط امکانات ضروری را دارد تا زودتر به دست کاربر برسد و بازخورد واقعی بگیرید؛ بقیه امکانات در فازهای بعد اضافه می‌شوند.",
        en: "Yes, and it is usually better. The first version (MVP) has only the essential features so it reaches users sooner and you get real feedback; the rest arrive in later phases.",
      },
    },
  ],
  "mobile-app-development": [
    {
      question: { fa: "اپ برای اندروید و iOS جدا ساخته می‌شود؟", en: "Are the Android and iOS apps built separately?" },
      answer: {
        fa: "خیر. با React Native یک کد مشترک برای هر دو نوشته می‌شود و فقط بخش‌های کمی مخصوص هر سیستم‌عامل تنظیم می‌شوند. اگر فعلاً فقط اندروید لازم باشد، می‌شود با همان شروع کرد.",
        en: "No. With React Native one shared codebase serves both, and only a few platform-specific parts are tuned. If you only need Android for now, you can start with that.",
      },
    },
    {
      question: { fa: "انتشار اپ در استورها با کیست؟", en: "Who handles publishing to the app stores?" },
      answer: {
        fa: "آماده‌سازی و ارسال اپ به گوگل‌پلی، اپ‌استور یا استورهای ایرانی مثل بازار و مایکت بخشی از کار است. حساب توسعه‌دهنده به نام خود شما ساخته می‌شود تا مالکیت اپ با شما بماند؛ تأیید نهایی هم با خود استورهاست.",
        en: "Preparing and submitting the app to Google Play, the App Store, or Iranian stores is part of the work. The developer account is opened in your own name so you own the app; final approval rests with each store.",
      },
    },
    {
      question: { fa: "اپ به سایت و پنل فعلی ما وصل می‌شود؟", en: "Can the app connect to our existing website and panel?" },
      answer: {
        fa: "اگر سایت یا سیستم فعلی API داشته باشد یا بشود برایش API ساخت، بله. در غیر این صورت یک بک‌اند و پنل مدیریت مشترک برای اپ و سایت می‌سازیم تا داده‌ها یکجا بمانند.",
        en: "Yes, if the current site or system has an API or one can be built for it. Otherwise we build a shared back-end and admin panel for the app and site so the data stays in one place.",
      },
    },
  ],
  "wordpress-woocommerce": [
    {
      question: { fa: "از قالب آماده استفاده می‌کنید یا طراحی اختصاصی؟", en: "Do you use ready-made themes or custom design?" },
      answer: {
        fa: "بسته به نیاز. می‌توان با یک قالب سبک و معتبر و شخصی‌سازی آن شروع کرد یا طراحی کاملاً اختصاصی داشت. در هر دو حالت تعداد افزونه‌ها را حداقلی نگه می‌داریم تا سایت سریع و امن بماند.",
        en: "It depends on the need. We can start from a light, reputable theme and customize it, or design fully custom. Either way we keep plugins to a minimum so the site stays fast and secure.",
      },
    },
    {
      question: { fa: "آیا فروشگاه ووکامرس به درگاه پرداخت ایرانی وصل می‌شود؟", en: "Can a WooCommerce store connect to Iranian payment gateways?" },
      answer: {
        fa: "بله، از طریق افزونه رسمی درگاه پرداخت. نوع درگاه به قراردادی بستگی دارد که با ارائه‌دهنده پرداخت دارید.",
        en: "Yes, through the payment provider's official plugin. Which gateway you use depends on your contract with the payment provider.",
      },
    },
    {
      question: { fa: "بعد از تحویل، مدیریت سایت با کیست؟", en: "Who manages the site after handover?" },
      answer: {
        fa: "آموزش مدیریت محتوا را دریافت می‌کنید تا صفحات و محصولات را خودتان مدیریت کنید. برای به‌روزرسانی، امنیت و بکاپ می‌توانید از خدمات پشتیبانی استفاده کنید.",
        en: "You receive content management training so you can manage pages and products yourself. For updates, security, and backups you can use our care service.",
      },
    },
  ],
  "seo-google-growth": [
    {
      question: { fa: "آیا رتبه اول گوگل را تضمین می‌کنید؟", en: "Do you guarantee the first position on Google?" },
      answer: {
        fa: "خیر. هیچ‌کس نمی‌تواند رتبه گوگل را تضمین کند. ما سایت، محتوا و سیستم اندازه‌گیری را بهبود می‌دهیم و پیشرفت را با داده شفاف گزارش می‌کنیم.",
        en: "No. Nobody can guarantee Google rankings. We improve the site, content, and measurement system and report progress with transparent data.",
      },
    },
    {
      question: { fa: "نتیجه سئو چقدر طول می‌کشد؟", en: "How long does SEO take to show results?" },
      answer: {
        fa: "معمولاً چند ماه تا تغییرات معنادار دیده شود. سرعت آن به رقابت در حوزه شما، وضعیت فعلی سایت و میزان و کیفیت محتوا بستگی دارد.",
        en: "Usually a few months before meaningful changes appear. The pace depends on competition in your field, the site's current state, and the volume and quality of content.",
      },
    },
    {
      question: { fa: "آیا بهینه‌سازی برای ChatGPT و پاسخ‌های هوش مصنوعی (GEO و AEO) هم انجام می‌دهید؟", en: "Do you optimize for ChatGPT and AI answers (GEO and AEO)?" },
      answer: {
        fa: "بله. ساختار محتوا، پاسخ مستقیم، پرسش‌های متداول، داده ساختاریافته و دسترسی خزنده‌های هوش مصنوعی را بهینه می‌کنیم تا شانس دیده‌شدن در پاسخ‌های ChatGPT، Perplexity و گوگل بیشتر شود.",
        en: "Yes. We optimize content structure, direct answers, FAQs, structured data, and AI crawler access to raise your chances of appearing in ChatGPT, Perplexity, and Google answers.",
      },
    },
  ],
  "ai-automation": [
    {
      question: { fa: "از کدام مدل‌های هوش مصنوعی استفاده می‌کنید؟", en: "Which AI models do you use?" },
      answer: {
        fa: "متناسب با نیاز، دسترسی و هزینه؛ از مدل‌های تجاری تا مدل‌های متن‌باز روی سرور خودتان. معماری طوری ساخته می‌شود که بتوان ارائه‌دهنده مدل را بدون بازنویسی سیستم عوض کرد.",
        en: "Whatever fits the need, availability, and cost, from commercial models to open-source models on your own server. The architecture lets you switch model providers without rewriting the system.",
      },
    },
    {
      question: { fa: "داده‌های کسب‌وکار ما کجا می‌رود؟", en: "Where does our business data go?" },
      answer: {
        fa: "فقط داده لازم و با کنترل دسترسی و ثبت درخواست‌ها به مدل داده می‌شود و اطلاعات حساس حذف یا ناشناس می‌شود. در صورت نیاز، مدل روی سرور خودتان اجرا می‌شود.",
        en: "Only the necessary data reaches the model, with access control and request logging, and sensitive information is removed or anonymized. If needed, the model runs on your own server.",
      },
    },
    {
      question: { fa: "از کجا شروع کنیم؟", en: "Where should we start?" },
      answer: {
        fa: "از یک فرایند تکراری و قابل اندازه‌گیری، مثل پاسخ به پرسش‌های پرتکرار یا دسته‌بندی درخواست‌ها. با یک نمونه کوچک شروع می‌کنیم و پس از سنجش نتیجه، آن را گسترش می‌دهیم.",
        en: "With one repetitive, measurable process, such as answering frequent questions or triaging requests. We start with a small pilot and expand it after measuring the results.",
      },
    },
  ],
  "web3-blockchain": [
    {
      question: { fa: "قراردادهای هوشمند چطور تست و بازبینی می‌شوند؟", en: "How are smart contracts tested and reviewed?" },
      answer: {
        fa: "با تست واحد و سناریو، تست fuzz، تحلیل ایستا و بازبینی داخلی. برای قراردادهایی که دارایی واقعی نگه می‌دارند، ممیزی مستقل شخص ثالث را پیش از انتشار اکیداً توصیه می‌کنیم.",
        en: "With unit and scenario tests, fuzzing, static analysis, and internal review. For contracts that hold real assets, we strongly recommend an independent third-party audit before launch.",
      },
    },
    {
      question: { fa: "روی کدام بلاکچین‌ها کار می‌کنید؟", en: "Which blockchains do you work with?" },
      answer: {
        fa: "شبکه‌های سازگار با EVM، مثل اتریوم و لایه‌های دوی آن مانند Arbitrum، Optimism و Base. انتخاب شبکه بر اساس هزینه تراکنش، سرعت و محل حضور کاربران انجام می‌شود.",
        en: "EVM-compatible networks such as Ethereum and its layer-2s like Arbitrum, Optimism, and Base. The network is chosen by transaction cost, speed, and where your users are.",
      },
    },
    {
      question: { fa: "آیا پروژه رمزارزی یا صرافی در ایران قانونی است؟", en: "Is a crypto project or exchange legal in Iran?" },
      answer: {
        fa: "به مقررات و مجوزهای هر بازار بستگی دارد و مرتب تغییر می‌کند. ما مشاوره حقوقی نمی‌دهیم و پیش از شروع، بررسی آخرین قوانین و تحریم‌ها با متخصص حقوقی را توصیه می‌کنیم.",
        en: "It depends on each market's regulations and licenses, which change often. We do not give legal advice and recommend checking current rules and sanctions with a lawyer before starting.",
      },
    },
  ],
  "ui-ux-brand-design": [
    {
      question: { fa: "خروجی کار طراحی چیست؟", en: "What do we receive from the design work?" },
      answer: {
        fa: "فایل طراحی مرتب و قابل ویرایش، پروتوتایپ تعاملی مسیرهای اصلی، دیزاین سیستم و کامپوننت‌های آماده توسعه، و راهنمای هویت بصری.",
        en: "Organized, editable design files, an interactive prototype of the main flows, a design system with development-ready components, and a visual identity guide.",
      },
    },
    {
      question: { fa: "آیا طراحی برای هر دو زبان فارسی و انگلیسی انجام می‌شود؟", en: "Is the design done for both Persian and English?" },
      answer: {
        fa: "بله. چیدمان راست‌چین و چپ‌چین، تایپوگرافی فارسی و انگلیسی و قرینه‌سازی آیکون‌ها از ابتدا در دیزاین سیستم در نظر گرفته می‌شود.",
        en: "Yes. Right-to-left and left-to-right layouts, Persian and English typography, and icon mirroring are built into the design system from the start.",
      },
    },
    {
      question: { fa: "آیا پیش از طراحی، شناخت کاربر انجام می‌دهید؟", en: "Do you research users before designing?" },
      answer: {
        fa: "بله، متناسب با پروژه: شناخت مخاطب و جایگاه برند، بررسی رقبا، طراحی ساختار و تست مسیرهای کلیدی پیش از طراحی نهایی.",
        en: "Yes, scaled to the project: understanding the audience and brand position, reviewing competitors, structuring the experience, and testing key flows before the final design.",
      },
    },
  ],
  "care-performance": [
    {
      question: { fa: "پشتیبانی سایت شامل چه کارهایی است؟", en: "What does website care include?" },
      answer: {
        fa: "به‌روزرسانی منظم، بکاپ و برنامه بازیابی، پایش امنیت و سرعت، رفع خطا و توسعه‌های کوچک. دامنه دقیق کار در توافق پشتیبانی مشخص می‌شود.",
        en: "Regular updates, backups and a recovery plan, security and speed monitoring, bug fixes, and small improvements. The exact scope is defined in the care agreement.",
      },
    },
    {
      question: { fa: "آیا سایتی را که تیم دیگری ساخته پشتیبانی می‌کنید؟", en: "Do you support sites built by another team?" },
      answer: {
        fa: "بله، پس از یک ارزیابی فنی اولیه از کد، میزبانی و وضعیت فعلی سایت، تا ریسک‌ها و اولویت‌ها روشن شوند.",
        en: "Yes, after an initial technical assessment of the code, hosting, and current state of the site, so risks and priorities are clear.",
      },
    },
    {
      question: { fa: "سرعت سایت چقدر بهتر می‌شود؟", en: "How much faster will the site get?" },
      answer: {
        fa: "به وضعیت فعلی بستگی دارد. ابتدا سرعت و Core Web Vitals را اندازه می‌گیریم، علت‌ها را پیدا می‌کنیم و پس از اصلاحات، گزارش قبل و بعد ارائه می‌دهیم.",
        en: "It depends on the starting point. We first measure speed and Core Web Vitals, find the causes, and after the fixes provide a before-and-after report.",
      },
    },
  ],
};
