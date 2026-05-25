'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, ArrowRight, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Image from 'next/image';

type Tab = 'visit' | 'create';

export default function PrivatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('visit');

  // Visit tab state
  const [visitCode, setVisitCode] = useState('');
  const [visitError, setVisitError] = useState('');
  const [visitLoading, setVisitLoading] = useState(false);

  // Create tab state
  const [newCode, setNewCode] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Auto-generate on create tab ─────────────────────────
  useEffect(() => {
    if (tab === 'create' && !newCode && !createLoading) {
      handleGenerate();
    }
  }, [tab]);

  // ── Visit a garden ──────────────────────────────────────
  async function handleVisit() {
    if (!visitCode.trim()) return;
    setVisitLoading(true);
    setVisitError('');

    const res = await fetch(`/api/gardens/${visitCode.toUpperCase()}`);
    if (res.ok) {
      router.push(`/private/garden/${visitCode.toUpperCase()}`);
    } else {
      setVisitError('Garden does not exist! Create a new garden');
    }
    setVisitLoading(false);
  }

  // ── Create a new garden ──────────────────────────────────
  async function handleGenerate() {
    setCreateLoading(true);
    const res = await fetch('/api/gardens/create', { method: 'POST' });
    const data = await res.json();
    setNewCode(data.code);
    setCreateLoading(false);
  }

  async function handleCreate() {
    if (!newCode) return;
    router.push(`/private/garden/${newCode}`);
  }

  function copyCode() {
    navigator.clipboard.writeText(newCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center pt-32 px-4">
      <NavBar />

      {/* Tab toggle */}
      <div className="flex bg-[#f5f5f5] rounded-[10px] p-1 gap-1 mb-12 shadow-sm border border-[#e8e0d4]/50">
        {(['visit', 'create'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-8 py-2 rounded-[8px] text-[14px] font-poppins transition-all duration-200 ${tab === t
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-[#8a7d6b] hover:text-[#3b3833] font-medium'
              }`}
          >
            {t === 'visit' ? 'Visit garden' : 'Create new garden'}
          </button>
        ))}
      </div>

      {/* ── VISIT TAB ── */}
      {tab === 'visit' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-4">
          <img src="/stickers/053da0042a87d1643e1b1f3ba7d7337ec10eebed.png" alt="Flower" className="h-20 mb-2 drop-shadow-sm" />
          <p className="font-poppins text-[16px] font-medium  text-black mb-2">
            Visit a private garden
          </p>

          <input
            value={visitCode}
            onChange={(e) => setVisitCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleVisit()}
            placeholder="Enter garden code"
            maxLength={8}
            className="w-full px-4 py-3 rounded-[8px] border border-[#e8e0d4] bg-white text-center text-[15px] font-poppins font-semibold text-black placeholder:font-normal placeholder:text-[#c0b8ac] outline-none focus:border-[#3b3833] transition-colors shadow-sm"
          />

          {visitError && (
            <p className="text-red-500 text-[13px] font-poppins">{visitError}</p>
          )}

          <button
            onClick={handleVisit}
            disabled={!visitCode.trim() || visitLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] font-poppins font-semibold text-[14px] transition-all duration-300 shadow-sm disabled:cursor-not-allowed disabled:bg-[#e0d9d0] disabled:text-[#a09888] enabled:bg-black enabled:text-white enabled:hover:bg-[#1a1a1a] enabled:hover:-translate-y-0.5"
          >
            {visitLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>Enter private garden <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      )}

      {/* ── CREATE TAB ── */}
      {tab === 'create' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-4">
          <img src="/stickers/82e4a498284b6f5fabd4534c902441362e1cdc50.png" alt="Flower" className="h-20 mb-2 drop-shadow-sm" />
          <p className="font-poppins text-[16px] font-medium  text-black mb-2">
            Create a new private garden
          </p>

          {(!newCode || createLoading) ? (
            <div className="w-full flex items-center justify-center py-3">
              <Loader2 size={24} className="animate-spin text-[#8a7d6b]" />
            </div>
          ) : (
            <>
              {/* Generated code display */}
              <div className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[8px] border border-[#e8e0d4] bg-white shadow-sm">
                <span className="font-poppins text-[15px] font-semibold text-black">
                  {newCode}
                </span>
                <button onClick={copyCode} className="text-[#3b3833] hover:text-black transition-colors">
                  <Copy size={16} />
                </button>
                {copied && (
                  <span className="text-[12px] text-green-600 font-poppins absolute ml-32">Copied!</span>
                )}
              </div>

              <button
                onClick={handleCreate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] bg-black text-white font-poppins font-semibold text-[14px] hover:bg-[#1a1a1a] transition-all duration-300 shadow-md"
              >
                Create private garden <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
