'use client';

import { HandwritingStyle } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

const handwritingFonts: Record<HandwritingStyle, string> = {
  dancing: 'var(--font-dancing)',
  caveat: 'var(--font-caveat)',
  pacifico: 'var(--font-pacifico)',
  poppins: 'var(--font-poppins)',
  homemade: 'var(--font-homemade)',
  indie: 'var(--font-indie)',
  shadows: 'var(--font-shadows)',
  greatvibes: 'var(--font-greatvibes)',
  reenieBeanie: 'var(--font-reeniebeanie)',
  cedarville: 'var(--font-cedarville)',

};

const ASSET_BACK = '/stickers/87d0888757ed59cfdf2ef9eb16536a2a2b67f054.png';
const ASSET_PAPER = '/stickers/b5969a304782471a2519a2466d03b649f087246b.png';
const ASSET_FRONT = '/stickers/00572ac6408106720bf2d0f99d3831521b3f0a56.png';

interface EnvelopePreviewProps {
  to: string;
  from?: string;
  content: string;
  flowers: string[];
  handwriting: HandwritingStyle;
}

/* ✅ CENTER-FIRST + NO OVERFLOW */
function calculateFlowerPosition(index: number, _total?: number) {
  const center = 50;   // still centered
  const spacing = 5;

  const leftCount = Math.floor(index / 2);
  const rightCount = index - leftCount;

  let direction: number;
  if (index === 0) {
    direction = 0;
  } else if (leftCount > rightCount) {
    direction = 1;
  } else {
    direction = -1;
  }

  const step = Math.ceil(index / 2);
  let x = center + direction * step * spacing;

  // ✅ Wider safe bounds now that container is full-width
  x = Math.max(5, Math.min(75, x));

  const y = step * 5 + (index % 3) * 2;
  const rotation = direction * step * 3;
  const scale = 0.95 + (index % 3) * 0.04;

  return { x, y, rotation, scale };
}

export default function EnvelopePreview({
  to,
  from,
  content,
  flowers,
  handwriting,
}: EnvelopePreviewProps) {
  const fontFamily = handwritingFonts[handwriting] || 'var(--font-hand)';
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center w-full mx-auto select-none pt-12 pb-12">

      <div
        className="relative w-full max-w-[380px] aspect-[1/1.45]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        {/* BACK */}
        <div className="absolute inset-0 z-10">
          <img
            src={ASSET_BACK}
            alt=""
            className="w-full h-full object-fill drop-shadow-xl"
          />
        </div>

        {/* 🌸 FLOWERS */}
        <div
          className="absolute z-20 left-0 top-[18%] w-full h-[38%] pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <div className="relative w-full h-full" style={{ overflow: 'visible' }}>
            {flowers.map((src, i) => {
              const { x, y, rotation, scale } = calculateFlowerPosition(i, flowers.length);
              return (
                <motion.img
                  key={`flower-${i}`}
                  src={src}
                  alt=""
                  initial={{ scale: 0.6, opacity: 0, y: 20 }}
                  animate={{ scale, opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="absolute bottom-0 object-contain origin-bottom drop-shadow-md"
                  style={{
                    left: `${x}%`,
                    transform: `translateY(${y}px) rotate(${rotation}deg)`,
                    height: '115%',
                    zIndex: 20 + i,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* PAPER — pops up on hover */}
        <motion.div
          className="absolute left-[10%] w-[80%] z-30 px-10 py-12 flex flex-col drop-shadow-md rounded-sm overflow-hidden"
          style={{
            backgroundImage: `url(${ASSET_PAPER})`,
            backgroundSize: '100% 100%',
            fontFamily,
            top: '26%',
            height: '55%',
            // padding: '12px 28px 20px',
            paddingTop: '20px',
            paddingBottom: '14px',
            paddingLeft: '28px',
            paddingRight: '28px',
          }}
          animate={{
            y: hovered ? '-28%' : '0%',
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 28,
          }}
        >
          {content ? (
            <p
              className="
        text-[14px]
        leading-[1.6]
        text-[#000000]
        whitespace-pre-wrap
        break-words
        break-all
        overflow-hidden
      "
            >
              {/* {content} */}
              {content.replace(/\s*\n+\s*/g, ' ')}
            </p>
          ) : (
            <p className="text-[14px] text-[#000000] italic">
              {/* Your message will appear here... */}
            </p>
          )}

          {from && (
            <p
              className="
        text-right
        text-[13px]
        text-[#000000]
        italic
        mt-2
      "
            >
              — {from}
            </p>
          )}
        </motion.div>
        {/* FRONT */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <img
            src={ASSET_FRONT}
            alt=""
            className="w-full h-full object-fill absolute inset-0"
            style={{
              clipPath: 'polygon(0% 32%, 50% 55%, 100% 32%, 100% 100%, 0% 100%)',
            }}
          />
          <div className="absolute bottom-[20%] left-[12%]">
            <p
              className="text-[14px] text-[#5a4e3c]"
              style={{ fontFamily: 'var(--font-reeniebeanie)' }}            >
              To: {to || '...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}