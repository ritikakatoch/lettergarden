// 'use client';

// import { useState, useTransition } from 'react';
// import { HandwritingStyle } from '@/types';
// import EnvelopePreview from '@/components/EnvelopePreview';
// import FlowerPicker from '@/components/FlowerPicker';
// import HandwritingSelector from '@/components/HandwritingSelector';
// import { submitLetterAction } from '@/app/actions/letters';
// import Link from 'next/link';
// import { ArrowLeft, ChevronRight } from 'lucide-react';

// const MAX_TO = 25;
// const MAX_FROM = 25;
// const MAX_MSG = 170;

// export default function WritePage() {
//   const [to, setTo] = useState('');
//   const [from, setFrom] = useState('');
//   const [content, setContent] = useState('');
//   const [flowers, setFlowers] = useState<string[]>([]);
//   const [handwriting, setHandwriting] = useState<HandwritingStyle>('cedarville');
//   const [isPending, startTransition] = useTransition();
//   const [_mountedAt] = useState(() => Date.now());

//   const canPost = to.trim().length > 0 && content.trim().length > 0;

//   const handlePost = () => {
//     if (!canPost) return;
//     startTransition(async () => {
//       await submitLetterAction({ to, from: from || undefined, content, flowers, handwriting,_t: _mountedAt, _hp: '',});
//     });
//   };

//   return (
//     <div className="h-screen flex flex-col bg-[#FDFCFB]">

//       {/* ── Top bar ──────────────────────────────────── */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d4] sticky top-0 bg-[#FDFCFB]/90 backdrop-blur-sm z-40 font-semibold">
//         <Link href="/" className="flex items-center gap-2 text-sm text-[#5a4e3c] hover:text-[#1a1a1a] transition-colors font-semibold">
//           <ArrowLeft size={18} />
//           Back to public garden
//         </Link>
//         <button
//           onClick={handlePost}
//           disabled={!canPost || isPending}
//           className="flex items-center gap-1.5 px-5 py-2 rounded-[6px] text-sm font-sans transition-all duration-200
//             disabled:bg-[#e0d9d0] disabled:text-[#a09888] disabled:cursor-not-allowed
//             enabled:bg-[#1a1a1a] enabled:text-white enabled:hover:bg-[#333]"
//         >
//           {isPending ? 'Posting…' : 'Post to public garden'}
//           {!isPending && <ChevronRight size={18} />}
//         </button>
//       </div>

//       {/* ── Split layout ─────────────────────────────── */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* LEFT: scrollable form */}
//         <div className="w-full lg:w-1/2 overflow-y-auto px-8 py-10 space-y-8 border-r border-[#e8e0d4]">

//           {/* To */}
//           <div className="space-y-1">
//             <label className="text-[16px] font-medium text-[#3b3833] font-sans">To:</label>
//             <input
//               type="text"
//               value={to}
//               onChange={e => setTo(e.target.value.slice(0, MAX_TO))}
//               placeholder="Who is this note for?"
//               className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors"
//             />
//             <p className="text-right text-[11px] text-[#c0b8ad]">{to.length}/{MAX_TO}</p>
//           </div>

//           {/* From */}
//           <div className="space-y-1">
//             <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans">
//               From:
//               <span className="text-[12px] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]">Optional</span>
//             </label>
//             <input
//               type="text"
//               value={from}
//               onChange={e => setFrom(e.target.value.slice(0, MAX_FROM))}
//               placeholder="(Leave blank to post anonymously)"
//               className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors"
//             />
//             <p className="text-right text-[14px] text-[#c0b8ad]">{from.length}/{MAX_FROM}</p>
//           </div>

//           {/* Message */}
//           <div className="space-y-1">
//             <label className="text-[16px] font-medium text-[#3b3833] font-sans">
//               Your message
//             </label>

//             <textarea
//               value={content}
//               onChange={e => {
//                 setContent(e.target.value.slice(0, MAX_MSG));

//                 // Auto resize
//                 e.target.style.height = '0px';
//                 e.target.style.height = `${e.target.scrollHeight}px`;
//               }}
//               placeholder="What do you want to say?"
//               rows={1}
//               className="
//       w-full
//       bg-transparent border-0 border-b border-[#e0d9d0]
//       py-1 outline-none resize-none overflow-hidden
//       text-[#3b3833] placeholder:text-[#c0b8ad]
//       text-[14px] font-sans
//       focus:border-[#8a7d6b]
//       transition-colors
//       leading-[1.7]
//       min-h-[80px]
//     "
//             />

//             <p className="text-right text-[12px] text-[#c0b8ad]">
//               {content.length}/{MAX_MSG}
//             </p>
//           </div>

//           {/* Pick flowers */}
//           <div className="space-y-3">
//             <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans w-full">
//               Pick your flowers
//               <span className="text-[12x] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]"></span>
//             </label>
//             <FlowerPicker selected={flowers} onChange={setFlowers} />
//           </div>

//           {/* Handwriting */}
//           <div className="space-y-3 pb-8">
//             <label className="flex items-center gap-2 text-[16px] font-medium text-[#3b3833] font-sans w-full">
//               Select your handwriting
//             </label>
//             <HandwritingSelector selected={handwriting} onChange={setHandwriting} />
//           </div>
//         </div>

//         {/* RIGHT: live envelope preview */}
//         <div className="visible lg:flex w-1/2 items-center justify-center px-12 py-10 bg-[#f7f4ef]">
//           <div className="w-full flex justify-center max-w-[460px]">
//             <EnvelopePreview
//               to={to}
//               from={from}
//               content={content}
//               flowers={flowers}
//               handwriting={handwriting}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useTransition } from 'react';
import { HandwritingStyle } from '@/types';
import EnvelopePreview from '@/components/EnvelopePreview';
import FlowerPicker from '@/components/FlowerPicker';
import HandwritingSelector from '@/components/HandwritingSelector';
import { submitLetterAction } from '@/app/actions/letters';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const MAX_TO = 25;
const MAX_FROM = 25;
const MAX_MSG = 170;

