'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const FLOWERS = [
    { src: '/stickers/6d8f86ecc6e1fe9b76647207546481c4fb38e0fc.png', alt: 'Flower Sticker 1' },
    { src: '/stickers/233e2136f1cb0d91b0ace9deafea0ed0417cf7e0.png', alt: 'Flower Sticker 2' },
    { src: '/stickers/416fe7be743f576502d0854395e5c8df8cc75a0d.png', alt: 'Flower Sticker 3' },
    { src: '/stickers/63413a51be7f8ecc80ada383aa6b74b7f0d7fb31.png', alt: 'Flower Sticker 4' },
    { src: '/stickers/82e4a498284b6f5fabd4534c902441362e1cdc50.png', alt: 'Flower Sticker 5' },
];

const INTERVAL_MS = 800;
const FADE_DURATION = 250;

export default function Loading() {
    const [index, setIndex] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % FLOWERS.length);
                setFading(false);
            }, FADE_DURATION);
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FDFCFB',
                zIndex: 9999,
                overflow: 'hidden',
            }}
        >
            {/* background glow */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(circle at 50% 50%, rgba(255,240,220,0.45) 0%, transparent 72%)',
                }}
            />

            {/* centered content */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-12px)',
                }}
            >
                {/* flower image */}
                <div
                    style={{
                        position: 'relative',
                        width: 130,
                        height: 130,
                        transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
                        opacity: fading ? 0 : 1,
                        transform: fading ? 'scale(0.9) translateY(8px)' : 'scale(1) translateY(0)',
                    }}
                >
                    <Image
                        src={FLOWERS[index].src}
                        alt={FLOWERS[index].alt}
                        fill
                        priority
                        className="object-contain select-none pointer-events-none"
                    />
                </div>

                {/* loading text */}
                <p
                    style={{
                        marginTop: 20,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.28em',
                        color: '#A09080',
                        fontFamily: 'var(--font-poppins, sans-serif)',
                        transition: `opacity ${FADE_DURATION}ms ease`,
                        opacity: fading ? 0 : 1,
                    }}
                >
                    Loading garden...
                </p>

                {/* progress dots */}
                <div
                    style={{
                        marginTop: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    {FLOWERS.map((_, i) => (
                        <span
                            key={i}
                            style={{
                                display: 'inline-block',
                                height: 6,
                                width: i === index ? 18 : 6,
                                borderRadius: 99,
                                backgroundColor: i === index ? '#A8C580' : '#D8D2CB',
                                transition: 'width 300ms ease, background-color 300ms ease',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}