import { useEffect, useMemo } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface PortalExplosionProps {
  active: boolean;
  onComplete: () => void;
}

export function PortalExplosion({ active, onComplete }: PortalExplosionProps) {
  const controls = useAnimationControls();

  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      scale: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    })),
    []
  );

  useEffect(() => {
    if (active) {
      controls.start('explode').then(() => {
        setTimeout(onComplete, 500);
      });
    }
  }, [active, controls, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1, 0] } : {}}
        transition={{ duration: 1, times: [0, 0.3, 1] }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 sm:w-4 sm:h-4"
          style={{
            left: '50%',
            top: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,1), rgba(212,175,55,0))',
          }}
          variants={{
            explode: {
              x: p.x,
              y: p.y,
              scale: [p.scale, 0],
              opacity: [1, 0],
              rotate: p.rotation,
              transition: { duration: 0.8, delay: p.delay, ease: 'easeOut' },
            },
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={controls}
        />
      ))}
    </motion.div>
  );
}
