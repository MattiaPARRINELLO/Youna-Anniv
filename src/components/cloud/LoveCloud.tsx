import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { useInView } from '../../hooks/useInView';

import config from '../../config.json';

interface Reason {
  word: string;
  phrase: string;
}

const REASONS: Reason[] = config.loveReasons;

function getFontSize(word: string): number {
  const len = word.length;
  if (len <= 5) return 1.8 + Math.random() * 0.4;
  if (len <= 10) return 1.4 + Math.random() * 0.3;
  return 1.1 + Math.random() * 0.2;
}

export function LoveCloud({ id }: { id?: string }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [selected, setSelected] = useState<Reason | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const words = useMemo(() => {
    return REASONS.map(r => ({
      ...r,
      size: getFontSize(r.word),
      x: Math.random() * 85,
      y: Math.random() * 75,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <SectionWrapper id={id} className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#1A1230] to-warm-darkest" />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <motion.h2
          className="font-serif text-2xl sm:text-3xl text-center text-cream/80 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          ☁️ Pourquoi je t'aime
        </motion.h2>
        <motion.p
          className="font-handwritten text-cream-dark/30 text-center text-sm mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          touche un mot pour découvrir
        </motion.p>

        <div className="relative h-[400px] sm:h-[500px]">
          {inView && words.map((w, i) => (
            <motion.button
              key={w.word}
              className="absolute cursor-pointer select-none"
              style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: hovered === w.word ? 0.9 : 0.5,
                scale: hovered === w.word ? 1.15 : 1,
                x: [0, 3, -2, 4, -3, 0],
                y: [0, -4, 2, -3, 4, 0],
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                x: { duration: w.duration, delay: w.delay, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: w.duration + 1, delay: w.delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              onMouseEnter={() => setHovered(w.word)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(selected?.word === w.word ? null : w)}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className="font-serif italic transition-all duration-300"
                style={{
                  fontSize: `${w.size}rem`,
                  color: selected?.word === w.word ? '#D4AF37' : hovered === w.word ? '#FF69B4' : '#A0917A',
                  textShadow: selected?.word === w.word
                    ? '0 0 20px rgba(212,175,55,0.3)'
                    : 'none',
                }}
              >
                {w.word}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.word}
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="glass rounded-2xl px-6 py-4 inline-block max-w-md mx-auto">
                <p className="font-handwritten text-gold text-sm mb-1">{selected.word}</p>
                <p className="font-serif text-cream/70 text-base italic leading-relaxed">
                  {selected.phrase}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
