// lib/contentFilter.ts
const BLOCKED_PATTERNS = [
    /\b(spam|buy now|click here|free money)\b/i,
    // add patterns as you discover abuse
    /(https?:\/\/[^\s]+){3,}/i, // more than 2 URLs in one letter
];

export function isContentBlocked(text: string): boolean {
    return BLOCKED_PATTERNS.some(pattern => pattern.test(text));
}