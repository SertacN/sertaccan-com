"use client";

import { ThemeProvider } from "next-themes";
import "@/app/globals.css";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" value={{ dark: "dark", light: "light" }} defaultTheme="dark" enableSystem>
                    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
                        <div className="font-mono text-8xl font-bold text-primary md:text-9xl">500</div>

                        <h1 className="font-mono text-xl font-bold md:text-2xl">Something Went Wrong</h1>

                        <p className="max-w-md text-sm text-muted-foreground">
                            {error.message || "An unexpected error occurred. Please try again."}
                        </p>

                        <button
                            onClick={reset}
                            className="mt-4 rounded border border-primary px-4 py-2 font-mono text-sm text-primary transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
                        >
                            Try Again
                        </button>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
