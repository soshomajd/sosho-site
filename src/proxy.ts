import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const defaultLocale = "en";
const locales = ["fa", "en"] as const;

function hasLocale(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function handle(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocale(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  return handle(request);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
