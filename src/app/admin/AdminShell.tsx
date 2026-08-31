"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

type AuthState = "checking" | "authenticated" | "unauthenticated" | "unavailable";

const navigation = [
  { href: "/admin", label: "نمای کلی" },
  { href: "/admin/campaigns", label: "کمپین‌ها" },
  { href: "/admin/leads", label: "سرنخ‌ها" },
  { href: "/admin/conversations", label: "گفتگوها" },
];

function isCurrentPath(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [token, setToken] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setAuthState("checking");
    setMessage(null);
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { accept: "application/json" },
      });
      if (response.status === 401) {
        setAuthState("unauthenticated");
        return;
      }
      if (!response.ok) {
        setAuthState("unavailable");
        setMessage("سرویس ورود مدیریت در دسترس نیست. کمی بعد دوباره تلاش کنید.");
        return;
      }
      setAuthState("authenticated");
    } catch {
      setAuthState("unavailable");
      setMessage("ارتباط با سرویس مدیریت برقرار نشد.");
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthState("unauthenticated");
      setMessage("نشست شما پایان یافته است. دوباره وارد شوید.");
    };
    window.addEventListener("sosho-admin-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("sosho-admin-unauthorized", handleUnauthorized);
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || loginPending) return;
    setLoginPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        setAuthState("authenticated");
      } else if (response.status === 401) {
        setAuthState("unauthenticated");
        setMessage("توکن مدیریت معتبر نیست.");
      } else if (response.status === 429) {
        setMessage("تلاش‌های ورود بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.");
      } else {
        setMessage("ورود انجام نشد. تنظیمات مدیریت را بررسی کنید.");
      }
    } catch {
      setMessage("ارتباط با سرویس مدیریت برقرار نشد.");
    } finally {
      setToken("");
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/session", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });
    } finally {
      setAuthState("unauthenticated");
      setMessage(null);
    }
  }

  if (authState !== "authenticated") {
    return (
      <main className="min-h-screen bg-background px-4 py-12" dir="rtl">
        <section className="mx-auto mt-[8vh] w-full max-w-md rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-sm font-semibold text-accent">SoSho Studio</p>
          <h1 className="mt-3 text-2xl font-bold text-white">ورود به داشبورد مدیریت</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            این بخش فقط برای مدیر سیستم است. توکن پس از ورود در مرورگر ذخیره نمی‌شود.
          </p>
          {authState === "checking" ? (
            <p className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted" role="status">
              در حال بررسی نشست امن…
            </p>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <label className="block text-sm font-medium text-foreground" htmlFor="admin-token">
                توکن مدیریت
              </label>
              <input
                id="admin-token"
                name="adminToken"
                type="password"
                autoComplete="current-password"
                required
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-left text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                dir="ltr"
              />
              <button
                type="submit"
                disabled={!token || loginPending}
                className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/85 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loginPending ? "در حال ورود…" : "ورود امن"}
              </button>
            </form>
          )}
          {message ? <p className="mt-4 text-sm leading-6 text-amber-300" role="alert">{message}</p> : null}
          {authState === "unavailable" ? (
            <button
              type="button"
              onClick={() => void checkSession()}
              className="mt-5 rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              تلاش دوباره
            </button>
          ) : null}
          <Link href="/fa" className="mt-8 inline-block text-sm text-accent underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-accent">
            بازگشت به سایت
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-white/10 bg-surface/95">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent">SoSho Studio</p>
              <p className="mt-1 text-lg font-bold text-white">داشبورد مدیریت</p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-foreground hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              خروج
            </button>
          </div>
          <nav aria-label="بخش‌های داشبورد" className="overflow-x-auto pb-1">
            <ul className="flex min-w-max gap-2">
              {navigation.map((item) => {
                const current = isCurrentPath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={`block rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent ${
                        current ? "bg-primary text-white" : "bg-black/20 text-muted hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
