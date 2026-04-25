import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLoginPage = pathname === "/admin/login";

    const sessionToken =
        request.cookies.get("better-auth.session_token") ??
        request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionToken && !isLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (sessionToken && isLoginPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
