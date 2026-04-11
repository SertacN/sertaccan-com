import { z } from 'zod';

export const createUserSchema = z.object({
	name: z.string().min(1, 'İsim zorunlu').max(100),
	email: z.email('Geçerli bir email gir'),
	password: z.string().min(8, 'En az 8 karakter olmalı'),
	role: z.enum(['admin', 'user'])
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
