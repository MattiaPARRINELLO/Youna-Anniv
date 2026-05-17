import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GemAnimationProps {
  trigger: boolean;
  message: string;
  onComplete?: () => void;
}

export function GemAnimation({ trigger, message, onComplete }: GemAnimationProps) {
  const [show, setShow] = useState(false);
  const prevTrigger = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      setShow(true);
    }
    prevTrigger.current = trigger;
  }, [trigger]);

  useEffect(() => {
    if (!show) return;
    timerRef.current = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timerRef.current);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            className="text-6xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            💎
          </motion.span>
          <motion.p
            className="font-handwritten text-gold text-xl mt-4 text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
