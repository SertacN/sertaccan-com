"use server";

import { requireAdmin } from "@/lib/server/auth";
import { markContactAsRead } from "@/lib/server/contact-form";

export async function markAsReadAction(id: string): Promise<void> {
    await requireAdmin();
    await markContactAsRead(id);
}
