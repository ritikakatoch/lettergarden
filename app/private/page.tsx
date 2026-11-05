'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';

type Tab = 'visit' | 'create';

export default function PrivatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('visit');

  // Visit tab state
  const [visitCode, setVisitCode] = useState('');
  const [visitError, setVisitError] = useState('');
  const [visitLoading, setVisitLoading] = useState(false);

  // Create tab state
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // ── Visit a garden ──────────────────────────────────────
  async function handleVisit() {
    if (!visitCode.trim()) return;
    setVisitLoading(true);
    setVisitError('');

    try {
      const res = await fetch(`/api/gardens/${visitCode.toUpperCase()}`);
      if (res.ok) {
        router.push(`/private/garden/${visitCode.toUpperCase()}`);
      } else {
        setVisitError('Garden does not exist! Create a new garden');
      }
    } catch {
      setVisitError('Failed to check garden. Please try again.');
    } finally {
      setVisitLoading(false);
    }
  }

  // ── Create a new garden (only on user action) ────────────
  async function handleCreate() {
    setCreateLoading(true);
    setCreateError('');

    try {
      const res = await fetch('/api/gardens/create', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.code) {
        router.push(`/private/garden/${data.code}`);
      } else {
        setCreateError(data.error || 'Could not create garden. Please try again.');
        setCreateLoading(false);
      }
    } catch {
      setCreateError('Network error. Please try again.');
      setCreateLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center pt-32 px-4">
      <NavBar />

      {/* Tab toggle */}
      <div className="flex bg-[#f5f5f5] rounded-[10px] p-1 gap-1 mb-12 shadow-sm border border-[#e8e0d4]/50">
        {(['visit', 'create'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setVisitError('');
              setCreateError('');
            }}
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
          <p className="font-poppins text-[16px] font-medium text-black mb-2">
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
          <p className="font-poppins text-[16px] font-medium text-black mb-1">
            Create a new private garden
          </p>
          <p className="font-poppins text-[13px] text-[#8a7d6b] text-center mb-2">
            Start a shared private space with a unique code for your letters.
          </p>

          {createError && (
            <p className="text-red-500 text-[13px] font-poppins">{createError}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={createLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] bg-black text-white font-poppins font-semibold text-[14px] hover:bg-[#1a1a1a] transition-all duration-300 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {createLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating garden...</span>
              </>
            ) : (
              <>
                <span>Create private garden</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
