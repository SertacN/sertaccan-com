"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { editProjectAction, deleteProjectAction } from "@/app/[locale]/admin/actions";
import type { InferSelectModel } from "drizzle-orm";
import { project } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import TagSelector from "./tag-selector";

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
                <DialogContent className="max-h-[90vh] min-w-6xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-primary">Proje Düzenle</DialogTitle>
                        <DialogDescription className="sr-only">Proje bilgilerini düzenleyin.</DialogDescription>
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
                                <FieldLabel htmlFor="edit-slug">Slug</FieldLabel>
                                <Input id="edit-slug" name="slug" defaultValue={editData.slug} required />
                                <FieldError>{err("slug")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("title")}>
                                <FieldLabel htmlFor="edit-title">Başlık</FieldLabel>
                                <Input id="edit-title" name="title" defaultValue={editData.title} required />
                                <FieldError>{err("title")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("descriptionTr")}>
                                <FieldLabel htmlFor="edit-descriptionTr">Açıklama (TR)</FieldLabel>
                                <Textarea
                                    id="edit-descriptionTr"
                                    name="descriptionTr"
                                    rows={2}
                                    defaultValue={editData.descriptionTr}
                                    required
                                />
                                <FieldError>{err("descriptionTr")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("descriptionEn")}>
                                <FieldLabel htmlFor="edit-descriptionEn">Açıklama (EN)</FieldLabel>
                                <Textarea
                                    id="edit-descriptionEn"
                                    name="descriptionEn"
                                    rows={2}
                                    defaultValue={editData.descriptionEn}
                                    required
                                />
                                <FieldError>{err("descriptionEn")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("longDescriptionTr")}>
                                <FieldLabel htmlFor="edit-longDescriptionTr">Uzun Açıklama (TR) — Markdown</FieldLabel>
                                <Textarea
                                    id="edit-longDescriptionTr"
                                    name="longDescriptionTr"
                                    rows={4}
                                    defaultValue={editData.longDescriptionTr}
                                    required
                                />
                                <FieldError>{err("longDescriptionTr")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("longDescriptionEn")}>
                                <FieldLabel htmlFor="edit-longDescriptionEn">Uzun Açıklama (EN) — Markdown</FieldLabel>
                                <Textarea
                                    id="edit-longDescriptionEn"
                                    name="longDescriptionEn"
                                    rows={4}
                                    defaultValue={editData.longDescriptionEn}
                                    required
                                />
                                <FieldError>{err("longDescriptionEn")}</FieldError>
                            </Field>
                            <Field data-invalid={!!err("tags")} className="md:col-span-2">
                                <FieldLabel>Tagler</FieldLabel>
                                <TagSelector key={editData.id} defaultValue={editData.tags} error={err("tags")} />
                            </Field>
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="edit-titleEn">Başlık (EN) — opsiyonel</FieldLabel>
                                <Input
                                    id="edit-titleEn"
                                    name="titleEn"
                                    defaultValue={editData.titleEn ?? ""}
                                    placeholder="Project Name"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-githubUrl">GitHub URL</FieldLabel>
                                <Input id="edit-githubUrl" name="githubUrl" defaultValue={editData.githubUrl ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-liveUrl">Live URL</FieldLabel>
                                <Input id="edit-liveUrl" name="liveUrl" defaultValue={editData.liveUrl ?? ""} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-appStoreUrl">App Store URL — opsiyonel</FieldLabel>
                                <Input
                                    id="edit-appStoreUrl"
                                    name="appStoreUrl"
                                    defaultValue={editData.appStoreUrl ?? ""}
                                    placeholder="https://apps.apple.com/..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-googlePlayUrl">Google Play URL — opsiyonel</FieldLabel>
                                <Input
                                    id="edit-googlePlayUrl"
                                    name="googlePlayUrl"
                                    defaultValue={editData.googlePlayUrl ?? ""}
                                    placeholder="https://play.google.com/..."
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-status">Status</FieldLabel>
                                <Select name="status" defaultValue={editData.status}>
                                    <SelectTrigger id="edit-status">
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
                                <Field>
                                    <FieldLabel htmlFor="edit-order">Sıra</FieldLabel>
                                    <Input
                                        id="edit-order"
                                        name="order"
                                        type="number"
                                        defaultValue={editData.order}
                                        className="w-20"
                                    />
                                </Field>
                                <FieldGroup className="flex-row">
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="edit-featured"
                                            name="featured"
                                            defaultChecked={editData.featured}
                                        />
                                        <FieldLabel htmlFor="edit-featured" className="font-normal">
                                            Featured
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="edit-isActive"
                                            name="isActive"
                                            defaultChecked={editData.isActive}
                                        />
                                        <FieldLabel htmlFor="edit-isActive" className="font-normal">
                                            Aktif
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                            <Field data-invalid={!!err("imageUrl")}>
                                <Field>
                                    <FieldLabel htmlFor="edit-file">Görsel</FieldLabel>
                                    <Input type="file" id="edit-file" name="file" accept="image/*" />
                                    {editData.imageUrl && <span>{editData.imageUrl}</span>}
                                    <FieldError>{err("imageUrl")}</FieldError>
                                </Field>
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
