export interface FormResult {
	action?: string;
	success?: boolean;
	errors?: Record<string, string[]>;
}
