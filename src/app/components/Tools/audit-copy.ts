// Translations for the checks returned by POST /api/tools/audit (worker/site-audit.js).
// The Worker is language-neutral and returns only ids, states and values.

type Bilingual = { fa: string; en: string };

export type AuditCheckId =
  | "https" | "status" | "redirects" | "speed" | "size" | "compression"
  | "title" | "description" | "h1" | "headings" | "canonical" | "lang" | "viewport"
  | "social" | "alt" | "schema" | "noindex" | "words" | "robots" | "sitemap";

export type AuditCheckCopy = {
  label: Bilingual;
  /** What it means and how to fix it; shown when a check is not a pass. */
  fix: Bilingual;
};

export const AUDIT_COPY: Record<AuditCheckId, AuditCheckCopy> = {
  https: {
    label: { fa: "اتصال امن HTTPS", en: "Secure HTTPS connection" },
    fix: { fa: "سایت باید با https باز شود. گواهی SSL را فعال کنید و آدرس http را به https هدایت کنید.", en: "The site should open over https. Enable an SSL certificate and redirect http to https." },
  },
  status: {
    label: { fa: "کد پاسخ صفحه", en: "Page response code" },
    fix: { fa: "صفحه باید کد ۲۰۰ برگرداند. کدهای خطا مانع ایندکس‌شدن هستند.", en: "The page should return code 200. Error codes prevent indexing." },
  },
  redirects: {
    label: { fa: "تعداد ریدایرکت تا رسیدن به صفحه", en: "Redirects before reaching the page" },
    fix: { fa: "زنجیرهٔ ریدایرکت را کوتاه کنید؛ هر هدایت اضافه زمان و اعتبار لینک را کم می‌کند.", en: "Shorten the redirect chain; every extra hop costs time and link value." },
  },
  speed: {
    label: { fa: "زمان پاسخ سرور", en: "Server response time" },
    fix: { fa: "پاسخ سرور کند است. کش، CDN، هاست سریع‌تر یا بهینه‌سازی کد و پایگاه داده کمک می‌کند.", en: "The server responds slowly. Caching, a CDN, faster hosting or code and database tuning will help." },
  },
  size: {
    label: { fa: "حجم کد HTML صفحه", en: "HTML size of the page" },
    fix: { fa: "حجم HTML زیاد است. کدهای تکراری و داده‌های درون‌خطی را کم کنید.", en: "The HTML is large. Reduce repeated markup and inline data." },
  },
  compression: {
    label: { fa: "فشرده‌سازی (gzip یا Brotli)", en: "Compression (gzip or Brotli)" },
    fix: { fa: "فشرده‌سازی را در سرور یا CDN فعال کنید؛ حجم انتقال معمولاً بیش از نصف کم می‌شود.", en: "Enable compression on the server or CDN; transfer size usually drops by more than half." },
  },
  title: {
    label: { fa: "عنوان صفحه (title)", en: "Page title" },
    fix: { fa: "برای هر صفحه یک عنوان یکتا و توصیفی بنویسید؛ حدود ۲۰ تا ۶۰ نویسه و با کلمهٔ اصلی در ابتدا.", en: "Give every page a unique, descriptive title of about 20 to 60 characters with the main keyword first." },
  },
  description: {
    label: { fa: "توضیحات صفحه (meta description)", en: "Meta description" },
    fix: { fa: "توضیحاتی ۷۰ تا ۱۶۰ نویسه‌ای بنویسید که دلیل کلیک را بگوید.", en: "Write a description of 70 to 160 characters that gives a reason to click." },
  },
  h1: {
    label: { fa: "تیتر اصلی (H1)", en: "Main heading (H1)" },
    fix: { fa: "هر صفحه باید دقیقاً یک H1 داشته باشد که موضوع صفحه را بگوید.", en: "Each page should have exactly one H1 stating the page topic." },
  },
  headings: {
    label: { fa: "زیرتیترها (H2)", en: "Subheadings (H2)" },
    fix: { fa: "محتوا را با زیرتیتر بخش‌بندی کنید تا هم خواننده و هم ربات ساختار را بفهمند.", en: "Break content into sections with subheadings so readers and crawlers can follow the structure." },
  },
  canonical: {
    label: { fa: "آدرس canonical", en: "Canonical address" },
    fix: { fa: "تگ canonical را اضافه کنید تا نسخه‌های تکراری صفحه با هم اشتباه گرفته نشوند.", en: "Add a canonical tag so duplicate versions of the page are not confused." },
  },
  lang: {
    label: { fa: "زبان صفحه (lang)", en: "Page language (lang)" },
    fix: { fa: "ویژگی lang را روی تگ html بگذارید (مثلاً fa یا en).", en: "Set the lang attribute on the html tag (for example fa or en)." },
  },
  viewport: {
    label: { fa: "سازگاری با موبایل (viewport)", en: "Mobile friendliness (viewport)" },
    fix: { fa: "تگ viewport را اضافه کنید؛ بدون آن صفحه روی موبایل کوچک و ناخوانا دیده می‌شود.", en: "Add the viewport tag; without it the page looks tiny and unreadable on phones." },
  },
  social: {
    label: { fa: "پیش‌نمایش اشتراک‌گذاری (Open Graph)", en: "Share preview (Open Graph)" },
    fix: { fa: "تگ‌های og:title و og:image را اضافه کنید تا لینک شما در پیام‌رسان‌ها و شبکه‌ها خوب دیده شود.", en: "Add og:title and og:image so your link looks good in messengers and social networks." },
  },
  alt: {
    label: { fa: "متن جایگزین تصاویر (alt)", en: "Image alt text" },
    fix: { fa: "برای همهٔ تصاویر مهم متن alt توصیفی بنویسید؛ برای سئوی تصاویر و دسترس‌پذیری لازم است.", en: "Write descriptive alt text for every meaningful image; it is needed for image SEO and accessibility." },
  },
  schema: {
    label: { fa: "داده ساختاریافته (JSON-LD)", en: "Structured data (JSON-LD)" },
    fix: { fa: "داده ساختاریافته مثل Organization، Article یا FAQ اضافه کنید تا موتورهای جستجو و هوش مصنوعی محتوا را بهتر بفهمند.", en: "Add structured data such as Organization, Article or FAQ so search engines and AI understand the content better." },
  },
  noindex: {
    label: { fa: "اجازهٔ ایندکس‌شدن", en: "Allowed to be indexed" },
    fix: { fa: "این صفحه noindex دارد و در گوگل نمی‌آید. اگر عمدی نیست، آن را بردارید.", en: "This page has noindex and will not appear in Google. Remove it if that is not intentional." },
  },
  words: {
    label: { fa: "حجم متن صفحه", en: "Amount of text on the page" },
    fix: { fa: "متن صفحه کم است. محتوای کامل‌تر و مفیدتر شانس رتبه گرفتن را بیشتر می‌کند.", en: "There is little text on the page. Fuller, more useful content improves the chance of ranking." },
  },
  robots: {
    label: { fa: "فایل robots.txt", en: "robots.txt file" },
    fix: { fa: "فایل robots.txt را بسازید و مطمئن شوید کل سایت را مسدود نکرده است.", en: "Create a robots.txt file and make sure it does not block the whole site." },
  },
  sitemap: {
    label: { fa: "نقشهٔ سایت (sitemap.xml)", en: "Sitemap (sitemap.xml)" },
    fix: { fa: "نقشهٔ سایت را بسازید، در robots.txt معرفی کنید و در Search Console ثبت کنید.", en: "Create a sitemap, reference it in robots.txt and submit it in Search Console." },
  },
};

