"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiCompass, FiX } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { cleanAnswers, interpret, loadConfig, requestEstimate, summaryText, updateRequest } from "./api";
import { consultantCopy } from "./copy";
import EstimateResult from "./EstimateResult";
import type { Answers, ConsultantConfig, EstimateResponse, Option, StepId } from "./types";

type TierId = "economic" | "professional";

type Saved = {
  answers: Answers;
  step: StepId;
  freeText: string;
  consent: boolean;
  result: EstimateResponse | null;
  consultantId: string | null;
  updateToken: string | null;
  publicRef: string | null;
  selectedTier: TierId | null;
  contact: { name: string; contact: string; notes: string; consent: boolean };
};

const EMPTY: Saved = {
  answers: { features: [] },
  step: "projectType",
  freeText: "",
  consent: false,
  result: null,
  consultantId: null,
  updateToken: null,
  publicRef: null,
  selectedTier: null,
  contact: { name: "", contact: "", notes: "", consent: false },
};

const MAIN_STEPS: StepId[] = ["projectType", "goal", "features", "size", "style", "budget"];

function storageKey(locale: Locale) {
  return `sosho.consultant.v1.${locale}`;
}

function readSaved(locale: Locale): Saved {
  try {
    const raw = window.sessionStorage.getItem(storageKey(locale));
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Saved>;
    return { ...EMPTY, ...parsed, answers: { ...EMPTY.answers, ...(parsed.answers ?? {}) }, contact: { ...EMPTY.contact, ...(parsed.contact ?? {}) } };
  } catch {
    return EMPTY;
  }
}

function OptionList({
  name,
  options,
  multiple = false,
  value,
  onChange,
}: {
  name: string;
  options: Option[];
  multiple?: boolean;
  value: string | string[] | undefined;
  onChange: (id: string) => void;
}) {
  const selected = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div role={multiple ? "group" : "radiogroup"} className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option.id} className="relative block cursor-pointer">
          <input
            type={multiple ? "checkbox" : "radio"}
            name={name}
            value={option.id}
            checked={selected(option.id)}
            onChange={() => onChange(option.id)}
            className="peer sr-only"
          />
          <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-foreground/12 bg-surface/30 px-4 py-3 text-sm text-foreground transition-colors peer-checked:border-primary peer-checked:bg-primary/12 peer-focus-visible:ring-2 peer-focus-visible:ring-accent hover:border-foreground/30 motion-reduce:transition-none">
            <span
              aria-hidden="true"
              className={`grid h-5 w-5 shrink-0 place-items-center border ${multiple ? "rounded-md" : "rounded-full"} ${selected(option.id) ? "border-primary bg-primary text-background" : "border-foreground/30"}`}
            >
              {selected(option.id) ? <span className={multiple ? "text-[11px] font-black" : "h-2 w-2 rounded-full bg-background"}>{multiple ? "✓" : ""}</span> : null}
            </span>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function TextField({ id, label, value, onChange, multiline = false, type = "text", placeholder, dir }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  const className = "mt-2 w-full rounded-2xl border border-foreground/15 bg-surface/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30";
  return (
    <label htmlFor={id} className="block text-sm text-muted">
      {label}
      {multiline ? (
        <textarea id={id} value={value} maxLength={500} rows={3} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={className} dir={dir} />
      ) : (
        <input id={id} type={type} value={value} maxLength={type === "url" ? 300 : 200} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={className} dir={dir} />
      )}
    </label>
  );
}

