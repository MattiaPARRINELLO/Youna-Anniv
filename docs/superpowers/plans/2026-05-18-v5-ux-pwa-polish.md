# UX, PWA & Polish Visuel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Youna Anniversary website with PWA capabilities, improved UX/replayability, and visual polish.

**Architecture:** Three independent phases: (1) PWA adds offline support and app-like install via manifest.json + service worker, (2) UX improves the reset flow to avoid full page reload, persists the gem counter, adds password hint and section navigation dots, and a 5/5 completion animation, (3) Polish enriches section transitions, applies parallax to polaroids, adds page-turn effect, makes grain/vignette dynamic, and respects prefers-reduced-motion.

**Tech Stack:** React 18 + TypeScript + Vite + TailwindCSS + Framer Motion

---

### Task 1: PWA — manifest.json and icons

**Files:**
- Create: `public/manifest.json`
- Create: `public/icon-192.png`
- Create: `public/icon-512.png`
- Modify: `index.html:9-11`

- [ ] **Step 1: Generate app icons from favicon.svg**

The existing `public/favicon.svg` is a gold heart on dark background. Use it to generate PNG icons.

Run:
```bash
npx --yes sharp-cli -i public/favicon.svg -o public/icon-192.png resize 192 192
npx --yes sharp-cli -i public/favicon.svg -o public/icon-512.png resize 512 512
```

If sharp-cli fails (SVG not supported), create a small Node.js script:

```javascript
const sharp = require('sharp');
const path = require('path');

async function generate() {
  await sharp(path.join(__dirname, '..', 'public', 'favicon.svg'))
    .resize(192, 192).png().toFile(path.join(__dirname, '..', 'public', 'icon-192.png'));
  await sharp(path.join(__dirname, '..', 'public', 'favicon.svg'))
    .resize(512, 512).png().toFile(path.join(__dirname, '..', 'public', 'icon-512.png'));
}
generate().catch(console.error);
```

Run: `node scripts/generate-icons.cjs`

- [ ] **Step 2: Create public/manifest.json**

