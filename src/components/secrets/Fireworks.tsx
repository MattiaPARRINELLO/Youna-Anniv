import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'heart' | 'star';
}

const COLORS = [
  '#FF69B4', '#D4AF37', '#8A2BE2', '#00BFFF',
  '#FFA500', '#FF1493', '#9370DB', '#FFD700',
  '#FF6B6B', '#48D1CC', '#FF4500', '#7B68EE',
];

const SHAPES: ('circle' | 'heart' | 'star')[] = ['circle', 'heart', 'star'];

function generateBurst(originX: number, originY: number, count: number, delay: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + delay * 1000,
    x: originX,
    y: originY,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 3 + Math.random() * 5,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3,
    distance: 60 + Math.random() * 120,
    duration: 1.2 + Math.random() * 0.8,
    delay,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));
}

const BURSTS = [
  { x: 30, y: 40, count: 20, time: 0 },
  { x: 70, y: 30, count: 24, time: 0.3 },
  { x: 50, y: 45, count: 28, time: 0.6 },
  { x: 20, y: 55, count: 18, time: 0.9 },
  { x: 80, y: 50, count: 22, time: 1.2 },
  { x: 40, y: 35, count: 16, time: 1.5 },
  { x: 60, y: 55, count: 20, time: 1.8 },
  { x: 50, y: 30, count: 30, time: 2.1 },
];

export function Fireworks({ active }: { active: boolean }) {
  const particles = useMemo(() => {
    if (!active) return [];
    return BURSTS.flatMap(burst =>
      generateBurst(burst.x, burst.y, burst.count, burst.time)
    );
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[251] pointer-events-none overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance - 20,
                scale: [0, 1.2, 1, 0.3],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
            >
              {p.shape === 'circle' && (
                <div
                  className="rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  }}
                />
              )}
              {p.shape === 'heart' && (
                <span style={{ fontSize: p.size + 6, color: p.color, filter: `drop-shadow(0 0 4px ${p.color})` }}>
                  ♥
                </span>
              )}
              {p.shape === 'star' && (
                <span style={{ fontSize: p.size + 4, color: p.color, filter: `drop-shadow(0 0 4px ${p.color})` }}>
                  ✦
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
