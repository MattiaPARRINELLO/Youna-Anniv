import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

export function GemCounter() {
  const { getFoundCount } = useSecrets();
  const found = getFoundCount();
  const [visible, setVisible] = useState(false);
  const lastFoundRef = useRef(found);

  useEffect(() => {
    if (found > lastFoundRef.current) {
      lastFoundRef.current = found;
      setVisible(true);
      if (found === 0) {
        const hide = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(hide);
      }
    }
  }, [found]);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const show = () => {
      setVisible(true);
      if (lastFoundRef.current === 0) {
        hideTimer = setTimeout(() => setVisible(false), 5000);
      }
    };

    window.addEventListener('scroll', show, { once: true });
    const showTimer = setTimeout(show, 4000);

    return () => {
      window.removeEventListener('scroll', show);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleScrollToEnd = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[155] flex flex-col items-center gap-1.5">
          <motion.div
            className="glass rounded-full px-4 py-2 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-base">💎</span>
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
      )}
    </AnimatePresence>
  );
}
