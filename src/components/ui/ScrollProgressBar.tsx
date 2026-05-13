import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-[200] origin-left"
      style={{ scaleX, boxShadow: '0 0 8px rgba(212,168,83,0.3), 0 0 20px rgba(212,168,83,0.1)' }}
    />
  );
}
