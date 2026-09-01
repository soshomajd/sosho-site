"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useAdminSession } from "../../admin-session";
import {
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
  formatDate,
  useAdminResource,
} from "../../admin-ui";

type ActionName = "approve" | "reject" | "regenerate";

type ContentBundle = {
  campaignTitle: string;
  targetAudience: string;
  contentGoal: string;
  mainHook: string;
  mainMessage: string;
  callToAction: string;
  reelScript: { durationSeconds: number; scenes: Array<{ visual: string; dialogue: string }> };
  storyFrames: Array<{ headline: string; body: string; visual: string }>;
  carouselSlides: Array<{ headline: string; body: string; visual: string }>;
  instagramCaption: string;
  facebookCaption: string;
  linkedinPost: string;
  telegramPost: string;
  youtubeTitle: string;
  youtubeDescription: string;
  threadsPost: string;
  hashtags: string[];
  visualDirection: string;
  voiceoverScript: string;
  subtitles: Array<{ startSecond: number; endSecond: number; text: string }>;
};

type DetailResponse = {
  campaign: {
    id: string;
    topic: string;
    targetAudience: string;
    goal: string;
    language: string;
    status: string;
    approvalStatus: string;
    approvalDecidedAt: string | null;
    rejectionReason: string | null;
    scheduledAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  contentItem: {
    id: string;
    content: ContentBundle;
    validationStatus: string;
    provider: string | null;
    model: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  media: {
    status: string;
    provider: string;
    model: string;
    telegramPreviewStatus: string;
    updatedAt: string;
  } | null;
  mediaCapability: "available" | "activation_required";
  allowedActions: Record<ActionName, boolean>;
};

type Confirmation = { action: ActionName; operationKey: string };

const statusLabels: Record<string, string> = {
  draft: "پیش‌نویس",
  generating: "در حال تولید",
  generated: "تولیدشده",
  failed: "ناموفق",
  pending: "در انتظار بررسی",
  approved: "تأییدشده",
  rejected: "ردشده",
  stored: "ذخیره‌شده",
};

const actionLabels: Record<ActionName, string> = {
  approve: "تأیید",
  reject: "رد",
  regenerate: "تولید دوباره متن",
};

function TextBlock({ label, value }: Readonly<{ label: string; value: string | null | undefined }>) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{value || "ثبت نشده"}</dd>
    </div>
  );
}

function errorMessage(code: unknown) {
  if (code === "invalid_csrf") return "اعتبار امنیتی نشست نامعتبر است. صفحه را دوباره باز کنید.";
  if (code === "invalid_rejection_reason") return "دلیل رد باید بین ۳ تا ۳۰۰ نویسه و بدون کد HTML باشد.";
  if (code === "invalid_campaign_state") return "این عملیات با وضعیت فعلی کمپین مجاز نیست.";
  if (code === "operation_in_progress") return "یک عملیات دیگر برای این کمپین در حال اجرا است.";
  if (code === "content_generation_failed") return "تولید دوباره محتوا ناموفق بود. کمی بعد دوباره تلاش کنید.";
  return "عملیات انجام نشد. دوباره تلاش کنید.";
}

