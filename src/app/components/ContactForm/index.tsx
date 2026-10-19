"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FiCheckCircle, FiSend } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

type Status = "idle" | "sending" | "success" | "error";
type FieldName = "name" | "contact" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const PHONE_PATTERN = /^\+?[\d۰-۹٠-٩\s().-]+$/u;

const copy = {
  fa: {
    title: "پیام بگذارید، خودم پاسخ می‌دهم",
    intro: "نام، راه تماس و توضیح کوتاهی از نیازتان را بنویسید. پیام شما را می‌خوانم و در اولین فرصت جواب می‌دهم.",
    name: "نام شما",
    contact: "شماره تماس یا ایمیل",
    contactHint: "برای پاسخ‌گویی از همین راه با شما تماس می‌گیریم.",
    message: "پیام شما",
    send: "ارسال پیام",
    sending: "در حال ارسال…",
    successTitle: "پیام شما ثبت شد",
    successBody: "ممنون! پیام شما را می‌خوانم و از همان راه تماسی که نوشتید جواب می‌دهم.",
    another: "ارسال پیام دیگر",
    errors: {
      name: "نام را بنویسید (حداقل ۲ حرف).",
      contact: "یک شماره تماس یا ایمیل معتبر وارد کنید.",
      message: "پیام باید حداقل ۱۰ کاراکتر باشد.",
      invalid: "اطلاعات واردشده معتبر نیست. فیلدها را بررسی کنید.",
      rate: "تعداد ارسال‌ها زیاد بود. کمی بعد دوباره تلاش کنید یا از واتس‌اپ و تماس تلفنی استفاده کنید.",
      network: "ارتباط برقرار نشد. اینترنت را بررسی کنید و دوباره تلاش کنید.",
      unavailable: "ثبت پیام در حال حاضر ممکن نیست. لطفاً از واتس‌اپ یا تماس تلفنی استفاده کنید.",
    },
  },
  en: {
    title: "Leave a message, I’ll reply personally",
    intro: "Share your name, how to reach you, and a short note about what you need. I read every message and reply as soon as I can.",
    name: "Your name",
    contact: "Phone number or email",
    contactHint: "This is how we will get back to you.",
    message: "Your message",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Your message was received",
    successBody: "Thank you! I’ll read it and reply using the contact detail you left.",
    another: "Send another message",
    errors: {
      name: "Please enter your name (at least 2 characters).",
      contact: "Enter a valid phone number or email address.",
      message: "The message needs at least 10 characters.",
      invalid: "Some details look invalid. Please check the fields.",
      rate: "Too many submissions. Try again a bit later, or use WhatsApp or a phone call.",
      network: "Could not connect. Check your internet connection and try again.",
      unavailable: "Messages cannot be saved right now. Please use WhatsApp or call us.",
    },
  },
} as const;

function isContactMethod(value: string) {
  if (EMAIL_PATTERN.test(value)) return true;
  if (!PHONE_PATTERN.test(value)) return false;
  const digits = value.replace(/[^\d۰-۹٠-٩]/gu, "");
  return digits.length >= 7 && digits.length <= 15;
}

function validate(values: Record<FieldName, string>, text: (typeof copy)[Locale]): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.replace(/\s+/gu, " ").trim();
  const contact = values.contact.trim();
  const message = values.message.trim();
  if (name.length < 2 || name.length > 80) errors.name = text.errors.name;
  if (contact.length < 5 || contact.length > 120 || !isContactMethod(contact)) {
    errors.contact = text.errors.contact;
  }
  if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    errors.message = text.errors.message;
  }
  return errors;
}

const fieldClass =
  "w-full rounded-2xl border border-foreground/15 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40";

export default function ContactForm({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const baseId = useId();
  const [values, setValues] = useState<Record<FieldName, string>>({ name: "", contact: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // The thank-you card is shorter than the form; keep it in view instead of
  // letting the shrinking page jump the visitor to a different section.
  useEffect(() => {
    if (status === "success") successRef.current?.scrollIntoView({ block: "center" });
  }, [status]);

  function update(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const errors = validate(values, text);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          name: values.name.replace(/\s+/gu, " ").trim(),
          contact: values.contact.trim(),
          message: values.message.trim(),
          locale,
          company: honeypot,
        }),
      });
      if (response.ok) {
        setValues({ name: "", contact: "", message: "" });
        setStatus("success");
        return;
      }
      setStatus("error");
      if (response.status === 400) setFormError(text.errors.invalid);
      else if (response.status === 429) setFormError(text.errors.rate);
      else setFormError(text.errors.unavailable);
    } catch {
      setStatus("error");
      setFormError(text.errors.network);
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        className="flex h-full flex-col items-start justify-center gap-4 rounded-3xl border border-accent/30 bg-background/40 p-6 sm:p-8"
      >
        <FiCheckCircle className="h-8 w-8 text-accent" aria-hidden="true" />
        <h3 className="text-xl font-extrabold text-foreground">{text.successTitle}</h3>
        <p className="text-sm leading-7 text-muted">{text.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full border border-foreground/15 px-5 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {text.another}
        </button>
      </div>
    );
  }

  const nameId = `${baseId}-name`;
  const contactId = `${baseId}-contact`;
  const messageId = `${baseId}-message`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/30 p-6 sm:p-8"
      aria-labelledby={`${baseId}-title`}
    >
      <h3 id={`${baseId}-title`} className="text-xl font-extrabold text-foreground sm:text-2xl">
        {text.title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted">{text.intro}</p>

      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor={nameId} className="mb-2 block text-sm font-semibold text-foreground">
            {text.name}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
            className={fieldClass}
          />
          {fieldErrors.name ? (
            <p id={`${nameId}-error`} className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={contactId} className="mb-2 block text-sm font-semibold text-foreground">
            {text.contact}
          </label>
          <input
            id={contactId}
            name="contact"
            type="text"
            inputMode="email"
            autoComplete="email tel"
            dir="ltr"
            maxLength={120}
            value={values.contact}
            onChange={(event) => update("contact", event.target.value)}
            aria-invalid={fieldErrors.contact ? true : undefined}
            aria-describedby={`${contactId}-hint${fieldErrors.contact ? ` ${contactId}-error` : ""}`}
            className={`${fieldClass} text-start`}
          />
          <p id={`${contactId}-hint`} className="mt-1.5 text-xs text-muted">{text.contactHint}</p>
          {fieldErrors.contact ? (
            <p id={`${contactId}-error`} className="mt-1 text-xs text-red-400">{fieldErrors.contact}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={messageId} className="mb-2 block text-sm font-semibold text-foreground">
            {text.message}
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={5}
            maxLength={MAX_MESSAGE_LENGTH}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? `${messageId}-error` : undefined}
            className={`${fieldClass} resize-y`}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            {fieldErrors.message ? (
              <p id={`${messageId}-error`} className="text-xs text-red-400">{fieldErrors.message}</p>
            ) : <span />}
            <span dir="ltr" className="text-xs text-muted">
              {values.message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        {/* Honeypot: invisible to people and assistive tech, bots tend to fill it. */}
        <div aria-hidden="true" style={{ position: "absolute", insetInlineStart: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label>
            Company
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </label>
        </div>
      </div>

      {formError ? (
        <p role="alert" className="mt-4 rounded-2xl border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none sm:w-auto"
      >
        <FiSend className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        {status === "sending" ? text.sending : text.send}
      </button>
    </form>
  );
}
