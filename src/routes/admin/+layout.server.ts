import { redirect } from '@sveltejs/kit';
import { getUnreadContactFormCount } from '$lib/server';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const isLoginPage = url.pathname === '/admin/login';

	if (!locals.user && !isLoginPage) {
		redirect(303, '/admin/login');
	}

	if (locals.user && locals.user.role !== 'admin' && !isLoginPage) {
		redirect(303, '/');
	}

	if (locals.user && locals.user.role === 'admin' && isLoginPage) {
		redirect(303, '/admin');
	}

	const unreadContactCount = locals.user?.role === 'admin' ? await getUnreadContactFormCount() : 0;

	return { user: locals.user, unreadContactCount };
}) satisfies LayoutServerLoad;
