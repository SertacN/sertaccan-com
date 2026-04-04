import { prisma } from '$lib/server/prisma';
import { projectSchema } from '$lib/schemas/project.schema';
import type { z } from 'zod';
import type { Prisma } from '@prisma/client';

// ── Types ──

type FieldErrors = Record<string, string[]>;

type CreateResult =
	| { ok: true; project: Awaited<ReturnType<typeof prisma.project.create>> }
	| { ok: false; errors: FieldErrors };

// ── Helpers ──

function flattenErrors(error: z.ZodError): FieldErrors {
	const result: FieldErrors = {};
	for (const issue of error.issues) {
		const key = issue.path[0]?.toString() ?? '_root';
		if (!result[key]) result[key] = [];
		result[key].push(issue.message);
	}
	return result;
}

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

export async function getAllProjects(options?: { page?: number; limit?: number }) {
	const page = options?.page ?? 1;
	const limit = options?.limit ?? 20;
	const skip = (page - 1) * limit;

	const [projects, total] = await prisma.$transaction([
		prisma.project.findMany({
			orderBy: { order: 'asc' },
			skip,
			take: limit
		}),
		prisma.project.count()
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

export async function createProject(raw: Record<string, unknown>): Promise<CreateResult> {
	const result = projectSchema.safeParse(raw);
	if (!result.success) {
		return { ok: false, errors: flattenErrors(result.error) };
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
		return { ok: true, project };
	} catch (err: unknown) {
		if (
			(err instanceof Error && err.message.includes('Unique constraint')) ||
			(err as { code?: string }).code === 'P2002'
		) {
			return { ok: false, errors: { slug: ['Bu slug zaten kullanılıyor.'] } };
		}
		throw err;
	}
}

export function deleteProject(id: string) {
	return prisma.project.delete({ where: { id } });
}
