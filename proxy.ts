import { NextResponse, type NextRequest } from "next/server";
import { locales, matchLocale } from "@/lib/i18n";

/** Sends any path without a locale prefix to /ja/... or /en/... based on Accept-Language (default ja). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = matchLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (favicon.ico, images…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
