import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { trackEvent } from '../../utils/tracker';
import { GemAnimation } from './GemAnimation';
import config from '../../config.json';

export function EasterEggs() {
  const [showTimeMessage, setShowTimeMessage] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const appeared = useRef(false);
  const { gem4, unlockGem } = useSecrets();

  useEffect(() => {
    if (appeared.current || gem4) return;
    const outerTimer = setTimeout(() => {
      setShowTimeMessage(true);
      trackEvent('gem_4', '2 minutes sur le site');
      unlockGem(4);
      setShowGem(true);
      appeared.current = true;
    }, 120000);
    return () => clearTimeout(outerTimer);
  }, [gem4, unlockGem]);

  useEffect(() => {
    if (!showTimeMessage) return;
    const t = setTimeout(() => setShowTimeMessage(false), 30000);
    return () => clearTimeout(t);
  }, [showTimeMessage]);

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
              tu es la depuis 2 minutes... merci d'être là 🩷
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
