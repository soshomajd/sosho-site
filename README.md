# SoSho Studio AI Sales

وب‌سایت دوزبانه SoSho Studio به‌همراه هسته فروش خودکار برای چت سایت و Instagram است. Frontend با Next.js به‌صورت استاتیک export می‌شود و API، D1، OpenAI و Meta در Cloudflare Worker اجرا می‌شوند.

> اپلیکیشن فعال مستقیماً در ریشه همین Repository است. نسخه قدیمی حذف شده و نباید بازیابی شود. همه فرمان‌های npm از همین ریشه اجرا می‌شوند.

## قابلیت‌ها

نمونه‌کارها اکنون با ۳۹ تصویر هیرو برای دسکتاپ، تبلت و موبایل نمایش داده می‌شوند: پنج مورد اول در خانه و هشت مورد بعدی به همان ترتیب در `/fa/projectcs` و `/en/projectcs`. تصاویر سه سایت واقعی با Playwright پس از بارگذاری تصاویر و فونت‌ها گرفته شده‌اند؛ ده طرح مفهومی، نسخه‌های جداگانهٔ واکنش‌گرا و برچسب مشخص دارند. هیچ لینک یا ادعای مشتری واقعی برای طرح‌های مفهومی اضافه نشده است. [جزئیات تصاویر و مسیر جدید](docs/PROJECT_HERO_VIEWS_2026-10-26.md).

تم فعلی سرمه‌ای/گرافیتی با آبی فولادی، سبز سیج و جزئیات مسی است. هیروی صفحهٔ اصلی سه اسلاید دارد: سهیل، بنیان‌گذار و مدیر فنی؛ Claude، همکار هوش مصنوعی برای بک‌اند و DevOps؛ و Codex، همکار هوش مصنوعی برای فرانت‌اند و طراحی. فلش‌ها و انتخابگر اسلاید، تصویر و نام و نقش زیر آن را با هم عوض می‌کنند؛ جابه‌جایی خودکار ندارد و انتخابگر بومی بدون JavaScript هم کار می‌کند. نوشتهٔ `SOSHO STUDIO` در ردیفی جدا با فاصلهٔ ۲۴ پیکسل بالای اسلایدها قرار دارد. چهرهٔ اصلی سهیل حفظ شده و مردمک‌های هر سه شخصیت با اشاره‌گر دقیق حرکت می‌کنند؛ فقط چشم‌های اسلاید فعال دنبال اشاره‌گر می‌روند و با تعویض اسلاید، خروج اشاره‌گر یا خروج هیرو از دید به مرکز برمی‌گردند. شخصیت‌های AI کارمند انسانی یا نشانهٔ تأیید برندها معرفی نمی‌شوند. گالری متحرک کنترل توقف دارد و هر سه پروژهٔ واقعی و ده طرح مفهومی صفحهٔ اختصاصی دارند؛ طرح‌ها برچسب مشخص و بدون لینک سایت واقعی یا ادعای مشتری هستند. متن‌ها، تصاویر، لینک‌ها و SEO در HTML استاتیک باقی می‌مانند و ترجیح کاهش حرکت رعایت می‌شود. جزئیات پایهٔ موشن در [یادداشت طراحی](docs/HOMEPAGE_MOTION_2026-10-25.md)، ساختار فعلی در [راهنمای عامل‌ها](AGENTS.md) و مرور کد در [گزارش بررسی پروژه](docs/PROJECT_REVIEW_2026-10-29.md) ثبت شده است.

مقاله‌ها در `src/app/blogs/posts.ts` نگهداری می‌شوند. کاورهای فعلی با ImageGen تولید شده‌اند؛ پرامپت‌ها و altهای دوزبانه در `scripts/blog-art-manifest.json` و فایل‌های ۱۲۰۰×۶۳۰ در `public/blog/` هستند. `npm run blog:art` وجود تصاویر را بررسی می‌کند و `npm run blog:art -- --sheet tmp/blog-covers.png` پیش‌نمایش مجموعه را می‌سازد. تولیدکننده قدیمی SVG فقط با `--legacy` اجرا می‌شود. مقاله‌های جدید منابع رسمی دارند که در صفحه و `/llms-full.txt` نمایش داده می‌شوند.

