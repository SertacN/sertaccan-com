"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { createContactFormAction } from "@/app/[locale]/(home)/actions";
import { ErrorMarkIcon } from "@/components/pixel/icons";
import Pigeon from "./pigeon";

type ActionState = { success?: boolean; errors?: Record<string, string[]> } | null;

const MESSAGE_MAX = 500;

const labelClass = "font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase";
const inputClass =
    "frame-4 m-1 border-0 bg-input-bg px-3.5 font-sans text-base text-foreground outline-none [--frame:var(--input-frame)] focus:[--frame:var(--primary)] aria-invalid:[--frame:var(--error)] aria-invalid:focus:[--frame:var(--error)]";

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <span id={id} role="alert" className="flex items-center gap-2 font-mono text-[13px] font-bold text-error">
            <ErrorMarkIcon />
            {message}
        </span>
    );
}

export default function ContactForm() {
    const t = useTranslations("contact_form");
    const [state, action, pending] = useActionState<ActionState, FormData>(createContactFormAction, null);
    const [messageLength, setMessageLength] = useState(0);
    // The action state object changes on every submit; remembering the one the user dismissed
    // lets "write a new message" bring the form back without an effect.
    const [dismissed, setDismissed] = useState<ActionState>(null);

    const err = (field: string) => state?.errors?.[field]?.[0];
    const invalid = (field: string) =>
        err(field) ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};

    if (state?.success && state !== dismissed) {
        return (
            <div
                role="status"
                className="frame-4 m-1 flex w-full max-w-180 flex-col gap-4 bg-card p-6 [--frame:var(--pixel-line)]"
            >
                <div className="h-24 bg-portrait-bg">
                    <Pigeon />
                </div>
                <p className="m-0 text-[17px] leading-relaxed text-foreground">{t("success")}</p>
                <button
                    type="button"
                    onClick={() => {
                        setDismissed(state);
                        setMessageLength(0);
                    }}
                    className="h-9 cursor-pointer self-start border-0 bg-transparent p-0 font-mono text-[13px] font-bold text-primary underline underline-offset-4"
                >
                    {t("new_message")}
                </button>
            </div>
        );
    }

    return (
        <form action={action} noValidate className="flex w-full max-w-180 flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-2">
                    <span className={labelClass}>{t("name_label")}</span>
                    <input
                        name="name"
                        placeholder={t("name_placeholder")}
                        className={`${inputClass} h-11`}
                        {...invalid("name")}
                    />
                    <FieldError id="name-error" message={err("name")} />
                </label>
                <label className="flex min-w-0 flex-col gap-2">
                    <span className={labelClass}>{t("email_label")}</span>
                    <input
                        name="email"
                        type="email"
                        placeholder={t("email_placeholder")}
                        className={`${inputClass} h-11`}
                        {...invalid("email")}
                    />
                    <FieldError id="email-error" message={err("email")} />
                </label>
            </div>
            <label className="flex min-w-0 flex-col gap-2">
                <span className={labelClass}>{t("subject_label")}</span>
                <input
                    name="subject"
                    placeholder={t("subject_placeholder")}
                    className={`${inputClass} h-11`}
                    {...invalid("subject")}
                />
                <FieldError id="subject-error" message={err("subject")} />
            </label>
            <label className="flex flex-col gap-2">
                <span className={`${labelClass} flex justify-between`}>
                    <span>{t("message_label")}</span>
                    <span className={`tracking-normal ${messageLength >= MESSAGE_MAX ? "text-error" : ""}`}>
                        {messageLength} / {MESSAGE_MAX}
                    </span>
                </span>
                <textarea
                    name="message"
                    maxLength={MESSAGE_MAX}
                    placeholder={t("message_placeholder")}
                    onChange={(e) => setMessageLength(e.target.value.length)}
                    className={`${inputClass} h-40 resize-y py-3 leading-[1.6]`}
                    {...invalid("message")}
                />
                <FieldError id="message-error" message={err("message")} />
            </label>

            <FieldError id="form-error" message={err("_form")} />

            <button
                type="submit"
                disabled={pending}
                className="frame-4 m-1 h-12 cursor-pointer self-start border-0 bg-primary px-6 font-mono text-[15px] font-bold text-primary-foreground transition-transform [--frame:var(--primary)] hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-[6px] focus-visible:outline-foreground active:translate-y-0 disabled:cursor-wait disabled:translate-y-0"
            >
                {pending ? t("submitting") : t("submit")}
            </button>
        </form>
    );
}
