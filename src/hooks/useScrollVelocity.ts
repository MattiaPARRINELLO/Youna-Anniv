import { useState, useEffect, useRef } from 'react';

interface ScrollVelocity {
  speed: number;
  direction: 'up' | 'down' | 'none';
}

export function useScrollVelocity(): ScrollVelocity {
  const [velocity, setVelocity] = useState<ScrollVelocity>({ speed: 0, direction: 'none' });
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    let lastTime = Date.now();

    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const deltaY = currentY - lastY.current;
      const deltaTime = Math.max(now - lastTime, 1);
      const speed = Math.abs(deltaY) / deltaTime;

      setVelocity({
        speed: Math.min(speed, 5),
        direction: deltaY > 0.5 ? 'down' : deltaY < -0.5 ? 'up' : 'none',
      });

      lastY.current = currentY;
      lastTime = now;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return velocity;
}
