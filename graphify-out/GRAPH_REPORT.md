# Graph Report - .  (2026-05-18)

## Corpus Check
- Large corpus: 99 files · ~1,142,058 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 247 nodes · 440 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Secret Context & Polaroid Data|Secret Context & Polaroid Data]]
- [[_COMMUNITY_Audio & Cinematic Effects|Audio & Cinematic Effects]]
- [[_COMMUNITY_Timeline, Counters & Locations|Timeline, Counters & Locations]]
- [[_COMMUNITY_Design Specifications & Plans|Design Specifications & Plans]]
- [[_COMMUNITY_Interactive UI Hooks & Cards|Interactive UI Hooks & Cards]]
- [[_COMMUNITY_Timeline Events & Lock Screen|Timeline Events & Lock Screen]]
- [[_COMMUNITY_Open When Surprise Feature|Open When Surprise Feature]]
- [[_COMMUNITY_Late Memory Polaroids|Late Memory Polaroids]]
- [[_COMMUNITY_Early Memories & Rituals|Early Memories & Rituals]]
- [[_COMMUNITY_Timeline Photo Gallery|Timeline Photo Gallery]]
- [[_COMMUNITY_Parallax Scrolling|Parallax Scrolling]]
- [[_COMMUNITY_Typewriter Text Effect|Typewriter Text Effect]]
- [[_COMMUNITY_Heart Animation|Heart Animation]]
- [[_COMMUNITY_A4 QR Code Generator|A4 QR Code Generator]]
- [[_COMMUNITY_Map Locations Data|Map Locations Data]]
- [[_COMMUNITY_Nighttime Connection Theme|Nighttime Connection Theme]]

