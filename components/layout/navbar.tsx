"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { useSession, signOut } from "@/lib/server/auth-client";
import { MenuIcon, MoonIcon, SunIcon } from "@/components/pixel/icons";

const NAV_LINKS = [
    { href: "/#about", labelKey: "about" },
    { href: "/#techstack", labelKey: "stack" },
    { href: "/#projects", labelKey: "projects" },
    { href: "/#contact", labelKey: "contact" },
    { href: "/projects", labelKey: "all_projects" },
] as const;

const controlButton =
    "frame-2 m-0.5 flex size-9 cursor-pointer items-center justify-center bg-card [--frame:var(--pixel-ctrl)] hover:bg-btn-hover";
const textButton =
    "frame-2 m-0.5 flex h-8 cursor-pointer items-center px-3 font-mono text-xs font-bold text-foreground bg-card [--frame:var(--pixel-ctrl)] hover:bg-btn-hover";

export default function Navbar() {
    const t = useTranslations("nav");
    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin = session?.user.role === "admin";

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const toggleTheme = () => setTheme(resolvedTheme === "light" ? "dark" : "light");

    const toggleLang = (lang: "tr" | "en") => {
        if (locale === lang) return;
        router.replace(pathname, { locale: lang });
    };

    const langSwitcher = (large: boolean) => (
        <div className="frame-2 m-0.5 flex gap-0.5 self-start bg-pixel-ctrl [--frame:var(--pixel-ctrl)]">
            {(["tr", "en"] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    aria-pressed={locale === lang}
                    className={`cursor-pointer border-0 font-mono font-bold ${
                        large ? "h-8 min-w-11 text-[13px]" : "h-7 min-w-9 px-2 text-xs"
                    } ${locale === lang ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );

    // Both icons are rendered and swapped by the theme class, so there is no hydration mismatch.
    const themeButton = (
        <button onClick={toggleTheme} aria-label={t("change_theme")} className={controlButton}>
            <SunIcon className="text-[#ffd84a] light:hidden" />
            <MoonIcon className="hidden text-[#2a3570] light:block" />
        </button>
    );

    const sessionButtons = (
        <>
            {isAdmin && (
                <Link href="/admin" className={textButton}>
                    {t("dashboard")}
                </Link>
            )}
            {session && (
                <button onClick={handleSignOut} className={textButton}>
                    {t("logout")}
                </button>
            )}
        </>
    );

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b-4 border-nav-line bg-nav-bg backdrop-blur-sm">
            <div className="mx-auto box-content flex h-15 max-w-site items-center justify-between gap-4 px-6">
                <Link href="/" className="font-mono text-base font-bold text-primary">
                    Sertaç Can
                </Link>

                {/* Desktop */}
                <div className="hidden items-center gap-6 md:flex">
                    {NAV_LINKS.map(({ href, labelKey }) => (
                        <Link
                            key={href}
                            href={href}
                            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t(labelKey)}
                        </Link>
                    ))}
                    {langSwitcher(false)}
                    {sessionButtons}
                    {themeButton}
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-3 md:hidden">
                    {themeButton}
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={t("menu")}
                        aria-expanded={menuOpen}
                        className={`${controlButton} text-foreground`}
                    >
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="flex flex-col gap-1 border-t-4 border-nav-line bg-background px-6 pt-2 pb-5 md:hidden">
                    {NAV_LINKS.map(({ href, labelKey }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="py-2.5 font-mono text-base text-foreground"
                        >
                            {t(labelKey)}
                        </Link>
                    ))}
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        {langSwitcher(true)}
                        {sessionButtons}
                    </div>
                </div>
            )}
        </nav>
    );
}
