import { motion } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';
import { useEffect, useRef, useCallback } from 'react';

interface StatsBilanProps {
  onComplete: () => void;
}

function getVisitCount(): number {
  try {
    return parseInt(localStorage.getItem('youyou_visit_count') || '1', 10);
  } catch {
    return 1;
  }
}

export function StatsBilan({ onComplete }: StatsBilanProps) {
  const { getFoundCount, gem4, getSessionDuration } = useSecrets();
  const calledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const foundCount = getFoundCount();
  const duration = getSessionDuration();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const visitCount = getVisitCount();

  const durationText = minutes > 0
    ? `Tu as passe ${minutes} min${seconds > 0 ? ` et ${seconds} secondes` : ''} a explorer`
    : `Tu as passe ${seconds} secondes a explorer`;

  const visitText = visitCount === 1
    ? "C'est ta premiere visite..."
    : `C'est ta ${visitCount}e visite...`;

  const stats = [
    { icon: '\uD83D\uDC8E', text: `Tu as trouve ${foundCount} secret${foundCount > 1 ? 's' : ''} sur 5`, show: true },
    { icon: '\u23F1\uFE0F', text: durationText, show: true },
    { icon: '\u2661', text: visitText, show: true },
    { icon: '\uD83C\uDF19', text: 'Tu es venue un soir, tard...', show: gem4 },
  ].filter(s => s.show);

  const triggerComplete = useCallback(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onComplete, 1500);
  }, [onComplete]);

  const handleLastComplete = () => {
    triggerComplete();
  };

  useEffect(() => {
    const maxDelay = (0.3 + (stats.length - 1) * 0.5 + 0.5) * 1000 + 3000;
    const fallback = setTimeout(triggerComplete, maxDelay);
    return () => {
      clearTimeout(fallback);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerComplete, stats.length]);

  return (
    <motion.div
      className="relative z-10 text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        {stats.map((stat, i) => {
          const isLast = i === stats.length - 1;
          return (
            <motion.div
              key={i}
              className="glass rounded-2xl px-6 py-3 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
              onAnimationComplete={isLast ? handleLastComplete : undefined}
            >
              <span className="text-xl">{stat.icon}</span>
              <span className="font-body text-cream/60 text-sm">{stat.text}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
