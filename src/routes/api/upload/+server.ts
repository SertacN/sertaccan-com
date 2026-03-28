import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { apiSuccess, apiError } from '$lib/types/api';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const EXT_MAP: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return json(apiError('Yetkisiz erişim.'), { status: 401 });
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return json(apiError('Geçersiz form verisi.'), { status: 400 });
	}

	const file = formData.get('file');
	if (!(file instanceof File)) {
		return json(apiError('Dosya bulunamadı.'), { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return json(apiError('Sadece JPEG, PNG, WebP ve GIF desteklenir.'), { status: 400 });
	}

	if (file.size > MAX_SIZE) {
		return json(apiError('Dosya boyutu 5MB\'ı geçemez.'), { status: 400 });
	}

	const ext = EXT_MAP[file.type];
	const filename = `${randomUUID()}.${ext}`;

	await mkdir(UPLOAD_DIR, { recursive: true });
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(join(UPLOAD_DIR, filename), buffer);

	return json(apiSuccess({ url: `/api/files/${filename}` }, 'Dosya yüklendi.'), { status: 201 });
};
