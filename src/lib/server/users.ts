import { auth } from './auth';
import { prisma } from './prisma';
import type { profileSchema, passwordSchema, createUserSchema } from '$lib/schemas';
import type { z } from 'zod';

// ── Types ──

type FieldErrors = Record<string, string[]>;

type Result<T = void> =
	| (T extends void ? { ok: true } : { ok: true; data: T })
	| { ok: false; errors: FieldErrors };

// ── Queries ──

export function listUsers() {
	return prisma.user.findMany({
		select: { id: true, name: true, email: true, role: true, createdAt: true },
		orderBy: { createdAt: 'asc' }
	});
}

// ── Mutations ──

export async function updateProfile(
	userId: string,
	data: z.infer<typeof profileSchema>
): Promise<Result> {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: { name: data.name, email: data.email }
		});
		return { ok: true };
	} catch {
		return { ok: false, errors: { _: ['Güncelleme başarısız'] } };
	}
}

export async function changePassword(
	headers: Headers,
	data: z.infer<typeof passwordSchema>
): Promise<Result> {
	try {
		await auth.api.changePassword({
			body: {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: false
			},
			headers
		});
		return { ok: true };
	} catch {
		return { ok: false, errors: { _: ['Mevcut şifre yanlış'] } };
	}
}

export async function createUser(
	headers: Headers,
	data: z.infer<typeof createUserSchema>
): Promise<Result> {
	try {
		await auth.api.createUser({
			body: {
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role
			},
			headers
		});
		return { ok: true };
	} catch {
		return { ok: false, errors: { _: ['Kullanıcı oluşturulamadı (email zaten kullanımda olabilir)'] } };
	}
}

export async function deleteUser(headers: Headers, userId: string): Promise<Result> {
	try {
		await auth.api.removeUser({ body: { userId }, headers });
		return { ok: true };
	} catch {
		return { ok: false, errors: { _: ['Silme başarısız'] } };
	}
}
