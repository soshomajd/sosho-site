# راه‌اندازی Production هسته فروش SoSho Studio

این سند تنظیم فعلی چت سایت، تولید محتوای Workers AI، OpenAI Responses API، Cloudflare Workers/D1 و Instagram Messaging را توضیح می‌دهد. مقدار واقعی Secretها نباید داخل فایل، Git، log یا screenshot قرار گیرد.

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

Content Campaign
  -> Cloudflare Workers AI binding
  -> Qwen primary model, then at most one Llama fallback
  -> JSON Schema output + local content/policy validation
  -> D1 persistence + optional Telegram preview
  -> admin approval
  -> FLUX main-image generation + Base64/binary validation
  -> private ArvanCloud object + D1 media metadata (no public URL)
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
- `content_campaigns` و `content_items`: درخواست Campaign و آخرین Content Bundle معتبر
- `content_media`: claim یکتا برای تصویر اصلی، کلید ArvanCloud، MIME، اندازه، provider/model، وضعیت ذخیره و `superseded_at` (وقتی regenerate متن تصویر ذخیره‌شده را منسوخ می‌کند)
- `campaign_action_audit`: کلید idempotency و audit امن action، Campaign، actor و outcome برای Dashboard و Telegram
- `conversation_action_audit`: audit امن transition، actor، timestamp و outcome برای درخواست Human Handoff و Take over
- `telegram_updates` و `telegram_notifications`: deduplication callback و اعلان

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

