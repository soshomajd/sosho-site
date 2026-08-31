"use client";

import { useEffect, useState } from "react";

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useAdminResource<T>(url: string | null): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    void fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: controller.signal,
    }).then(async (response) => {
      if (response.status === 401) {
        window.dispatchEvent(new Event("sosho-admin-unauthorized"));
        throw new Error("unauthorized");
      }
      if (!response.ok) throw new Error("api_error");
      return response.json() as Promise<T>;
    }).then((payload) => {
      setData(payload);
    }).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      if (requestError instanceof Error && requestError.message === "unauthorized") return;
      setError("دریافت اطلاعات انجام نشد. دوباره تلاش کنید.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [url, attempt]);

  return { data, loading, error, retry: () => setAttempt((value) => value + 1) };
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "ثبت نشده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "نامشخص";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PageHeading({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-muted" role="status">
      در حال دریافت اطلاعات واقعی سیستم…
    </div>
  );
}

export function EmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-surface/60 p-8 text-center text-sm leading-7 text-muted">
      {message}
    </div>
  );
}

export function ErrorState({ message, retry }: Readonly<{ message: string; retry: () => void }>) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-950/20 p-6" role="alert">
      <p className="text-sm text-red-200">{message}</p>
      <button
        type="button"
        onClick={retry}
        className="mt-4 rounded-xl border border-red-300/40 px-4 py-2 text-sm text-red-100 hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        تلاش دوباره
      </button>
    </div>
  );
}

export function FilterField({
  id,
  label,
  value,
  options,
  onChange,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="flex min-w-44 flex-col gap-2 text-sm text-muted" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/15 bg-surface px-3 py-2.5 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function PaginationControls({
  pagination,
  onPageChange,
}: Readonly<{ pagination: Pagination; onPageChange: (page: number) => void }>) {
  if (pagination.totalPages <= 1) return null;
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="صفحه‌بندی">
      <p className="text-sm text-muted">
        صفحه {pagination.page.toLocaleString("fa-IR")} از {pagination.totalPages.toLocaleString("fa-IR")}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!pagination.hasPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          صفحه قبل
        </button>
        <button
          type="button"
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          صفحه بعد
        </button>
      </div>
    </nav>
  );
}

export function StatusBadge({ label, tone = "neutral" }: Readonly<{
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}>) {
  const tones = {
    neutral: "border-white/10 bg-white/5 text-foreground",
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    danger: "border-red-400/25 bg-red-400/10 text-red-200",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${tones[tone]}`}>{label}</span>;
}
