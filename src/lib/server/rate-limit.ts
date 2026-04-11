interface RateLimiterOptions {
	limit: number;
	windowMs: number;
}

/**
 * Action-level rate limiter factory.
 *
 * SvelteKit form action'ları hook seviyesinde her zaman HTTP 200 döndürdüğünden
 * form rate limit'leri action içinde yönetilmelidir.
 *
 * Kullanım:
 *   const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
 *
 *   // action başında kontrol et:
 *   if (limiter.isLimited(ip)) return fail(429, { ... });
 *
 *   // sadece başarılı işlem sonrası say:
 *   limiter.increment(ip);
 */
export function createRateLimiter({ limit, windowMs }: RateLimiterOptions) {
	const map = new Map<string, { count: number; resetAt: number }>();

	setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of map) {
			if (now > entry.resetAt) map.delete(key);
		}
	}, 5 * 60_000);

	function isLimited(key: string): boolean {
		const now = Date.now();
		const entry = map.get(key);
		if (!entry || now > entry.resetAt) return false;
		return entry.count >= limit;
	}

	function increment(key: string): void {
		const now = Date.now();
		const entry = map.get(key);
		if (!entry || now > entry.resetAt) {
			map.set(key, { count: 1, resetAt: now + windowMs });
		} else {
			entry.count++;
		}
	}

	return { isLimited, increment };
}
