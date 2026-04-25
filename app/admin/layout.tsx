import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "";
    const isLoginPage = pathname === "/admin/login";

    const session = await auth.api.getSession({ headers: h });

    if (!session && !isLoginPage) {
        redirect("/admin/login");
    }

    if (session && session.user.role !== "admin" && !isLoginPage) {
        redirect("/");
    }

    if (session && session.user.role === "admin" && isLoginPage) {
        redirect("/admin");
    }

    return <>{children}</>;
}
