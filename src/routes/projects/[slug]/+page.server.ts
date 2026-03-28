import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const projectDetails = await prisma.project.findUnique({
		where: { slug: params.slug, isDeleted: false }
	});
	if (!projectDetails) error(404, 'Proje bulunamadı.');
	return { projectDetails };
}) satisfies PageServerLoad;
