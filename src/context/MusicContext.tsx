import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  hasInteracted: boolean;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  markInteraction: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/your-song.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  }, []);

  const markInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.volume = 0;
        audio.play().then(() => {
          const fadeIn = setInterval(() => {
            if (audio.volume < volume) {
              audio.volume = Math.min(volume, audio.volume + 0.02);
            } else {
              clearInterval(fadeIn);
            }
          }, 120);
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [hasInteracted, volume]);

  return (
    <MusicContext.Provider value={{ isPlaying, volume, hasInteracted, togglePlay, setVolume, markInteraction }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
