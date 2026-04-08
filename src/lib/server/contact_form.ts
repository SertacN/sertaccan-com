import { getContactFormSchema } from '$lib/schemas';
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

// ── Mutations ──

export async function createContactForm(raw: Record<string, unknown>): Promise<ApiResponse> {
	const formResult = getContactFormSchema().safeParse(raw);
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
