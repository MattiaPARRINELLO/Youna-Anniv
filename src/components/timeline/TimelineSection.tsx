import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { TimelineCard } from './TimelineCard';
import { ProgressDots } from './ProgressDots';
import { timelineEvents } from '../../data/timeline';
import { TiltCard } from '../ui/TiltCard';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from '../secrets/GemAnimation';

const SECRET_ORDER = [0, 1, 2, 3, 4];

export function TimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { gem1, unlockGem } = useSecrets();
  const [secretTapOrder, setSecretTapOrder] = useState<number[]>([]);
  const [showGem, setShowGem] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.85;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, timelineEvents.length - 1));
  }, []);

  const handleCardTap = useCallback((index: number) => {
    if (gem1) return;
    setSecretTapOrder(prev => {
      const nextExpected = prev.length;
      if (index === SECRET_ORDER[nextExpected]) {
        const next = [...prev, index];
        if (next.length === 5) {
          unlockGem(1);
          setShowGem(true);
          return [];
        }
        return next;
      }
      return [];
    });
  }, [gem1, unlockGem]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FadeInOnScroll className="text-center mb-10">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">notre histoire</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">La timeline</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">les moments qui comptent</p>
      </FadeInOnScroll>

      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-[7.5vw] w-full no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {timelineEvents.map((event, index) => (
          <TiltCard key={event.id}>
            <TimelineCard
              event={event}
              isActive={index === activeIndex}
              isSecretActive={!gem1 && secretTapOrder.length > 0}
              secretHighlightIndex={SECRET_ORDER[secretTapOrder.length]}
              secretIndex={index}
              onSecretTap={handleCardTap}
            />
          </TiltCard>
        ))}
      </motion.div>

      <ProgressDots total={timelineEvents.length} current={activeIndex} />

      <FadeInOnScroll delay={0.3} className="mt-10">
        <p className="font-handwritten text-cream-dark/30 text-xl text-center">
          ...et ce n&apos;est que le debut
        </p>
      </FadeInOnScroll>
      <FloatingElements type="star" countDesktop={4} countMobile={2} />
      <GemAnimation
        trigger={showGem}
        message="tu connais notre histoire par coeur..."
        onComplete={() => setShowGem(false)}
      />
    </SectionWrapper>
  );
}
