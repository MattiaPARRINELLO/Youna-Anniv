import { motion } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

interface StatsBilanProps {
  onComplete: () => void;
}

export function StatsBilan({ onComplete }: StatsBilanProps) {
  const { getFoundCount, gem4, getSessionDuration } = useSecrets();
  const foundCount = getFoundCount();
  const duration = getSessionDuration();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const stats = [
    { icon: '\uD83D\uDC8E', text: `Tu as trouve ${foundCount} secret${foundCount > 1 ? 's' : ''} sur 5`, show: true },
    { icon: '\u23F1\uFE0F', text: `Tu as passe ${minutes > 0 ? `${minutes} min et ` : ''}${seconds} secondes a explorer`, show: true },
    { icon: '\uD83C\uDF19', text: 'Tu es venue un soir, tard...', show: gem4 },
  ].filter(s => s.show);

  return (
    <motion.div
      className="relative z-10 text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <div className="flex flex-col items-center gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.text}
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
