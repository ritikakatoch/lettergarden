// 'use client';

// import { useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import EnvelopeCard from '@/components/EnvelopeCard';
// import LetterDetailModal from '@/components/LetterDetailModal';
// import { Letter } from '@/types';

// const LETTERS_PER_PAGE = 12;

// export default function LettersGrid({
//     letters,
//     currentPage: serverPage,
//     totalPages: serverTotalPages,
//     total: serverTotal,
//     initialOpenLetter,
// }: {
//     letters: Letter[];
//     currentPage?: number;       // optional — only passed from homepage
//     totalPages?: number;        // optional — only passed from homepage
//     total?: number;             // optional — only passed from homepage
//     initialOpenLetter?: Letter | null;
// }) {
//     const router = useRouter();
//     const [search, setSearch] = useState('');
//     const [clientPage, setClientPage] = useState(1);
//     const [activeLetter, setActiveLetter] = useState<Letter | null>(
//         initialOpenLetter ?? null
//     );
//     const gridRef = useRef<HTMLDivElement>(null);

//     // If server pagination props are provided (homepage), use them.
//     // Otherwise (private garden), do client-side pagination over all letters.
//     const isServerPaginated = serverPage !== undefined;

//     const filtered = search.trim()
//         ? letters.filter(l =>
//             l.to.toLowerCase().includes(search.toLowerCase()) ||
//             (l.from ?? '').toLowerCase().includes(search.toLowerCase()) ||
//             l.content.toLowerCase().includes(search.toLowerCase())
//         )
//         : letters;

//     // Client-side pagination (used by private garden)
//     const clientTotalPages = Math.ceil(filtered.length / LETTERS_PER_PAGE);
//     const clientStartIdx = (clientPage - 1) * LETTERS_PER_PAGE;
//     const clientPageLetters = filtered.slice(clientStartIdx, clientStartIdx + LETTERS_PER_PAGE);

//     // Which letters + pagination values to actually render
//     const pageLetters = isServerPaginated ? filtered : clientPageLetters;
//     const currentPage = isServerPaginated ? serverPage! : clientPage;
//     const totalPages = isServerPaginated ? serverTotalPages! : clientTotalPages;
//     const total = isServerPaginated ? serverTotal! : filtered.length;
//     const startIdx = (currentPage - 1) * LETTERS_PER_PAGE;

//     function goToPage(page: number) {
//         gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         if (isServerPaginated) {
//             setTimeout(() => router.push(`/?page=${page}`), 100);
//         } else {
//             setClientPage(page);
//         }
//     }

//     function handleSearch(val: string) {
//         setSearch(val);
//         setClientPage(1); // reset client page on search
//     }

//     function openLetter(letter: Letter) {
//         setActiveLetter(letter);
//         if (!isServerPaginated) {
//             // Private garden — no URL change needed
//             return;
//         }
//         window.history.pushState({}, '', `/?note=${letter.shareCode}`);
//     }

//     function closeLetter() {
//         setActiveLetter(null);
//         if (!isServerPaginated) return;
//         window.history.pushState({}, '', currentPage > 1 ? `/?page=${currentPage}` : '/');
//     }

//     return (
//         <>
//             <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-24 pb-8 relative z-10">
//                 <div ref={gridRef} className="scroll-mt-24" />

//                 {pageLetters.length === 0 && search ? (
//                     <div className="flex flex-col items-center justify-center pt-32 gap-3">
//                         <span className="text-4xl">🔍</span>
//                         <p className="text-[#c0b8ac] font-poppins text-[14px]">
//                             No letters match &quot;{search}&quot;
//                         </p>
//                     </div>
//                 ) : pageLetters.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center pt-32 gap-3">
//                         <span className="text-4xl">🌱</span>
//                         <p className="text-[#c0b8ac] font-poppins text-[14px]">
//                             No letters yet — be the first to write one
//                         </p>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
//                             {pageLetters.map((letter, i) => (
//                                 <div
//                                     key={letter.id}
//                                     onClick={() => openLetter(letter)}
//                                     className="cursor-pointer"
//                                 >
//                                     <EnvelopeCard letter={letter} index={i} />
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Pagination — shown for both server and client modes */}
//                         {totalPages > 1 && !search && (
//                             <div className="flex items-center justify-center gap-2 mt-12 mb-4">
//                                 <button
//                                     onClick={() => goToPage(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                     className="px-4 py-2 rounded-[8px] text-[13px] font-poppins font-semibold border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     ← Prev
//                                 </button>

