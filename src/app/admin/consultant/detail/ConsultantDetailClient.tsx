"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

import { useAdminSession } from "../../admin-session";
import { ErrorState, LoadingState, PageHeading, StatusBadge, formatDate, useAdminResource } from "../../admin-ui";
import { STATUS_LABELS, STATUS_TONES, TELEGRAM_LABELS, adminPost, type ConsultantStatus } from "../shared";

type TierScope = { features: Array<{ id: string; label: string }>; templates: string[]; staticPages: number; added: Array<{ id: string; label: string; reason: string }>; deferred: Array<{ id: string; label: string }> };
type TierEstimate = { hours: number; oneTime: { min: number; max: number }; weeks: { min: number; max: number }; monthly: number };

type Detail = {
  item: {
    id: string;
    publicRef: string;
    createdAt: string;
    updatedAt: string;
    status: ConsultantStatus;
    selectedTier: "economic" | "professional" | null;
    contactName: string | null;
    contactValue: string | null;
    contactNotes: string | null;
    contactConsentAt: string | null;
    processingConsentAt: string;
    telegramState: string;
    tariffVersion: number | null;
    answers: Record<string, string | string[] | null>;
    scope: {
      architecture: { id: string | null; reason: string; alternative: { note: string } | null };
      complexity: string;
      confidence: string;
      consultationRecommended: boolean;
      twoTiers: boolean;
      staticPages: string[];
      tiers: { economic: TierScope; professional: TierScope };
      needsReview: string[];
    };
    estimate: null | {
      status: string;
      reason?: string;
      currency?: { label: { fa: string } };
      tiers?: { economic?: TierEstimate; professional?: TierEstimate };
      recurring?: { domainYearly: number; supportMonthly: number | null };
      budgetFit?: string;
      timelineFit?: string;
      missingFeatures?: string[];
    };
    summary: { summary: string; ambiguities: string[]; source: string };
  };
};

const ANSWER_LABELS: Record<string, string> = {
  projectType: "نوع پروژه", projectTypeNote: "توضیح نوع پروژه", goal: "هدف", goalNote: "توضیح هدف", features: "امکانات",
  featuresNote: "امکانات دیگر", size: "ابعاد", style: "سبک طراحی", referenceUrl: "سایت نمونه", styleNote: "توضیح سبک",
  content: "محتوا", budget: "بودجه مشتری", timeframe: "زمان دلخواه", timeframeNote: "توضیح زمان", notes: "یادداشت",
};
const TECH: Record<string, string> = { wordpress: "وردپرس", woocommerce: "ووکامرس", custom: "توسعه اختصاصی", mobile: "اپ موبایل (React Native)" };
const LEVEL: Record<string, string> = { low: "پایین/ساده", medium: "متوسط", high: "بالا" };

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-foreground">{children}</div>
    </section>
  );
}

