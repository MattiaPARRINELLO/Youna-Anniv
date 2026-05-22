import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '../../context/MusicContext';
import { useSecrets } from '../../context/SecretContext';
import { useVisitCounter } from '../../hooks/useVisitCounter';

export function BottomTaskbar() {
  const { isPlaying, volume, togglePlay, setVolume, hasInteracted } = useMusic();
  const { getFoundCount } = useSecrets();
  const [showVolume, setShowVolume] = useState(false);
  const [muted, setMuted] = useState(false);
  const visitCount = useVisitCounter();

  const found = getFoundCount();

  const handleVolumeToggle = () => {
    if (muted || volume === 0) {
      setVolume(0.5);
      setMuted(false);
    } else {
      setVolume(0);
      setMuted(true);
    }
  };

  if (!hasInteracted) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[150] bg-warm-darkest/80 backdrop-blur-xl border-t border-white/5 px-4 h-11 flex items-center justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2.5">
        <button
          className="w-7 h-7 rounded-md bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
          onClick={togglePlay}
        >
          {isPlaying ? <FiPause size={12} /> : <FiPlay size={12} className="ml-0.5" />}
        </button>

        <span className="text-cream/45 text-[11px] font-body tracking-wide max-w-[100px] truncate">
          notre chanson
        </span>

        <button
          className="text-cream/25 hover:text-cream/50 transition-colors"
          onClick={() => setShowVolume(!showVolume)}
        >
          {muted || volume === 0 ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
        </button>

        <AnimatePresence>
          {showVolume && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="w-14 h-1 bg-cream-dark/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5
                  [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {found < 7 && (
        <div className="flex items-center gap-2">
          <span className="text-xs">{'\uD83D\uDC8E'}</span>
          <span className="text-gold font-serif text-sm">{found}</span>
          <span className="text-cream-dark/30 text-xs">/ 7</span>
        </div>
      )}

      {visitCount > 0 && (
        <div className="flex items-center gap-1 ml-1">
          <span className="text-cream-dark/20 text-[10px] font-body">{'\u2661'} {visitCount}</span>
        </div>
      )}
    </motion.div>
  );
}
