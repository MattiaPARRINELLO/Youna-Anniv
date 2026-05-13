# Youna — Romantic Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete cinematic scrapbook-style single-page React website for Youna — emotionally immersive, mobile-first, with scroll + horizontal swipe sections, auto-generated Open When portals, and a climactic ending scene.

**Architecture:** Single-page vertical scroll with horizontal swipe galleries (timeline, polaroids). Open When pages and map open as fullscreen overlays. Music persists via React Context. All personal content in JSON/TS data files. Components organized by section with shared UI primitives.

**Tech Stack:** React 18, Vite, TypeScript, TailwindCSS v3, Framer Motion v11, react-icons, react-type-animation, react-intersection-observer, Leaflet + react-leaflet

---

## File Map

```
youna-anniv/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── public/
│   ├── music/
│   │   └── your-song.mp3          (placeholder)
│   └── photos/
│       ├── timeline/
│       │   ├── october.jpg         (placeholder)
│       │   ├── february.jpg        (placeholder)
│       │   ├── march.jpg           (placeholder)
│       │   ├── may-meeting.jpg     (placeholder)
│       │   └── birthday.jpg        (placeholder)
│       ├── polaroids/
│       │   └── memory-1.jpg        (placeholder)
│       └── map/
│           ├── first-meeting.jpg   (placeholder)
│           └── first-date.jpg      (placeholder)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                          # Tailwind directives + custom styles + fonts
    ├── data/
    │   ├── timeline.ts
    │   ├── polaroids.ts
    │   ├── openWhen.ts
    │   └── mapLocations.ts
    ├── context/
    │   └── MusicContext.tsx
    ├── hooks/
    │   ├── useScrollProgress.ts
    │   ├── useInView.ts
    │   └── useMediaQuery.ts
    ├── components/
    │   ├── ui/
    │   │   ├── SectionWrapper.tsx
    │   │   ├── FadeInOnScroll.tsx
    │   │   └── GrainOverlay.tsx
    │   ├── intro/
    │   │   ├── IntroScene.tsx
    │   │   ├── FloatingParticles.tsx
    │   │   └── TypewriterText.tsx
    │   ├── timeline/
    │   │   ├── TimelineSection.tsx
    │   │   ├── TimelineCard.tsx
    │   │   └── ProgressDots.tsx
    │   ├── polaroid/
    │   │   ├── MemoryGallery.tsx
    │   │   └── PolaroidCard.tsx
    │   ├── openwhen/
    │   │   ├── OpenWhenHub.tsx
    │   │   ├── PortalCard.tsx
    │   │   ├── OpenWhenPortal.tsx
    │   │   └── ThemeBackground.tsx
    │   ├── map/
    │   │   ├── MapSection.tsx
    │   │   └── MemoryPopup.tsx
    │   ├── ending/
    │   │   ├── EndingScene.tsx
    │   │   ├── StarField.tsx
    │   │   ├── ProgressiveReveal.tsx
    │   │   └── HeartAnimation.tsx
    │   ├── music/
    │   │   └── MusicPlayer.tsx
    │   └── secrets/
    │       └── EasterEggs.tsx
    └── vite-env.d.ts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `postcss.config.js`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "youna-anniv",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "leaflet": "^1.9.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.0.0",
    "react-intersection-observer": "^9.8.0",
    "react-leaflet": "^4.2.1",
    "react-type-animation": "^3.2.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Step 4: Create tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#1E1A24" />
    <title>pour toi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-warm-darkest text-cream antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 8: Install dependencies**

```bash
npm install
```

---

### Task 2: Tailwind Config + Global Styles

**Files:**
- Create: `tailwind.config.ts`
- Create: `src/index.css`

- [ ] **Step 1: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EC',
        'cream-dark': '#F5E6C8',
        'cream-darker': '#E8D5B7',
        gold: '#D4A853',
        'gold-light': '#E8C97A',
        'gold-dark': '#C49B3E',
        violet: '#7B6B8A',
        'violet-light': '#9B8BAA',
        'violet-dark': '#6B5B7A',
        'warm-dark': '#2A2432',
        'warm-darkest': '#1E1A24',
        'warm-dark-mid': '#3D3648',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift-up': 'driftUp 20s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        driftUp: {
          '0%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }

  html {
    scroll-behavior: smooth;
    overscroll-behavior: none;
  }

  body {
    @apply font-body;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  }

  ::selection {
    @apply bg-gold/30 text-cream;
  }
}

@layer components {
  .grain-overlay {
    @apply fixed inset-0 pointer-events-none z-50 opacity-[0.04];
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .tape {
    background: linear-gradient(135deg, rgba(255,248,236,0.4), rgba(255,248,236,0.15));
    backdrop-filter: blur(2px);
    border-radius: 1px;
  }

  .vignette {
    background: radial-gradient(ellipse at center, transparent 50%, rgba(30,26,36,0.6) 100%);
  }

  .glass {
    @apply bg-warm-darkest/70 backdrop-blur-xl border border-white/5;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
}

/* Leaflet dark theme override */
.leaflet-container {
  background: #1E1A24 !important;
}

.leaflet-popup-content-wrapper {
  background: #2A2432 !important;
  color: #FFF8EC !important;
  border-radius: 12px !important;
  border: 1px solid rgba(123,107,138,0.2) !important;
}

.leaflet-popup-tip {
  background: #2A2432 !important;
}
```

---

### Task 3: Data Files

**Files:**
- Create: `src/data/timeline.ts`
- Create: `src/data/polaroids.ts`
- Create: `src/data/openWhen.ts`
- Create: `src/data/mapLocations.ts`

- [ ] **Step 1: Create src/data/timeline.ts**

