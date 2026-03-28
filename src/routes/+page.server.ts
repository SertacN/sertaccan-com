import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const projects = await prisma.project.findMany({
		where: { featured: true, isDeleted: false, isActive: true },
		orderBy: { order: 'asc' },
		take: 3
	});
	return { projects };
}) satisfies PageServerLoad;
