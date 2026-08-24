# SoSho Studio AI Sales

وب‌سایت دوزبانه‌ی SoSho Studio همراه با دستیار فروش هوشمند، ثبت سرنخ در Cloudflare D1 و پاسخ‌گویی خودکار به پیام‌های وب‌سایت و اینستاگرام است.

> کد اپلیکیشن فعلی داخل پوشه‌ی [`sosho-studio-ai/`](./sosho-studio-ai/) قرار دارد. نسخه‌ی قدیمی ریشه عمداً حذف شده است؛ تمام فرمان‌های توسعه باید داخل همین پوشه اجرا شوند.

## قابلیت‌های اصلی

- سایت فارسی و انگلیسی با پشتیبانی کامل از RTL و LTR
- صفحات خدمات، نمونه‌کارها و مجله با خروجی استاتیک و SEO کامل
- Hero سه‌بعدی با Three.js و fallback مناسب برای reduced motion
- متادیتا، Open Graph، sitemap، robots و داده‌های ساختاریافته
- چت شناور فروش در تمام صفحات محلی‌سازی‌شده
- پاسخ ساختاریافته با OpenAI Responses API و fallback بدون AI
- ذخیره‌ی lead، conversation و message در Cloudflare D1
- دریافت امن webhook اینستاگرام، بررسی امضا و جلوگیری از پردازش تکراری
- بسته‌ی استقرار استاتیک برای Cloudflare Workers / OpenAI Sites

## تکنولوژی‌ها

- Next.js 16 و React 19
- TypeScript با حالت strict و React Compiler
- Tailwind CSS 4
- Three.js، React Three Fiber و Drei
- Cloudflare Workers، Wrangler و D1
- OpenAI Responses API
- Meta / Instagram Graph API
- ESLint 9 و Playwright برای ساخت تصویر کاور وبلاگ

## ساختار پروژه

```text
.
|- AGENTS.md                         راهنمای کامل توسعه و تصمیم‌های معماری
|- README.md                         راهنمای شروع سریع
`- sosho-studio-ai/
   |- src/app/                       صفحات و کامپوننت‌های Next.js
   |  |- [locale]/                   مسیرهای فارسی و انگلیسی
   |  |- blogs/posts.ts              منبع اصلی محتوای وبلاگ
   |  `- components/
   |     |- SalesAssistant/          رابط چت فروش
   |     |- Services/                داده و کارت‌های خدمات
   |     `- Hero/                    صحنه‌ی سه‌بعدی
   |- worker/index.js                API، منطق AI، D1 و Instagram webhook
   |- db/
   |  |- migrations/0000_ai_sales.sql
   |  `- schema.ts
   |- scripts/build-sites.mjs        ساخت خروجی استاتیک و Worker نهایی
   |- docs/AI_SALES_SETUP.md         جزئیات راه‌اندازی سرویس‌های AI و Meta
   |- .env.example                   نام متغیرهای محرمانه‌ی موردنیاز
   |- .openai/hosting.json           تنظیم پروژه و binding دیتابیس
   `- wrangler.jsonc                 تنظیم استقرار Cloudflare
```

## شروع توسعه

نیازمندی پیشنهادی پروژه Node.js 22 یا جدیدتر و npm است.

```bash
cd sosho-studio-ai
npm ci
npm run dev
```

سایت در حالت عادی روی `http://localhost:3000` اجرا می‌شود و `/` به `/fa` هدایت می‌شود.

نکته: `npm run dev` فقط Next.js را اجرا می‌کند. APIهای Worker، دیتابیس D1 و چت انتها‌به‌انتها در این حالت فعال نیستند؛ برای تست واقعی چت باید Worker ساخته و با bindingهای آزمایشی اجرا شود.

## مسیرهای سایت و API

مسیرهای رابط کاربری:

- `/fa` و `/en`: صفحه‌ی اصلی
- `/{locale}/services/{slug}`: جزئیات خدمات
- `/{locale}/blogs`: فهرست مقالات
- `/{locale}/blogs/{slug}`: صفحه‌ی مقاله
- `/robots.txt`، `/sitemap.xml` و `/manifest.webmanifest`

مسیرهای Worker:

- `GET /api/health`: وضعیت پیکربندی AI، دیتابیس و Instagram
- `POST /api/sales/chat`: پردازش پیام دستیار فروش سایت
- `GET /api/meta/webhook`: تأیید webhook در Meta
- `POST /api/meta/webhook`: دریافت و پردازش پیام Instagram

## متغیرها و bindingهای لازم

| نام | کاربرد |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | آدرس کامل production برای canonical، Open Graph، JSON-LD، sitemap و robots |
| `DB` | binding دیتابیس Cloudflare D1 |
| `OPENAI_API_KEY` | فعال‌سازی پاسخ هوشمند |
| `OPENAI_MODEL` | مدل پاسخ‌گو؛ مقدار پیش‌فرض فعلی `gpt-5.6-luna` است |
| `META_VERIFY_TOKEN` | تأیید callback اینستاگرام |
| `META_APP_SECRET` | بررسی امضای webhook |
| `META_INSTAGRAM_ACCESS_TOKEN` | ارسال پاسخ در Direct |
| `META_GRAPH_VERSION` | نسخه‌ی Graph API؛ مقدار پیش‌فرض فعلی `v26.0` است |

