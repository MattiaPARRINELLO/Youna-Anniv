# Youna — Design Document

**Date**: 2026-05-12
**Topic**: Romantic Private Website — Cinematic Scrapbook Experience
**Status**: Approved

---

## Overview

A deeply emotional, mobile-first, single-page React website for Youna. The experience is a digital memory box — intimate, handcrafted, cinematic. Accessed via QR code. Every design decision reinforces warmth, nostalgia, love, and intimacy.

### Core Metaphor

A scrapbook / journal intime that comes alive through scroll and touch. Like someone poured their heart into an interactive world.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18+ |
| Bundler | Vite |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Routing | react-router-dom (for auto-generated Open When routes) |
| Icons | react-icons |
| Typewriter | react-type-animation |
| Map | Leaflet + react-leaflet |
| Scroll detection | react-intersection-observer |

---

## Visual Direction

### Color Palette

- **Cream / Warm Paper**: `#FFF8EC`, `#F5E6C8`, `#E8D5B7` — backgrounds, paper texture
- **Warm Yellow / Gold**: `#D4A853`, `#E8C97A`, `#C49B3E` — accents, warmth, light
- **Soft Violet**: `#7B6B8A`, `#9B8BAA`, `#6B5B7A` — emotional depth, night
- **Warm Dark**: `#2A2432`, `#3D3648`, `#1E1A24` — ending scene, depth

### Typography

| Role | Font | Style |
|------|------|-------|
| Emotional titles | Playfair Display (Google Fonts) | Serif, elegant, cinematic |
| Captions, intimate notes | Caveat (Google Fonts) | Handwritten, personal |
| Body text | Inter (Google Fonts) | Clean, readable |

### Atmosphere

- Soft grain/texture overlay
- Subtle floating particles (golden)
- Warm vignette on dark sections
- Paper textures on light sections
- Smooth fades, no harsh transitions
- Tactile shadows (like real objects on a table)

---

## Architecture: Approach C — Vertical Scroll + Horizontal Galleries

### Global Structure

```
App
├── MusicProvider          (audio context, persists across sections)
├── IntroScene             (hero — full viewport)
│   ├── FloatingParticles
│   ├── GrainOverlay
│   └── TypewriterText
├── TimelineSection        (vertical trigger → horizontal swipe)
│   ├── TimelineCard ×5
│   │   ├── PolaroidPhoto
│   │   └── HiddenMessage (tap to reveal)
│   └── ProgressDots
├── MemoryGallery          (vertical trigger → horizontal swipe)
│   ├── PolaroidCard ×N (reusable)
│   ├── TapeDecoration
│   └── HiddenMessage (long press)
├── OpenWhenHub            (grid of emotional portals)
│   ├── PortalCard ×8
│   └── OpenWhenPortal     (fullscreen overlay, generated from JSON)
│       ├── ThemeBackground
│       ├── AnimatedMessage
│       ├── PhotoGallery (optional)
│       └── HiddenSurprise
├── MapSection             (fullscreen overlay)
│   ├── EmotionalMarker ×2
│   └── MemoryPopup
├── EndingScene            (final climax)
│   ├── StarField
│   ├── ProgressiveReveal
│   └── HeartAnimation
├── MusicPlayer            (fixed bottom bar)
└── SecretEasterEggs       (global, scattered across sections)
```

### Navigation Flow

1. **Intro** (vertical scroll ↓)
2. **Timeline** (horizontal swipe → on 5 cards)
3. **Polaroid Gallery** (horizontal swipe → on N cards)
4. **Open When Hub** (vertical ↓ through 2×4 grid → tap opens fullscreen portal)
5. **Map** (vertical ↓ → tap opens fullscreen overlay)
6. **Ending** (vertical ↓ → auto-sequence, no scroll needed)

---

## Section Details

### 1. Intro Scene

**Purpose**: Immediate emotional connection upon landing.

**Design**:
- Full viewport, dark warm background
- Golden floating particles drifting upward
- Subtle grain overlay (CSS noise)
- Text fades in progressively (typewriter + fade)
- Tone: intimate, calm, sincere
- Duration: ~15-20s before scroll hint appears
- Text appears centered, Playfair Display, warm gold

**Example Text**:
```
parfois,
on rencontre quelqu'un
et le monde devient
un peu plus doux
un peu plus lumineux
un peu plus vivant

cette petite chose
c'est pour toi
```

**Animations**:
- Particles: perpetual gentle upward drift
- Text: sequential fade-in, 2-3s delay between lines
- Vignette: warm radial gradient at edges

### 2. Timeline Section

**Purpose**: Tell the story of the relationship chronologically.

