import { error } from '@sveltejs/kit';
import { getProjectBySlug } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const projectDetails = await getProjectBySlug(params.slug);
	if (!projectDetails) error(404, 'Proje bulunamadı.');
	return { projectDetails };
}) satisfies PageServerLoad;
