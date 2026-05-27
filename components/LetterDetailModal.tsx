'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { Letter } from '@/types';
import EnvelopePreview from '@/components/EnvelopePreview';

interface Props {
    letter: Letter;
    onClose: () => void;
}

export default function LetterDetailModal({ letter, onClose }: Props) {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?note=${letter.shareCode}`;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    function copyLink() {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">

            {/* ── Top bar ─────────────────────────────────────────────── */}
            <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e8e0d4] shrink-0">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-[13px] sm:text-[14px] font-poppins font-semibold text-[#3b3833] hover:text-black transition-colors"
                >
                    <ArrowLeft size={15} strokeWidth={2.5} />
                    Back to public garden
                </button>
            </div>

            {/* ── Body ────────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col sm:flex-row overflow-y-auto sm:overflow-hidden">

                {/*
                    Desktop: a single centred row that hugs both panels together.
                    We wrap both in a max-w container so they sit close,
                    instead of one being flex-1 and pushing them apart.
                */}
                <div className="
                    flex flex-col sm:flex-row
                    items-center sm:items-center
                    justify-center
                    gap-8 sm:gap-10
                    w-full
                    px-4 pt-16 pb-4 sm:pt-20 sm:pb-8
                    mx-auto
                ">
                    {/* Envelope */}
                    <div className="
                        flex justify-center shrink-0
                        w-full max-w-[320px]
                        sm:w-[480px] sm:max-w-none
                        scale-[0.66] origin-top
                        sm:scale-[1.28] sm:origin-center
                    ">
                        <EnvelopePreview
                            to={letter.to}
                            from={letter.from}
                            content={letter.content}
                            flowers={letter.flowers}
                            handwriting={letter.handwriting}
                        />
                    </div>

                    {/* ── Desktop share panel ─────────────────────────── */}
                    <div className="hidden sm:flex flex-col gap-4 w-[260px] shrink-0">
                        <p className="text-[13px] font-poppins text-[#8a7d6b] font-medium">
                            Share this public garden letter:
                        </p>

                        <div className="flex items-center px-3 py-2.5 rounded-[8px] border border-[#e8e0d4] bg-[#faf8f5]">
                            <span className="text-[11px] font-poppins text-[#5a4e3c] truncate">
                                {shareUrl}
                            </span>
                        </div>

                        <button
                            onClick={copyLink}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-black text-white text-[12px] font-poppins font-semibold hover:bg-[#1a1a1a] transition-colors w-fit"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy link'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile share bar ────────────────────────────────────── */}
            <div className="sm:hidden flex flex-col gap-3 px-4 py-4 border-t border-[#e8e0d4] shrink-0 bg-white">
                <p className="text-[13px] font-poppins text-[#8a7d6b] font-medium">
                    Share this letter:
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-[8px] border border-[#e8e0d4] bg-[#faf8f5] overflow-hidden">
                        <span className="text-[12px] font-poppins text-[#5a4e3c] truncate block">
                            {shareUrl}
                        </span>
                    </div>
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-[8px] bg-black text-white text-[12px] font-poppins font-semibold shrink-0 whitespace-nowrap"
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy link'}
                    </button>
                </div>
            </div>

        </div>
    );
}