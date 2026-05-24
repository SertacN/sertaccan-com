import z from "zod";

export const createContactFormSchema = (t: (key: string, values?: Record<string, number>) => string) =>
    z.object({
        name: z
            .string()
            .min(2, t("name.min", { min: 2 }))
            .max(50, t("name.max", { max: 50 })),
        email: z.email(t("email.invalid")),
        subject: z
            .string()
            .min(3, t("subject.min", { min: 3 }))
            .max(100, t("subject.max", { max: 100 })),
        message: z
            .string()
            .min(10, t("message.min", { min: 10 }))
            .max(500, t("message.max", { max: 500 })),
    });

export type ContactFormSchema = z.infer<ReturnType<typeof createContactFormSchema>>;
