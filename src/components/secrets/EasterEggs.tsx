import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingElements } from '../ui/FloatingElements';

export function EasterEggs() {
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

  return (
    <>
      <FloatingElements type="butterfly" countDesktop={3} countMobile={1} />

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
