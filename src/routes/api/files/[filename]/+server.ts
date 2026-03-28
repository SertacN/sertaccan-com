import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

const MIME_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	gif: 'image/gif'
};

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;

	if (filename.includes('/') || filename.includes('..')) {
		error(400, 'Geçersiz dosya adı.');
	}

	const ext = filename.split('.').pop()?.toLowerCase() ?? '';
	const contentType = MIME_TYPES[ext];
	if (!contentType) {
		error(400, 'Desteklenmeyen dosya türü.');
	}

	let buffer: Buffer;
	try {
		buffer = await readFile(join(UPLOAD_DIR, filename));
	} catch {
		error(404, 'Dosya bulunamadı.');
	}

	return new Response(buffer, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
