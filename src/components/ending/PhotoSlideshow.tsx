import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  { image: '/photos/polaroids/memory-1.jpg', caption: '~ 5h du matin ~' },
  { image: '/photos/polaroids/memory-2.jpg', caption: '~ ton rire ~' },
  { image: '/photos/polaroids/memory-5.jpg', caption: '~ attendre que tu rentres ~' },
  { image: '/photos/polaroids/memory-6.jpg', caption: "~ s'endormir ensemble ~" },
  { image: '/photos/polaroids/memory-7.jpg', caption: '~ ta voix avant de dormir ~' },
  { image: '/photos/polaroids/memory-9.jpg', caption: '~ un soir de concert ~' },
  { image: '/photos/polaroids/memory-10.jpg', caption: '~ le 16 mars ~' },
  { image: '/photos/polaroids/memory-12.jpg', caption: '~ nous ~' },
];

export function PhotoSlideshow({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goNext = useCallback(() => {
    setDirection('next');
    setCurrent(prev => {
      const next = prev + 1;
      if (next >= SLIDES.length) {
        setTimeout(onComplete, 800);
        return prev;
      }
      return next;
    });
  }, [onComplete]);

  const goPrev = useCallback(() => {
    if (current === 0) return;
    setDirection('prev');
    setCurrent(prev => prev - 1);
  }, [current]);

  useEffect(() => {
    if (current >= SLIDES.length) return;
    const t = setTimeout(goNext, 4000);
    return () => clearTimeout(t);
  }, [current, goNext]);

  const variants = {
    enter: (dir: 'next' | 'prev') => ({ x: dir === 'next' ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'next' | 'prev') => ({ x: dir === 'next' ? -300 : 300, opacity: 0 }),
  };

  if (current >= SLIDES.length) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-serif text-cream/60 text-lg italic">
          tous ces moments avec toi...
        </p>
      </motion.div>
    );
  }

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 sm:w-80 aspect-[3/4] overflow-hidden rounded-2xl">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={current}
            className="absolute inset-0"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-darkest/60 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-0 right-0 text-center font-handwritten text-cream/70 text-sm">
              {slide.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors text-xl"
          onClick={goPrev}
        >
          ‹
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors text-xl"
          onClick={goNext}
        >
          ›
        </button>

        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                i === current ? 'bg-gold/60' : 'bg-cream-dark/20'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="font-body text-cream-dark/20 text-xs">
        {current + 1} / {SLIDES.length}
      </p>
    </div>
  );
}
