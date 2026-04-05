import { auth } from './auth';
import { prisma } from './prisma';
import { apiSuccess, apiError } from '$lib/types/api';
import type { ApiResponse } from '$lib/types/api';
import type { profileSchema, passwordSchema, createUserSchema } from '$lib/schemas';
import type { z } from 'zod';

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
): Promise<ApiResponse<null>> {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: { name: data.name, email: data.email }
		});
		return apiSuccess(null, 'Profil güncellendi');
	} catch {
		return apiError('Güncelleme başarısız', { _: ['Güncelleme başarısız'] });
	}
}

export async function changePassword(
	headers: Headers,
	data: z.infer<typeof passwordSchema>
): Promise<ApiResponse<null>> {
	try {
		await auth.api.changePassword({
			body: {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: false
			},
			headers
		});
		return apiSuccess(null, 'Şifre değiştirildi');
	} catch {
		return apiError('Mevcut şifre yanlış', { _: ['Mevcut şifre yanlış'] });
	}
}

export async function createUser(
	headers: Headers,
	data: z.infer<typeof createUserSchema>
): Promise<ApiResponse<null>> {
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
		return apiSuccess(null, 'Kullanıcı oluşturuldu');
	} catch {
		return apiError('Kullanıcı oluşturulamadı', {
			_: ['Kullanıcı oluşturulamadı (email zaten kullanımda olabilir)']
		});
	}
}

export async function deleteUser(headers: Headers, userId: string): Promise<ApiResponse<null>> {
	try {
		await auth.api.removeUser({ body: { userId }, headers });
		return apiSuccess(null, 'Kullanıcı silindi');
	} catch {
		return apiError('Silme başarısız', { _: ['Silme başarısız'] });
	}
}
