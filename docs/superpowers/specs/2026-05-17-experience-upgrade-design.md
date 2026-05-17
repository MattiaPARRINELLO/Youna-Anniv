# Design Doc — Experience Upgrade "Moment Fou"

**Date:** 2026-05-17
**Topic:** Amelioration de l'experience Youna Anniv — Intro, Chasse au Tresor, Final
**Status:** Approved

---

## Overview

Ameliorer l'experience existante de l'application "Youna Anniv" en trois axes :

1. **Intro cinematique spectaculaire** — remplacer l'intro actuelle par une sequence immersive en 3 actes
2. **Chasse au tresor + mini-jeu** — 5 gemmes cachees a travers l'experience, avec recompenses et mini-jeu
3. **Climax final puissant** — enrichir la fin existante avec un bilan personnalise et une lettre manuscrite animee

Le tout optimise pour mobile (elle regardera sur telephone), sans video lourde, tout en CSS/Canvas/Framer Motion.

---

## 1. Intro Cinematique

### 1.1 Sequence en 3 Actes

**Acte 1 — L'Arrivee (0-3s)**
- Fond noir profond (#0a0a0f)
- Lumiere doree qui pulse doucement au centre (battement de coeur, radial gradient)
- Particules reactives qui flottent lentement autour
- La musique commence son fade-in (MusicContext existant)

**Acte 2 — L'Invitation (3-6s)**
- "pour toi" apparait en grand, police serif italic, couleur #d4af37
- Un rayon de lumiere style "light sweep" balaye le texte de gauche a droite
- Le fond s'eclaircit progressivement en gradient chaud
- Letter-spacing eleve, text-shadow dore

**Acte 3 — Le Portail (6-10s)**
- Le texte disparait dans une explosion de particules dorees
- Un bouton-portail circulaire apparait au centre :
  - Cercle dore avec orbite d'etoiles qui tournent autour
  - Pulse doucement (box-shadow glow anime)
  - Texte "touche l'ecran" en police cursive
- Quand elle touche : le portail "s'ouvre" — animation d'expansion de lumiere
- Transition vers le contenu principal (fondu + dechirement visuel)
- La musique atteint son volume normal

### 1.2 Ce qu'on garde de l'existant
- FloatingElements (papillons, coeurs, etoiles — 4 desktop / 2 mobile)
- ReactiveParticles (reactifs au scroll — 30 mobile / 50 desktop)
- Le typewriter existant est supprime ou reduit a 1-2 lignes max
- MusicContext.markInteraction() au premier touch

### 1.3 Ce qu'on ajoute
- Composant `HeartbeatGlow` : radial gradient pulse CSS
- Composant `LightSweep` : animation lineaire de gauche a droite sur le texte
- Composant `PortalButton` : cercle interactif avec orbite d'etoiles
- Animation `PortalExplosion` : expansion de particules + flash de lumiere
- Transition `PortalToContent` : wipe/blur vers le contenu

### 1.4 Contraintes Mobile
- Max 30 particules sur mobile
- Cercle portail 80-100px de diametre (taille confortable pour le pouce)
- Duree totale ~8 secondes, pas plus
- Tout au touch, pas de hover requis

---

## 2. Chasse au Tresor & Mini-Jeu

### 2.1 Systeme de Gemmes

**Compteur global** `GemCounter` :
- Apparait en bas de l'ecran apres l'intro (fade-in discret)
- Design : pilule glass avec 💎 et compteur "2/5"
- Disparait apres 5 secondes d'inactivite, reapparait au scroll
- Persiste via `localStorage` pour les visites suivantes

**5 Gemmes cachees :**

#### Gemme 1 — Code Secret Timeline
- Cachee dans la TimelineSection
- Indice : une lueur doree subtile qui pulse sur les cartes concernees
- Mecanisme : taper les cartes dans l'ordre des dates importantes (Oct -> Fev -> Mars -> Mai -> Mai)
- Si l'ordre est correct : animation de gemme qui apparait + message "tu connais notre histoire par coeur..."
- State gere localement dans le composant TimelineSection

#### Gemme 2 — Point Chaud Polaroid
- Cachee dans une photo specifique du MemoryGallery
- Un "hotspot" invisible (zone 40x40px) sur un endroit significatif de la photo
- Mecanisme : long press (>600ms) sur la zone precise
- Detection via coordonnees du touch par rapport a l'image
- Recompense : gemme + message "tu m'as trouvee..."

#### Gemme 3 — Mot de Passe OpenWhen
- Cachee dans les messages "Ouvre quand..."
- Une lettre legerement plus doree dans chaque message (8 messages → 8 lettres)
- Les lettres dans l'ordre forment un mot significatif (ex: "JE TAIME", "MON AMOUR", "YOUYOU")
- Quand elle ouvre tous les portals (tracke via state), un clavier apparait
- Elle doit taper le mot → gemme + message de felicitations

#### Gemme 4 — Message Fantome Nocturne
- Evolution de l'EasterEggs existant (message "il est tard...")
- Si elle visite entre 23h et 6h + reste >2 minutes
- Une gemme spectrale (opacite reduite, animation fantome) apparait
- Message : "tu penses a moi tard la nuit..."
- State : `localStorage` pour tracker les visites nocturnes

#### Gemme 5 — Mini-Jeu Attrape-Etoiles
- Se declenche via le bouton "decouvre un secret" apres le final
- Jeu de 15 secondes : des etoiles (✦) tombent du haut de l'ecran
- Elle doit les tapoter pour les attraper
- Score affiche en haut a droite (⭐ 7/10)
- Si score >= 10 : gemme + message "tu es une collectionneuse d'etoiles, mon amour"
- Si score < 10 : peut reessayer
- Etoiles ont des tailles et vitesses variees (taille = hitbox)

### 2.2 Implementation du Mini-Jeu

**Composant `StarCatcherGame` :**
- Overlay plein ecran (z-index 250)
- Fond semi-transparent avec blur
- Etoiles generees aleatoirement : position X random, taille 20-30px, vitesse 2-5s de chute
- Detection de collision via `onPointerDown` sur chaque etoile
- Animation `pop` quand une etoile est attrapee
- Timer 15 secondes avec barre de progression
- Bouton "reessayer" si echec

**Optimisations mobile :**
- `touch-action: none` pour eviter le scroll parasite
- Hitbox agrandie pour compenser l'imprecision du doigt
- Pas plus de 3 etoiles simultanees a l'ecran

### 2.3 Gestion d'Etat

Utiliser un `SecretContext` partage :
```typescript
interface SecretState {
  gem1: boolean; // Timeline code secret
  gem2: boolean; // Polaroid hotspot
  gem3: boolean; // OpenWhen password
  gem4: boolean; // Night visit
  gem5: boolean; // Star catcher game
  openWhenLetters: string[]; // Lettres collectees
  openWhenPortalsVisited: string[]; // Portals ouverts
}
```
Persistance dans `localStorage`. Le contexte expose les fonctions `unlockGem(n)` et le compteur.

---

## 3. Climax Final

### 3.1 Structure en 4 Actes

**Acte 1 — Progressive Reveal (existant, conserve)**
- Les 3 phases actuelles : "avant toi / je ne savais pas", "que le monde pouvait etre / aussi doux", "merci d'exister"
- Aucune modification, sauf ajout de la musique en crescendo

**Acte 2 — Bilan Emotionnel (nouveau)**
- Apparait apres le progressive reveal (delai ~2s)
- Affiche les "statistiques" personnalisees basees sur le SecretState :
  - "Tu as trouve X/5 secrets..."
  - "Tu as passe X minutes a explorer" (timer reel depuis l'intro)
  - "Tu es venue un soir, tard..." (si gemme 4)
- Chaque ligne apparait avec un stagger fade-in
- Style : glass cards, icones 💎❤️🌙

**Acte 3 — Lettre Manuscrite Animee (nouveau, conditionnel)**
- Si 5/5 gemmes : la lettre ultime se declenche
- Sinon : message doux "Il te manque quelques secrets... peut-etre qu'un jour tu les trouveras"
- La lettre est un composant `HandwrittenLetter` :
  - Le texte s'ecrit caractere par caractere (vitesse ~50ms/char)
  - Police cursive (Caveat ou similaire, deja dans le projet)
  - Fond parchemin/texture leger (CSS gradient + grain overlay)
  - Ligne en cours legerement surlignee
  - Son subtil d'ecriture a chaque caractere (optionnel, toggle)
  - Taille de police adaptee a mobile (18-20px)
- Contenu de la lettre dans `config.json` (nouveau champ `finalLetter`)

**Acte 4 — Invitation a Revenir (existant + nouveau)**
- Le "revivre cette histoire" existant est conserve
- Ajout d'un bouton "chercher les secrets manquants" (si gemmes < 5)
  - Scroll smooth vers le debut de l'experience
- Si 5/5 gemmes : le bouton "revivre" est le seul affiche

### 3.2 Integration avec l'EndingScene existante

- Ajouter les actes 2, 3, 4 dans le systeme de phases existant
- Les phases deviennent : `waiting` → `reveal` → `bilan` → `letter` (si 5/5) → `heart` → `restart`
- Le `ProgressiveReveal` existant n'est pas modifie
- La `StarField` existante continue de fonctionner en arriere-plan

---

## 4. Changements Techniques

### 4.1 Nouveaux Fichiers

```
src/
├── context/
│   └── SecretContext.tsx        # Etat global des gemmes/secrets
├── components/
│   ├── intro/
│   │   ├── HeartbeatGlow.tsx     # Lueur pulse acte 1
│   │   ├── LightSweep.tsx        # Rayon de lumiere acte 2
│   │   ├── PortalButton.tsx      # Portail circulaire acte 3
│   │   └── PortalExplosion.tsx   # Animation d'ouverture
│   ├── secrets/
│   │   ├── GemCounter.tsx        # Compteur 💎 X/5
│   │   ├── GemAnimation.tsx      # Animation apparition gemme
│   │   ├── SecretPassword.tsx    # Clavier mot de passe
│   │   └── StarCatcherGame.tsx   # Mini-jeu attrape-etoiles
│   └── ending/
│       ├── StatsBilan.tsx        # Bilan emotionnel
│       └── HandwrittenLetter.tsx # Lettre manuscrite animee
```

### 4.2 Fichiers Modifies

```
src/
├── App.tsx                       # Ajout SecretProvider, integration GemCounter
├── config.json                   # Ajout finalLetter, passwordWord, hotspotData
├── components/
│   ├── intro/IntroScene.tsx      # Refonte en 3 actes
│   ├── timeline/TimelineCard.tsx # Detection code secret + gemme
│   ├── polaroid/PolaroidCard.tsx # Hotspot detection + gemme
│   ├── openwhen/OpenWhenPortal.tsx # Tracking visites portals
│   ├── secrets/EasterEggs.tsx    # Evolution vers gemme nocturne
│   └── ending/EndingScene.tsx    # Ajout actes 2-4
```

### 4.3 Nouveaux Champs config.json

```json
{
  "finalLetter": "A DEFINIR — Contenu de la lettre ecrit par l'utilisateur",
  "passwordWord": "A DEFINIR — Mot forme par les lettres dorees (max 7 lettres)",
  "hotspotPolaroid": {
    "imageIndex": "A DEFINIR — Index de la photo concernee (0-11)",
    "x": "A DEFINIR — Pourcentage horizontal (0-100)",
    "y": "A DEFINIR — Pourcentage vertical (0-100)",
    "message": "tu m'as trouvee..."
  }
}
```

---

## 5. Liberte Technique

**Aucune limitation sur les dependances.** On peut utiliser :
- **Three.js / React Three Fiber** pour des effets 3D, particules WebGL, scenes immersives
- **GSAP** pour des animations avancees et sequences complexes
- **Canvas 2D** pour des effects particulaires ou dessins personnalises
- Toute autre librairie qui ameliore l'experience

Le seul critere : que ca reste fluide sur mobile (60fps cible, 30fps acceptable sur vieux telephones).

---

## 6. Contraintes et Risques

| Risque | Mitigation |
|--------|-----------|
| Perfs mobile (animations lourdes) | Limiter particules a 30, utiliser `will-change` avec parcimonie, `prefers-reduced-motion` |
| Elle ne trouve pas toutes les gemmes | Le compteur l'intrigue, bouton "chercher les secrets manquants" a la fin |
| localStorage pas fiable (navigation privee) | Fallback : l'experience fonctionne sans persistence, juste pas de suivi multi-visites |
| Mot de passe trop dur | Le mot est court (max 7 lettres), indices visuels dans les lettres dorees |
| Mini-jeu frustrant | Hitbox genereuses, 3 etoiles max a la fois, rejouable infiniment |
| Lettre trop longue → ennui | Vitesse d'ecriture reglable, skip possible en tapant |
