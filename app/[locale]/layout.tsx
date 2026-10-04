import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SiteShell from "@/components/layout/site-shell";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale } = await params;
    const locale = routing.locales.includes(rawLocale as (typeof routing.locales)[number])
        ? rawLocale
        : routing.defaultLocale;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        metadataBase: new URL("https://sertaccan.com"),
        title: {
            default: t("title"),
            template: "%s | Sertaç Can",
        },
        description: t("description"),
        applicationName: "sertaccan.com",
        authors: [{ name: "Sertaç Can", url: "https://sertaccan.com" }],
        openGraph: {
            title: t("title"),
            description: t("description"),
            url: "https://sertaccan.com",
            siteName: "Sertaç Can",
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: t("title") }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/og-image.png"],
        },
        icons: {
            icon: [
                { url: "/favicon.ico", sizes: "48x48" },
                { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
                { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            ],
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Paths with a dot (e.g. /ads.txt) skip the i18n middleware and land here as the "locale";
    // without this check they would render the home page with a 200 instead of a 404.
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();

    return <SiteShell>{children}</SiteShell>;
}
