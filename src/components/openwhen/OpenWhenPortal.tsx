import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ThemeBackground } from './ThemeBackground';
import type { OpenWhenEntry } from '../../data/openWhen';

interface OpenWhenPortalProps {
  entry: OpenWhenEntry;
  onClose: () => void;
}

export function OpenWhenPortal({ entry, onClose }: OpenWhenPortalProps) {
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount === 0) return;
    const timer = setTimeout(() => setTapCount(0), 800);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleTap = useCallback(() => {
    if (surpriseRevealed || !entry.surprise) return;
    if (entry.surprise.trigger === 'tap_3_times') {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 3) setSurpriseRevealed(true);
    }
  }, [tapCount, surpriseRevealed, entry.surprise]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <ThemeBackground theme={entry.theme} />

      <button
        className="absolute top-6 right-6 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        onClick={onClose}
      >
        <FiX size={20} />
      </button>

      <div className="relative z-10 px-6 max-w-md text-center" onClick={handleTap}>
        <motion.span
          className="text-4xl sm:text-5xl block mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {entry.emoji}
        </motion.span>

        <motion.h2
          className="font-serif text-cream text-2xl sm:text-3xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {entry.title}
        </motion.h2>

        <motion.p
          className="font-body text-cream/70 text-sm sm:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {entry.message}
        </motion.p>

        <AnimatePresence>
          {surpriseRevealed && entry.surprise && entry.surprise.type === 'hidden_message' && (
            <motion.div
              className="mt-8 p-4 glass rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="font-handwritten text-gold-light text-lg sm:text-xl">
                {entry.surprise.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {entry.surprise && !surpriseRevealed && entry.surprise.trigger === 'tap_3_times' && (
          <motion.p
            className="text-cream-dark/15 text-xs mt-8 font-body"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, delay: 3, repeat: Infinity }}
          >
            {tapCount > 0 ? `${3 - tapCount}...` : ''}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
