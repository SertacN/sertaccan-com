import { getAllProjects } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	console.log(page);
	const { projects, pagination } = await getAllProjects({ page, limit: 6 });
	return { projects, pagination };
}) satisfies PageServerLoad;
