import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ReactiveParticles } from '../ui/ReactiveParticles';
import { FloatingElements } from '../ui/FloatingElements';
import { TypewriterText } from './TypewriterText';
import { useMusic } from '../../context/MusicContext';
import config from '../../config.json';

const INTRO_DURATION = 10000;

interface IntroSceneProps {
  onComplete: () => void;
}

export function IntroScene({ onComplete }: IntroSceneProps) {
  const { markInteraction } = useMusic();
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanScroll(true);
      onComplete();
    }, INTRO_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleInteraction = useCallback(() => {
    markInteraction();
    if (!canScroll) {
      setCanScroll(true);
      onComplete();
    }
  }, [markInteraction, canScroll, onComplete]);

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-warm-darkest via-warm-dark to-warm-dark-mid overflow-hidden"
      onClick={handleInteraction}
    >
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <ReactiveParticles countDesktop={50} countMobile={20} />
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <motion.p
        className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-6 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        {config.intro.label}
      </motion.p>
      <TypewriterText lines={config.intro.lines} />

      <motion.div
        className="absolute bottom-24 flex flex-col items-center gap-3"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, delay: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-12 h-12 rounded-full glass flex items-center justify-center"
          whileTap={{ scale: 1.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            className="text-gold text-xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {'\u2728'}
          </motion.span>
        </motion.div>
        <span className="text-cream-dark/40 text-[10px] font-body tracking-widest uppercase">
          touche l&apos;ecran
        </span>
      </motion.div>
    </section>
  );
}
