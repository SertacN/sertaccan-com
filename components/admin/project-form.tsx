"use client";

import { useRef, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { createProjectAction } from "@/app/admin/actions";

type ActionState = { success?: boolean; errors?: Record<string, string[]> } | null;

export default function ProjectForm() {
    const [state, action, pending] = useActionState<ActionState, FormData>(createProjectAction, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state?.success]);

    const err = (field: string) => state?.errors?.[field]?.[0];

    return (
        <div className="rounded border border-border bg-card p-6">
            <h2 className="mb-6 font-mono text-lg font-bold">Yeni Proje</h2>

            {state?.errors && Object.keys(state.errors).length > 0 && (
                <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
                    {Object.entries(state.errors).map(([f, msgs]) => (
                        <p key={f}>
                            {f}: {msgs.join(", ")}
                        </p>
                    ))}
                </div>
            )}
            {state?.success && (
                <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
                    Proje eklendi.
                </div>
            )}

            <form
                ref={formRef}
                action={action}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
                <Field data-invalid={!!err("slug")}>
                    <FieldLabel>Slug</FieldLabel>
                    <Input name="slug" placeholder="my-project" required />
                    <FieldError>{err("slug")}</FieldError>
                </Field>
                <Field data-invalid={!!err("title")}>
                    <FieldLabel>Başlık</FieldLabel>
                    <Input name="title" placeholder="Proje Adı" required />
                    <FieldError>{err("title")}</FieldError>
                </Field>
                <Field data-invalid={!!err("descriptionTr")}>
                    <FieldLabel>Açıklama (TR)</FieldLabel>
                    <Textarea name="descriptionTr" rows={2} placeholder="Kısa açıklama..." required />
                    <FieldError>{err("descriptionTr")}</FieldError>
                </Field>
                <Field data-invalid={!!err("descriptionEn")}>
                    <FieldLabel>Açıklama (EN)</FieldLabel>
                    <Textarea name="descriptionEn" rows={2} placeholder="Short description..." required />
                    <FieldError>{err("descriptionEn")}</FieldError>
                </Field>
                <Field data-invalid={!!err("longDescriptionTr")}>
                    <FieldLabel>Uzun Açıklama (TR) — Markdown</FieldLabel>
                    <Textarea name="longDescriptionTr" rows={4} placeholder="Detaylı açıklama (markdown)..." required />
                    <FieldError>{err("longDescriptionTr")}</FieldError>
                </Field>
                <Field data-invalid={!!err("longDescriptionEn")}>
                    <FieldLabel>Uzun Açıklama (EN) — Markdown</FieldLabel>
                    <Textarea
                        name="longDescriptionEn"
                        rows={4}
                        placeholder="Detailed description (markdown)..."
                        required
                    />
                    <FieldError>{err("longDescriptionEn")}</FieldError>
                </Field>
                <Field data-invalid={!!err("tags")}>
                    <FieldLabel>Tagler (virgülle ayır)</FieldLabel>
                    <Input name="tags" placeholder="Next.js, TypeScript, Drizzle" />
                    <FieldError>{err("tags")}</FieldError>
                </Field>
                <Field data-invalid={!!err("githubUrl")}>
                    <FieldLabel>GitHub URL</FieldLabel>
                    <Input name="githubUrl" placeholder="https://github.com/..." />
                    <FieldError>{err("githubUrl")}</FieldError>
                </Field>
                <Field data-invalid={!!err("liveUrl")}>
                    <FieldLabel>Live URL</FieldLabel>
                    <Input name="liveUrl" placeholder="https://..." />
                    <FieldError>{err("liveUrl")}</FieldError>
                </Field>
                <Field data-invalid={!!err("status")}>
                    <FieldLabel>Status</FieldLabel>
                    <select
                        name="status"
                        className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                        <option value="WIP">WIP</option>
                        <option value="ACTIVE">Active</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </Field>
                <div className="flex items-end gap-6">
                    <Field data-invalid={!!err("order")}>
                        <FieldLabel>Sıra</FieldLabel>
                        <Input name="order" type="number" defaultValue={0} className="w-20" />
                    </Field>
                    <label className="flex items-center gap-2 pb-1 text-sm text-muted-foreground">
                        <input type="checkbox" name="featured" className="accent-primary" /> Featured
                    </label>
                    <label className="flex items-center gap-2 pb-1 text-sm text-muted-foreground">
                        <input type="checkbox" name="isActive" defaultChecked className="accent-primary" /> Aktif
                    </label>
                </div>
                <Field data-invalid={!!err("imageUrl")}>
                    <FieldLabel>Görsel</FieldLabel>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        className="text-sm text-muted-foreground file:mr-3 file:rounded file:border file:border-border file:bg-card file:px-3 file:py-1 file:text-xs file:text-primary file:transition-colors hover:file:border-primary"
                    />
                    <FieldError>{err("imageUrl")}</FieldError>
                </Field>
                <div className="md:col-span-2">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Ekleniyor..." : "Proje Ekle"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
