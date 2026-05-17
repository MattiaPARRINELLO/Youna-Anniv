# Experience Upgrade "Moment Fou" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer l'experience Youna Anniv en un moment inoubliable : intro cinematique en 3 actes, chasse au tresor de 5 gemmes avec mini-jeu, et climax final avec lettre manuscrite animee.

**Architecture:** Un `SecretContext` partage l'etat des gemmes a travers l'app. L'intro est refondue en composants modulaires (HeartbeatGlow, LightSweep, PortalButton). Les gemmes sont integrees dans les composants existants (TimelineCard, PolaroidCard, OpenWhenPortal, EasterEggs). La fin est enrichie de StatsBilan et HandwrittenLetter, conditionnes au nombre de gemmes trouvees.

**Tech Stack:** React 18 + TypeScript + Vite + TailwindCSS + Framer Motion. Three.js / React Three Fiber autorise pour effets 3D, GSAP pour animations avancees.

---

### Task 0: Pre-implementation — Definir les donnees utilisateur

**Files:**
- Modify: `src/config.json` (add new fields)

- [ ] **Step 1: Ajouter les nouveaux champs a config.json**

```json
{
  "dates": { ... },
  "intro": { ... },
  "music": { ... },
  "timeline": [ ... ],
  "polaroids": [
    {
      "id": "memory-1",
      "image": "/photos/polaroids/memory-1.jpg",
      "caption": "~ 5h du matin ~",
      "date": "Fevrier 2026",
      "rotation": -2,
      "hiddenMessage": "Je rentrai de boite...",
      "tapeStyle": "top",
      "hasHotspot": false,
      "hotspotX": 0,
      "hotspotY": 0
    },
    ...
  ],
  "openWhen": [
    {
      "slug": "sad",
      "emoji": "🌧️",
      "title": "Ouvre quand tu es triste",
      "message": "Youyou,\n\n...",
      "theme": "rain",
      "secretLetter": "J",
      "surprise": { ... }
    },
    ...
  ],
  "mapLocations": [ ... ],
  "secrets": {
    "passwordWord": "JETAIME",
    "hotspotImageIndex": 3,
    "hotspotX": 45,
    "hotspotY": 30,
    "hotspotMessage": "tu m'as trouvee...",
    "starCatcherMessage": "tu es une collectionneuse d'etoiles, mon amour",
    "nightGemMessage": "tu penses a moi tard la nuit..."
  },
  "finalLetter": "Ma Youna...\n\nQuand j'ai commence a creer ce site, je ne savais pas vraiment ou j'allais. Tout ce que je savais, c'est que je voulais te dire quelque chose.\n\n..."
}
```

- [ ] **Step 2: Commit**

```bash
git add src/config.json
git commit -m "config: add secrets, finalLetter, and gem fields"
```

---

### Task 1: SecretContext — Etat global des gemmes

**Files:**
- Create: `src/context/SecretContext.tsx`
- Modify: `src/App.tsx` (wrap with SecretProvider)

- [ ] **Step 1: Creer SecretContext avec etat et persistence**

```typescript
// src/context/SecretContext.tsx
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface SecretState {
  gem1: boolean;
  gem2: boolean;
  gem3: boolean;
  gem4: boolean;
  gem5: boolean;
  openWhenPortalsVisited: string[];
  openWhenLettersRevealed: string[];
  totalGems: number;
  sessionStartTime: number;
}

interface SecretContextType extends SecretState {
  unlockGem: (gem: 1 | 2 | 3 | 4 | 5) => void;
  markPortalVisited: (slug: string) => void;
  addRevealedLetter: (letter: string) => void;
  getMissingGems: () => number[];
  getFoundCount: () => number;
  getSessionDuration: () => number;
}

const STORAGE_KEY = 'youna-secrets';

function loadState(): SecretState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    gem1: false, gem2: false, gem3: false, gem4: false, gem5: false,
    openWhenPortalsVisited: [],
    openWhenLettersRevealed: [],
    totalGems: 0,
    sessionStartTime: Date.now(),
  };
}

const SecretContext = createContext<SecretContextType | null>(null);

export function SecretProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SecretState>(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const unlockGem = useCallback((gem: 1 | 2 | 3 | 4 | 5) => {
    setState(prev => {
      const key = `gem${gem}` as keyof SecretState;
      if (prev[key]) return prev;
      return { ...prev, [key]: true, totalGems: prev.totalGems + 1 };
    });
  }, []);

  const markPortalVisited = useCallback((slug: string) => {
    setState(prev => {
      if (prev.openWhenPortalsVisited.includes(slug)) return prev;
      return { ...prev, openWhenPortalsVisited: [...prev.openWhenPortalsVisited, slug] };
    });
  }, []);

  const addRevealedLetter = useCallback((letter: string) => {
    setState(prev => {
      if (prev.openWhenLettersRevealed.includes(letter)) return prev;
      return { ...prev, openWhenLettersRevealed: [...prev.openWhenLettersRevealed, letter] };
    });
  }, []);

  const getMissingGems = useCallback(() => {
    return ([1,2,3,4,5] as const).filter(g => !state[`gem${g}`]);
  }, [state]);

  const getFoundCount = useCallback(() => {
    return [state.gem1, state.gem2, state.gem3, state.gem4, state.gem5].filter(Boolean).length;
  }, [state]);

  const getSessionDuration = useCallback(() => {
    return Math.floor((Date.now() - state.sessionStartTime) / 1000);
  }, [state.sessionStartTime]);

  return (
    <SecretContext.Provider value={{
      ...state,
      unlockGem,
      markPortalVisited,
      addRevealedLetter,
      getMissingGems,
      getFoundCount,
      getSessionDuration,
    }}>
      {children}
    </SecretContext.Provider>
  );
}

export function useSecrets() {
  const ctx = useContext(SecretContext);
  if (!ctx) throw new Error('useSecrets must be used within SecretProvider');
  return ctx;
}
```

