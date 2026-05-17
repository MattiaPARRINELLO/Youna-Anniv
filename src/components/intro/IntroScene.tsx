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

const LINE_DELAY = 500;
const ACT_PAUSE = 1200;
const ACT1_END = 5;
const ACT2_END = 13;

interface IntroSceneProps {
  onComplete: () => void;
}

export function IntroScene({ onComplete }: IntroSceneProps) {
  const { markInteraction } = useMusic();
  const [act, setAct] = useState<ActState>('heartbeat');
  const [exploding, setExploding] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lineTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const markRef = useRef(markInteraction);
  markRef.current = markInteraction;

  useEffect(() => {
    let cancelled = false;

    function advanceLine(current: number) {
      if (cancelled) return;
      const next = current + 1;
      setVisibleLines(next);

      if (next > config.intro.lines.length - 1) {
        lineTimerRef.current = setTimeout(() => {
          if (!cancelled) {
            markRef.current();
            setExploding(true);
            setAct('exploding');
          }
        }, ACT_PAUSE * 2);
        return;
      }

      let delay = LINE_DELAY;
      if (next === ACT1_END + 1) {
        delay = ACT_PAUSE;
        setAct('title');
      } else if (next === ACT2_END + 1) {
        delay = ACT_PAUSE;
        setAct('portal');
      }

      lineTimerRef.current = setTimeout(() => advanceLine(next), delay);
    }

    lineTimerRef.current = setTimeout(() => advanceLine(0), 600);

    return () => {
      cancelled = true;
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    };
  }, []);

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

  const lines = config.intro.lines;

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#14101E] to-warm-dark-mid overflow-hidden">
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <ReactiveParticles countDesktop={30} countMobile={15} />
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <motion.div
        className="absolute bottom-20 sm:bottom-32 left-0 right-0 z-20 flex flex-col items-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: visibleLines > 0 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center space-y-1.5 max-w-xs mx-auto">
          {lines.map((line, i) => {
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
                transition={{ duration: 0.4 }}
              >
                {isSpecial ? '· · ·' : line}
              </motion.p>
            );
          })}
        </div>
      </motion.div>

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
