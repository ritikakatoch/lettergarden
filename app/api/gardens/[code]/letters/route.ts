import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET — fetch all letters in a garden
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();

  // First find the garden
  const { data: garden } = await supabaseAdmin
    .from('gardens')
    .select('id')
    .eq('code', code)
    .single();

  if (!garden) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  const { data: letters } = await supabaseAdmin
    .from('private_letters')
    .select('*')
    .eq('garden_id', garden.id)
    .order('created_at', { ascending: false });

  // return NextResponse.json(letters ?? []);
  return NextResponse.json(
    (letters ?? []).map(row => ({
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

// POST — write a letter to a garden
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const body = await req.json();

  const { author, recipient, content, flowers, handwriting } = body;

  // Basic validation
  if (!content || content.trim().length < 1) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (content.length > 5000) {
    return NextResponse.json({ error: 'Letter too long' }, { status: 400 });
  }

  // Find garden
  const { data: garden } = await supabaseAdmin
    .from('gardens')
    .select('id')
    .eq('code', code)
    .single();

  if (!garden) {
    return NextResponse.json({ error: 'Garden not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('private_letters')
    .insert({
      garden_id: garden.id,
      author: author?.trim() || null,
      recipient: recipient?.trim() || null,
      content: content.trim(),
      flowers: flowers || [],
      handwriting: handwriting || 'dancing',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to post letter' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