- سایت فارسی/انگلیسی با RTL/LTR، SEO، ۹ خدمت، ۲۹ مقاله و ۵ ابزار رایگان
- برآورد هوشمند پروژه با تعرفهٔ مدیریتی، رضایت برای ذخیرهٔ درخواست و پنل تعرفه‌ها
- فرم پیام بازدیدکننده با مدیریت وضعیت در `/admin/messages`
- API دستیار فروش برای Instagram و ویجت نگه‌داری‌شده با conversation ID امن؛ ویجت فروش روی سایت نصب نیست
- اعتبارسنجی strict ورودی و خروجی، fallback دوزبانه و محدودیت سیاست تجاری
- ثبت lead، conversation و message در Cloudflare D1
- rate limit ساعتی بر مبنای IP، مکالمه و کاربر Instagram
- سهمیه عمومی ساعتی و روزانه قابل تنظیم برای OpenAI
- webhook امضاشده Meta با state machine، deduplication و retry پایدار
- timeout، exponential backoff، request ID و structured logging
- retention خودکار پیام‌ها، PII سرنخ‌ها و payload خام Meta
- تست Worker در Runtime رسمی Cloudflare با Vitest و D1 محلی
- هسته تولید محتوای فارسی با Cloudflare Workers AI، خروجی JSON Schema، fallback تک‌مرحله‌ای و ذخیره در D1
- تولید idempotent تصویر اصلی Campaign تأییدشده با FLUX، اعتبارسنجی binary و ذخیره خصوصی در ArvanCloud Object Storage
- زیرساخت Human Handoff با توقف AI، اعلان یک‌باره Telegram و تحویل اتمیک گفتگو به مدیر
- تأیید محتوای تولیدشده و اعلان‌های مهم فروش از طریق Telegram به‌صورت اختیاری
- داشبورد مدیریتی فارسی با نشست HttpOnly، داده‌های واقعی D1 و عملیات ثبت‌شده تأیید، رد و تولید دوباره متن

بخش معرفی استودیو یک تصویر سه‌بعدی تمام‌عرض با نسخهٔ کم‌حجم موبایل دارد. انیمیشن نمایان‌شدن قاب، زوم ملایم و عبور نور در همان لایهٔ کوچک موشن اجرا می‌شود و با ترجیح کاهش حرکت غیرفعال است. پرامپت و ابعاد در `scripts/about-art-manifest.json` ثبت شده‌اند؛ [یادداشت تصویر معرفی](docs/ABOUT_VISUAL_2026-10-26.md) جزئیات پیاده‌سازی و بررسی‌ها را نگه می‌دارد.

## ساختار اصلی

