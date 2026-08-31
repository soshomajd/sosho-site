"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
  formatDate,
  useAdminResource,
} from "../../admin-ui";

type DetailResponse = {
  conversation: {
    id: string;
    safeIdentifier: string;
    channel: string;
    status: string;
    aiStatus: string;
    humanHandoff: boolean;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
  };
  messages: Array<{ role: string; contentPreview: string; stage: string | null; createdAt: string }>;
  messagesTruncated: boolean;
};

export default function ConversationDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawConversationId = searchParams.get("id");
  const conversationId = rawConversationId && rawConversationId.length <= 100
    ? rawConversationId
    : null;

  const resource = useAdminResource<DetailResponse>(
    conversationId ? `/api/admin/conversations/${encodeURIComponent(conversationId)}` : null
  );

  return (
    <>
      <PageHeading title="جزئیات گفتگو" description="نمایش محدود و امن آخرین پیام‌ها؛ اطلاعات تماس در پاسخ API پنهان می‌شود." />
      <Link href="/admin/conversations" className="mb-6 inline-flex text-sm text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent">
        بازگشت به گفتگوها
      </Link>
      {resource.loading ? <LoadingState /> : null}
      {!conversationId ? <ErrorState message="شناسه گفتگو در آدرس معتبر نیست." retry={() => router.push("/admin/conversations")} /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-surface p-5" aria-labelledby="conversation-summary">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 id="conversation-summary" className="text-lg font-semibold text-white">گفتگو {resource.data.conversation.safeIdentifier}</h2><p className="mt-1 text-sm text-muted">{resource.data.conversation.channel}</p></div>
              <StatusBadge label={resource.data.conversation.humanHandoff ? "نیازمند دخالت انسان" : "پاسخ خودکار"} tone={resource.data.conversation.humanHandoff ? "warning" : "neutral"} />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-muted">وضعیت گفتگو</dt><dd className="mt-1 text-foreground">{resource.data.conversation.status}</dd></div>
              <div><dt className="text-muted">وضعیت AI</dt><dd className="mt-1 text-foreground">{resource.data.conversation.aiStatus}</dd></div>
              <div><dt className="text-muted">تعداد پیام</dt><dd className="mt-1 text-foreground">{resource.data.conversation.messageCount.toLocaleString("fa-IR")}</dd></div>
              <div><dt className="text-muted">آخرین تغییر</dt><dd className="mt-1 text-foreground">{formatDate(resource.data.conversation.updatedAt)}</dd></div>
            </dl>
          </section>
          <section aria-labelledby="conversation-messages">
            <h2 id="conversation-messages" className="mb-4 text-lg font-semibold text-white">آخرین پیام‌ها</h2>
            {resource.data.messagesTruncated ? <p className="mb-4 text-sm text-amber-200">فقط ۵۰ پیام آخر نمایش داده می‌شود.</p> : null}
            {resource.data.messages.length === 0 ? <EmptyState message="پیامی برای این گفتگو ثبت نشده است." /> : (
              <ol className="space-y-3">
                {resource.data.messages.map((message, index) => (
                  <li key={`${message.createdAt}-${index}`} className="rounded-2xl border border-white/10 bg-surface p-4">
                    <div className="flex flex-wrap justify-between gap-2 text-xs text-muted"><span>{message.role === "assistant" ? "دستیار" : "کاربر"}{message.stage ? ` · ${message.stage}` : ""}</span><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{message.contentPreview || "بدون متن"}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
