import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PolaroidCard } from './PolaroidCard';
import { polaroids } from '../../data/polaroids';
import { TiltCard } from '../ui/TiltCard';
import { FloatingElements } from '../ui/FloatingElements';
import config from '../../config.json';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from '../secrets/GemAnimation';

export function MemoryGallery({ id }: { id?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { gem2, unlockGem } = useSecrets();
  const [showGem, setShowGem] = useState(false);
  const hotspotIndex = config.secrets.hotspotImageIndex;

  const handleHotspotFound = useCallback(() => {
    if (!gem2) {
      unlockGem(2);
      setShowGem(true);
    }
  }, [gem2, unlockGem]);

  return (
    <SectionWrapper id={id} className="bg-gradient-to-b from-warm-dark to-warm-dark-mid py-20">
      <FadeInOnScroll className="text-center mb-12">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">souvenirs</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Les polaroids</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">des instants voles</p>
      </FadeInOnScroll>

      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-dark/5 to-violet/5 rounded-3xl -m-4" />

        <motion.div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 py-12 no-scrollbar items-center"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {polaroids.map((p, index) => (
            <TiltCard key={p.id}>
              <div className="flex-shrink-0 snap-center py-4 px-2">
                <PolaroidCard
                  image={p.image}
                  caption={p.caption}
                  date={p.date}
                  rotation={p.rotation}
                  hiddenMessage={p.hiddenMessage}
                  tapeStyle={p.tapeStyle}
                  hasHotspot={index === hotspotIndex && !gem2}
                  hotspotX={config.secrets.hotspotX}
                  hotspotY={config.secrets.hotspotY}
                  onHotspotFound={handleHotspotFound}
                  hotspotFound={gem2}
                />
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>

      <p className="text-cream-dark/15 text-xs mt-4 font-body">&larr; glisse pour decouvrir &rarr;</p>
      <FloatingElements type="butterfly" countDesktop={5} countMobile={2} />

      <GemAnimation
        trigger={showGem}
        message={config.secrets.hotspotMessage}
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
