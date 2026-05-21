import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="antialiased">
                <ThemeProvider attribute="class" value={{ dark: "dark", light: "light" }} defaultTheme="dark" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
