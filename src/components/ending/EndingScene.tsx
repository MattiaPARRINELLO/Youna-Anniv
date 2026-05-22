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
import { PhotoSlideshow } from './PhotoSlideshow';
import { trackEvent } from '../../utils/tracker';
import config from '../../config.json';

export function EndingScene({ id }: { id?: string }) {
  const [phase, setPhase] = useState<'waiting' | 'reveal' | 'bilan' | 'letter' | 'slideshow' | 'heart' | 'restart'>('waiting');
  const [ref, inView] = useInView({ threshold: 0.75 });
  const { getFoundCount, gem7, unlockGem, resetAll } = useSecrets();
  const [showGame, setShowGame] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const [resetting, setResetting] = useState(false);
  const foundCount = getFoundCount();
  const hasAllGems = foundCount === 7;

  const restartTimerRef = useRef<number | null>(null);
  const heartTimerRef = useRef<number | null>(null);
  const gemLetterRef = useRef(false);

  useEffect(() => {
    if (hasAllGems && phase === 'restart' && !gemLetterRef.current) {
      gemLetterRef.current = true;
      setPhase('letter');
    }
  }, [hasAllGems, phase]);

  useEffect(() => {
    if (phase === 'letter') trackEvent('final_letter_started');
    if (phase === 'restart') trackEvent('experience_completed');
  }, [phase]);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current !== null) clearTimeout(restartTimerRef.current);
      if (heartTimerRef.current !== null) clearTimeout(heartTimerRef.current);
    };
  }, []);

  const handleRestart = () => {
    if (resetting) return;
    trackEvent('experience_restarted');
    setResetting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    restartTimerRef.current = window.setTimeout(() => {
      resetAll();
      setResetting(false);
      window.scrollTo({ top: 0 });
    }, 800);
  };

  const handleGameComplete = useCallback((won: boolean) => {
    setShowGame(false);
    if (won && !gem7) {
      unlockGem(7);
      setShowGem(true);
    }
  }, [gem7, unlockGem]);

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
            onComplete={() => setPhase('slideshow')}
          />
        )}

        {phase === 'slideshow' && (
          <motion.div
            key="slideshow"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PhotoSlideshow onComplete={() => setPhase('heart')} />
          </motion.div>
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
              className="font-serif italic text-cream/40 text-lg sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              avec tout mon amour,
            </motion.p>

            <motion.div
              className="mt-8 mb-8 max-w-sm mx-auto w-full px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <p className="font-body text-cream-dark/25 text-[10px] tracking-[0.2em] uppercase mb-3 text-center">cadeau fait main</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">{Math.ceil((Date.now() - new Date('2026-04-08').getTime()) / 86400000)}</p>
                  <p className="font-body text-cream/30 text-[10px]">jours sur ce site</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">6 500</p>
                  <p className="font-body text-cream/30 text-[10px]">lignes d'amour</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">100</p>
                  <p className="font-body text-cream/30 text-[10px]">commits</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">53</p>
                  <p className="font-body text-cream/30 text-[10px]">composants secrets</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">18</p>
                  <p className="font-body text-cream/30 text-[10px]">photos</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">7</p>
                  <p className="font-body text-cream/30 text-[10px]">gemmes cachées</p>
                </div>
                <div className="glass rounded-xl p-3 text-center col-span-2">
                  <p className="font-serif text-gold/60 text-lg sm:text-xl">204</p>
                  <p className="font-body text-cream/30 text-[10px]">mots dans ma lettre</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              className="font-body text-cream-dark/30 text-xs sm:text-sm tracking-wider hover:text-cream-dark/60 transition-colors duration-500 underline underline-offset-4 decoration-cream-dark/10"
              onClick={handleRestart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              revivre cette histoire
            </motion.button>

            {foundCount >= 6 && !hasAllGems && (
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
