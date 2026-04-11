import { z } from 'zod';

export const editContactFormSchema = z.object({
	isRead: z.boolean().optional(),
	replyMessage: z.string().max(2000).nullable().optional(),
	repliedAt: z.coerce.date().nullable().optional()
});

export type EditContactFormInput = z.infer<typeof editContactFormSchema>;
