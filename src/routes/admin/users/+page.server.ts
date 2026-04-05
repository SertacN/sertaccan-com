import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createUserSchema, passwordSchema, profileSchema } from '$lib/schemas';
import { listUsers, updateProfile, changePassword, createUser, deleteUser } from '$lib/server';
import { flattenErrors } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const users = user?.role === 'admin' ? await listUsers() : null;
	return { user, users };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { action: 'profile', errors: { _: ['Oturum açık değil'] } });

		const formData = await request.formData();
		const result = profileSchema.safeParse(Object.fromEntries(formData));
		if (!result.success)
			return fail(400, { action: 'profile', errors: flattenErrors(result.error) });

		const res = await updateProfile(locals.user.id, result.data);
		if (!res.success) return fail(500, { action: 'profile', errors: res.errors ?? {} });
		return { action: 'profile', success: true };
	},

	updatePassword: async ({ request }) => {
		const formData = await request.formData();
		const result = passwordSchema.safeParse(Object.fromEntries(formData));
		if (!result.success)
			return fail(400, { action: 'password', errors: flattenErrors(result.error) });

		const res = await changePassword(request.headers, result.data);
		if (!res.success) return fail(400, { action: 'password', errors: res.errors ?? {} });
		return { action: 'password', success: true };
	},

	createUser: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin')
			return fail(403, { action: 'create', errors: { _: ['Yetkisiz işlem'] } });

		const formData = await request.formData();
		const result = createUserSchema.safeParse(Object.fromEntries(formData));
		if (!result.success)
			return fail(400, { action: 'create', errors: flattenErrors(result.error) });

		const res = await createUser(request.headers, result.data);
		if (!res.success) return fail(400, { action: 'create', errors: res.errors ?? {} });
		return { action: 'create', success: true };
	},

	deleteUser: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin')
			return fail(403, { action: 'delete', errors: { _: ['Yetkisiz işlem'] } });

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (id === locals.user.id)
			return fail(400, { action: 'delete', errors: { _: ['Kendinizi silemezsiniz'] } });

		const res = await deleteUser(request.headers, id);
		if (!res.success) return fail(500, { action: 'delete', errors: res.errors ?? {} });
		return { action: 'delete', success: true };
	}
};
