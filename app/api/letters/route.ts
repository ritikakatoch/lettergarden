// import { NextRequest, NextResponse } from 'next/server';
// import { supabaseAdmin } from '@/lib/supabase';
// import { isContentBlocked } from '@/lib/contentFilter';

// const VALID_HANDWRITING = [
//     'dancing', 'caveat', 'pacifico', 'homemade',
//     'indie', 'shadows', 'poppins', 'greatvibes', 'reenieBeanie', 'cedarville'
// ];

// // Simple in-memory rate limiter per IP
// // Works fine on Vercel — resets per cold start, enough to block bursts
// const postCounts = new Map<string, { count: number; resetAt: number }>();

// function isRateLimited(ip: string): boolean {
//     const now = Date.now();
//     const window = 60_000; // 1 minute
//     const limit = 5;       // max 5 posts per minute per IP

//     const entry = postCounts.get(ip);
//     if (!entry || now > entry.resetAt) {
//         postCounts.set(ip, { count: 1, resetAt: now + window });
//         return false;
//     }
//     if (entry.count >= limit) return true;
//     entry.count++;
//     return false;
// }

// // GET — used if you ever need client-side refresh
// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
//     const limit = 12;
//     const from = (page - 1) * limit;
//     const to = from + limit - 1;

//     const { data, error, count } = await supabaseAdmin
//         .from('public_letters')
//         .select('id, share_code, recipient, author,content, flowers, handwriting, created_at', {
//             count: 'exact',
//         })
//         .order('created_at', { ascending: false })
//         .range(from, to);

//     if (error) {
//         return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
//     }

//     return NextResponse.json(
//         {
//             letters: (data ?? []).map(row => ({
//                 id: row.id,
//                 shareCode: row.share_code,
//                 to: row.recipient,
//                 from: row.author ?? undefined,
//                 content: row.content,
//                 flowers: row.flowers ?? [],
//                 handwriting: row.handwriting,
//                 createdAt: row.created_at,
//             })),
//             total: count ?? 0,
//         },
//         {
//             headers: {
//                 // CDN/browser can serve cached list for 10s, revalidate in background
//                 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
//             },
//         }
//     );
// }

// // POST — submit a new letter
// export async function POST(req: NextRequest) {
//     // Rate limiting
//     const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
//     if (isRateLimited(ip)) {
//         return NextResponse.json(
//             { error: 'Too many letters posted. Please wait a minute.' },
//             { status: 429 }
//         );
//     }

//     const body = await req.json();
//     const { to, from, content, flowers, handwriting } = body;

//     if (!to?.trim()) {
//         return NextResponse.json({ error: '"To" is required' }, { status: 400 });
//     }
//     if (!content?.trim()) {
//         return NextResponse.json({ error: 'Content is required' }, { status: 400 });
//     }
//     if (isContentBlocked(content)) {
//         return NextResponse.json(
//             { error: 'Content not allowed' },
//             { status: 400 }
//         );
//     }
//     if (content.length > 5000) {
//         return NextResponse.json({ error: 'Letter too long' }, { status: 400 });
//     }
//     if (handwriting && !VALID_HANDWRITING.includes(handwriting)) {
//         return NextResponse.json({ error: 'Invalid handwriting style' }, { status: 400 });
//     }

//     const { data, error } = await supabaseAdmin
//         .from('public_letters')
//         .insert({
//             recipient: to.trim(),
//             author: from?.trim() || null,
//             content: content.trim(),
//             flowers: flowers ?? [],
//             handwriting: handwriting ?? 'dancing',
//         })
//         .select('id, share_code, recipient, author,content, flowers, handwriting, created_at')
//         .single();

//     if (error) {
//         console.error('[POST /api/letters]', error.message);
//         return NextResponse.json({ error: 'Failed to post letter' }, { status: 500 });
//     }

//     return NextResponse.json({
//         id: data.id,
//         shareCode: data.share_code,
//         to: data.recipient,
//         from: data.author ?? undefined,
//         content: data.content,
//         flowers: data.flowers ?? [],
//         handwriting: data.handwriting,
//         createdAt: data.created_at,
//     }, { status: 201 });
// }

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isContentBlocked } from '@/lib/contentFilter';
import { isRateLimited, getIp } from '@/lib/rateLimiter';
import { sanitizeText } from '@/lib/sanitize';

const VALID_HANDWRITING = new Set([
    'dancing', 'caveat', 'pacifico', 'homemade',
    'indie', 'shadows', 'poppins', 'greatvibes', 'reenieBeanie', 'cedarville',
]);

