import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/providers";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sertaç Can | Software Developer",
    description: "Temiz kod, iyi tasarım.",
    applicationName: "Portfolio Website",
    authors: [{ name: "Sertaç Can", url: "https://sertaccan.com/" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="antialiased mx-auto max-w-7xl px-4 pt-20 pb-4">
                <Providers>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
