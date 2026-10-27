"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheck, FiClock, FiDownload, FiEdit2, FiMessageCircle } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { formatMoney } from "./api";
import type { ConsultantCopy } from "./copy";
import type { EstimateResponse } from "./types";

type TierId = "economic" | "professional";

export default function EstimateResult({
  result,
  copy,
  locale,
  selectedTier,
  onSelect,
  onConsult,
  onDownload,
  onEdit,
}: {
  result: EstimateResponse;
  copy: ConsultantCopy;
  locale: Locale;
  selectedTier: TierId | null;
  onSelect: (tier: TierId) => void;
  onConsult: () => void;
  onDownload: () => void;
  onEdit: () => void;
}) {
  const { scope, estimate, summary } = result;
  const tierIds: TierId[] = scope.twoTiers ? ["economic", "professional"] : ["professional"];
  const [tab, setTab] = useState<TierId>(selectedTier ?? tierIds[0]);
  const priced = estimate.status !== "needs_review";
  const unit = priced ? estimate.currency.label[locale] : "";

  const facts: Array<[string, string]> = [
    [copy.facts.type, scope.projectType.label],
    [copy.facts.goal, scope.goal.label],
    [copy.facts.tech, scope.architecture.id ? `${copy.tech[scope.architecture.id]} — ${scope.architecture.reason}` : scope.architecture.reason],
    [copy.facts.pages, `${scope.staticPages.length.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} (${scope.staticPages.join(locale === "fa" ? "، " : ", ")})`],
    [copy.facts.complexity, copy.complexity[scope.complexity]],
    [copy.facts.confidence, copy.confidence[scope.confidence]],
  ];

  return (
    <div className="grid gap-5">
      <div>
        {result.publicRef ? (
          <p className="text-xs font-bold tracking-[0.12em] text-accent">
            {copy.ref}: <span dir="ltr">{result.publicRef}</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-7 text-muted">{summary.text}</p>
      </div>

      <dl className="grid gap-3 rounded-2xl border border-foreground/10 bg-surface/30 p-4 sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label} className={label === copy.facts.tech ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-bold text-accent">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-foreground">{value}</dd>
          </div>
        ))}
        {scope.architecture.alternative ? (
          <p className="text-xs leading-6 text-muted sm:col-span-2">{scope.architecture.alternative.note}</p>
        ) : null}
      </dl>

      {!priced ? (
        <p className="flex items-start gap-2 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm leading-7 text-foreground">
          <FiAlertCircle className="mt-1 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          <span>
            <strong className="font-bold">{copy.needsReview}.</strong>{" "}
            {estimate.reason === "consultation" ? copy.needsReviewConsultation : copy.needsReviewNoTariff}
          </span>
        </p>
      ) : null}

      {scope.twoTiers ? (
        <div role="tablist" aria-label={copy.resultTitle} className="flex gap-2 md:hidden">
          {tierIds.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tier-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`tier-panel-${id}`}
              onClick={() => setTab(id)}
              className={`flex-1 rounded-full border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${tab === id ? "border-primary bg-primary text-background" : "border-foreground/15 text-foreground"}`}
            >
              {copy[id]}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs leading-6 text-muted">{copy.singleNote}</p>
      )}

      <div className={`grid gap-4 ${scope.twoTiers ? "md:grid-cols-2" : ""}`}>
        {tierIds.map((id) => {
          const tier = scope.tiers[id];
          const price = priced ? estimate.tiers[id] : undefined;
          const chosen = selectedTier === id;
          return (
            <section
              key={id}
              id={`tier-panel-${id}`}
              role={scope.twoTiers ? "tabpanel" : undefined}
              aria-labelledby={scope.twoTiers ? `tier-tab-${id}` : undefined}
              className={`${scope.twoTiers && tab !== id ? "hidden md:flex" : "flex"} flex-col gap-3 rounded-2xl border p-4 ${chosen ? "border-primary bg-primary/10" : "border-foreground/10 bg-surface/30"}`}
            >
              <div>
                <h4 className="text-base font-extrabold text-foreground">{scope.twoTiers ? copy[id] : copy.single}</h4>
                <p className="mt-1 text-xs text-muted">{id === "economic" ? copy.economicGoal : copy.professionalGoal}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-accent">{copy.priceRange}</p>
                <p className="mt-1 text-lg font-extrabold text-foreground">
                  {price ? `${formatMoney(price.oneTime.min, locale)} – ${formatMoney(price.oneTime.max, locale)} ${unit}` : copy.needsReview}
                </p>
                {price ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.duration}: {copy.weeks(price.weeks.min, price.weeks.max)}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-bold text-accent">{copy.essential}</p>
                <ul className="mt-2 grid gap-1.5">
                  {tier.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2 text-sm text-foreground">
                      <FiCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                      {feature.label}
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm text-muted">
                    <FiCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    {copy.facts.templates}: {tier.templates.join(locale === "fa" ? "، " : ", ")}
                  </li>
                </ul>
              </div>
              {tier.added.length ? (
                <div>
                  <p className="text-xs font-bold text-accent">{copy.added}</p>
                  <ul className="mt-2 grid gap-1.5">
                    {tier.added.map((feature) => (
                      <li key={feature.id} className="text-sm leading-6 text-foreground">
                        {feature.label} <span className="text-xs text-muted">— {feature.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {tier.deferred.length ? (
                <p className="text-xs leading-6 text-muted">
                  {copy.deferred}: {tier.deferred.map((feature) => feature.label).join(locale === "fa" ? "، " : ", ")}
                </p>
              ) : null}
              {price ? (
                <p className="text-xs leading-6 text-muted">
                  {copy.monthly}: {formatMoney(price.monthly, locale)} {unit}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-pressed={chosen}
                className={`mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${chosen ? "bg-primary text-background" : "border border-foreground/15 text-foreground hover:border-primary"}`}
              >
                {chosen ? <FiCheck className="h-4 w-4" aria-hidden="true" /> : null}
                {chosen ? copy.chosen : copy.choose}
              </button>
            </section>
          );
        })}
      </div>

      {priced ? (
        <div className="grid gap-2 text-xs leading-6 text-muted">
          <p>
            {copy.domainYearly}: {formatMoney(estimate.recurring.domainYearly, locale)} {unit}
            {estimate.recurring.supportMonthly !== null ? ` · ${copy.supportMonthly}: ${formatMoney(estimate.recurring.supportMonthly, locale)} ${unit}` : ""}
          </p>
          {estimate.status === "partial" ? <p>{copy.partial}</p> : null}
          {estimate.budgetFit === "below" ? <p className="text-warning">{copy.budgetBelow}</p> : null}
          {estimate.timelineFit === "tight" ? <p className="text-warning">{copy.timelineTight}</p> : null}
        </div>
      ) : null}

      {scope.needsReview.length || summary.ambiguities.length ? (
        <div className="rounded-2xl border border-foreground/10 bg-surface/20 p-4">
          <p className="text-xs font-bold text-accent">{copy.reviewItems}</p>
          <ul className="mt-2 grid gap-1.5 text-sm leading-6 text-muted">
            {[...scope.needsReview, ...summary.ambiguities].map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-xs leading-6 text-muted">{copy.disclaimer}</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onConsult}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <FiMessageCircle className="h-4 w-4" aria-hidden="true" />
          {copy.requestConsult}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiDownload className="h-4 w-4" aria-hidden="true" />
          {copy.download}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiEdit2 className="h-4 w-4" aria-hidden="true" />
          {copy.editAnswers}
        </button>
      </div>
    </div>
  );
}