- [ ] **Step 2: Ajouter SecretProvider dans App.tsx**

Modifier `src/App.tsx` :
- Ajouter l'import : `import { SecretProvider } from "./context/SecretContext";`
- Wrapper le contenu debloque dans `<SecretProvider>...</SecretProvider>` (autour du `<div className="relative bg-warm-darkest...">`)

- [ ] **Step 3: Commit**

```bash
git add src/context/SecretContext.tsx src/App.tsx
git commit -m "feat: add SecretContext for gem tracking with localStorage persistence"
```

---

### Task 2: GemCounter — Compteur discret

**Files:**
- Create: `src/components/secrets/GemCounter.tsx`
- Modify: `src/App.tsx` (render GemCounter)

- [ ] **Step 1: Ecrire GemCounter**

```typescript
// src/components/secrets/GemCounter.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

export function GemCounter() {
  const { getFoundCount } = useSecrets();
  const found = getFoundCount();
  const [visible, setVisible] = useState(false);
  const [lastFound, setLastFound] = useState(found);

  useEffect(() => {
    if (found > lastFound) {
      setVisible(true);
      setLastFound(found);
      const hide = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(hide);
    }
  }, [found, lastFound]);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener('scroll', show, { once: true });
    setTimeout(show, 8000);
    return () => window.removeEventListener('scroll', show);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[155] glass rounded-full px-4 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-base">💎</span>
          <span className="text-gold font-serif text-lg">{found}</span>
          <span className="text-cream-dark/30">/ 5</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Ajouter GemCounter dans App.tsx**

Ajouter `<GemCounter />` apres `<MusicPlayer />` dans le JSX.

- [ ] **Step 3: Commit**

```bash
git add src/components/secrets/GemCounter.tsx src/App.tsx
git commit -m "feat: add GemCounter floating pill showing gem progress"
```

---

### Task 3: GemAnimation — Animation d'apparition de gemme

**Files:**
- Create: `src/components/secrets/GemAnimation.tsx`

- [ ] **Step 1: Ecrire GemAnimation**

```typescript
// src/components/secrets/GemAnimation.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GemAnimationProps {
  trigger: boolean;
  message: string;
  onComplete?: () => void;
}

export function GemAnimation({ trigger, message, onComplete }: GemAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger && !show) setShow(true);
  }, [trigger, show]);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={handleComplete}
        >
          <motion.span
            className="text-6xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            💎
          </motion.span>
          <motion.p
            className="font-handwritten text-gold text-xl mt-4 text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/secrets/GemAnimation.tsx
git commit -m "feat: add GemAnimation component for gem unlock visual"
```

---

### Task 4: Intro Acte 1 — HeartbeatGlow

**Files:**
- Create: `src/components/intro/HeartbeatGlow.tsx`
- Modify: `src/components/intro/IntroScene.tsx`

- [ ] **Step 1: Ecrire HeartbeatGlow**

```typescript
// src/components/intro/HeartbeatGlow.tsx
import { motion } from 'framer-motion';

