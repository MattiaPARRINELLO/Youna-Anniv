import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "./context/MusicContext";
import { SecretProvider, useSecrets } from "./context/SecretContext";
import { GrainOverlay } from "./components/ui/GrainOverlay";
import { ScrollProgressBar } from "./components/ui/ScrollProgressBar";
import { DynamicVignette } from "./components/ui/DynamicVignette";
import { CursorGlow } from "./components/ui/CursorGlow";
import { AmbientGlow } from "./components/ui/AmbientGlow";
import { EvolvingBackground } from "./components/ui/EvolvingBackground";
import { IntroScene } from "./components/intro/IntroScene";
import { TimelineSection } from "./components/timeline/TimelineSection";
import { MemoryGallery } from "./components/polaroid/MemoryGallery";
import { OpenWhenHub } from "./components/openwhen/OpenWhenHub";
import { CounterSection } from "./components/counter/CounterSection";
import { MusicPlayer } from "./components/music/MusicPlayer";
import { EasterEggs } from "./components/secrets/EasterEggs";
import { GemCounter } from "./components/secrets/GemCounter";
import { LockScreen } from "./components/lock/LockScreen";
import config from "./config.json";

{
  /* MapSection cachee — a reactiver: decommenter l'import ci-dessous et la section dans le JSX */
}
{
  /* const MapSection = lazy(() =>
  import('./components/map/MapSection').then((m) => ({ default: m.MapSection }))
); */
}
const EndingScene = lazy(() =>
  import("./components/ending/EndingScene").then((m) => ({
    default: m.EndingScene,
  })),
);

function ScrollInteractionCatcher() {
  const { markInteraction } = useMusic();

  useEffect(() => {
    const handler = () => markInteraction();
    window.addEventListener("scroll", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("touchstart", handler);
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

function AppContent({ introDone }: { introDone: boolean }) {
  const { totalGems } = useSecrets();
  const [resetKey, setResetKey] = useState(0);
  const prevGems = useRef(totalGems);

  useEffect(() => {
    if (totalGems === 0 && prevGems.current > 0) setResetKey(k => k + 1);
    prevGems.current = totalGems;
  }, [totalGems]);

  return (
    <>
      <DynamicVignette intensity={introDone ? 0.3 : 0.6} />
      <ScrollInteractionCatcher />
      <AnimatePresence>
        {introDone && (
          <motion.div key={`content-${resetKey}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <TimelineSection id="timeline" />
            <MemoryGallery id="memories" />
            <OpenWhenHub id="openwhen" />
            <CounterSection id="counter" />
            <Suspense fallback={<SectionFallback />}>
              <EndingScene id="ending" />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const UNLOCK_DATE = new Date(config.dates.unlock);

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    if (import.meta.env.DEV) return true;
    return new Date() >= UNLOCK_DATE;
  });

  useEffect(() => {
    if (unlocked) return;
    const check = () => {
      if (new Date() >= UNLOCK_DATE) setUnlocked(true);
    };
    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, [unlocked]);

  useEffect(() => {
    if (!introDone) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  useEffect(() => {
    if (introDone) {
      const timeout = setTimeout(() => {
        window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [introDone]);

  return (
    <>
      {!unlocked ? (
        <LockScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <SecretProvider>
          <div className="relative bg-warm-darkest text-cream font-body overflow-x-hidden">
            <GrainOverlay />
            <ScrollProgressBar />
            <CursorGlow />
            <AmbientGlow />
            <EvolvingBackground />
            <IntroScene onComplete={() => setIntroDone(true)} />

            <AppContent introDone={introDone} />

            <MusicPlayer />
            <GemCounter />
            <EasterEggs />
          </div>
        </SecretProvider>
      )}
    </>
  );
}
