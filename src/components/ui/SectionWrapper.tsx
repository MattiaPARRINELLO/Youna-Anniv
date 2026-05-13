import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSectionVisibility } from '../../hooks/useSectionVisibility';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ref = useRef<HTMLElement | null>(null);
  const { opacity, scale } = useSectionVisibility(ref as React.RefObject<HTMLElement | null>);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={isMobile ? undefined : { opacity, scale }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
