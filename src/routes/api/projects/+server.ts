import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { apiSuccess, apiError } from '$lib/types/api';
import { projectSchema } from '$lib/schemas/project.schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
		const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? 10)));
		const skip = (page - 1) * limit;

		const [projects, total] = await prisma.$transaction([
			prisma.project.findMany({
				where: { isDeleted: false },
				orderBy: { order: 'asc' },
				skip,
				take: limit
			}),
			prisma.project.count({ where: { isDeleted: false } })
		]);

		return json(
			apiSuccess({
				items: projects,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			})
		);
	} catch {
		return json(apiError('Projeler alınamadı.'), { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return json(apiError('Yetkisiz erişim.'), { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json(apiError('Geçersiz JSON.'), { status: 400 });
	}

	const result = projectSchema.safeParse(body);
	if (!result.success) {
		return json(
			{ success: false, message: 'Validasyon hatası.', errors: result.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { imageUrl, githubUrl, liveUrl, ...rest } = result.data;

	try {
		const project = await prisma.project.create({
			data: {
				...rest,
				imageUrl: imageUrl || null,
				githubUrl: githubUrl || null,
				liveUrl: liveUrl || null
			}
		});
		return json(apiSuccess(project, 'Proje oluşturuldu.'), { status: 201 });
	} catch (e: unknown) {
		if ((e as { code?: string }).code === 'P2002') {
			return json(apiError('Bu slug zaten kullanılıyor.'), { status: 409 });
		}
		return json(apiError('Proje oluşturulamadı.'), { status: 500 });
	}
};
