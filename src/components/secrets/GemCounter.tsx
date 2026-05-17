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
      const hide = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(hide);
    }
  }, [found]);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const show = () => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 5000);
    };

    window.addEventListener('scroll', show, { once: true });
    const showTimer = setTimeout(show, 8000);

    return () => {
      window.removeEventListener('scroll', show);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[155] glass rounded-full px-4 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-base">💎</span>
          <span className="text-gold font-serif text-lg">{found}</span>
          <span className="text-cream-dark/30">/ 5</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
