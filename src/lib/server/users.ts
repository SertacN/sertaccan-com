import { auth } from './auth';
import { prisma } from './prisma';
import { apiSuccess, apiError } from '$lib/types/api';
import type { ApiResponse } from '$lib/types/api';
import type { ProfileInput, PasswordInput, CreateUserInput } from '$lib/schemas';

// ── Queries ──

export function listUsers() {
	return prisma.user.findMany({
		select: { id: true, name: true, email: true, banned: true, role: true, createdAt: true },
		orderBy: { createdAt: 'asc' }
	});
}

// ── Mutations ──

export async function updateProfile(
	userId: string,
	data: ProfileInput
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
	data: PasswordInput
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
	data: CreateUserInput
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

export async function banUser(headers: Headers, userId: string): Promise<ApiResponse<null>> {
	try {
		await auth.api.banUser({
			body: { userId },
			headers
		});
		return apiSuccess(null, 'Kullanıcı Yasaklandı.');
	} catch {
		return apiError('Kullanıcı Yasaklama Sırasında Bir Hata Oluştu', {
			_: ['Yasaklama Başarısız']
		});
	}
}

export async function unBanUser(headers: Headers, userId: string) {
	try {
		await auth.api.unbanUser({
			body: { userId },
			headers
		});
		return apiSuccess(null, 'Kullanıcı Yasağı Kaldırıldı');
	} catch {
		return apiError('Kullanıcı Yasağı Kaldırılamadı', { _: ['Kullanıcı Yasağı Kaldırılamadı'] });
	}
}
