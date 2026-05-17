import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from './GemAnimation';
import config from '../../config.json';

export function EasterEggs() {
  const [showTimeMessage, setShowTimeMessage] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const appeared = useRef(false);
  const { gem4, unlockGem } = useSecrets();

  useEffect(() => {
    if (appeared.current || gem4) return;
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) {
      const timer = setTimeout(() => {
        setShowTimeMessage(true);
        appeared.current = true;
        unlockGem(4);
        setShowGem(true);
        setTimeout(() => setShowTimeMessage(false), 5000);
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [gem4, unlockGem]);

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
              il est tard... tu devrais dormir, mon amour 🌙
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.nightGemMessage}
        onComplete={() => setShowGem(false)}
      />
    </>
  );
}