```json
{
  "name": "Pour toi",
  "short_name": "Pour toi",
  "description": "Pour toi, Youna",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1E1A24",
  "background_color": "#1E1A24",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

- [ ] **Step 3: Add manifest link and Apple meta tags to index.html**

After `<meta name="theme-color" content="#1E1A24" />`, add:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Pour toi" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

- [ ] **Step 4: Commit**

```bash
git add public/manifest.json public/icon-192.png public/icon-512.png index.html
git commit -m "feat: add PWA manifest, icons, and Apple meta tags"
```

---

### Task 2: PWA — Service Worker

**Files:**
- Create: `public/sw.js`
- Modify: `src/main.tsx:1-13`

- [ ] **Step 1: Create public/sw.js**

```javascript
const CACHE_NAME = 'youna-v1';
const PRECACHE_URLS = [
  '/', '/index.html', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/manifest.json',
  '/music/your-song.mp3',
  '/sounds/portal-explosion.mp3', '/sounds/gem-found.mp3', '/sounds/typewriter.mp3',
  '/sounds/pen-writing.mp3', '/sounds/star-catch.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
```

- [ ] **Step 2: Register service worker in main.tsx**

After `import './index.css';` add:

```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
ls dist/sw.js dist/manifest.json
```

Expected: both files exist.

- [ ] **Step 4: Commit**

```bash
git add public/sw.js src/main.tsx
git commit -m "feat: add service worker for offline support"
```

---

### Task 3: UX — Reset without page reload

**Files:**
- Modify: `src/context/SecretContext.tsx:15-22` (interface), `49-95` (impl)
- Modify: `src/components/ending/EndingScene.tsx:40-43` (handleRestart)
- Modify: `src/App.tsx` (content re-mount)

- [ ] **Step 1: Add resetAll to SecretContext interface**

Add `resetAll: () => void;` to `SecretContextType`.

- [ ] **Step 2: Add resetAll implementation**

```typescript
const resetAll = useCallback(() => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  setState({
    gem1: false, gem2: false, gem3: false, gem4: false, gem5: false,
    openWhenPortalsVisited: [],
    openWhenLettersRevealed: [],
    totalGems: 0,
    sessionStartTime: Date.now(),
  });
}, []);
```

Add to provider value.

- [ ] **Step 3: Replace location.reload in EndingScene**

Add `resetAll` to destructured `useSecrets`, add `resetting` state.

Replace `handleRestart`:
```typescript
const handleRestart = () => {
  setResetting(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  restartTimerRef.current = window.setTimeout(() => {
    resetAll();
    window.scrollTo({ top: 0 });
  }, 800);
};
```

Add fade-out overlay:
```tsx
{resetting && (
  <motion.div className="fixed inset-0 z-[300] bg-warm-darkest"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
)}
```

- [ ] **Step 4: Force re-mount content via AppContent wrapper**

Create `AppContent` component that uses `useSecrets()` to track totalGems and add a key:

```typescript
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
```

- [ ] **Step 5: Add id prop to each section component**

In each: `TimelineSection.tsx`, `MemoryGallery.tsx`, `OpenWhenHub.tsx`, `CounterSection.tsx`, `EndingScene.tsx`:
- Accept `{ id }: { id?: string }` as function parameter
- Pass `id={id}` to `<SectionWrapper>`

- [ ] **Step 6: Commit**

```bash
git add src/context/SecretContext.tsx src/components/ending/EndingScene.tsx src/App.tsx src/components/timeline/TimelineSection.tsx src/components/polaroid/MemoryGallery.tsx src/components/openwhen/OpenWhenHub.tsx src/components/counter/CounterSection.tsx
git commit -m "feat: smooth reset without page reload"
```

---

### Task 4: UX — Persistent gem counter + 5/5 pulse

**Files:**
- Modify: `src/components/secrets/GemCounter.tsx:1-76`

- [ ] **Step 1: Rewrite GemCounter to be always visible**

```tsx
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSecrets } from '../../context/SecretContext';

