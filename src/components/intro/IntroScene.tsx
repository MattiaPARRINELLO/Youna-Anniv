import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartbeatGlow } from './HeartbeatGlow';
import { LightSweep } from './LightSweep';
import { PortalButton } from './PortalButton';
import { PortalExplosion } from './PortalExplosion';
import { ReactiveParticles } from '../ui/ReactiveParticles';
import { FloatingElements } from '../ui/FloatingElements';
import { useMusic } from '../../context/MusicContext';
import config from '../../config.json';

type ActState = 'heartbeat' | 'title' | 'portal' | 'exploding' | 'done';

const AUTO_DURATION = 12000;

interface IntroSceneProps {
  onComplete: () => void;
}

function TypewriterOverlay({ act, exploding }: { act: ActState; exploding: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const lines = config.intro.lines;
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const isVisible = act !== 'heartbeat' || visibleLines > 0;
  const opacity = act === 'heartbeat' ? 0.25 : act === 'exploding' || exploding ? 1 : 0.55;

  return (
    <motion.div
      className="absolute bottom-20 sm:bottom-32 left-0 right-0 z-20 flex flex-col items-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? opacity : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-1.5 max-w-xs mx-auto">
        {config.intro.lines.map((line, i) => {
          if (i >= visibleLines) return null;
          const isSpecial = line.startsWith('-');
          return (
            <motion.p
              key={i}
              className={`${
                isSpecial
                  ? 'text-cream-dark/10 text-[10px] tracking-[0.3em]'
                  : 'font-body text-cream/60 text-xs sm:text-sm'
              }`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              {isSpecial ? '· · ·' : line}
            </motion.p>
          );
        })}
      </div>
    </motion.div>
  );
}

export function IntroScene({ onComplete }: IntroSceneProps) {
  const { markInteraction } = useMusic();
  const [act, setAct] = useState<ActState>('heartbeat');
  const [exploding, setExploding] = useState(false);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const t1 = setTimeout(() => setAct('title'), 2500);
    const t2 = setTimeout(() => setAct('portal'), 6500);
    const t3 = setTimeout(() => {
      markInteraction();
      setExploding(true);
      setAct('exploding');
    }, AUTO_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [markInteraction]);

  const handlePortalClick = useCallback(() => {
    markInteraction();
    if (act !== 'exploding' && act !== 'done') {
      setExploding(true);
      setAct('exploding');
    }
  }, [markInteraction, act]);

  const handleExplosionComplete = useCallback(() => {
    setAct('done');
    completeTimerRef.current = setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#14101E] to-warm-dark-mid overflow-hidden">
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <ReactiveParticles countDesktop={30} countMobile={15} />
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <TypewriterOverlay act={act} exploding={exploding} />

      <AnimatePresence mode="wait">
        {act === 'heartbeat' && (
          <motion.div key="heartbeat" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <HeartbeatGlow />
          </motion.div>
        )}

        {act === 'title' && (
          <motion.div
            key="title"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LightSweep delay={0.2}>
              <p className="font-serif italic text-gold text-4xl sm:text-5xl md:text-6xl tracking-[0.15em]"
                style={{ textShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
                pour toi
              </p>
            </LightSweep>
          </motion.div>
        )}

        {act === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PortalButton onClick={handlePortalClick} />
          </motion.div>
        )}
      </AnimatePresence>

      <PortalExplosion
        active={exploding}
        onComplete={handleExplosionComplete}
      />
    </section>
  );
}
