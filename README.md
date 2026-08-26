# SoSho Studio AI Sales

وب‌سایت دوزبانه SoSho Studio به‌همراه هسته فروش خودکار برای چت سایت و Instagram است. Frontend با Next.js به‌صورت استاتیک export می‌شود و API، D1، OpenAI و Meta در Cloudflare Worker اجرا می‌شوند.

> اپلیکیشن فعال مستقیماً در ریشه همین Repository است. نسخه قدیمی حذف شده و نباید بازیابی شود. همه فرمان‌های npm از همین ریشه اجرا می‌شوند.

## قابلیت‌ها

- سایت فارسی/انگلیسی با RTL/LTR، SEO، صفحات خدمات و مجله
- دستیار فروش با conversation ID امن و پایدار در `localStorage`
- اعتبارسنجی strict ورودی و خروجی، fallback دوزبانه و محدودیت سیاست تجاری
- ثبت lead، conversation و message در Cloudflare D1
- rate limit ساعتی بر مبنای IP، مکالمه و کاربر Instagram
- سهمیه عمومی ساعتی و روزانه قابل تنظیم برای OpenAI
- webhook امضاشده Meta با state machine، deduplication و retry پایدار
- timeout، exponential backoff، request ID و structured logging
- retention خودکار پیام‌ها، PII سرنخ‌ها و payload خام Meta
- تست Worker در Runtime رسمی Cloudflare با Vitest و D1 محلی

## ساختار اصلی

```text
.
|- src/                              Next.js App Router و رابط سایت
|- worker/
|  |- index.js                      Worker، API، D1، OpenAI و Instagram
|  `- core.js                       validation، policy و retryهای قابل تست
|- db/
|  |- migrations/                   تنها source of truth دیتابیس D1
|  `- schema.ts                     type mirror آخرین migration
|- tests/                            تست‌های خودکار Worker/D1
|- scripts/
|  |- dev-all.mjs                   اجرای هم‌زمان Next و Worker محلی
|  `- build-sites.mjs               static export و بسته production
|- docs/AI_SALES_SETUP.md            راهنمای D1، OpenAI و Meta
|- wrangler.jsonc                    تنظیم production Cloudflare
|- wrangler.staging.jsonc            Worker و D1 مستقل staging روی workers.dev
|- wrangler.dev.jsonc                تنظیم local Worker
|- .openai/hosting.json              متادیتای OpenAI Sites
`- .github/workflows/                CI و deploy دستی
```

## توسعه محلی

Node.js 22 یا جدیدتر و npm لازم است:

```bash
npm ci
Copy-Item .dev.vars.example .dev.vars
npm run dev
```

`npm run dev` ابتدا migrationهای D1 محلی را اجرا می‌کند، Worker را روی `127.0.0.1:8787` و Next.js را روی `localhost:3000` بالا می‌آورد و درخواست‌های `/api/*` را به Worker proxy می‌کند. فایل `.dev.vars` در Git نادیده گرفته می‌شود؛ برای fallback بدون AI می‌توان مقادیر provider را خالی گذاشت.

فرمان‌های جداگانه نیز موجودند:

```bash
npm run db:migrate:local
npm run dev:worker
npm run dev:next
```

## API

| مسیر | روش | نتیجه |
| --- | --- | --- |
| `/api/health` | `GET` | readiness واقعی DB، migration و تنظیمات ضروری؛ `200` آماده و `503` ناآماده |
| `/api/sales/chat` | `POST` | قرارداد عمومی فقط شامل `conversationId`، `locale` و `message` |
| `/api/meta/webhook` | `GET` | handshake تأیید Meta |
| `/api/meta/webhook` | `POST` | دریافت امضاشده پیام Instagram و پردازش background |

## کیفیت و build

```bash
npm run lint
npm test
npm run build
npx wrangler deploy --dry-run
```

`npm run build` خروجی استاتیک را در `dist/client/`، Worker را در `dist/server/` و همه migrationها و متادیتای Sites را در `dist/.openai/` می‌سازد. Worker دیگر Schema را هنگام request اجرا نمی‌کند؛ migrationها باید پیش از انتشار با Wrangler اعمال شوند.

## Production

قبل از deploy باید:

1. D1 production ساخته شود و UUID واقعی آن جای placeholder موجود در `wrangler.jsonc` قرار گیرد.
2. `npm run build` با `NEXT_PUBLIC_SITE_URL=https://sosho-studio.net` اجرا شود.
3. `npx wrangler d1 migrations apply DB --remote` اجرا شود.
4. Secretهای Worker در Cloudflare Secret Manager ثبت شوند.
5. readiness endpoint بعد از انتشار `200` برگرداند.

`npm run deploy` محیط production و دامنه‌های زنده را هدف می‌گیرد و فقط با تأیید صریح باید اجرا شود. workflow استقرار در ریشه Repository قرار دارد و فقط با `workflow_dispatch` اجرا می‌شود؛ CI روی push و pull request فقط lint، test، build و dry-run را انجام می‌دهد.

## Staging

محیط staging از Worker با نام `sosho-site-staging`، دیتابیس `sosho-sales-staging` و فایل `wrangler.staging.jsonc` استفاده می‌کند. این config هیچ route یا دامنه Production ندارد و فقط روی `workers.dev` منتشر می‌شود. شناسه واقعی D1 و origin نهایی staging پس از ساخت resource جایگزین placeholderهای config می‌شوند.

```bash
npx wrangler d1 create sosho-sales-staging
npm run db:migrate:staging
npm run deploy:staging
```

Secretهای staging باید تعاملی و با `--config wrangler.staging.jsonc` ثبت شوند و نباید در فایل یا command history قرار بگیرند.

فهرست کامل تنظیمات، retention و مراحل Meta در [docs/AI_SALES_SETUP.md](./docs/AI_SALES_SETUP.md) است. قراردادهای دائمی توسعه نیز در [AGENTS.md](./AGENTS.md) ثبت شده‌اند.
