# Experience Profonde — Spec Immersive

**Date:** 2026-05-13
**Status:** Approved
**Goal:** Transformer le site Youna en une experience cinematique, sensorielle et spatiale complete en ajoutant 3 couches d'immersion : Cinematic Scroll, Environnement Reactif, et Profondeur Spatiale.

---

## Couche 1 — Cinematic Scroll

### Parallax 3 Niveaux
- `ParallaxLayer` : wrapper generique avec `speed` (0 a 1) qui translate son contenu en Y selon `scrollY * speed`
- 3 instances par section quand pertinent :
  - Fond (background gradients, etoiles) → `speed=0.2`
  - Milieu (particules, brume, elements decoratifs) → `speed=0.5`
  - Contenu principal → `speed=1` (par defaut, pas de wrapper)
- Desactive sur mobile si performance insuffisante (useMediaQuery + check prefers-reduced-motion)

### Progress Bar
- `ScrollProgressBar` : fine ligne doree fixee en haut (`h-[2px]`, bg-gold, z-50)
- Largeur = `scrollProgress * 100%`, transition `width` avec `ease-out`
- Opacite 0.6, descend a 0.3 quand scroll = 0 ou 1

### Transitions Cross-Fade
- Chaque section wrapper recoit un `opacity` base sur sa position dans le viewport
- `useScrollProgress` existant deja, ajouter un hook `useSectionVisibility(sectionRef)` qui retourne l'opacity
- La section precedente descend en opacite (1→0) pendant que la suivante monte (0→1)
- Transition chevauchee sur ~300px de scroll

### Vignette Dynamique
- `DynamicVignette` remplace le vignette statique
- Intensite varie par section via config : intro=0.7, timeline=0.3, polaroid=0.2, openwhen=0.4, map=0.3, ending=0.8
- Transition fluide entre les valeurs (animation CSS `transition: opacity 2s`)

### Fond Degrade Evolutif
- `EvolvingBackground` : div fixe en arriere-plan qui change de gradient selon la section
- Mapping section → gradient defini dans le composant (reprenant les bg- de chaque SectionWrapper)

---

## Couche 2 — Environnement Reactif

### Particules Directionnelles
- `ReactiveParticles` : remplace le `FloatingParticles` statique
- Les particules se deplacent dans la direction opposee au scroll
- `useScrollVelocity` : nouveau hook qui retourne `{ speed: number, direction: 'up' | 'down' | 'none' }`
- Les particules montent (y negatif) quand l'utilisateur defile vers le bas
- Nombre de particules : 40 dans l'intro, 20 ailleurs

### Glow au Curseur (desktop only)
- `CursorGlow` : div fixe qui suit `mousemove`, `radial-gradient` dore tres doux
- Taille ~300px, opacite 0.08, `pointer-events: none`
- Desactive sur mobile (pas de souris) et si `prefers-reduced-motion`

