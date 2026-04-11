import * as m from '$lib/paraglide/messages';
import { z } from 'zod';

export const createContactFormSchema = () =>
	z.object({
		name: z.string().min(1, m.validation_required()).max(20, m.validation_max_20()),
		email: z.email(m.validation_invalid_email()),
		subject: z.string().min(1, m.validation_required()).max(50, m.validation_max_50()),
		message: z.string().min(1, m.validation_required()).max(300, m.validation_max_300())
	});
