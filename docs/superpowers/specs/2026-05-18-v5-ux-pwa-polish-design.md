# Design Spec: UX, PWA & Polish Visuel — Youna Anniv v5

**Date:** 2026-05-18
**Status:** Approved

---

## 1. PWA & App-like Experience

### 1.1 manifest.json
- **name:** "Pour toi"
- **short_name:** "Pour toi"
- **theme_color:** "#1E1A24"
- **background_color:** "#1E1A24"
- **display:** standalone
- **orientation:** portrait
- **icons:** Generate a heart-shaped icon in gold (#D4AF37) on dark background at 192px and 512px. Use a simple SVG approach or generate PNGs.
- **Link in index.html:** `<link rel="manifest" href="/manifest.json">`

### 1.2 Service Worker
- **File:** `public/sw.js`
- **Strategy:** Cache-first for static assets (JS bundles, CSS, fonts, sounds, music, photos). On install, precache all known assets. On fetch, serve from cache, update cache in background.
- **Scope:** The SW should handle offline gracefully — if the user has visited once, the full experience is available without network.
- **Registration:** Add SW registration script in `index.html` or create a `registerSW.ts` helper called from `main.tsx`.

### 1.3 Apple Meta Tags
Add to `index.html`:
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<link rel="apple-touch-icon" href="/icon-192.png">`

### 1.4 App Icon
- Create a gold heart silhouette on dark background (SVG converted to PNG or use canvas generation).
- Place at `/public/icon-192.png` and `/public/icon-512.png`.

---

## 2. UX & Rejouabilite

### 2.1 Reset sans reload
- **Replace `window.location.reload()`** in the "Recommencer" / "Revivre" flow.
- New flow:
  1. Scroll to top with `window.scrollTo({top: 0, behavior: 'smooth'})`
  2. Fade-out curtain overlay (200ms opacity transition)
  3. Reset `SecretContext` state (clear all gems from context + localStorage)
  4. Fade-in curtain removal
  5. Scroll back to intro section (skip lock screen since unlock date has already passed)
- **Implementation:** Add a new action to `SecretContext` called `resetAll()` that clears localStorage keys and resets gem state. The App component watches for this and transitions.

### 2.2 Gem counter ameliore
- **Make GemCounter persistent** — always visible at bottom of screen, not just 5s after a gem is found.
- **Pulse animation** on transition from 4/5 to 5/5.
- **Completion message:** When all 5 gems are found, show a brief "✨ Tous les secrets sont reveles" overlay + 5-gem-circle animation + firework particles.
- Implementation: Modify `GemCounter.tsx` to be always visible, add a new `GemCompletionOverlay` component for the 5/5 celebration.

### 2.3 Password hint
- When the `SecretPassword` keyboard appears (after all 8 portals visited in OpenWhen):
  - Show a hint below the input: _"As-tu remarque les lettres dorees dans chaque message ?"_ in a subtle italic style.
- Implementation: Add a `hint` prop or state to `SecretPassword.tsx` that shows after a 3-second delay.

### 2.4 Navigation dots
- Add a vertical navigation indicator fixed on the right side of the screen.
- Each section gets a dot: Intro, Timeline, Polaroids, OpenWhen, Counter, Ending.
- Current section dot is gold, others are dim gray.
- Clicking a dot scrolls to that section.
- Implementation: New `SectionNavDots` component, uses `useScrollProgress` or `useSectionVisibility` hooks.

### 2.5 5/5 completion animation
- When the 5th gem is unlocked, trigger:
  1. A brief screen flash (gold)
  2. 5 gem icons animate in from edges, form a circle, pulse, then dissolve
  3. ~30-50 small gold particles burst from center
- Implementation: New `GemCompletionCelebration` component that mounts/unmounts with the 5-gem state.

---

## 3. Polish Visuel & Micro-interactions

### 3.1 Section transitions
- Enrich existing `SectionWrapper` to add a crossfade + slight vertical offset on section enter.
- Use Framer Motion `AnimatePresence` with `mode="wait"` or scroll-based triggers.
- Each major section gets: `opacity: 0 -> 1` + `transform: translateY(20px) -> translateY(0)` over 600ms with a gentle ease.

### 3.2 Parallax on polaroids
- Apply existing `ParallaxLayer` to `PolaroidCard` components.
- Each card moves 10-15px vertically at a different rate based on its position in the viewport.
- The parallax offset should be subtle — the photo is the focus, not the effect.

### 3.3 Page turn animation
- At the bottom of the Timeline horizontal scroll section, add a CSS 3D "page corner" effect.
- A subtle fold in the bottom-right corner that animates as the user reaches the end.
- Purely decorative, using `perspective` and `rotateX` CSS transforms.

### 3.4 Grain & vignette dynamics
- `GrainOverlay`: subtle increase in opacity on photo sections (polaroids, timeline).
- `DynamicVignette`: progressively darken at the very bottom of the page (last 70-100% scroll) to guide the eye.
- Both should be more prominent on the polaroid/timeline image-heavy sections.

### 3.5 Accessibility
- Add `<script>` at the end of `index.html` or in `main.tsx` that checks `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- If true: disable `FloatingElements`, reduce `ReactiveParticles` count by 90%, skip parallax effects, reduce animation durations.
- Add this as a context or a simple CSS class `reduced-motion` on `<html>` that components can check.

---

## Implementation Order

| Phase | What | Est. Time |
|-------|------|-----------|
| **Phase 1** | PWA: manifest, SW, icons, meta tags | 30 min |
| **Phase 2** | UX: Reset, gem counter, password hint, nav dots, 5/5 animation | 45 min |
| **Phase 3** | Polish: Parallax, transitions, page-turn, a11y | 30 min |

---

## Files to modify
- `index.html` — manifest link, apple meta tags, SW registration
- `public/manifest.json` — NEW
- `public/sw.js` — NEW
- `public/icon-192.png` — NEW
- `public/icon-512.png` — NEW
- `src/main.tsx` — SW registration, reduced motion check
- `src/App.tsx` — reset flow, nav dots, 5/5 celebration
- `src/context/SecretContext.tsx` — resetAll action
- `src/components/secrets/GemCounter.tsx` — persistent, pulse, completion
- `src/components/secrets/GemCompletionOverlay.tsx` — NEW
- `src/components/secrets/SecretPassword.tsx` — hint text
- `src/components/ui/SectionNavDots.tsx` — NEW
- `src/components/ui/SectionWrapper.tsx` — enriched transitions
- `src/components/polaroid/PolaroidCard.tsx` — parallax wrapper
- `src/components/ui/GrainOverlay.tsx` — dynamic intensity
- `src/components/ui/DynamicVignette.tsx` — bottom-of-page darkening
- `src/index.css` — any new keyframes/styles needed