مقادیر واقعی را فقط در Secret Manager میزبان قرار دهید. فایل `.env.example` فقط نام متغیرها را نگه می‌دارد و نباید هیچ secret واقعی وارد Git شود.

## بررسی کیفیت و build

همه‌ی فرمان‌های زیر را داخل `sosho-studio-ai/` اجرا کنید:

```bash
npm run lint
npm run build:next
npm run build
```

- `npm run build:next`: build معمول Next.js در `.next/`؛ برای `npm run start` استفاده می‌شود.
- `npm run build`: همان `build:sites` است و خروجی قابل استقرار را در `dist/` می‌سازد.
- `build:sites` خروجی استاتیک را در `dist/client/` و Worker نهایی را در `dist/server/index.js` قرار می‌دهد.
- migration دیتابیس هنگام build داخل Worker تزریق و یک نسخه از آن در `dist/.openai/drizzle/` بسته‌بندی می‌شود.

در حال حاضر پروژه تست خودکار، فرمان `test` یا محیط preview برای Worker ندارد. نتیجه‌ی lint و build جای تست رفتاری API، RTL/LTR و رابط موبایل را نمی‌گیرد.

## تولید کاور وبلاگ

```bash
npm run blog:cover -- --slug "post-slug" --tag "SEO"
npm run blog:cover -- --slug "post-slug" --tag "AI" --out public/blog/custom.png
```

این اسکریپت یک PNG بدون متن با ابعاد 1200x630 می‌سازد. اگر Chromium نصب نباشد، یک بار اجرا کنید:

```bash
npx playwright install chromium
```

## استقرار

```bash
npm run deploy
```

این فرمان ابتدا bundle کامل را می‌سازد و سپس `wrangler deploy` را اجرا می‌کند. تنظیم فعلی مستقیماً دامنه‌های `sosho-studio.net` و `www.sosho-studio.net` را هدف می‌گیرد؛ بنابراین فقط با تأیید صریح و بعد از بررسی environment، دیتابیس و secretها اجرا شود.

فایل workflow موجود در `sosho-studio-ai/.github/workflows/` از ریشه‌ی این مخزن توسط GitHub Actions شناسایی نمی‌شود. تا زمانی که workflow به `.github/workflows/` ریشه منتقل یا با `working-directory` درست بازنویسی نشده، استقرار خودکار فعال محسوب نمی‌شود.

برای استقرار مستقل Cloudflare باید D1 ساخته شود، migration اجرا شود و binding با نام `DB` به Worker متصل باشد. جزئیات بیشتر در [`sosho-studio-ai/docs/AI_SALES_SETUP.md`](./sosho-studio-ai/docs/AI_SALES_SETUP.md) آمده است.

## محل ویرایش محتوا

- خدمات و slugها: `sosho-studio-ai/src/app/components/Services/data.ts`
- مقالات: `sosho-studio-ai/src/app/blogs/posts.ts`
- نمونه‌کارها: `sosho-studio-ai/src/app/components/Projects/index.tsx`
- درباره‌ی استودیو و ابزارها: `sosho-studio-ai/src/app/components/About/index.tsx`
- ترجمه‌ی ناوبری: `sosho-studio-ai/src/app/i18n.ts`
- دستیار فروش: `sosho-studio-ai/src/app/components/SalesAssistant/index.tsx`
- منطق backend و prompt فروش: `sosho-studio-ai/worker/index.js`

برای هر تغییر محتوایی، نسخه‌ی فارسی و انگلیسی، متادیتا، sitemap، structured data و حالت RTL/LTR را با هم بررسی کنید.

## وضعیت فعلی و محدودیت‌های مهم

- دیتابیس برای ذخیره‌ی پایدار مکالمه، rate limit و جلوگیری از webhook تکراری ضروری است.
- نبود کلید OpenAI باعث استفاده از پرسش‌های fallback می‌شود، اما نبود D1 تاریخچه‌ی مکالمه را از بین می‌برد.
- دستیار قیمت قطعی، تخفیف یا زمان تحویل تضمینی اعلام نمی‌کند؛ موتور قیمت‌گذاری قطعی هنوز پیاده‌سازی نشده است.
- بعضی داده‌های تماس و SEO در چند فایل تکرار شده‌اند و هنگام تغییر باید با جست‌وجوی سراسری هماهنگ شوند.
- خروجی فعلی static export است؛ منطق runtime باید در Worker باقی بماند.

پیش از شروع تغییرات فنی، [`AGENTS.md`](./AGENTS.md) را بخوانید؛ آن فایل قراردادهای معماری، امنیت، validation و نکات شناخته‌شده را با جزئیات ثبت می‌کند.
