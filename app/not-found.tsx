"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="font-mono text-8xl font-bold text-primary md:text-9xl">
                404
            </div>

            <h1 className="font-mono text-xl font-bold md:text-2xl">
                {t("error.not_found_title")}
            </h1>

            <p className="max-w-md text-sm text-muted-foreground">
                {t("error.not_found_desc")}
            </p>

            <Link
                href="/"
                className="mt-4 rounded border border-primary px-4 py-2 font-mono text-sm text-primary transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
            >
                {t("error.back_home")}
            </Link>
        </div>
    );
}
