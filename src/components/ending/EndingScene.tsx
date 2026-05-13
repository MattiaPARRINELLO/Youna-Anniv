import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { StarField } from './StarField';
import { ProgressiveReveal } from './ProgressiveReveal';
import { useInView } from '../../hooks/useInView';
import { FloatingElements } from '../ui/FloatingElements';

export function EndingScene() {
  const [phase, setPhase] = useState<'waiting' | 'reveal' | 'heart' | 'restart'>('waiting');
  const [ref, inView] = useInView({ threshold: 0.5 });

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <SectionWrapper className="bg-warm-darkest min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#14101E] to-warm-darkest" />
      <StarField />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute inset-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {(!inView && phase === 'waiting') && (
          <motion.div
            key="waiting"
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-handwritten text-cream-dark/10 text-2xl">{'\u2728'}</p>
          </motion.div>
        )}

        {inView && phase === 'waiting' && (
          <ProgressiveReveal
            key="reveal"
            onComplete={() => setPhase('heart')}
          />
        )}

        {phase === 'heart' && (
          <motion.div
            key="heart"
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setTimeout(() => setPhase('restart'), 3000)
              }
            >
              <span className="text-3xl sm:text-4xl animate-heartbeat inline-block">
                {'\u2764\uFE0F'}
              </span>
            </motion.div>
          </motion.div>
        )}

        {phase === 'restart' && (
          <motion.div
            key="restart"
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.p
              className="font-serif italic text-cream/40 text-lg sm:text-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              avec tout mon amour,
            </motion.p>

            <motion.button
              className="font-body text-cream-dark/30 text-xs sm:text-sm tracking-wider hover:text-cream-dark/60 transition-colors duration-500 underline underline-offset-4 decoration-cream-dark/10"
              onClick={handleRestart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              revivre cette histoire
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingElements type="heart" count={6} />
    </SectionWrapper>
  );
}