export function HeartbeatGlow() {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-full bg-gold-light/10"
        style={{ width: 120, height: 120 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0) 70%)',
        }}
        animate={{
          scale: [0.7, 1.3, 0.7],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Integrer HeartbeatGlow dans IntroScene**

Remplacer le contenu actuel de `IntroScene.tsx` par la version refondue (voir Task 7 pour la version complete).

- [ ] **Step 3: Commit**

```bash
git add src/components/intro/HeartbeatGlow.tsx src/components/intro/IntroScene.tsx
git commit -m "feat: add HeartbeatGlow for intro act 1"
```

---

### Task 5: Intro Acte 2 — LightSweep

**Files:**
- Create: `src/components/intro/LightSweep.tsx`

- [ ] **Step 1: Ecrire LightSweep**

```typescript
// src/components/intro/LightSweep.tsx
import { motion } from 'framer-motion';

interface LightSweepProps {
  children: React.ReactNode;
  delay?: number;
}

export function LightSweep({ children, delay = 0 }: LightSweepProps) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 50%, transparent 100%)',
          opacity: 0,
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ delay: delay + 0.3, duration: 1.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/intro/LightSweep.tsx
git commit -m "feat: add LightSweep for intro act 2 text reveal"
```

---

### Task 6: Intro Acte 3 — PortalButton & PortalExplosion

**Files:**
- Create: `src/components/intro/PortalButton.tsx`
- Create: `src/components/intro/PortalExplosion.tsx`

- [ ] **Step 1: Ecrire PortalButton**

```typescript
// src/components/intro/PortalButton.tsx
import { motion } from 'framer-motion';

interface PortalButtonProps {
  onClick: () => void;
}

export function PortalButton({ onClick }: PortalButtonProps) {
  return (
    <motion.button
      className="relative flex flex-col items-center gap-3 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
      whileTap={{ scale: 1.3 }}
    >
      <motion.div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
        style={{
          border: '2px solid rgba(212,175,55,0.5)',
          boxShadow: '0 0 40px rgba(212,175,55,0.3), inset 0 0 20px rgba(212,175,55,0.1)',
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.05)',
            '0 0 50px rgba(212,175,55,0.5), inset 0 0 30px rgba(212,175,55,0.2)',
            '0 0 20px rgba(212,175,55,0.2), inset 0 0 10px rgba(212,175,55,0.05)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold"
            style={{
              boxShadow: '0 0 8px rgba(212,175,55,0.8)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute"
              style={{
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: '#d4af37',
                transform: `rotate(${angle}deg) translate(34px)`,
              }}
            />
          </motion.div>
        ))}
        <motion.span
          className="text-gold text-2xl relative z-10"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </motion.div>
      <span className="text-cream-dark/40 text-[10px] font-body tracking-widest uppercase">
        touche l&apos;ecran
      </span>
    </motion.button>
  );
}
```

- [ ] **Step 2: Ecrire PortalExplosion**

```typescript
// src/components/intro/PortalExplosion.tsx
import { useEffect, useMemo } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface PortalExplosionProps {
  active: boolean;
  onComplete: () => void;
}

export function PortalExplosion({ active, onComplete }: PortalExplosionProps) {
  const controls = useAnimationControls();

  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      scale: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    })),
    []
  );

  useEffect(() => {
    if (active) {
      controls.start('explode').then(() => {
        setTimeout(onComplete, 500);
      });
    }
  }, [active, controls, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: [0, 1, 0] } : {}}
        transition={{ duration: 1, times: [0, 0.3, 1] }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 sm:w-4 sm:h-4"
          style={{
            left: '50%',
            top: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,1), rgba(212,175,55,0))',
          }}
          variants={{
            explode: {
              x: p.x,
              y: p.y,
              scale: [p.scale, 0],
              opacity: [1, 0],
              rotate: p.rotation,
              transition: { duration: 0.8, delay: p.delay, ease: 'easeOut' },
            },
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={controls}
        />
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/intro/PortalButton.tsx src/components/intro/PortalExplosion.tsx
git commit -m "feat: add PortalButton and PortalExplosion for intro act 3"
```

---

### Task 7: IntroScene — Refonte complete en 3 actes

**Files:**
- Modify: `src/components/intro/IntroScene.tsx` (full rewrite)

- [ ] **Step 1: Rewrite IntroScene**

```typescript
// src/components/intro/IntroScene.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartbeatGlow } from './HeartbeatGlow';
import { LightSweep } from './LightSweep';
import { PortalButton } from './PortalButton';
import { PortalExplosion } from './PortalExplosion';
import { ReactiveParticles } from '../ui/ReactiveParticles';
import { FloatingElements } from '../ui/FloatingElements';
import { useMusic } from '../../context/MusicContext';
import config from '../../config.json';

type ActState = 'heartbeat' | 'title' | 'portal' | 'exploding' | 'done';

const AUTO_DURATION = 12000;

interface IntroSceneProps {
  onComplete: () => void;
}

export function IntroScene({ onComplete }: IntroSceneProps) {
  const { markInteraction } = useMusic();
  const [act, setAct] = useState<ActState>('heartbeat');
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAct('title'), 2500);
    const t2 = setTimeout(() => setAct('portal'), 6500);
    const t3 = setTimeout(() => {
      markInteraction();
      setExploding(true);
      setAct('exploding');
    }, AUTO_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [markInteraction]);

  const handlePortalClick = useCallback(() => {
    markInteraction();
    if (act !== 'exploding' && act !== 'done') {
      setExploding(true);
      setAct('exploding');
    }
  }, [markInteraction, act]);

  const handleExplosionComplete = useCallback(() => {
    setAct('done');
    setTimeout(onComplete, 600);
  }, [onComplete]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#14101E] to-warm-dark-mid overflow-hidden">
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <ReactiveParticles countDesktop={30} countMobile={15} />
      <FloatingElements type="mixed" countDesktop={4} countMobile={2} />

      <AnimatePresence mode="wait">
        {act === 'heartbeat' && (
          <motion.div key="heartbeat" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <HeartbeatGlow />
          </motion.div>
        )}

        {act === 'title' && (
          <motion.div
            key="title"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LightSweep delay={0.2}>
              <p className="font-serif italic text-gold text-4xl sm:text-5xl md:text-6xl tracking-[0.15em]"
                style={{ textShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
                pour toi
              </p>
            </LightSweep>
          </motion.div>
        )}

        {act === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PortalButton onClick={handlePortalClick} />
          </motion.div>
        )}
      </AnimatePresence>

      <PortalExplosion
        active={exploding}
        onComplete={handleExplosionComplete}
      />
    </section>
  );
}
```

- [ ] **Step 2: Verifier que le build passe**

```bash
cd "/home/mattia/Documents/Perso/Youna Anniv" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/intro/IntroScene.tsx
git commit -m "feat: refactor IntroScene into 3-act cinematic sequence"
```

---

### Task 8: Timeline Code Secret — Gemme 1

**Files:**
- Modify: `src/components/timeline/TimelineSection.tsx` (add secret detection)
- Modify: `src/components/timeline/TimelineCard.tsx` (add pulse glow + callback)

- [ ] **Step 1: Ajouter la detection du code secret dans TimelineSection**

Dans `TimelineSection.tsx`, ajouter :
- Un state `secretTapOrder` (number[])
- L'ordre attendu : `[0, 1, 2, 3, 4]` (les 5 cartes dans l'ordre)
- Quand une carte est tapee : verifier qu'elle est la prochaine attendue. Si oui, ajouter l'index. Sinon, reset.
- Si les 5 sont dans l'ordre : `unlockGem(1)`
- Passer un prop `isSecretActive` aux `TimelineCard` concernees

Modifier le mapping des cartes pour passer `onSecretTap` et `secretIndex`.

```typescript
// Dans TimelineSection.tsx, ajouter:
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from '../secrets/GemAnimation';

// Dans le composant:
const { gem1, unlockGem } = useSecrets();
const [secretTapOrder, setSecretTapOrder] = useState<number[]>([]);
const [showGem, setShowGem] = useState(false);
const SECRET_ORDER = [0, 1, 2, 3, 4];

const handleCardTap = useCallback((index: number) => {
  if (gem1) return;
  setSecretTapOrder(prev => {
    const nextExpected = prev.length;
    if (index === SECRET_ORDER[nextExpected]) {
      const next = [...prev, index];
      if (next.length === 5) {
        unlockGem(1);
        setShowGem(true);
        return [];
      }
      return next;
    }
    return [];
  });
}, [gem1, unlockGem]);
```

Passer `isSecretActive={!gem1 && secretTapOrder.length > 0}` et `secretHighlightIndex={SECRET_ORDER[secretTapOrder.length]}` aux TimelineCard.

- [ ] **Step 2: Ajouter lueur pulse sur les cartes**

Dans `TimelineCard.tsx`, ajouter les props `isSecretActive`, `secretHighlightIndex`, `secretIndex`, `onSecretTap` et une animation de lueur doree :

```typescript
interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
  isSecretActive?: boolean;
  secretHighlightIndex?: number;
  secretIndex?: number;
  onSecretTap?: (index: number) => void;
}

// Dans le JSX, ajouter une lueur conditionnelle autour de la carte:
{isSecretActive && secretHighlightIndex === secretIndex && (
  <motion.div
    className="absolute inset-0 rounded-2xl pointer-events-none"
    style={{ boxShadow: '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.1)' }}
    animate={{ opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
)}
```

- [ ] **Step 3: Ajouter GemAnimation pour la gemme 1**

Ajouter `<GemAnimation trigger={showGem} message="tu connais notre histoire par coeur..." onComplete={() => setShowGem(false)} />` dans TimelineSection.

- [ ] **Step 4: Commit**

```bash
git add src/components/timeline/TimelineSection.tsx src/components/timeline/TimelineCard.tsx
git commit -m "feat: add timeline code secret (gem 1) with pulse glow and tap sequence"
```

---

### Task 9: Polaroid Hotspot — Gemme 2

**Files:**
- Modify: `src/components/polaroid/PolaroidCard.tsx` (add hotspot detection)
- Modify: `src/components/polaroid/MemoryGallery.tsx` (pass config & secrets)

- [ ] **Step 1: Ajouter le hotspot sur PolaroidCard**

Ajouter les props `hasHotspot`, `hotspotX`, `hotspotY`, `onHotspotFound`, `hotspotFound`.

```typescript
// Dans PolaroidCard.tsx, ajouter aux props:
hasHotspot?: boolean;
hotspotX?: number;
hotspotY?: number;
onHotspotFound?: () => void;
hotspotFound?: boolean;
```

Implementer la detection : lors du `onTouchStart` / `onMouseDown`, verifier si les coordonnees sont proches du hotspot (±15% de la taille de l'image).

```typescript
const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
  if (!hasHotspot || hotspotFound) return;
  
  const img = (e.target as HTMLElement).closest('.aspect-square');
  if (!img) return;
  const rect = img.getBoundingClientRect();
  
  let clientX: number, clientY: number;
  if ('touches' in e) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  const xPercent = ((clientX - rect.left) / rect.width) * 100;
  const yPercent = ((clientY - rect.top) / rect.height) * 100;
  
  if (
    hotspotX !== undefined && hotspotY !== undefined &&
    Math.abs(xPercent - hotspotX) < 15 &&
    Math.abs(yPercent - hotspotY) < 15
  ) {
    onHotspotFound?.();
  }
}, [hasHotspot, hotspotFound, hotspotX, hotspotY, onHotspotFound]);
```

- [ ] **Step 2: Integrer dans MemoryGallery**

Dans `MemoryGallery.tsx`, lire la config `secrets.hotspotImageIndex` et passer les props au polaroid concerne.

```typescript
import config from '../../config.json';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from '../secrets/GemAnimation';

// Dans le composant:
const { gem2, unlockGem } = useSecrets();
const [showGem, setShowGem] = useState(false);
const hotspotIndex = config.secrets.hotspotImageIndex;

const handleHotspotFound = useCallback(() => {
  if (!gem2) {
    unlockGem(2);
    setShowGem(true);
  }
}, [gem2, unlockGem]);

// Pour le polaroid concerne:
<PolaroidCard
  ...
  hasHotspot={index === hotspotIndex && !gem2}
  hotspotX={config.secrets.hotspotX}
  hotspotY={config.secrets.hotspotY}
  onHotspotFound={handleHotspotFound}
  hotspotFound={gem2}
/>

// Ajouter <GemAnimation trigger={showGem} message={config.secrets.hotspotMessage} ... />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/polaroid/PolaroidCard.tsx src/components/polaroid/MemoryGallery.tsx
git commit -m "feat: add polaroid hotspot secret (gem 2)"
```

---

### Task 10: OpenWhen Password — Gemme 3

**Files:**
- Modify: `src/components/openwhen/OpenWhenPortal.tsx` (highlight secret letter, track visited)
- Create: `src/components/secrets/SecretPassword.tsx`
- Modify: `src/components/openwhen/OpenWhenHub.tsx` (manage password state)

- [ ] **Step 1: Ajouter le tracking et la lettre secrete dans OpenWhenPortal**

Dans `OpenWhenPortal.tsx` : appeler `markPortalVisited` au mount et `addRevealedLetter` pour la `secretLetter` de l'entree.

```typescript
import { useSecrets } from '../../context/SecretContext';

// Dans le composant:
const { markPortalVisited, addRevealedLetter, gem3 } = useSecrets();

useEffect(() => {
  markPortalVisited(entry.slug);
  if (entry.secretLetter && !gem3) {
    addRevealedLetter(entry.secretLetter);
  }
}, [entry.slug, entry.secretLetter, markPortalVisited, addRevealedLetter, gem3]);
```

Mettre en evidence la lettre secrete dans le texte. Dans `renderMessage`, pour chaque ligne, si elle contient la `secretLetter` (premiere occurrence), wrapper cette lettre dans un span avec `text-gold font-bold` et une animation subtile de lueur.

- [ ] **Step 2: Creer SecretPassword — clavier + verification**

```typescript
// src/components/secrets/SecretPassword.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface SecretPasswordProps {
  onCorrect: () => void;
  onClose: () => void;
  passwordWord: string;
}

export function SecretPassword({ onCorrect, onClose, passwordWord }: SecretPasswordProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleKey = useCallback((key: string) => {
    if (error) return;
    const next = input + key;
    setInput(next);
    if (next.length === passwordWord.length) {
      if (next.toUpperCase() === passwordWord.toUpperCase()) {
        setTimeout(onCorrect, 500);
      } else {
        setError(true);
        setTimeout(() => { setInput(''); setError(false); }, 800);
      }
    }
  }, [input, error, passwordWord, onCorrect]);

  const handleDelete = useCallback(() => {
    if (!error) setInput(prev => prev.slice(0, -1));
  }, [error]);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[220] flex flex-col items-center justify-end pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-warm-darkest/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center gap-4">
        <button className="self-end text-cream-dark/40 hover:text-cream" onClick={onClose}>
          <FiX size={20} />
        </button>

        <p className="font-handwritten text-cream/60 text-center">
          Entre le mot mystere...
        </p>
        <div className="flex gap-2 justify-center">
          {passwordWord.split('').map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center font-serif text-xl
                ${error ? 'border-red-400/50 text-red-400' : 'border-cream-dark/20 text-gold'}
                ${input[i] ? 'bg-cream-dark/10' : 'bg-transparent'}`}
            >
              {input[i] || ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 w-full">
          {letters.map((l) => (
            <button
              key={l}
              className="w-10 h-10 rounded-lg glass text-cream/60 text-sm font-body active:bg-gold/20 active:text-gold transition-colors"
              onClick={() => handleKey(l)}
            >
              {l}
            </button>
          ))}
          <button
            className="col-span-2 w-full h-10 rounded-lg glass text-cream/40 text-xs font-body"
            onClick={handleDelete}
          >
            effacer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Integrer dans OpenWhenHub**

Dans `OpenWhenHub.tsx`, ajouter la logique pour afficher le clavier quand tous les portals sont visites (8/8) ET que gem3 n'est pas debloquee.

```typescript
const { openWhenPortalsVisited, gem3, unlockGem } = useSecrets();
const [showPassword, setShowPassword] = useState(false);
const [showGem, setShowGem] = useState(false);

useEffect(() => {
  if (openWhenPortalsVisited.length >= 8 && !gem3 && !showPassword) {
    const timer = setTimeout(() => setShowPassword(true), 1500);
    return () => clearTimeout(timer);
  }
}, [openWhenPortalsVisited, gem3, showPassword]);
```

Ajouter `<AnimatePresence>` avec `<SecretPassword>` et `<GemAnimation>`.

- [ ] **Step 4: Commit**

```bash
git add src/components/openwhen/OpenWhenPortal.tsx src/components/openwhen/OpenWhenHub.tsx src/components/secrets/SecretPassword.tsx
git commit -m "feat: add OpenWhen password secret (gem 3) with letter clues and keyboard"
```

---

### Task 11: Night Gem — Gemme 4

**Files:**
- Modify: `src/components/secrets/EasterEggs.tsx`

- [ ] **Step 1: Upgrade EasterEggs pour la gemme nocturne**

```typescript
// src/components/secrets/EasterEggs.tsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingElements } from '../ui/FloatingElements';
import { useSecrets } from '../../context/SecretContext';
import { GemAnimation } from './GemAnimation';
import config from '../../config.json';

export function EasterEggs() {
  const [showTimeMessage, setShowTimeMessage] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const appeared = useRef(false);
  const { gem4, unlockGem } = useSecrets();

  useEffect(() => {
    if (appeared.current || gem4) return;
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) {
      const timer = setTimeout(() => {
        setShowTimeMessage(true);
        appeared.current = true;
        unlockGem(4);
        setShowGem(true);
        setTimeout(() => setShowTimeMessage(false), 5000);
      }, 120000); // 2 minutes instead of 30 seconds
      return () => clearTimeout(timer);
    }
  }, [gem4, unlockGem]);

  return (
    <>
      <FloatingElements type="butterfly" countDesktop={3} countMobile={1} />

      <AnimatePresence>
        {showTimeMessage && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[160] glass rounded-full px-5 py-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-body text-cream/40 text-[11px] tracking-wide">
              il est tard... tu devrais dormir, mon amour 🌙
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.nightGemMessage}
        onComplete={() => setShowGem(false)}
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/secrets/EasterEggs.tsx
git commit -m "feat: upgrade EasterEggs to grant night gem (gem 4) after 2min browsing at night"
```

---

### Task 12: StarCatcherGame — Mini-jeu + Gemme 5

**Files:**
- Create: `src/components/secrets/StarCatcherGame.tsx`
- Modify: `src/components/ending/EndingScene.tsx` (add button trigger)

- [ ] **Step 1: Ecrire StarCatcherGame**

```typescript
// src/components/secrets/StarCatcherGame.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface Star {
  id: number;
  x: number;
  size: number;
  duration: number;
  caught: boolean;
}

const GAME_DURATION = 15000;
const TARGET_SCORE = 10;
const MAX_STARS_ON_SCREEN = 3;

interface StarCatcherGameProps {
  onComplete: (won: boolean) => void;
  onClose: () => void;
}

export function StarCatcherGame({ onComplete, onClose }: StarCatcherGameProps) {
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const scoreRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const spawnStar = useCallback(() => {
    if (gameOver) return;
    const id = nextId.current++;
    setStars(prev => {
      if (prev.length >= MAX_STARS_ON_SCREEN) return prev;
      return [...prev, {
        id,
        x: 10 + Math.random() * 80,
        size: 24 + Math.random() * 16,
        duration: 3 + Math.random() * 3,
        caught: false,
      }];
    });
  }, [gameOver]);

  useEffect(() => {
    const spawnInterval = setInterval(spawnStar, 800);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(spawnInterval);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [spawnStar]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => onComplete(scoreRef.current >= TARGET_SCORE), 1500);
    }
  }, [gameOver, onComplete]);

  const handleCatch = useCallback((starId: number) => {
    setStars(prev => prev.map(s =>
      s.id === starId && !s.caught ? { ...s, caught: true } : s
    ));
    setScore(prev => {
      const next = prev + 1;
      scoreRef.current = next;
      return next;
    });
  }, []);

  const handleAnimationComplete = useCallback((starId: number) => {
    setStars(prev => prev.filter(s => s.id !== starId));
  }, []);

  const progress = (timeLeft / (GAME_DURATION / 1000)) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[250] flex flex-col bg-warm-darkest/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onClose} className="text-cream-dark/40 hover:text-cream">
          <FiX size={22} />
        </button>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1">
          <span className="text-sm">⭐</span>
          <span className="text-gold font-mono text-sm">{score}</span>
          <span className="text-cream-dark/30 text-xs">/ {TARGET_SCORE}</span>
        </div>
        <span className="text-cream-dark/30 font-mono text-xs">{timeLeft}s</span>
      </div>

      <div className="h-1 bg-cream-dark/10 mx-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold/40 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <div
        ref={gameAreaRef}
        className="flex-1 relative overflow-hidden touch-none"
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence>
          {stars.map((star) => (
            <motion.button
              key={star.id}
              className="absolute text-gold active:scale-150 transition-transform"
              style={{
                left: `${star.x}%`,
                top: -star.size,
                fontSize: star.size,
                filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))',
                pointerEvents: star.caught ? 'none' : 'auto',
              }}
              initial={{ y: -star.size }}
              animate={star.caught
                ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                : { y: `calc(100vh - ${star.size * 2}px)` }
              }
              exit={{ opacity: 0 }}
              transition={
                star.caught
                  ? { duration: 0.4 }
                  : { duration: star.duration, ease: 'linear' }
              }
              onPointerDown={(e) => {
                e.preventDefault();
                if (!star.caught) handleCatch(star.id);
              }}
              onAnimationComplete={() => handleAnimationComplete(star.id)}
            >
              ✦
            </motion.button>
          ))}
        </AnimatePresence>

        {gameOver && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-serif text-gold text-3xl mb-2">
              {scoreRef.current >= TARGET_SCORE ? 'Bravo !' : 'Presque...'}
            </p>
            <p className="font-handwritten text-cream/60 text-lg">
              {scoreRef.current >= TARGET_SCORE
                ? 'tu es une collectionneuse d\'etoiles'
                : `${scoreRef.current} etoile${scoreRef.current > 1 ? 's' : ''}...`}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Ajouter le declenchement dans EndingScene**

Dans `EndingScene.tsx`, pendant la phase `restart`, ajouter un deuxieme bouton "decouvre un secret" qui declenche le jeu. Integrer `useSecrets` pour savoir si la gemme 5 est deja debloquee.

```typescript
import { useSecrets } from '../../context/SecretContext';
import { StarCatcherGame } from '../secrets/StarCatcherGame';
import { GemAnimation } from '../secrets/GemAnimation';

// Dans le composant:
const { gem5, unlockGem } = useSecrets();
const [showGame, setShowGame] = useState(false);
const [showGem, setShowGem] = useState(false);

const handleGameComplete = useCallback((won: boolean) => {
  setShowGame(false);
  if (won && !gem5) {
    unlockGem(5);
    setShowGem(true);
  }
}, [gem5, unlockGem]);

// Dans la phase restart, ajouter:
{!gem5 && (
  <motion.button
    className="font-body text-gold/30 text-xs sm:text-sm tracking-wider hover:text-gold/60 transition-colors duration-500 underline underline-offset-4 decoration-gold/10 mt-4"
    onClick={() => setShowGame(true)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.8, duration: 1 }}
  >
    decouvre un secret
  </motion.button>
)}

// Ajouter <AnimatePresence> pour StarCatcherGame et GemAnimation
```

- [ ] **Step 3: Commit**

```bash
git add src/components/secrets/StarCatcherGame.tsx src/components/ending/EndingScene.tsx
git commit -m "feat: add StarCatcherGame mini-game and trigger (gem 5)"
```

---

### Task 13: StatsBilan — Bilan emotionnel

**Files:**
- Create: `src/components/ending/StatsBilan.tsx`

- [ ] **Step 1: Ecrire StatsBilan**

```typescript
// src/components/ending/StatsBilan.tsx
import { motion } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

interface StatsBilanProps {
  onComplete: () => void;
}

export function StatsBilan({ onComplete }: StatsBilanProps) {
  const { getFoundCount, gem4, getSessionDuration } = useSecrets();
  const foundCount = getFoundCount();
  const duration = getSessionDuration();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const stats = [
    { icon: '💎', text: `Tu as trouve ${foundCount} secret${foundCount > 1 ? 's' : ''} sur 5`, show: true },
    { icon: '⏱️', text: `Tu as passe ${minutes > 0 ? `${minutes} min et ` : ''}${seconds} secondes a explorer`, show: true },
    { icon: '🌙', text: 'Tu es venue un soir, tard...', show: gem4 },
  ].filter(s => s.show);

  return (
    <motion.div
      className="relative z-10 text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <div className="flex flex-col items-center gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.text}
            className="glass rounded-2xl px-6 py-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
          >
            <span className="text-xl">{stat.icon}</span>
            <span className="font-body text-cream/60 text-sm">{stat.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ending/StatsBilan.tsx
git commit -m "feat: add StatsBilan displaying personalized gem/time stats"
```

---

### Task 14: HandwrittenLetter — Lettre manuscrite animee

**Files:**
- Create: `src/components/ending/HandwrittenLetter.tsx`

- [ ] **Step 1: Ecrire HandwrittenLetter**

```typescript
// src/components/ending/HandwrittenLetter.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HandwrittenLetterProps {
  text: string;
  onComplete: () => void;
}

const CHAR_SPEED = 50; // ms per character

export function HandwrittenLetter({ text, onComplete }: HandwrittenLetterProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipped) {
      setDisplayedChars(text.length);
      setIsComplete(true);
      return;
    }

    if (displayedChars >= text.length) {
      setIsComplete(true);
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDisplayedChars(prev => Math.min(prev + 1, text.length));
    }, CHAR_SPEED);

    return () => clearTimeout(timer);
  }, [displayedChars, text.length, skipped, onComplete]);

  const handleSkip = useCallback(() => {
    setSkipped(true);
  }, []);

  const displayedText = text.slice(0, displayedChars);

  return (
    <motion.div
      ref={containerRef}
      className="relative z-10 w-full max-w-md mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleSkip}
    >
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(30,26,36,0.8), rgba(20,16,30,0.9))',
          border: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <p
          className="font-handwritten text-cream/80 text-lg sm:text-xl leading-relaxed whitespace-pre-line"
          style={{ minHeight: 100 }}
        >
          {displayedText}
          {!isComplete && (
            <motion.span
              className="inline-block w-0.5 h-5 bg-gold ml-0.5 align-text-bottom"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </p>
      </div>

      {!isComplete && (
        <p className="text-cream-dark/15 text-[10px] text-center mt-3 font-body">
          tap pour tout reveler
        </p>
      )}

      {isComplete && !skipped && (
        <motion.p
          className="text-cream-dark/10 text-[10px] text-center mt-3 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          --
        </motion.p>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ending/HandwrittenLetter.tsx
git commit -m "feat: add HandwrittenLetter with character-by-character reveal"
```

---

### Task 15: EndingScene — Integration finale

**Files:**
- Modify: `src/components/ending/EndingScene.tsx`

- [ ] **Step 1: Ajouter les phases bilan, lettre, et l'integration complete**

```typescript
// src/components/ending/EndingScene.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { StarField } from './StarField';
import { ProgressiveReveal } from './ProgressiveReveal';
import { StatsBilan } from './StatsBilan';
import { HandwrittenLetter } from './HandwrittenLetter';
import { StarCatcherGame } from '../secrets/StarCatcherGame';
import { GemAnimation } from '../secrets/GemAnimation';
import { useInView } from '../../hooks/useInView';
import { useSecrets } from '../../context/SecretContext';
import { FloatingElements } from '../ui/FloatingElements';
import config from '../../config.json';

type Phase = 'waiting' | 'reveal' | 'bilan' | 'letter' | 'heart' | 'restart';

export function EndingScene() {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [ref, inView] = useInView({ threshold: 0.5 });
  const { getFoundCount, gem5, unlockGem } = useSecrets();
  const [showGame, setShowGame] = useState(false);
  const [showGem, setShowGem] = useState(false);
  const foundCount = getFoundCount();
  const hasAllGems = foundCount === 5;

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleGameComplete = (won: boolean) => {
    setShowGame(false);
    if (won && !gem5) {
      unlockGem(5);
      setShowGem(true);
    }
  };

  return (
    <SectionWrapper className="bg-warm-darkest min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#14101E] to-warm-darkest" />
      <StarField />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute inset-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {(!inView && phase === 'waiting') && (
          <motion.div key="waiting" className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="font-handwritten text-cream-dark/10 text-2xl">✨</p>
          </motion.div>
        )}

        {inView && phase === 'waiting' && (
          <ProgressiveReveal key="reveal"
            onComplete={() => setPhase('bilan')}
          />
        )}

        {phase === 'bilan' && (
          <StatsBilan key="bilan"
            onComplete={() => setPhase(hasAllGems ? 'letter' : 'heart')}
          />
        )}

        {phase === 'letter' && (
          <HandwrittenLetter key="letter"
            text={config.finalLetter}
            onComplete={() => setPhase('heart')}
          />
        )}

        {phase === 'heart' && (
          <motion.div key="heart" className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mt-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              onAnimationComplete={() => setTimeout(() => setPhase('restart'), 3000)}
            >
              <span className="text-3xl sm:text-4xl animate-heartbeat inline-block">❤️</span>
            </motion.div>
          </motion.div>
        )}

        {phase === 'restart' && (
          <motion.div key="restart" className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <motion.p className="font-serif italic text-cream/40 text-lg sm:text-xl mb-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
              avec tout mon amour,
            </motion.p>
            <motion.button
              className="font-body text-cream-dark/30 text-xs sm:text-sm tracking-wider hover:text-cream-dark/60 transition-colors duration-500 underline underline-offset-4 decoration-cream-dark/10"
              onClick={handleRestart}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
              revivre cette histoire
            </motion.button>
            {!hasAllGems && (
              <motion.button
                className="font-body text-gold/30 text-xs sm:text-sm tracking-wider hover:text-gold/60 transition-colors duration-500 underline underline-offset-4 decoration-gold/10 mt-4 block mx-auto"
                onClick={() => setShowGame(true)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
                decouvre un secret
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGame && (
          <StarCatcherGame
            onComplete={handleGameComplete}
            onClose={() => setShowGame(false)}
          />
        )}
      </AnimatePresence>

      <GemAnimation
        trigger={showGem}
        message={config.secrets.starCatcherMessage}
        onComplete={() => setShowGem(false)}
      />

      <FloatingElements type="heart" countDesktop={6} countMobile={3} />
    </SectionWrapper>
  );
}
```

- [ ] **Step 2: Verifier le build**

```bash
cd "/home/mattia/Documents/Perso/Youna Anniv" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ending/EndingScene.tsx
git commit -m "feat: integrate StatsBilan, HandwrittenLetter, and StarCatcher into EndingScene"
```

---

### Task 16: Integration finale et nettoyage

**Files:**
- Modify: `src/App.tsx` (verify all imports and providers)
- Verify: `tsconfig.json` (ensure strict mode compatible)

- [ ] **Step 1: Verifier App.tsx — tous les imports et wrappers**

- `SecretProvider` doit wrapper tout le contenu debloque
- `GemCounter` est rendu
- Tous les imports sont presents
- Verifier que l'ancien import de `EasterEggs` est toujours la

- [ ] **Step 2: TypeScript check complet**

```bash
cd "/home/mattia/Documents/Perso/Youna Anniv" && npx tsc --noEmit
```

Corriger les erreurs de type eventuelles.

- [ ] **Step 3: Build de production**

```bash
cd "/home/mattia/Documents/Perso/Youna Anniv" && npm run build
```

Verifier que le build se termine sans erreur.

- [ ] **Step 4: Test manuel — lancer le dev server**

```bash
cd "/home/mattia/Documents/Perso/Youna Anniv" && npm run dev
```

Tester :
- L'intro en 3 actes (HeartbeatGlow → "pour toi" → PortalButton)
- Cliquer sur le portail → explosion → contenu
- Le compteur 💎 apparait apres l'intro
- Taper les 5 cartes timeline dans l'ordre → gemme 1
- Long press sur le hotspot polaroid → gemme 2
- Ouvrir tous les OpenWhen → clavier → gemme 3 (MOT: "JETAIME")
- Visite nocturne simulee → gemme 4
- Scroller jusqu'a la fin → bouton "decouvre un secret" → mini-jeu → gemme 5
- Avec 5 gemmes → StatsBilan → HandwrittenLetter
- Sans toutes les gemmes → StatsBilan → bouton "decouvre un secret"

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: final integration of experience upgrade — intro, treasure hunt, climax"
```

---

### Task 17: Definir les valeurs utilisateur (A FAIRE AVEC L'UTILISATEUR)

**Files:**
- Modify: `src/config.json`

- [ ] **Step 1: Definir le mot de passe**

Demander a l'utilisateur quel mot il veut (max 7 lettres). Le mot est forme par les lettres dorees cachees dans les 8 messages OpenWhen. Ex: "JETAIME", "YOUYOU", "MONAMOUR".

- [ ] **Step 2: Definir la photo et la zone du hotspot**

Demander a l'utilisateur :
- Quelle photo (index 0-11 dans polaroids)
- Coordonnees approximatives en % (x, y) du point d'interet sur la photo
- Le message a afficher quand le hotspot est trouve

- [ ] **Step 3: Ecrire la lettre finale**

L'utilisateur ecrit le contenu de `config.finalLetter` — le message qui s'ecrira caractere par caractere a la fin si elle a toutes les gemmes.

- [ ] **Step 4: Commit**

```bash
git add src/config.json
git commit -m "config: define password, hotspot, and final letter"
```
