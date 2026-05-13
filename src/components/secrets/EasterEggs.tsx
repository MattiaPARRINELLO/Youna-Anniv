import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingElements } from '../ui/FloatingElements';

const SECRET_MESSAGES = [
  'Tu es la plus belle chose qui me soit arrivee.',
  "Chaque jour, je remercie l'univers de t'avoir mise sur mon chemin.",
  "Ton sourire est ma raison preferee d'etre heureux.",
  'Si je pouvais revivre un seul moment, ce serait celui ou je t\'ai rencontree.',
  'Tu rends le monde plus beau juste en existant.',
];

export function EasterEggs() {
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [showTimeMessage, setShowTimeMessage] = useState(false);
  const appeared = useRef(false);

  useEffect(() => {
    if (appeared.current) return;
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      const timer = setTimeout(() => {
        setShowTimeMessage(true);
        appeared.current = true;
        setTimeout(() => setShowTimeMessage(false), 5000);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const msg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
        setFloatingMessage(msg);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFloatingTap = useCallback(() => {
    const msg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
    setFloatingMessage(msg);
    setTimeout(() => setFloatingMessage(null), 4000);
  }, []);

  return (
    <>
      <FloatingElements type="butterfly" count={3} />
      <motion.button
        className="fixed z-[120] text-2xl opacity-20 hover:opacity-60 transition-opacity cursor-pointer"
        style={{
          right: `${10 + Math.random() * 20}%`,
          bottom: `${15 + Math.random() * 20}%`,
        }}
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleFloatingTap}
      >
        {'\uD83E\uDD8B'}
      </motion.button>

      <AnimatePresence>
        {floatingMessage && (
          <motion.div
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[160] glass rounded-2xl px-6 py-4 max-w-xs"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => setFloatingMessage(null)}
          >
            <p className="font-handwritten text-gold-light text-lg text-center">
              {floatingMessage}
            </p>
            <p className="text-cream-dark/20 text-[9px] text-center mt-2 font-body">tap pour fermer</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTimeMessage && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[160] glass rounded-full px-5 py-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-body text-cream/40 text-[11px] tracking-wide">
              il est tard... tu devrais dormir, mon amour {'\uD83C\uDF19'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
