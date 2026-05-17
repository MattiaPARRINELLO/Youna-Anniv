import useSound from 'use-sound';
import config from '../config.json';

export function useSfx() {
  const [playExplosion] = useSound(config.sfx.portalExplosion, { volume: 0.5 });
  const [playGemFound] = useSound(config.sfx.gemFound, { volume: 0.6 });
  const [playTypewriter] = useSound(config.sfx.typewriter, { volume: 0.3, sprite: undefined, playbackRate: 1.5 });
  const [playPenWriting] = useSound(config.sfx.penWriting, { volume: 0.4 });
  const [playStarCatch] = useSound(config.sfx.starCatch, { volume: 0.5 });

  return {
    playExplosion,
    playGemFound,
    playTypewriter,
    playPenWriting,
    playStarCatch,
  };
}
