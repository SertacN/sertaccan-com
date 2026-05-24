"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { updateProfileAction } from "@/app/[locale]/admin/users/actions";

type User = { id: string; name: string; email: string } | null;
type ActionState = { action: string; success?: boolean; errors?: Record<string, string[]> } | null;

export default function UserProfileForm({ user }: { user: User }) {
    const [state, action, pending] = useActionState<ActionState, FormData>(updateProfileAction, null);
    const err = (field: string) => state?.errors?.[field]?.[0];

    return (
        <div className="rounded border border-border bg-card p-6">
            <h2 className="mb-6 font-mono text-lg font-bold">Profil Bilgileri</h2>

            {state?.action === "profile" && state.success && (
                <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-sm text-primary">
                    Profil güncellendi.
                </div>
            )}
            {state?.action === "profile" && state.errors && (
                <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-4 py-2 font-mono text-sm text-destructive">
                    {Object.values(state.errors)
                        .flat()
                        .map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}
                </div>
            )}

            <form action={action} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field data-invalid={!!err("name")}>
                    <FieldLabel htmlFor="name">İsim</FieldLabel>
                    <Input id="name" name="name" required defaultValue={user?.name ?? ""} />
                    <FieldError>{err("name")}</FieldError>
                </Field>
                <Field data-invalid={!!err("email")}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} />
                    <FieldError>{err("email")}</FieldError>
                </Field>
                <div className="md:col-span-2">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Güncelleniyor..." : "Güncelle"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
