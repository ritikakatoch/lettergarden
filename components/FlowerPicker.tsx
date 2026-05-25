'use client';

import { FLOWERS } from '@/types';
import clsx from 'clsx';

interface FlowerPickerProps {
  selected: string[];
  onChange: (flowers: string[]) => void;
  max?: number;
}

export default function FlowerPicker({ selected, onChange, max = 20 }: FlowerPickerProps) {
  const toggle = (src: string) => {
    if (selected.includes(src)) {
      onChange(selected.filter((s) => s !== src));
    } else if (selected.length < max) {
      onChange([...selected, src]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {FLOWERS.map((src) => {
        const active = selected.includes(src);
        return (
          <button
            key={src}
            type="button"
            onClick={() => toggle(src)}
            className={clsx(
              'h-14 w-14 rounded-full flex items-center justify-center transition-all duration-200 border-2',
              active
                ? 'border-[#8a7d6b] bg-[#f0ebe3] scale-110 shadow-sm'
                : 'border-transparent hover:border-[#d5ccc0] hover:scale-105'
            )}
            aria-label="Toggle flower"
          >
            <img src={src} alt="" className="h-12 w-auto object-contain" draggable={false} />
          </button>
        );
      })}
    </div>
  );
}

