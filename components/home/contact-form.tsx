"use client";
import { useTranslations } from "next-intl";

export default function ContactForm() {
    const t = useTranslations("nav");
    return (
        <section id="contact" className="px-4 py-24">
            <h2 className="mb-8 text-center font-mono text-2xl font-bold text-text md:text-3xl">{t("contact")}</h2>
            <div className="w-1/2 rounded border border-border bg-surface p-6"></div>
        </section>
    );
}
