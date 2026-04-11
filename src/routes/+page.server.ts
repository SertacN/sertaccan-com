import { createContactFormSchema } from '$lib/schemas';
import { getProjects } from '$lib/server/projects';
import type { Actions, PageServerLoad } from './$types';
import { flattenErrors } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { createContactForm, createRateLimiter } from '$lib/server';

const contactLimiter = createRateLimiter({ limit: 2, windowMs: 60_000 });

export const load = (async () => {
	const projects = await getProjects({ featured: true, take: 3 });
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createContactForm: async ({ request, getClientAddress }) => {
		const ip = getClientAddress();

		if (contactLimiter.isLimited(ip))
			return fail(429, {
				action: 'createContactForm',
				errors: { _form: ['Too many requests. Please wait a minute.'] }
			});

		const formData = await request.formData();
		const result = createContactFormSchema().safeParse(Object.fromEntries(formData));

		if (!result.success)
			return fail(400, { action: 'createContactForm', errors: flattenErrors(result.error) });

		const res = await createContactForm(result.data);
		if (!res.success) return fail(400, { action: 'createContactForm', errors: res.errors ?? {} });

		contactLimiter.increment(ip);
		return { action: 'createContactForm', success: true };
	}
};
