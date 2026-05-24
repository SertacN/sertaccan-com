import { headers } from "next/headers";

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
    const map = new Map<string, { count: number; resetAt: number }>();

    function cleanup() {
        const now = Date.now();
        for (const [key, entry] of map) {
            if (now > entry.resetAt) map.delete(key);
        }
    }

    function isLimited(key: string): boolean {
        cleanup();
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

export async function getIP(): Promise<string> {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
