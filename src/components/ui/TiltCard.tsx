import { useState, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className = '', maxTilt = 5 }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shadow, setShadow] = useState('0 4px 20px rgba(0,0,0,0.2)');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -y * maxTilt, y: x * maxTilt });
      setShadow(
        `${-x * 10}px ${-y * 10}px 30px rgba(0,0,0,0.25), ${x * 10}px ${y * 10}px 20px rgba(212,168,83,0.05)`
      );
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setShadow('0 4px 20px rgba(0,0,0,0.2)');
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ boxShadow: shadow, borderRadius: 'inherit', transition: 'box-shadow 0.2s ease' }}>
        {children}
      </div>
    </motion.div>
  );
}
