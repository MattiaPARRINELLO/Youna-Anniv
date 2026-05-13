import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSectionVisibility } from '../../hooks/useSectionVisibility';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { opacity, scale } = useSectionVisibility(ref as React.RefObject<HTMLElement | null>);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{ opacity, scale }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
