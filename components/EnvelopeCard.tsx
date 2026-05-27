'use client';

import { useState } from 'react';
import { Letter, HandwritingStyle } from '@/types';
import { motion } from 'framer-motion';

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

// Precise Assets from User
const ASSET_BACK = '/stickers/87d0888757ed59cfdf2ef9eb16536a2a2b67f054.png';
const ASSET_PAPER = '/stickers/b5969a304782471a2519a2466d03b649f087246b.png';
const ASSET_FRONT = '/stickers/00572ac6408106720bf2d0f99d3831521b3f0a56.png';

function calculateFlowerPosition(index: number, total: number) {
  if (total <= 1) {
    return { xPos: 50, yOffset: 15, rotation: 0, scale: 1 };
  }

  const normalizedX = index / (total - 1);

  // ← was 15 + 70%, now centered with only 40% spread
  const xPos = 30 + (normalizedX * 40);

  // Softer arch
  const archHeight = Math.sin(normalizedX * Math.PI) * 20; // ← was 35

  const jitterY = (index % 2 === 0 ? 1 : -1) * (index % 3) * 3; // ← was 4
  const yOffset = 10 + archHeight + jitterY;

  // Tighter fan rotation
  const baseRotation = (normalizedX - 0.5) * 24; // ← was 40
  const rotationJitter = (index % 2 === 0 ? -1 : 1) * 3; // ← was 4
  const rotation = baseRotation + rotationJitter;

  const scale = 0.88 + ((index * 7) % 18) * 0.01;

  return { xPos, yOffset, rotation, scale };
}

interface EnvelopeCardProps {
  letter: Letter;
  index?: number;
}

export default function EnvelopeCard({ letter, index = 0 }: EnvelopeCardProps) {
  const fontFamily = handwritingFonts[letter.handwriting] || 'var(--font-hand)';
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="flex flex-col items-center w-full cursor-pointer"
    >
      <div className="relative w-full max-w-[300px] aspect-[1/1.5] select-none">

        {/* Layer 1: Envelope Back */}
        <div className="absolute inset-0 z-10">
          <img
            src={ASSET_BACK}
            alt=""
            className="w-full h-full object-fill opacity-100"
          />
        </div>

        {/* Layer 2: Flowers (Strictly within paper width) */}
        {/* We use overflow-hidden to ensure they NEVER go beyond the paper width channel */}
        {/* <div className="absolute top-[-25%] left-[10%] w-[80%] h-[75%] z-20 overflow-visible flex justify-center items-end"> */}
        {/* Layer 2: Flowers */}
        <div className="absolute top-[-25%] left-[5%] w-[90%] h-[75%] z-20 overflow-visible flex justify-center items-end">      <div className="relative w-full h-[60%]">
          {letter.flowers.map((src, i) => {
            const { xPos, yOffset, rotation, scale } = calculateFlowerPosition(i, letter.flowers.length);

            return (
              <motion.img
                key={`flower-${i}`}
                src={src}
                alt=""
                className="absolute h-full w-auto object-contain origin-bottom"
                style={{
                  left: `${xPos}%`,
                  bottom: `${yOffset}px`,
                  transform: `translateX(-50%) rotate(${rotation}deg) scale(${scale})`,
                  zIndex: i,
                }}
              />
            );
          })}
        </div>
        </div>

        {/* Layer 3: Paper Sheet — pops up on hover */}
        <motion.div
          className="absolute left-[10%] w-[80%] h-[55%] z-30  flex flex-col shadow-sm rounded-sm"
          style={{
            backgroundImage: `url(${ASSET_PAPER})`,
            backgroundSize: '100% 100%',
            fontFamily,
            top: '22%',
            // padding: '10px 22px 16px',
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
          <p className="text-[14px] md:text-[15px] leading-[1.6] text-[#4a3e2c] line-clamp-[8] overflow-hidden">
            {/* {letter.content} */}
            {letter.content.replace(/\s*\n+\s*/g, ' ')}
          </p>
          {letter.from && (
            <p className="text-right text-[12px] text-[#6a5a43] mt-auto pb-4 italic">
              — {letter.from}
            </p>
          )}
        </motion.div>

        {/* Layer 4: Envelope Front */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={ASSET_FRONT}
              alt=""
              className="w-full h-full object-fill absolute inset-0"
              style={{
                clipPath: 'polygon(0% 32%, 50% 55%, 100% 32%, 100% 100%, 0% 100%)'
              }}
            />
            <div className="absolute bottom-[20%] left-[12%]">
              <p
                className="text-[14px] md:text-[15px] text-[#5a4e3c]"
                style={{ fontFamily: 'var(--font-reeniebeanie)' }}
              >
                To: {letter.to}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
