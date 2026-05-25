import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    // Try public letters first
    const { data: pub } = await supabaseAdmin
        .from('public_letters')
        .select('*')
        .eq('share_code', code)
        .single();

    if (pub) {
        return NextResponse.json({
            ...rowToLetter(pub),
            isPrivate: false,
        });
    }

    // Then private letters
    const { data: priv } = await supabaseAdmin
        .from('private_letters')
        .select('*')
        .eq('share_code', code)
        .single();

    if (priv) {
        return NextResponse.json({
            ...rowToLetter(priv),
            isPrivate: true,
        });
    }

    return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
}

function rowToLetter(row: any) {
    return {
        id: row.id,
        shareCode: row.share_code,
        to: row.recipient ?? '',
        from: row.author ?? undefined,
        content: row.content,
        flowers: row.flowers ?? [],
        handwriting: row.handwriting ?? 'dancing',
        createdAt: row.created_at,
    };
}