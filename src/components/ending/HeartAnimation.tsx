import { motion } from 'framer-motion';

interface HeartAnimationProps {
  show: boolean;
}

export function HeartAnimation({ show }: HeartAnimationProps) {
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, scale: 0 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <span className="text-3xl sm:text-4xl animate-heartbeat inline-block">{'\u2764\uFE0F'}</span>
    </motion.div>
  );
}
