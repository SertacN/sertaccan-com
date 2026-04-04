import { getProjects } from '$lib/server/projects';

export const GET = async () => {
	const projects = await getProjects();
	const base = 'https://sertaccan.com';

	const pages = [
		{ url: '', priority: '1.0' },
		{ url: '/projects', priority: '0.8' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${base}${p.url}</loc><priority>${p.priority}</priority></url>`).join('\n')}
${projects.map((p) => `  <url><loc>${base}/projects/${p.slug}</loc><lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod><priority>0.6</priority></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
