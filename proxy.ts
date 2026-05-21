import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    // intlMiddleware tüm route'lar için çalışır — URL rewriting, locale detection
    // Admin auth kontrolü admin layout server component'ta yapılır
    const response = intlMiddleware(request);
    // Admin layout'taki x-pathname kontrolü için orijinal pathname'i aktar
    response.headers.set("x-pathname", request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
