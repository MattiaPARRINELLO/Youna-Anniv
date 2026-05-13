import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { OpenWhenTheme } from '../../data/openWhen';

function RainEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 0.5 + 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <motion.div
          key={d.id}
          className="absolute w-px bg-violet-light/20"
          style={{ left: `${d.left}%`, height: 20 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 0.6, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-gold-light"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function GoldenParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 4 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 15, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

const themeConfigs: Record<OpenWhenTheme, {
  bg: string;
  component: React.FC;
}> = {
  rain: {
    bg: 'from-warm-darkest via-[#1a1a2e] to-warm-darkest',
    component: RainEffect,
  },
  stars: {
    bg: 'from-warm-darkest via-[#0d0d1a] to-warm-darkest',
    component: StarField,
  },
  sunset: {
    bg: 'from-[#2d1b2e] via-[#3d2b3e] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{ background: 'linear-gradient(to top, rgba(212,168,83,0.15), rgba(123,107,138,0.05), transparent)' }}
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  night: {
    bg: 'from-[#0a0a14] via-[#0f0f1e] to-warm-darkest',
    component: StarField,
  },
  cozy: {
    bg: 'from-warm-darkest via-[#2a1a24] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  waves: {
    bg: 'from-[#1a2a3a] via-warm-dark to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: `linear-gradient(to top, rgba(123,107,138,${0.05 + i * 0.02}), transparent)` }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}
      </div>
    ),
  },
  aurora: {
    bg: 'from-[#1a1228] via-[#221a38] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/3"
          style={{ background: 'linear-gradient(to bottom, rgba(155,138,170,0.15), rgba(123,107,138,0.05), transparent)' }}
          animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  golden: {
    bg: 'from-warm-darkest via-warm-dark to-warm-darkest',
    component: GoldenParticles,
  },
};

export function ThemeBackground({ theme }: { theme: OpenWhenTheme }) {
  const config = themeConfigs[theme];
  const Component = config.component;

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-b ${config.bg}`} />
      <Component />
    </>
  );
}