// Matches common automation tools, headless browsers, and scrapers
const BOT_UA_RE = /bot|crawl|spider|scrape|headless|curl|wget|python-requests|go-http|axios/i;

const MAX_TO = 100;
const MAX_FROM = 100;
const MAX_CONTENT = 1_000;
const MAX_FLOWERS = 6;

function validateFlowers(val: unknown): val is string[] {
    return (
        Array.isArray(val) &&
        val.length <= MAX_FLOWERS &&
        val.every((f) => typeof f === 'string' && f.length <= 300)
    );
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
        .from('public_letters')
        .select('id,share_code,recipient,author,content,flowers,handwriting,created_at', {
            count: 'exact',
        })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });

    return NextResponse.json(
        {
            letters: (data ?? []).map((row) => ({
                id: row.id,
                shareCode: row.share_code,
                to: row.recipient,
                from: row.author ?? undefined,
                content: row.content,
                flowers: row.flowers ?? [],
                handwriting: row.handwriting,
                createdAt: row.created_at,
            })),
            total: count ?? 0,
        },
        { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' } }
    );
}

export async function POST(req: NextRequest) {
    // ── Bot UA check ─────────────────────────────────────────
    const ua = req.headers.get('user-agent') ?? '';
    if (!ua || BOT_UA_RE.test(ua)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Rate limit ───────────────────────────────────────────
    const ip = getIp(req);
    if (isRateLimited(`letters:${ip}`, 5, 60_000)) {
        return NextResponse.json(
            { error: 'Too many letters posted. Please wait a minute.' },
            { status: 429 }
        );
    }

    // ── Parse body ───────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // ── Honeypot: bots fill this hidden field, humans don't ──
    if (body._hp) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Timing: reject if submitted in under 2 seconds ───────
    const submittedAt = Number(body._t);
    if (!submittedAt || Date.now() - submittedAt < 2_000) {
        return NextResponse.json({ error: 'Submission too fast' }, { status: 400 });
    }

    const { to, from, content, flowers, handwriting } = body;

    // ── Validation ───────────────────────────────────────────
    if (typeof to !== 'string' || !to.trim()) {
        return NextResponse.json({ error: '"to" is required' }, { status: 400 });
    }
    if (to.trim().length > MAX_TO) {
        return NextResponse.json({ error: `"to" max ${MAX_TO} chars` }, { status: 400 });
    }
    if (from !== undefined && from !== null) {
        if (typeof from !== 'string') {
            return NextResponse.json({ error: 'Invalid "from"' }, { status: 400 });
        }
        if (from.length > MAX_FROM) {
            return NextResponse.json({ error: `"from" max ${MAX_FROM} chars` }, { status: 400 });
        }
    }
    if (typeof content !== 'string' || !content.trim()) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (content.length > MAX_CONTENT) {
        return NextResponse.json({ error: `Content max ${MAX_CONTENT} chars` }, { status: 400 });
    }
    if (isContentBlocked(content)) {
        return NextResponse.json({ error: 'Content not allowed' }, { status: 400 });
    }
    if (flowers !== undefined && !validateFlowers(flowers)) {
        return NextResponse.json({ error: 'Invalid flowers data' }, { status: 400 });
    }
    if (handwriting !== undefined && !VALID_HANDWRITING.has(handwriting as string)) {
        return NextResponse.json({ error: 'Invalid handwriting style' }, { status: 400 });
    }

    // ── Sanitize before storage ──────────────────────────────
    const cleanTo = sanitizeText(to);
    const cleanFrom = typeof from === 'string' ? sanitizeText(from) : null;
    const cleanContent = sanitizeText(content);

    const { data, error: dbError } = await supabaseAdmin
        .from('public_letters')
        .insert({
            recipient: cleanTo,
            author: cleanFrom || null,
            content: cleanContent,
            flowers: validateFlowers(flowers) ? flowers : [],
            handwriting: VALID_HANDWRITING.has(handwriting as string) ? handwriting : 'dancing',
        })
        .select('id,share_code,recipient,author,content,flowers,handwriting,created_at')
        .single();

    if (dbError) {
        console.error('[POST /api/letters]', dbError.message);
        return NextResponse.json({ error: 'Failed to post letter' }, { status: 500 });
    }

    return NextResponse.json(
        {
            id: data.id,
            shareCode: data.share_code,
            to: data.recipient,
            from: data.author ?? undefined,
            content: data.content,
            flowers: data.flowers ?? [],
            handwriting: data.handwriting,
            createdAt: data.created_at,
        },
        { status: 201 }
    );
}