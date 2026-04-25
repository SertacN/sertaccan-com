"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const NAV_LINKS = [
    { href: "#about", labelKey: "nav.about" },
    { href: "#techstack", labelKey: "nav.stack" },
    { href: "#projects", labelKey: "nav.projects" },
    { href: "#contact", labelKey: "nav.contact" },
    { href: "/projects", labelKey: "nav.all_projects" },
];

export default function Navbar() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const currentLang = i18n.language?.startsWith("en") ? "en" : "tr";

    const toggleLang = (lang: "tr" | "en") => {
        if (currentLang === lang) return;
        void i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const langSwitcher = (
        <div className="flex overflow-hidden rounded border border-border text-xs font-semibold">
            {(["tr", "en"] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    className={`cursor-pointer px-2.5 py-1.5 transition-colors ${
                        currentLang === lang
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );

    const themeButton = (
        <Button onClick={cycleTheme} aria-label={t("nav.change_theme")} variant="outline" size="icon">
            <span suppressHydrationWarning className={theme === "light" ? "hidden" : "block"}>
                <Sun size={16} />
            </span>
            <span suppressHydrationWarning className={theme === "light" ? "block" : "hidden"}>
                <Moon size={16} />
            </span>
        </Button>
    );

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                <Link href="/" className="font-mono text-lg font-bold text-primary" aria-label="Logo">
                    Sertaç Can
                </Link>

                {/* Desktop */}
                <div className="hidden items-center gap-6 md:flex">
                    {NAV_LINKS.map(({ href, labelKey }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-label={t(labelKey)}
                            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
                        >
                            {t(labelKey)}
                        </Link>
                    ))}
                    {langSwitcher}
                    {themeButton}
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-2 md:hidden">
                    {themeButton}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Menü">
                                <Menu size={16} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <VisuallyHidden>
                                <SheetTitle>Navigasyon</SheetTitle>
                            </VisuallyHidden>
                            <nav className="mt-8 flex flex-col gap-4 px-4">
                                {NAV_LINKS.map(({ href, labelKey }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        aria-label={t(labelKey)}
                                        className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
                                    >
                                        {t(labelKey)}
                                    </Link>
                                ))}
                                <div className="pt-2 border-t border-border">
                                    {langSwitcher}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