export default function ConsultantDialog({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const copy = consultantCopy(locale);
  const [config, setConfig] = useState<ConsultantConfig | null>(null);
  const [configError, setConfigError] = useState(false);
  const [state, setState] = useState<Saved>(() => readSaved(locale));
  const [returnToReview, setReturnToReview] = useState(false);
  const [busy, setBusy] = useState<"interpret" | "estimate" | "contact" | null>(null);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFa = locale === "fa";

  const { answers } = state;
  const update = useCallback((patch: Partial<Saved>) => setState((current) => ({ ...current, ...patch })), []);
  const setAnswers = (patch: Partial<Answers>) => setState((current) => ({ ...current, answers: { ...current.answers, ...patch } }));

  // Keep the session so closing the window (or a refresh) does not lose the answers.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(storageKey(locale), JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode); the dialog still works for this page view.
    }
  }, [state, locale]);

  const fetchConfig = useCallback(() => {
    setConfigError(false);
    loadConfig(locale).then(setConfig).catch(() => setConfigError(true));
  }, [locale]);

  useEffect(() => {
    if (open && !config) fetchConfig();
  }, [open, config, fetchConfig]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the dialog itself at once (the question heading may still be loading), so the
    // keyboard is never left on the page behind the overlay.
    window.setTimeout(() => (headingRef.current ?? panelRef.current)?.focus(), 0);
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    // Move focus to the new step's heading so screen readers announce it. Also runs when the
    // question list arrives, because on the first open the heading only exists after that.
    if (open && config) window.setTimeout(() => headingRef.current?.focus(), 30);
  }, [state.step, open, config]);

  const contentAsked = Boolean(config && answers.projectType && config.questions.content.forTypes.includes(answers.projectType));
  const steps = useMemo<StepId[]>(
    () => ["projectType", "goal", "features", "size", "style", ...(contentAsked ? (["content"] as StepId[]) : []), "budget"],
    [contentAsked]
  );

  const answered = (step: StepId) => {
    switch (step) {
      case "projectType": return Boolean(answers.projectType);
      case "goal": return Boolean(answers.goal);
      case "features": return true;
      case "size": return Boolean(answers.size);
      case "style": return Boolean(answers.style);
      case "content": return Boolean(answers.content);
      case "budget": return Boolean(answers.budget && answers.timeframe);
      default: return true;
    }
  };

  const goTo = (step: StepId) => {
    setMessage(null);
    update({ step });
  };
  const next = () => {
    if (returnToReview) { setReturnToReview(false); goTo("review"); return; }
    const index = steps.indexOf(state.step);
    goTo(index >= 0 && index < steps.length - 1 ? steps[index + 1] : "review");
  };
  const back = () => {
    const order: StepId[] = [...steps, "review", "result", "contact"];
    const index = order.indexOf(state.step);
    if (state.step === "contact") goTo("result");
    else if (index > 0) goTo(order[index - 1]);
  };

  function chooseProjectType(id: string) {
    const allowed = new Set(config?.questions.features.byType[id]?.map((option) => option.id) ?? []);
    setAnswers({
      projectType: id,
      features: answers.projectType === id ? answers.features : answers.features.filter((feature) => allowed.has(feature)),
      size: answers.projectType === id ? answers.size : undefined,
      content: config?.questions.content.forTypes.includes(id) ? answers.content : undefined,
    });
  }

  async function runInterpret() {
    const text = state.freeText.trim();
    if (text.length < 3) return;
    setBusy("interpret");
    setMessage(null);
    const result = await interpret(locale, text, answers.projectType).catch(() => null);
    setBusy(null);
    const patch: Partial<Answers> = { projectTypeNote: text.slice(0, 500) };
    if (!result || (!result.projectType && !result.goal && !result.features.length && !result.size && !result.style)) {
      setAnswers(patch);
      setMessage({ tone: "info", text: copy.interpretNone });
      return;
    }
    const type = result.projectType ?? answers.projectType;
    const allowed = new Set(type ? config?.questions.features.byType[type]?.map((option) => option.id) ?? [] : []);
    const merged: Answers = {
      ...answers,
      ...patch,
      projectType: type,
      goal: answers.goal ?? result.goal ?? undefined,
      features: [...new Set([...answers.features, ...result.features])].filter((feature) => allowed.has(feature)),
      size: answers.size ?? result.size ?? undefined,
      style: answers.style ?? result.style ?? undefined,
      featuresNote: answers.featuresNote ?? result.note ?? undefined,
    };
    // Questions already answered by the text are not asked again: jump to the first open one.
    const isOpen: Record<string, boolean> = {
      goal: !merged.goal,
      features: merged.features.length === 0,
      size: !merged.size,
      style: !merged.style,
      budget: !(merged.budget && merged.timeframe),
    };
    const firstOpen = (["goal", "features", "size", "style", "budget"] as StepId[]).find((step) => isOpen[step]);
    setState((current) => ({ ...current, answers: merged, step: merged.projectType ? firstOpen ?? "review" : current.step }));
    setMessage({ tone: "info", text: copy.interpretDone });
  }

  async function getEstimate() {
    setBusy("estimate");
    setMessage(null);
    try {
      const body: Record<string, unknown> = { locale, answers: cleanAnswers(answers, contentAsked) };
      if (state.consultantId && state.updateToken) Object.assign(body, { consent: true, consultantId: state.consultantId, updateToken: state.updateToken });
      else Object.assign(body, { consent: state.consent, clientRequestId: crypto.randomUUID() });
      const result = await requestEstimate(body);
      setState((current) => ({
        ...current,
        result,
        step: "result",
        selectedTier: null,
        consultantId: result.consultantId ?? current.consultantId,
        updateToken: result.updateToken ?? current.updateToken,
        publicRef: result.publicRef ?? current.publicRef,
      }));
    } catch {
      setMessage({ tone: "error", text: copy.estimateError });
    } finally {
      setBusy(null);
    }
  }

  function selectTier(tier: TierId) {
    update({ selectedTier: tier });
    if (state.consultantId && state.updateToken) {
      void updateRequest(state.consultantId, { updateToken: state.updateToken, action: "select", tier }).catch(() => null);
    }
  }

  async function submitContact() {
    setBusy("contact");
    setMessage(null);
    try {
      let id = state.consultantId;
      let token = state.updateToken;
      let ref = state.publicRef;
      if (!id || !token) {
        // The customer did not agree to saving earlier; the consultation request is that agreement.
        const created = await requestEstimate({ locale, answers: cleanAnswers(answers, contentAsked), consent: true, clientRequestId: crypto.randomUUID() });
        id = created.consultantId ?? null;
        token = created.updateToken ?? null;
        ref = created.publicRef ?? null;
        setState((current) => ({ ...current, result: { ...created }, consultantId: id, updateToken: token, publicRef: ref }));
      }
      if (!id || !token) throw new Error("not_stored");
      const sent = await updateRequest(id, {
        updateToken: token,
        action: "contact",
        name: state.contact.name,
        contact: state.contact.contact,
        notes: state.contact.notes || undefined,
        consent: true,
        ...(state.selectedTier ? { tier: state.selectedTier } : {}),
      });
      if (!sent.ok) throw new Error("contact_failed");
      update({ step: "done", publicRef: ref });
    } catch {
      setMessage({ tone: "error", text: copy.contactError });
    } finally {
      setBusy(null);
    }
  }

  function download() {
    if (!state.result) return;
    const text = summaryText({ ...state.result, publicRef: state.publicRef ?? state.result.publicRef }, copy, locale);
    const url = URL.createObjectURL(new Blob([`﻿${text}`], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${copy.summaryFile}${state.publicRef ? `-${state.publicRef}` : ""}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function startOver() {
    setReturnToReview(false);
    setMessage(null);
    setState(EMPTY);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    // Keep keyboard focus inside the dialog.
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex='-1'])")]
      .filter((element) => element.offsetParent !== null || element === document.activeElement);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  const step = state.step;
  const mainIndex = MAIN_STEPS.indexOf(step);
  const isQuestion = steps.includes(step);
  const BackIcon = isFa ? FiArrowRight : FiArrowLeft;
  const NextIcon = isFa ? FiArrowLeft : FiArrowRight;
  const sizeQuestion = answers.projectType ? config?.questions.size.byType[answers.projectType] : undefined;
  const featureOptions = answers.projectType ? config?.questions.features.byType[answers.projectType] ?? [] : [];
  const labelOf = (options: Option[] | undefined, id?: string) => options?.find((option) => option.id === id)?.label ?? "—";

  let title = copy.title;
  let body: ReactNode = null;
  if (config && isQuestion) {
    const q = config.questions;
    if (step === "projectType") {
      title = q.projectType.label;
      body = (
        <div className="grid gap-5">
          <OptionList name="projectType" options={q.projectType.options} value={answers.projectType} onChange={chooseProjectType} />
          {answers.projectType === "unsure" ? (
            <TextField id="c-type-note" label={copy.projectTypeNote} value={answers.projectTypeNote ?? ""} onChange={(value) => setAnswers({ projectTypeNote: value })} multiline />
          ) : null}
          <div className="rounded-2xl border border-dashed border-foreground/15 p-4">
            <TextField id="c-free" label={copy.freeTextLabel} value={state.freeText} onChange={(value) => update({ freeText: value })} placeholder={copy.freeTextPlaceholder} multiline />
            <button
              type="button"
              onClick={() => void runInterpret()}
              disabled={busy !== null || state.freeText.trim().length < 3}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-primary/50 px-4 text-sm font-bold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "interpret" ? copy.interpreting : copy.interpret}
            </button>
          </div>
        </div>
      );
    } else if (step === "goal") {
      title = q.goal.label;
      body = (
        <div className="grid gap-4">
          <OptionList name="goal" options={q.goal.options} value={answers.goal} onChange={(id) => setAnswers({ goal: id })} />
          {answers.goal === "other" ? <TextField id="c-goal-note" label={copy.goalNote} value={answers.goalNote ?? ""} onChange={(value) => setAnswers({ goalNote: value })} /> : null}
        </div>
      );
    } else if (step === "features") {
      title = q.features.label;
      body = (
        <div className="grid gap-4">
          <p className="text-xs text-muted">{copy.multiHint}</p>
          <OptionList
            name="features"
            multiple
            options={featureOptions}
            value={answers.features}
            onChange={(id) => setAnswers({ features: answers.features.includes(id) ? answers.features.filter((item) => item !== id) : [...answers.features, id] })}
          />
          <TextField id="c-features-note" label={copy.featuresNote} value={answers.featuresNote ?? ""} onChange={(value) => setAnswers({ featuresNote: value })} />
        </div>
      );
    } else if (step === "size") {
      title = sizeQuestion?.label ?? copy.title;
      body = <OptionList name="size" options={sizeQuestion?.options ?? []} value={answers.size} onChange={(id) => setAnswers({ size: id })} />;
    } else if (step === "style") {
      title = q.style.label;
      body = (
        <div className="grid gap-4">
          <OptionList name="style" options={q.style.options} value={answers.style} onChange={(id) => setAnswers({ style: id })} />
          {answers.style === "reference" ? (
            <TextField id="c-ref" type="url" dir="ltr" label={copy.referenceUrl} value={answers.referenceUrl ?? ""} onChange={(value) => setAnswers({ referenceUrl: value })} placeholder="https://" />
          ) : null}
        </div>
      );
    } else if (step === "content") {
      title = q.content.label;
      body = <OptionList name="content" options={q.content.options} value={answers.content} onChange={(id) => setAnswers({ content: id })} />;
    } else if (step === "budget") {
      title = q.budget.label;
      body = (
        <div className="grid gap-5">
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-foreground">{copy.budgetTitle}{config.currencyLabel ? ` (${config.currencyLabel})` : ""}</legend>
            <OptionList name="budget" options={q.budget.options} value={answers.budget} onChange={(id) => setAnswers({ budget: id })} />
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-foreground">{copy.timeframeTitle}</legend>
            <OptionList name="timeframe" options={q.budget.timeframes} value={answers.timeframe} onChange={(id) => setAnswers({ timeframe: id })} />
          </fieldset>
          <TextField id="c-time-note" label={copy.timeframeNote} value={answers.timeframeNote ?? ""} onChange={(value) => setAnswers({ timeframeNote: value })} />
        </div>
      );
    }
  } else if (config && step === "review") {
    title = copy.reviewTitle;
    const q = config.questions;
    const rows: Array<[StepId, string, string]> = [
      ["projectType", q.projectType.label, labelOf(q.projectType.options, answers.projectType)],
      ["goal", q.goal.label, answers.goal === "other" && answers.goalNote ? answers.goalNote : labelOf(q.goal.options, answers.goal)],
      ["features", q.features.label, [...answers.features.map((id) => labelOf(featureOptions, id)), answers.featuresNote].filter(Boolean).join(isFa ? "، " : ", ") || "—"],
      ["size", sizeQuestion?.label ?? "", labelOf(sizeQuestion?.options, answers.size)],
      ["style", q.style.label, `${labelOf(q.style.options, answers.style)}${answers.style === "reference" && answers.referenceUrl ? ` (${answers.referenceUrl})` : ""}`],
      ...(contentAsked ? [["content", q.content.label, labelOf(q.content.options, answers.content)] as [StepId, string, string]] : []),
      ["budget", q.budget.label, `${labelOf(q.budget.options, answers.budget)} · ${labelOf(q.budget.timeframes, answers.timeframe)}`],
    ];
    const complete = steps.every(answered);
    body = (
      <div className="grid gap-5">
        <p className="text-sm text-muted">{copy.reviewHint}</p>
        <dl className="grid gap-2">
          {rows.map(([id, label, value]) => (
            <div key={id} className="flex items-start justify-between gap-3 rounded-2xl border border-foreground/10 bg-surface/30 px-4 py-3">
              <div className="min-w-0">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 wrap-break-word text-sm font-semibold text-foreground">{value}</dd>
              </div>
              <button
                type="button"
                onClick={() => { setReturnToReview(true); goTo(id); }}
                className="shrink-0 rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`${copy.edit}: ${label}`}
              >
                {copy.edit}
              </button>
            </div>
          ))}
        </dl>
        <TextField id="c-notes" label={copy.notes} value={answers.notes ?? ""} onChange={(value) => setAnswers({ notes: value })} multiline />
        {state.consultantId ? null : (
          <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
            <input type="checkbox" checked={state.consent} onChange={(event) => update({ consent: event.target.checked })} className="mt-1 h-4 w-4 accent-primary" />
            <span>
              {copy.consent}
              <span className="block text-xs text-muted">{copy.consentHint}</span>
            </span>
          </label>
        )}
        <button
          type="button"
          onClick={() => void getEstimate()}
          disabled={!complete || busy !== null}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "estimate" ? copy.estimating : copy.getEstimate}
        </button>
      </div>
    );
  } else if (step === "result" && state.result) {
    title = copy.resultTitle;
    body = (
      <EstimateResult
        result={{ ...state.result, publicRef: state.publicRef ?? state.result.publicRef }}
        copy={copy}
        locale={locale}
        selectedTier={state.selectedTier}
        onSelect={selectTier}
        onConsult={() => goTo("contact")}
        onDownload={download}
        onEdit={() => goTo("review")}
      />
    );
  } else if (step === "contact") {
    title = copy.contactTitle;
    const contact = state.contact;
    const setContact = (patch: Partial<Saved["contact"]>) => setState((current) => ({ ...current, contact: { ...current.contact, ...patch } }));
    const ready = contact.name.trim().length >= 2 && contact.contact.trim().length >= 5 && contact.consent;
    body = (
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) void submitContact();
        }}
      >
        <p className="text-sm text-muted">{copy.contactIntro}</p>
        <TextField id="c-name" label={copy.name} value={contact.name} onChange={(value) => setContact({ name: value })} />
        <TextField id="c-contact" label={copy.contact} value={contact.contact} onChange={(value) => setContact({ contact: value })} dir="ltr" type="text" />
        <TextField id="c-contact-notes" label={copy.contactNotes} value={contact.notes} onChange={(value) => setContact({ notes: value })} multiline />
        <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <input type="checkbox" checked={contact.consent} onChange={(event) => setContact({ consent: event.target.checked })} className="mt-1 h-4 w-4 accent-primary" />
          <span>{copy.contactConsent}</span>
        </label>
        <button
          type="submit"
          disabled={!ready || busy !== null}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "contact" ? copy.submitting : copy.submit}
        </button>
      </form>
    );
  } else if (step === "done") {
    title = copy.doneTitle;
    body = (
      <div className="grid justify-items-start gap-4">
        <FiCheckCircle className="h-12 w-12 text-success" aria-hidden="true" />
        <p className="text-sm leading-7 text-foreground">{copy.doneBody(state.publicRef ?? "—")}</p>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex h-11 items-center rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copy.startOver}
        </button>
      </div>
    );
  }

  // The follow-up (content) question sits between style and budget on the bar.
  const progress = Math.round(((mainIndex >= 0 ? mainIndex : MAIN_STEPS.length - 1.5) / MAIN_STEPS.length) * 100);

  return (
    <div className={open ? "fixed inset-0 z-90 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6" : "hidden"} onKeyDown={onKeyDown}>
      <button type="button" aria-hidden="true" tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="consultant-step-title"
        dir={isFa ? "rtl" : "ltr"}
        className="consultant-panel relative flex max-h-dvh w-full flex-col overflow-clip outline-none rounded-t-[1.75rem] border border-white/10 bg-background shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-[1.75rem]"
      >
        <header className="relative shrink-0 overflow-hidden border-b border-white/10 px-5 py-4">
          <div className="pointer-events-none absolute -end-10 -top-14 h-36 w-36 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-background">
              <FiCompass className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-white">{copy.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {isQuestion ? (step === "content" ? copy.followUp : copy.questionOf(mainIndex + 1, MAIN_STEPS.length)) : copy.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={copy.close}
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {isQuestion ? (
            <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={copy.questionOf(mainIndex + 1, MAIN_STEPS.length)}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.max(8, progress)}%` }} />
            </div>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {!config && !configError ? <p role="status" className="text-sm text-muted">{copy.loading}</p> : null}
          {configError ? (
            <div role="alert" className="grid justify-items-start gap-3 text-sm text-danger">
              {copy.loadError}
              <button type="button" onClick={fetchConfig} className="rounded-full border border-danger/40 px-4 py-2 text-sm text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                {copy.retry}
              </button>
            </div>
          ) : null}
          {config ? (
            <div key={step} className="consultant-step">
              <h2 id="consultant-step-title" ref={headingRef} tabIndex={-1} className="mb-5 text-lg font-extrabold leading-8 text-foreground outline-none sm:text-xl">
                {title}
              </h2>
              {body}
              {message ? (
                <p role={message.tone === "error" ? "alert" : "status"} className={`mt-4 rounded-2xl border p-3 text-sm leading-6 ${message.tone === "error" ? "border-danger/30 bg-danger/10 text-danger" : "border-primary/30 bg-primary/10 text-foreground"}`}>
                  {message.text}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {config && (isQuestion || step === "review" || step === "contact") ? (
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
            {step !== "projectType" ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold text-muted hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <BackIcon className="h-4 w-4" aria-hidden="true" />
                {copy.back}
              </button>
            ) : <span />}
            {isQuestion ? (
              <button
                type="button"
                onClick={next}
                disabled={!answered(step)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.next}
                <NextIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
