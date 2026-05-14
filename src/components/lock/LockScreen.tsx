import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingElements } from "../ui/FloatingElements";
import config from "../../config.json";

const TARGET = new Date(config.dates.unlock);

interface LockScreenProps {
  onUnlock: () => void;
}

function useCountdown() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    const diff = TARGET.getTime() - now.getTime();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }, [now]);

  return countdown;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const countdown = useCountdown();

  useEffect(() => {
    if (countdown === null) {
      onUnlock();
    }
  }, [countdown, onUnlock]);

  return (
    <AnimatePresence>
      {countdown && (
        <motion.div
          className="fixed inset-0 z-[999] bg-warm-darkest flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#14101E] to-warm-darkest" />
          <FloatingElements type="star" countDesktop={8} countMobile={4} />

          <div className="relative z-10 text-center px-6">
            <motion.p
              className="text-gold/30 text-xs tracking-[0.3em] uppercase mb-8 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              quelque chose arrive
            </motion.p>

            <motion.p
              className="font-serif italic text-gold/60 text-lg sm:text-xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
            >
              le 23 mai
            </motion.p>

            <div className="flex justify-center gap-3 sm:gap-5 mb-10">
              <div className="text-center">
                <motion.span
                  className="font-serif text-gold text-4xl sm:text-5xl md:text-6xl tabular-nums block"
                  key={countdown.days}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(countdown.days).padStart(2, "0")}
                </motion.span>
                <span className="text-cream-dark/25 text-[10px] sm:text-xs uppercase tracking-wider font-body">
                  jours
                </span>
              </div>
              <span className="text-cream-dark/10 text-3xl sm:text-4xl self-start mt-2">
                :
              </span>
              <div className="text-center">
                <motion.span
                  className="font-serif text-gold text-4xl sm:text-5xl md:text-6xl tabular-nums block"
                  key={countdown.hours}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(countdown.hours).padStart(2, "0")}
                </motion.span>
                <span className="text-cream-dark/25 text-[10px] sm:text-xs uppercase tracking-wider font-body">
                  heures
                </span>
              </div>
              <span className="text-cream-dark/10 text-3xl sm:text-4xl self-start mt-2">
                :
              </span>
              <div className="text-center">
                <motion.span
                  className="font-serif text-gold text-4xl sm:text-5xl md:text-6xl tabular-nums block"
                  key={countdown.minutes}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(countdown.minutes).padStart(2, "0")}
                </motion.span>
                <span className="text-cream-dark/25 text-[10px] sm:text-xs uppercase tracking-wider font-body">
                  minutes
                </span>
              </div>
              <span className="text-cream-dark/10 text-3xl sm:text-4xl self-start mt-2">
                :
              </span>
              <div className="text-center">
                <motion.span
                  className="font-serif text-gold text-4xl sm:text-5xl md:text-6xl tabular-nums block"
                  key={countdown.seconds}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(countdown.seconds).padStart(2, "0")}
                </motion.span>
                <span className="text-cream-dark/25 text-[10px] sm:text-xs uppercase tracking-wider font-body">
                  secondes
                </span>
              </div>
            </div>

            <motion.p
              className="font-handwritten text-gold-light/40 text-lg sm:text-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              patience, mon amour...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
