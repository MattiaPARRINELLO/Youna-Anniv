import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartbeatGlow } from './HeartbeatGlow';
import { LightSweep } from './LightSweep';
import { PortalButton } from './PortalButton';
import { PortalExplosion } from './PortalExplosion';
import { ReactiveParticles } from '../ui/ReactiveParticles';
import { FloatingElements } from '../ui/FloatingElements';
import { useMusic } from '../../context/MusicContext';
import { useSfx } from '../../hooks/useSfx';
import config from '../../config.json';

type ActState = 'typewriter' | 'heartbeat' | 'title' | 'portal' | 'exploding' | 'done';

const LINE_DELAY = 850;
const TITLE_DURATION = 4000;
const PORTAL_DELAY = 4000;

interface IntroSceneProps {
  onComplete: () => void;
}

export function IntroScene({ onComplete }: IntroSceneProps) {
  const { markInteraction } = useMusic();
  const { playTypewriter, playExplosion } = useSfx();
  const [act, setAct] = useState<ActState>('typewriter');
  const [exploding, setExploding] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lineTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const cinematicTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const markRef = useRef(markInteraction);
  markRef.current = markInteraction;

  useEffect(() => {
    let cancelled = false;

    function advanceLine(current: number) {
      if (cancelled) return;
      const next = current + 1;
      setVisibleLines(next);

      if (next >= config.intro.lines.length) {
        lineTimerRef.current = setTimeout(() => {
          if (!cancelled) {
            setTypewriterDone(true);
            markRef.current();
            startCinematic();
          }
        }, 800);
        return;
      }

      lineTimerRef.current = setTimeout(() => advanceLine(next), LINE_DELAY);
    }

    function startCinematic() {
      setAct('heartbeat');
      cinematicTimerRef.current = setTimeout(() => {
        if (cancelled) return;
        setAct('title');
        cinematicTimerRef.current = setTimeout(() => {
          if (cancelled) return;
          setAct('portal');
          cinematicTimerRef.current = setTimeout(() => {
            if (cancelled) return;
            setExploding(true);
            setAct('exploding');
          }, PORTAL_DELAY);
        }, TITLE_DURATION);
      }, 2500);
    }

    lineTimerRef.current = setTimeout(() => advanceLine(0), 500);

    return () => {
      cancelled = true;
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      if (cinematicTimerRef.current) clearTimeout(cinematicTimerRef.current);
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
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#14101E] to-warm-dark-mid overflow-hidden"
      onClick={() => markRef.current()}
      onTouchStart={() => markRef.current()}
    >
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <ReactiveParticles countDesktop={30} countMobile={15} />
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <AnimatePresence mode="wait">
        {act === 'typewriter' && (
          <motion.div
            key="typewriter"
            className="relative z-20 flex flex-col items-center px-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div layout className="text-center space-y-1.5 max-w-xs mx-auto">
              {lines.map((line, i) => {
                if (i >= visibleLines) return null;
                const isSpecial = line.startsWith('-');
                const distanceFromLatest = visibleLines - 1 - i;
                const fadeOpacity = Math.max(0.35, 1 - distanceFromLatest * 0.22);
                return (
                  <motion.p
                    layout
                    key={i}
                    className={`${
                      isSpecial
                        ? 'text-cream-dark/15 text-[11px] tracking-[0.3em]'
                        : 'font-body text-cream/70 text-sm sm:text-base leading-relaxed'
                    }`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: fadeOpacity, y: 0, scale: 1 }}
                    transition={{
                      opacity: { duration: 0.4 },
                      y: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      layout: { type: 'spring', stiffness: 200, damping: 35 },
                    }}
                  >
                    {isSpecial ? '· · ·' : line}
                  </motion.p>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {act === 'heartbeat' && (
          <motion.div
            key="heartbeat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
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
