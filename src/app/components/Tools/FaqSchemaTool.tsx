"use client";

import { useId, useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { CodeBlock, ToolPanel, buttonClass, fieldClass, ghostButtonClass, labelClass } from "./ui";

const MAX_ITEMS = 20;

const copy = {
  fa: {
    question: "پرسش",
    answer: "پاسخ",
    item: "پرسش و پاسخ",
    add: "افزودن پرسش",
    remove: "حذف این پرسش",
    output: "کد JSON-LD (داخل head یا پیش از بستن body)",
    empty: "حداقل یک پرسش و پاسخ کامل بنویسید تا کد ساخته شود.",
    incomplete: "پرسش یا پاسخ ناقص در کد نمی‌آید.",
    count: "پرسش در کد",
    tip: "پرسش‌ها باید با همان متن روی صفحه دیده شوند، وگرنه اسکیما معتبر نیست.",
    placeholderQ: "مثلاً: ساخت سایت چقدر زمان می‌برد؟",
    placeholderA: "پاسخ کوتاه و دقیق، همان که روی صفحه نوشته‌اید.",
  },
  en: {
    question: "Question",
    answer: "Answer",
    item: "Question and answer",
    add: "Add a question",
    remove: "Remove this question",
    output: "JSON-LD code (inside head or before the closing body tag)",
    empty: "Write at least one complete question and answer to build the code.",
    incomplete: "A question or answer left incomplete is left out of the code.",
    count: "questions in the code",
    tip: "The questions must appear with the same text on the page, otherwise the schema is not valid.",
    placeholderQ: "For example: How long does a website take?",
    placeholderA: "A short, accurate answer, the same one written on the page.",
  },
} as const;

type Item = { id: number; question: string; answer: string };

export default function FaqSchemaTool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const baseId = useId();
  const [items, setItems] = useState<Item[]>([
    { id: 1, question: "", answer: "" },
    { id: 2, question: "", answer: "" },
  ]);
  const [nextId, setNextId] = useState(3);

  const complete = useMemo(
    () => items.filter((item) => item.question.trim() && item.answer.trim()),
    [items]
  );

  const code = useMemo(() => {
    if (complete.length === 0) return "";
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: complete.map((item) => ({
        "@type": "Question",
        name: item.question.replace(/\s+/gu, " ").trim(),
        acceptedAnswer: { "@type": "Answer", text: item.answer.replace(/\s+/gu, " ").trim() },
      })),
    };
    // "<" is escaped so an answer containing "</script>" can never close the tag early.
    const json = JSON.stringify(data, null, 2).replace(/</gu, "\\u003c");
    return `<script type="application/ld+json">\n${json}\n</script>`;
  }, [complete]);

  function update(id: number, field: "question" | "answer", value: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <ToolPanel>
      <p className="mb-5 rounded-2xl border border-accent/20 bg-background/30 px-4 py-3 text-xs leading-6 text-muted">{t.tip}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          {items.map((item, index) => (
            <fieldset key={item.id} className="rounded-2xl border border-foreground/10 bg-background/20 p-4">
              <legend className="px-2 text-xs font-bold text-accent">
                {t.item} {index + 1}
              </legend>
              <label htmlFor={`${baseId}-q-${item.id}`} className={labelClass}>{t.question}</label>
              <input
                id={`${baseId}-q-${item.id}`}
                className={fieldClass}
                value={item.question}
                maxLength={300}
                placeholder={index === 0 ? t.placeholderQ : undefined}
                onChange={(event) => update(item.id, "question", event.target.value)}
              />
              <label htmlFor={`${baseId}-a-${item.id}`} className={`${labelClass} mt-3`}>{t.answer}</label>
              <textarea
                id={`${baseId}-a-${item.id}`}
                rows={3}
                className={`${fieldClass} resize-y`}
                value={item.answer}
                maxLength={1500}
                placeholder={index === 0 ? t.placeholderA : undefined}
                onChange={(event) => update(item.id, "answer", event.target.value)}
              />
              {items.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                  className={`${ghostButtonClass} mt-3`}
                >
                  <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.remove}
                </button>
              ) : null}
            </fieldset>
          ))}
          {items.length < MAX_ITEMS ? (
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setItems((current) => [...current, { id: nextId, question: "", answer: "" }]);
                setNextId((value) => value + 1);
              }}
            >
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              {t.add}
            </button>
          ) : null}
        </div>

        <div className="grid content-start gap-3">
          <p className="text-xs text-muted" role="status">
            <span dir="ltr">{complete.length}</span> {t.count}
            {complete.length < items.length ? ` · ${t.incomplete}` : ""}
          </p>
          {code ? (
            <CodeBlock label={t.output} value={code} locale={locale} filename="faq-schema.html" mime="text/html" />
          ) : (
            <p className="rounded-2xl border border-dashed border-foreground/15 p-6 text-sm text-muted">{t.empty}</p>
          )}
        </div>
      </div>
    </ToolPanel>
  );
}
