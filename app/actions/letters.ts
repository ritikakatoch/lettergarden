// 'use server';

// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';
// import { supabaseAdmin } from '@/lib/supabase';
// import { HandwritingStyle } from '@/types';

// const VALID_HANDWRITING = [
//   'dancing', 'caveat', 'pacifico', 'homemade',
//   'indie', 'shadows', 'poppins', 'greatvibes', 'reenieBeanie', 'cedarville'
// ];

// interface SubmitLetterPayload {
//   to: string;
//   from?: string;
//   content: string;
//   flowers: string[];
//   handwriting: HandwritingStyle;
// }

// export async function submitLetterAction(payload: SubmitLetterPayload) {
//   const { to, from, content, flowers, handwriting } = payload;

//   // ── Validation ───────────────────────────────────────────
//   if (!to?.trim()) {
//     throw new Error('"To" is required');
//   }
//   if (!content?.trim()) {
//     throw new Error('Content is required');
//   }
//   if (content.length > 5000) {
//     throw new Error('Letter too long (max 5000 chars)');
//   }
//   if (!VALID_HANDWRITING.includes(handwriting)) {
//     throw new Error('Invalid handwriting style');
//   }

//   // ── Write directly to Supabase ───────────────────────────
//   const { error } = await supabaseAdmin
//     .from('public_letters')
//     .insert({
//       recipient: to.trim(),
//       author: from?.trim() || null,
//       content: content.trim(),
//       flowers: flowers ?? [],
//       handwriting: handwriting ?? 'dancing',
//     });

//   if (error) {
//     console.error('[submitLetterAction]', error.message);
//     throw new Error('Failed to save letter. Please try again.');
//   }

//   // ── Refresh homepage cache then redirect ─────────────────
//   revalidatePath('/');
//   redirect('/');
// }

'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const VALID_HANDWRITING = [
  'dancing', 'caveat', 'pacifico', 'homemade',
  'indie', 'shadows', 'poppins', 'greatvibes', 'reenieBeanie', 'cedarville'
];

const VALID_FLOWERS = [
  '/stickers/053da0042a87d1643e1b1f3ba7d7337ec10eebed.png',
  '/stickers/233e2136f1cb0d91b0ace9deafea0ed0417cf7e0.png',
  '/stickers/416fe7be743f576502d0854395e5c8df8cc75a0d.png',
  '/stickers/63413a51be7f8ecc80ada383aa6b74b7f0d7fb31.png',
  '/stickers/6d8f86ecc6e1fe9b76647207546481c4fb38e0fc.png',
  '/stickers/82e4a498284b6f5fabd4534c902441362e1cdc50.png',
  '/stickers/f8a19048602434e4a81f8b3f2efd284349130d3c.png',
  '/stickers/f1.png',
  '/stickers/f2.png',
  '/stickers/f3.png',
];

function sanitise(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function submitLetterAction(data: {
  to: string;
  from?: string;
  content: string;
  flowers: string[];
  handwriting: string;
  _t?: number;
  _hp?: string;
}) {

  // Honeypot check
  if (data._hp) {
    throw new Error('Spam detected');
  }

  // Timing check (submitted too fast)
  if (!data._t || Date.now() - data._t < 3000) {
    throw new Error('Submission too fast');
  }
  // Validate every field server-side
  const to = sanitise(data.to ?? '').slice(0, 25);
  const from = data.from ? sanitise(data.from).slice(0, 25) : null;
  const content = sanitise(data.content ?? '').slice(0, 5000);
  const handwriting = VALID_HANDWRITING.includes(data.handwriting)
    ? data.handwriting
    : 'dancing';
  const flowers = (data.flowers ?? [])
    .filter(f => VALID_FLOWERS.includes(f))
    .slice(0, 5);

  if (!to) throw new Error('Recipient is required');
  if (!content) throw new Error('Content is required');

  const { error } = await supabaseAdmin
    .from('public_letters')
    .insert({ recipient: to, author: from, content, flowers, handwriting });

  if (error) {
    console.error('[submitLetterAction]', error.message);
    throw new Error('Failed to post letter');
  }

  // redirect() must be OUTSIDE try-catch
  redirect('/');
}