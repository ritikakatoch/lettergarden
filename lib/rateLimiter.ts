const _store = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true when the key has exceeded `limit` hits within `windowMs`.
 * In-memory — resets on cold start, sufficient to block burst abuse on Vercel.
 */
export function isRateLimited(
    key: string,
    limit: number,
    windowMs: number
): boolean {
    const now = Date.now();
    const entry = _store.get(key);
    if (!entry || now > entry.resetAt) {
        _store.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }
    if (entry.count >= limit) return true;
    entry.count++;
    return false;
}

export function getIp(req: Request): string {
    const fwd = (req.headers as Headers).get('x-forwarded-for');
    return fwd?.split(',')[0]?.trim() ?? 'unknown';
}