import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import LocaleHtmlUpdater from "@/components/providers/locale-html-updater";
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

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <LocaleHtmlUpdater />
            <Navbar />
            {/* The fixed navbar is 64px tall (60px bar + 4px rule). */}
            <div className="mx-auto box-content max-w-site px-6 pt-16">
                <main className="pb-4">{children}</main>
            </div>
            <Footer />
        </NextIntlClientProvider>
    );
}
