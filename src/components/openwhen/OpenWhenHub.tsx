import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PortalCard } from './PortalCard';
import { OpenWhenPortal } from './OpenWhenPortal';
import { openWhenEntries, type OpenWhenEntry } from '../../data/openWhen';
import { FloatingElements } from '../ui/FloatingElements';

export function OpenWhenHub() {
  const [activeEntry, setActiveEntry] = useState<OpenWhenEntry | null>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FadeInOnScroll className="text-center mb-10">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">pour plus tard</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Ouvre quand...</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">des petits mots pour chaque moment</p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.2} className="w-full max-w-lg mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {openWhenEntries.map((entry, i) => (
            <PortalCard
              key={entry.slug}
              emoji={entry.emoji}
              title={entry.title}
              onClick={() => setActiveEntry(entry)}
              delay={0.1 * i}
            />
          ))}
        </div>
      </FadeInOnScroll>

      <AnimatePresence>
        {activeEntry && (
          <OpenWhenPortal
            entry={activeEntry}
            onClose={() => setActiveEntry(null)}
          />
        )}
      </AnimatePresence>
      <FloatingElements type="mixed" count={4} />
    </SectionWrapper>
  );
}
