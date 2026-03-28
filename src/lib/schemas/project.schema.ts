import { z } from 'zod';

export const projectSchema = z.object({
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire'),
	title: z.string().min(1, 'Başlık zorunlu').max(100),
	descriptionTr: z.string().min(1).max(500),
	descriptionEn: z.string().min(1).max(500),
	longDescriptionTr: z.string().min(1),
	longDescriptionEn: z.string().min(1),
	imageUrl: z.string().url().optional().or(z.literal('')),
	tags: z.array(z.string()).min(1, 'En az bir tag zorunlu'),
	githubUrl: z.string().url().optional().or(z.literal('')),
	liveUrl: z.string().url().optional().or(z.literal('')),
	status: z.enum(['ACTIVE', 'WIP', 'ARCHIVED']).default('WIP'),
	featured: z.boolean().default(false),
	order: z.number().int().default(0),
	isActive: z.boolean().default(true)
});

export type ProjectInput = z.infer<typeof projectSchema>;
