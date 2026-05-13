import { motion, useScroll, useSpring } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 bg-gold z-[200] origin-left ${isMobile ? 'h-[3px]' : 'h-[2px]'}`}
      style={{
        scaleX,
        boxShadow: '0 0 8px rgba(212,168,83,0.3), 0 0 20px rgba(212,168,83,0.1)',
      }}
    />
  );
}
