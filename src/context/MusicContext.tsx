import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { trackEvent } from '../utils/tracker';

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  hasInteracted: boolean;
  musicError: boolean;
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
  const [musicError, setMusicError] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/your-song.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('error', () => setMusicError(true));

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
      audio.play().then(() => {
        setIsPlaying(true);
        trackEvent('music_play');
      }).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      trackEvent('music_pause');
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  }, []);

  const markInteraction = useCallback(() => {
    if (hasInteracted) return;
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    audio.volume = 0;
    audio.play().then(() => {
      setHasInteracted(true);
      setIsPlaying(true);
      const fadeIn = setInterval(() => {
        if (audio.volume < volume) {
          audio.volume = Math.min(volume, audio.volume + 0.02);
        } else {
          clearInterval(fadeIn);
        }
      }, 120);
    }).catch(() => {});
  }, [volume, hasInteracted]);

  return (
    <MusicContext.Provider value={{ isPlaying, volume, hasInteracted, togglePlay, setVolume, markInteraction, musicError }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
