import { fail } from '@sveltejs/kit';
import { getAllContactForm, editContactForm } from '$lib/server';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const { contactForm, paginationContact } = await getAllContactForm({ limit: 50 });
	return { contactForm, paginationContact };
}) satisfies PageServerLoad;

export const actions: Actions = {
	markAsRead: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'ID gerekli' });
		}

		const result = await editContactForm(id, { isRead: true });

		if (!result.success) {
			return fail(500, { error: result.message });
		}

		return { success: true };
	}
};