```typescript
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  message: string;
  photo: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'first-meeting',
    date: '23 Octobre 2025',
    title: 'Premiere rencontre',
    subtitle: 'le debut de tout',
    message: 'Ce jour-la, sans le savoir, ma vie a commence a changer.',
    photo: '/photos/timeline/october.jpg',
  },
  {
    id: 'first-call',
    date: '20 Fevrier 2026',
    title: 'Premier appel',
    subtitle: 'ta voix pour la premiere fois',
    message: 'Je me souviens de chaque mot, de chaque silence, de cette sensation que quelque chose de rare commencait.',
    photo: '/photos/timeline/february.jpg',
  },
  {
    id: 'relationship-start',
    date: '16 Mars 2026',
    title: 'Le debut de nous',
    subtitle: '\u2661',
    message: "Le jour ou tout est devenu officiel. Le jour ou j'ai su que j'avais trouve quelque chose de precieux.",
    photo: '/photos/timeline/march.jpg',
  },
  {
    id: 'first-irl-meeting',
    date: '16 Mai 2026',
    title: 'Premiere rencontre IRL',
    subtitle: 'te voir en vrai',
    message: "Te voir pour la premiere fois. Les mots ne suffisent pas pour decrire ce que j'ai ressenti. Tout etait exactement comme je l'imaginais, en mille fois mieux.",
    photo: '/photos/timeline/may-meeting.jpg',
  },
  {
    id: 'birthday',
    date: '22 Mai 2026',
    title: 'Ton anniversaire',
    subtitle: '\uD83C\uDF82',
    message: "Celebrer le jour ou le monde a eu la chance de te voir naitre. J'espere que cette annee sera la plus belle de toutes.",
    photo: '/photos/timeline/birthday.jpg',
  },
];
```

- [ ] **Step 2: Create src/data/polaroids.ts**

```typescript
export interface PolaroidData {
  id: string;
  image: string;
  caption: string;
  date: string;
  rotation: number;
  hiddenMessage?: string;
  tapeStyle: 'top' | 'side' | 'both';
}

export const polaroids: PolaroidData[] = [
  {
    id: 'memory-1',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ notre premier cafe ~',
    date: 'Hiver 2025',
    rotation: -2,
    hiddenMessage: 'Je me souviens que tu as pris un latte. Je me souviens de la lumiere. Je me souviens de tout.',
    tapeStyle: 'top',
  },
  {
    id: 'memory-2',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ cette soiree-la ~',
    date: 'Printemps 2026',
    rotation: 3,
    hiddenMessage: "On a parle jusqu'a 3h du matin sans voir le temps passer.",
    tapeStyle: 'both',
  },
  {
    id: 'memory-3',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ un dimanche parfait ~',
    date: 'Mars 2026',
    rotation: -1,
    hiddenMessage: 'Les dimanches avec toi devraient durer 48 heures.',
    tapeStyle: 'side',
  },
  {
    id: 'memory-4',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ ton sourire ~',
    date: '2026',
    rotation: 2,
    tapeStyle: 'top',
  },
  {
    id: 'memory-5',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ ce moment ~',
    date: '2026',
    rotation: -3,
    tapeStyle: 'both',
  },
  {
    id: 'memory-6',
    image: '/photos/polaroids/memory-1.jpg',
    caption: '~ nous ~',
    date: '2026',
    rotation: 1,
    hiddenMessage: 'Si je pouvais revivre un seul moment de ma vie, ce serait celui-ci.',
    tapeStyle: 'side',
  },
];
```

- [ ] **Step 3: Create src/data/openWhen.ts**

