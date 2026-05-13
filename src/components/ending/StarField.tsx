import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollVelocity } from '../../hooks/useScrollVelocity';

export function StarField() {
  const { speed } = useScrollVelocity();

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        baseDuration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-cream"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: Math.max(s.baseDuration / (1 + speed * 0.3), 0.8),
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
