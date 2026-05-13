import { motion } from 'framer-motion';

interface DynamicVignetteProps {
  intensity: number;
}

export function DynamicVignette({ intensity }: DynamicVignetteProps) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[5]"
      animate={{ opacity: intensity }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      style={{
        background: `radial-gradient(ellipse at center, transparent 50%, rgba(30,26,36,0.8) 100%)`,
      }}
    />
  );
}
