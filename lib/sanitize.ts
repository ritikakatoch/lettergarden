const TAGS = /<[^>]*>/g;
const JS_PROTO = /javascript\s*:/gi;
const EVENT_ATTR = /\bon\w+\s*=/gi;
const NULL_BYTE = /\0/g;

/**
 * Strips HTML tags, javascript: protocols, event handlers,
 * and null bytes from any user-supplied string.
 * React already escapes output but we sanitize before storage as defence-in-depth.
 */
export function sanitizeText(raw: string): string {
    return raw
        .replace(NULL_BYTE, '')
        .replace(TAGS, '')
        .replace(JS_PROTO, '')
        .replace(EVENT_ATTR, '')
        .trim();
}