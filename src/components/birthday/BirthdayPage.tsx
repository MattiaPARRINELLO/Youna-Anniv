import { lazy, Suspense, useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "../../context/MusicContext";
import { SecretProvider, useSecrets } from "../../context/SecretContext";
import { GrainOverlay } from "../ui/GrainOverlay";
import { ScrollProgressBar } from "../ui/ScrollProgressBar";
import { DynamicVignette } from "../ui/DynamicVignette";
import { CursorGlow } from "../ui/CursorGlow";
import { AmbientGlow } from "../ui/AmbientGlow";
import { EvolvingBackground } from "../ui/EvolvingBackground";
import { IntroScene } from "../intro/IntroScene";
import { GemMissionPopup } from "../intro/GemMissionPopup";
import { TimelineSection } from "../timeline/TimelineSection";
import { MemoryGallery } from "../polaroid/MemoryGallery";
import { OpenWhenHub } from "../openwhen/OpenWhenHub";
import { CounterSection } from "../counter/CounterSection";
import { EasterEggs } from "../secrets/EasterEggs";
import { GemCompletionCelebration } from "../secrets/GemCompletionCelebration";
import { MemoryGame } from "../games/MemoryGame";
import { QuizGame } from "../games/QuizGame";
import { LoveCloud } from "../cloud/LoveCloud";
import { SectionNavDots } from "../ui/SectionNavDots";
import { BottomTaskbar } from "../ui/BottomTaskbar";
import { LockScreen } from "../lock/LockScreen";
import { trackEvent } from "../../utils/tracker";
import { useVisitCounter } from "../../hooks/useVisitCounter";
import config from "../../config.json";

const EndingScene = lazy(() =>
  import("../ending/EndingScene").then((m) => ({
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

export default function BirthdayPage() {
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

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <SecretProvider>
      <div className="relative bg-warm-darkest text-cream font-body overflow-x-hidden">
        <GrainOverlay />
        <ScrollProgressBar />
        <CursorGlow />
        <AmbientGlow />
        <EvolvingBackground />
        <DynamicVignette intensity={introDone ? 0.3 : 0.6} />
        <ScrollInteractionCatcher />
        <SectionNavDots />
        <div id="intro">
          <IntroScene onComplete={() => setIntroDone(true)} />
        </div>

        <AnimatePresence>
          {introDone && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            >
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

        <AnimatePresence>
          {introDone && <GemMissionPopup />}
        </AnimatePresence>

        <BottomTaskbar />
        <EasterEggs />
        <GemCompletionCelebration />
      </div>
    </SecretProvider>
  );
}
