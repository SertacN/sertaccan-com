import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/server/auth";

const intlMiddleware = createMiddleware(routing);

const ADMIN_LOGIN_PATHS = ["/admin/login", "/en/admin/login"];

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const rateLimitConfig: Record<string, { limit: number; windowMs: number }> = {
    "/api": { limit: 60, windowMs: 60_000 },
};

function isRateLimited(ip: string, path: string): boolean {
    const config = Object.entries(rateLimitConfig).find(([prefix]) => path.startsWith(prefix));
    if (!config) return false;

    const { limit, windowMs } = config[1];
    const key = `${ip}:${config[0]}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }

    entry.count++;
    return entry.count > limit;
}

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
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    if (isRateLimited(ip, pathname)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