export const AUDIT_ERRORS: Record<string, Bilingual> = {
  invalid_url: {
    fa: "آدرس معتبر نیست. نمونه: example.com یا https://example.com/page",
    en: "That address is not valid. Example: example.com or https://example.com/page",
  },
  blocked_host: {
    fa: "فقط آدرس سایت‌های عمومی اینترنت را می‌توان بررسی کرد (نه آدرس داخلی یا IP).",
    en: "Only public internet sites can be checked (not internal addresses or IPs).",
  },
  audit_unreachable: {
    fa: "به این سایت وصل نشدیم. آدرس را بررسی کنید یا بعداً دوباره تلاش کنید.",
    en: "We could not reach that site. Check the address or try again later.",
  },
  too_many_redirects: {
    fa: "این آدرس بیش از حد ریدایرکت می‌شود و بررسی کامل نشد.",
    en: "This address redirects too many times, so the check could not finish.",
  },
  not_html: {
    fa: "این آدرس یک صفحهٔ وب نیست (مثلاً فایل یا تصویر است).",
    en: "This address is not a web page (for example it is a file or an image).",
  },
  rate_limited: {
    fa: "تعداد بررسی‌ها زیاد بود. کمی بعد دوباره تلاش کنید.",
    en: "Too many checks. Please try again a little later.",
  },
  network: {
    fa: "ارتباط برقرار نشد. اینترنت را بررسی کنید و دوباره تلاش کنید.",
    en: "Could not connect. Check your internet connection and try again.",
  },
  generic: {
    fa: "بررسی انجام نشد. کمی بعد دوباره تلاش کنید.",
    en: "The check could not be completed. Please try again shortly.",
  },
};
