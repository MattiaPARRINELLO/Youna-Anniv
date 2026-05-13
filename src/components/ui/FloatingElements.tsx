import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  type?: 'butterfly' | 'heart' | 'star' | 'mixed';
  count?: number;
}

const ELEMENTS = {
  butterfly: ['\uD83E\uDD8B'],
  heart: ['\u2661', '\u2665', '\uD83D\uDC95'],
  star: ['\u2726', '\u2727', '\u22C6'],
  mixed: ['\uD83E\uDD8B', '\u2661', '\u2726', '\u2665', '\u2727', '\uD83D\uDC95', '\u22C6'],
};

export function FloatingElements({ type = 'mixed', count = 5 }: FloatingElementsProps) {
  const pool = ELEMENTS[type];

  const elements = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        char: pool[Math.floor(Math.random() * pool.length)],
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 80,
        size: 12 + Math.random() * 16,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 12,
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 40,
        opacity: 0.1 + Math.random() * 0.2,
      })),
    [count, pool]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map((el) => (
        <motion.span
          key={el.id}
          className="absolute"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            fontSize: el.size,
            opacity: el.opacity,
          }}
          animate={{
            x: [0, el.driftX, 0, -el.driftX, 0],
            y: [0, el.driftY, -el.driftY, 0, el.driftY],
            rotate: [0, 10, -5, 8, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {el.char}
        </motion.span>
      ))}
    </div>
  );
}