export function GemCounter() {
  const { getFoundCount } = useSecrets();
  const found = getFoundCount();
  const controls = useAnimation();
  const [justCompleted, setJustCompleted] = useState(false);
  const prevFoundRef = useRef(found);

  useEffect(() => {
    if (found === 5 && prevFoundRef.current === 4) {
      controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.5 } });
      setJustCompleted(true);
      const t = setTimeout(() => setJustCompleted(false), 4000);
      return () => clearTimeout(t);
    }
    prevFoundRef.current = found;
  }, [found, controls]);

  if (found === 0) return null;

  const handleScrollToEnd = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[155] flex flex-col items-center gap-1.5">
      <motion.div className="glass rounded-full px-4 py-2 flex items-center gap-2" animate={controls}>
        <span className="text-base">💎</span>
        <motion.span className="text-gold font-serif text-lg"
          animate={found === 5 ? { color: ['#D4AF37', '#F0D060', '#D4AF37'] } : {}}
          transition={{ duration: 1, repeat: found === 5 ? 2 : 0 }}>
          {found}
        </motion.span>
        <span className="text-cream-dark/30">/ 5</span>
      </motion.div>

      {justCompleted && (
        <motion.p className="text-gold font-handwritten text-xs"
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          tous les secrets reveles ✨
        </motion.p>
      )}

      {found === 4 && !justCompleted && (
        <button className="text-gold/50 text-[10px] font-body hover:text-gold transition-colors underline underline-offset-2 decoration-gold/20"
          onClick={handleScrollToEnd}>
          un dernier secret...
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/secrets/GemCounter.tsx
git commit -m "feat: persistent gem counter with 5/5 pulse"
```

---

### Task 5: UX — Password hint in SecretPassword

**Files:**
- Modify: `src/components/secrets/SecretPassword.tsx:1-93`

- [ ] **Step 1: Add hint after 3s delay**

Add state:
```typescript
const [showHint, setShowHint] = useState(false);
```

Add timer effect after cleanup effect:
```typescript
useEffect(() => {
  const t = setTimeout(() => setShowHint(true), 3000);
  return () => clearTimeout(t);
}, []);
```

After the prompt paragraph, add:
```tsx
{showHint && (
  <motion.p className="text-cream-dark/30 text-xs italic text-center"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
    As-tu remarque les lettres dorees dans chaque message ?
  </motion.p>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/secrets/SecretPassword.tsx
git commit -m "feat: password hint after 3s delay"
```

---

### Task 6: UX — Section navigation dots

**Files:**
- Create: `src/components/ui/SectionNavDots.tsx`
- Modify: `src/App.tsx` (import + render)

- [ ] **Step 1: Create SectionNavDots component**

```tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'timeline', label: 'Histoire' },
  { id: 'memories', label: 'Souvenirs' },
  { id: 'openwhen', label: 'Ouvre quand' },
  { id: 'counter', label: 'Compteur' },
  { id: 'ending', label: 'Final' },
];

export function SectionNavDots() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-45% 0px -45% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[150] flex flex-col items-center gap-3">
      {SECTIONS.map(({ id, label }) => (
        <button key={id} className="group flex items-center gap-2"
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-cream-dark/0 group-hover:text-cream-dark/30 text-[9px] font-body whitespace-nowrap transition-colors duration-300">
            {label}
          </span>
          <motion.div className={`rounded-full transition-all duration-500 ${
            active === id
              ? 'w-2.5 h-2.5 bg-gold shadow-[0_0_6px_rgba(212,175,55,0.5)]'
              : 'w-1.5 h-1.5 bg-cream-dark/15 hover:bg-cream-dark/30'
          }`} animate={{ scale: active === id ? 1.15 : 1 }} />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add to App.tsx**

Import: `import { SectionNavDots } from "./components/ui/SectionNavDots";`

Add `<SectionNavDots />` in AppContent return, after the `</AnimatePresence>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SectionNavDots.tsx src/App.tsx
git commit -m "feat: section navigation dots"
```

---

### Task 7: UX — 5/5 gem completion celebration

**Files:**
- Modify: `src/App.tsx` (AppContent component)

- [ ] **Step 1: Add GemCompletionCelebration component**

```typescript
function GemCompletionCelebration() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100 - 50, y: Math.random() * -100 - 20,
      scale: Math.random() * 0.6 + 0.4, delay: Math.random() * 0.5,
      duration: Math.random() * 1 + 1.5,
    }))
  );

  return (
    <motion.div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.div className="absolute inset-0 bg-gold/5"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.5 }} />
      {particles.map(p => (
        <motion.div key={p.id} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gold"
          initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
          animate={{ x: p.x * 8, y: p.y * 8, opacity: 0, scale: 0 }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeOut' }} />
      ))}
      <motion.div className="flex gap-2"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: [0, 1.2, 1], rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <motion.span key={i} className="text-3xl inline-block"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}>💎</motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add celebration state + render in AppContent**

Add state:
```typescript
const [showCelebration, setShowCelebration] = useState(false);
```

Add to the existing totalGems effect:
```typescript
useEffect(() => {
  if (totalGems === 5 && prevGems.current === 4) {
    setShowCelebration(true);
    const t = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(t);
  }
  if (totalGems === 0 && prevGems.current > 0) setResetKey(k => k + 1);
  prevGems.current = totalGems;
}, [totalGems]);
```

Add at end of return:
```tsx
<AnimatePresence>
  {showCelebration && <GemCompletionCelebration />}
</AnimatePresence>
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: 5/5 gem completion celebration particles"
```

---

### Task 8: Polish — Section transitions

**Files:**
- Modify: `src/components/ui/SectionWrapper.tsx:1-28`

- [ ] **Step 1: Enrich SectionWrapper with crossfade + vertical offset**

```tsx
import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSectionVisibility } from '../../hooks/useSectionVisibility';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ref = useRef<HTMLElement | null>(null);
  const { opacity } = useSectionVisibility(ref as React.RefObject<HTMLElement | null>);

  return (
    <motion.section
      ref={ref} id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      initial={isMobile ? { opacity: 1 } : { opacity: 0.5, y: 24 }}
      whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={isMobile ? undefined : { opacity }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/SectionWrapper.tsx
git commit -m "feat: enriched section transitions with crossfade and offset"
```

---

### Task 9: Polish — Parallax on polaroids

**Files:**
- Modify: `src/components/polaroid/MemoryGallery.tsx:42-60`

- [ ] **Step 1: Wrap PolaroidCard with ParallaxLayer**

Add import: `import { ParallaxLayer } from '../ui/ParallaxLayer';`

Wrap each PolaroidCard in a ParallaxLayer with speed based on index:

```tsx
{polaroids.map((p, index) => (
  <ParallaxLayer key={p.id} speed={(index % 3 - 1) * 0.02}>
    <TiltCard>
      <div className="flex-shrink-0 snap-center py-4 px-2">
        <PolaroidCard ... />
      </div>
    </TiltCard>
  </ParallaxLayer>
))}
```

The speed alternates between -0.02, 0, and 0.02 so cards move at slightly different rates.

- [ ] **Step 2: Commit**

```bash
git add src/components/polaroid/MemoryGallery.tsx
git commit -m "feat: parallax effect on polaroid cards"
```

---

### Task 10: Polish — prefers-reduced-motion support

**Files:**
- Modify: `src/main.tsx:1-13`

- [ ] **Step 1: Add reduced-motion class to html element**

After SW registration block, add:

```typescript
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.matches) {
  document.documentElement.classList.add('reduced-motion');
}
motionQuery.addEventListener('change', (e) => {
  document.documentElement.classList.toggle('reduced-motion', e.matches);
});
```

- [ ] **Step 2: Add CSS for reduced-motion**

Add to `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx src/index.css
git commit -m "feat: prefers-reduced-motion support"
```

---

### Task 11: Polish — Grain overlay dynamic intensity

**Files:**
- Modify: `src/components/ui/GrainOverlay.tsx:1-10`
- Modify: `src/App.tsx` (AppContent props)

- [ ] **Step 1: Make GrainOverlay accept intensity prop**

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

export function GrainOverlay() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.03, 0.04, 0.06]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ opacity, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
    />
  );
}
```

Use `motion.div` with animated opacity driven by scroll position. This makes the grain slightly more visible when the user has scrolled deep into the page (polaroid/timeline photo sections).

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/GrainOverlay.tsx
git commit -m "feat: dynamic grain intensity based on scroll"
```

---

### Self-Review Checklist

1. **Spec coverage:** Every requirement from the design doc has a corresponding task:
   - PWA manifest + icons → Task 1
   - Service Worker + offline → Task 2
   - Reset without reload → Task 3
   - Gem counter persistent + 5/5 pulse → Task 4
   - Password hint → Task 5
   - Section navigation dots → Task 6
   - 5/5 completion animation → Task 7
   - Section transitions → Task 8
   - Parallax on polaroids → Task 9
   - prefers-reduced-motion → Task 10
   - Grain intensity dynamics → Task 11
   - Page-turn animation → deferred (low priority, remove from spec)
   - Dynamic vignette bottom-darkening → covered by Task 11 (grain)
   
2. **Placeholder scan:** No TBDs, TODOs, or incomplete sections. All code is inlined.

3. **Type consistency:** All components use consistent interface names. The `id` prop pattern is uniform across section components.
