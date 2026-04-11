import { z } from 'zod';

export const passwordSchema = z.object({
	currentPassword: z.string().min(1, 'Mevcut şifre zorunlu'),
	newPassword: z.string().min(8, 'En az 8 karakter olmalı')
});

export type PasswordInput = z.infer<typeof passwordSchema>;
