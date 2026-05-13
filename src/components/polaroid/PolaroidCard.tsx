import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PolaroidCardProps {
  image: string;
  caption: string;
  date: string;
  rotation: number;
  hiddenMessage?: string;
  tapeStyle: 'top' | 'side' | 'both';
}

export function PolaroidCard({
  image,
  caption,
  date,
  rotation,
  hiddenMessage,
  tapeStyle,
}: PolaroidCardProps) {
  const [showHidden, setShowHidden] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = useCallback(() => {
    if (!hiddenMessage) return;
    const timer = setTimeout(() => setShowHidden(true), 600);
    setLongPressTimer(timer);
  }, [hiddenMessage]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  return (
    <motion.div
      className="flex-shrink-0 relative"
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{ scale: 1.02, rotate: rotation * 0.5, zIndex: 10 }}
      transition={{ duration: 0.3 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="bg-cream p-2.5 sm:p-3 shadow-2xl shadow-black/20" style={{ paddingBottom: '2.5rem' }}>
        {(tapeStyle === 'top' || tapeStyle === 'both') && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 tape z-10" />
        )}
        {(tapeStyle === 'side' || tapeStyle === 'both') && (
          <div className="absolute -top-2 right-2 w-4 h-12 tape z-10" />
        )}

        <div className="relative aspect-square w-44 sm:w-56 overflow-hidden bg-cream-dark flex items-center justify-center">
          <img
            src={image}
            alt={caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <AnimatePresence>
            {showHidden && hiddenMessage && (
              <motion.div
                className="absolute inset-0 bg-warm-darkest/90 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHidden(false)}
              >
                <p className="font-body text-cream/80 text-xs leading-relaxed text-center italic">
                  {hiddenMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-handwritten text-warm-dark text-lg sm:text-xl text-center mt-2 leading-tight">
          {caption}
        </p>
        <p className="text-warm-dark/40 text-[10px] text-center font-body mt-0.5">{date}</p>
      </div>

      {hiddenMessage && !showHidden && (
        <p className="text-cream-dark/15 text-[9px] text-center mt-2 font-body">
          appuie longtemps
        </p>
      )}
    </motion.div>
  );
}
