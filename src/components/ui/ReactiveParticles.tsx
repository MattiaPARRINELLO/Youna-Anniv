import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollVelocity } from '../../hooks/useScrollVelocity';

interface ReactiveParticlesProps {
  count?: number;
  color?: string;
}

export function ReactiveParticles({ count = 40, color = 'bg-gold-light' }: ReactiveParticlesProps) {
  const { direction } = useScrollVelocity();

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        baseDuration: Math.random() * 20 + 15,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => {
        const goUp = direction === 'down';
        const startY = goUp ? '110vh' : '-10vh';
        const endY = goUp ? '-10vh' : '110vh';

        return (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${color}`}
            style={{ left: `${p.left}%`, width: p.size, height: p.size }}
            initial={{ y: startY, opacity: 0 }}
            animate={{ y: endY, opacity: [0, p.opacity, p.opacity, 0] }}
            transition={{
              duration: p.baseDuration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}
