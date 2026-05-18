import { motion } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

export function GemCounter() {
  const { getFoundCount } = useSecrets();
  const found = getFoundCount();

  const handleScrollToEnd = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[155] flex flex-col items-center gap-1.5">
      <motion.div
        className="glass rounded-full px-4 py-2 flex items-center gap-2"
        animate={found === 5 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={found === 5 ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        <span className={`text-base ${found === 5 ? 'animate-heartbeat' : ''}`}>
          {'\uD83D\uDC8E'}
        </span>
        <span className="text-gold font-serif text-lg">{found}</span>
        <span className="text-cream-dark/30">/ 5</span>
      </motion.div>

      {found === 4 && (
        <motion.button
          className="text-gold/50 text-[10px] font-body hover:text-gold transition-colors underline underline-offset-2 decoration-gold/20"
          onClick={handleScrollToEnd}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          un dernier secret...
        </motion.button>
      )}
    </div>
  );
}
