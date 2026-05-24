"use client";

import { useRef, useEffect, useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { createContactFormAction } from "@/app/[locale]/(home)/actions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ActionState = { success?: boolean; errors?: Record<string, string[]> } | null;

export default function ContactForm() {
    const t = useTranslations("contact_form");
    const [state, action, pending] = useActionState<ActionState, FormData>(createContactFormAction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const [messageLength, setMessageLength] = useState(0);
    const MESSAGE_MAX = 500;

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state?.success]);

    const err = (field: string) => state?.errors?.[field]?.[0];

    return (
        <section id="contact" className="px-4 py-24">
            <h2 className="mb-8 text-center font-mono text-2xl font-bold text-text md:text-3xl">{t("title")}</h2>

            <div className="mx-auto w-full max-w-xl rounded border border-border bg-surface p-6">
                {state?.success && (
                    <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
                        {t("success")}
                    </div>
                )}

                <form ref={formRef} action={action} onReset={() => setMessageLength(0)} className="flex flex-col gap-4">
                    <FieldGroup>
                        <Field data-invalid={!!err("name")}>
                            <FieldLabel htmlFor="name">{t("name_label")}</FieldLabel>
                            <Input id="name" name="name" placeholder={t("name_placeholder")} />
                            <FieldError>{err("name")}</FieldError>
                        </Field>

                        <Field data-invalid={!!err("email")}>
                            <FieldLabel htmlFor="email">{t("email_label")}</FieldLabel>
                            <Input id="email" name="email" type="email" placeholder={t("email_placeholder")} />
                            <FieldError>{err("email")}</FieldError>
                        </Field>

                        <Field data-invalid={!!err("subject")}>
                            <FieldLabel htmlFor="subject">{t("subject_label")}</FieldLabel>
                            <Input id="subject" name="subject" placeholder={t("subject_placeholder")} />
                            <FieldError>{err("subject")}</FieldError>
                        </Field>

                        <Field data-invalid={!!err("message")}>
                            <FieldLabel htmlFor="message">{t("message_label")}</FieldLabel>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder={t("message_placeholder")}
                                maxLength={MESSAGE_MAX}
                                onChange={(e) => setMessageLength(e.target.value.length)}
                            />
                            <div className="flex justify-between">
                                <FieldError>{err("message")}</FieldError>
                                <span
                                    className={`ml-auto text-xs ${messageLength >= MESSAGE_MAX ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                    {messageLength}/{MESSAGE_MAX}
                                </span>
                            </div>
                        </Field>
                    </FieldGroup>

                    <Button type="submit" disabled={pending} className="self-end">
                        {pending ? t("submitting") : t("submit")}
                    </Button>
                </form>
            </div>
        </section>
    );
}
