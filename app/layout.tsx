import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://sertaccan.com"),
    title: {
        default: "Sertaç Can | Software Developer",
        template: "%s | Sertaç Can",
    },
    description: "Temiz kod, iyi tasarım.",
    applicationName: "sertaccan.com",
    authors: [{ name: "Sertaç Can", url: "https://sertaccan.com" }],
    openGraph: {
        title: "Sertaç Can | Software Developer",
        description: "Temiz kod, iyi tasarım.",
        url: "https://sertaccan.com",
        siteName: "Sertaç Can",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Sertaç Can | Software Developer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sertaç Can | Software Developer",
        description: "Temiz kod, iyi tasarım.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="antialiased">
                <Providers>
                    <div className="mx-auto max-w-7xl px-4 pt-20">
                        <Navbar />
                        <main className="pb-4">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
