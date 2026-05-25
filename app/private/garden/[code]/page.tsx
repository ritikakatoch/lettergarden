'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Link2, Plus, Loader2 } from 'lucide-react';
import LettersGrid from '@/components/LettersGrid';
import { Letter } from '@/types';

export default function GardenPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();

  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/gardens/${code}`)
      .then(res => { if (!res.ok) window.location.replace('/private'); })
      .catch(() => window.location.replace('/private'));
  }, [code]);

  useEffect(() => {
    if (code) fetchLetters();
  }, [code]);

  async function fetchLetters() {
    setLoading(true);
    const res = await fetch(`/api/gardens/${code}/letters`);
    if (res.ok) {
      const data = await res.json();
      setLetters(data.map((l: any) => ({
        id: l.id,
        shareCode: l.share_code,
        to: l.recipient || '',
        from: l.author || undefined,
        content: l.content,
        flowers: l.flowers || [],
        handwriting: l.handwriting || 'dancing',
        createdAt: l.created_at,
      })));
    }
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/private/garden/${code}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <nav className="fixed top-0 z-[100] w-full bg-[#FDFCFB]/90 backdrop-blur-md border-b border-[#e8e0d4]/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/private')} className="flex items-center gap-2 text-[14px] font-poppins font-semibold text-black hover:opacity-70 transition-opacity">
              <ArrowLeft size={16} strokeWidth={2.5} /> Exit private garden
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[13px] font-poppins text-[#8a7d6b] font-medium">
              <span className="tracking-widest">{code}</span>
              <button onClick={copyCode} className="hover:text-black transition-colors"><Copy size={14} /></button>
              {copied && <span className="text-[11px] text-green-600">Copied!</span>}
            </div>
            <button onClick={copyLink} className="hidden sm:flex items-center gap-1.5 text-[13px] font-poppins text-[#8a7d6b] font-medium hover:text-black transition-colors">
              Copy garden link <Link2 size={14} />
              {linkCopied && <span className="text-[11px] text-green-600 ml-1">Copied!</span>}
            </button>
          </div>
          <button onClick={() => router.push(`/private/garden/${code}/write`)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-[8px] bg-black text-white text-[13px] font-poppins font-semibold hover:bg-[#1a1a1a] transition-all duration-300 shadow-sm">
            <Plus size={16} strokeWidth={2.5} /> Write private letter
          </button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col w-full">
        {loading ? (
          <div className="flex justify-center pt-36"><Loader2 size={24} className="animate-spin text-[#8a7d6b]" /></div>
        ) : (
          <LettersGrid letters={letters} />
        )}
      </div>
    </div>
  );
}