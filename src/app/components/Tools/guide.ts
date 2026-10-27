import type { ToolSlug } from "./data";

type List = { fa: string[]; en: string[] };

/** Longer copy under each tool: when to use it, tips for reading the result, and the articles that go deeper. */
export type ToolGuide = {
  when: List;
  tips: List;
  /** Blog post slugs. */
  articles: [string, string];
};

export const TOOL_GUIDE: Record<ToolSlug, ToolGuide> = {
  "website-seo-audit": {
    when: {
      fa: [
        "پیش از لانچ یک سایت جدید، برای اینکه مطمئن شوید موانع فنی ایندکس ندارید",
        "وقتی ترافیک گوگل افت کرده و می‌خواهید اول مشکل‌های فنی را کنار بگذارید",
        "بعد از تغییر قالب، انتقال دامنه یا بازطراحی",
        "پیش از سفارش سئو، تا بدانید از کجا باید شروع کرد",
      ],
      en: [
        "Before launching a new site, to be sure nothing technical blocks indexing",
        "When Google traffic has dropped and you want to rule out technical causes first",
        "After a theme change, domain move or redesign",
        "Before ordering SEO work, so you know where to start",
      ],
    },
    tips: {
      fa: [
        "نتیجه یک بررسی خودکار است و جای بررسی انسانی را نمی‌گیرد",
        "فقط یک صفحه بررسی می‌شود؛ صفحه‌های مهم دیگرتان را هم جداگانه امتحان کنید",
        "موارد قرمز را اول اصلاح کنید و بعد دوباره بررسی کنید",
        "امتیاز بالا یعنی پایه فنی سالم است، نه تضمین رتبه در گوگل",
      ],
      en: [
        "The result is an automated check and does not replace a human review",
        "Only one page is checked; test your other important pages separately",
        "Fix the red items first, then run the check again",
        "A high score means a sound technical base, not a guaranteed ranking",
      ],
    },
    articles: ["google-seo-launch-checklist", "fast-seo-websites"],
  },
  "meta-tag-generator": {
    when: {
      fa: [
        "هنگام ساخت یک صفحه جدید و نوشتن عنوان و توضیحات آن",
        "وقتی پیش‌نمایش لینک شما در تلگرام، واتساپ یا شبکه‌های اجتماعی درست نمایش داده نمی‌شود",
        "برای اینکه عنوان و توضیحات را در طول مناسب بنویسید و در نتیجه جست‌وجو بریده نشوند",
      ],
      en: [
        "When you build a new page and write its title and description",
        "When your link preview looks wrong in Telegram, WhatsApp or social networks",
        "To keep the title and description at a length that is not cut off in search results",
      ],
    },
    tips: {
      fa: [
        "عنوان را حدود ۵۰ تا ۶۰ کاراکتر و توضیحات را حدود ۱۱۰ تا ۱۶۰ کاراکتر نگه دارید",
        "هر صفحه عنوان و توضیحات مخصوص خودش را داشته باشد؛ تکراری بودن آن‌ها صفحه‌ها را شبیه هم نشان می‌دهد",
        "برای تصویر اشتراک‌گذاری اندازه ۱۲۰۰ در ۶۳۰ پیکسل معمولاً بهترین نتیجه را می‌دهد",
        "آدرس canonical را همان آدرس نهایی و بدون ریدایرکت همان صفحه بگذارید",
      ],
      en: [
        "Keep titles around 50 to 60 characters and descriptions around 110 to 160",
        "Give every page its own title and description; duplicates make pages look alike",
        "A 1200 by 630 pixel sharing image usually gives the best result",
        "Set the canonical URL to the page's own final address, with no redirect",
      ],
    },
    articles: ["google-seo-launch-checklist", "service-page-seo-conversion"],
  },
  "faq-schema-generator": {
    when: {
      fa: [
        "برای صفحه سرویس یا محصولی که سؤال‌های تکراری دارد",
        "برای مقاله‌ای که بخش پرسش‌های متداول دارد",
        "وقتی می‌خواهید ساختار سؤال و پاسخ برای موتورهای جست‌وجو و هوش مصنوعی روشن‌تر باشد",
      ],
      en: [
        "For a service or product page with recurring questions",
        "For an article that has a frequently asked questions section",
        "When you want the question-and-answer structure to be clearer to search engines and AI systems",
      ],
    },
    tips: {
      fa: [
        "فقط سؤال‌هایی را اضافه کنید که روی خود صفحه هم دیده می‌شوند",
        "پاسخ‌ها کوتاه، دقیق و بدون تبلیغ باشند",
        "اسکیما نمایش نتیجه ویژه در گوگل را تضمین نمی‌کند",
        "بعد از گذاشتن کد، آن را با ابزار تست نتایج غنی گوگل بررسی کنید",
      ],
      en: [
        "Only add questions that are also visible on the page",
        "Keep answers short, accurate and free of advertising",
        "Schema does not guarantee a rich result in Google",
        "After adding the code, check it with Google's rich results test",
      ],
    },
    articles: ["geo-aeo-answer-engine-optimization", "ecommerce-product-page-seo"],
  },
  "robots-sitemap-generator": {
    when: {
      fa: [
        "هنگام راه‌اندازی یک سایت جدید",
        "وقتی می‌خواهید مسیرهایی مثل پنل مدیریت را از خزنده‌ها دور نگه دارید",
        "وقتی می‌خواهید تصمیم بگیرید ربات‌های هوش مصنوعی اجازه خواندن سایتتان را داشته باشند یا نه",
      ],
      en: [
        "When setting up a new website",
        "When you want crawlers to stay out of paths such as an admin panel",
        "When you decide whether AI bots may read your site",
      ],
    },
    tips: {
      fa: [
        "robots.txt ابزار امنیتی نیست؛ اطلاعات حساس را با آن پنهان نکنید",
        "یک Disallow اشتباه می‌تواند کل سایت را از گوگل بیرون ببرد",
        "آدرس sitemap را در robots.txt بنویسید و در Search Console هم ثبت کنید",
        "در sitemap فقط آدرس‌هایی بگذارید که کد ۲۰۰ برمی‌گردانند و ایندکس‌شدنی هستند",
      ],
      en: [
        "robots.txt is not a security tool; do not use it to hide sensitive information",
        "One wrong Disallow can remove the whole site from Google",
        "Write the sitemap address in robots.txt and submit it in Search Console too",
        "Only list URLs that return 200 and are indexable",
      ],
    },
    articles: ["ai-crawlers-indexing-guide", "google-seo-launch-checklist"],
  },
  "contrast-checker": {
    when: {
      fa: [
        "هنگام انتخاب رنگ متن و پس‌زمینه",
        "پیش از تحویل طراحی به تیم توسعه",
        "برای بررسی دسترس‌پذیری برای کاربران کم‌بینا",
      ],
      en: [
        "When choosing text and background colours",
        "Before handing a design to developers",
        "To check accessibility for low-vision users",
      ],
    },
    tips: {
      fa: [
        "نسبت حداقل ۴٫۵ به ۱ برای متن معمولی (AA) و ۳ به ۱ برای متن بزرگ لازم است",
        "متن روی تصویر را در بدترین بخش تصویر بسنجید، نه بهترین بخش",
        "رنگ تنها نباید تنها نشانه یک وضعیت باشد؛ آیکون یا متن هم کنارش بگذارید",
        "حالت تیره را هم جداگانه بررسی کنید",
      ],
      en: [
        "A ratio of at least 4.5 to 1 is needed for normal text (AA) and 3 to 1 for large text",
        "Test text over an image at the worst part of the image, not the best",
        "Colour alone should not be the only signal of a state; add an icon or text",
        "Check dark mode separately",
      ],
    },
    articles: ["tailwind-clean-ui-patterns", "web-design-trends-2026"],
  },
};
