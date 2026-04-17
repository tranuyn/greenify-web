import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

const intlMiddleware = createMiddleware({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localeDetection: false, 
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
