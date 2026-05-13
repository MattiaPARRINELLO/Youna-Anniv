import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function FadeInOnScroll({ children, className = '', delay = 0, direction = 'up' }: FadeInOnScrollProps) {
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
