"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { FiMessageCircle, FiRefreshCw, FiSend, FiX, FiZap } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  quickReplies?: string[];
};

type SalesReply = {
  conversationId: string;
  leadId: string;
  reply: string;
  stage: "discovery" | "qualification" | "proposal_ready" | "handoff";
  quickReplies?: string[];
  isComplete?: boolean;
};

const COPY = {
  fa: {
    launcher: "مشاوره هوشمند",
    title: "دستیار فروش سوشو",
    subtitle: "نیازتان را بررسی می‌کنم و مسیر مناسب را پیشنهاد می‌دهم.",
    greeting:
      "سلام 👋 من دستیار فروش سوشو هستم. برای شروع، خیلی کوتاه بگویید چه کسب‌وکاری دارید و چه سایتی می‌خواهید؟",
    placeholder: "پیامتان را بنویسید...",
    send: "ارسال پیام",
    reset: "شروع گفت‌وگوی جدید",
    close: "بستن گفت‌وگو",
    typing: "در حال بررسی...",
    error:
      "فعلاً نتوانستم پاسخ را دریافت کنم. دوباره تلاش کنید یا از طریق اینستاگرام پیام بدهید.",
    starterReplies: [
      "سایت شرکتی می‌خواهم",
      "فروشگاه اینترنتی می‌خواهم",
      "وب‌اپلیکیشن اختصاصی دارم",
    ],
  },
  en: {
    launcher: "AI consultation",
    title: "Sosho sales assistant",
    subtitle: "I’ll understand your needs and suggest the right path.",
    greeting:
      "Hi 👋 I’m Sosho’s sales assistant. To begin, briefly tell me about your business and the website you need.",
    placeholder: "Write your message...",
    send: "Send message",
    reset: "Start a new conversation",
    close: "Close conversation",
    typing: "Reviewing your request...",
    error:
      "I couldn’t receive a response right now. Please try again or message us on Instagram.",
    starterReplies: [
      "I need a company website",
      "I need an online store",
      "I have a custom web app",
    ],
  },
} as const;

function messageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function SalesAssistant({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: copy.greeting,
      quickReplies: [...copy.starterReplies],
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastQuickReplies = useMemo(
    () => messages.at(-1)?.quickReplies ?? [],
    [messages]
  );

  function openChat() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  function resetChat() {
    setConversationId(null);
    setDraft("");
    setMessages([
      {
        id: messageId(),
        role: "assistant",
        content: copy.greeting,
        quickReplies: [...copy.starterReplies],
      },
    ]);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  async function sendMessage(content: string) {
    const normalized = content.trim();
    if (!normalized || isSending) return;

    setDraft("");
    setIsSending(true);
    setMessages((current) => [
      ...current.map((message) => ({ ...message, quickReplies: undefined })),
      { id: messageId(), role: "user", content: normalized },
    ]);

    try {
      const response = await fetch("/api/sales/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          locale,
          message: normalized,
          messageCount:
            messages.filter((message) => message.role === "user").length + 1,
          source: "website",
        }),
      });

      if (!response.ok) throw new Error(`Sales API returned ${response.status}`);

      const result = (await response.json()) as SalesReply;
      setConversationId(result.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          content: result.reply,
          quickReplies: result.quickReplies,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: messageId(), role: "assistant", content: copy.error },
      ]);
    } finally {
      setIsSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  return (
    <div className="fixed bottom-4 end-4 z-[70] sm:bottom-6 sm:end-6">
      {isOpen ? (
        <section
          aria-label={copy.title}
          className="flex h-[min(680px,calc(100dvh-2rem))] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1018]/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <header className="relative overflow-hidden border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="pointer-events-none absolute -end-8 -top-12 h-36 w-36 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
                <FiZap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-extrabold text-white">{copy.title}</h2>
                <p className="mt-1 truncate text-xs text-slate-400">{copy.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={resetChat}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={copy.reset}
                title={copy.reset}
              >
                <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={copy.close}
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-ee-md bg-primary text-white"
                      : "rounded-es-md border border-white/10 bg-white/[0.06] text-slate-200"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {lastQuickReplies.length > 0 && !isSending ? (
              <div className="flex flex-wrap gap-2">
                {lastQuickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => void sendMessage(reply)}
                    className="rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ) : null}

            {isSending ? (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-es-md border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-slate-400">
                  {copy.typing}
                </p>
              </div>
            ) : null}
          </div>

          <form onSubmit={submit} className="border-t border-white/10 bg-black/15 p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-2 focus-within:border-accent/45">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                placeholder={copy.placeholder}
                className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-slate-950 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transform-none"
                aria-label={copy.send}
              >
                <FiSend className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={openChat}
          className="group flex h-14 items-center gap-3 rounded-full border border-white/10 bg-[#101827]/95 px-4 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transform-none sm:h-16 sm:px-5"
          aria-label={copy.launcher}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 sm:h-11 sm:w-11">
            <FiMessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>{copy.launcher}</span>
        </button>
      )}
    </div>
  );
}