//                                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                                     .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
//                                     .reduce<(number | '...')[]>((acc, p, idx, arr) => {
//                                         if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
//                                         acc.push(p);
//                                         return acc;
//                                     }, [])
//                                     .map((p, idx) =>
//                                         p === '...' ? (
//                                             <span key={`dots-${idx}`} className="px-2 text-[#c0b8ac] font-poppins text-[13px]">…</span>
//                                         ) : (
//                                             <button
//                                                 key={p}
//                                                 onClick={() => goToPage(p as number)}
//                                                 className={`w-9 h-9 rounded-[8px] text-[13px] font-poppins font-semibold transition-colors ${currentPage === p
//                                                     ? 'bg-black text-white'
//                                                     : 'border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833]'
//                                                     }`}
//                                             >
//                                                 {p}
//                                             </button>
//                                         )
//                                     )}

//                                 <button
//                                     onClick={() => goToPage(currentPage + 1)}
//                                     disabled={currentPage === totalPages}
//                                     className="px-4 py-2 rounded-[8px] text-[13px] font-poppins font-semibold border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     Next →
//                                 </button>
//                             </div>
//                         )}

//                         {totalPages > 1 && !search && (
//                             <p className="text-center text-[13px] text-[#b0a090] font-poppins mb-24 mt-1">
//                                 {startIdx + 1}–{Math.min(startIdx + LETTERS_PER_PAGE, total)} of {total} letters
//                             </p>
//                         )}
//                     </>
//                 )}

//                 {/* Search bar */}
//                 <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
//                     <div className="relative w-full">
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={e => handleSearch(e.target.value)}
//                             placeholder="Search letters"
//                             className="w-full h-[52px] px-[18px] pr-[44px] bg-white/70 backdrop-blur-lg border border-gray-200 rounded-[14px] font-poppins text-[15px] text-gray-700 placeholder:text-[#b0a090]/60 focus:outline-none focus:border-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
//                         />
//                         {search && (
//                             <button
//                                 onClick={() => handleSearch('')}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
//                             >
//                                 ✕
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </main>

//             {activeLetter && (
//                 <LetterDetailModal letter={activeLetter} onClose={closeLetter} />
//             )}
//         </>
//     );
// }

'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnvelopeCard from '@/components/EnvelopeCard';
import LetterDetailModal from '@/components/LetterDetailModal';
import { Letter } from '@/types';

const DESKTOP_PER_PAGE = 12;
const MOBILE_PER_PAGE = 5;
const MOBILE_BREAKPOINT = 640; // matches Tailwind's `sm:`

