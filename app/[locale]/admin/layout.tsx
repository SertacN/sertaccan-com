import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "";
    const isLoginPage = pathname.endsWith("/admin/login");

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

    return (
        <>
            {session?.user.role === "admin" ? (
                <div className="flex min-h-screen gap-6">
                    <AdminSidebar />
                    <main className="flex-1">{children}</main>
                </div>
            ) : (
                children
            )}
        </>
    );
}
