import { lazy, Suspense, useEffect, useState, useRef, useCallback } from "react";
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
import { GemMissionPopup } from "./components/intro/GemMissionPopup";
import { TimelineSection } from "./components/timeline/TimelineSection";
import { MemoryGallery } from "./components/polaroid/MemoryGallery";
import { OpenWhenHub } from "./components/openwhen/OpenWhenHub";
import { CounterSection } from "./components/counter/CounterSection";
import { EasterEggs } from "./components/secrets/EasterEggs";
import { GemCompletionCelebration } from "./components/secrets/GemCompletionCelebration";
import { MemoryGame } from "./components/games/MemoryGame";
import { QuizGame } from "./components/games/QuizGame";
import { LoveCloud } from "./components/cloud/LoveCloud";
import { SectionNavDots } from "./components/ui/SectionNavDots";
import { BottomTaskbar } from "./components/ui/BottomTaskbar";
import { LockScreen } from "./components/lock/LockScreen";
import { trackEvent } from "./utils/tracker";
import { useVisitCounter } from "./hooks/useVisitCounter";
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
  const { resetCount } = useSecrets();
  const [resetKey, setResetKey] = useState(0);
  const prevCount = useRef(resetCount);

  useEffect(() => {
    if (resetCount !== prevCount.current) {
      setResetKey(k => k + 1);
      prevCount.current = resetCount;
    }
  }, [resetCount]);

  return (
    <>
      <DynamicVignette intensity={introDone ? 0.3 : 0.6} />
      <ScrollInteractionCatcher />
      <SectionNavDots />
      <AnimatePresence>
        {introDone && (
          <motion.div key={`content-${resetKey}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <TimelineSection id="timeline" />
            <MemoryGallery id="memories" />
            <OpenWhenHub id="openwhen" />
            <CounterSection id="counter" />
            <MemoryGame id="memory" />
            <LoveCloud id="cloud" />
            <QuizGame id="quiz" />
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
  useVisitCounter();

  const [introDone, setIntroDone] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    if (import.meta.env.DEV) return true;
    return new Date() >= UNLOCK_DATE;
  });

  const checkUnlock = useCallback(() => {
    if (new Date() >= UNLOCK_DATE) setUnlocked(true);
  }, []);

  useEffect(() => {
    if (unlocked) return;
    const interval = setInterval(checkUnlock, 500);
    return () => clearInterval(interval);
  }, [unlocked, checkUnlock]);

  useEffect(() => {
    if (unlocked) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        checkUnlock();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [unlocked, checkUnlock]);

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
            <div id="intro">
              <IntroScene onComplete={() => setIntroDone(true)} />
            </div>

            <AppContent introDone={introDone} />

            <AnimatePresence>
              {introDone && <GemMissionPopup />}
            </AnimatePresence>

            <BottomTaskbar />
            <EasterEggs />
            <GemCompletionCelebration />
          </div>
        </SecretProvider>
      )}
    </>
  );
}
