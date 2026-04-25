"use client";

import { useEffect } from "react";
import i18n from "@/i18n";

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const stored = localStorage.getItem("language") ?? "tr";
        void i18n.changeLanguage(stored);
    }, []);

    return <>{children}</>;
};
