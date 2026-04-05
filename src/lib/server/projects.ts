import { prisma } from '$lib/server/prisma';
import { projectSchema } from '$lib/schemas/project.schema';
import { apiSuccess, apiError } from '$lib/types/api';
import type { ApiResponse } from '$lib/types/api';
import { flattenErrors } from '$lib/utils';
import type { Prisma } from '@prisma/client';

// ── Queries ──

export function getProjects(options?: { featured?: boolean; take?: number }) {
	const where: Prisma.ProjectWhereInput = { isDeleted: false, isActive: true };
	if (options?.featured !== undefined) where.featured = options.featured;

	return prisma.project.findMany({
		where,
		orderBy: { order: 'asc' },
		...(options?.take && { take: options.take })
	});
}

export function getProjectBySlug(slug: string) {
	return prisma.project.findUnique({
		where: { slug, isDeleted: false }
	});
}

export async function getAllProjects(options?: {
	page?: number;
	limit?: number;
	isActive?: boolean;
}) {
	const page = options?.page ?? 1;
	const limit = options?.limit ?? 20;
	const skip = (page - 1) * limit;

	const where: Prisma.ProjectWhereInput = { isDeleted: false };
	if (options?.isActive !== undefined) {
		where.isActive = options.isActive;
	}

	const [projects, total] = await prisma.$transaction([
		prisma.project.findMany({
			where,
			orderBy: { order: 'asc' },
			skip,
			take: limit
		}),
		prisma.project.count({ where })
	]);

	return {
		projects,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}

// ── Mutations ──

export async function createProject(raw: Record<string, unknown>): Promise<ApiResponse> {
	const result = projectSchema.safeParse(raw);
	if (!result.success) {
		return apiError('Validasyon hatası', flattenErrors(result.error));
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
		return apiSuccess(project);
	} catch (err: unknown) {
		if (
			(err instanceof Error && err.message.includes('Unique constraint')) ||
			(err as { code?: string }).code === 'P2002'
		) {
			return apiError('Slug zaten kullanılıyor', { slug: ['Bu slug zaten kullanılıyor.'] });
		}
		throw err;
	}
}

export async function editProject(id: string, raw: Record<string, unknown>): Promise<ApiResponse> {
	const result = projectSchema.safeParse(raw);
	if (!result.success) {
		return apiError('Validasyon hatası', flattenErrors(result.error));
	}

	const { imageUrl, githubUrl, liveUrl, ...rest } = result.data;

	try {
		const project = await prisma.project.update({
			where: { id },
			data: {
				...rest,
				imageUrl: imageUrl || null,
				githubUrl: githubUrl || null,
				liveUrl: liveUrl || null
			}
		});
		return apiSuccess(project);
	} catch (err: unknown) {
		if ((err as { code?: string }).code === 'P2025') {
			return apiError('Proje bulunamadı', { _root: [`${id} ID'li proje bulunamadı`] });
		}
		if (
			(err instanceof Error && err.message.includes('Unique constraint')) ||
			(err as { code?: string }).code === 'P2002'
		) {
			return apiError('Slug zaten kullanılıyor', { slug: ['Bu slug zaten kullanılıyor.'] });
		}
		throw err;
	}
}
export function deleteProject(id: string) {
	return prisma.project.delete({ where: { id } });
}
