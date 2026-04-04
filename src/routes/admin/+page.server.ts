import { fail } from '@sveltejs/kit';
import { getAllProjects, createProject, deleteProject } from '$lib/server/projects';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const load = (async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const { projects, pagination } = await getAllProjects({ page, limit: 20 });
	return { projects, pagination };
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

		// Dosya yükleme kontrolü
		const file = formData.get('file');
		let fileExt = '';
		if (file instanceof File && file.size > 0) {
			fileExt = file.name.split('.').pop()?.toLowerCase() ?? '';
			const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
			if (!allowed.includes(fileExt)) {
				return fail(400, {
					errors: { imageUrl: ['Sadece jpg, png, webp, gif yüklenebilir.'] },
					values: raw
				});
			}
		}

		// Dosyayı kaydet (validasyondan önce imageUrl'i set etmek için)
		if (file instanceof File && file.size > 0) {
			try {
				const filename = `${randomUUID()}.${fileExt}`;
				await mkdir(UPLOAD_DIR, { recursive: true });
				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(join(UPLOAD_DIR, filename), buffer);
				raw.imageUrl = `/api/files/${filename}`;
			} catch (err) {
				console.error('Upload hatası:', err);
				return fail(400, {
					errors: { imageUrl: ['Dosya yüklenemedi.'] },
					values: raw
				});
			}
		}

		// Servis katmanı: validasyon + DB yazma
		const result = await createProject(raw);
		if (!result.ok) {
			return fail(400, { errors: result.errors, values: raw });
		}

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { errors: { id: ['ID gerekli'] } });
		}

		const { prisma } = await import('$lib/server/prisma');
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

		await deleteProject(id);
		return { deleted: true };
	}
};
