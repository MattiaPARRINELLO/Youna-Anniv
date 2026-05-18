import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { StarField } from './StarField';
import { ProgressiveReveal } from './ProgressiveReveal';
import { StatsBilan } from './StatsBilan';
import { HandwrittenLetter } from './HandwrittenLetter';
import { useInView } from '../../hooks/useInView';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { StarCatcherGame } from '../secrets/StarCatcherGame';
import { GemAnimation } from '../secrets/GemAnimation';
import config from '../../config.json';

export function EndingScene({ id }: { id?: string }) {
  const [phase, setPhase] = useState<'waiting' | 'reveal' | 'bilan' | 'letter' | 'heart' | 'restart'>('waiting');
  const [ref, inView] = useInView({ threshold: 0.2 });
  const { getFoundCount, gem5, unlockGem, resetAll } = useSecrets();
  const [showGame, setShowGame] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const [resetting, setResetting] = useState(false);
  const foundCount = getFoundCount();
  const hasAllGems = foundCount === 5;

  const restartTimerRef = useRef<number | null>(null);
  const heartTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current !== null) clearTimeout(restartTimerRef.current);
      if (heartTimerRef.current !== null) clearTimeout(heartTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (hasAllGems && phase === 'restart') {
      setPhase('letter');
    }
  }, [hasAllGems, phase]);

  const handleRestart = () => {
    setResetting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    restartTimerRef.current = window.setTimeout(() => {
      resetAll();
      window.scrollTo({ top: 0 });
    }, 800);
  };

  const handleGameComplete = useCallback((won: boolean) => {
    setShowGame(false);
    if (won && !gem5) {
      unlockGem(5);
      setShowGem(true);
    }
  }, [gem5, unlockGem]);

  return (
    <SectionWrapper id={id} className="bg-warm-darkest min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#14101E] to-warm-darkest" />
      {resetting && (
        <motion.div className="fixed inset-0 z-[300] bg-warm-darkest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
      )}
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
            onComplete={() => setPhase('bilan')}
          />
        )}

        {phase === 'bilan' && (
          <StatsBilan
            key="bilan"
            onComplete={() => setPhase(hasAllGems ? 'letter' : 'heart')}
          />
        )}

        {phase === 'letter' && (
          <HandwrittenLetter
            key="letter"
            text={config.finalLetter}
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
              onAnimationComplete={() => {
                heartTimerRef.current = window.setTimeout(() => setPhase('restart'), 3000);
              }}
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

            {!hasAllGems && (
              <motion.button
                className="font-body text-gold/60 text-xs sm:text-sm tracking-wider hover:text-gold transition-colors duration-500 underline underline-offset-4 decoration-gold/30 mt-4 block mx-auto"
                onClick={() => setShowGame(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                decouvre un secret
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingElements type="heart" countDesktop={6} countMobile={3} />

      <AnimatePresence>
        {showGame && (
          <StarCatcherGame
            onComplete={handleGameComplete}
            onClose={() => setShowGame(false)}
          />
        )}
      </AnimatePresence>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.starCatcherMessage}
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
