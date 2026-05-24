import { db } from "@/db";
import { contactForm } from "@/db/schema";
import { z } from "zod";
import { createContactFormSchema } from "@/lib/schemas/contact-form-schemas";
import { apiError, apiSuccess } from "@/types";
import { getTranslations } from "next-intl/server";

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
