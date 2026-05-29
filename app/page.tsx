// import { supabaseAdmin } from '@/lib/supabase';
// import { Letter } from '@/types';
// import NavBar from '@/components/NavBar';
// import LettersGrid from '@/components/LettersGrid';

// // force-dynamic = every request hits DB fresh
// // This is what makes a newly published letter appear instantly
// export const dynamic = 'force-dynamic';

// const LETTERS_PER_PAGE = 12;

// async function getLetters(page: number): Promise<{ letters: Letter[]; total: number }> {
//   const from = (page - 1) * LETTERS_PER_PAGE;
//   const to = from + LETTERS_PER_PAGE - 1;

//   const { data, error, count } = await supabaseAdmin
//     .from('public_letters')
//     // ✅ Only fetch what the grid cards actually display
//     // content is NOT included here — saves huge payload on list view
//     .select('id, share_code, recipient, author, content,flowers, handwriting, created_at', {
//       count: 'exact', // gets total row count for pagination without a second query
//     })
//     .order('created_at', { ascending: false })
//     .range(from, to); // fetch only 12 rows, not thousands

//   if (error) {
//     console.error('[page.tsx getLetters]', error.message);
//     return { letters: [], total: 0 };
//   }

//   return {
//     letters: (data ?? []).map(row => ({
//       id: row.id,
//       shareCode: row.share_code,
//       to: row.recipient,
//       from: row.author ?? undefined,
//       content: row.content,
//       flowers: row.flowers ?? [],
//       handwriting: row.handwriting,
//       createdAt: row.created_at,
//     })),
//     total: count ?? 0,
//   };
// }

// async function getLetterByShareCode(code: string): Promise<Letter | null> {
//   const { data } = await supabaseAdmin
//     .from('public_letters')
//     .select('*')              // ✅ full fetch only for single letter detail view
//     .eq('share_code', code)
//     .single();

//   if (!data) return null;

//   return {
//     id: data.id,
//     shareCode: data.share_code,
//     to: data.recipient,
//     from: data.author ?? undefined,
//     content: data.content,
//     flowers: data.flowers ?? [],
//     handwriting: data.handwriting,
//     createdAt: data.created_at,
//   };
// }

// export default async function Home({
//   searchParams,
// }: {
//   searchParams: Promise<{ page?: string; note?: string }>;
// }) {
//   const { page: pageParam, note } = await searchParams;
//   const page = Math.max(1, parseInt(pageParam ?? '1'));

//   const [{ letters, total }, deepLinkedLetter] = await Promise.all([
//     getLetters(page),
//     note ? getLetterByShareCode(note) : Promise.resolve(null),
//   ]);

//   const totalPages = Math.ceil(total / LETTERS_PER_PAGE);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <NavBar />
//       <LettersGrid
//         letters={letters}
//         currentPage={page}
//         totalPages={totalPages}
//         total={total}
//         initialOpenLetter={deepLinkedLetter}
//       />
//     </div>
//   );
// }

import { supabaseAdmin } from '@/lib/supabase';
import { Letter } from '@/types';
import NavBar from '@/components/NavBar';
import LettersGrid from '@/components/LettersGrid';

export const dynamic = 'force-dynamic';

const DEFAULT_PER_PAGE = 12;
const MIN_PER_PAGE = 1;
const MAX_PER_PAGE = 50; // guard against abuse

async function getLetters(page: number, perPage: number): Promise<{ letters: Letter[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabaseAdmin
    .from('public_letters')
    .select('id, share_code, recipient, author, content, flowers, handwriting, created_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[page.tsx getLetters]', error.message);
    return { letters: [], total: 0 };
  }

  return {
    letters: (data ?? []).map(row => ({
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
  };
}

async function getLetterByShareCode(code: string): Promise<Letter | null> {
  const { data } = await supabaseAdmin
    .from('public_letters')
    .select('*')
    .eq('share_code', code)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    shareCode: data.share_code,
    to: data.recipient,
    from: data.author ?? undefined,
    content: data.content,
    flowers: data.flowers ?? [],
    handwriting: data.handwriting,
    createdAt: data.created_at,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; note?: string; perPage?: string }>;
}) {
  const { page: pageParam, note, perPage: perPageParam } = await searchParams;

  // Clamp perPage to safe bounds; default to 12
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(MIN_PER_PAGE, parseInt(perPageParam ?? String(DEFAULT_PER_PAGE)))
  );
  const page = Math.max(1, parseInt(pageParam ?? '1'));

  const [{ letters, total }, deepLinkedLetter] = await Promise.all([
    getLetters(page, perPage),
    note ? getLetterByShareCode(note) : Promise.resolve(null),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <LettersGrid
        letters={letters}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        initialOpenLetter={deepLinkedLetter}
      />
    </div>
  );
}