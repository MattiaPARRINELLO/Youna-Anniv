import { motion } from 'framer-motion';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current ? 20 : 6,
            height: 6,
            backgroundColor: i === current ? '#D4A853' : 'rgba(255,248,236,0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
