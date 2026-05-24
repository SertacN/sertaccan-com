import { z } from "zod";

export const profileSchema = z.object({
    name: z.string().min(1, "İsim zorunlu").max(100),
    email: z.email("Geçerli bir email gir"),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunlu"),
    newPassword: z.string().min(8, "En az 8 karakter olmalı"),
});

export const createUserSchema = z.object({
    name: z.string().min(1, "İsim zorunlu").max(100),
    email: z.email("Geçerli bir email gir"),
    password: z.string().min(8, "En az 8 karakter olmalı"),
    role: z.enum(["admin", "user"]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
