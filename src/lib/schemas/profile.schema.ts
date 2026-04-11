import { z } from 'zod';

export const profileSchema = z.object({
	name: z.string().min(1, 'İsim zorunlu').max(100),
	email: z.email('Geçerli bir email gir')
});

export type ProfileInput = z.infer<typeof profileSchema>;
