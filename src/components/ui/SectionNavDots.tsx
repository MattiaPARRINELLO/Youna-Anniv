import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'memories', label: 'Memoires' },
  { id: 'openwhen', label: 'Lettres' },
  { id: 'counter', label: 'Compteur' },
  { id: 'ending', label: 'Fin' },
];

export function SectionNavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowH = window.innerHeight;
      let current = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowH * 0.5) {
            current = i;
          }
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-60 hidden sm:flex flex-col items-center gap-3">
      {SECTIONS.map((section, i) => (
        <motion.button
          key={section.id}
          className={`rounded-full transition-all duration-300 cursor-pointer ${
            i === active
              ? 'w-2.5 h-2.5 bg-gold shadow-[0_0_6px_rgba(212,175,55,0.5)]'
              : 'w-2 h-2 bg-cream-dark/20 hover:bg-cream-dark/40'
          }`}
          onClick={() => scrollTo(section.id)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          aria-label={section.label}
        />
      ))}
    </div>
  );
}