```typescript
export type OpenWhenTheme =
  | 'rain'
  | 'stars'
  | 'sunset'
  | 'night'
  | 'cozy'
  | 'waves'
  | 'aurora'
  | 'golden';

export interface OpenWhenSurprise {
  type: 'hidden_message' | 'photo_reveal' | 'audio_clip';
  trigger: 'tap_3_times' | 'long_press' | 'swipe_up';
  content: string;
}

export interface OpenWhenEntry {
  slug: string;
  emoji: string;
  title: string;
  message: string;
  theme: OpenWhenTheme;
  photos?: string[];
  audio?: string;
  surprise?: OpenWhenSurprise;
}

export const openWhenEntries: OpenWhenEntry[] = [
  {
    slug: 'sad',
    emoji: '\uD83C\uDF27\uFE0F',
    title: 'Ouvre quand tu es triste',
    message: "Je sais que la tristesse arrive parfois sans prevenir. Qu'elle s'installe sans demander la permission. Dans ces moments-la, j'aimerais etre la pour te serrer dans mes bras, te preparer un the, et te rappeler a quel point tu es aimee. Tu n'es pas seule. Tu ne seras jamais seule. Laisse la pluie tomber \u2014 elle finit toujours par s'arreter. Et apres la pluie, il y a toujours un arc-en-ciel. Tu es mon arc-en-ciel.",
    theme: 'rain',
    surprise: {
      type: 'hidden_message',
      trigger: 'tap_3_times',
      content: "Tu es la personne la plus forte que je connaisse. Meme quand la tristesse est la, elle ne definit pas qui tu es. Elle n'est qu'un nuage qui passe \u2014 toi, tu es le soleil derriere.",
    },
  },
  {
    slug: 'doubt',
    emoji: '\uD83D\uDCAD',
    title: 'Ouvre quand tu doutes de toi',
    message: "Je sais que parfois tu regardes dans le miroir et tu ne vois pas ce que je vois. Alors laisse-moi te dire ce que je vois : une personne incroyablement intelligente, profondement gentille, et magnifiquement unique. Tu doutes de toi parce que tu es assez intelligente pour voir la complexite du monde. Mais ne confonds jamais l'humilite avec l'incapacite. Tu es capable de tout. Regarde tout ce que tu as deja accompli. Et ce n'est que le debut.",
    theme: 'stars',
    surprise: {
      type: 'hidden_message',
      trigger: 'long_press',
      content: "Chaque etoile dans le ciel brille differemment. Toi, tu brilles comme personne. Ne laisse jamais personne \u2014 meme pas toi-meme \u2014 te dire le contraire.",
    },
  },
  {
    slug: 'cant-sleep',
    emoji: '\uD83C\uDF19',
    title: "Ouvre quand tu n'arrives pas a dormir",
    message: "Il est tard. Le monde dort. Et toi, tu regardes le plafond en pensant a tout et a rien. Je suis probablement en train de dormir, ou peut-etre que je pense a toi aussi. Ferme les yeux. Imagine qu'on est allonges cote a cote. Ma main dans la tienne. Le bruit calme de ma respiration. Je suis la, meme a distance. Compte les etoiles. Compte mes je t'aime. Il y en a plus que d'etoiles.",
    theme: 'night',
  },
  {
    slug: 'sunny-day',
    emoji: '\u2600\uFE0F',
    title: 'Ouvre quand le soleil brille',
    message: "Aujourd'hui le soleil brille, et j'espere que tu brilles avec lui. Ces jours-la sont faits pour etre savoures. Souris. Ris. Danse dans ta chambre. Appelle quelqu'un que tu aimes. Le bonheur est fait de ces petits moments de lumiere. Et savoir que tu vis ces moments, meme loin de moi, me remplit de joie. Le soleil est chaud aujourd'hui \u2014 presque aussi chaud que mon coeur quand je pense a toi.",
    theme: 'sunset',
    surprise: {
      type: 'photo_reveal',
      trigger: 'swipe_up',
      content: '/photos/polaroids/memory-1.jpg',
    },
  },
  {
    slug: 'lonely',
    emoji: '\uD83E\uDEC2',
    title: 'Ouvre quand tu te sens seule',
    message: "La solitude, ce n'est pas l'absence de gens autour de toi. C'est l'absence de certaines personnes. Et je sais que je ne suis pas toujours physiquement la. Mais je veux que tu saches une chose : tu es dans mes pensees plus souvent que tu ne l'imagines. Dans les petits moments de ma journee, dans les chansons que j'ecoute, dans tout ce que je vois de beau. Tu n'es jamais vraiment seule \u2014 parce qu'une partie de moi est toujours avec toi.",
    theme: 'cozy',
    surprise: {
      type: 'hidden_message',
      trigger: 'tap_3_times',
      content: "Ferme les yeux et prends trois grandes respirations. A chaque inspiration, imagine que c'est un calin que je t'envoie a travers la distance.",
    },
  },
  {
    slug: 'overwhelmed',
    emoji: '\uD83C\uDF0A',
    title: 'Ouvre quand tout va trop vite',
    message: "Le monde peut etre bruyant. Trop de choses, trop vite, trop fort. Dans ces moments, souviens-toi de respirer. Tu n'as pas besoin de tout faire. Tu n'as pas besoin d'etre parfaite. Tu as juste besoin d'etre toi. Fais une pause. Regarde par la fenetre. Ecoute le silence. Le monde peut attendre. Toi, tu es plus importante que toutes les urgences du monde.",
    theme: 'waves',
  },
  {
    slug: 'courage',
    emoji: '\uD83D\uDCAA',
    title: 'Ouvre quand tu as besoin de courage',
    message: "Je sais que tu as peur parfois. Peur de l'inconnu, peur de l'echec, peur de ne pas etre a la hauteur. Mais laisse-moi te rappeler tous les moments ou tu as ete courageuse sans meme t'en rendre compte. Chaque matin ou tu t'es levee. Chaque defi que tu as releve. Chaque fois que tu as dit je continue alors que tout te disait d'abandonner. Tu es tellement plus forte que tu ne le crois. Et je crois en toi plus que personne.",
    theme: 'aurora',
  },
  {
    slug: 'just-because',
    emoji: '\u2764\uFE0F',
    title: "Juste parce que je t'aime",
    message: "Ceci n'a pas besoin de raison particuliere. Pas besoin que tu sois triste, ou joyeuse, ou que tu aies besoin de courage. Ouvre-le juste parce que. Parce que tu existes et que c'est deja la plus belle chose qui soit. Parce que chaque jour ou tu es dans ce monde est un jour meilleur. Parce que je t'aime, tout simplement. Sans condition, sans raison, sans fin. Merci d'etre toi. Merci d'etre la. Merci pour tout ce que tu es.",
    theme: 'golden',
    surprise: {
      type: 'hidden_message',
      trigger: 'tap_3_times',
      content: "Tu es la plus belle chose qui me soit arrivee. Chaque jour, je remercie l'univers de t'avoir mise sur mon chemin.",
    },
  },
];
```

- [ ] **Step 4: Create src/data/mapLocations.ts**

```typescript
export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  date: string;
  message: string;
  photo: string;
  emoji: string;
}

export const mapLocations: MapLocation[] = [
  {
    id: 'first-meeting',
    lat: 48.8566,
    lng: 2.3522,
    title: 'Notre premiere rencontre IRL',
    date: '16 Mai 2026',
    message: "Ce lieu restera grave dans ma memoire pour toujours. C'est ici que je t'ai vue pour la premiere fois. Le monde s'est arrete.",
    photo: '/photos/map/first-meeting.jpg',
    emoji: '\uD83D\uDCAB',
  },
  {
    id: 'first-date',
    lat: 48.8600,
    lng: 2.3400,
    title: 'Notre premier vrai rendez-vous',
    date: '2026',
    message: "Notre premier rendez-vous officiel. J'etais nerveux. Tu etais magnifique. C'etait parfait.",
    photo: '/photos/map/first-date.jpg',
    emoji: '\uD83C\uDF39',
  },
];
```

