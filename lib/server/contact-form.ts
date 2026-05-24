import { db } from "@/db";
import { contactForm } from "@/db/schema";
import { z } from "zod";
import { createContactFormSchema } from "@/lib/schemas/contact-form-schemas";
import { apiError, apiSuccess } from "@/types";
import { getTranslations } from "next-intl/server";
import { count, desc, eq } from "drizzle-orm";

// -- Queries --
// -- Get All --
export async function getAllContactForm(options?: { page?: number; limit?: number; take?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.take ?? options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const [rows, [{ total }]] = await Promise.all([
        db.select().from(contactForm).orderBy(desc(contactForm.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(contactForm),
    ]);
    return apiSuccess({
        contactForm: rows,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
// -- Get Unread Form --
export async function getUnreadContactFormCount(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(contactForm).where(eq(contactForm.isRead, false));
    return total;
}

// ── Mutations ──
// -- Create --
export async function createContactForm(raw: unknown) {
    const t = await getTranslations("contact_form");
    const schema = createContactFormSchema(t);

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
        return apiError("Geçersiz veri", z.flattenError(parsed.error).fieldErrors);
    }

    await db.insert(contactForm).values(parsed.data);
    return apiSuccess(null);
}
