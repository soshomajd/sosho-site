# راه‌اندازی Production هسته فروش SoSho Studio

این سند تنظیم فعلی چت سایت، OpenAI Responses API، Cloudflare Workers/D1 و Instagram Messaging را توضیح می‌دهد. مقدار واقعی Secretها نباید داخل فایل، Git، log یا screenshot قرار گیرد.

## جریان‌ها

```text
Website
  -> POST /api/sales/chat
  -> strict input validation + origin check
  -> IP/conversation rate limit in D1
  -> durable conversation/history
  -> OpenAI Responses API or deterministic fallback
  -> output schema + business-policy validation
  -> lead/message persistence

Instagram
  -> Meta HMAC verification
  -> webhook event: received -> processing -> processed | failed
  -> Instagram-user rate limit
  -> shared sales pipeline
  -> Meta send with timeout/backoff
  -> cron retry for transient failures
```

تمام پاسخ‌های JSON API دارای `requestId` و header متناظر `x-request-id` هستند. logهای JSON فقط اطلاعات عملیاتی امن را ثبت می‌کنند و شامل متن پیام، شناسه Instagram، شماره تماس، prompt یا Secret نیستند.

## D1 و migration

فایل‌های مرتب‌شده `db/migrations/*.sql` تنها source of truth دیتابیس‌اند. `db/schema.ts` فقط type mirror است و Schema ایجاد نمی‌کند. Worker هنگام request هیچ DDL اجرا نمی‌کند.

جدول‌ها:

- `leads`: منبع، locale، مرحله qualification، نیازمندی و تاریخ انقضای PII
- `conversations`: ارتباط lead و channel و وضعیت active/closed
- `messages`: تاریخچه، metadata، retention و external event ID یکتای Instagram
- `webhook_events`: state machine، attempt، retry، پاسخ ذخیره‌شده و retention payload
- `rate_limit_counters`: شمارنده‌های atomic ساعتی/روزانه با تاریخ انقضا

راه‌اندازی production:

```bash
npx wrangler d1 create sosho-sales
# UUID خروجی را در database_id فایل wrangler.jsonc قرار دهید.
npx wrangler d1 migrations apply DB --remote
```

راه‌اندازی local توسط `npm run dev` خودکار است؛ اجرای دستی:

```bash
npm run db:migrate:local
```

هر migration جدید باید افزایشی باشد. migration اعمال‌شده را بازنویسی نکنید؛ فایل شماره‌دار جدید بسازید.

## Secretها