export default function WritePage() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [content, setContent] = useState('');
  const [flowers, setFlowers] = useState<string[]>([]);
  const [handwriting, setHandwriting] = useState<HandwritingStyle>('cedarville');
  const [isPending, startTransition] = useTransition();
  const [_mountedAt] = useState(() => Date.now());

  const canPost = to.trim().length > 0 && content.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    startTransition(async () => {
      await submitLetterAction({
        to, from: from || undefined, content, flowers, handwriting,
        _t: _mountedAt, _hp: '',
      });
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFCFB]">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e8e0d4] sticky top-0 bg-[#FDFCFB]/90 backdrop-blur-sm z-40">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#5a4e3c] hover:text-[#1a1a1a] transition-colors font-semibold"
        >
          <ArrowLeft size={16} />
          Back to public garden
        </Link>

        {/* Post button — desktop only; mobile gets its own bottom bar */}
        <button
          onClick={handlePost}
          disabled={!canPost || isPending}
          className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-[6px] text-sm font-sans font-semibold transition-all duration-200
            disabled:bg-[#e0d9d0] disabled:text-[#a09888] disabled:cursor-not-allowed
            enabled:bg-[#1a1a1a] enabled:text-white enabled:hover:bg-[#333]"
        >
          {isPending ? 'Posting…' : 'Post to public garden'}
          {!isPending && <ChevronRight size={16} />}
        </button>
      </div>

      {/* ── Split layout ──────────────────────────────────────────────────── */}
      {/*
        Mobile : single column, form scrolls, bottom CTA bar pinned
        Desktop: left form | right envelope preview
      */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT / ONLY: scrollable form ──────────────────────────────────── */}
        {/*
          On mobile add pb-20 so the last field isn't hidden behind the sticky
          bottom button. On desktop the bottom button doesn't exist so no need.
        */}
        <div className="w-full lg:w-1/2 overflow-y-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7 sm:space-y-8 border-r border-[#e8e0d4] pb-24 sm:pb-10">

          {/* To */}
          <div className="space-y-1">
            <label className="text-[15px] sm:text-[16px] font-medium text-[#3b3833] font-sans">
              To:
            </label>
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value.slice(0, MAX_TO))}
              placeholder="Who is this note for?"
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors"
            />
            <p className="text-right text-[11px] text-[#c0b8ad]">{to.length}/{MAX_TO}</p>
          </div>

          {/* From */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[15px] sm:text-[16px] font-medium text-[#3b3833] font-sans">
              From:
              <span className="text-[11px] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]">
                Optional
              </span>
            </label>
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value.slice(0, MAX_FROM))}
              placeholder="(Leave blank to post anonymously)"
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] pb-2 outline-none text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors"
            />
            <p className="text-right text-[11px] text-[#c0b8ad]">{from.length}/{MAX_FROM}</p>
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-[15px] sm:text-[16px] font-medium text-[#3b3833] font-sans">
              Your message
            </label>
            <textarea
              value={content}
              onChange={e => {
                setContent(e.target.value.slice(0, MAX_MSG));
                e.target.style.height = '0px';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="What do you want to say?"
              rows={1}
              className="w-full bg-transparent border-0 border-b border-[#e0d9d0] py-1 outline-none resize-none overflow-hidden text-[#3b3833] placeholder:text-[#c0b8ad] text-[14px] font-sans focus:border-[#8a7d6b] transition-colors leading-[1.7] min-h-[80px]"
            />
            <p className="text-right text-[11px] text-[#c0b8ad]">{content.length}/{MAX_MSG}</p>
          </div>

          {/* Pick flowers */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[15px] sm:text-[16px] font-medium text-[#3b3833] font-sans w-full">
              Pick your flowers
              <span className="text-[11px] font-normal text-[#a09888] bg-[#f0ebe3] px-2 py-0.5 rounded-[6px]">
                Optional
              </span>
            </label>
            <FlowerPicker selected={flowers} onChange={setFlowers} />
          </div>

          {/* Handwriting */}
          <div className="space-y-3">
            <label className="text-[15px] sm:text-[16px] font-medium text-[#3b3833] font-sans">
              Select your handwriting
            </label>
            <HandwritingSelector selected={handwriting} onChange={setHandwriting} />
          </div>
        </div>

        {/* RIGHT: envelope preview — desktop only ────────────────────────── */}
        <div className="hidden lg:flex w-1/2 items-center justify-center px-12 py-10 bg-[#f7f4ef]">
          <div className="w-full flex justify-center max-w-[460px]">
            <EnvelopePreview
              to={to}
              from={from}
              content={content}
              flowers={flowers}
              handwriting={handwriting}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile-only sticky bottom Post button ─────────────────────────── */}
      <div className="sm:hidden shrink-0 px-4 py-3 bg-[#FDFCFB]/95 backdrop-blur-sm border-t border-[#e8e0d4]">
        <button
          onClick={handlePost}
          disabled={!canPost || isPending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] text-[14px] font-sans font-semibold transition-all duration-200
            disabled:bg-[#e0d9d0] disabled:text-[#a09888] disabled:cursor-not-allowed
            enabled:bg-[#1a1a1a] enabled:text-white enabled:active:bg-[#333]"
        >
          {isPending ? 'Posting…' : 'Post to public garden'}
          {!isPending && <ChevronRight size={16} />}
        </button>
      </div>

    </div>
  );
}