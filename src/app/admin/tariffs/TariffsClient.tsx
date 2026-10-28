"use client";

import { useState } from "react";

import { useAdminSession } from "../admin-session";
import { ErrorState, LoadingState, PageHeading, formatDate, useAdminResource } from "../admin-ui";
import { adminPost } from "../consultant/shared";

type TariffsResponse = {
  active: { version: number; note: string | null; createdAt: string; config: unknown } | null;
  template: unknown;
  history: Array<{ version: number; note: string | null; createdAt: string }>;
};

const HELP: Array<[string, string]> = [
  ["currency", "واحد پول؛ code سه تا هشت حرف بزرگ (مثل IRT) و برچسب فارسی/انگلیسی."],
  ["roundTo", "قیمت‌ها به مضرب این عدد گرد می‌شوند (مثلاً ۱۰۰۰۰۰۰)."],
  ["hourlyRate", "نرخ ترکیبی یک ساعت کار تیم."],
  ["architectures", "برای wordpress، woocommerce، custom و mobile: ساعت پایه، ساعت هر صفحه ثابت (در mobile: هر صفحه اپ)، هر قالب پویا، هر ۱۰۰ آیتم (محصول/دوره)، هر بخش یا نقش پلتفرم، و ضریب ساعت امکانات. mobile برای اپ اندروید و iOS با React Native است."],
  ["features", "برای هر امکان: ساعت کار، هزینه یک‌باره (مثل لایسنس) و هزینه ماهانه (مثل پیامک یا سرویس AI). امکانی که اینجا نباشد در برآورد «بدون تعرفه» علامت می‌خورد."],
  ["design", "ضریب سطح طراحی: minimal، modern، modern_plus، luxury، creative_motion، interactive_3d."],
  ["multilingualFactor / content", "ضریب چندزبانه، و ضریب آماده بودن محتوا (ready، partial، none، unknown)."],
  ["qaShare / designShare", "سهم تست، استقرار و آموزش از ساعت ساخت، و سهم طراحی از کل ساعت‌ها (برای زمان‌بندی)."],
  ["uncertainty", "پهنای بازه بر اساس اطمینان برآورد (high، medium، low)؛ مثلاً ۰٫۱۵ یعنی ±۱۵٪."],
  ["recurring", "هاست ماهانه برای هر معماری، دامنه سالانه و پشتیبانی ماهانه (اختیاری)."],
  ["team", "ساعت کار روزانه، روزهای کاری هفته، تعداد توسعه‌دهنده موازی، روزهای شناخت، دورهای بازخورد هر نسخه، روزهای هر دور و ضریب احتیاط زمان."],
  ["budgetBands", "بازه‌های بودجه‌ای که به مشتری نشان داده می‌شود (id، برچسب، min و max)."],
];