export default function CampaignDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { csrfToken } = useAdminSession();
  const rawCampaignId = searchParams.get("id");
  const campaignId = rawCampaignId && rawCampaignId.length <= 100 ? rawCampaignId : null;
  const resource = useAdminResource<DetailResponse>(
    campaignId ? `/api/admin/campaigns/${encodeURIComponent(campaignId)}` : null
  );
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const actionLock = useRef(false);

  function requestConfirmation(action: ActionName) {
    if (pending || !resource.data?.allowedActions[action]) return;
    setMessage(null);
    setRejectReason("");
    setConfirmation({ action, operationKey: crypto.randomUUID() });
  }

  async function submitAction() {
    if (!campaignId || !confirmation || !csrfToken || actionLock.current) return;
    const reason = rejectReason.replace(/\s+/gu, " ").trim();
    if (confirmation.action === "reject" && (reason.length < 3 || reason.length > 300)) {
      setMessage("دلیل رد باید بین ۳ تا ۳۰۰ نویسه باشد.");
      return;
    }
    actionLock.current = true;
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/admin/campaigns/${encodeURIComponent(campaignId)}/${confirmation.action}`,
        {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "idempotency-key": confirmation.operationKey,
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify(confirmation.action === "reject" ? { reason } : {}),
        }
      );
      const payload = await response.json() as { error?: unknown };
      if (response.status === 401) {
        window.dispatchEvent(new Event("sosho-admin-unauthorized"));
        return;
      }
      if (!response.ok) {
        setMessage(errorMessage(payload.error));
        return;
      }
      setConfirmation(null);
      setRejectReason("");
      setMessage("عملیات با موفقیت ثبت شد.");
      resource.retry();
    } catch {
      setMessage("ارتباط با سرویس مدیریت برقرار نشد.");
    } finally {
      actionLock.current = false;
      setPending(false);
    }
  }

  const detail = resource.data;
  const bundle = detail?.contentItem?.content;
  const actionDisabled = pending || detail?.campaign.status === "generating";

  return (
    <>
      <PageHeading title="جزئیات کمپین" description="مشاهده کامل محتوا و اجرای کنترل‌شده عملیات مدیریتی." />
      <Link href="/admin/campaigns" className="mb-6 inline-flex text-sm text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent">
        بازگشت به کمپین‌ها
      </Link>
      {resource.loading ? <LoadingState /> : null}
      {!campaignId ? <ErrorState message="شناسه کمپین در آدرس معتبر نیست." retry={() => router.push("/admin/campaigns")} /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {detail ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-surface p-5" aria-labelledby="campaign-summary">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id="campaign-summary" className="break-words text-xl font-semibold text-white">{bundle?.campaignTitle || detail.campaign.topic}</h2>
                <p className="mt-2 break-all text-xs text-muted" dir="ltr">{detail.campaign.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label={statusLabels[detail.campaign.status] || detail.campaign.status} tone={detail.campaign.status === "failed" ? "danger" : detail.campaign.status === "generated" ? "success" : "neutral"} />
                <StatusBadge label={statusLabels[detail.campaign.approvalStatus] || detail.campaign.approvalStatus} tone={detail.campaign.approvalStatus === "approved" ? "success" : detail.campaign.approvalStatus === "rejected" ? "danger" : "warning"} />
              </div>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TextBlock label="موضوع" value={detail.campaign.topic} />
              <TextBlock label="هدف" value={detail.campaign.goal} />
              <TextBlock label="مخاطب" value={detail.campaign.targetAudience} />
              <TextBlock label="Provider" value={detail.contentItem?.provider} />
              <TextBlock label="Model" value={detail.contentItem?.model} />
              <TextBlock label="دلیل رد" value={detail.campaign.rejectionReason} />
              <TextBlock label="زمان ایجاد" value={formatDate(detail.campaign.createdAt)} />
              <TextBlock label="آخرین تغییر" value={formatDate(detail.campaign.updatedAt)} />
              <TextBlock label="آخرین تصمیم" value={formatDate(detail.campaign.approvalDecidedAt)} />
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-surface p-5" aria-labelledby="campaign-actions">
            <h2 id="campaign-actions" className="text-lg font-semibold text-white">عملیات مدیریت محتوا</h2>
            <p className="mt-2 text-sm leading-7 text-muted">هر عملیات در سمت سرور اعتبارسنجی و برای جلوگیری از اجرای تکراری ثبت می‌شود.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {(["approve", "reject", "regenerate"] as ActionName[]).map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={actionDisabled || !detail.allowedActions[action]}
                  onClick={() => requestConfirmation(action)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40 ${action === "approve" ? "bg-emerald-600 text-white" : action === "reject" ? "bg-red-700 text-white" : "border border-white/15 text-foreground"}`}
                >
                  {actionLabels[action]}
                </button>
              ))}
            </div>
            {message ? <p className="mt-4 text-sm leading-6 text-amber-200" role="status">{message}</p> : null}
          </section>

          <section className="rounded-2xl border border-white/10 bg-surface p-5" aria-labelledby="media-status">
            <h2 id="media-status" className="text-lg font-semibold text-white">وضعیت رسانه</h2>
            <p className="mt-3 text-sm leading-7 text-foreground">
              {detail.mediaCapability === "activation_required"
                ? "فعال‌سازی R2 لازم است"
                : detail.media ? (statusLabels[detail.media.status] || detail.media.status) : "رسانه‌ای ثبت نشده"}
            </p>
          </section>

          <section aria-labelledby="content-bundle">
            <h2 id="content-bundle" className="mb-4 text-lg font-semibold text-white">Content Bundle</h2>
            {!bundle ? <p className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-muted">محتوای معتبر برای این کمپین ثبت نشده است.</p> : (
              <div className="space-y-5">
                <dl className="grid gap-4 md:grid-cols-2">
                  <TextBlock label="عنوان کمپین" value={bundle.campaignTitle} />
                  <TextBlock label="مخاطب هدف" value={bundle.targetAudience} />
                  <TextBlock label="هدف محتوا" value={bundle.contentGoal} />
                  <TextBlock label="هوک اصلی" value={bundle.mainHook} />
                  <TextBlock label="پیام اصلی" value={bundle.mainMessage} />
                  <TextBlock label="دعوت به اقدام" value={bundle.callToAction} />
                  <TextBlock label="کپشن اینستاگرام" value={bundle.instagramCaption} />
                  <TextBlock label="کپشن فیسبوک" value={bundle.facebookCaption} />
                  <TextBlock label="پست لینکدین" value={bundle.linkedinPost} />
                  <TextBlock label="پست تلگرام" value={bundle.telegramPost} />
                  <TextBlock label="عنوان یوتیوب" value={bundle.youtubeTitle} />
                  <TextBlock label="توضیحات یوتیوب" value={bundle.youtubeDescription} />
                  <TextBlock label="پست Threads" value={bundle.threadsPost} />
                  <TextBlock label="جهت بصری" value={bundle.visualDirection} />
                  <TextBlock label="متن گویندگی" value={bundle.voiceoverScript} />
                  <TextBlock label="هشتگ‌ها" value={bundle.hashtags.join(" ")} />
                </dl>
                <div className="grid gap-5 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-surface p-5">
                    <h3 className="font-semibold text-white">سناریوی Reel · {bundle.reelScript.durationSeconds.toLocaleString("fa-IR")} ثانیه</h3>
                    <ol className="mt-4 space-y-3">{bundle.reelScript.scenes.map((scene, index) => <li key={index} className="text-sm leading-7 text-foreground"><strong>صحنه {index + 1}:</strong> {scene.visual}<br />{scene.dialogue}</li>)}</ol>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface p-5">
                    <h3 className="font-semibold text-white">فریم‌های Story</h3>
                    <ol className="mt-4 space-y-3">{bundle.storyFrames.map((frame, index) => <li key={index} className="text-sm leading-7 text-foreground"><strong>{frame.headline}</strong><br />{frame.body}<br /><span className="text-muted">{frame.visual}</span></li>)}</ol>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface p-5">
                    <h3 className="font-semibold text-white">اسلایدهای Carousel</h3>
                    <ol className="mt-4 space-y-3">{bundle.carouselSlides.map((slide, index) => <li key={index} className="text-sm leading-7 text-foreground"><strong>{slide.headline}</strong><br />{slide.body}<br /><span className="text-muted">{slide.visual}</span></li>)}</ol>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-surface p-5">
                  <h3 className="font-semibold text-white">زیرنویس‌ها</h3>
                  <ol className="mt-4 space-y-2">{bundle.subtitles.map((subtitle, index) => <li key={index} className="text-sm leading-7 text-foreground"><span dir="ltr">{subtitle.startSecond}–{subtitle.endSecond}s</span> · {subtitle.text}</li>)}</ol>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {confirmation ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="presentation">
          <section className="w-full max-w-lg rounded-2xl border border-white/15 bg-surface p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
            <h2 id="confirm-title" className="text-lg font-semibold text-white">تأیید عملیات {actionLabels[confirmation.action]}</h2>
            <p id="confirm-description" className="mt-3 text-sm leading-7 text-muted">پس از تأیید، وضعیت در Dashboard و Telegram یکسان خواهد بود.</p>
            {confirmation.action === "reject" ? (
              <div className="mt-5">
                <label htmlFor="rejection-reason" className="text-sm font-medium text-foreground">دلیل کوتاه رد</label>
                <textarea
                  id="rejection-reason"
                  required
                  minLength={3}
                  maxLength={300}
                  autoFocus
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" disabled={pending} onClick={() => setConfirmation(null)} className="rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40">انصراف</button>
              <button type="button" disabled={pending || (confirmation.action === "reject" && rejectReason.trim().length < 3)} onClick={() => void submitAction()} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40">{pending ? "در حال انجام…" : "تأیید نهایی"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
