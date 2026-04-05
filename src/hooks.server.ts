import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const rateLimitConfig: Record<string, { limit: number; windowMs: number }> = {
	'/api': { limit: 60, windowMs: 60_000 },
	'/admin/login': { limit: 10, windowMs: 60_000 }
};

function isRateLimited(ip: string, path: string): boolean {
	const config = Object.entries(rateLimitConfig).find(([prefix]) => path.startsWith(prefix));
	if (!config) return false;

	const { limit, windowMs } = config[1];
	const key = `${ip}:${config[0]}`;
	const now = Date.now();
	const entry = rateLimitMap.get(key);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}

	entry.count++;
	return entry.count > limit;
}

// Stale entry'leri temizle (5 dakikada bir)
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitMap) {
		if (now > entry.resetAt) rateLimitMap.delete(key);
	}
}, 5 * 60_000);

const handleRateLimit: Handle = async ({ event, resolve }) => {
	const ip = event.getClientAddress();
	const path = event.url.pathname;

	if (isRateLimited(ip, path)) {
		return new Response('Too many requests', { status: 429 });
	}

	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.user = {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			banned: session.user.banned ?? null,
			role: (session.user.role as 'admin' | 'user') ?? 'user'
		};
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleRateLimit, handleAuth, handleParaglide);
