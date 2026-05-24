"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { updatePasswordAction } from "@/app/[locale]/admin/users/actions";

type User = { email: string } | null;
type ActionState = { action: string; success?: boolean; errors?: Record<string, string[]> } | null;

export default function UserPasswordForm({ user }: { user: User }) {
    const [state, action, pending] = useActionState<ActionState, FormData>(updatePasswordAction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const err = (field: string) => state?.errors?.[field]?.[0];

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state?.success]);

    return (
        <div className="rounded border border-border bg-card p-6">
            <h2 className="mb-6 font-mono text-lg font-bold">Şifre Değiştir</h2>

            {state?.action === "password" && state.success && (
                <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-sm text-primary">
                    Şifre güncellendi.
                </div>
            )}
            {state?.action === "password" && state.errors && (
                <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-4 py-2 font-mono text-sm text-destructive">
                    {Object.values(state.errors).flat().map((msg, i) => (
                        <p key={i}>{msg}</p>
                    ))}
                </div>
            )}

            <form ref={formRef} action={action} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="text" name="username" value={user?.email ?? ""} autoComplete="username" className="hidden" readOnly />
                <Field data-invalid={!!err("currentPassword")}>
                    <FieldLabel htmlFor="currentPassword">Mevcut Şifre</FieldLabel>
                    <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
                    <FieldError>{err("currentPassword")}</FieldError>
                </Field>
                <Field data-invalid={!!err("newPassword")}>
                    <FieldLabel htmlFor="newPassword">Yeni Şifre</FieldLabel>
                    <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
                    <FieldError>{err("newPassword")}</FieldError>
                </Field>
                <div className="md:col-span-2">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
