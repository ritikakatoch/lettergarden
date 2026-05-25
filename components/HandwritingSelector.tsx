'use client';

import { HandwritingStyle } from '@/types';
import clsx from 'clsx';

const fonts: { id: HandwritingStyle; label: string; cssVar: string }[] = [
    {
    id: 'reenieBeanie',
    label: 'every flower blooms with the words i never said aloud',
    cssVar: 'var(--font-reeniebeanie)',
  },
  {
    id: 'cedarville',
    label: 'every flower blooms with the words i never said aloud',
    cssVar: 'var(--font-cedarville)',
  },
  {
    id: 'caveat',
    label: 'every flower blooms with the words i never said aloud',
    cssVar: 'var(--font-caveat)',
  },
  {
    id: 'shadows',
    label: 'every flower blooms with the words i never said aloud',
    cssVar: 'var(--font-shadows)',
  },
  {
    id: 'homemade',
    label: 'every flower blooms with the words i never said aloud',
    cssVar: 'var(--font-homemade)',
  },

];

interface HandwritingSelectorProps {
  selected: HandwritingStyle;
  onChange: (style: HandwritingStyle) => void;
}

export default function HandwritingSelector({ selected, onChange }: HandwritingSelectorProps) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      {fonts.map(({ id, label, cssVar }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={clsx(
            'w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 text-[18px] text-[#3b3833]',
            selected === id
              ? 'border-[#3b3833] bg-white shadow-sm'
              : 'border-[#e4ddd3] bg-white/50 hover:border-[#c5bbb0]'
          )}
          style={{ fontFamily: cssVar }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
