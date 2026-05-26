# Control Center — Design Spec

## Overview

Transform the birthday PWA into a control center hub for Youna, accessible at `/`.
The existing birthday content moves to `/anniversaire` unchanged.
A new message-sending page at `/message` lets Youna send text to an external API.

## Routing Architecture

- `react-router-dom` v6 with `BrowserRouter`
- Routes:
  - `/` → `ControlCenter` (hub with 2 navigation cards)
  - `/anniversaire` → current birthday site content (entire existing App, untouched)
  - `/message` → `MessagePage` (stylized letter-sending UI)
- A root layout wrapper detects the route and renders accordingly

## Component: ControlCenter (`/`)

- Dark romantic background matching the existing theme
- Two simple cards side by side (responsive: stacked on mobile)
- Card 1: "Anniversaire" → navigates to `/anniversaire`
- Card 2: "Envoyer un message" → navigates to `/message`
- Minimal, clean, no extra content

## Component: MessagePage (`/message`)

- Stylized letter/envelope UI
- Animated envelope opening on page load
- Text input styled as paper letter (cream background, Caveat handwritten font)
- "Envoyer" button triggers:
  - Envelope folding + flying-away animation
  - `POST` request to `https://tab.mprnl.fr/api/message` with `{ "text": "<user input>" }`
  - Animated confirmation on success
  - Error handling with friendly message on failure
- "Retour" button to navigate back to control center
- Same design system as the rest (dark bg, particles, glow, GrainOverlay)

## Birthday Page (`/anniversaire`)

- The entire current `App.tsx` content, unchanged, rendered as the `/anniversaire` route
- Lock screen, intro, all sections, all games, all easter eggs — identical behaviour

## External API

- URL: `https://tab.mprnl.fr/api/message`
- Method: `POST`
- Body: `{ "text": "<message content>" }`
- Content-Type: `application/json`
- CORS: must be handled — either the external API allows `youyou.mprnl.fr`, or use a Vite dev proxy

## Dev Proxy

In `vite.config.ts`, add a proxy rule to forward `/api/message` to `https://tab.mprnl.fr` during development.

## Data Flow (Message)

1. User types message in styled text input
2. User clicks "Envoyer"
3. Button shows loading state, envelope fly animation starts
4. `fetch POST https://tab.mprnl.fr/api/message` with `{ "text": "..." }`
5. On success: confirmation animation + success toast/screen
6. On error: error message with retry option
7. No local storage — purely pass-through to external API

## Dependencies to Add

- `react-router-dom` (v6)

## Files to Create

- `src/components/control-center/ControlCenter.tsx`
- `src/components/message/MessagePage.tsx`

## Files to Modify

- `src/App.tsx` — add React Router, define routes, move current content to `/anniversaire`
- `vite.config.ts` — add dev proxy for `/api/message`
- `package.json` — add `react-router-dom`

## Out of Scope

- No backend changes — this is purely a frontend reorganisation
- No modification to existing birthday content
- No authentication
- No message history/storage on this site
