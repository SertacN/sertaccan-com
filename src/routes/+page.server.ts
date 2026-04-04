import { getProjects } from '$lib/server/projects';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const projects = await getProjects({ featured: true, take: 3 });
	return { projects };
}) satisfies PageServerLoad;
