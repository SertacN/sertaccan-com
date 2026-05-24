"use server";

import { createContactForm } from "@/lib/server/contact-form";
import { createRateLimiter, getIP } from "@/lib/server/rate-limit";

const contactLimiter = createRateLimiter({ limit: 3, windowMs: 60_000 });

export async function createContactFormAction(_state: unknown, formData: FormData) {
    const ip = await getIP();

    if (contactLimiter.isLimited(ip)) {
        return { errors: { _form: ["Çok fazla istek. Lütfen bir dakika bekleyin."] } };
    }

    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    };

    const result = await createContactForm(raw);
    if (!result.success) return { errors: result.errors };

    contactLimiter.increment(ip);
    return { success: true };
}
