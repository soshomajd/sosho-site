"use client";

import { useMemo, useRef, useState } from "react";

import { useAdminSession } from "../admin-session";
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

type MessageStatus = "new" | "read" | "replied" | "archived";

type ContactMessage = {
  id: string;
  name: string;
  contact: string;
  message: string;
  locale: "fa" | "en";
  status: MessageStatus;
  createdAt: string;
  readAt: string | null;
  repliedAt: string | null;
};

type MessagesResponse = {
  items: ContactMessage[];
  pagination: Pagination;
  newTotal: number;
};

const statusLabels: Record<MessageStatus, string> = {
  new: "جدید",
  read: "خوانده‌شده",
  replied: "پاسخ داده شد",
  archived: "بایگانی",
};

const statusTones: Record<MessageStatus, "neutral" | "success" | "warning" | "danger"> = {
  new: "warning",
  read: "neutral",
  replied: "success",
  archived: "neutral",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function toAsciiDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/gu, (digit) => {
    const persian = PERSIAN_DIGITS.indexOf(digit);
    return String(persian >= 0 ? persian : ARABIC_DIGITS.indexOf(digit));
  });
}

/** Builds direct reply links (call / WhatsApp / email) from what the visitor typed. */
function replyLinks(contact: string) {
  if (EMAIL_PATTERN.test(contact)) {
    return [{ label: "پاسخ با ایمیل", href: `mailto:${contact}` }];
  }
  const digits = toAsciiDigits(contact).replace(/\D/gu, "");
  const international = digits.startsWith("00")
    ? digits.slice(2)
    : digits.startsWith("0")
      ? `98${digits.slice(1)}`
      : digits;
  return [
    { label: "تماس تلفنی", href: `tel:+${international}` },
    { label: "واتس‌اپ", href: `https://wa.me/${international}` },
  ];
}

export default function MessagesClient() {
  const { csrfToken } = useAdminSession();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const actionLock = useRef(false);
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    return `/api/admin/contact-messages?${params}`;
  }, [page, status]);
  const resource = useAdminResource<MessagesResponse>(url);

  async function changeStatus(message: ContactMessage, next: MessageStatus) {
    if (!csrfToken || actionLock.current) return;
    actionLock.current = true;
    setPendingId(message.id);
    setActionError(null);
    try {
      const response = await fetch(`/api/admin/contact-messages/${encodeURIComponent(message.id)}`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ status: next }),
      });
      if (response.status === 401) {
        window.dispatchEvent(new Event("sosho-admin-unauthorized"));
        return;
      }
      if (!response.ok) {
        setActionError("تغییر وضعیت انجام نشد. دوباره تلاش کنید.");
        return;
      }
      resource.retry();
    } catch {
      setActionError("ارتباط با سرویس برقرار نشد.");
    } finally {
      actionLock.current = false;
      setPendingId(null);
    }
  }

  return (
    <>
      <PageHeading
        title="پیام‌های مخاطبان"
        description="پیام‌هایی که بازدیدکنندگان از فرم تماس سایت گذاشته‌اند. پیام‌ها فقط در این بخش و پس از ورود دیده می‌شوند و پس از مدت نگهداری به‌طور خودکار حذف می‌شوند."
      />
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <FilterField
          id="message-status"
          label="وضعیت پیام"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { value: "", label: "همه پیام‌ها" },
            { value: "new", label: statusLabels.new },
            { value: "read", label: statusLabels.read },
            { value: "replied", label: statusLabels.replied },
            { value: "archived", label: statusLabels.archived },
          ]}
        />
        {resource.data ? (
          <p className="pb-2 text-sm text-muted">
            پیام جدید: <span className="font-semibold text-white">{resource.data.newTotal.toLocaleString("fa-IR")}</span>
          </p>
        ) : null}
      </div>
      {actionError ? (
        <p role="alert" className="mb-4 rounded-2xl border border-danger/30 bg-danger/20 p-4 text-sm text-danger">
          {actionError}
        </p>
      ) : null}
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data && resource.data.items.length === 0 ? <EmptyState message="پیامی با این فیلتر پیدا نشد." /> : null}
      {resource.data && resource.data.items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {resource.data.items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-white">{item.name}</h2>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(item.createdAt)} · {item.locale === "fa" ? "فارسی" : "English"}
                    </p>
                  </div>
                  <StatusBadge label={statusLabels[item.status]} tone={statusTones[item.status]} />
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{item.message}</p>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-muted">راه تماس</p>
                  <p dir="ltr" className="mt-1 break-all text-start text-sm font-semibold text-white">{item.contact}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {replyLinks(item.contact).map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="rounded-lg border border-accent/40 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {(["read", "replied", "archived", "new"] as const)
                    .filter((next) => next !== item.status)
                    .map((next) => (
                      <button
                        key={next}
                        type="button"
                        disabled={!csrfToken || pendingId !== null}
                        onClick={() => void changeStatus(item, next)}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {next === "new" ? "بازگرداندن به جدید" : next === "read" ? "علامت خوانده‌شده" : next === "replied" ? "پاسخ داده شد" : "بایگانی"}
                      </button>
                    ))}
                </div>
              </article>
            ))}
          </div>
          <PaginationControls pagination={resource.data.pagination} onPageChange={setPage} />
        </>
      ) : null}
    </>
  );
}
