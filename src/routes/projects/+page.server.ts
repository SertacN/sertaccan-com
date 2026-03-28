import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const projects = await prisma.project.findMany({
		where: { isDeleted: false, isActive: true },
		orderBy: { order: 'asc' }
	});
	return { projects };
}) satisfies PageServerLoad;