Secretهای production:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ADMIN_API_TOKEN
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
npx wrangler secret put TELEGRAM_ADMIN_USER_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler secret put META_VERIFY_TOKEN
npx wrangler secret put META_APP_SECRET
npx wrangler secret put META_INSTAGRAM_ACCESS_TOKEN
npx wrangler secret put RATE_LIMIT_SALT
```

`OPENAI_API_KEY` برای پاسخ مدل در Sales Chat و provider اختیاری OpenAI استفاده می‌شود. provider پیش‌فرض تولید محتوا Workers AI است و API key جداگانه‌ای نیاز ندارد. بدون OpenAI، Sales Chat از fallback قطعی موجود استفاده می‌کند.

`RATE_LIMIT_SALT` باید مقدار تصادفی قوی و جدا از سایر Secretها باشد و برای hash کردن IP و Instagram user در کلیدهای rate limit استفاده می‌شود. تغییر آن شمارنده‌های فعال را عملاً reset می‌کند.

Dashboard در مسیر `/admin` از همان `ADMIN_API_TOKEN` استفاده می‌کند. Token تنها در body درخواست ورود هم‌مبدأ دریافت می‌شود و در URL، bundle، log یا Local Storage قرار نمی‌گیرد. Worker پس از مقایسه constant-time یک نشست امضاشده هشت‌ساعته با cookieهای `HttpOnly`، `SameSite=Strict` و `Secure` در HTTPS صادر می‌کند. GETها محدود و صفحه‌بندی‌شده هستند؛ عملیات Approve، Reject، Regenerate و Take over فقط با Session معتبر، Origin مجاز، JSON، CSRF وابسته به Session و UUID idempotency اجرا و audit می‌شوند. Telegram و Dashboard برای Campaign از transition service مشترک استفاده می‌کنند. Human Handoff نیز با stateهای `ai_active`، `handoff_requested`، `human_active` و `resolved` ذخیره می‌شود؛ فعلاً فقط درخواست Handoff و Take over فعال‌اند و در دو state انسانی AI پاسخ تولید نمی‌کند. جزئیات تماس کامل Lead بازگردانده نمی‌شود و preview پیام‌ها ایمیل و شماره تماس را پنهان می‌کند.

برای staging از Worker و D1 مستقل تعریف‌شده در `wrangler.staging.jsonc` استفاده می‌شود. این config فقط `workers.dev` را فعال می‌کند و هیچ route مربوط به دامنه Production ندارد. Secretهای staging باید با گزینه `--config wrangler.staging.jsonc` ثبت شوند تا به Worker Production متصل نشوند.

برای local، از `.dev.vars.example` یک `.dev.vars` بسازید. فایل واقعی commit نمی‌شود.

## تنظیمات غیرمحرمانه

مقادیر پیش‌فرض production در `wrangler.jsonc` قرار دارند:

| متغیر | پیش‌فرض | کاربرد |
| --- | ---: | --- |
| `CONTENT_AI_PROVIDER` | `workers_ai` | provider پیش‌فرض تولید محتوا؛ مقدار `openai` فقط برای انتخاب صریح provider قدیمی |
| `WORKERS_AI_CONTENT_MODEL` | `@cf/qwen/qwen3-30b-a3b-fp8` | مدل اصلی تولید Content Bundle |
| `WORKERS_AI_FALLBACK_MODEL` | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | fallback حداکثر یک‌باره برای timeout، خطای موقت یا خروجی نامعتبر |
| `IMAGE_AI_PROVIDER` | `workers_ai` | provider پیش‌فرض تولید تصویر |
| `WORKERS_AI_IMAGE_MODEL` | `@cf/black-forest-labs/flux-1-schnell` | مدل تصویر اصلی Campaign تأییدشده |
| `IMAGE_AI_TIMEOUT_MS` | `60000` | timeout محدود فراخوانی مدل تصویر |
| `IMAGE_MAX_BYTES` | `5000000` | سقف binary پذیرفته‌شده پیش از ذخیره در ArvanCloud |
| `OPENAI_MODEL` | `gpt-5.6-luna` | مدل Responses API |
| `ADMIN_API_TOKEN` | Secret | Bearer token مستقل برای APIهای مدیریت محتوا؛ در Frontend قرار نگیرد |
| `CONTENT_OPENAI_MAX_OUTPUT_TOKENS` | `6000` | سقف خروجی Content Bundle |
| `TELEGRAM_BOT_TOKEN` | Secret | Token ربات؛ هرگز در Frontend یا log قرار نگیرد |
| `TELEGRAM_ADMIN_CHAT_ID` / `TELEGRAM_ADMIN_USER_ID` | Secret | تنها Chat و User مجاز برای Callbackهای مدیریتی |
| `TELEGRAM_WEBHOOK_SECRET` | Secret | مقدار هدر `X-Telegram-Bot-Api-Secret-Token` |
| `TELEGRAM_TIMEOUT_MS` / `TELEGRAM_MAX_ATTEMPTS` | `5000` / `3` | timeout و retry محدود Telegram |

Telegram اختیاری است. اگر هرکدام از تنظیمات آن موجود نباشد، Content Generation، Sales Chat و Instagram بدون ارسال اعلان به کار خود ادامه می‌دهند. پس از ثبت webhook واقعی، مسیر callback باید `/api/webhooks/telegram` و allowed update آن `callback_query` باشد.

Cloudflare R2 روی این اکانت قابل فعال‌سازی نیست (فعال‌سازی R2 در Dashboard به کارت معتبر نیاز دارد و رد می‌شود)، پس رسانه‌ی خصوصی Campaign در **ArvanCloud Object Storage** (S3-compatible) ذخیره می‌شود؛ آداپتورش `worker/arvan-storage.js` است و درخواست‌ها را با `aws4fetch` امضا می‌کند. چهار متغیر `ARVAN_S3_ACCESS_KEY`/`ARVAN_S3_SECRET_KEY` (Secret) و `ARVAN_S3_ENDPOINT`/`ARVAN_S3_BUCKET` (غیر-Secret، در `vars`) برای production لازم‌اند. در staging تا زمان فعال‌سازی، این چهار متغیر عمداً حذف می‌مانند تا Dashboard و قابلیت‌های غیررسانه‌ای deploy شوند و وضعیت `activation_required` را گزارش کنند. نام Bucketهای برنامه‌ریزی‌شده `sosho-media` و `sosho-media-staging` است، اما باید فقط بعد از مجوز صریح ساخته و متصل شوند. API تصویر URL عمومی یا signed URL برنمی‌گرداند؛ adapter خواندن خصوصی آماده است و `telegram_preview_status` تا smoke test واقعی ArvanCloud/Telegram روی `blocked` می‌ماند.
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

`GET /api/health` فقط booleanها و نام تنظیمات مفقود را برمی‌گرداند؛ هیچ مقدار Secret افشا نمی‌شود. نبود D1، migrationهای لازم، provider انتخاب‌شده محتوا، Binding `AI`، متغیرهای `ARVAN_S3_*` (به‌جز روی staging که عمداً مستثنا شده)، salt یا تنظیمات کامل Meta پاسخ `503` می‌دهد. OpenAI برای provider پیش‌فرض محتوا و تصویر اجباری نیست.

قبل از deploy:

```bash
npm run lint
npm test
NEXT_PUBLIC_SITE_URL=https://sosho-studio.net npm run build
npx wrangler deploy --dry-run
```

بعد از ساخت مجاز Bucket ArvanCloud، apply migration و deploy مجاز، health، یک Campaign تأییدشده و تصویر واقعی، ذخیره ArvanCloud/D1، یک چت website، handshake، signature نامعتبر، event واقعی و retry شکست‌خورده باید در محیط هدف smoke-test شوند.

## محدودیت تجاری فعلی

مدل فقط tier اقتصادی، حرفه‌ای یا اختصاصی را پیشنهاد می‌کند. خروجی JSON بعد از دریافت دوباره validate می‌شود و هر reply دارای قیمت دقیق، زمان تحویل قطعی یا تضمین ساختگی رد و با fallback جایگزین می‌شود. موتور deterministic pricing هنوز وجود ندارد؛ هیچ مبلغ مدل‌ساخته‌شده‌ای authoritative نیست.
