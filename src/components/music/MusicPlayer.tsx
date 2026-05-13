import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '../../context/MusicContext';

export function MusicPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, hasInteracted } = useMusic();
  const [showVolume, setShowVolume] = useState(false);
  const [muted, setMuted] = useState(false);

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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150] glass rounded-full px-4 py-2.5 flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <button
        className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        onClick={togglePlay}
      >
        {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} className="ml-0.5" />}
      </button>

      <span className="text-cream/50 text-[11px] font-body tracking-wide max-w-[120px] truncate">
        notre chanson
      </span>

      <button
        className="text-cream/30 hover:text-cream/60 transition-colors"
        onClick={() => setShowVolume(!showVolume)}
      >
        {muted || volume === 0 ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
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
              className="w-16 h-1 bg-cream-dark/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
