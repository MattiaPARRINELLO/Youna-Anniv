import { useEffect, useMemo, useRef } from 'react';
import { motion, useAnimationControls, type Variants } from 'framer-motion';

interface PortalExplosionProps {
  active: boolean;
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  delay: number;
  rotation: number;
  type: 'circle' | 'spark';
  color: string;
}

function r(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const GOLD = 'rgba(212,175,55,';
const CREAM = 'rgba(255,248,236,';

export function PortalExplosion({ active, onComplete }: PortalExplosionProps) {
  const controls = useAnimationControls();
  const explodedRef = useRef(false);

  const particles = useMemo<Particle[]>(() => {
    const items: Particle[] = [];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = r(100, 350);
      items.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: r(0.4, 1.8),
        delay: r(0, 0.15),
        rotation: r(0, 360),
        type: 'circle',
        color: Math.random() > 0.3 ? GOLD : CREAM,
      });
    }

    for (let i = 40; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = r(50, 250);
      items.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: r(0.2, 0.8),
        delay: r(0, 0.2),
        rotation: r(0, 180),
        type: 'spark',
        color: GOLD,
      });
    }
    return items;
  }, []);

  const flashVariants: Variants = {
    idle: { opacity: 0 },
    flash: { opacity: [0, 1, 0], transition: { duration: 0.6, times: [0, 0.1, 1] } },
  };

  const glowVariants: Variants = {
    idle: { opacity: 0, width: 60, height: 60, x: '-50%', y: '-50%' },
    glow: {
      opacity: [0, 1, 0],
      width: [60, 500, 600],
      height: [60, 500, 600],
      x: '-50%',
      y: '-50%',
      transition: { duration: 1.2, times: [0, 0.3, 1], ease: 'easeOut' },
    },
  };

  const ringVariants: Variants = {
    idle: { opacity: 0 },
    ring: {
      opacity: [0, 0.7, 0],
      width: [30, 350, 400],
      height: [30, 350, 400],
      marginLeft: [-15, -175, -200],
      marginTop: [-15, -175, -200],
      transition: { duration: 1, delay: 0.1, ease: 'easeOut' },
    },
  };

  useEffect(() => {
    if (!active || explodedRef.current) return;
    explodedRef.current = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    controls.start('explode').then(() => {
      timeoutId = setTimeout(onComplete, 600);
    });
    return () => clearTimeout(timeoutId);
  }, [active, controls, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle, rgba(255,248,236,0.3) 0%, transparent 60%)' }}
        variants={flashVariants}
        initial="idle"
        animate={active ? 'flash' : 'idle'}
      />

      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)',
        }}
        variants={glowVariants}
        initial="idle"
        animate={active ? 'glow' : 'idle'}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          border: '2px solid rgba(212,175,55,0.4)',
        }}
        variants={ringVariants}
        initial="idle"
        animate={active ? 'ring' : 'idle'}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            borderRadius: p.type === 'circle' ? '50%' : '0%',
            background: p.type === 'circle'
              ? `radial-gradient(circle, ${p.color}1), ${p.color}0))`
              : undefined,
          }}
          variants={{
            explode: {
              x: p.x,
              y: p.y,
              scale: [p.scale, 0],
              opacity: [0.9, 0],
              rotate: p.rotation,
              transition: { duration: r(0.8, 1.4), delay: p.delay, ease: 'easeOut' },
            },
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={controls}
        >
          {p.type === 'spark' ? (
            <span
              style={{
                fontSize: `${r(8, 16)}px`,
                color: p.color + '1)',
                filter: 'blur(0.5px)',
              }}
            >
              ✦
            </span>
          ) : (
            <div
              style={{
                width: `${p.scale * 12}px`,
                height: `${p.scale * 12}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${p.color}1), ${p.color}0))`,
              }}
            />
          )}
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={active ? { x: [0, r(-4, 4), r(-3, 3), r(-2, 2), 0], y: [0, r(-3, 3), r(-2, 2), r(-1, 1), 0] } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
