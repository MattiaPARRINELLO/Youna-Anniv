import { useState, useEffect } from 'react';

const PHOTO_SECTIONS = [
  { top: 0, bottom: 0.6 },
  { top: 0.09, bottom: 0.25 },
  { top: 0.25, bottom: 0.4 },
  { top: 0.4, bottom: 0.65 },
  { top: 0.65, bottom: 0.78 },
  { top: 0.78, bottom: 1 },
];

export function GrainOverlay() {
  const [opacity, setOpacity] = useState(0.04);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      let baseOpacity = 0.04;
      for (const section of PHOTO_SECTIONS) {
        if (progress >= section.top && progress < section.bottom) {
          const isPhoto = section.bottom - section.top <= 0.16;
          baseOpacity = isPhoto ? 0.07 : 0.03;
          break;
        }
      }
      setOpacity(baseOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
