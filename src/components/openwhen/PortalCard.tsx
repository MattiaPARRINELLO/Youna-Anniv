import { motion } from 'framer-motion';
import { TiltCard } from '../ui/TiltCard';

interface PortalCardProps {
  emoji: string;
  title: string;
  onClick: () => void;
  delay: number;
  hasSecret?: boolean;
}

export function PortalCard({ emoji, title, onClick, delay, hasSecret }: PortalCardProps) {
  return (
    <TiltCard>
      <motion.button
        className="glass rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer w-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.03, borderColor: 'rgba(212,168,83,0.3)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
      >
        <motion.span
          className="text-2xl sm:text-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.span>
        <span className="font-body text-cream/80 text-xs sm:text-sm leading-tight text-balance">
          {title}
        </span>
        {hasSecret && (
          <span className="absolute top-3 right-3 rounded-full"
            style={{ width: 1, height: 1, background: 'rgba(212,175,55,0.04)' }}
          />
        )}
      </motion.button>
    </TiltCard>
  );
}
