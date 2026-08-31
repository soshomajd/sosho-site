"use client";

import { useMemo, useState } from "react";

import {
  EmptyState,
  ErrorState,
  FilterField,
  LoadingState,
  PageHeading,
  PaginationControls,
  StatusBadge,
  formatDate,
  type Pagination,
  useAdminResource,
} from "../admin-ui";

type Campaign = {
  id: string;
  title: string;
  topic: string;
  targetAudience: string;
  status: string;
  approvalStatus: string;
  provider: string | null;
  model: string | null;
  createdAt: string;
  updatedAt: string;
  media: { status: string; telegramPreviewStatus: string } | null;
};

type CampaignResponse = {
  items: Campaign[];
  pagination: Pagination;
  mediaCapability: "available" | "activation_required";
};

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

export default function CampaignsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (status) params.set("status", status);
    return `/api/admin/campaigns?${params}`;
  }, [page, status]);
  const resource = useAdminResource<CampaignResponse>(url);

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <>
      <PageHeading title="کمپین‌ها" description="مشاهده وضعیت تولید، تأیید تلگرام و رسانه هر کمپین بدون امکان ویرایش." />
      <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <FilterField
          id="campaign-status"
          label="فیلتر وضعیت"
          value={status}
          onChange={changeStatus}
          options={[
            { value: "", label: "همه وضعیت‌ها" },
            { value: "draft", label: "پیش‌نویس" },
            { value: "generating", label: "در حال تولید" },
            { value: "generated", label: "تولیدشده" },
            { value: "approved", label: "تأییدشده" },
            { value: "rejected", label: "ردشده" },
            { value: "failed", label: "ناموفق" },
          ]}
        />
      </div>
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data?.mediaCapability === "activation_required" ? (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100" role="status">
          فعال‌سازی R2 لازم است؛ نمایش کمپین‌ها ادامه دارد اما تولید و ذخیره رسانه مسدود است.
        </div>
      ) : null}
      {resource.data && resource.data.items.length === 0 ? <EmptyState message="کمپینی با این فیلتر پیدا نشد." /> : null}
      {resource.data && resource.data.items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {resource.data.items.map((campaign) => (
              <article key={campaign.id} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-semibold text-white">{campaign.title || "بدون عنوان"}</h2>
                    <p className="mt-1 break-words text-sm leading-6 text-muted">{campaign.topic}</p>
                  </div>
                  <StatusBadge label={statusLabels[campaign.status] || campaign.status} tone={campaign.status === "failed" ? "danger" : campaign.status === "generated" ? "success" : "neutral"} />
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div><dt className="text-muted">مخاطب</dt><dd className="mt-1 text-foreground">{campaign.targetAudience || "ثبت نشده"}</dd></div>
                  <div><dt className="text-muted">تأیید تلگرام</dt><dd className="mt-1"><StatusBadge label={statusLabels[campaign.approvalStatus] || campaign.approvalStatus} tone={campaign.approvalStatus === "approved" ? "success" : campaign.approvalStatus === "rejected" ? "danger" : "warning"} /></dd></div>
                  <div><dt className="text-muted">Provider</dt><dd className="mt-1 break-all text-foreground" dir="ltr">{campaign.provider || "ثبت نشده"}</dd></div>
                  <div><dt className="text-muted">Model</dt><dd className="mt-1 break-all text-foreground" dir="ltr">{campaign.model || "ثبت نشده"}</dd></div>
                  <div><dt className="text-muted">ایجاد</dt><dd className="mt-1 text-foreground">{formatDate(campaign.createdAt)}</dd></div>
                  <div><dt className="text-muted">آخرین تغییر</dt><dd className="mt-1 text-foreground">{formatDate(campaign.updatedAt)}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-muted">رسانه</dt><dd className="mt-1 text-foreground">{resource.data?.mediaCapability === "activation_required" ? "فعال‌سازی R2 لازم است" : campaign.media ? (statusLabels[campaign.media.status] || campaign.media.status) : "رسانه‌ای ثبت نشده"}</dd></div>
                </dl>
                <p className="mt-5 break-all border-t border-white/10 pt-4 text-xs text-muted" dir="ltr">{campaign.id}</p>
              </article>
            ))}
          </div>
          <PaginationControls pagination={resource.data.pagination} onPageChange={setPage} />
        </>
      ) : null}
    </>
  );
}
