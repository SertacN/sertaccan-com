"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUserAction, deleteUserAction, banUserAction, unbanUserAction } from "@/app/[locale]/admin/users/actions";

type UserRow = {
    id: string;
    name: string;
    email: string;
    role: string | null;
    banned: boolean | null;
    createdAt: Date;
};

type ActionState = { action: string; success?: boolean; errors?: Record<string, string[]> } | null;

export default function UserManagement({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
    const [state, action, pending] = useActionState<ActionState, FormData>(createUserAction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const err = (field: string) => state?.errors?.[field]?.[0];

    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state?.success]);

    return (
        <>
            {/* Yeni Kullanıcı Oluştur */}
            <div className="rounded border border-border bg-card p-6">
                <h2 className="mb-6 font-mono text-lg font-bold">Yeni Kullanıcı Oluştur</h2>

                {state?.action === "create" && state.success && (
                    <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-sm text-primary">
                        Kullanıcı oluşturuldu.
                    </div>
                )}
                {state?.action === "create" && state.errors && (
                    <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-4 py-2 font-mono text-sm text-destructive">
                        {Object.values(state.errors).flat().map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}
                    </div>
                )}

                <form ref={formRef} action={action} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field data-invalid={!!err("name")}>
                        <FieldLabel htmlFor="new-name">İsim</FieldLabel>
                        <Input id="new-name" name="name" required />
                        <FieldError>{err("name")}</FieldError>
                    </Field>
                    <Field data-invalid={!!err("email")}>
                        <FieldLabel htmlFor="new-email">Email</FieldLabel>
                        <Input id="new-email" name="email" type="email" autoComplete="username" required />
                        <FieldError>{err("email")}</FieldError>
                    </Field>
                    <Field data-invalid={!!err("password")}>
                        <FieldLabel htmlFor="new-password">Şifre</FieldLabel>
                        <Input id="new-password" name="password" type="password" autoComplete="new-password" required />
                        <FieldError>{err("password")}</FieldError>
                    </Field>
                    <Field data-invalid={!!err("role")}>
                        <FieldLabel htmlFor="new-role">Rol</FieldLabel>
                        <Select name="role" defaultValue="user">
                            <SelectTrigger id="new-role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="user">user</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldError>{err("role")}</FieldError>
                    </Field>
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={pending}>
                            {pending ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Kullanıcı Listesi */}
            <div className="rounded border border-border bg-card p-6">
                <h2 className="mb-6 font-mono text-lg font-bold">Kullanıcılar ({users.length})</h2>

                {users.length === 0 ? (
                    <p className="font-mono text-sm text-muted-foreground">Kullanıcı bulunamadı.</p>
                ) : (
                    <div className="space-y-2">
                        {users.map((u) => (
                            <div key={u.id} className="flex items-center justify-between rounded border border-border px-4 py-3">
                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <span className={`font-mono text-sm font-bold ${u.banned ? "line-through text-muted-foreground" : ""}`}>
                                        {u.name}
                                    </span>
                                    <span className="font-mono text-xs text-muted-foreground">{u.email}</span>
                                </div>
                                <div className="flex shrink-0 items-center gap-4">
                                    <span className={`font-mono text-xs ${u.role === "admin" ? "text-primary" : "text-muted-foreground"}`}>
                                        {u.role ?? "user"}
                                    </span>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                                    </span>
                                    {u.id !== currentUserId ? (
                                        <div className="flex items-center gap-3">
                                            <form action={deleteUserAction}>
                                                <input type="hidden" name="id" value={u.id} />
                                                <Button type="submit" variant="destructive" className="h-auto px-2 py-1 text-xs">
                                                    Sil
                                                </Button>
                                            </form>
                                            <form action={u.banned ? unbanUserAction : banUserAction}>
                                                <input type="hidden" name="id" value={u.id} />
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    className={`h-auto px-2 py-1 text-xs ${u.banned ? "border-primary text-primary" : "border-destructive text-destructive"}`}
                                                >
                                                    {u.banned ? "Yasağı Kaldır" : "Yasakla"}
                                                </Button>
                                            </form>
                                        </div>
                                    ) : (
                                        <span className="font-mono text-xs text-muted-foreground/40">sen</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
