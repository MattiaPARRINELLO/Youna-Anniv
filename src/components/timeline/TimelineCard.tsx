import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent } from '../../data/timeline';

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
  isSecretActive?: boolean;
  secretHighlightIndex?: number;
  secretIndex?: number;
  onSecretTap?: (index: number) => void;
}

export function TimelineCard({ event, isActive, isSecretActive, secretHighlightIndex, secretIndex, onSecretTap }: TimelineCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] max-w-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="bg-cream/5 border border-cream-dark/10 rounded-2xl p-6 backdrop-blur-sm cursor-pointer relative"
        onClick={() => { setRevealed(!revealed); onSecretTap?.(secretIndex!); }}
      >
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-cream-dark/10 to-violet/10 flex items-center justify-center">
          <img
            src={event.photo}
            alt={event.title}
            className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
            loading="lazy"
          />
        </div>
        <p className="font-serif text-gold text-2xl sm:text-3xl mb-1">{event.date.split(' ')[0]}</p>
        <p className="text-violet-light/60 text-xs mb-3 font-body tracking-wide">{event.date.split(' ').slice(1).join(' ')}</p>
        <h3 className="font-serif text-cream text-xl sm:text-2xl mb-1">{event.title}</h3>
        <p className="font-handwritten text-gold-light/70 text-lg mb-4">{event.subtitle}</p>
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-cream-dark/10">
                <p className="font-body text-cream/70 text-sm leading-relaxed italic">{event.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!revealed && (
          <p className="text-cream-dark/20 text-xs mt-4 text-center font-body">tap pour reveler</p>
        )}
        {isSecretActive && secretHighlightIndex === secretIndex && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.1)' }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}
