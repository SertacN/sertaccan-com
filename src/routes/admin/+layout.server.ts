import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const isLoginPage = url.pathname.includes('/admin/login');

	if (!locals.user && !isLoginPage) {
		redirect(303, '/admin/login');
	}

	if (locals.user && locals.user.role !== 'admin' && !isLoginPage) {
		redirect(303, '/');
	}
	return { user: locals.user };
}) satisfies LayoutServerLoad;
