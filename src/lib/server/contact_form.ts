import { createContactFormSchema, editContactFormSchema } from '$lib/schemas';
import { prisma } from '$lib/server/prisma';
import { apiError, apiSuccess, type ApiResponse } from '$lib/types/api';
import { flattenErrors } from '$lib/utils';

// ── Queries ──

export async function getAllContactForm(options?: { page?: number; limit?: number }) {
	const page = options?.page ?? 1;
	const limit = options?.limit ?? 20;
	const skip = (page - 1) * limit;

	const [contactForm, total] = await prisma.$transaction([
		prisma.contactForm.findMany({
			skip,
			take: limit
		}),
		prisma.contactForm.count()
	]);

	return {
		contactForm,
		paginationContact: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}

export async function getUnreadContactFormCount(): Promise<number> {
	return prisma.contactForm.count({ where: { isRead: false } });
}

// ── Mutations ──

export async function editContactForm(
	contactId: string,
	raw: Record<string, unknown>
): Promise<ApiResponse> {
	const result = editContactFormSchema.safeParse(raw);
	if (!result.success) {
		return apiError('Validasyon hatası', flattenErrors(result.error));
	}
	try {
		const updated = await prisma.contactForm.update({
			where: { id: contactId },
			data: result.data
		});
		return apiSuccess(updated);
	} catch {
		return apiError('Güncelleme başarısız');
	}
}

export async function createContactForm(raw: Record<string, unknown>): Promise<ApiResponse> {
	const formResult = createContactFormSchema().safeParse(raw);
	if (!formResult.success) {
		return apiError('Validasyon hatası', flattenErrors(formResult.error));
	}
	const result = formResult.data;
	try {
		const contactForm = await prisma.contactForm.create({
			data: { ...result },
			select: {
				name: true,
				email: true,
				subject: true,
				message: true
			}
		});
		return apiSuccess(contactForm);
	} catch (err: unknown) {
		if (
			(err instanceof Error && err.message.includes('Unique constraint')) ||
			(err as { code?: string }).code === 'P2002'
		) {
			return apiError('İletişim formu oluşturulamadı');
		}
		throw err;
	}
}
