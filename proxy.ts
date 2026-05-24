import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/server/auth";

const intlMiddleware = createMiddleware(routing);

const ADMIN_LOGIN_PATHS = ["/admin/login", "/en/admin/login"];

function isAdminRoute(pathname: string) {
    return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        pathname === "/en/admin" ||
        pathname.startsWith("/en/admin/")
    );
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isAdminRoute(pathname) && !ADMIN_LOGIN_PATHS.includes(pathname)) {
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        if (session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    const response = intlMiddleware(request);
    response.headers.set("x-pathname", pathname);
    return response;
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