**Dates** (from data file):
| Date | Event |
|------|-------|
| 23 Oct 2025 | Première rencontre |
| 20 Fév 2026 | Premier appel |
| 16 Mars 2026 | Début de la relation |
| 16 Mai 2026 | Première rencontre IRL |
| 22 Mai 2026 | Anniversaire de Youna |

**Interaction**:
- Section triggers when scrolled into view
- Horizontal swipe to navigate between 5 cards
- Snap-to-center (one card at a time)
- Progress dots at bottom
- Each card: date (large), title, photo placeholder, tap to reveal hidden message
- Style: journal card on paper texture

**States**:
- Default: card with photo and date
- Tap: hidden message slides in from bottom
- End of timeline: "et ce n'est que le début..."

### 3. Polaroid Memory Gallery

**Purpose**: Tactile, physical-feeling collection of shared memories.

**Component**: `PolaroidCard` — reusable

**Props**:
```typescript
interface PolaroidCardProps {
  image: string;
  caption: string;
  date?: string;
  rotation?: number;        // -3 to +3 degrees
  hiddenMessage?: string;   // revealed on long-press
  tapeStyle?: 'top' | 'side' | 'both';
}
```

**Visual Design**:
- White/cream card with wide bottom margin (classic polaroid)
- Photo area on top
- Handwritten caption (Caveat font) below
- Slight random rotation
- Soft shadow (like laying on a surface)
- Masking tape decoration in corners
- Subtle perpetual float animation

**Interaction**:
- Horizontal swipe to browse
- Tap: lightbox zoom
- Long press (>500ms): hidden message fades in over the photo
- Tilt parallax (deviceorientation, optional)

### 4. Open When Hub & Portals

**Purpose**: Auto-generated emotional experiences from JSON data.

**Hub Design**:
- 2×4 grid of portal cards
- Each card: emoji + short title
- Glassmorphism style (dark frosted glass)
- Staggered appear animation on scroll
- Hover/tap: subtle golden glow pulse

**Portal (Fullscreen Overlay)**:
- Slides up from bottom
- Themed background animation (rain, stars, sunset, etc.)
- Message centered, progressively appearing
- Optional photo(s)
- Optional audio clip
- Hidden surprise triggered by specific interaction
- Close button (×) top right

**JSON Schema**:
```typescript
interface OpenWhenEntry {
  slug: string;           // URL-safe ID
  title: string;          // "Ouvre quand tu es triste"
  emoji: string;          // "🌧️"
  message: string;        // Emotional text
  theme: ThemeType;       // "rain" | "stars" | "sunset" | "night" | "cozy" | "waves" | "aurora" | "golden"
  photos?: string[];      // Optional photo paths
  audio?: string;         // Optional audio path
  surprise?: {
    type: 'hidden_message' | 'photo_reveal' | 'audio_clip';
    trigger: 'tap_3_times' | 'long_press' | 'swipe_up';
    content: string;
  };
}
```

**8 Scenarios**:
1. 🌧️ Quand tu es triste (theme: rain)
2. 💭 Quand tu doutes de toi (theme: stars)
3. 🌙 Quand tu n'arrives pas à dormir (theme: night)
4. ☀️ Quand le soleil brille (theme: sunset)
5. 🫂 Quand tu te sens seule (theme: cozy)
6. 🌊 Quand tout va trop vite (theme: waves)
7. 💪 Quand tu as besoin de courage (theme: aurora)
8. ❤️ Juste parce que je t'aime (theme: golden)

**Theme Backgrounds**:
| Theme | Visual |
|-------|--------|
| rain | Falling raindrops with subtle blue-grey gradient |
| stars | Twinkling star field on deep violet |
| sunset | Warm orange-to-pink gradient with soft light effect |
| night | Dark calm night with a single moon glow |
| cozy | Warm room feel with soft amber lighting |
| waves | Gentle undulating waves on cream/turquoise |
| aurora | Subtle gradient bands shifting slowly |
| golden | Floating golden particles, warm glow |

### 5. Map Section

**Purpose**: Sentimental map of important places.

**Locations**:
1. 💫 Lieu de la première rencontre IRL — 16 Mai 2026
2. 🌹 Lieu du premier rendez-vous officiel

**Design**:
- Opens as fullscreen overlay from a map card in the scroll
- Leaflet.js with dark/vintage tile theme
- Custom heart/star markers (not default pins)
- Tap marker → popup with photo + emotional message
- Background blurs behind popup
- Minimal zoom (mobile friendly)
- Close button to return to scroll

**Popup Content**:
- Small photo
- Date
- Title ("Notre première rencontre")
- Emotional text (2-4 lines)
- Close on tap outside

### 6. Ending Scene

**Purpose**: The emotional climax. Must be perfect.

**Sequence** (all automatic, ~30-40 seconds):

