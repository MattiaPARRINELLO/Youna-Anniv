import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowDown } from 'react-icons/fi';
import { ThemeBackground } from './ThemeBackground';
import { useSecrets } from '../../context/SecretContext';
import type { OpenWhenEntry } from '../../data/openWhen';

interface OpenWhenPortalProps {
  entry: OpenWhenEntry;
  onClose: () => void;
}

function renderMessage(text: string, secretLetter?: string) {
  let letterUsed = false;
  return text.split('\n').map((line, i) => {
    if (line === '') {
      return <div key={i} className="h-4" />;
    }

    if (secretLetter && !letterUsed && line.includes(secretLetter)) {
      const idx = line.indexOf(secretLetter);
      letterUsed = true;
      return (
        <p key={i} className="font-body text-cream/80 text-sm sm:text-base leading-relaxed">
          {line.slice(0, idx)}
          <motion.span
            className="text-gold font-bold"
            animate={{ textShadow: ['0 0 8px rgba(212,175,55,0)', '0 0 12px rgba(212,175,55,0.6)', '0 0 8px rgba(212,175,55,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {secretLetter}
          </motion.span>
          {line.slice(idx + 1)}
        </p>
      );
    }

    return (
      <p key={i} className="font-body text-cream/80 text-sm sm:text-base leading-relaxed">
        {line}
      </p>
    );
  });
}

export function OpenWhenPortal({ entry, onClose }: OpenWhenPortalProps) {
  const { markPortalVisited, addRevealedLetter, gem3 } = useSecrets();
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const gem3Ref = useRef(gem3);
  gem3Ref.current = gem3;

  useEffect(() => {
    if (!gem3Ref.current) {
      markPortalVisited(entry.slug);
      if (entry.secretLetter) addRevealedLetter(entry.secretLetter);
    }
  }, [entry.slug, entry.secretLetter, markPortalVisited, addRevealedLetter]);

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
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <ThemeBackground theme={entry.theme} />

      <div className="relative flex-1 overflow-y-auto no-scrollbar" onClick={handleTap}>
        <div className="min-h-full flex flex-col items-center px-6 py-20 max-w-lg mx-auto">
          <motion.span
            className="text-4xl sm:text-5xl block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {entry.emoji}
          </motion.span>

          <motion.h2
            className="font-serif text-cream text-2xl sm:text-3xl mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {entry.title}
          </motion.h2>

          <motion.div
            className="w-full space-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {renderMessage(entry.message, entry.secretLetter)}
          </motion.div>

          <AnimatePresence>
            {surpriseRevealed && entry.surprise && entry.surprise.type === 'hidden_message' && (
              <motion.div
                className="mt-12 p-6 glass rounded-2xl w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <p className="font-handwritten text-gold-light text-lg sm:text-xl text-center leading-relaxed">
                  {entry.surprise.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {entry.surprise && !surpriseRevealed && entry.surprise.trigger === 'tap_3_times' && (
            <motion.p
              className="text-cream-dark/15 text-xs mt-12 font-body"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, delay: 3, repeat: Infinity }}
            >
              {tapCount > 0 ? `${3 - tapCount}...` : ''}
            </motion.p>
          )}

          <div className="h-20" />
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-cream-dark/20 text-[10px] font-body">defiler</span>
        <FiArrowDown className="text-cream-dark/20" size={14} />
      </motion.div>

      <button
        className="absolute top-6 right-6 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        onClick={onClose}
      >
        <FiX size={20} />
      </button>
    </motion.div>
  );
}