```text
.
|- src/                              Next.js App Router و رابط سایت
|- worker/
|  |- index.js                      Worker، API، D1، OpenAI و Instagram
|  |- admin-dashboard.js            نشست امن Admin و queryهای محدود و فقط خواندنی
|  |- campaign-actions.js           transition مشترک Dashboard/Telegram، idempotency و audit
|  |- conversation-actions.js       transition اتمیک Handoff/Take over و audit
|  |- content-generation.js         Schema، validation و انتخاب provider محتوا
|  |- workers-ai-content-provider.js provider اصلی و fallback مدل‌های Workers AI
|  |- image-generation.js           prompt و اعتبارسنجی تصویر
|  |- arvan-storage.js              adapter خصوصی ArvanCloud (S3-compatible) به‌جای R2
|  |- workers-ai-image-provider.js  provider تصویر FLUX در Workers AI
|  |- telegram-service.js           transport امن Telegram
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

`npm run dev` ابتدا migrationهای D1 محلی را اجرا می‌کند، Worker را روی `127.0.0.1:8787` و Next.js را روی `localhost:3000` بالا می‌آورد و درخواست‌های `/api/*` را به Worker proxy می‌کند. فایل `.dev.vars` در Git نادیده گرفته می‌شود. تولید متن به‌صورت پیش‌فرض از Binding استاندارد `AI` و Workers AI استفاده می‌کند؛ تولید تصویر علاوه‌بر `AI` به چهار متغیر `ARVAN_S3_ACCESS_KEY`، `ARVAN_S3_SECRET_KEY`، `ARVAN_S3_ENDPOINT` و `ARVAN_S3_BUCKET` در `.dev.vars` نیاز دارد (Cloudflare R2 روی این اکانت قابل فعال‌سازی نیست و به‌جایش از ArvanCloud Object Storage استفاده می‌شود)؛ بدون آن‌ها فقط تولید تصویر `configuration_missing` می‌دهد. OpenAI همچنان برای Sales Chat و provider اختیاری متن موجود است.

نکته: نخستین اجرای `npm run dev` به احراز هویت Cloudflare نیاز دارد، چون Binding `AI` در حالت توسعه نیز به Cloudflare متصل می‌شود؛ یک‌بار `npx wrangler login` را اجرا کنید (در محیط غیرتعاملی به‌جای آن `CLOUDFLARE_API_TOKEN` تنظیم شود).

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
| `/api/sales/status` | `GET` | `{ "available": boolean }` عمومی؛ انتخاب Provider با `SALES_AI_PROVIDER` و تنظیمات OpenAI یا بایندینگ `AI` است. ویجت فروش فعلاً در سایت mount نمی‌شود |
| `/api/sales/chat` | `POST` | قرارداد عمومی فقط شامل `conversationId`، `locale` و `message` |
| `/api/contact` | `POST` | ثبت پیام بازدیدکننده با اعتبارسنجی strict، honeypot و rate limit؛ نیازمند D1 |
| `/api/tools/audit` | `POST` | بررسی محدود صفحه، robots و sitemap با محافظ SSRF؛ بدون ذخیرهٔ داده |
| `/api/consultant/config` | `GET` | پرسش‌ها و وضعیت تنظیم تعرفه؛ بدون نمایش نرخ‌های داخلی |
| `/api/consultant/interpret` | `POST` | تفسیر متن آزاد با AI و fallback؛ بدون تولید قیمت توسط مدل |
| `/api/consultant/estimate` | `POST` | برآورد قطعی دو سطح فقط از تعرفه؛ ذخیرهٔ درخواست فقط با رضایت |
| `/api/consultant/requests/:id` | `POST` | انتخاب سطح یا ثبت اطلاعات تماس با update token و رضایت |
| `/api/meta/webhook` | `GET` | handshake تأیید Meta |
| `/api/meta/webhook` | `POST` | دریافت امضاشده پیام Instagram و پردازش background |
| `/api/content/campaigns` | `POST` | ایجاد Campaign فارسی با احراز هویت Admin |
| `/api/content/campaigns/:id/generate` | `POST` | تولید و اعتبارسنجی Content Bundle |
| `/api/content/campaigns/:id/generate-image` | `POST` | تولید idempotent تصویر اصلی فقط برای Campaign تأییدشده و ذخیره خصوصی در ArvanCloud Object Storage |
| `/api/content/campaigns/:id` | `GET` | دریافت Campaign و آخرین Bundle معتبر |
| `/api/webhooks/telegram` | `POST` | دریافت امن و تکرارناپذیر Callbackهای مدیر Telegram |
| `/api/admin/session` | `POST/GET/DELETE` | ایجاد، بررسی و پایان نشست کوتاه‌مدت HttpOnly با توکن فعلی Admin |
| `/api/admin/overview` | `GET` | آمار واقعی و فعالیت‌های اخیر سیستم |
| `/api/admin/campaigns` | `GET` | فهرست فیلترشده و صفحه‌بندی‌شده Campaignها |
| `/api/admin/campaigns/:id` | `GET` | جزئیات کامل و امن Campaign، Content Bundle، provenance و وضعیت رسانه |
| `/api/admin/conversations/:id/take-over` | `POST` | تحویل اتمیک Conversation نیازمند رسیدگی به مدیر با Session، CSRF و idempotency |
| `/api/admin/campaigns/:id/approve` | `POST` | تأیید idempotent با Admin Session و CSRF |
| `/api/admin/campaigns/:id/reject` | `POST` | رد idempotent با دلیل کوتاه اجباری، Admin Session و CSRF |
| `/api/admin/campaigns/:id/regenerate` | `POST` | تولید دوباره متن با جلوگیری از اجرای هم‌زمان |
| `/api/admin/leads` | `GET` | فهرست امن و حداقلی Leadها بدون اطلاعات تماس کامل |
| `/api/admin/conversations` | `GET` | فهرست گفتگوها و وضعیت AI/Handoff |
| `/api/admin/conversations/:id` | `GET` | جزئیات محدود گفتگو با پنهان‌سازی ایمیل و شماره تماس |
| `/api/admin/contact-messages` | `GET` | فهرست پیام‌های بازدیدکنندگان پشت نشست مدیر |
| `/api/admin/contact-messages/:id` | `POST` | تغییر وضعیت پیام با نشست، Origin و CSRF |
| `/api/admin/consultant/requests[/:id]` | `GET` | فهرست و جزئیات درخواست‌های برآورد |
| `/api/admin/consultant/requests/:id` | `POST` | تغییر وضعیت درخواست با نشست و CSRF |
| `/api/admin/consultant/tariffs` | `GET/PUT` | خواندن تعرفه و ذخیرهٔ نسخهٔ جدید؛ نوشتن با نشست و CSRF |
| `/api/admin/consultant/telegram-test` | `POST` | تست اتصال Telegram از پنل مدیر |

مسیر `/admin` داشبورد فارسی و RTL را نمایش می‌دهد. `ADMIN_API_TOKEN` فقط هنگام ورود و در body درخواست هم‌مبدأ ارسال می‌شود، در bundle، URL یا Local Storage قرار نمی‌گیرد و پس از اعتبارسنجی با یک cookie امضاشده `HttpOnly`، `SameSite=Strict` و کوتاه‌مدت جایگزین می‌شود. Queryهای فهرست فقط خواندنی و حداکثر ۵۰ رکوردی هستند؛ عملیات Campaign و Take over فقط با Session، Origin مجاز، JSON، CSRF وابسته به Session و idempotency key اجرا می‌شوند و نتیجه در D1 audit می‌شود. Conversationهای `handoff_requested` و `human_active` پیام ورودی را ذخیره می‌کنند اما AI را فراخوانی نمی‌کنند.

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

1. D1 production ساخته شود و UUID واقعی آن جای placeholder موجود در `wrangler.jsonc` قرار گیرد. (انجام شد: دیتابیس `sosho-sales` ساخته شده و UUID‌اش در `wrangler.jsonc` ثبت است.)
2. `npm run build` با `NEXT_PUBLIC_SITE_URL=https://sosho-studio.net` اجرا شود.
3. `npx wrangler d1 migrations apply DB --remote` اجرا شود.
4. چون Cloudflare R2 روی این اکانت قابل فعال‌سازی نیست (کارت رد می‌شود)، رسانه در ArvanCloud Object Storage ذخیره می‌شود: یک Bucket خصوصی بساز و مقدار واقعی `ARVAN_S3_ENDPOINT` را جای placeholder توی `wrangler.jsonc` بگذار، و `ARVAN_S3_ACCESS_KEY`/`ARVAN_S3_SECRET_KEY` را به‌عنوان Secret ثبت کن.
5. Secretهای دیگر Worker در Cloudflare Secret Manager ثبت شوند.
6. readiness endpoint بعد از انتشار `200` برگرداند.

`npm run deploy` محیط production و دامنه‌های زنده را هدف می‌گیرد و فقط با تأیید صریح باید اجرا شود. workflow استقرار در ریشه Repository قرار دارد و فقط با `workflow_dispatch` اجرا می‌شود؛ CI روی push و pull request فقط lint، test، build و dry-run را انجام می‌دهد.

## Staging

محیط staging از Worker با نام `sosho-site-staging`، دیتابیس `sosho-sales-staging` و فایل `wrangler.staging.jsonc` استفاده می‌کند. این config هیچ route یا دامنه Production ندارد و فقط روی `workers.dev` منتشر می‌شود. تا زمان فعال‌سازی ArvanCloud برای staging، متغیرهای `ARVAN_S3_*` عمداً در config staging وجود ندارند تا قابلیت‌های متن، فروش، Telegram و Dashboard بدون اختلال کار کنند و Dashboard وضعیت «فعال‌سازی رسانه لازم است» را نشان دهد. برای تست واقعی تصویر، یک Bucket خصوصی جدا در ArvanCloud برای staging بساز و چهار متغیر `ARVAN_S3_*` را فقط به config staging اضافه کن؛ Repository هیچ Bucket را خودکار نمی‌سازد.

```bash
npx wrangler d1 create sosho-sales-staging
npm run db:migrate:staging
npm run deploy:staging
```

Secretهای staging باید تعاملی و با `--config wrangler.staging.jsonc` ثبت شوند و نباید در فایل یا command history قرار بگیرند.

تنظیمات فروش، retention و مراحل Meta در [راهنمای راه‌اندازی](./docs/AI_SALES_SETUP.md) و قرارداد برآورد در [راهنمای برآورد پروژه](./docs/PROJECT_CONSULTANT.md) است. مرجع دائمی توسعه [AGENTS.md](./AGENTS.md)، راهنمای کوتاه Claude Code در [CLAUDE.md](./CLAUDE.md) و یافته‌ها و محدودیت‌های بررسی محلی در [گزارش ۲۰۲۶/۱۰/۲۹](./docs/PROJECT_REVIEW_2026-10-29.md) ثبت شده‌اند. وضعیت Production در این مرور دوباره بررسی نشده است.
