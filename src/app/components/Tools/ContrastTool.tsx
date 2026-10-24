"use client";

import { useId, useState } from "react";
import { FiCheckCircle, FiRepeat, FiXCircle } from "react-icons/fi";

import type { Locale } from "@/app/i18n";

import { ToolPanel, fieldClass, ghostButtonClass, labelClass } from "./ui";

const copy = {
  fa: {
    text: "رنگ متن",
    background: "رنگ پس‌زمینه",
    hex: "کد هگز",
    invalid: "کد رنگ معتبر نیست؛ مثلاً #1a1a1a یا #fff",
    swap: "جابه‌جایی دو رنگ",
    ratio: "نسبت کنتراست",
    normalAA: "متن معمولی، سطح AA (حداقل ۴٫۵)",
    largeAA: "متن بزرگ، سطح AA (حداقل ۳)",
    normalAAA: "متن معمولی، سطح AAA (حداقل ۷)",
    largeAAA: "متن بزرگ، سطح AAA (حداقل ۴٫۵)",
    pass: "قبول",
    fail: "ردّ",
    sample: "نمونه متن",
    sampleBody: "این یک متن نمونه است تا ببینید ترکیب رنگ‌ها چقدر خوانا است.",
    sampleLarge: "متن بزرگ نمونه",
  },
  en: {
    text: "Text color",
    background: "Background color",
    hex: "Hex code",
    invalid: "That is not a valid color code, for example #1a1a1a or #fff",
    swap: "Swap the two colors",
    ratio: "Contrast ratio",
    normalAA: "Normal text, AA (at least 4.5)",
    largeAA: "Large text, AA (at least 3)",
    normalAAA: "Normal text, AAA (at least 7)",
    largeAAA: "Large text, AAA (at least 4.5)",
    pass: "Pass",
    fail: "Fail",
    sample: "Sample text",
    sampleBody: "This is a sample so you can see how readable the color pair is.",
    sampleLarge: "Large sample text",
  },
} as const;

function parseHex(value: string): [number, number, number] | null {
  const match = value.trim().replace(/^#/u, "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/iu);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = [...hex].map((char) => char + char).join("");
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: [number, number, number], b: [number, number, number]) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const toHex = (rgb: [number, number, number]) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

function ColorField({
  id,
  label,
  value,
  onChange,
  hexLabel,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hexLabel: string;
  invalid?: string;
}) {
  const rgb = parseHex(value);
  return (
    <div>
      <label htmlFor={`${id}-hex`} className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} (${hexLabel})`}
          value={rgb ? toHex(rgb) : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-foreground/15 bg-transparent p-1"
        />
        <input
          id={`${id}-hex`}
          dir="ltr"
          className={`${fieldClass} text-start`}
          value={value}
          maxLength={7}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={rgb ? undefined : true}
          aria-describedby={rgb ? undefined : `${id}-error`}
        />
      </div>
      {rgb ? null : (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">{invalid}</p>
      )}
    </div>
  );
}

export default function ContrastTool({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const baseId = useId();
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");
  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null;
  // Floor to two decimals so 4.499 is never shown (or judged) as 4.5.
  const shown = ratio === null ? null : Math.floor(ratio * 100) / 100;

  const rows: { label: string; min: number }[] = [
    { label: t.normalAA, min: 4.5 },
    { label: t.largeAA, min: 3 },
    { label: t.normalAAA, min: 7 },
    { label: t.largeAAA, min: 4.5 },
  ];

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <ColorField id={`${baseId}-fg`} label={t.text} value={fg} onChange={setFg} hexLabel={t.hex} invalid={t.invalid} />
          <ColorField id={`${baseId}-bg`} label={t.background} value={bg} onChange={setBg} hexLabel={t.hex} invalid={t.invalid} />
          <button
            type="button"
            className={`${ghostButtonClass} w-fit`}
            onClick={() => {
              setFg(bg);
              setBg(fg);
            }}
          >
            <FiRepeat className="h-3.5 w-3.5" aria-hidden="true" />
            {t.swap}
          </button>
          <div
            className="rounded-2xl border border-foreground/10 p-5"
            style={{ background: bgRgb ? toHex(bgRgb) : "#ffffff", color: fgRgb ? toHex(fgRgb) : "#000000" }}
          >
            <p className="text-xs font-bold opacity-80">{t.sample}</p>
            <p className="mt-2 text-sm leading-7">{t.sampleBody}</p>
            <p className="mt-2 text-2xl font-bold">{t.sampleLarge}</p>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-2xl border border-foreground/10 bg-background/30 p-5">
            <p className="text-xs font-bold text-muted">{t.ratio}</p>
            <p dir="ltr" className="mt-1 text-start text-4xl font-extrabold text-foreground" aria-live="polite">
              {shown === null ? "—" : `${shown.toFixed(2)} : 1`}
            </p>
          </div>
          <ul className="grid gap-2">
            {rows.map((row) => {
              const pass = shown !== null && shown >= row.min;
              return (
                <li key={row.label} className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-background/20 px-4 py-3 text-sm">
                  <span className="text-foreground">{row.label}</span>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 font-bold ${shown === null ? "text-muted" : pass ? "text-emerald-400" : "text-red-400"}`}>
                    {shown === null ? null : pass ? <FiCheckCircle className="h-4 w-4" aria-hidden="true" /> : <FiXCircle className="h-4 w-4" aria-hidden="true" />}
                    {shown === null ? "—" : pass ? t.pass : t.fail}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ToolPanel>
  );
}
