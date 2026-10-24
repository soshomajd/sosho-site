import type { IconType } from "react-icons";
import { FiActivity, FiDroplet, FiFileText, FiHelpCircle, FiTag } from "react-icons/fi";

import type { ServiceSlug } from "@/app/components/Services/data";

export type ToolSlug =
  | "website-seo-audit"
  | "meta-tag-generator"
  | "faq-schema-generator"
  | "robots-sitemap-generator"
  | "contrast-checker";

type Bilingual = { fa: string; en: string };

export type Tool = {
  slug: ToolSlug;
  Icon: IconType;
  title: Bilingual;
  /** One line for the cards on the hub page and the home teaser. */
  summary: Bilingual;
  seo: { title: Bilingual; description: Bilingual };
  intro: Bilingual;
  steps: { fa: string[]; en: string[] };
  faq: { question: Bilingual; answer: Bilingual }[];
  /** Service page the call to action points to. */
  service: ServiceSlug;
  /** Where the work happens: in the visitor's browser, or through the Worker. */
  runsOn: "browser" | "server";
};

export const TOOLS: Tool[] = [
  {
    slug: "website-seo-audit",
    Icon: FiActivity,
    runsOn: "server",
    service: "seo-google-growth",
    title: { fa: "بررسی رایگان سئو و سلامت سایت", en: "Free website SEO and health check" },
    summary: {
      fa: "آدرس سایت را بزنید و در چند ثانیه وضعیت سئوی پایه، سرعت پاسخ و مشکلات مهم را ببینید.",
      en: "Enter your address and see your basic SEO, response speed and the issues that matter in seconds.",
    },
    seo: {
      title: { fa: "بررسی رایگان سئو سایت؛ نتیجه در چند ثانیه", en: "Free Website SEO Check: Results in Seconds" },
      description: {
        fa: "آدرس سایت را وارد کنید و در چند ثانیه وضعیت عنوان، توضیحات، تیترها، تصاویر، robots.txt و sitemap را همراه با راهکار اصلاح ببینید.",
        en: "Enter your URL and see in seconds how your title, description, headings, images, robots.txt and sitemap score, with a fix for each issue.",
      },
    },
    intro: {
      fa: "این ابزار صفحه‌ای را که وارد می‌کنید مثل یک ربات جستجو باز می‌کند و ۲۰ نکتهٔ مهم سئو و سلامت فنی را بررسی می‌کند: عنوان و توضیحات، تیترها، تصاویر، داده ساختاریافته، robots.txt، sitemap، HTTPS و زمان پاسخ سرور. نتیجه فقط برای همین بررسی نمایش داده می‌شود و ذخیره نمی‌شود.",
      en: "This tool opens the page you enter the way a search crawler would and checks 20 key points of SEO and technical health: title and description, headings, images, structured data, robots.txt, sitemap, HTTPS and server response time. The result is shown only for this check and is not stored.",
    },
    steps: {
      fa: [
        "آدرس صفحه را وارد کنید؛ مثلاً example.com یا آدرس کامل یک صفحه.",
        "چند ثانیه صبر کنید تا صفحه، robots.txt و sitemap خوانده شود.",
        "نکته‌های قرمز را اول و نکته‌های زرد را بعد اصلاح کنید.",
        "اگر می‌خواهید اصلاح‌ها را ما انجام دهیم، نتیجه را برایمان بفرستید.",
      ],
      en: [
        "Enter the page address, for example example.com or the full URL of a page.",
        "Wait a few seconds while the page, robots.txt and sitemap are read.",
        "Fix the red items first and the yellow ones after.",
        "If you want us to make the fixes, send us the result.",
      ],
    },
    faq: [
      {
        question: { fa: "این بررسی چه چیزی را نشان نمی‌دهد؟", en: "What does this check not show?" },
        answer: {
          fa: "فقط یک صفحه و مسائل پایه را می‌بیند. رتبهٔ کلمات، کیفیت محتوا، لینک‌های ورودی و سرعت واقعی کاربران را اندازه نمی‌گیرد؛ برای آن‌ها به Search Console و ابزارهای تخصصی نیاز است.",
          en: "It looks at one page and the basics only. It does not measure keyword rankings, content quality, backlinks or real-user speed; for those you need Search Console and specialist tools.",
        },
      },
      {
        question: { fa: "«زمان پاسخ» از کجا اندازه‌گیری می‌شود؟", en: "Where is the response time measured from?" },
        answer: {
          fa: "از سرورهای کلودفلر، یعنی زمان رسیدن اولین پاسخ سرور سایت شما. این عدد با سرعت بارگذاری کامل در مرورگر کاربر فرق دارد و فقط شاخصی از سلامت سرور است.",
          en: "From Cloudflare's servers: the time until your site's server returns its first response. It differs from full load time in a visitor's browser and is only an indicator of server health.",
        },
      },
      {
        question: { fa: "آیا آدرس سایت من ذخیره می‌شود؟", en: "Is my site address stored?" },
        answer: {
          fa: "خیر. آدرس و نتیجه فقط برای همین درخواست پردازش می‌شوند. فقط اگر خودتان فرم تماس زیر نتیجه را بفرستید، همان پیام برای ما ثبت می‌شود.",
          en: "No. The address and result are processed for this request only. Only if you send the contact form under the result is that message saved for us.",
        },
      },
    ],
  },
  {
    slug: "meta-tag-generator",
    Icon: FiTag,
    runsOn: "browser",
    service: "seo-google-growth",
    title: { fa: "سازنده متاتگ و Open Graph", en: "Meta tag and Open Graph generator" },
    summary: {
      fa: "عنوان و توضیحات را بنویسید، پیش‌نمایش گوگل را ببینید و کد HTML آماده را کپی کنید.",
      en: "Write your title and description, preview the Google result and copy ready-made HTML.",
    },
    seo: {
      title: { fa: "سازنده رایگان متاتگ، Open Graph و Twitter Card", en: "Free Meta Tag, Open Graph and Twitter Card Generator" },
      description: {
        fa: "عنوان و توضیحات صفحه را بنویسید، طول آن‌ها را کنترل کنید، پیش‌نمایش نتیجه گوگل را ببینید و کد HTML آماده را کپی کنید.",
        en: "Write your page title and description, check their length, preview the Google result, and copy ready-to-paste HTML meta tags.",
      },
    },
    intro: {
      fa: "عنوان و توضیحات صفحه همان چیزی است که در نتیجهٔ گوگل و هنگام اشتراک‌گذاری لینک دیده می‌شود. این ابزار طول متن را کنترل می‌کند، پیش‌نمایش نتیجهٔ گوگل را نشان می‌دهد و تگ‌های title، description، canonical، Open Graph و Twitter Card را آمادهٔ کپی می‌کند. همهٔ کار در مرورگر شما انجام می‌شود و چیزی ارسال نمی‌شود.",
      en: "A page's title and description are what appear in Google's results and when a link is shared. This tool checks text length, previews the Google result and produces the title, description, canonical, Open Graph and Twitter Card tags ready to copy. Everything happens in your browser and nothing is sent.",
    },
    steps: {
      fa: [
        "عنوان (حدود ۲۰ تا ۶۰ نویسه) و توضیحات (حدود ۷۰ تا ۱۶۰ نویسه) را بنویسید.",
        "آدرس صفحه و در صورت نیاز آدرس تصویر اشتراک‌گذاری را وارد کنید.",
        "پیش‌نمایش را بررسی کنید و رنگ شمارنده‌ها را سبز نگه دارید.",
        "کد را کپی کنید و داخل بخش head صفحه قرار دهید.",
      ],
      en: [
        "Write the title (about 20 to 60 characters) and description (about 70 to 160 characters).",
        "Enter the page address and, if you have one, the share image address.",
        "Check the preview and keep the counters green.",
        "Copy the code and place it inside the page's head section.",
      ],
    },
    faq: [
      {
        question: { fa: "طول مناسب عنوان و توضیحات چقدر است؟", en: "What is a good title and description length?" },
        answer: {
          fa: "به‌طور معمول عنوان تا حدود ۶۰ نویسه و توضیحات تا حدود ۱۶۰ نویسه کامل نمایش داده می‌شود. این‌ها قاعدهٔ قطعی گوگل نیستند و بر اساس عرض پیکسل بریده می‌شوند؛ پس عددها راهنما هستند.",
          en: "Typically a title of up to about 60 characters and a description of up to about 160 show in full. These are not strict Google rules, since truncation depends on pixel width, so treat the numbers as a guide.",
        },
      },
      {
        question: { fa: "آیا گوگل همیشه توضیحات من را نشان می‌دهد؟", en: "Does Google always show my description?" },
        answer: {
          fa: "نه. گوگل ممکن است متنی دیگر از صفحه را متناسب با جستجو نشان دهد. توضیحات خوب همچنان شانس نمایش و نرخ کلیک را بهتر می‌کند.",
          en: "No. Google may show other text from the page to match the search. A good description still improves the chance of being shown and the click rate.",
        },
      },
      {
        question: { fa: "تصویر Open Graph چه اندازه‌ای باید باشد؟", en: "What size should the Open Graph image be?" },
        answer: {
          fa: "اندازهٔ رایج ۱۲۰۰ در ۶۳۰ پیکسل با نسبت تقریبی ۱٫۹ به ۱ است. آدرس تصویر باید کامل و عمومی (با https) باشد.",
          en: "A common size is 1200 by 630 pixels, roughly a 1.9 to 1 ratio. The image address must be a full, public https URL.",
        },
      },
    ],
  },
  {
    slug: "faq-schema-generator",
    Icon: FiHelpCircle,
    runsOn: "browser",
    service: "seo-google-growth",
    title: { fa: "ساخت اسکیمای FAQ (JSON-LD)", en: "FAQ schema (JSON-LD) generator" },
    summary: {
      fa: "پرسش و پاسخ‌های صفحه را وارد کنید و کد JSON-LD نوع FAQPage را بسازید.",
      en: "Enter your page's questions and answers and build FAQPage JSON-LD.",
    },
    seo: {
      title: { fa: "سازنده رایگان اسکیمای FAQ برای سئو و هوش مصنوعی", en: "Free FAQ Schema Generator for SEO and AI Search" },
      description: {
        fa: "پرسش و پاسخ‌های صفحه را وارد کنید و کد JSON-LD نوع FAQPage را بسازید؛ ساختاری که موتورهای جستجو و دستیارهای هوشمند بهتر می‌فهمند.",
        en: "Enter your page's questions and answers and build FAQPage JSON-LD, a structure search engines and AI assistants understand better.",
      },
    },
    intro: {
      fa: "اسکیمای FAQ به موتورهای جستجو و دستیارهای هوش مصنوعی می‌گوید کدام بخش صفحه پرسش است و کدام پاسخ. این ابزار از پرسش و پاسخ‌هایی که می‌نویسید کد JSON-LD معتبر می‌سازد. توجه کنید که گوگل از سال ۲۰۲۳ نمایش ظاهر ویژهٔ FAQ را عمدتاً به سایت‌های دولتی و سلامت محدود کرده است؛ با این حال این ساختار برای فهم محتوا و پاسخ‌گویی دستیارها مفید است. پرسش‌ها باید واقعاً روی همان صفحه دیده شوند.",
      en: "FAQ schema tells search engines and AI assistants which part of a page is a question and which is its answer. This tool builds valid JSON-LD from the questions and answers you write. Note that since 2023 Google mostly limits the special FAQ appearance to government and health sites; the structure still helps content understanding and AI assistants. The questions must actually be visible on the same page.",
    },
    steps: {
      fa: [
        "پرسش‌ها و پاسخ‌های کوتاه و دقیق را بنویسید (همان‌هایی که روی صفحه دیده می‌شوند).",
        "کد JSON-LD را کپی کنید.",
        "کد را داخل صفحه، پیش از بستن تگ body یا در head، قرار دهید.",
        "با ابزار Rich Results Test گوگل صحت آن را بررسی کنید.",
      ],
      en: [
        "Write short, accurate questions and answers (the same ones visible on the page).",
        "Copy the JSON-LD code.",
        "Place it in the page, in the head or before the closing body tag.",
        "Check it with Google's Rich Results Test.",
      ],
    },
    faq: [
      {
        question: { fa: "آیا با اسکیمای FAQ در گوگل نتیجهٔ ویژه می‌گیرم؟", en: "Will FAQ schema give me a rich result in Google?" },
        answer: {
          fa: "احتمالاً نه، مگر سایت دولتی یا سلامت باشد. اما این داده به فهم محتوا کمک می‌کند و می‌تواند برای دستیارهای هوشمند هم مفید باشد.",
          en: "Probably not unless yours is a government or health site. The data still helps content understanding and can help AI assistants too.",
        },
      },
      {
        question: { fa: "چند پرسش بنویسم؟", en: "How many questions should I add?" },
        answer: {
          fa: "سه تا هشت پرسش واقعی که مشتریان می‌پرسند کافی است. پاسخ‌ها باید با متن صفحه یکسان و کوتاه باشند.",
          en: "Three to eight real questions your customers ask is enough. Answers should match the page text and stay short.",
        },
      },
      {
        question: { fa: "آیا می‌توانم در پاسخ لینک بگذارم؟", en: "Can I put links in the answers?" },
        answer: {
          fa: "بله، تگ‌های ساده HTML مثل لینک و فهرست در پاسخ مجاز است. این ابزار متن ساده می‌سازد؛ در صورت نیاز کد را ویرایش کنید.",
          en: "Yes, simple HTML such as links and lists is allowed in answers. This tool produces plain text; edit the code if you need markup.",
        },
      },
    ],
  },
  {
    slug: "robots-sitemap-generator",
    Icon: FiFileText,
    runsOn: "browser",
    service: "seo-google-growth",
    title: { fa: "ساخت robots.txt و sitemap.xml", en: "robots.txt and sitemap.xml generator" },
    summary: {
      fa: "فایل robots.txt و نقشهٔ XML سایت را بسازید و قوانین ربات‌های هوش مصنوعی را تعیین کنید.",
      en: "Build robots.txt and an XML sitemap and set rules for AI crawlers.",
    },
    seo: {
      title: { fa: "سازنده رایگان robots.txt و sitemap.xml", en: "Free robots.txt and sitemap.xml Generator" },
      description: {
        fa: "فایل robots.txt و نقشهٔ سایت XML را با چند کلیک بسازید، قوانین ربات‌های هوش مصنوعی را تعیین کنید و فایل را دانلود کنید.",
        en: "Build robots.txt and an XML sitemap in a few clicks, set rules for AI crawlers, and download the files.",
      },
    },
    intro: {
      fa: "robots.txt به ربات‌ها می‌گوید به کدام بخش‌ها سر بزنند و sitemap.xml فهرست صفحات مهم را به آن‌ها می‌دهد. این ابزار هر دو فایل را می‌سازد و به شما اجازه می‌دهد برای ربات‌های هوش مصنوعی مثل GPTBot، ClaudeBot و Google-Extended جداگانه تصمیم بگیرید. فایل‌ها در مرورگر شما ساخته می‌شوند.",
      en: "robots.txt tells crawlers which areas to visit and sitemap.xml gives them a list of your important pages. This tool builds both and lets you decide separately about AI crawlers such as GPTBot, ClaudeBot and Google-Extended. The files are built in your browser.",
    },
    steps: {
      fa: [
        "آدرس سایت، مسیرهایی که نباید بخزند و تصمیم دربارهٔ ربات‌های هوش مصنوعی را مشخص کنید.",
        "برای نقشهٔ سایت، آدرس صفحات را هر کدام در یک خط بنویسید.",
        "فایل‌ها را دانلود کنید و در ریشهٔ سایت قرار دهید (مثلاً example.com/robots.txt).",
        "نقشهٔ سایت را در Search Console ثبت کنید.",
      ],
      en: [
        "Enter your site address, the paths crawlers should skip, and your decision about AI crawlers.",
        "For the sitemap, write one page address per line.",
        "Download the files and place them at the site root (for example example.com/robots.txt).",
        "Submit the sitemap in Search Console.",
      ],
    },
    faq: [
      {
        question: { fa: "آیا robots.txt صفحه‌ای را از نتایج حذف می‌کند؟", en: "Does robots.txt remove a page from results?" },
        answer: {
          fa: "نه لزوماً. robots.txt جلوی خزیدن را می‌گیرد، نه فهرست‌شدن را. برای حذف صفحه از نتایج از noindex استفاده کنید و صفحه را برای ربات باز بگذارید.",
          en: "Not necessarily. robots.txt blocks crawling, not indexing. To keep a page out of results use noindex and leave the page open to crawlers.",
        },
      },
      {
        question: { fa: "ربات‌های هوش مصنوعی را مسدود کنم یا نه؟", en: "Should I block AI crawlers?" },
        answer: {
          fa: "بستگی به هدف شما دارد. اگر می‌خواهید در پاسخ‌های ChatGPT و Claude دیده شوید، اجازه دهید. اگر نمی‌خواهید محتوایتان برای آموزش مدل‌ها استفاده شود، مسدود کنید. این ابزار هر دو حالت را می‌سازد.",
          en: "It depends on your goal. If you want to appear in ChatGPT and Claude answers, allow them. If you do not want your content used to train models, block them. This tool builds either.",
        },
      },
      {
        question: { fa: "چند صفحه در sitemap بگذارم؟", en: "How many pages should the sitemap list?" },
        answer: {
          fa: "همهٔ صفحه‌هایی که می‌خواهید در گوگل دیده شوند و قابل‌دسترس‌اند. هر فایل تا ۵۰ هزار آدرس را پشتیبانی می‌کند.",
          en: "All pages you want in Google that are publicly reachable. One file supports up to 50,000 URLs.",
        },
      },
    ],
  },
  {
    slug: "contrast-checker",
    Icon: FiDroplet,
    runsOn: "browser",
    service: "ui-ux-brand-design",
    title: { fa: "بررسی کنتراست رنگ (WCAG)", en: "Color contrast checker (WCAG)" },
    summary: {
      fa: "رنگ متن و پس‌زمینه را وارد کنید تا نسبت کنتراست و قبولی در سطح AA و AAA را ببینید.",
      en: "Enter text and background colors to see the contrast ratio and AA and AAA results.",
    },
    seo: {
      title: { fa: "ابزار رایگان بررسی کنتراست رنگ متن و پس‌زمینه", en: "Free Text and Background Color Contrast Checker" },
      description: {
        fa: "دو رنگ را وارد کنید تا نسبت کنتراست و قبولی در سطح AA و AAA را ببینید؛ برای خوانایی و دسترس‌پذیری بهتر سایت.",
        en: "Enter two colors to see the contrast ratio and AA and AAA results, for a more readable and accessible website.",
      },
    },
    intro: {
      fa: "کنتراست کم متن را برای بسیاری از کاربران، به‌ویژه افراد کم‌بینا و کسانی که زیر نور خورشید به گوشی نگاه می‌کنند، ناخوانا می‌کند. این ابزار نسبت کنتراست دو رنگ را طبق دستورالعمل WCAG محاسبه می‌کند و نشان می‌دهد برای متن معمولی و متن بزرگ در سطح AA و AAA قبول می‌شود یا نه.",
      en: "Low contrast makes text unreadable for many users, especially people with low vision and anyone reading a phone in sunlight. This tool calculates the contrast ratio of two colors according to WCAG and shows whether they pass AA and AAA for normal and large text.",
    },
    steps: {
      fa: [
        "رنگ متن و رنگ پس‌زمینه را با انتخابگر یا کد هگز (مثل #1a1a1a) وارد کنید.",
        "نسبت کنتراست و نتیجهٔ AA و AAA را بخوانید.",
        "اگر ردّ شد، یکی از رنگ‌ها را روشن‌تر یا تیره‌تر کنید.",
      ],
      en: [
        "Enter the text and background colors with the picker or a hex code (such as #1a1a1a).",
        "Read the contrast ratio and the AA and AAA results.",
        "If it fails, make one of the colors lighter or darker.",
      ],
    },
    faq: [
      {
        question: { fa: "حداقل کنتراست مجاز چقدر است؟", en: "What is the minimum allowed contrast?" },
        answer: {
          fa: "برای سطح AA متن معمولی حداقل ۴٫۵ به ۱ و متن بزرگ (حدود ۲۴ پیکسل یا ۱۹ پیکسل ضخیم) حداقل ۳ به ۱ لازم است. سطح AAA به ترتیب ۷ و ۴٫۵ را می‌خواهد.",
          en: "For AA, normal text needs at least 4.5 to 1 and large text (about 24px, or 19px bold) at least 3 to 1. AAA asks for 7 and 4.5.",
        },
      },
      {
        question: { fa: "آیا این ابزار فقط برای وب است؟", en: "Is this tool only for the web?" },
        answer: {
          fa: "نه. فرمول برای هر طراحی صفحه‌نمایش، از اپ موبایل تا پوستر دیجیتال، صدق می‌کند.",
          en: "No. The formula applies to any screen design, from mobile apps to digital posters.",
        },
      },
      {
        question: { fa: "آیا کنتراست روی سئو اثر دارد؟", en: "Does contrast affect SEO?" },
        answer: {
          fa: "اثر مستقیم و اثبات‌شده‌ای روی رتبه ندارد، اما خوانایی بهتر باعث ماندن بیشتر کاربر و نرخ تبدیل بالاتر می‌شود و بخشی از دسترس‌پذیری است.",
          en: "There is no proven direct ranking effect, but better readability keeps visitors longer, helps conversions and is part of accessibility.",
        },
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolHref(locale: "fa" | "en", slug: string) {
  return `/${locale}/tools/${slug}`;
}