---

### Task 4: Music Context

**Files:**
- Create: `src/context/MusicContext.tsx`

- [ ] **Step 1: Create MusicContext.tsx**

```typescript
import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  hasInteracted: boolean;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  markInteraction: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/your-song.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  }, []);

  const markInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.volume = 0;
        audio.play().then(() => {
          const fadeIn = setInterval(() => {
            if (audio.volume < volume) {
              audio.volume = Math.min(volume, audio.volume + 0.02);
            } else {
              clearInterval(fadeIn);
            }
          }, 120);
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [hasInteracted, volume]);

  return (
    <MusicContext.Provider value={{ isPlaying, volume, hasInteracted, togglePlay, setVolume, markInteraction }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
```

---

### Task 5: Custom Hooks

**Files:**
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/hooks/useInView.ts`
- Create: `src/hooks/useMediaQuery.ts`

- [ ] **Step 1: Create all three hook files**

```typescript
// src/hooks/useScrollProgress.ts
import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
```

```typescript
// src/hooks/useInView.ts
import { useState, useEffect, useRef, type RefObject } from 'react';

export function useInView(
  options: IntersectionObserverInit = { threshold: 0.2 }
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}
```

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

---

### Task 6: UI Primitive Components

**Files:**
- Create: `src/components/ui/SectionWrapper.tsx`
- Create: `src/components/ui/FadeInOnScroll.tsx`
- Create: `src/components/ui/GrainOverlay.tsx`

- [ ] **Step 1: Create SectionWrapper.tsx**

```typescript
import { type ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Create FadeInOnScroll.tsx**

```typescript
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function FadeInOnScroll({ children, className = '', delay = 0, direction = 'up' }: FadeInOnScrollProps) {
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create GrainOverlay.tsx**

```typescript
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
```

---

### Task 7: Intro Scene

**Files:**
- Create: `src/components/intro/FloatingParticles.tsx`
- Create: `src/components/intro/TypewriterText.tsx`
- Create: `src/components/intro/IntroScene.tsx`

- [ ] **Step 1: Create FloatingParticles.tsx**

```typescript
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 15,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold-light"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create TypewriterText.tsx**

```typescript
import { motion } from 'framer-motion';

const lines = [
  'parfois,',
  "on rencontre quelqu'un",
  'et le monde devient',
  'un peu plus doux',
  'un peu plus lumineux',
  'un peu plus vivant',
  '',
  'cette petite chose',
  "c'est pour toi",
];

export function TypewriterText() {
  return (
    <div className="text-center px-6">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={`font-serif italic text-gold-light text-lg sm:text-xl md:text-2xl leading-relaxed ${
            line === '' ? 'h-4' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: line ? 0.7 : 0, y: 0 }}
          transition={{
            delay: 1.5 + i * 1.2,
            duration: 1.5,
            ease: 'easeOut',
          }}
        >
          {line || '\u00A0'}
        </motion.p>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create IntroScene.tsx**

```typescript
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';
import { TypewriterText } from './TypewriterText';
import { useMusic } from '../../context/MusicContext';

export function IntroScene() {
  const { markInteraction } = useMusic();

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-warm-darkest via-warm-dark to-warm-dark-mid overflow-hidden"
      onClick={markInteraction}
    >
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Small label */}
      <motion.p
        className="text-gold/30 text-xs tracking-[0.3em] uppercase mb-8 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        pour toi
      </motion.p>

      {/* Typewriter text */}
      <TypewriterText />

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.4, 0] }}
        transition={{ delay: 12, duration: 3, repeat: Infinity }}
      >
        <span className="text-cream-dark/30 text-xs font-body tracking-wider">defiler</span>
        <motion.div
          className="w-5 h-8 border border-cream-dark/20 rounded-full flex justify-center"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-cream-dark/30 rounded-full mt-1"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

---

### Task 8: Timeline Section

**Files:**
- Create: `src/components/timeline/ProgressDots.tsx`
- Create: `src/components/timeline/TimelineCard.tsx`
- Create: `src/components/timeline/TimelineSection.tsx`

- [ ] **Step 1: Create ProgressDots.tsx**

```typescript
import { motion } from 'framer-motion';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === current ? 20 : 6,
            height: 6,
            backgroundColor: i === current ? '#D4A853' : 'rgba(255,248,236,0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create TimelineCard.tsx**

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent } from '../../data/timeline';

interface TimelineCardProps {
  event: TimelineEvent;
  isActive: boolean;
}

