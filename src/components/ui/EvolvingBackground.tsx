import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sectionGradients = [
  'from-warm-darkest via-warm-dark to-warm-dark-mid',
  'from-warm-dark-mid via-warm-dark to-warm-dark',
  'from-warm-dark via-warm-dark-mid to-warm-darkest',
  'from-warm-darkest via-[#14101E] to-warm-darkest',
];

export function EvolvingBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(sections).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIndex(idx % sectionGradients.length);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none -z-10"
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${sectionGradients[activeIndex]} transition-all duration-[2s]`} />
    </motion.div>
  );
}