export default function TariffsClient() {
  const { csrfToken } = useAdminSession();
  const resource = useAdminResource<TariffsResponse>("/api/admin/consultant/tariffs");
  const [draft, setDraft] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const initial = resource.data ? JSON.stringify(resource.data.active?.config ?? resource.data.template, null, 2) : "";
  const text = draft ?? initial;

  async function save() {
    if (!csrfToken) return;
    setIssues([]);
    setStatus(null);
    let config: unknown;
    try {
      config = JSON.parse(text);
    } catch {
      setStatus({ tone: "error", text: "متن JSON معتبر نیست؛ ویرگول‌ها و کوتیشن‌ها را بررسی کنید." });
      return;
    }
    setPending(true);
    const result = await adminPost("/api/admin/consultant/tariffs", csrfToken, { config, note: note.trim() || null }, "PUT").catch(() => null);
    setPending(false);
    if (result?.status === 201) {
      setStatus({ tone: "ok", text: `تعرفه نسخه ${Number(result.data?.version).toLocaleString("fa-IR")} ذخیره شد و از همین حالا در برآوردها استفاده می‌شود.` });
      setDraft(null);
      resource.retry();
    } else if (result?.status === 400 && Array.isArray(result.data?.issues)) {
      setIssues(result.data.issues as string[]);
      setStatus({ tone: "error", text: "تعرفه ذخیره نشد؛ این فیلدها مقدار درست ندارند:" });
    } else setStatus({ tone: "error", text: "ذخیره انجام نشد. دوباره تلاش کنید." });
  }

  async function testTelegram() {
    if (!csrfToken) return;
    setStatus(null);
    const result = await adminPost("/api/admin/consultant/telegram-test", csrfToken, {}).catch(() => null);
    const data = result?.data as { configured?: boolean; sent?: boolean } | null;
    if (!data?.configured) setStatus({ tone: "error", text: "تلگرام تنظیم نشده است (TELEGRAM_BOT_TOKEN و TELEGRAM_ADMIN_CHAT_ID). گزارش‌ها تا زمان تنظیم نگه داشته می‌شوند." });
    else setStatus(data.sent ? { tone: "ok", text: "پیام آزمایشی به تلگرام مدیر فرستاده شد." } : { tone: "error", text: "تلگرام تنظیم شده اما ارسال انجام نشد؛ توکن و Chat ID را بررسی کنید." });
  }

  return (
    <>
      <PageHeading
        title="تعرفه‌های برآورد هوشمند"
        description="همه قیمت‌ها و زمان‌های برآورد فقط از این تعرفه محاسبه می‌شوند. تا وقتی تعرفه معتبری ذخیره نشود، مشتری به‌جای قیمت «نیازمند بررسی کارشناسی» می‌بیند. هر ذخیره یک نسخه جدید می‌سازد و نسخه‌های قبلی در تاریخچه می‌مانند."
      />
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="grid gap-4 lg:col-span-2">
            <p className="rounded-2xl border border-white/10 bg-surface p-4 text-sm text-foreground">
              {resource.data.active
                ? `نسخه فعال: ${resource.data.active.version.toLocaleString("fa-IR")} · ${formatDate(resource.data.active.createdAt)}${resource.data.active.note ? ` · ${resource.data.active.note}` : ""}`
                : "هنوز تعرفه‌ای ثبت نشده است. قالب خالی زیر را با اعداد واقعی پر کنید (هیچ عددی از پیش گذاشته نشده است)."}
            </p>
            <label htmlFor="tariff-json" className="text-sm text-muted">
              تعرفه (JSON)
              <textarea
                id="tariff-json"
                dir="ltr"
                spellCheck={false}
                value={text}
                onChange={(event) => setDraft(event.target.value)}
                rows={28}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/30 p-4 font-mono text-xs leading-6 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </label>
            <label htmlFor="tariff-note" className="text-sm text-muted">
              یادداشت این نسخه (اختیاری)
              <input id="tariff-note" value={note} maxLength={200} onChange={(event) => setNote(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-surface px-3 py-2.5 text-foreground outline-none focus:border-accent" />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!csrfToken || pending} onClick={() => void save()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40">
                {pending ? "در حال ذخیره…" : "ذخیره نسخه جدید"}
              </button>
              <button type="button" onClick={() => setDraft(JSON.stringify(resource.data?.template, null, 2))} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
                شروع از قالب خالی
              </button>
              <button type="button" disabled={!csrfToken} onClick={() => void testTelegram()} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40">
                تست اتصال تلگرام
              </button>
            </div>
            {status ? (
              <div role={status.tone === "error" ? "alert" : "status"} className={`rounded-2xl border p-4 text-sm ${status.tone === "ok" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/15 text-danger"}`}>
                {status.text}
                {issues.length ? <ul dir="ltr" className="mt-2 list-inside list-disc font-mono text-xs">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : null}
              </div>
            ) : null}
          </div>
          <aside className="grid content-start gap-4">
            <section className="rounded-2xl border border-white/10 bg-surface p-4">
              <h2 className="text-sm font-bold text-white">راهنمای فیلدها</h2>
              <dl className="mt-3 grid gap-3 text-xs leading-6">
                {HELP.map(([key, help]) => (
                  <div key={key}>
                    <dt dir="ltr" className="text-start font-mono text-accent">{key}</dt>
                    <dd className="text-muted">{help}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="rounded-2xl border border-white/10 bg-surface p-4">
              <h2 className="text-sm font-bold text-white">تاریخچه نسخه‌ها</h2>
              {resource.data.history.length ? (
                <ul className="mt-3 grid gap-2 text-xs text-muted">
                  {resource.data.history.map((row) => (
                    <li key={row.version}>نسخه {row.version.toLocaleString("fa-IR")} · {formatDate(row.createdAt)}{row.note ? ` · ${row.note}` : ""}</li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-xs text-muted">هنوز نسخه‌ای ثبت نشده است.</p>}
            </section>
          </aside>
        </div>
      ) : null}
    </>
  );
}
