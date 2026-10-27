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
import { STATUS_LABELS, STATUS_TONES, TELEGRAM_LABELS, formatRange, type ConsultantStatus, type Range } from "./shared";

type Item = {
  id: string;
  publicRef: string;
  createdAt: string;
  locale: "fa" | "en";
  status: ConsultantStatus;
  projectType: string;
  selectedTier: "economic" | "professional" | null;
  contactName: string | null;
  contactValue: string | null;
  estimateStatus: string;
  currency: string | null;
  economic: Range;
  professional: Range;
  telegramState: string;
};

type ListResponse = { items: Item[]; pagination: Pagination; openTotal: number };

export default function ConsultantClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    return `/api/admin/consultant/requests?${params}`;
  }, [page, status]);
  const resource = useAdminResource<ListResponse>(url);

  return (
    <>
      <PageHeading
        title="درخواست‌های برآورد هوشمند"
        description="هر درخواستی که مشتری با رضایت ثبت کرده است: پاسخ‌ها، دو نسخه پیشنهادی، بازه قیمت از موتور تعرفه و وضعیت پیگیری. اطلاعات تماس فقط پس از ورود دیده می‌شود."
      />
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <FilterField
          id="consultant-status"
          label="وضعیت"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[{ value: "", label: "همه" }, ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))]}
        />
        {resource.data ? (
          <p className="pb-2 text-sm text-muted">
            درخواست باز: <span className="font-semibold text-white">{resource.data.openTotal.toLocaleString("fa-IR")}</span>
          </p>
        ) : null}
        <Link href="/admin/tariffs" className="ms-auto rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent">
          تنظیم تعرفه‌ها
        </Link>
      </div>
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data && resource.data.items.length === 0 ? <EmptyState message="هنوز درخواستی ثبت نشده است." /> : null}
      {resource.data && resource.data.items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {resource.data.items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-white">
                      <Link href={`/admin/consultant/detail?id=${encodeURIComponent(item.id)}`} className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent">
                        {item.publicRef} · {item.projectType}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)} · {item.locale === "fa" ? "فارسی" : "English"}</p>
                  </div>
                  <StatusBadge label={STATUS_LABELS[item.status] ?? item.status} tone={STATUS_TONES[item.status] ?? "neutral"} />
                </div>
                <dl className="mt-4 grid gap-2 text-sm">
                  <div><dt className="inline text-muted">مشتری: </dt><dd className="inline text-foreground">{item.contactName ? `${item.contactName} · ` : ""}<span dir="ltr">{item.contactValue ?? "ثبت نشده"}</span></dd></div>
                  {item.economic ? <div><dt className="inline text-muted">اقتصادی: </dt><dd className="inline text-foreground">{formatRange(item.economic, item.currency)}</dd></div> : null}
                  <div><dt className="inline text-muted">حرفه‌ای: </dt><dd className="inline text-foreground">{formatRange(item.professional, item.currency)}</dd></div>
                  <div><dt className="inline text-muted">نسخه انتخابی: </dt><dd className="inline text-foreground">{item.selectedTier === "economic" ? "اقتصادی" : item.selectedTier === "professional" ? "حرفه‌ای" : "—"}</dd></div>
                  <div><dt className="inline text-muted">تلگرام: </dt><dd className="inline text-foreground">{TELEGRAM_LABELS[item.telegramState] ?? item.telegramState}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <PaginationControls pagination={resource.data.pagination} onPageChange={setPage} />
        </>
      ) : null}
    </>
  );
}
