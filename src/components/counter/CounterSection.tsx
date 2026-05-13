import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { FloatingElements } from '../ui/FloatingElements';

const START_DATE = new Date('2026-03-16');
const START_DATE_STR = '16 mars 2026';

function useTimeSince() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = useMemo(() => {
    const ms = now.getTime() - START_DATE.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }, [now]);

  return diff;
}

export function CounterSection() {
  const { days, hours, minutes, seconds } = useTimeSince();

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FloatingElements type="heart" countDesktop={5} countMobile={2} />

      <FadeInOnScroll className="text-center px-6">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-6 font-body">depuis le {START_DATE_STR}</p>

        <motion.div
          className="flex flex-col items-center gap-2 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="font-serif text-gold text-7xl sm:text-8xl md:text-9xl tabular-nums"
            key={days}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {days.toLocaleString()}
          </motion.span>
          <span className="font-handwritten text-gold-light/60 text-2xl sm:text-3xl">jours ensemble</span>
        </motion.div>

        <div className="flex justify-center gap-4 sm:gap-6 mb-8">
          <div className="text-center">
            <span className="font-serif text-cream/60 text-lg sm:text-xl md:text-2xl tabular-nums block">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-cream-dark/30 text-[10px] uppercase tracking-wider font-body">heures</span>
          </div>
          <span className="text-cream-dark/10 text-2xl self-start mt-1">:</span>
          <div className="text-center">
            <span className="font-serif text-cream/60 text-lg sm:text-xl md:text-2xl tabular-nums block">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-cream-dark/30 text-[10px] uppercase tracking-wider font-body">minutes</span>
          </div>
          <span className="text-cream-dark/10 text-2xl self-start mt-1">:</span>
          <div className="text-center">
            <span className="font-serif text-cream/60 text-lg sm:text-xl md:text-2xl tabular-nums block">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-cream-dark/30 text-[10px] uppercase tracking-wider font-body">secondes</span>
          </div>
        </div>

        <p className="font-handwritten text-gold-light/40 text-xl sm:text-2xl mt-4">
          ...et chaque seconde compte
        </p>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