function useLettersPerPage() {
    const [perPage, setPerPage] = useState(DESKTOP_PER_PAGE);

    useEffect(() => {
        function update() {
            setPerPage(window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_PER_PAGE : DESKTOP_PER_PAGE);
        }
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return perPage;
}

export default function LettersGrid({
    letters,
    currentPage: serverPage,
    total: serverTotal,
    initialOpenLetter,
}: {
    letters: Letter[];
    currentPage?: number;
    totalPages?: number;
    total?: number;
    initialOpenLetter?: Letter | null;
}) {
    const router = useRouter();
    const lettersPerPage = useLettersPerPage();
    const [search, setSearch] = useState('');
    const [clientPage, setClientPage] = useState(1);
    const [activeLetter, setActiveLetter] = useState<Letter | null>(
        initialOpenLetter ?? null
    );
    const gridRef = useRef<HTMLDivElement>(null);

    const isServerPaginated = serverPage !== undefined;

    const filtered = search.trim()
        ? letters.filter(l =>
            l.to.toLowerCase().includes(search.toLowerCase()) ||
            (l.from ?? '').toLowerCase().includes(search.toLowerCase()) ||
            l.content.toLowerCase().includes(search.toLowerCase())
        )
        : letters;

    // Client-side pagination
    const clientTotalPages = Math.ceil(filtered.length / lettersPerPage);
    const clientStartIdx = (clientPage - 1) * lettersPerPage;
    const clientPageLetters = filtered.slice(clientStartIdx, clientStartIdx + lettersPerPage);

    const pageLetters = isServerPaginated ? filtered : clientPageLetters;
    const currentPage = isServerPaginated ? serverPage! : clientPage;
    // For server mode, recalculate totalPages based on current lettersPerPage
    const totalPages = isServerPaginated
        ? Math.ceil(serverTotal! / lettersPerPage)
        : clientTotalPages;
    const total = isServerPaginated ? serverTotal! : filtered.length;
    const startIdx = (currentPage - 1) * lettersPerPage;

    function goToPage(page: number) {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (isServerPaginated) {
            setTimeout(() => router.push(`/?page=${page}&perPage=${lettersPerPage}`), 100);
        } else {
            setClientPage(page);
        }
    }

    function handleSearch(val: string) {
        setSearch(val);
        setClientPage(1);
    }

    function openLetter(letter: Letter) {
        setActiveLetter(letter);
        if (!isServerPaginated) return;
        window.history.pushState({}, '', `/?note=${letter.shareCode}`);
    }

    function closeLetter() {
        setActiveLetter(null);
        if (!isServerPaginated) return;
        window.history.pushState({}, '', currentPage > 1 ? `/?page=${currentPage}` : '/');
    }

    return (
        <>
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-24 pb-8 relative z-10">
                <div ref={gridRef} className="scroll-mt-24" />

                {pageLetters.length === 0 && search ? (
                    <div className="flex flex-col items-center justify-center pt-32 gap-3">
                        <span className="text-4xl">🔍</span>
                        <p className="text-[#c0b8ac] font-poppins text-[14px]">
                            No letters match &quot;{search}&quot;
                        </p>
                    </div>
                ) : pageLetters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-32 gap-3">
                        <span className="text-4xl">🌱</span>
                        <p className="text-[#c0b8ac] font-poppins text-[14px]">
                            No letters yet — be the first to write one
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
                            {pageLetters.map((letter, i) => (
                                <div
                                    key={letter.id}
                                    onClick={() => openLetter(letter)}
                                    className="cursor-pointer"
                                >
                                    <EnvelopeCard letter={letter} index={i} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && !search && (
                            <div className="flex items-center justify-center gap-2 mt-12 mb-4">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-[8px] text-[13px] font-poppins font-semibold border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, idx) =>
                                        p === '...' ? (
                                            <span key={`dots-${idx}`} className="px-2 text-[#c0b8ac] font-poppins text-[13px]">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => goToPage(p as number)}
                                                className={`w-9 h-9 rounded-[8px] text-[13px] font-poppins font-semibold transition-colors ${currentPage === p
                                                    ? 'bg-black text-white'
                                                    : 'border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833]'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-[8px] text-[13px] font-poppins font-semibold border border-[#e8e0d4] text-[#8a7d6b] hover:border-[#3b3833] hover:text-[#3b3833] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}

                        {totalPages > 1 && !search && (
                            <p className="text-center text-[13px] text-[#b0a090] font-poppins mb-24 mt-1">
                                {startIdx + 1}–{Math.min(startIdx + lettersPerPage, total)} of {total} letters
                            </p>
                        )}
                    </>
                )}

                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Search letters"
                            className="w-full h-[52px] px-[18px] pr-[44px] bg-white/70 backdrop-blur-lg border border-gray-200 rounded-[14px] font-poppins text-[15px] text-gray-700 placeholder:text-[#b0a090]/60 focus:outline-none focus:border-gray-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                        />
                        {search && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {activeLetter && (
                <LetterDetailModal letter={activeLetter} onClose={closeLetter} />
            )}
        </>
    );
}