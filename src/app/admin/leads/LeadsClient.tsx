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

type Lead = {
  id: string;
  safeIdentifier: string;
  displayName: string | null;
  source: string;
  projectType: string | null;
  budget: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type LeadResponse = { items: Lead[]; pagination: Pagination };

const statusLabels: Record<string, string> = {
  discovery: "شناخت اولیه",
  qualification: "ارزیابی نیاز",
  proposal_ready: "آماده پیشنهاد",
  handoff: "نیازمند دخالت انسان",
};

const sourceLabels: Record<string, string> = {
  website: "وب‌سایت",
  instagram: "اینستاگرام",
};

export default function LeadsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    return `/api/admin/leads?${params}`;
  }, [page, source, status]);
  const resource = useAdminResource<LeadResponse>(url);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <>
      <PageHeading title="سرنخ‌ها" description="فقط اطلاعات ضروری و غیرحساس سرنخ‌های ثبت‌شده نمایش داده می‌شود." />
      <div className="mb-6 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
        <FilterField id="lead-status" label="وضعیت سرنخ" value={status} onChange={(value) => updateFilter(setStatus, value)} options={[
          { value: "", label: "همه وضعیت‌ها" },
          { value: "discovery", label: "شناخت اولیه" },
          { value: "qualification", label: "ارزیابی نیاز" },
          { value: "proposal_ready", label: "آماده پیشنهاد" },
          { value: "handoff", label: "نیازمند دخالت انسان" },
        ]} />
        <FilterField id="lead-source" label="کانال ورود" value={source} onChange={(value) => updateFilter(setSource, value)} options={[
          { value: "", label: "همه کانال‌ها" },
          { value: "website", label: "وب‌سایت" },
          { value: "instagram", label: "اینستاگرام" },
        ]} />
      </div>
      {resource.loading ? <LoadingState /> : null}
      {resource.error ? <ErrorState message={resource.error} retry={resource.retry} /> : null}
      {resource.data && resource.data.items.length === 0 ? <EmptyState message="سرنخی با این فیلتر پیدا نشد." /> : null}
      {resource.data && resource.data.items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resource.data.items.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">{lead.displayName || `سرنخ ${lead.safeIdentifier}`}</h2>
                    <p className="mt-1 text-xs text-muted">شناسه امن: <span dir="ltr">{lead.safeIdentifier}</span></p>
                  </div>
                  <StatusBadge label={statusLabels[lead.status] || lead.status} tone={lead.status === "handoff" ? "warning" : "neutral"} />
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted">کانال ورود</dt><dd className="text-foreground">{sourceLabels[lead.source] || lead.source}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">نوع نیاز</dt><dd className="text-left text-foreground">{lead.projectType || "ثبت نشده"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">سطح بودجه</dt><dd className="text-left text-foreground">{lead.budget || "ثبت نشده"}</dd></div>
                  <div className="border-t border-white/10 pt-3"><dt className="text-muted">آخرین فعالیت</dt><dd className="mt-1 text-foreground">{formatDate(lead.updatedAt)}</dd></div>
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
