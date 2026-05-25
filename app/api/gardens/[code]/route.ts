// import { NextResponse } from 'next/server';
// import { supabaseAdmin } from '@/lib/supabase';

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ code: string }> }
// ) {
//   const { code: rawCode } = await params;
//   const code = rawCode.toUpperCase().trim();

//   const { data, error } = await supabaseAdmin
//     .from('gardens')
//     .select('id, code, created_at')
//     .eq('code', code)
//     .single();

//   if (error || !data) {
//     return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
//   }

//   return NextResponse.json(data);
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

const BOT_UA_RE = /bot|crawl|spider|scrape|headless|curl|wget|python-requests|go-http|axios/i;
const CODE_RE = /^[A-Z0-9]{4,8}$/;

const MAX_AUTHOR = 100;
const MAX_RECIP = 100;
const MAX_CONTENT = 1_000;
const MAX_FLOWERS = 6;

function validateFlowers(val: unknown): val is string[] {
  return (
    Array.isArray(val) &&
    val.length <= MAX_FLOWERS &&
    val.every((f) => typeof f === 'string' && f.length <= 300)
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const ip = getIp(req);
  if (isRateLimited(`garden-letters-get:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();

  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  const { data: garden } = await supabaseAdmin
    .from('gardens').select('id').eq('code', code).single();

  if (!garden) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  const { data: letters, error } = await supabaseAdmin
    .from('private_letters')
    .select('*')
    .eq('garden_id', garden.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });

  return NextResponse.json(
    (letters ?? []).map((row) => ({
      id: row.id,
      share_code: row.share_code,
      recipient: row.recipient,
      author: row.author,
      content: row.content,
      flowers: row.flowers ?? [],
      handwriting: row.handwriting,
      created_at: row.created_at,
    }))
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  // ── Bot UA check ─────────────────────────────────────────
  const ua = req.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA_RE.test(ua)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ── Rate limit ───────────────────────────────────────────
  const ip = getIp(req);
  if (isRateLimited(`garden-letters-post:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many letters posted. Please wait a minute.' },
      { status: 429 }
    );
  }

  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();

  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  // ── Parse body ───────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // ── Honeypot ─────────────────────────────────────────────
  if (body._hp) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ── Timing check ─────────────────────────────────────────
  const submittedAt = Number(body._t);
  if (!submittedAt || Date.now() - submittedAt < 2_000) {
    return NextResponse.json({ error: 'Submission too fast' }, { status: 400 });
  }

  const { author, recipient, content, flowers, handwriting } = body;

  // ── Validation ───────────────────────────────────────────
  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (content.length > MAX_CONTENT) {
    return NextResponse.json({ error: `Content max ${MAX_CONTENT} chars` }, { status: 400 });
  }
  if (isContentBlocked(content)) {
    return NextResponse.json({ error: 'Content not allowed' }, { status: 400 });
  }
  if (recipient !== undefined && recipient !== null) {
    if (typeof recipient !== 'string' || recipient.length > MAX_RECIP) {
      return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 });
    }
  }
  if (author !== undefined && author !== null) {
    if (typeof author !== 'string' || author.length > MAX_AUTHOR) {
      return NextResponse.json({ error: 'Invalid author' }, { status: 400 });
    }
  }
  if (flowers !== undefined && !validateFlowers(flowers)) {
    return NextResponse.json({ error: 'Invalid flowers data' }, { status: 400 });
  }
  if (handwriting !== undefined && !VALID_HANDWRITING.has(handwriting as string)) {
    return NextResponse.json({ error: 'Invalid handwriting style' }, { status: 400 });
  }

  const { data: garden } = await supabaseAdmin
    .from('gardens').select('id').eq('code', code).single();

  if (!garden) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  // ── Sanitize before storage ──────────────────────────────
  const cleanContent = sanitizeText(content);
  const cleanRecipient = typeof recipient === 'string' ? sanitizeText(recipient) : null;
  const cleanAuthor = typeof author === 'string' ? sanitizeText(author) : null;

  const { data, error: dbError } = await supabaseAdmin
    .from('private_letters')
    .insert({
      garden_id: garden.id,
      author: cleanAuthor || null,
      recipient: cleanRecipient || null,
      content: cleanContent,
      flowers: validateFlowers(flowers) ? flowers : [],
      handwriting: VALID_HANDWRITING.has(handwriting as string) ? handwriting : 'dancing',
    })
    .select()
    .single();

  if (dbError) {
    console.error('[POST /api/gardens/letters]', dbError.message);
    return NextResponse.json({ error: 'Failed to post letter' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}