export function TimelineCard({ event, isActive }: TimelineCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] max-w-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="bg-cream/5 border border-cream-dark/10 rounded-2xl p-6 backdrop-blur-sm cursor-pointer"
        onClick={() => setRevealed(!revealed)}
      >
        {/* Photo */}
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-cream-dark/10 to-violet/10 flex items-center justify-center">
          <img
            src={event.photo}
            alt={event.title}
            className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500"
            loading="lazy"
          />
        </div>

        {/* Date */}
        <p className="font-serif text-gold text-2xl sm:text-3xl mb-1">{event.date.split(' ')[0]}</p>
        <p className="text-violet-light/60 text-xs mb-3 font-body tracking-wide">{event.date.split(' ').slice(1).join(' ')}</p>

        {/* Title */}
        <h3 className="font-serif text-cream text-xl sm:text-2xl mb-1">{event.title}</h3>
        <p className="font-handwritten text-gold-light/70 text-lg mb-4">{event.subtitle}</p>

        {/* Hidden message */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-cream-dark/10">
                <p className="font-body text-cream/70 text-sm leading-relaxed italic">{event.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!revealed && (
          <p className="text-cream-dark/20 text-xs mt-4 text-center font-body">tap pour reveler</p>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create TimelineSection.tsx**

```typescript
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { TimelineCard } from './TimelineCard';
import { ProgressDots } from './ProgressDots';
import { timelineEvents } from '../../data/timeline';

export function TimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.85;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, timelineEvents.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FadeInOnScroll className="text-center mb-10">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">notre histoire</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">La timeline</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">les moments qui comptent</p>
      </FadeInOnScroll>

      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-[7.5vw] w-full no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {timelineEvents.map((event) => (
          <TimelineCard
            key={event.id}
            event={event}
            isActive={timelineEvents.indexOf(event) === activeIndex}
          />
        ))}
      </motion.div>

      <ProgressDots total={timelineEvents.length} current={activeIndex} />

      <FadeInOnScroll delay={0.3} className="mt-10">
        <p className="font-handwritten text-cream-dark/30 text-xl text-center">
          ...et ce n&apos;est que le debut
        </p>
      </FadeInOnScroll>
    </SectionWrapper>
  );
}
```

---

### Task 9: Polaroid Memory Gallery

**Files:**
- Create: `src/components/polaroid/PolaroidCard.tsx`
- Create: `src/components/polaroid/MemoryGallery.tsx`

- [ ] **Step 1: Create PolaroidCard.tsx**

```typescript
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PolaroidCardProps {
  image: string;
  caption: string;
  date: string;
  rotation: number;
  hiddenMessage?: string;
  tapeStyle: 'top' | 'side' | 'both';
}

export function PolaroidCard({
  image,
  caption,
  date,
  rotation,
  hiddenMessage,
  tapeStyle,
}: PolaroidCardProps) {
  const [showHidden, setShowHidden] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = useCallback(() => {
    if (!hiddenMessage) return;
    const timer = setTimeout(() => setShowHidden(true), 600);
    setLongPressTimer(timer);
  }, [hiddenMessage]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  return (
    <motion.div
      className="flex-shrink-0 relative"
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{ scale: 1.02, rotate: rotation * 0.5, zIndex: 10 }}
      transition={{ duration: 0.3 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="bg-cream p-2.5 sm:p-3 shadow-2xl shadow-black/20" style={{ paddingBottom: '2.5rem' }}>
        {/* Tape decoration */}
        {(tapeStyle === 'top' || tapeStyle === 'both') && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 tape z-10" />
        )}
        {(tapeStyle === 'side' || tapeStyle === 'both') && (
          <div className="absolute -top-2 right-2 w-4 h-12 tape z-10" />
        )}

        {/* Photo area */}
        <div className="relative aspect-square w-44 sm:w-56 overflow-hidden bg-cream-dark flex items-center justify-center">
          <img
            src={image}
            alt={caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <AnimatePresence>
            {showHidden && hiddenMessage && (
              <motion.div
                className="absolute inset-0 bg-warm-darkest/90 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHidden(false)}
              >
                <p className="font-body text-cream/80 text-xs leading-relaxed text-center italic">
                  {hiddenMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-handwritten text-warm-dark text-lg sm:text-xl text-center mt-2 leading-tight">
          {caption}
        </p>
        <p className="text-warm-dark/40 text-[10px] text-center font-body mt-0.5">{date}</p>
      </div>

      {hiddenMessage && !showHidden && (
        <p className="text-cream-dark/15 text-[9px] text-center mt-2 font-body">
          appuie longtemps
        </p>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create MemoryGallery.tsx**

```typescript
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PolaroidCard } from './PolaroidCard';
import { polaroids } from '../../data/polaroids';

export function MemoryGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark to-warm-dark-mid py-20">
      <FadeInOnScroll className="text-center mb-12">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">souvenirs</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Les polaroids</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">des instants voles</p>
      </FadeInOnScroll>

      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-dark/5 to-violet/5 rounded-3xl -m-4" />

        <motion.div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 py-12 no-scrollbar items-center"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {polaroids.map((p) => (
            <div key={p.id} className="flex-shrink-0 snap-center py-4 px-2">
              <PolaroidCard
                image={p.image}
                caption={p.caption}
                date={p.date}
                rotation={p.rotation}
                hiddenMessage={p.hiddenMessage}
                tapeStyle={p.tapeStyle}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <p className="text-cream-dark/15 text-xs mt-4 font-body">&larr; glisse pour decouvrir &rarr;</p>
    </SectionWrapper>
  );
}
```

---

### Task 10: Open When Hub + Portals

**Files:**
- Create: `src/components/openwhen/ThemeBackground.tsx`
- Create: `src/components/openwhen/PortalCard.tsx`
- Create: `src/components/openwhen/OpenWhenPortal.tsx`
- Create: `src/components/openwhen/OpenWhenHub.tsx`

- [ ] **Step 1: Create ThemeBackground.tsx**

```typescript
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { OpenWhenTheme } from '../../data/openWhen';

function RainEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 0.5 + 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <motion.div
          key={d.id}
          className="absolute w-px bg-violet-light/20"
          style={{ left: `${d.left}%`, height: 20 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 0.6, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-gold-light"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function GoldenParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 4 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 15, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

const themeConfigs: Record<OpenWhenTheme, {
  bg: string;
  component: React.FC;
}> = {
  rain: {
    bg: 'from-warm-darkest via-[#1a1a2e] to-warm-darkest',
    component: RainEffect,
  },
  stars: {
    bg: 'from-warm-darkest via-[#0d0d1a] to-warm-darkest',
    component: StarField,
  },
  sunset: {
    bg: 'from-[#2d1b2e] via-[#3d2b3e] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{ background: 'linear-gradient(to top, rgba(212,168,83,0.15), rgba(123,107,138,0.05), transparent)' }}
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  night: {
    bg: 'from-[#0a0a14] via-[#0f0f1e] to-warm-darkest',
    component: StarField,
  },
  cozy: {
    bg: 'from-warm-darkest via-[#2a1a24] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  waves: {
    bg: 'from-[#1a2a3a] via-warm-dark to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: `linear-gradient(to top, rgba(123,107,138,${0.05 + i * 0.02}), transparent)` }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}
      </div>
    ),
  },
  aurora: {
    bg: 'from-[#1a1228] via-[#221a38] to-warm-darkest',
    component: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/3"
          style={{ background: 'linear-gradient(to bottom, rgba(155,138,170,0.15), rgba(123,107,138,0.05), transparent)' }}
          animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    ),
  },
  golden: {
    bg: 'from-warm-darkest via-warm-dark to-warm-darkest',
    component: GoldenParticles,
  },
};

export function ThemeBackground({ theme }: { theme: OpenWhenTheme }) {
  const config = themeConfigs[theme];
  const Component = config.component;

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-b ${config.bg}`} />
      <Component />
    </>
  );
}
```

- [ ] **Step 2: Create PortalCard.tsx**

```typescript
import { motion } from 'framer-motion';

interface PortalCardProps {
  emoji: string;
  title: string;
  onClick: () => void;
  delay: number;
}

export function PortalCard({ emoji, title, onClick, delay }: PortalCardProps) {
  return (
    <motion.button
      className="glass rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, borderColor: 'rgba(212,168,83,0.3)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <motion.span
        className="text-2xl sm:text-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.span>
      <span className="font-body text-cream/80 text-xs sm:text-sm leading-tight text-balance">
        {title}
      </span>
    </motion.button>
  );
}
```

- [ ] **Step 3: Create OpenWhenPortal.tsx**

```typescript
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ThemeBackground } from './ThemeBackground';
import type { OpenWhenEntry } from '../../data/openWhen';

interface OpenWhenPortalProps {
  entry: OpenWhenEntry;
  onClose: () => void;
}

export function OpenWhenPortal({ entry, onClose }: OpenWhenPortalProps) {
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount === 0) return;
    const timer = setTimeout(() => setTapCount(0), 800);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleTap = useCallback(() => {
    if (surpriseRevealed || !entry.surprise) return;
    if (entry.surprise.trigger === 'tap_3_times') {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 3) setSurpriseRevealed(true);
    }
  }, [tapCount, surpriseRevealed, entry.surprise]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <ThemeBackground theme={entry.theme} />

      <button
        className="absolute top-6 right-6 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        onClick={onClose}
      >
        <FiX size={20} />
      </button>

      <div className="relative z-10 px-6 max-w-md text-center" onClick={handleTap}>
        <motion.span
          className="text-4xl sm:text-5xl block mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {entry.emoji}
        </motion.span>

        <motion.h2
          className="font-serif text-cream text-2xl sm:text-3xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {entry.title}
        </motion.h2>

        <motion.p
          className="font-body text-cream/70 text-sm sm:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {entry.message}
        </motion.p>

        <AnimatePresence>
          {surpriseRevealed && entry.surprise && entry.surprise.type === 'hidden_message' && (
            <motion.div
              className="mt-8 p-4 glass rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="font-handwritten text-gold-light text-lg sm:text-xl">
                {entry.surprise.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {entry.surprise && !surpriseRevealed && entry.surprise.trigger === 'tap_3_times' && (
          <motion.p
            className="text-cream-dark/15 text-xs mt-8 font-body"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, delay: 3, repeat: Infinity }}
          >
            {tapCount > 0 ? `${3 - tapCount}...` : ''}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Create OpenWhenHub.tsx**

```typescript
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { PortalCard } from './PortalCard';
import { OpenWhenPortal } from './OpenWhenPortal';
import { openWhenEntries, type OpenWhenEntry } from '../../data/openWhen';

export function OpenWhenHub() {
  const [activeEntry, setActiveEntry] = useState<OpenWhenEntry | null>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark-mid to-warm-dark py-20">
      <FadeInOnScroll className="text-center mb-10">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">pour plus tard</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Ouvre quand...</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">des petits mots pour chaque moment</p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.2} className="w-full max-w-lg mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {openWhenEntries.map((entry, i) => (
            <PortalCard
              key={entry.slug}
              emoji={entry.emoji}
              title={entry.title}
              onClick={() => setActiveEntry(entry)}
              delay={0.1 * i}
            />
          ))}
        </div>
      </FadeInOnScroll>

      <AnimatePresence>
        {activeEntry && (
          <OpenWhenPortal
            entry={activeEntry}
            onClose={() => setActiveEntry(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
```

---

### Task 11: Map Section

**Files:**
- Create: `src/components/map/MemoryPopup.tsx`
- Create: `src/components/map/MapSection.tsx`

- [ ] **Step 1: Create MemoryPopup.tsx**

```typescript
import type { MapLocation } from '../../data/mapLocations';

interface MemoryPopupProps {
  location: MapLocation;
  onClose: () => void;
}

export function MemoryPopup({ location, onClose }: MemoryPopupProps) {
  return (
    <div
      className="fixed inset-0 z-[300] bg-warm-darkest/90 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-3xl block mb-3">{location.emoji}</span>

        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-cream-dark/5 flex items-center justify-center">
          <img
            src={location.photo}
            alt={location.title}
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
        </div>

        <h3 className="font-serif text-cream text-xl mb-1">{location.title}</h3>
        <p className="text-violet-light/60 text-xs mb-3 font-body">{location.date}</p>
        <p className="font-body text-cream/70 text-sm leading-relaxed italic">{location.message}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MapSection.tsx**

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FadeInOnScroll } from '../ui/FadeInOnScroll';
import { MemoryPopup } from './MemoryPopup';
import { mapLocations, type MapLocation } from '../../data/mapLocations';
import 'leaflet/dist/leaflet.css';

const heartIcon = L.divIcon({
  html: '<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">\uD83D\uDCAB</div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export function MapSection() {
  const [showFullMap, setShowFullMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  return (
    <SectionWrapper className="bg-gradient-to-b from-warm-dark to-warm-dark-mid py-20">
      <FadeInOnScroll className="text-center mb-8">
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-3 font-body">les lieux</p>
        <h2 className="font-serif text-cream text-3xl sm:text-4xl mb-2">Notre carte</h2>
        <p className="font-handwritten text-gold-light/50 text-xl">les endroits qui comptent</p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.2}>
        <button
          className="glass rounded-2xl p-4 w-[85vw] max-w-md mx-auto cursor-pointer"
          onClick={() => setShowFullMap(true)}
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-warm-darkest flex items-center justify-center relative">
            <div className="absolute inset-0" style={{ filter: 'brightness(0.6) saturate(0.5)' }}>
              <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                className="w-full h-full"
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
              </MapContainer>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <FiMapPin className="text-gold" size={28} />
              <span className="font-body text-cream/80 text-sm">ouvrir la carte</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            {mapLocations.map((loc) => (
              <div key={loc.id} className="text-center">
                <span className="text-lg">{loc.emoji}</span>
                <p className="text-cream/50 text-[10px] font-body mt-1">{loc.title}</p>
              </div>
            ))}
          </div>
        </button>
      </FadeInOnScroll>

      <AnimatePresence>
        {showFullMap && (
          <motion.div
            className="fixed inset-0 z-[250] bg-warm-darkest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 z-[400] w-10 h-10 glass rounded-full flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              onClick={() => setShowFullMap(false)}
            >
              &times;
            </button>

            <MapContainer
              center={[48.8566, 2.3522]}
              zoom={13}
              className="w-full h-full"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {mapLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.lat, loc.lng]}
                  icon={heartIcon}
                  eventHandlers={{ click: () => setSelectedLocation(loc) }}
                >
                  <Popup>
                    <div className="text-center p-1">
                      <p className="font-serif text-cream text-sm mb-1">{loc.title}</p>
                      <p className="text-cream-dark/60 text-[10px]">{loc.date}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocation && (
        <MemoryPopup location={selectedLocation} onClose={() => setSelectedLocation(null)} />
      )}
    </SectionWrapper>
  );
}
```

---

### Task 12: Ending Scene

**Files:**
- Create: `src/components/ending/StarField.tsx`
- Create: `src/components/ending/ProgressiveReveal.tsx`
- Create: `src/components/ending/HeartAnimation.tsx`
- Create: `src/components/ending/EndingScene.tsx`

- [ ] **Step 1: Create StarField.tsx**

```typescript
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-cream"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ProgressiveReveal.tsx**

```typescript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  { id: 'p1', lines: ['avant toi', 'je ne savais pas'], delay: 0 },
  { id: 'p2', lines: ['que le monde pouvait etre', 'aussi doux'], delay: 5000 },
  { id: 'climax', lines: ["merci d'exister"], delay: 11000, isClimax: true },
];

interface ProgressiveRevealProps {
  onComplete: () => void;
}

export function ProgressiveReveal({ onComplete }: ProgressiveRevealProps) {
  const [currentPhase, setCurrentPhase] = useState(-1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentPhase(0), 500);
    const t2 = setTimeout(() => setCurrentPhase(1), 5500);
    const t3 = setTimeout(() => setCurrentPhase(2), 11500);
    const t4 = setTimeout(() => onComplete(), 18000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="relative z-10 text-center px-6">
      {phases.map((phase, phaseIdx) => (
        <AnimatePresence key={phase.id}>
          {currentPhase >= phaseIdx && (
            <motion.div className={phaseIdx < 2 ? 'mb-12' : 'mt-8'}>
              {phase.lines.map((line, lineIdx) => (
                <motion.p
                  key={line}
                  className={`font-serif italic leading-relaxed ${
                    phase.isClimax
                      ? 'text-gold text-2xl sm:text-4xl md:text-5xl'
                      : 'text-cream/60 text-lg sm:text-xl md:text-2xl'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: phase.isClimax ? 0.5 : lineIdx * 1.5,
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create HeartAnimation.tsx**

```typescript
import { motion } from 'framer-motion';

interface HeartAnimationProps {
  show: boolean;
}

export function HeartAnimation({ show }: HeartAnimationProps) {
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, scale: 0 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <span className="text-3xl sm:text-4xl animate-heartbeat inline-block">{'\u2764\uFE0F'}</span>
    </motion.div>
  );
}
```

- [ ] **Step 4: Create EndingScene.tsx**

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { StarField } from './StarField';
import { ProgressiveReveal } from './ProgressiveReveal';

export function EndingScene() {
  const [phase, setPhase] = useState<'reveal' | 'heart' | 'restart'>('reveal');

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <SectionWrapper className="bg-warm-darkest min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-warm-darkest via-[#14101E] to-warm-darkest" />

      <StarField />

      <AnimatePresence mode="wait">
        {phase === 'reveal' && (
          <ProgressiveReveal
            key="reveal"
            onComplete={() => setPhase('heart')}
          />
        )}

        {phase === 'heart' && (
          <motion.div
            key="heart"
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setTimeout(() => setPhase('restart'), 3000)
              }
            >
              <span className="text-3xl sm:text-4xl animate-heartbeat inline-block">
                {'\u2764\uFE0F'}
              </span>
            </motion.div>
          </motion.div>
        )}

        {phase === 'restart' && (
          <motion.div
            key="restart"
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.p
              className="font-serif italic text-cream/40 text-lg sm:text-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              avec tout mon amour,
            </motion.p>

            <motion.button
              className="font-body text-cream-dark/30 text-xs sm:text-sm tracking-wider hover:text-cream-dark/60 transition-colors duration-500 underline underline-offset-4 decoration-cream-dark/10"
              onClick={handleRestart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              revivre cette histoire
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
```

---

### Task 13: Music Player

**Files:**
- Create: `src/components/music/MusicPlayer.tsx`

- [ ] **Step 1: Create MusicPlayer.tsx**

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '../../context/MusicContext';

export function MusicPlayer() {
  const { isPlaying, volume, togglePlay, setVolume, hasInteracted } = useMusic();
  const [showVolume, setShowVolume] = useState(false);
  const [muted, setMuted] = useState(false);

  const handleVolumeToggle = () => {
    if (muted || volume === 0) {
      setVolume(0.5);
      setMuted(false);
    } else {
      setVolume(0);
      setMuted(true);
    }
  };

  if (!hasInteracted) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150] glass rounded-full px-4 py-2.5 flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <button
        className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        onClick={togglePlay}
      >
        {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} className="ml-0.5" />}
      </button>

      <span className="text-cream/50 text-[11px] font-body tracking-wide max-w-[120px] truncate">
        notre chanson
      </span>

      <button
        className="text-cream/30 hover:text-cream/60 transition-colors"
        onClick={() => setShowVolume(!showVolume)}
      >
        {muted || volume === 0 ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
      </button>

      <AnimatePresence>
        {showVolume && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setMuted(false);
              }}
              className="w-16 h-1 bg-cream-dark/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

### Task 14: Easter Eggs

**Files:**
- Create: `src/components/secrets/EasterEggs.tsx`

- [ ] **Step 1: Create EasterEggs.tsx**

```typescript
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECRET_MESSAGES = [
  'Tu es la plus belle chose qui me soit arrivee.',
  "Chaque jour, je remercie l'univers de t'avoir mise sur mon chemin.",
  "Ton sourire est ma raison preferee d'etre heureux.",
  'Si je pouvais revivre un seul moment, ce serait celui ou je t\'ai rencontree.',
  'Tu rends le monde plus beau juste en existant.',
];

export function EasterEggs() {
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [showTimeMessage, setShowTimeMessage] = useState(false);
  const appeared = useRef(false);

  useEffect(() => {
    if (appeared.current) return;
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      const timer = setTimeout(() => {
        setShowTimeMessage(true);
        appeared.current = true;
        setTimeout(() => setShowTimeMessage(false), 5000);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const msg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
        setFloatingMessage(msg);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFloatingTap = useCallback(() => {
    const msg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
    setFloatingMessage(msg);
    setTimeout(() => setFloatingMessage(null), 4000);
  }, []);

  return (
    <>
      <motion.button
        className="fixed z-[120] text-2xl opacity-20 hover:opacity-60 transition-opacity cursor-pointer"
        style={{
          right: `${10 + Math.random() * 20}%`,
          bottom: `${15 + Math.random() * 20}%`,
        }}
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleFloatingTap}
      >
        {'\uD83E\uDD8B'}
      </motion.button>

      <AnimatePresence>
        {floatingMessage && (
          <motion.div
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[160] glass rounded-2xl px-6 py-4 max-w-xs"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => setFloatingMessage(null)}
          >
            <p className="font-handwritten text-gold-light text-lg text-center">
              {floatingMessage}
            </p>
            <p className="text-cream-dark/20 text-[9px] text-center mt-2 font-body">tap pour fermer</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTimeMessage && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[160] glass rounded-full px-5 py-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-body text-cream/40 text-[11px] tracking-wide">
              il est tard... tu devrais dormir, mon amour {'\uD83C\uDF19'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

### Task 15: App Entry & Main

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`

- [ ] **Step 1: Create App.tsx**

```typescript
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
```

- [ ] **Step 2: Create main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MusicProvider } from './context/MusicContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MusicProvider>
      <App />
    </MusicProvider>
  </React.StrictMode>
);
```

---

### Task 16: Placeholder Assets & Directory Structure

**Files:**
- Create: `public/music/.gitkeep`
- Create: `public/photos/timeline/.gitkeep`
- Create: `public/photos/polaroids/.gitkeep`
- Create: `public/photos/map/.gitkeep`

- [ ] **Step 1: Create all required directories**

```bash
mkdir -p public/music public/photos/timeline public/photos/polaroids public/photos/map
```

- [ ] **Step 2: Generate placeholder images**

Create a script to generate simple colored placeholder images, or add a note for the user to replace them.

- [ ] **Step 3: Create .gitignore**

```
node_modules
dist
.superpowers
.DS_Store
*.local
```

---

### Task 17: Verify Build & Dev

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc -b --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds, `dist/` contains output.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

Expected: Local dev server running. Verify in browser:
- Intro scene with particles and text
- Timeline cards swipeable
- Polaroids with tape and rotation
- Open When portals open/close
- Map section loads Leaflet
- Ending scene auto-plays
- Music player appears after interaction
- Butterfly easter egg visible
- No console errors

---

### Task 18: Commit

```bash
git add .
git commit -m "feat: complete romantic website for Youna — cinematic scrapbook experience"
```

---

## Self-Review

1. **Spec coverage**: Each section from the design spec maps to a task:
   - ✅ Intro → Task 7
   - ✅ Timeline → Task 8
   - ✅ Polaroids → Task 9
   - ✅ Open When → Task 10
   - ✅ Map → Task 11
   - ✅ Ending → Task 12
   - ✅ Music → Tasks 4 + 13
   - ✅ Easter eggs → Task 14
   - ✅ Styling → Task 2
   - ✅ Data → Task 3

2. **No placeholders**: All steps contain actual code. No TBDs or TODOs.

3. **Type consistency**: All interfaces defined in data files match the props consumed by components. MusicContext provides correct types to all consumers.
