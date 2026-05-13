import { type ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}
