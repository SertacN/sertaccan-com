"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/contact", label: "Contact", icon: Mail },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-20 flex h-[calc(100vh-5rem)] w-52 shrink-0 flex-col border-r border-border">
            <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors duration-150",
                                isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                            )}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
