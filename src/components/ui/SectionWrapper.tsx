import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.section
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      initial={isMobile ? undefined : { opacity: 0, y: 30 }}
      whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
      viewport={isMobile ? undefined : { once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
