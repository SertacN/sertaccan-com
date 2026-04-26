"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { editProjectAction, deleteProjectAction } from "@/app/admin/actions";
import type { InferSelectModel } from "drizzle-orm";
import type { project } from "@/db/schema";

type Project = InferSelectModel<typeof project>;
type ActionState = { edited?: boolean; errors?: Record<string, string[]> } | null;

export default function ProjectList({ projects }: { projects: Project[] }) {
    const [editData, setEditData] = useState<Project | null>(null);
    const [editState, editAction, editPending] = useActionState<ActionState, FormData>(editProjectAction, null);

    const err = (field: string) => editState?.errors?.[field]?.[0];

    return (
        <>
            <div className="rounded border border-border bg-card p-6">
                <h2 className="mb-6 font-mono text-lg font-bold">Projeler ({projects.length})</h2>

                {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz proje yok.</p>
                ) : (
                    <div className="space-y-2">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between rounded border border-border px-4 py-3"
                            >
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="font-mono text-sm font-bold">{p.title}</span>
                                    <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                                    <StatusBadge status={p.status} />
                                    {p.featured && <span className="text-xs text-primary">featured</span>}
                                    {!p.isActive && <span className="text-xs text-muted-foreground">pasif</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => setEditData(p)}
                                        className="text-xs border-primary dark:border-primary hover:text-primary transition-colors"
                                        variant="outline"
                                    >
                                        Düzenle
                                    </Button>
                                    <form action={deleteProjectAction}>
                                        <input type="hidden" name="id" value={p.id} />
                                        <Button type="submit" className="text-xs" variant="destructive">
                                            Sil
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
                <DialogContent className="max-h-[90vh] min-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-primary">Proje Düzenle</DialogTitle>
                    </DialogHeader>

                    {editState?.edited && (
                        <div className="rounded border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
                            Proje güncellendi.
                        </div>
                    )}

                    {editData && (
                        <form action={editAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input type="hidden" name="id" value={editData.id} />
                            <input type="hidden" name="imageUrl" value={editData.imageUrl ?? ""} />

                            <Field data-invalid={!!err("slug")}>
                                <FieldLabel>Slug</FieldLabel>
                                <Input name="slug" defaultValue={editData.slug} required />
                                <FieldError>{err("slug")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("title")}>
                                <FieldLabel>Başlık</FieldLabel>
                                <Input name="title" defaultValue={editData.title} required />
                                <FieldError>{err("title")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("descriptionTr")}>
                                <FieldLabel>Açıklama (TR)</FieldLabel>
                                <Textarea
                                    name="descriptionTr"
                                    rows={2}
                                    defaultValue={editData.descriptionTr}
                                    required
                                />
                                <FieldError>{err("descriptionTr")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("descriptionEn")}>
                                <FieldLabel>Açıklama (EN)</FieldLabel>
                                <Textarea
                                    name="descriptionEn"
                                    rows={2}
                                    defaultValue={editData.descriptionEn}
                                    required
                                />
                                <FieldError>{err("descriptionEn")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("longDescriptionTr")}>
                                <FieldLabel>Uzun Açıklama (TR) — Markdown</FieldLabel>
                                <Textarea
                                    name="longDescriptionTr"
                                    rows={4}
                                    defaultValue={editData.longDescriptionTr}
                                    required
                                />
                                <FieldError>{err("longDescriptionTr")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("longDescriptionEn")}>
                                <FieldLabel>Uzun Açıklama (EN) — Markdown</FieldLabel>
                                <Textarea
                                    name="longDescriptionEn"
                                    rows={4}
                                    defaultValue={editData.longDescriptionEn}
                                    required
                                />
                                <FieldError>{err("longDescriptionEn")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("tags")}>
                                <FieldLabel>Tagler (virgülle ayır)</FieldLabel>
                                <Input name="tags" defaultValue={editData.tags.join(", ")} />
                                <FieldError>{err("tags")}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>GitHub URL</FieldLabel>
                                <Input name="githubUrl" defaultValue={editData.githubUrl ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel>Live URL</FieldLabel>
                                <Input name="liveUrl" defaultValue={editData.liveUrl ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel>Status</FieldLabel>
                                <select
                                    name="status"
                                    defaultValue={editData.status}
                                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                    <option value="WIP">WIP</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </Field>
                            <div className="flex items-end gap-6">
                                <Field>
                                    <FieldLabel>Sıra</FieldLabel>
                                    <Input name="order" type="number" defaultValue={editData.order} className="w-20" />
                                </Field>
                                <label className="flex items-center gap-2 pb-1 text-sm text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        defaultChecked={editData.featured}
                                        className="accent-primary"
                                    />{" "}
                                    Featured
                                </label>
                                <label className="flex items-center gap-2 pb-1 text-sm text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        defaultChecked={editData.isActive}
                                        className="accent-primary"
                                    />{" "}
                                    Aktif
                                </label>
                            </div>
                            <Field data-invalid={!!err("imageUrl")}>
                                <FieldLabel>Görsel (değiştirmek için)</FieldLabel>
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    className="text-sm text-muted-foreground file:mr-3 file:rounded file:border file:border-border file:bg-card file:px-3 file:py-1 file:text-xs file:text-primary hover:file:border-primary"
                                />
                                {editData.imageUrl && (
                                    <p className="text-xs text-muted-foreground">Mevcut: {editData.imageUrl}</p>
                                )}
                                <FieldError>{err("imageUrl")}</FieldError>
                            </Field>
                            <div className="flex gap-3 md:col-span-2">
                                <Button type="submit" disabled={editPending}>
                                    {editPending ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setEditData(null)}>
                                    İptal
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        ACTIVE: "border-primary text-primary",
        WIP: "border-yellow-400 text-yellow-400",
        ARCHIVED: "border-border text-muted-foreground",
    };
    return <span className={`rounded border px-1.5 py-0.5 font-mono text-xs ${styles[status] ?? ""}`}>{status}</span>;
}
