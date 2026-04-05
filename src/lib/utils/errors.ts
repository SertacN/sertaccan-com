import type { ZodError } from 'zod';

export function flattenErrors(error: ZodError): Record<string, string[]> {
	const result: Record<string, string[]> = {};
	for (const issue of error.issues) {
		const key = issue.path[0]?.toString() ?? '_root';
		if (!result[key]) result[key] = [];
		result[key].push(issue.message);
	}
	return result;
}
