"use client";

import Link from "next/link";
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

type Conversation = {
  id: string;
  safeIdentifier: string;
  channel: string;
  status: string;
  handoffState: string;
  aiStatus: string;
  humanHandoff: boolean;
  needsAttention: boolean;
  lastMessageAt: string | null;
  messageCount: number;
  updatedAt: string;
};

type ConversationResponse = { items: Conversation[]; pagination: Pagination };

const labels: Record<string, string> = {
  website: "وب‌سایت",
  instagram: "اینستاگرام",
  active: "فعال",
  closed: "بسته",
  responded: "پاسخ داده شده",
  waiting: "در انتظار پاسخ AI",
  not_started: "شروع نشده",
  paused: "متوقف برای مدیر",
  ai_active: "فعال با AI",
  handoff_requested: "نیازمند رسیدگی",
  human_active: "در اختیار مدیر",
  resolved: "حل‌شده",
};

export default function ConversationsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [handoff, setHandoff] = useState("");
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    if (channel) params.set("channel", channel);
    if (handoff) params.set("handoff", handoff);
    return `/api/admin/conversations?${params}`;
  }, [channel, handoff, page, status]);
  const resource = useAdminResource<ConversationResponse>(url);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <>
      <PageHeading title="گفتگوها" description="وضعیت AI، دخالت انسان و تعداد پیام‌های هر گفتگو به‌صورت فقط خواندنی." />
      <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <FilterField id="conversation-status" label="وضعیت گفتگو" value={status} onChange={(value) => updateFilter(setStatus, value)} options={[
          { value: "", label: "همه وضعیت‌ها" }, { value: "active", label: "فعال" }, { value: "closed", label: "بسته" },
        ]} />
        <FilterField id="conversation-channel" label="کانال" value={channel} onChange={(value) => updateFilter(setChannel, value)} options={[
          { value: "", label: "همه کانال‌ها" }, { value: "website", label: "وب‌سایت" }, { value: "instagram", label: "اینستاگرام" },
        ]} />
        <FilterField id="conversation-handoff" label="دخالت انسان" value={handoff} onChange={(value) => updateFilter(setHandoff, value)} options={[
          { value: "", label: "همه موارد" }, { value: "true", label: "نیازمند دخالت" }, { value: "false", label: "بدون دخالت" },
        ]} />
      </div>
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data && resource.data.items.length === 0 ? <EmptyState message="گفتگویی با این فیلتر پیدا نشد." /> : null}
      {resource.data && resource.data.items.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resource.data.items.map((conversation) => (
              <article key={conversation.id} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">گفتگو {conversation.safeIdentifier}</h2>
                    <p className="mt-1 text-sm text-muted">{labels[conversation.channel] || conversation.channel}</p>
                  </div>
                  <StatusBadge label={labels[conversation.status] || conversation.status} tone={conversation.status === "active" ? "success" : "neutral"} />
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted">وضعیت AI</dt><dd className="text-left text-foreground">{labels[conversation.aiStatus] || conversation.aiStatus}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">مرحله رسیدگی</dt><dd><StatusBadge label={conversation.needsAttention ? "نیازمند رسیدگی" : (labels[conversation.handoffState] || conversation.handoffState)} tone={conversation.needsAttention ? "warning" : "neutral"} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">دخالت انسان</dt><dd><StatusBadge label={conversation.humanHandoff ? "لازم است" : "لازم نیست"} tone={conversation.humanHandoff ? "warning" : "neutral"} /></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">تعداد پیام</dt><dd className="text-foreground">{conversation.messageCount.toLocaleString("fa-IR")}</dd></div>
                  <div className="border-t border-white/10 pt-3"><dt className="text-muted">آخرین پیام</dt><dd className="mt-1 text-foreground">{formatDate(conversation.lastMessageAt)}</dd></div>
                </dl>
                <Link
                  href={`/admin/conversations/detail?id=${encodeURIComponent(conversation.id)}`}
                  className="mt-5 inline-flex rounded-xl border border-accent/40 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  مشاهده جزئیات
                </Link>
              </article>
            ))}
          </div>
          <PaginationControls pagination={resource.data.pagination} onPageChange={setPage} />
        </>
      ) : null}
    </>
  );
}
