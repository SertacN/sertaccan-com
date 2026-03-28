export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data: T | null;
}

export function apiSuccess<T>(data: T, message = 'OK'): ApiResponse<T> {
	return { success: true, message, data };
}

export function apiError(message: string): ApiResponse<null> {
	return { success: false, message, data: null };
}
