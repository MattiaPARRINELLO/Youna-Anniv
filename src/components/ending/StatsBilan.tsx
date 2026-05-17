import { motion } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';
import { useEffect, useRef } from 'react';

interface StatsBilanProps {
  onComplete: () => void;
}

export function StatsBilan({ onComplete }: StatsBilanProps) {
  const { getFoundCount, gem4, getSessionDuration } = useSecrets();
  const hasCompleted = useRef(false);
  const foundCount = getFoundCount();
  const duration = getSessionDuration();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const durationText = minutes > 0
    ? `Tu as passe ${minutes} min${seconds > 0 ? ` et ${seconds} secondes` : ''} a explorer`
    : `Tu as passe ${seconds} secondes a explorer`;

  const stats = [
    { icon: '\uD83D\uDC8E', text: `Tu as trouve ${foundCount} secret${foundCount > 1 ? 's' : ''} sur 5`, show: true },
    { icon: '\u23F1\uFE0F', text: durationText, show: true },
    { icon: '\uD83C\uDF19', text: 'Tu es venue un soir, tard...', show: gem4 },
  ].filter(s => s.show);

  const visibleStats = stats.length;

  useEffect(() => {
    if (hasCompleted.current || visibleStats === 0) return;
    hasCompleted.current = true;
    const totalDelay = (0.3 + (visibleStats - 1) * 0.5 + 0.5) * 1000;
    const timer = setTimeout(onComplete, totalDelay);
    return () => clearTimeout(timer);
  }, [visibleStats, onComplete]);

  return (
    <motion.div
      className="relative z-10 text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl px-6 py-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
          >
            <span className="text-xl">{stat.icon}</span>
            <span className="font-body text-cream/60 text-sm">{stat.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
