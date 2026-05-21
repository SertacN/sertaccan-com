"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("error");

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-mono text-8xl font-bold text-primary md:text-9xl">500</div>

            <h1 className="font-mono text-xl font-bold md:text-2xl">{t("generic_title")}</h1>

            <p className="max-w-md text-sm text-muted-foreground">{error.message || t("generic_desc")}</p>

            <div className="mt-4 flex gap-3">
                <button
                    onClick={reset}
                    className="rounded border border-primary px-4 py-2 font-mono text-sm text-primary transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
                >
                    {t("try_again")}
                </button>
                <Link
                    href="/"
                    className="rounded border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
                >
                    {t("back_home")}
                </Link>
            </div>
        </div>
    );
}
