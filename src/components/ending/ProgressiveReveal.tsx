import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  { id: 'p1', lines: ['avant toi', 'je ne savais pas'], delay: 0 },
  { id: 'p2', lines: ['que le monde pouvait etre', 'aussi doux'], delay: 5000 },
  { id: 'climax', lines: ["merci d'exister"], delay: 11000, isClimax: true },
];

interface ProgressiveRevealProps {
  onComplete: () => void;
}

export function ProgressiveReveal({ onComplete }: ProgressiveRevealProps) {
  const [currentPhase, setCurrentPhase] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentPhase(0), 500);
    const t2 = setTimeout(() => setCurrentPhase(1), 5500);
    const t3 = setTimeout(() => setCurrentPhase(2), 11500);
    const t4 = setTimeout(() => onComplete(), 18000);
    timersRef.current = [t1, t2, t3, t4];

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    setCurrentPhase(2);
    setTimeout(onComplete, 2000);
  }, [onComplete]);

  return (
    <motion.div className="relative z-10 text-center px-6" onClick={handleSkip}>
      {phases.map((phase, phaseIdx) => (
        <AnimatePresence key={phase.id}>
          {currentPhase >= phaseIdx && (
            <motion.div className={phaseIdx < 2 ? 'mb-12' : 'mt-8'}>
              {phase.lines.map((line, lineIdx) => (
                <motion.p
                  key={line}
                  className={`font-serif italic leading-relaxed ${
                    phase.isClimax
                      ? 'text-gold text-2xl sm:text-4xl md:text-5xl'
                      : 'text-cream/60 text-lg sm:text-xl md:text-2xl'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: phase.isClimax ? 0.5 : lineIdx * 1.5,
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <p className="text-cream-dark/10 text-[10px] mt-8 font-body">tap pour continuer</p>
    </motion.div>
  );
}
