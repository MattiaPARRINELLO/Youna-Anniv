import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ReactiveParticles } from '../ui/ReactiveParticles';
import { TypewriterText } from './TypewriterText';
import { useMusic } from '../../context/MusicContext';
import config from '../../config.json';

const INTRO_DURATION = 13000;

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
      <ReactiveParticles count={30} />
      <motion.p
        className="text-gold/30 text-xs tracking-[0.3em] uppercase mb-8 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        {config.intro.label}
      </motion.p>
      <TypewriterText lines={config.intro.lines} />
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={canScroll ? { opacity: [0, 0.6, 0.6, 0] } : { opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-cream-dark/30 text-xs font-body tracking-wider">defiler</span>
        <motion.div
          className="w-5 h-8 border border-cream-dark/20 rounded-full flex justify-center"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-cream-dark/30 rounded-full mt-1"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
