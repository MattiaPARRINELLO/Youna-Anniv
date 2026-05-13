import { lazy, Suspense, useEffect } from 'react';
import { useMusic } from './context/MusicContext';
import { GrainOverlay } from './components/ui/GrainOverlay';
import { IntroScene } from './components/intro/IntroScene';
import { TimelineSection } from './components/timeline/TimelineSection';
import { MemoryGallery } from './components/polaroid/MemoryGallery';
import { OpenWhenHub } from './components/openwhen/OpenWhenHub';
import { MusicPlayer } from './components/music/MusicPlayer';
import { EasterEggs } from './components/secrets/EasterEggs';

const MapSection = lazy(() =>
  import('./components/map/MapSection').then((m) => ({ default: m.MapSection }))
);
const EndingScene = lazy(() =>
  import('./components/ending/EndingScene').then((m) => ({ default: m.EndingScene }))
);

function ScrollInteractionCatcher() {
  const { markInteraction } = useMusic();

  useEffect(() => {
    const handler = () => markInteraction();
    window.addEventListener('scroll', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [markInteraction]);

  return null;
}

function SectionFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-dark">
      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative bg-warm-darkest text-cream font-body overflow-x-hidden">
      <GrainOverlay />
      <ScrollInteractionCatcher />

      <IntroScene />
      <TimelineSection />
      <MemoryGallery />
      <OpenWhenHub />

      <Suspense fallback={<SectionFallback />}>
        <MapSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <EndingScene />
      </Suspense>

      <MusicPlayer />
      <EasterEggs />
    </div>
  );
}
