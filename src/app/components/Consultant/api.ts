import type { Locale } from "@/app/i18n";

import type { ConsultantCopy } from "./copy";
import type { Answers, ConsultantConfig, EstimateResponse, Interpretation } from "./types";

const TIMEOUT_MS = 30_000;

async function request<T>(path: string, init: RequestInit = {}): Promise<{ status: number; data: T | null }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { "content-type": "application/json", accept: "application/json", ...(init.headers ?? {}) },
    });
    const data = (await response.json().catch(() => null)) as T | null;
    return { status: response.status, data };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function loadConfig(locale: Locale) {
  const result = await request<ConsultantConfig>(`/api/consultant/config?locale=${locale}`, { method: "GET", headers: {} });
  if (result.status !== 200 || !result.data) throw new Error("config_failed");
  return result.data;
}

export async function interpret(locale: Locale, text: string, projectType?: string) {
  const result = await request<{ interpretation: Interpretation | null }>("/api/consultant/interpret", {
    method: "POST",
    body: JSON.stringify({ locale, text, ...(projectType ? { projectType } : {}) }),
  });
  return result.status === 200 ? result.data?.interpretation ?? null : null;
}

/** Only the answers the server accepts: empty notes and fields for other project types are left out. */
export function cleanAnswers(answers: Answers, contentAsked: boolean) {
  const out: Record<string, unknown> = {
    projectType: answers.projectType,
    goal: answers.goal,
    features: answers.features,
    size: answers.size,
    style: answers.style,
    budget: answers.budget,
    timeframe: answers.timeframe,
  };
  if (contentAsked && answers.content) out.content = answers.content;
  for (const key of ["projectTypeNote", "goalNote", "featuresNote", "styleNote", "timeframeNote", "notes"] as const) {
    const value = answers[key]?.trim();
    if (value) out[key] = value.slice(0, 500);
  }
  if (answers.style === "reference" && answers.referenceUrl?.trim()) out.referenceUrl = answers.referenceUrl.trim();
  return out;
}

export async function requestEstimate(body: Record<string, unknown>) {
  const result = await request<EstimateResponse>("/api/consultant/estimate", { method: "POST", body: JSON.stringify(body) });
  if ((result.status !== 200 && result.status !== 201) || !result.data) throw new Error(`estimate_${result.status}`);
  return result.data;
}

export async function updateRequest(id: string, body: Record<string, unknown>) {
  const result = await request<{ status?: string; selectedTier?: string; error?: string }>(`/api/consultant/requests/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { ok: result.status === 200, data: result.data };
}

export function formatMoney(value: number, locale: Locale) {
  return value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
}

/** Plain-text summary the customer can save ("دریافت خلاصه پروژه"). */
export function summaryText(result: EstimateResponse, copy: ConsultantCopy, locale: Locale) {
  const { scope, estimate } = result;
  const lines: string[] = [copy.resultTitle, ""];
  if (result.publicRef) lines.push(`${copy.ref}: ${result.publicRef}`, "");
  lines.push(
    `${copy.facts.type}: ${scope.projectType.label}`,
    `${copy.facts.goal}: ${scope.goal.label}`,
    `${copy.facts.tech}: ${scope.architecture.id ? copy.tech[scope.architecture.id] : "—"} — ${scope.architecture.reason}`,
    `${copy.facts.pages}: ${scope.staticPages.join("، ")}`,
    `${copy.facts.complexity}: ${copy.complexity[scope.complexity]}`,
    `${copy.facts.confidence}: ${copy.confidence[scope.confidence]}`,
    "",
    result.summary.text,
    ""
  );
  const tierIds = scope.twoTiers ? (["economic", "professional"] as const) : (["professional"] as const);
  for (const id of tierIds) {
    const tier = scope.tiers[id];
    lines.push(`— ${scope.twoTiers ? copy[id] : copy.single} —`);
    lines.push(`${copy.essential}: ${tier.features.map((f) => f.label).join("، ") || "—"}`);
    if (tier.added.length) lines.push(`${copy.added}: ${tier.added.map((f) => `${f.label} (${f.reason})`).join("؛ ")}`);
    if (tier.deferred.length) lines.push(`${copy.deferred}: ${tier.deferred.map((f) => f.label).join("، ")}`);
    lines.push(`${copy.facts.templates}: ${tier.templates.join("، ")}`);
    if (estimate.status !== "needs_review" && estimate.tiers[id]) {
      const t = estimate.tiers[id]!;
      const unit = estimate.currency.label[locale];
      lines.push(`${copy.priceRange}: ${formatMoney(t.oneTime.min, locale)} – ${formatMoney(t.oneTime.max, locale)} ${unit}`);
      lines.push(`${copy.duration}: ${copy.weeks(t.weeks.min, t.weeks.max)}`);
      lines.push(`${copy.monthly}: ${formatMoney(t.monthly, locale)} ${unit}`);
    } else lines.push(`${copy.priceRange}: ${copy.needsReview}`);
    lines.push("");
  }
  if (scope.needsReview.length) lines.push(copy.reviewItems, ...scope.needsReview.map((item) => `• ${item}`), "");
  lines.push(copy.disclaimer, "", "SoSho Studio — https://sosho-studio.net");
  return lines.join("\n");
}