export default function ConsultantDetailClient() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { csrfToken } = useAdminSession();
  const resource = useAdminResource<Detail>(id ? `/api/admin/consultant/requests/${encodeURIComponent(id)}` : null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: ConsultantStatus) {
    if (!csrfToken || pending) return;
    setPending(true);
    setError(null);
    const result = await adminPost(`/api/admin/consultant/requests/${encodeURIComponent(id)}`, csrfToken, { status }).catch(() => null);
    setPending(false);
    if (!result || result.status !== 200) setError("تغییر وضعیت انجام نشد.");
    else resource.retry();
  }

  if (!id) return <ErrorState message="شناسه درخواست مشخص نیست." retry={() => router.push("/admin/consultant")} />;
  if (resource.loading) return <LoadingState />;
  if (resource.error || !resource.data) return <ErrorState message={resource.error ?? "دریافت اطلاعات انجام نشد."} retry={resource.retry} />;
  const item = resource.data.item;
  const currency = item.estimate?.currency?.label.fa ?? "";
  const tierIds = item.scope.twoTiers ? (["economic", "professional"] as const) : (["professional"] as const);

  return (
    <>
      <PageHeading title={`درخواست ${item.publicRef}`} description={`ثبت: ${formatDate(item.createdAt)} · آخرین تغییر: ${formatDate(item.updatedAt)} · تلگرام: ${TELEGRAM_LABELS[item.telegramState] ?? item.telegramState}`} />
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <StatusBadge label={STATUS_LABELS[item.status]} tone={STATUS_TONES[item.status]} />
        {(["in_review", "contacted", "won", "lost", "archived"] as const).filter((status) => status !== item.status).map((status) => (
          <button
            key={status}
            type="button"
            disabled={!csrfToken || pending}
            onClick={() => void setStatus(status)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40"
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
        <Link href="/admin/consultant" className="ms-auto text-sm text-accent hover:underline">بازگشت به فهرست</Link>
      </div>
      {error ? <p role="alert" className="mb-4 rounded-2xl border border-danger/30 bg-danger/20 p-4 text-sm text-danger">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="مشتری">
          <p>نام: {item.contactName ?? "ثبت نشده"}</p>
          <p>تماس: <span dir="ltr">{item.contactValue ?? "ثبت نشده"}</span></p>
          {item.contactNotes ? <p className="whitespace-pre-wrap">توضیحات: {item.contactNotes}</p> : null}
          <p className="text-xs text-muted">رضایت پردازش: {formatDate(item.processingConsentAt)} · رضایت تماس: {formatDate(item.contactConsentAt)}</p>
          <p className="mt-2">نسخه انتخابی: {item.selectedTier === "economic" ? "اقتصادی" : item.selectedTier === "professional" ? "حرفه‌ای" : "—"}</p>
        </Card>
        <Card title={`خلاصه ${item.summary.source === "model" ? "هوش مصنوعی" : "(خودکار)"}`}>
          <p>{item.summary.summary}</p>
          {item.summary.ambiguities.length ? <ul className="mt-2 list-inside list-disc text-muted">{item.summary.ambiguities.map((text) => <li key={text}>{text}</li>)}</ul> : null}
        </Card>
        <Card title="پاسخ‌های مشتری">
          <dl className="grid gap-1">
            {Object.entries(item.answers).filter(([, value]) => value !== null && value !== "" && !(Array.isArray(value) && !value.length)).map(([key, value]) => (
              <div key={key}><dt className="inline text-muted">{ANSWER_LABELS[key] ?? key}: </dt><dd className="inline wrap-break-word">{Array.isArray(value) ? value.join("، ") : value}</dd></div>
            ))}
          </dl>
        </Card>
        <Card title="تحلیل فنی">
          <p>فناوری پیشنهادی: {item.scope.architecture.id ? TECH[item.scope.architecture.id] : "پس از جلسه"} — {item.scope.architecture.reason}</p>
          {item.scope.architecture.alternative ? <p className="text-muted">{item.scope.architecture.alternative.note}</p> : null}
          <p>پیچیدگی: {LEVEL[item.scope.complexity]} · اطمینان برآورد: {LEVEL[item.scope.confidence]}</p>
          <p>صفحات اصلی: {item.scope.staticPages.join("، ")}</p>
          {item.scope.consultationRecommended ? <p className="text-warning">جلسه کارشناسی پیشنهاد می‌شود.</p> : null}
        </Card>
      </div>

      <div className={`mt-4 grid gap-4 ${item.scope.twoTiers ? "lg:grid-cols-2" : ""}`}>
        {tierIds.map((tierId) => {
          const scope = item.scope.tiers[tierId];
          const estimate = item.estimate?.tiers?.[tierId];
          return (
            <Card key={tierId} title={tierId === "economic" ? "نسخه اقتصادی / MVP" : "نسخه حرفه‌ای"}>
              <p>امکانات: {scope.features.map((feature) => feature.label).join("، ") || "پایه"}</p>
              <p>قالب‌های پویا: {scope.templates.join("، ")}</p>
              {scope.added.length ? <p>افزوده‌ها: {scope.added.map((feature) => `${feature.label} (${feature.reason})`).join("؛ ")}</p> : null}
              {scope.deferred.length ? <p className="text-muted">به فاز بعد: {scope.deferred.map((feature) => feature.label).join("، ")}</p> : null}
              {estimate ? (
                <>
                  <p className="mt-2 font-semibold">قیمت: {estimate.oneTime.min.toLocaleString("fa-IR")} تا {estimate.oneTime.max.toLocaleString("fa-IR")} {currency}</p>
                  <p>زمان: {estimate.weeks.min.toLocaleString("fa-IR")} تا {estimate.weeks.max.toLocaleString("fa-IR")} هفته · ساعت کار داخلی: {estimate.hours.toLocaleString("fa-IR")}</p>
                  <p>ماهانه: {estimate.monthly.toLocaleString("fa-IR")} {currency}</p>
                </>
              ) : <p className="mt-2 text-warning">قیمت: نیازمند بررسی کارشناسی</p>}
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="موارد نیازمند بررسی">
          {item.scope.needsReview.length ? <ul className="list-inside list-disc">{item.scope.needsReview.map((text) => <li key={text}>{text}</li>)}</ul> : <p className="text-muted">موردی ثبت نشده است.</p>}
        </Card>
        <Card title="برآورد">
          <p>وضعیت: {item.estimate?.status === "needs_review" ? "نیازمند بررسی" : item.estimate?.status === "partial" ? "ناقص (برخی امکانات بدون تعرفه)" : "کامل"} · نسخه تعرفه: {item.tariffVersion ?? "—"}</p>
          {item.estimate?.missingFeatures?.length ? <p className="text-warning">بدون تعرفه: {item.estimate.missingFeatures.join("، ")}</p> : null}
          {item.estimate?.budgetFit ? <p>تطابق بودجه: {{ below: "کمتر از نسخه اقتصادی", fits: "مناسب", professional: "کافی برای نسخه حرفه‌ای", unknown: "نامشخص" }[item.estimate.budgetFit]}</p> : null}
          {item.estimate?.timelineFit ? <p>زمان دلخواه: {{ tight: "کوتاه‌تر از برآورد", fits: "مناسب", flexible: "منعطف" }[item.estimate.timelineFit]}</p> : null}
          {item.estimate?.recurring ? <p>دامنه سالانه: {item.estimate.recurring.domainYearly.toLocaleString("fa-IR")} {currency}{item.estimate.recurring.supportMonthly !== null ? ` · پشتیبانی ماهانه: ${item.estimate.recurring.supportMonthly.toLocaleString("fa-IR")} ${currency}` : ""}</p> : null}
        </Card>
      </div>
    </>
  );
}
