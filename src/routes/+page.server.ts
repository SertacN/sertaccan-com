import { getContactFormSchema } from '$lib/schemas';
import { getProjects } from '$lib/server/projects';
import type { Actions, PageServerLoad } from './$types';
import { flattenErrors } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { createContactForm } from '$lib/server';

export const load = (async () => {
	const projects = await getProjects({ featured: true, take: 3 });
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createContactForm: async ({ request }) => {
		const formData = await request.formData();
		const result = getContactFormSchema().safeParse(Object.fromEntries(formData));

		if (!result.success)
			return fail(400, { action: 'createContactForm', errors: flattenErrors(result.error) });

		const res = await createContactForm(result.data);
		if (!res.success) return fail(400, { action: 'createContactForm', errors: res.errors ?? {} });
		return { action: 'createContactForm', success: true };
	}
};