Secretهای الزامی production:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put META_VERIFY_TOKEN
npx wrangler secret put META_APP_SECRET
npx wrangler secret put META_INSTAGRAM_ACCESS_TOKEN
npx wrangler secret put RATE_LIMIT_SALT
```

`RATE_LIMIT_SALT` باید مقدار تصادفی قوی و جدا از سایر Secretها باشد و برای hash کردن IP و Instagram user در کلیدهای rate limit استفاده می‌شود. تغییر آن شمارنده‌های فعال را عملاً reset می‌کند.

برای staging از Worker و D1 مستقل تعریف‌شده در `wrangler.staging.jsonc` استفاده می‌شود. این config فقط `workers.dev` را فعال می‌کند و هیچ route مربوط به دامنه Production ندارد. Secretهای staging باید با گزینه `--config wrangler.staging.jsonc` ثبت شوند تا به Worker Production متصل نشوند.

برای local، از `.dev.vars.example` یک `.dev.vars` بسازید. فایل واقعی commit نمی‌شود.

## تنظیمات غیرمحرمانه

مقادیر پیش‌فرض production در `wrangler.jsonc` قرار دارند:

| متغیر | پیش‌فرض | کاربرد |
| --- | ---: | --- |
| `OPENAI_MODEL` | `gpt-5.6-luna` | مدل Responses API |
| `META_GRAPH_VERSION` | `v26.0` | نسخه Graph API |
| `CHAT_IP_HOURLY_LIMIT` | `60` | سقف چت سایت برای IP در ساعت |
| `CHAT_CONVERSATION_HOURLY_LIMIT` | `30` | سقف هر conversation در ساعت |
| `INSTAGRAM_USER_HOURLY_LIMIT` | `30` | سقف هر Instagram user در ساعت |
| `OPENAI_HOURLY_LIMIT` | `100` | سقف عمومی attemptهای OpenAI در ساعت |
| `OPENAI_DAILY_LIMIT` | `500` | سقف عمومی attemptهای OpenAI در روز |
| `OPENAI_TIMEOUT_MS` / `META_TIMEOUT_MS` | `8000` | timeout هر attempt |
| `OPENAI_MAX_ATTEMPTS` / `META_MAX_ATTEMPTS` | `3` | تعداد attempt با backoff |
| `WEBHOOK_MAX_ATTEMPTS` | `8` | سقف پردازش durable event |
| `WEBHOOK_RETRY_BASE_SECONDS` | `60` | پایه backoff پردازش webhook |

هر attempt واقعی OpenAI از سهمیه ساعتی و روزانه کم می‌شود. اگر provider ناموجود، timeout یا quota تمام شود، سیستم پاسخ ثابت دوزبانه می‌دهد و lead را نگه می‌دارد.

## Instagram / Meta

Callback URL:

```text
https://sosho-studio.net/api/meta/webhook
```

در Meta App باید Instagram Messaging/Webhooks فعال، callback با `META_VERIFY_TOKEN` تأیید و eventهای پیام لازم subscribe شوند. Worker قبل از parse کردن payload، header `X-Hub-Signature-256` را با `META_APP_SECRET` بررسی می‌کند.

`external_event_id` در `webhook_events` یکتا است. event در حالت `received` ثبت و به‌صورت atomic به `processing` claim می‌شود. failure موقت با زمان retry در حالت `failed` می‌ماند و cron پنج‌دقیقه‌ای دوباره آن را claim می‌کند. پاسخ AI و messageهای مربوط به event ذخیره و یکتا می‌شوند؛ بنابراین شکست ارسال Meta باعث تولید دوباره turn یا گم‌شدن دائمی پیام نمی‌شود. خطاهای غیرقابل retry در `failed` بدون `next_retry_at` باقی می‌مانند و باید عملیاتی بررسی شوند.

## Retention

cron روزانه سیاست پیش‌فرض زیر را اجرا می‌کند:

- messageها: حذف پس از `180` روز
- PII lead: حذف `instagram_user_id` و null کردن business/contact name، phone و preferred channel پس از `365` روز
- payload خام Meta و response cache: پاک‌سازی پس از `7` روز
- رکورد webhook: حذف پس از `90` روز
- counterهای منقضی rate limit: حذف خودکار

مقادیر با `MESSAGE_RETENTION_DAYS`، `LEAD_PII_RETENTION_DAYS`، `WEBHOOK_PAYLOAD_RETENTION_DAYS` و `WEBHOOK_EVENT_RETENTION_DAYS` قابل تنظیم‌اند. تغییر سیاست باید با الزامات حقوقی و consent کسب‌وکار بررسی شود.

## Readiness و بررسی انتشار

`GET /api/health` فقط booleanها و نام تنظیمات مفقود را برمی‌گرداند؛ هیچ مقدار Secret افشا نمی‌شود. نبود D1، migrationهای لازم، OpenAI، salt یا تنظیمات کامل Meta پاسخ `503` می‌دهد.

قبل از deploy:

```bash
npm run lint
npm test
NEXT_PUBLIC_SITE_URL=https://sosho-studio.net npm run build
npx wrangler deploy --dry-run
```

بعد از apply migration و deploy مجاز، health، یک چت website، handshake، signature نامعتبر، event واقعی و retry شکست‌خورده باید در محیط هدف smoke-test شوند.

## محدودیت تجاری فعلی

مدل فقط tier اقتصادی، حرفه‌ای یا اختصاصی را پیشنهاد می‌کند. خروجی JSON بعد از دریافت دوباره validate می‌شود و هر reply دارای قیمت دقیق، زمان تحویل قطعی یا تضمین ساختگی رد و با fallback جایگزین می‌شود. موتور deterministic pricing هنوز وجود ندارد؛ هیچ مبلغ مدل‌ساخته‌شده‌ای authoritative نیست.
