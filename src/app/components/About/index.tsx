import Image from "next/image";
import type { Locale } from "@/app/i18n";
import { FiCheck, FiCode, FiCompass, FiPenTool, FiTrendingUp } from "react-icons/fi";

const STACK = [
  "Figma",
  "WordPress",
  "WooCommerce",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "AI / RAG",
  "Search Console",
  "GA4",
  "Solidity",
  "Web3",
];

export default function About({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";

  const proofPoints = isFa
    ? [
        "مالکیت صفر تا صد پروژه با یک تیم پاسخ‌گو",
        "طراحی، سرعت، دسترس‌پذیری و سئو از روز اول",
        "محدوده کار شفاف و گزارش منظم پیشرفت",
        "آموزش، پشتیبانی و رشد بعد از لانچ",
      ]
    : [
        "End-to-end ownership by one accountable team",
        "Design, speed, accessibility, and SEO from day one",
        "Clear scope with visible progress throughout",
        "Training, support, and growth after launch",
      ];

  const process = [
    {
      number: "01",
      Icon: FiCompass,
      title: isFa ? "کشف" : "Discover",
      description: isFa
        ? "هدف، مخاطب، محدودیت‌ها و معیار موفقیت را مشخص می‌کنیم."
        : "We define the goal, audience, constraints, and what success means.",
    },
    {
      number: "02",
      Icon: FiPenTool,
      title: isFa ? "طراحی" : "Design",
      description: isFa
        ? "ساختار، تجربه و زبان بصری محصول را پیش از توسعه نهایی می‌کنیم."
        : "We shape the structure, experience, and visual language before build.",
    },
    {
      number: "03",
      Icon: FiCode,
      title: isFa ? "ساخت" : "Build",
      description: isFa
        ? "محصول را مرحله‌ای، قابل تست و با استاندارد فنی درست پیاده می‌کنیم."
        : "We ship in testable milestones with a durable technical foundation.",
    },
    {
      number: "04",
      Icon: FiTrendingUp,
      title: isFa ? "رشد" : "Grow",
      description: isFa
        ? "لانچ می‌کنیم، داده را می‌سنجیم و برای بهبود بعدی کنار شما می‌مانیم."
        : "We launch, measure real data, and stay for the next improvement.",
    },
  ];

  return (
    <div className="relative mt-7 overflow-hidden rounded-3xl border border-foreground/10 bg-surface/25 p-5 sm:p-7 lg:p-10">
      <div className="pointer-events-none absolute -start-40 -top-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -end-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-foreground/10 bg-background/40">
            <div className="absolute inset-[10%] rounded-full border border-accent/20" />
            <div className="absolute inset-[21%] rounded-full border border-primary/25" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_58%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[28px_28px]" />

            <div className="absolute inset-0 grid place-items-center">
              <div className="relative grid h-40 w-40 place-items-center rounded-[2rem] border border-foreground/15 bg-background/65 shadow-2xl shadow-primary/20 backdrop-blur sm:h-48 sm:w-48">
                <Image
                  src="/sosho-mark.svg"
                  alt={isFa ? "نشان سوشو استودیو" : "Sosho Studio mark"}
                  width={132}
                  height={132}
                  className="h-28 w-28 sm:h-32 sm:w-32"
                />
              </div>
            </div>

            <div className="absolute start-4 top-5 rounded-full border border-foreground/10 bg-background/75 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 backdrop-blur sm:start-7 sm:top-8 sm:text-xs">
              {isFa ? "استراتژی" : "Strategy"}
            </div>
            <div className="absolute end-4 top-1/4 rounded-full border border-foreground/10 bg-background/75 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 backdrop-blur sm:end-6 sm:text-xs">
              {isFa ? "طراحی" : "Design"}
            </div>
            <div className="absolute bottom-1/4 start-3 rounded-full border border-foreground/10 bg-background/75 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 backdrop-blur sm:start-6 sm:text-xs">
              {isFa ? "توسعه" : "Build"}
            </div>
            <div className="absolute bottom-5 end-6 rounded-full border border-foreground/10 bg-background/75 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 backdrop-blur sm:bottom-8 sm:end-9 sm:text-xs">
              {isFa ? "رشد" : "Growth"}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            {isFa ? "سوشو استودیو" : "Sosho Studio"}
          </p>
          <h3 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            {isFa ? "یک تیم برای تمام مسیر دیجیتال شما" : "One team for your entire digital journey"}
          </h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-muted md:text-base">
            {isFa
              ? "سوشو استودیو یک استودیوی طراحی و تکنولوژی است که استراتژی، طراحی و توسعه را در یک فرایند یکپارچه کنار هم می‌آورد. از یک سایت وردپرسی سریع تا پلتفرم اختصاصی، سئو، Web3 و راهکارهای هوش مصنوعی، هر پروژه را با یک هدف واقعی کسب‌وکار شروع می‌کنیم."
              : "Sosho Studio is a design and technology studio that brings strategy, design, and development into one connected process. From fast WordPress sites to custom platforms, SEO, Web3, and AI solutions, every project begins with a real business goal."}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-muted md:text-base">
            {isFa
              ? "مسئولیت کار را تا لانچ، اندازه‌گیری و پشتیبانی ادامه می‌دهیم؛ بدون پاس‌کاری بین چند تیم و بدون راهکارهای یکسان برای همه."
              : "We stay accountable through launch, measurement, and support—without handoffs between disconnected teams or one-size-fits-all solutions."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/25 px-4 py-3 text-sm leading-6 text-muted">
                <FiCheck className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-12 border-t border-foreground/10 pt-9">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              {isFa ? "فرایند همکاری" : "Our process"}
            </p>
            <h4 className="mt-2 text-xl font-bold text-foreground md:text-2xl">
              {isFa ? "شفاف از اولین جلسه تا بعد از لانچ" : "Clear from first call to post-launch"}
            </h4>
          </div>
          <p className="text-sm text-muted">{isFa ? "کشف ← طراحی ← ساخت ← رشد" : "Discover → Design → Build → Grow"}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {process.map(({ number, Icon, title, description }) => (
            <article key={number} className="group rounded-2xl border border-foreground/10 bg-background/20 p-5 transition-colors hover:border-accent/25 hover:bg-background/35">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted/70">{number}</span>
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <h5 className="mt-8 text-base font-bold text-foreground">{title}</h5>
              <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative mt-9 border-t border-foreground/10 pt-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          {isFa ? "ابزارها و پلتفرم‌ها" : "Tools & platforms"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {STACK.map((name) => (
            <span key={name} dir="ltr" className="rounded-full border border-foreground/10 bg-background/25 px-3 py-1.5 text-xs font-semibold text-foreground/75">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
