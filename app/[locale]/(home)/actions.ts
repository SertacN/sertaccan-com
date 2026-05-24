"use server";

import { createContactForm } from "@/lib/server/contact-form";

export async function createContactFormAction(_state: unknown, formData: FormData) {
    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    };

    const result = await createContactForm(raw);
    if (!result.success) return { errors: result.errors };

    return { success: true };
}
