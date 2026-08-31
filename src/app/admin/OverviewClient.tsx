"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
  formatDate,
  useAdminResource,
} from "./admin-ui";

type Overview = {
  campaigns: Record<"total" | "draft" | "generating" | "generated" | "approved" | "rejected" | "failed", number>;
  leads: number;
  activeConversations: number;
  humanHandoffs: number;
  recentActivities: Array<{
    type: "campaign" | "lead" | "conversation";
    id: string;
    label: string | null;
    status: string;
    occurredAt: string;
  }>;
};

const campaignLabels: Array<[keyof Overview["campaigns"], string]> = [
  ["total", "همه کمپین‌ها"],
  ["draft", "پیش‌نویس"],
  ["generating", "در حال تولید"],
  ["generated", "تولیدشده"],
  ["approved", "تأییدشده"],
  ["rejected", "ردشده"],
  ["failed", "ناموفق"],
];

const activityLabels = {
  campaign: "کمپین",
  lead: "سرنخ",
  conversation: "گفتگو",
};

export default function OverviewClient() {
  const resource = useAdminResource<Overview>("/api/admin/overview");

  return (
    <>
      <PageHeading title="نمای کلی" description="خلاصه زنده و فقط خواندنی از وضعیت فروش، گفتگوها و تولید محتوا." />
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data ? (
        <div className="space-y-8">
          <section aria-labelledby="system-summary-heading">
            <h2 id="system-summary-heading" className="mb-4 text-lg font-semibold text-white">وضعیت سیستم</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["تعداد سرنخ‌ها", resource.data.leads],
                ["گفتگوهای فعال", resource.data.activeConversations],
                ["نیازمند دخالت انسان", resource.data.humanHandoffs],
                ["تعداد کمپین‌ها", resource.data.campaigns.total],
              ].map(([label, value]) => (
                <article key={String(label)} className="rounded-2xl border border-white/10 bg-surface p-5">
                  <p className="text-sm text-muted">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-white">{Number(value).toLocaleString("fa-IR")}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="campaign-summary-heading">
            <h2 id="campaign-summary-heading" className="mb-4 text-lg font-semibold text-white">وضعیت کمپین‌ها</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {campaignLabels.map(([key, label]) => (
                <article key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/70 p-4">
                  <span className="text-sm text-muted">{label}</span>
                  <strong className="text-xl text-white">{(resource.data?.campaigns[key] ?? 0).toLocaleString("fa-IR")}</strong>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="recent-activity-heading">
            <h2 id="recent-activity-heading" className="mb-4 text-lg font-semibold text-white">آخرین فعالیت‌ها</h2>
            {resource.data.recentActivities.length === 0 ? (
              <EmptyState message="هنوز فعالیتی در سیستم ثبت نشده است." />
            ) : (
              <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-surface">
                {resource.data.recentActivities.map((activity) => (
                  <li key={`${activity.type}-${activity.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{activity.label || "بدون عنوان"}</p>
                      <p className="mt-1 text-xs text-muted">{activityLabels[activity.type]} · {formatDate(activity.occurredAt)}</p>
                    </div>
                    <StatusBadge label={activity.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
