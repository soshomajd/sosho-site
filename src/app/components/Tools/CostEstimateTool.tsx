import Link from "next/link";
import { FiCheck } from "react-icons/fi";

import ConsultantButton from "@/app/components/Consultant/ConsultantButton";
import type { Locale } from "@/app/i18n";

const COPY = {
  fa: {
    title: "برآورد هوشمند پروژه",
    body: "چند سؤال کوتاه دربارهٔ نوع سایت، هدف، امکانات، اندازه و سبک طراحی می‌پرسیم. در پایان، پیشنهاد اولیهٔ پروژه‌تان را می‌بینید و می‌توانید پاسخ‌ها را اصلاح کنید.",
    start: "شروع برآورد",
    note: "رایگان و بدون ثبت‌نام. پاسخ‌ها فقط با رضایت خودتان ثبت می‌شوند.",
    resultTitle: "در نتیجه چه می‌بینید؟",
    results: [
      "راهکار فنی پیشنهادی: وردپرس، ووکامرس، توسعهٔ اختصاصی یا اپ موبایل، همراه با دلیل انتخاب",
      "صفحه‌های اصلی و قالب‌های پویایی که پروژه لازم دارد",
      "امکانات هر نسخه؛ معمولاً یک نسخهٔ اقتصادی و یک نسخهٔ حرفه‌ای",
      "بازهٔ هزینه و زمان تقریبی، یا «نیازمند بررسی کارشناسی» وقتی پروژه به گفت‌وگو نیاز دارد",
      "خلاصهٔ پروژه که می‌توانید دریافت و نگه دارید",
    ],
    noScript: "برآورد هوشمند به جاوااسکریپت نیاز دارد. می‌توانید نیازتان را از صفحهٔ تماس برای ما بنویسید.",
    contact: "صفحهٔ تماس",
  },
  en: {
    title: "Smart project estimate",
    body: "We ask a few short questions about the type of site, the goal, the features, its size and the design style. At the end you see a first proposal for your project and can edit your answers.",
    start: "Start the estimate",
    note: "Free, with no sign-up. Your answers are saved only with your consent.",
    resultTitle: "What does the result show?",
    results: [
      "A suggested technical approach: WordPress, WooCommerce, a custom build or a mobile app, with the reason",
      "The main pages and dynamic templates the project needs",
      "The features of each version; usually an economic and a professional one",
      "A cost range and approximate timing, or “Needs an expert review” when the project calls for a conversation",
      "A project summary you can download and keep",
    ],
    noScript: "The smart estimate needs JavaScript. You can describe what you need on the contact page instead.",
    contact: "Contact page",
  },
} as const;

/** The project consultant on its own page: a short explanation and the button that opens the shared dialog. */
export default function CostEstimateTool({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="flex flex-col items-start rounded-3xl border border-accent/25 bg-surface/30 p-6 sm:p-8 lg:col-span-5">
        <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
        <p className="mt-3 text-sm leading-8 text-muted">{t.body}</p>
        <ConsultantButton locale={locale} variant="primary" className="mt-6">
          {t.start}
        </ConsultantButton>
        <p className="mt-4 text-xs leading-6 text-muted">{t.note}</p>
        <noscript>
          <p className="mt-4 text-sm leading-7 text-foreground">
            {t.noScript}{" "}
            <Link href={`/${locale}/contact`} className="font-bold text-primary underline underline-offset-4">
              {t.contact}
            </Link>
          </p>
        </noscript>
      </div>
      <div className="rounded-3xl border border-foreground/10 bg-surface/20 p-6 sm:p-8 lg:col-span-7">
        <h2 className="text-xl font-bold text-foreground">{t.resultTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {t.results.map((text) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-7 text-muted">
              <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
