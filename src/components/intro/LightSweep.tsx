import { motion } from 'framer-motion';

interface LightSweepProps {
  children: React.ReactNode;
  delay?: number;
}

export function LightSweep({ children, delay = 0 }: LightSweepProps) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 50%, transparent 100%)',
          opacity: 0,
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ delay: delay + 0.3, duration: 1.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
