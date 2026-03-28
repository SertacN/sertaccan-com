import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const projects = await prisma.project.findMany({
		where: { isDeleted: false },
		orderBy: { order: 'asc' }
	});
	return json(projects);
};
