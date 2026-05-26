# Control Center — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the PWA entry point into a control center with routing, a hub page, and a message-sending page.

**Architecture:** Add `react-router-dom` with `HashRouter` (static-hosting compatible). Extract the current single-page App into a `BirthdayPage` component served at `/anniversaire`. New `ControlCenter` at `/` and `MessagePage` at `/message`. LockScreen stays at root, gating all routes.

**Tech Stack:** React 18, Vite 5, react-router-dom v6, framer-motion, Tailwind CSS

---

### Task 1: Install dependency + configure Vite proxy

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install react-router-dom**

```bash
npm install react-router-dom
```

- [ ] **Step 2: Add dev proxy for the external API**

In `vite.config.ts`, add a proxy so that `/api/message` fetches from `https://tab.mprnl.fr` during development:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://tab.mprnl.fr',
        changeOrigin: true,
      },
    },
  },
});
```

The `changeOrigin: true` ensures CORS works transparently in dev.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json vite.config.ts
git commit -m "feat: add react-router-dom and dev proxy for message API"
```

---

### Task 2: Extract BirthdayPage component

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/birthday/BirthdayPage.tsx`

Move the entire current App content logic (LockScreen check, intro state, SecretProvider, AppContent, overlays) into a new `BirthdayPage` component.

- [ ] **Step 1: Create BirthdayPage component**

Create `src/components/birthday/BirthdayPage.tsx`:

```tsx
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
```

- [ ] **Step 2: Simplify App.tsx to use routing**

Replace the entire content of `src/App.tsx`:

```tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import BirthdayPage from "./components/birthday/BirthdayPage";

const ControlCenter = lazy(() =>
  import("./components/control-center/ControlCenter").then((m) => ({
    default: m.ControlCenter,
  }))
);

const MessagePage = lazy(() =>
  import("./components/message/MessagePage").then((m) => ({
    default: m.MessagePage,
  }))
);

function SectionFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-dark">
      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ControlCenter />} />
        <Route path="/anniversaire" element={<BirthdayPage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </HashRouter>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/components/birthday/BirthdayPage.tsx
git commit -m "refactor: extract BirthdayPage, set up HashRouter with 3 routes"
```

---

### Task 3: Create ControlCenter component

**Files:**
- Create: `src/components/control-center/ControlCenter.tsx`

- [ ] **Step 1: Create ControlCenter**

```tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GrainOverlay } from "../ui/GrainOverlay";
import { CursorGlow } from "../ui/CursorGlow";
import { AmbientGlow } from "../ui/AmbientGlow";
import { EvolvingBackground } from "../ui/EvolvingBackground";

const cards = [
  {
    title: "Anniversaire",
    emoji: "🎂",
    description: "Retourner voir le site d'anniversaire",
    route: "/anniversaire",
  },
  {
    title: "Envoyer un message",
    emoji: "💌",
    description: "Écrire et envoyer un petit mot",
    route: "/message",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export function ControlCenter() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-warm-darkest text-cream font-body flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      <CursorGlow />
      <AmbientGlow />
      <EvolvingBackground />

      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl md:text-4xl text-gold"
        >
          Centre de Contrôle
        </motion.h1>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 px-6"
      >
        {cards.map((card) => (
          <motion.button
            key={card.route}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.route)}
            className="w-64 h-72 md:w-72 md:h-80 rounded-2xl bg-warm-dark/60 backdrop-blur-sm border border-gold/20 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:border-gold/50 hover:bg-warm-dark/80"
          >
            <span className="text-5xl md:text-6xl">{card.emoji}</span>
            <h2 className="font-serif text-xl md:text-2xl text-cream">{card.title}</h2>
            <p className="text-sm text-cream/60 font-light max-w-[200px] text-center">
              {card.description}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/control-center/ControlCenter.tsx
git commit -m "feat: add ControlCenter hub page with 2 navigation cards"
```

---

### Task 4: Create MessagePage component

**Files:**
- Create: `src/components/message/MessagePage.tsx`

- [ ] **Step 1: Create MessagePage**

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GrainOverlay } from "../ui/GrainOverlay";
import { CursorGlow } from "../ui/CursorGlow";
import { AmbientGlow } from "../ui/AmbientGlow";
import { EvolvingBackground } from "../ui/EvolvingBackground";

const API_URL = import.meta.env.PROD
  ? "https://tab.mprnl.fr/api/message"
  : "/api/message";

export function MessagePage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setStatus("sending");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue");
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-warm-darkest text-cream font-body flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      <CursorGlow />
      <AmbientGlow />
      <EvolvingBackground />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors bg-warm-dark/40 rounded-lg backdrop-blur-sm"
      >
        ← Retour
      </motion.button>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            <h2 className="font-serif text-2xl text-gold mb-2">Message envoyé !</h2>
            <p className="text-cream/60 mb-6">Il a bien été transmis ✉️</p>
            <button
              onClick={() => { setStatus("idle"); setText(""); }}
              className="px-6 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
            >
              Envoyer un autre message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-lg px-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <span className="text-4xl">💌</span>
              <h2 className="font-serif text-2xl mt-3 text-gold">
                Écris ton message
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 shadow-xl"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écris quelque chose de doux..."
                rows={6}
                maxLength={2000}
                className="w-full bg-transparent text-cream font-handwritten text-lg placeholder-cream/30 resize-none outline-none border-b border-gold/20 pb-4 focus:border-gold/60 transition-colors"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-cream/40">{text.length}/2000</span>

                <button
                  onClick={handleSend}
                  disabled={!text.trim() || status === "sending"}
                  className="px-8 py-2.5 rounded-xl bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {status === "sending" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      Envoi...
                    </span>
                  ) : (
                    "Envoyer ✉️"
                  )}
                </button>
              </div>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-400 text-sm"
                >
                  {errorMsg}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/message/MessagePage.tsx
git commit -m "feat: add MessagePage with letter-style UI and API integration"
```

---

### Task 5: Verify build and fix any issues

**Files:**
- Build output

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc -b --noEmit
```

If there are type errors (e.g., missing module declarations), fix them. The `lazy` imports may need the components to be default exports or the `.then()` mapping must match.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Test in dev mode**

```bash
npm run dev
```

Visit http://localhost:3000 — should show ControlCenter with 2 cards. Click "Anniversaire" — should show the birthday page as before. Click "Envoyer un message" — should show message page.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "build: fix any type/build issues from refactoring"
```

---

## Self-Review

**Spec coverage check:**
- ✅ ControlCenter at `/` with 2 cards — Task 3
- ✅ Birthday page at `/anniversaire` unchanged — Task 2
- ✅ MessagePage at `/message` with styled letter UI — Task 4
- ✅ External API POST to `tab.mprnl.fr/api/message` — Task 4
- ✅ Dev proxy for API — Task 1
- ✅ LockScreen stays at root (inside BirthdayPage) — Task 2
- ✅ Same design system — all new components reuse existing UI elements

**Placeholder check:** No TBD, TODOs, or placeholder patterns found. All code is complete.

**Type consistency:** `useNavigate` from react-router-dom matches across Task 3 and 4. `lazy` import patterns match existing codebase conventions. API URL uses `import.meta.env.PROD` consistently.

**Scope check:** Focused plan — routing restructure + 2 components. Appropriate for a single implementation plan.
