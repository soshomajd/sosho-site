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
  "ASP.NET Core",
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
    <div className="about-panel relative mt-7 overflow-hidden rounded-3xl border border-foreground/10 bg-surface/25">
      <figure className="about-visual" data-reveal="cinematic">
        <picture>
        <source media="(max-width: 767px)" srcSet="/brand/about-studio-panorama-20261026-sm.webp" />
        <Image
          src="/brand/about-studio-panorama-20261026.webp"
          alt={isFa ? "تصویر سه‌بعدی نشان سوشو در میان قاب‌های شیشه‌ای طراحی و مسیر نور آبی، نمادی از مسیر ایده تا ساخت" : "3D Sosho mark surrounded by glass design interfaces and a blue light path, representing the journey from idea to build"}
          width={1800}
          height={720}
          sizes="(max-width: 1280px) 100vw, 1280px"
          loading="lazy"
          className="about-visual-image"
        />
        </picture>
        <div className="about-visual-shade" aria-hidden="true" />
        <div className="about-reveal-light" aria-hidden="true" />
        <figcaption className="about-visual-caption">
          {(isFa ? ["استراتژی", "طراحی", "توسعه", "رشد"] : ["Strategy", "Design", "Build", "Growth"]).map((label) => <span key={label}>{label}</span>)}
        </figcaption>
      </figure>

      <div className="relative p-5 sm:p-7 lg:p-10">
      <div className="relative">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            {isFa ? "سوشو استودیو" : "Sosho Studio"}
          </p>
          <h3 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl" data-reveal>
            {isFa ? "یک تیم برای تمام مسیر دیجیتال شما" : "One team for your entire digital journey"}
          </h3>
          <p className="mt-5 max-w-4xl text-sm leading-8 text-muted md:text-base" data-reveal>
            {isFa
              ? "سوشو استودیو یک استودیوی طراحی و تکنولوژی است که استراتژی، طراحی و توسعه را در یک فرایند یکپارچه کنار هم می‌آورد. از یک سایت وردپرسی سریع تا پلتفرم اختصاصی، سئو، Web3 و راهکارهای هوش مصنوعی، هر پروژه را با یک هدف واقعی کسب‌وکار شروع می‌کنیم."
              : "Sosho Studio is a design and technology studio that brings strategy, design, and development into one connected process. From fast WordPress sites to custom platforms, SEO, Web3, and AI solutions, every project begins with a real business goal."}
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-muted md:text-base">
            {isFa
              ? "مسئولیت کار را تا لانچ، اندازه‌گیری و پشتیبانی ادامه می‌دهیم؛ بدون پاس‌کاری بین چند تیم و بدون راهکارهای یکسان برای همه."
              : "We stay accountable through launch, measurement, and support—without handoffs between disconnected teams or one-size-fits-all solutions."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {proofPoints.map((point, index) => (
              <div key={point} data-reveal data-motion-delay={index * 65} className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/25 px-4 py-3 text-sm leading-6 text-muted">
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
            <article key={number} data-reveal data-motion-delay={Number(number) * 50} className="group rounded-2xl border border-foreground/10 bg-background/20 p-5 transition-colors hover:border-accent/25 hover:bg-background/35">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted/80">{number}</span>
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
    </div>
  );
}
