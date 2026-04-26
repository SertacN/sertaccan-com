"use client";

import { useRef, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { createProjectAction } from "@/app/admin/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

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

            <form ref={formRef} action={action} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field data-invalid={!!err("slug")}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input id="slug" name="slug" placeholder="my-project" required />
                    <FieldError>{err("slug")}</FieldError>
                </Field>
                <Field data-invalid={!!err("title")}>
                    <FieldLabel htmlFor="title">Başlık</FieldLabel>
                    <Input id="title" name="title" placeholder="Proje Adı" required />
                    <FieldError>{err("title")}</FieldError>
                </Field>
                <Field data-invalid={!!err("descriptionTr")}>
                    <FieldLabel htmlFor="descriptionTr">Açıklama (TR)</FieldLabel>
                    <Textarea
                        id="descriptionTr"
                        name="descriptionTr"
                        rows={2}
                        placeholder="Kısa açıklama..."
                        required
                    />
                    <FieldError>{err("descriptionTr")}</FieldError>
                </Field>
                <Field data-invalid={!!err("descriptionEn")}>
                    <FieldLabel htmlFor="descriptionEn">Açıklama (EN)</FieldLabel>
                    <Textarea
                        id="descriptionEn"
                        name="descriptionEn"
                        rows={2}
                        placeholder="Short description..."
                        required
                    />
                    <FieldError>{err("descriptionEn")}</FieldError>
                </Field>
                <Field data-invalid={!!err("longDescriptionTr")}>
                    <FieldLabel htmlFor="longDescriptionTr">Uzun Açıklama (TR) — Markdown</FieldLabel>
                    <Textarea
                        id="longDescriptionTr"
                        name="longDescriptionTr"
                        rows={4}
                        placeholder="Detaylı açıklama (markdown)..."
                        required
                    />
                    <FieldError>{err("longDescriptionTr")}</FieldError>
                </Field>
                <Field data-invalid={!!err("longDescriptionEn")}>
                    <FieldLabel htmlFor="longDescriptionEn">Uzun Açıklama (EN) — Markdown</FieldLabel>
                    <Textarea
                        id="longDescriptionEn"
                        name="longDescriptionEn"
                        rows={4}
                        placeholder="Detailed description (markdown)..."
                        required
                    />
                    <FieldError>{err("longDescriptionEn")}</FieldError>
                </Field>
                <Field data-invalid={!!err("tags")}>
                    <FieldLabel htmlFor="tags">Tagler (virgülle ayır)</FieldLabel>
                    <Input id="tags" name="tags" placeholder="Next.js, TypeScript, Drizzle" />
                    <FieldError>{err("tags")}</FieldError>
                </Field>
                <Field data-invalid={!!err("githubUrl")}>
                    <FieldLabel htmlFor="githubUrl">GitHub URL</FieldLabel>
                    <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/..." />
                    <FieldError>{err("githubUrl")}</FieldError>
                </Field>
                <Field data-invalid={!!err("liveUrl")}>
                    <FieldLabel htmlFor="liveUrl">Live URL</FieldLabel>
                    <Input id="liveUrl" name="liveUrl" placeholder="https://..." />
                    <FieldError>{err("liveUrl")}</FieldError>
                </Field>
                <Field data-invalid={!!err("status")}>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select name="status" defaultValue="WIP">
                        <SelectTrigger id="status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="WIP">WIP</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <div className="flex items-end gap-6">
                    <Field data-invalid={!!err("order")}>
                        <FieldLabel htmlFor="order">Sıra</FieldLabel>
                        <Input id="order" name="order" type="number" defaultValue={0} className="w-20" />
                    </Field>
                    <FieldGroup className="flex-row">
                        <Field orientation="horizontal">
                            <Checkbox id="featured" name="featured" />
                            <FieldLabel htmlFor="featured" className="font-normal">
                                Featured
                            </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="isActive" name="isActive" />
                            <FieldLabel htmlFor="isActive" className="font-normal">
                                Aktif
                            </FieldLabel>
                        </Field>
                    </FieldGroup>
                </div>
                <Field data-invalid={!!err("imageUrl")}>
                    <Field>
                        <FieldLabel htmlFor="file">Görsel</FieldLabel>
                        <Input type="file" id="file" name="file" accept="image/*" />
                        <FieldError>{err("imageUrl")}</FieldError>
                    </Field>
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
