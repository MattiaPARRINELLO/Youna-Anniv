import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowUp } from 'react-icons/fi';
import { ThemeBackground } from './ThemeBackground';
import { useSecrets } from '../../context/SecretContext';
import { trackEvent } from '../../utils/tracker';
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

    if (secretLetter && !letterUsed) {
      const upperLine = line.toUpperCase();
      const upperLetter = secretLetter.toUpperCase();
      if (upperLine.includes(upperLetter)) {
        const idx = upperLine.indexOf(upperLetter);
        letterUsed = true;
        return (
          <p key={i} className="font-body text-cream/80 text-sm sm:text-base leading-relaxed">
            {line.slice(0, idx)}
            <motion.span
              className="text-gold font-bold"
              animate={{ textShadow: ['0 0 8px rgba(212,175,55,0)', '0 0 12px rgba(212,175,55,0.6)', '0 0 8px rgba(212,175,55,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {line.slice(idx, idx + 1)}
            </motion.span>
            {line.slice(idx + 1)}
          </p>
        );
      }
    }

    return (
      <p key={i} className="font-body text-cream/80 text-sm sm:text-base leading-relaxed">
        {line}
      </p>
    );
  });
}

export function OpenWhenPortal({ entry, onClose }: OpenWhenPortalProps) {
  const { markPortalVisited, addRevealedLetter, addPortalSecret, gem3 } = useSecrets();
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const gem3Ref = useRef(gem3);
  gem3Ref.current = gem3;

  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const swipeYRef = useRef(0);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    revealedRef.current = false;
  }, [entry.slug]);

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

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setSurpriseRevealed(true);
    addPortalSecret(entry.slug);
    trackEvent('secret_letter_revealed', entry.title);
  }, [entry.title, addPortalSecret]);

  const handleTap = useCallback(() => {
    if (surpriseRevealed || !entry.surprise) return;
    if (entry.surprise.trigger === 'tap_3_times') {
      const n = tapCount + 1;
      setTapCount(n);
      if (n >= 3) reveal();
    }
  }, [tapCount, surpriseRevealed, entry.surprise, reveal]);

  const isLongPress = entry.surprise?.trigger === 'long_press';
  const isSwipe = entry.surprise?.trigger === 'swipe_up';

  // Direct DOM long press on the emoji (avoids Framer Motion / React event issues)
  useEffect(() => {
    const el = emojiRef.current;
    if (!isLongPress || !el) return;

    const onTouchStart = () => {
      longPressTimer.current = setTimeout(reveal, 800);
    };
    const onEnd = () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchmove', onEnd, { passive: true });
    el.addEventListener('touchcancel', onEnd, { passive: true });
    el.addEventListener('pointerdown', onTouchStart);
    el.addEventListener('pointerup', onEnd);
    el.addEventListener('pointerleave', onEnd);
    el.addEventListener('pointercancel', onEnd);

    el.style.touchAction = 'none';
    el.style.cursor = 'pointer';

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchmove', onEnd);
      el.removeEventListener('touchcancel', onEnd);
      el.removeEventListener('pointerdown', onTouchStart);
      el.removeEventListener('pointerup', onEnd);
      el.removeEventListener('pointerleave', onEnd);
      el.removeEventListener('pointercancel', onEnd);
    };
  }, [isLongPress, reveal]);

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
            ref={emojiRef}
            className="text-5xl sm:text-6xl block mb-6 select-none"
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
            {surpriseRevealed && entry.surprise?.type === 'hidden_message' && (
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

            {surpriseRevealed && entry.surprise?.type === 'photo_reveal' && (
              <motion.div
                className="mt-12 w-full rounded-2xl overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <img
                  src={entry.surprise.content}
                  alt="Photo surprise"
                  className="w-full h-auto object-cover rounded-2xl"
                  loading="lazy"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {entry.surprise && !surpriseRevealed && (
            <motion.p
              className="text-cream-dark/15 text-xs mt-12 font-body select-none"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, delay: 3, repeat: Infinity }}
            >
              {entry.surprise.trigger === 'tap_3_times' && (tapCount > 0 ? `${3 - tapCount}...` : 'tape 3 fois...')}
              {entry.surprise.trigger === 'long_press' && 'reste appuyé...'}
            </motion.p>
          )}

          <div className="h-20" />
        </div>
      </div>

      {isSwipe && !surpriseRevealed && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            swipeYRef.current = e.clientY;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!swipeYRef.current) return;
            if (swipeYRef.current - e.clientY > 80) reveal();
          }}
          onPointerUp={() => { swipeYRef.current = 0; }}
        >
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity }}
          >
            <div className="w-10 h-1 rounded-full bg-cream-dark/20" />
            <FiArrowUp className="text-cream-dark/25 mt-1" size={16} />
            <span className="text-cream-dark/25 text-[10px] font-body">swipe up</span>
          </motion.div>
        </div>
      )}

      <button
        className="absolute top-6 right-6 z-20 w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        onClick={onClose}
      >
        <FiX size={20} />
      </button>
    </motion.div>
  );
}