1. **Background**: Deep night sky with subtle twinkling stars
2. **Silence** (~3s): Just the stars, minimal music
3. **Phase 1**: First lines appear one by one
   - "avant toi"
   - "je ne savais pas"
   - Pause
   - "que le monde pouvait être"
   - "aussi doux"
4. **Pause** (~3s): Stars, breathing room
5. **Climax**: "merci d'exister" — larger, golden, centered
6. **Heart**: Subtle heart animation (beat 2-3 times gently)
7. **Restart**: Small text link below: "revivre cette histoire"
   - Scrolls back to top, resets animations

**Typography**: Playfair Display, golden on dark
**No scroll**: Everything is timed, the viewer just receives
**Music**: Slightly lowered volume, maintains continuity

### 7. Music Player

**Design**:
- Fixed bottom bar
- Glassmorphism (backdrop-blur, dark translucent)
- Minimal: play/pause + volume
- Volume slider appears on tap (expand animation)
- Pulse animation when playing
- Unobtrusive, elegant

**Behavior**:
- Autoplay blocked until first user interaction (browser policy)
- After first tap/scroll anywhere → music fades in
- Smooth volume transitions
- Persists across all sections (MusicProvider context)
- Handles user's custom audio file

### 8. Easter Eggs & Hidden Secrets

| Secret | Trigger | Effect |
|--------|---------|--------|
| Star whisper | Tap a specific star 5 times | Hidden love message appears |
| Hidden letter | Long press on 3rd polaroid | Full letter reveals |
| Konami-like code | Tap top-left corner 3×, bottom-right 2× | Unlocks secret page |
| Floating symbol | Randomly appears anywhere | Tap = surprise message |
| Time-based message | Checks system time | Different message at night vs day |
| Scroll to bottom secret | Scroll past ending | Hidden "P.S." message |

---

## Data Architecture

### File Structure
```
src/
├── components/
│   ├── intro/
│   │   ├── IntroScene.tsx
│   │   ├── FloatingParticles.tsx
│   │   ├── GrainOverlay.tsx
│   │   └── TypewriterText.tsx
│   ├── timeline/
│   │   ├── TimelineSection.tsx
│   │   ├── TimelineCard.tsx
│   │   └── ProgressDots.tsx
│   ├── polaroid/
│   │   ├── MemoryGallery.tsx
│   │   ├── PolaroidCard.tsx
│   │   └── TapeDecoration.tsx
│   ├── openwhen/
│   │   ├── OpenWhenHub.tsx
│   │   ├── PortalCard.tsx
│   │   ├── OpenWhenPortal.tsx
│   │   └── ThemeBackground.tsx
│   ├── map/
│   │   ├── MapSection.tsx
│   │   ├── EmotionalMarker.tsx
│   │   └── MemoryPopup.tsx
│   ├── ending/
│   │   ├── EndingScene.tsx
│   │   ├── StarField.tsx
│   │   ├── ProgressiveReveal.tsx
│   │   └── HeartAnimation.tsx
│   ├── music/
│   │   ├── MusicProvider.tsx
│   │   └── MusicPlayer.tsx
│   ├── secrets/
│   │   └── EasterEggs.tsx
│   └── ui/
│       ├── SectionWrapper.tsx
│       └── FadeInOnScroll.tsx
├── data/
│   ├── timeline.json
│   ├── polaroids.json
│   ├── openwhen.json
│   ├── mapLocations.json
│   └── messages.json
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   └── useMediaQuery.ts
├── context/
│   └── MusicContext.tsx
├── App.tsx
├── main.tsx
└── index.css
```

### Data Files

All personal content lives in `src/data/*.json` for easy editing without touching components.

---

## Responsive Strategy

- **Mobile-first**: Primary target is smartphones (375-414px width)
- Horizontal sections (timeline, polaroids): full-width cards, swipe
- Desktop: centered content with max-width, larger typography
- Touch-optimized: large tap targets, swipe gestures
- No hover-dependent interactions (mobile unsafe)

---

## Performance

- Lazy-load sections below the fold
- Image optimization (WebP format, lazy loading)
- Framer Motion `layout` animations for smooth transitions
- CSS containment on off-screen sections
- Lightweight particle system (CSS, not canvas for mobile perf)

---

## Edge Cases

- No music file provided → player hidden gracefully
- No photos yet → graceful placeholders with paper texture
- Browser blocks autoplay → "tap anywhere to begin" hint
- Offline → all assets bundled, no external API calls
- Slow connection → progressive loading, skeleton states
- Accessibility → readable fonts, sufficient contrast, alt text

---

## Out of Scope

- User accounts / login
- Database / backend
- Photo upload (photos are bundled assets)
- Social sharing (this is private)
- Analytics / tracking
- Multi-language (French only)
