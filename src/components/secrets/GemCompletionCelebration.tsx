import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';
import { Fireworks } from './Fireworks';

export function GemCompletionCelebration() {
  const { totalGems } = useSecrets();
  const [phase, setPhase] = useState<'hidden' | 'flash' | 'circle' | 'done'>('hidden');
  const [fireworks, setFireworks] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (totalGems === 7) {
      setPhase('flash');
      setFireworks(true);
      timersRef.current = [
        setTimeout(() => setPhase('circle'), 500),
        setTimeout(() => setPhase('done'), 2500),
        setTimeout(() => { setPhase('hidden'); setFireworks(false); }, 3500),
      ];
      return () => {
        timersRef.current.forEach(clearTimeout);
      };
    }
  }, [totalGems]);

  const gems = Array.from({ length: 7 }, (_, i) => {
    const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
    const radius = 80;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  });

  return (
    <>
      <Fireworks active={fireworks} />
      <AnimatePresence>
        {phase !== 'hidden' && (
          <div className="fixed inset-0 z-[250] pointer-events-none flex items-center justify-center">
            {phase === 'flash' && (
              <motion.div
                className="absolute inset-0 bg-gold/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            {(phase === 'circle' || phase === 'done') && (
              <>
                <motion.div
                  className="absolute inset-0 bg-warm-darkest/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="relative">
                  {gems.map((g, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-3xl"
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: phase === 'done' ? 0 : 1,
                        x: g.x,
                        y: g.y,
                        scale: [0, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        scale: { duration: 0.4, delay: i * 0.08 },
                        opacity: phase === 'done' ? { duration: 0.8 } : { delay: 0.2, duration: 0.3 },
                      }}
                    >
                      {'\uD83D\uDC8E'}
                    </motion.span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
