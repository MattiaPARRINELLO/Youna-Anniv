# A4 QR Code Sheet — Design Spec

## Purpose

Generate a printable A4 sheet with a QR code pointing to `youyou.mprnl.fr`, capturing the visual identity of the Youna anniversary website, to be given as a physical gift.

## Design Direction

- **Style**: Poetic postcard — dark background, gold accents
- **Layout**: Centered, symmetrical, portrait A4
- **QR Code**: Integrated with gold border, subtle glow, center of composition

## Visual Identity

| Token | Value |
|-------|-------|
| Background | `#1E1A24` (warm-darkest) |
| Primary accent | `#D4A853` (gold) |
| Text primary | `#FFF8EC` (cream) |
| Text secondary | `#E8D5B7` (cream-dark) |
| Text muted | `#7B6B8A` (violet) |
| Title font | Playfair Display, 600 weight |
| Subtitle font | Caveat (handwritten) |
| URL font | Inter, light |

## Layout (top to bottom, centered)

1. Gold line (60px, subtle gradient)
2. "pour toi" — uppercase, Playfair Display italic, gold, letter-spaced
3. "Youna" — Playfair Display, large (52px), cream
4. Gold divider (50px)
5. "Scanne et laisse-toi porter" — Caveat, cream-dark
6. QR code (120x120px) with gold border, subtle box-shadow glow
7. "youyou.mprnl.fr" — Inter, violet, uppercase, letter-spaced
8. Gold line (60px, subtle gradient)

Decorations: two soft radial glows (gold top, violet bottom), scattered tiny dots (stars).

## Technical

- Generate a real QR code for `youyou.mprnl.fr` using the `qrcode` npm library
- Output: PDF A4 (210x297mm) at print resolution
- Build as a standalone script or integrate into the project

## Out of Scope

- Double-sided printing
- Interactive elements
- Custom back side
