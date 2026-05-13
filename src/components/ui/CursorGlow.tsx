import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function CursorGlow() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile || prefersReduced) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [isMobile, prefersReduced]);

  if (isMobile || prefersReduced) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[1]"
      animate={{ x: pos.x - 150, y: pos.y - 150 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
      style={{
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }}
    />
  );
}
