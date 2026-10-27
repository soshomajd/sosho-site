export type ConsultantStatus =
  | "estimated"
  | "tier_selected"
  | "contact_submitted"
  | "in_review"
  | "contacted"
  | "won"
  | "lost"
  | "archived";

export const STATUS_LABELS: Record<ConsultantStatus, string> = {
  estimated: "برآورد شد",
  tier_selected: "نسخه انتخاب شد",
  contact_submitted: "اطلاعات تماس ثبت شد",
  in_review: "در حال بررسی",
  contacted: "تماس گرفته شد",
  won: "قرارداد بسته شد",
  lost: "از دست رفت",
  archived: "بایگانی",
};

export const STATUS_TONES: Record<ConsultantStatus, "neutral" | "success" | "warning" | "danger"> = {
  estimated: "neutral",
  tier_selected: "warning",
  contact_submitted: "warning",
  in_review: "neutral",
  contacted: "success",
  won: "success",
  lost: "danger",
  archived: "neutral",
};

export const TELEGRAM_LABELS: Record<string, string> = {
  awaiting_config: "در انتظار تنظیمات تلگرام",
  queued: "در صف ارسال",
  sent: "ارسال شد",
  failed: "ارسال ناموفق (تلاش مجدد خودکار)",
};

export type Range = { min: number; max: number; weeksMin: number; weeksMax: number } | null;

export function formatRange(range: Range, currency: string | null) {
  if (!range) return "نیازمند بررسی";
  return `${range.min.toLocaleString("fa-IR")} تا ${range.max.toLocaleString("fa-IR")} ${currency ?? ""} · ${range.weeksMin.toLocaleString("fa-IR")}–${range.weeksMax.toLocaleString("fa-IR")} هفته`;
}

export async function adminPost(url: string, csrfToken: string, body: unknown, method = "POST") {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "content-type": "application/json", accept: "application/json", "x-csrf-token": csrfToken },
    body: JSON.stringify(body),
  });
  if (response.status === 401) window.dispatchEvent(new Event("sosho-admin-unauthorized"));
  return { status: response.status, data: (await response.json().catch(() => null)) as Record<string, unknown> | null };
}
