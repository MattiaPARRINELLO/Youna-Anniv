import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PolaroidCard } from './PolaroidCard';
import { polaroids } from '../../data/polaroids';
import { TiltCard } from '../ui/TiltCard';
import { FloatingElements } from '../ui/FloatingElements';

export function MemoryGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark to-warm-dark-mid py-20">
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
          {polaroids.map((p) => (
            <TiltCard key={p.id}>
              <div className="flex-shrink-0 snap-center py-4 px-2">
                <PolaroidCard
                  image={p.image}
                  caption={p.caption}
                  date={p.date}
                  rotation={p.rotation}
                  hiddenMessage={p.hiddenMessage}
                  tapeStyle={p.tapeStyle}
                />
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>

      <p className="text-cream-dark/15 text-xs mt-4 font-body">&larr; glisse pour decouvrir &rarr;</p>
      <FloatingElements type="butterfly" count={5} />
    </SectionWrapper>
  );
}