## God Nodes (most connected - your core abstractions)
1. `useSecrets()` - 17 edges
2. `useMediaQuery()` - 13 edges
3. `Youna Romantic Website` - 12 edges
4. `useSfx()` - 11 edges
5. `FloatingElements()` - 10 edges
6. `SectionWrapper()` - 9 edges
7. `FadeInOnScroll()` - 7 edges
8. `GemAnimation()` - 7 edges
9. `useMusic()` - 7 edges
10. `Treasure Hunt — 5 Gems` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Polaroid: "~ un soir de concert ~"` --semantically_similar_to--> `Timeline Event: "Premiere rencontre" (23 Octobre 2025)`  [INFERRED] [semantically similar]
  public/photos/polaroids/memory-9.jpg → src/config.json
- `Polaroid: "~ le 16 mars ~"` --semantically_similar_to--> `Timeline Event: "Le debut de nous" (16 Mars 2026)`  [INFERRED] [semantically similar]
  public/photos/polaroids/memory-10.jpg → src/config.json
- `Polaroid: "~ nous ~"` --semantically_similar_to--> `OpenWhen Letter: "Juste parce que je t'aime"`  [INFERRED] [semantically similar]
  public/photos/polaroids/memory-12.jpg → src/config.json
- `Map Location: "Notre premier vrai rendez-vous" (Paris)` --semantically_similar_to--> `Map Location: "Notre premiere rencontre IRL" (Paris)`  [INFERRED] [semantically similar]
  public/photos/map/first-date.jpg → src/config.json
- `Polaroid Memory 1: '5h du matin'` --conceptually_related_to--> `Late-Night Phone Call Ritual`  [INFERRED]
  public/photos/polaroids/memory-1.jpg → src/config.json

## Hyperedges (group relationships)
- **Youna Romantic Website Sections** — 2026-05-12-youna-romantic-website-design_timeline_section, 2026-05-12-youna-romantic-website-design_polaroid_gallery, 2026-05-12-youna-romantic-website-design_open_when, 2026-05-12-youna-romantic-website-design_ending_scene, 2026-05-12-youna-romantic-website-design_music_context, 2026-05-12-youna-romantic-website-design_easter_eggs [EXTRACTED 1.00]
- **Three Immersion Layers (Experience Profonde)** — 2026-05-13-experience-profonde-design_cinematic_scroll, 2026-05-13-experience-profonde-design_reactive_environment, 2026-05-13-experience-profonde-design_spatial_depth [EXTRACTED 1.00]
- **Treasure Hunt — 5 Hidden Gems** — 2026-05-17-experience-upgrade-design_treasure_hunt, 2026-05-17-experience-upgrade-design_secret_context, 2026-05-17-experience-upgrade-design_star_catcher, 2026-05-12-youna-romantic-website-design_timeline_section, 2026-05-12-youna-romantic-website-design_polaroid_gallery, 2026-05-12-youna-romantic-website-design_open_when, 2026-05-12-youna-romantic-website-design_easter_eggs [EXTRACTED 1.00]
- **Couple's Relationship Journey — Chronological Timeline** — timeline_october_jpg, timeline_february_jpg, timeline_march_jpg, timeline_may_meeting_jpg, timeline_birthday_jpg [EXTRACTED 1.00]
- **Nighttime Long-Distance Connection Rituals** — polaroid_memory_1, polaroid_memory_5, polaroid_memory_6, concept_late_night_call_routine, concept_mutual_waiting, concept_sleeping_on_call [INFERRED 0.80]
- **Minecraft as a Shared Couple Activity** — polaroid_memory_3, polaroid_memory_4, concept_minecraft_shared_world [INFERRED 0.85]
- **Polaroid Memory Photos Chunk 3 (memories 1-6)** — polaroid_memory_1, polaroid_memory_2, polaroid_memory_3, polaroid_memory_4, polaroid_memory_5, polaroid_memory_6, config_polaroids_array [EXTRACTED 1.00]
- **Nightly Calls & Distance Polaroids** — memory-8_polaroid, memory-11_polaroid, memory-6_polaroid, memory-7_polaroid [INFERRED 0.85]
- **Origin Story Arc (Concert → Official → Us)** — memory-9_polaroid, memory-10_polaroid, memory-12_polaroid [INFERRED 0.85]
- **Paris Love Story Map Locations** — first-date_map_location, first-meeting_map_location, first-meeting_timeline [INFERRED 0.80]

## Communities (22 total, 5 thin omitted)

### Community 0 - "Secret Context & Polaroid Data"
Cohesion: 0.08
Nodes (26): SecretContext, SecretContextType, SecretProvider(), SecretState, useSecrets(), PolaroidData, polaroids, StatsBilan() (+18 more)

### Community 1 - "Audio & Cinematic Effects"
Cohesion: 0.09
Nodes (24): MusicContext, MusicContextType, MusicProvider(), useMusic(), HandwrittenLetter(), HandwrittenLetterProps, useSfx(), HeartbeatGlow() (+16 more)

### Community 2 - "Timeline, Counters & Locations"
Cohesion: 0.11
Nodes (20): CounterSection(), START_DATE, useTimeSince(), MapLocation, mapLocations, EndingScene(), phases, ProgressiveReveal() (+12 more)

### Community 3 - "Design Specifications & Plans"
Cohesion: 0.13
Nodes (25): Vertical Scroll + Horizontal Galleries Architecture, Cinematic Scrapbook Experience, Data Files (timeline, polaroids, openWhen, mapLocations), Easter Eggs & Hidden Secrets, Ending Scene, MusicContext / MusicProvider, Open When Hub & Portals, Polaroid Memory Gallery (+17 more)

### Community 4 - "Interactive UI Hooks & Cards"
Cohesion: 0.17
Nodes (12): StarField(), useMediaQuery(), ScrollVelocity, useScrollVelocity(), PortalCard(), PortalCardProps, CursorGlow(), ReactiveParticles() (+4 more)

### Community 5 - "Timeline Events & Lock Screen"
Cohesion: 0.14
Nodes (14): TimelineEvent, timelineEvents, LockScreen(), LockScreenProps, TARGET, useCountdown(), ProgressDots(), ProgressDotsProps (+6 more)

### Community 6 - "Open When Surprise Feature"
Cohesion: 0.16
Nodes (11): openWhenEntries, OpenWhenEntry, OpenWhenSurprise, OpenWhenTheme, OpenWhenPortal(), OpenWhenPortalProps, renderMessage(), ThemeBackground() (+3 more)

### Community 7 - "Late Memory Polaroids"
Cohesion: 0.31
Nodes (13): Timeline Event: "Premiere rencontre" (23 Octobre 2025), OpenWhen Letter: "Juste parce que je t'aime", Polaroid: "~ le 16 mars ~", Polaroid: "~ nos nuits ~", Polaroid: "~ nous ~", Polaroid: "~ s'endormir ensemble ~", Polaroid: "~ ta voix avant de dormir ~", Polaroid: "~ la distance ~" (+5 more)

### Community 8 - "Early Memories & Rituals"
Cohesion: 0.31
Nodes (11): Late-Night Phone Call Ritual, Minecraft Shared World Building, Mutual Waiting for Each Other, Falling Asleep Together on Call, config.json polaroids array, Polaroid Memory 1: '5h du matin', Polaroid Memory 2: 'ton rire', Polaroid Memory 3: 'notre maison' (Minecraft) (+3 more)

### Community 9 - "Timeline Photo Gallery"
Cohesion: 0.33
Nodes (7): Ton Anniversaire — 23 Mai 2026, Premier Appel — Premiere Fois Ta Voix, February First Call Photo (PNG variant), Le Debut de Nous — 16 Mars 2026, Premiere Rencontre IRL — Te Voir en Vrai, Premiere Rencontre — Concert d'Octobre, October Concert Photo (PNG variant)

### Community 14 - "Map Locations Data"
Cohesion: 0.67
Nodes (3): Map Location: "Notre premier vrai rendez-vous" (Paris), Map Location: "Notre premiere rencontre IRL" (Paris), Config: config.json::mapLocations[]

## Knowledge Gaps
- **65 isolated node(s):** `EndingScene`, `UNLOCK_DATE`, `SectionWrapperProps`, `FadeInOnScrollProps`, `directionMap` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useSecrets()` connect `Secret Context & Polaroid Data` to `Timeline, Counters & Locations`, `Timeline Events & Lock Screen`, `Open When Surprise Feature`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `FloatingElements()` connect `Timeline Events & Lock Screen` to `Secret Context & Polaroid Data`, `Audio & Cinematic Effects`, `Timeline, Counters & Locations`, `Interactive UI Hooks & Cards`, `Open When Surprise Feature`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `SectionWrapper()` connect `Timeline, Counters & Locations` to `Secret Context & Polaroid Data`, `Interactive UI Hooks & Cards`, `Timeline Events & Lock Screen`, `Open When Surprise Feature`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `EndingScene`, `UNLOCK_DATE`, `SectionWrapperProps` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Secret Context & Polaroid Data` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Audio & Cinematic Effects` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Timeline, Counters & Locations` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._