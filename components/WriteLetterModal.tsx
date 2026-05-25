'use client';

import { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';

interface Props {
  gardenCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteLetterModal({ gardenCode, onClose, onSuccess }: Props) {
  const [author, setAuthor] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!content.trim()) { setError('Please write something.'); return; }
    setLoading(true);
    setError('');

    const res = await fetch(`/api/gardens/${gardenCode}/letters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, recipient, content }),
    });

    if (res.ok) {
      onSuccess();
    } else {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-[#FDFCFB] rounded-[12px] w-full max-w-lg p-6 shadow-xl border border-[#e8e0d4]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-poppins text-[16px] font-semibold text-[#3b3833]">
            Write a private letter
          </h2>
          <button onClick={onClose} className="text-[#8a7d6b] hover:text-[#3b3833] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-4 py-2.5 rounded-[7px] border border-[#e8e0d4] bg-white text-[14px] font-poppins text-[#3b3833] placeholder:text-[#c0b8ac] outline-none focus:border-[#3b3833] transition-colors"
          />
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="To: (optional)"
            className="w-full px-4 py-2.5 rounded-[7px] border border-[#e8e0d4] bg-white text-[14px] font-poppins text-[#3b3833] placeholder:text-[#c0b8ac] outline-none focus:border-[#3b3833] transition-colors"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your letter..."
            rows={7}
            maxLength={5000}
            className="w-full px-4 py-3 rounded-[7px] border border-[#e8e0d4] bg-white text-[14px] font-poppins text-[#3b3833] placeholder:text-[#c0b8ac] outline-none focus:border-[#3b3833] transition-colors resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#c0b8ac] font-poppins">{content.length}/5000</span>
            {error && <span className="text-[12px] text-red-500 font-poppins">{error}</span>}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-[8px] bg-[#3b3833] text-white text-[14px] font-poppins font-semibold hover:bg-[#1a1a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> Send letter</>}
        </button>
      </div>
    </div>
  );
}
