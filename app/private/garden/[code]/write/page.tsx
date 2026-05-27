'use client';

import { useState, useEffect, useTransition } from 'react';
import { HandwritingStyle } from '@/types';
import EnvelopePreview from '@/components/EnvelopePreview';
import FlowerPicker from '@/components/FlowerPicker';
import HandwritingSelector from '@/components/HandwritingSelector';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const MAX_TO = 25;
const MAX_FROM = 25;
const MAX_MSG = 170;

export default function PrivateWritePage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [content, setContent] = useState('');
  const [flowers, setFlowers] = useState<string[]>([]);
  const [handwriting, setHandwriting] = useState<HandwritingStyle>('cedarville');
  const [isPending, startTransition] = useTransition();
  const [_mountedAt] = useState(() => Date.now());

  // ── Guard: redirect hard if garden doesn't exist ─────────
  useEffect(() => {
    if (!code) return;
    fetch(`/api/gardens/${code}`)
      .then(res => { if (!res.ok) window.location.replace('/private'); })
      .catch(() => window.location.replace('/private'));
  }, [code]);
  // ─────────────────────────────────────────────────────────

  const canPost = to.trim().length > 0 && content.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    startTransition(async () => {
      const res = await fetch(`/api/gardens/${code}/letters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: from, recipient: to, content, flowers, handwriting, _t: _mountedAt,
          _hp: '',
        }),
      });
      if (res.ok) {
        router.push(`/private/garden/${code}`);
      } else {
        alert('Failed to post private letter.');
      }
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFCFB]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d4] sticky top-0 bg-[#FDFCFB]/90 backdrop-blur-sm z-40 font-semibold">
        <Link href={`/private/garden/${code}`} className="flex items-center gap-2 text-sm text-[#5a4e3c] hover:text-[#1a1a1a] transition-colors font-semibold">
          <ArrowLeft size={18} />
          Back to private garden
        </Link>
        <button
          onClick={handlePost}
          disabled={!canPost || isPending}
          className="flex items-center gap-1.5 px-5 py-2 rounded-[6px] text-sm font-sans transition-all duration-200
            disabled:bg-[#e0d9d0] disabled:text-[#a09888] disabled:cursor-not-allowed
            enabled:bg-[#1a1a1a] enabled:text-white enabled:hover:bg-[#333]"
        >
          {isPending ? 'Posting…' : 'Post to private garden'}
          {!isPending && <ChevronRight size={18} />}
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-1/2 overflow-y-auto px-8 py-10 space-y-8 border-r border-[#e8e0d4]">
          <div className="space-y-1">
            <label className="text-[16px] font-medium text-[#3b3833] font-sans">To:</label>
            <input type="text" value={to} onChange={e => setTo(e.target.value.slice(0, MAX_TO))} placeholder="Who is this note for?"
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors" />
            <p className="text-right text-[11px] text-[#c0b8ad]">{to.length}/{MAX_TO}</p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans">
              From: <span className="text-[12px] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]">Optional</span>
            </label>
            <input type="text" value={from} onChange={e => setFrom(e.target.value.slice(0, MAX_FROM))} placeholder="(Leave blank to post anonymously)"
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors" />
            <p className="text-right text-[14px] text-[#c0b8ad]">{from.length}/{MAX_FROM}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[16px] font-medium text-[#3b3833] font-sans">Your message</label>
            <textarea value={content} onChange={e => { setContent(e.target.value.slice(0, MAX_MSG)); e.target.style.height = '0px'; e.target.style.height = `${e.target.scrollHeight}px`; }}
              placeholder="What do you want to say?" rows={1}
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] py-1 outline-none resize-none overflow-hidden text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors leading-[1.7] min-h-[80px]" />
            <p className="text-right text-[12px] text-[#c0b8ad]">{content.length}/{MAX_MSG}</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans w-full">
              Pick your flowers
              <span className="text-[12px] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]"></span>
            </label>
            <FlowerPicker selected={flowers} onChange={setFlowers} />
          </div>
          <div className="space-y-3 pb-8">
            <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans w-full">
              Select your handwriting
            </label>
            <HandwritingSelector selected={handwriting} onChange={setHandwriting} />
          </div>
        </div>
        <div className="visible lg:flex w-1/2 items-center justify-center px-12 py-10 bg-[#f7f4ef]">
          <div className="w-full flex justify-center max-w-[460px]">
            <EnvelopePreview to={to} from={from} content={content} flowers={flowers} handwriting={handwriting} />
          </div>
        </div>
      </div>
    </div>
  );
}