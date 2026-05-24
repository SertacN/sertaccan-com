"use client";

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { contactForm } from "@/db/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { markAsReadAction } from "@/app/[locale]/admin/contact/actions";

type Contact = InferSelectModel<typeof contactForm>;

function formatDate(date: Date) {
    return new Date(date).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ContactList({ contacts: initial }: { contacts: Contact[] }) {
    const [contacts, setContacts] = useState(initial);
    const [selected, setSelected] = useState<Contact | null>(null);

    async function openContact(contact: Contact) {
        setSelected(contact);
        if (!contact.isRead) {
            await markAsReadAction(contact.id);
            setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c)));
            setSelected((s) => (s?.id === contact.id ? { ...s, isRead: true } : s));
        }
    }

    return (
        <>
            {contacts.length === 0 ? (
                <p className="font-mono text-sm text-muted-foreground">Henüz iletişim formu yok.</p>
            ) : (
                <div className="overflow-hidden rounded border border-border">
                    {contacts.map((contact) => (
                        <button
                            key={contact.id}
                            type="button"
                            onClick={() => openContact(contact)}
                            className="flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-card"
                        >
                            <span
                                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                    contact.isRead ? "border border-muted-foreground/40" : "bg-primary"
                                }`}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-medium">{contact.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">{contact.email}</span>
                                </div>
                                <p className="truncate font-mono text-xs text-muted-foreground">{contact.subject}</p>
                            </div>
                            <span className="shrink-0 font-mono text-xs text-muted-foreground">
                                {formatDate(contact.createdAt)}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-primary">{selected?.subject}</DialogTitle>
                        <DialogDescription className="font-mono text-xs">
                            {selected?.name} —{" "}
                            <a href={`mailto:${selected?.email}`} className="text-primary hover:underline">
                                {selected?.email}
                            </a>
                            <br />
                            {selected && formatDate(selected.createdAt)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded border border-border bg-background p-4">
                        <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{selected?.message}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
