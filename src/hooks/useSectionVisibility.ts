import { useState, useEffect, useRef, type RefObject } from 'react';

interface SectionVisibility {
  opacity: number;
  scale: number;
}

export function useSectionVisibility(
  ref: RefObject<HTMLElement | null>,
): SectionVisibility {
  const [visibility, setVisibility] = useState<SectionVisibility>({ opacity: 1, scale: 1 });

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.top < windowH * 0.3 && rect.bottom > windowH * 0.3) {
        setVisibility({ opacity: 1, scale: 1 });
        return;
      }

      if (rect.top < windowH && rect.top > 0) {
        const progress = rect.top / windowH;
        setVisibility({ opacity: 1 - progress, scale: 0.95 + progress * 0.05 });
        return;
      }

      if (rect.bottom < windowH && rect.bottom > 0) {
        const progress = rect.bottom / windowH;
        setVisibility({ opacity: progress, scale: 0.95 + progress * 0.05 });
        return;
      }

      setVisibility({ opacity: 0.5, scale: 0.95 });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return visibility;
}
