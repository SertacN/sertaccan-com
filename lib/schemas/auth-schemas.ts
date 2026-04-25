import { z } from "zod";
export const loginSchema = z.object({
    email: z.email("Geçerli bir email girin"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
