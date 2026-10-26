import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد | Page not found",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/fa", fa: "صفحه اصلی", en: "Home" },
  { href: "/fa/blogs", fa: "مجله سوشو", en: "Insights" },
  { href: "/fa#contact", fa: "تماس با ما", en: "Contact" },
];

// Served by the Worker with a real 404 status for every unknown page URL.
export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-foreground/10 bg-surface/30 p-8 text-center sm:p-12">
        <p className="text-xs font-bold tracking-[0.24em] text-accent" dir="ltr">
          404 · SOSHO STUDIO
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">این صفحه پیدا نشد</h1>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
          ممکن است آدرس تغییر کرده یا اشتباه وارد شده باشد. از یکی از مسیرهای زیر ادامه دهید.
        </p>
        <p lang="en" dir="ltr" className="mt-4 text-sm leading-7 text-muted">
          This page could not be found. The address may have changed or been mistyped.
        </p>
        <nav aria-label="پیوندهای مفید" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/15 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              {link.fa}
              <span className="sr-only"> / {link.en}</span>
            </Link>
          ))}
          <Link
            href="/en"
            prefetch={false}
            lang="en"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            English site
          </Link>
        </nav>
      </div>
    </main>
  );
}
