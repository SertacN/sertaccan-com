import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { projectSchema } from '$lib/schemas/project.schema';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';
import type { z } from 'zod';

type FieldErrors = Record<string, string[]>;

interface ActionFailure {
	errors: FieldErrors;
	values?: Record<string, unknown>;
}

function flattenErrors(error: z.ZodError): FieldErrors {
	const result: FieldErrors = {};
	for (const issue of error.issues) {
		const key = issue.path[0]?.toString() ?? '_root';
		if (!result[key]) result[key] = [];
		result[key].push(issue.message);
	}
	return result;
}

const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const load = (async () => {
	const projects = await prisma.project.findMany({
		orderBy: { order: 'asc' }
	});
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const raw: Record<string, unknown> = {
			slug: formData.get('slug'),
			title: formData.get('title'),
			descriptionTr: formData.get('descriptionTr'),
			descriptionEn: formData.get('descriptionEn'),
			longDescriptionTr: formData.get('longDescriptionTr'),
			longDescriptionEn: formData.get('longDescriptionEn'),
			imageUrl: '',
			tags: [
				...new Set(
					formData
						.get('tags')
						?.toString()
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean) ?? []
				)
			],
			githubUrl: formData.get('githubUrl') || '',
			liveUrl: formData.get('liveUrl') || '',
			status: formData.get('status') || 'WIP',
			featured: formData.get('featured') === 'on',
			order: Number(formData.get('order')) || 0,
			isActive: formData.get('isActive') === 'on'
		};

		// Dosya bilgisini al ama henüz kaydetme
		const file = formData.get('file');
		let fileExt = '';
		if (file instanceof File && file.size > 0) {
			fileExt = file.name.split('.').pop()?.toLowerCase() ?? '';
			const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
			if (!allowed.includes(fileExt)) {
				return fail<ActionFailure>(400, {
					errors: { imageUrl: ['Sadece jpg, png, webp, gif yüklenebilir.'] },
					values: raw
				});
			}
		}

		// Önce validasyon
		const result = projectSchema.safeParse(raw);
		if (!result.success) {
			return fail<ActionFailure>(400, {
				errors: flattenErrors(result.error),
				values: raw
			});
		}

		// Validasyon geçti, şimdi dosyayı kaydet
		if (file instanceof File && file.size > 0) {
			try {
				const filename = `${randomUUID()}.${fileExt}`;
				await mkdir(UPLOAD_DIR, { recursive: true });
				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(join(UPLOAD_DIR, filename), buffer);
				result.data.imageUrl = `/api/files/${filename}`;
			} catch (err) {
				console.error('Upload hatası:', err);
				return fail<ActionFailure>(400, {
					errors: { imageUrl: ['Dosya yüklenemedi.'] },
					values: raw
				});
			}
		}

		try {
			await prisma.project.create({ data: result.data });
		} catch (err: unknown) {
			if (err instanceof Error && err.message.includes('Unique constraint')) {
				return fail<ActionFailure>(400, {
					errors: { slug: ['Bu slug zaten kullanılıyor.'] },
					values: raw
				});
			}
			throw err;
		}
		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail<ActionFailure>(400, {
				errors: { id: ['ID gerekli'] }
			});
		}

		const project = await prisma.project.findUnique({ where: { id }, select: { imageUrl: true } });

		if (project?.imageUrl?.startsWith('/api/files/')) {
			const filename = project.imageUrl.replace('/api/files/', '');
			try {
				const { unlink } = await import('node:fs/promises');
				await unlink(join(UPLOAD_DIR, filename));
			} catch {
				// dosya zaten silinmişse sorun değil
			}
		}

		await prisma.project.delete({ where: { id } });
		return { deleted: true };
	}
};