### Brume Ambiante
- `AmbientGlow` : halo fixe en bas de page qui pulse
- Opacite oscille entre 0.03 et 0.08 sur ~8s (animation CSS)
- Plus intense dans OpenWhen (0.05→0.12) et Ending (0.08→0.15)
- Couleur : doree (#D4A853) ou violette (#7B6B8A) selon section

### Etoiles Reactives
- Modifier `StarField` dans ending pour utiliser `useScrollVelocity`
- Plus de nouvelles etoiles apparaissent quand scroll rapide
- Les etoiles existantes accelerent leur twinkle

---

## Couche 3 — Profondeur Spatiale

### Tilt 3D sur Cartes
- `TiltCard` : wrapper qui applique `rotateX` et `rotateY` bases sur position souris
- Utilise `onMouseMove` → calcule offset centre → applique `transform: perspective(1000px) rotateX(±5deg) rotateY(±5deg)`
- Sur mobile : `deviceorientation` event pour le tilt au gyroscope (si permissions)
- Applique a `TimelineCard`, `PolaroidCard`, `PortalCard`
- Transition `transform 0.1s ease-out` pour lissage

### Profondeur de Champ (Depth of Field)
- Quand une carte est "active" (au centre du swipe), les cartes adjacentes recoivent `filter: blur(2px)` et `opacity: 0.5`
- Transition progressive : pas de seuil binaire, `backdrop-filter: blur()` calcule en fonction de la distance au centre
- Applique dans `TimelineSection` et `MemoryGallery`

### Elements Flottants
- `FloatingElements` : composant qui genere des petits elements (papillons, coeurs miniatures, etoiles) qui flottent lentement
- 3-5 elements par section, chacun avec sa propre animation `drift` + `float`
- Profondeurs differentes via `scale` et `opacity` (petit + transparent = loin, grand + opaque = proche)
- Apparait dans MemoryGallery, OpenWhenHub, EndingScene

### Ombres Dynamiques
- `DynamicShadow` : ombre portee qui change avec le tilt de la carte
- `box-shadow` calculee dynamiquement via style inline base sur l'angle de tilt
- Plus l'angle est grand, plus l'ombre est decalee et etendue

### Sensation de "Zoom"
- Les sections ont un leger `scale` qui passe de 0.95 a 1 quand elle entre dans le viewport
- Applique via `useSectionVisibility` dans `SectionWrapper`

---

## Composants a Creer

| Composant | Fichier | Couche |
|-----------|---------|--------|
| `ParallaxLayer` | `src/components/ui/ParallaxLayer.tsx` | 1 |
| `ScrollProgressBar` | `src/components/ui/ScrollProgressBar.tsx` | 1 |
| `DynamicVignette` | `src/components/ui/DynamicVignette.tsx` | 1 |
| `EvolvingBackground` | `src/components/ui/EvolvingBackground.tsx` | 1 |
| `ReactiveParticles` | `src/components/ui/ReactiveParticles.tsx` | 2 |
| `CursorGlow` | `src/components/ui/CursorGlow.tsx` | 2 |
| `AmbientGlow` | `src/components/ui/AmbientGlow.tsx` | 2 |
| `TiltCard` | `src/components/ui/TiltCard.tsx` | 3 |
| `FloatingElements` | `src/components/ui/FloatingElements.tsx` | 3 |

## Hooks a Creer

| Hook | Fichier | Usage |
|------|---------|-------|
| `useScrollVelocity` | `src/hooks/useScrollVelocity.ts` | Particules directionnelles, etoiles reactives |
| `useSectionVisibility` | `src/hooks/useSectionVisibility.ts` | Cross-fade transitions, zoom entree |

## Composants a Modifier

| Composant | Changements |
|-----------|-------------|
| `App.tsx` | Ajouter ScrollProgressBar, CursorGlow, AmbientGlow, EvolvingBackground ; wrapper sections dans DynamicVignette |
| `IntroScene.tsx` | Utiliser ReactiveParticles au lieu de FloatingParticles |
| `TimelineSection.tsx` | Ajouter TiltCard sur TimelineCard, flou de profondeur, FloatingElements |
| `TimelineCard.tsx` | Wrapper avec TiltCard, ombre dynamique |
| `MemoryGallery.tsx` | Ajouter TiltCard sur PolaroidCard, flou de profondeur, FloatingElements |
| `PolaroidCard.tsx` | Wrapper avec TiltCard, ombre dynamique |
| `PortalCard.tsx` | Wrapper avec TiltCard |
| `OpenWhenHub.tsx` | Ajouter FloatingElements |
| `EndingScene.tsx` | Utiliser ReactiveParticles, modifier StarField |
| `SectionWrapper.tsx` | Ajouter zoom d'entree, cross-fade transition |
| `StarField.tsx` | Ajouter reactivite au scroll |
| `EasterEggs.tsx` | Ajouter FloatingElements, reactivite scroll |

## Ordre d'Implementation

1. Hooks (`useScrollVelocity`, `useSectionVisibility`)
2. UI Primitives niveau 1 (ParallaxLayer, ScrollProgressBar, DynamicVignette, EvolvingBackground)
3. UI Primitives niveau 2 (ReactiveParticles, CursorGlow, AmbientGlow)
4. UI Primitives niveau 3 (TiltCard, FloatingElements)
5. Integration dans App.tsx et sections existantes
6. Modifications des composants existants (StarField, cards, sections)
7. Build & verification

---

## Contraintes

- Mobile-first : desactiver les effets lourds (CursorGlow, tilt souris) sur mobile
- `prefers-reduced-motion` : respecter la preference utilisateur
- Performance : tous les effets utilisent `will-change` avec parcimonie, `passive` event listeners
- Pas de librairies supplementaires : tout en React + Framer Motion + CSS
