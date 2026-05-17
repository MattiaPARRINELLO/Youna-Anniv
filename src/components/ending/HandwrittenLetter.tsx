import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HandwrittenLetterProps {
  text: string;
  onComplete: () => void;
}

const CHAR_SPEED = 50;

export function HandwrittenLetter({ text, onComplete }: HandwrittenLetterProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipped) {
      setDisplayedChars(text.length);
      setIsComplete(true);
      return;
    }

    if (displayedChars >= text.length) {
      setIsComplete(true);
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDisplayedChars(prev => Math.min(prev + 1, text.length));
    }, CHAR_SPEED);

    return () => clearTimeout(timer);
  }, [displayedChars, text.length, skipped, onComplete]);

  const handleSkip = useCallback(() => {
    setSkipped(true);
  }, []);

  const displayedText = text.slice(0, displayedChars);

  return (
    <motion.div
      ref={containerRef}
      className="relative z-10 w-full max-w-md mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleSkip}
    >
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(30,26,36,0.8), rgba(20,16,30,0.9))',
          border: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <p
          className="font-handwritten text-cream/80 text-lg sm:text-xl leading-relaxed whitespace-pre-line"
          style={{ minHeight: 100 }}
        >
          {displayedText}
          {!isComplete && (
            <motion.span
              className="inline-block w-0.5 h-5 bg-gold ml-0.5 align-text-bottom"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </p>
      </div>

      {!isComplete && (
        <p className="text-cream-dark/15 text-[10px] text-center mt-3 font-body">
          tap pour tout reveler
        </p>
      )}

      {isComplete && !skipped && (
        <motion.p
          className="text-cream-dark/10 text-[10px] text-center mt-3 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          --
        </motion.p>
      )}
    </motion.div>
  );
}
