import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "./context/MusicContext";
import { SecretProvider } from "./context/SecretContext";
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
            <DynamicVignette intensity={introDone ? 0.3 : 0.6} />
            <ScrollInteractionCatcher />

            <IntroScene onComplete={() => setIntroDone(true)} />

            <AnimatePresence>
              {introDone && (
                <motion.div
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-1 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  onAnimationComplete={() => {
                    const hideOnScroll = () => {
                      const el = document.getElementById('scroll-hint');
                      if (el) el.style.opacity = '0';
                      window.removeEventListener('scroll', hideOnScroll);
                    };
                    window.addEventListener('scroll', hideOnScroll, { once: true });
                  }}
                >
                  <div
                    id="scroll-hint"
                    className="transition-opacity duration-500 flex flex-col items-center gap-1"
                  >
                    <motion.span
                      className="text-cream-dark/20 text-[10px] font-body tracking-wider"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      glisse
                    </motion.span>
                    <motion.span
                      className="text-cream-dark/20 text-sm"
                      animate={{ y: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ↓
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {introDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <TimelineSection />
                  <MemoryGallery />
                  <OpenWhenHub />

                  {/* MapSection cachee temporairement — a reactiver plus tard */}
                  {/* <Suspense fallback={<SectionFallback />}>
                <MapSection />
              </Suspense> */}

                  <CounterSection />

                  <Suspense fallback={<SectionFallback />}>
                    <EndingScene />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>

            <MusicPlayer />
            <GemCounter />
            <EasterEggs />
          </div>
        </SecretProvider>
      )}
    </>
  );
}
