import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { trackEvent } from '../../utils/tracker';

interface SecretPasswordProps {
  onCorrect: () => void;
  onClose: () => void;
  passwordWord: string;
}

export function SecretPassword({ onCorrect, onClose, passwordWord }: SecretPasswordProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const correctTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const handleKey = useCallback((key: string) => {
    if (error) return;
    const next = input + key;
    setInput(next);
    if (next.length === passwordWord.length) {
      if (next.toUpperCase() === passwordWord.toUpperCase()) {
        correctTimerRef.current = setTimeout(onCorrect, 500);
      } else {
        trackEvent('password_incorrect', next);
        setError(true);
        errorTimerRef.current = setTimeout(() => { setInput(''); setError(false); }, 800);
      }
    }
  }, [input, error, passwordWord, onCorrect]);

  const handleDelete = useCallback(() => {
    if (!error) setInput(prev => prev.slice(0, -1));
  }, [error]);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[220] flex flex-col items-center justify-end pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-warm-darkest/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center gap-4">
        <button className="self-end text-cream-dark/40 hover:text-cream" onClick={onClose}>
          <FiX size={20} />
        </button>

        <p className="font-handwritten text-cream/60 text-center">
          Entre le mot mystere...
        </p>
        <div className="flex gap-2 justify-center">
          {passwordWord.split('').map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center font-serif text-xl
                ${error ? 'border-red-400/50 text-red-400' : 'border-cream-dark/20 text-gold'}
                ${input[i] ? 'bg-cream-dark/10' : 'bg-transparent'}`}
            >
              {input[i] || ''}
            </div>
          ))}
        </div>

        {showHint && (
          <motion.p
            className="font-body text-cream-dark/40 text-xs italic text-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            As-tu remarque les lettres dorees dans chaque message ?
          </motion.p>
        )}

        <div className="grid grid-cols-7 gap-1.5 w-full">
          {letters.map((l) => (
            <button
              key={l}
              className="w-10 h-10 rounded-lg glass text-cream/60 text-sm font-body active:bg-gold/20 active:text-gold transition-colors"
              onClick={() => handleKey(l)}
            >
              {l}
            </button>
          ))}
          <button
            className="col-span-2 w-full h-10 rounded-lg glass text-cream/40 text-xs font-body"
            onClick={handleDelete}
          >
            effacer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
