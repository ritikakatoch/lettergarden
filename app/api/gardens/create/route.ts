// import { NextResponse } from 'next/server';
// import { supabaseAdmin } from '@/lib/supabase';
// import { generateGardenCode } from '@/lib/generateCode';

// export async function POST() {
//   // Try up to 5 times to get a unique code
//   for (let i = 0; i < 5; i++) {
//     const code = generateGardenCode();

//     const { data, error } = await supabaseAdmin
//       .from('gardens')
//       .insert({ code })
//       .select()
//       .single();

//     if (!error && data) {
//       return NextResponse.json({ code: data.code }, { status: 201 });
//     }
//   }

//   return NextResponse.json({ error: 'Could not create garden' }, { status: 500 });
// }
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateGardenCode } from '@/lib/generateCode';
import { isRateLimited, getIp } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  // ── Rate limit: 3 gardens / 10 min / IP ─────────────────
  // Stricter than letter posting — garden creation is heavier and more abusable
  const ip = getIp(req);
  if (isRateLimited(`garden-create:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json(
      { error: 'Too many gardens created. Please wait a few minutes.' },
      { status: 429 }
    );
  }

  for (let i = 0; i < 5; i++) {
    const code = generateGardenCode();

    const { data, error } = await supabaseAdmin
      .from('gardens')
      .insert({ code })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json({ code: data.code }, { status: 201 });
    }
  }

  return NextResponse.json({ error: 'Could not create garden' }, { status: 500 });
}