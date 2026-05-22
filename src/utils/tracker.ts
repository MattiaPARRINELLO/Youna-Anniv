const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

let ipPromise: Promise<string | null> | null = null;

function getIp(): Promise<string | null> {
  if (!ipPromise) {
    ipPromise = fetch('https://api.ipify.org?format=json')
      .then(r => r.json() as Promise<{ ip: string }>)
      .then(d => d.ip)
      .catch(() => null);
  }
  return ipPromise;
}

function getDeviceEmoji(): string {
  if (typeof navigator === 'undefined') return '💻';
  const ua = navigator.userAgent;
  if (ua.includes('Mobile') || ua.includes('Android')) return '📱';
  if (ua.includes('iPad') || ua.includes('Tablet')) return '📟';
  return '💻';
}

function getBrowser(): string {
  if (typeof navigator === 'undefined') return '—';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Autre';
}

function getTimeContext(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return '🌅 Matin';
  if (h >= 12 && h < 14) return '☀️ Midi';
  if (h >= 14 && h < 18) return '🌤 Après-midi';
  if (h >= 18 && h < 22) return '🌆 Soirée';
  return '🌙 Nuit';
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}min ${s}s`;
  if (m > 0) return `${m}min ${s}s`;
  return `${s}s`;
}

const SITE_URL = 'https://youyou.mprnl.fr';

// ── Session tracking ──────────────────────────────────────

const SESSION_KEY = 'youyou_session';

const ALL_LETTERS = [
  'Ouvre quand tu es triste',
  'Ouvre quand tu doutes de toi',
  'Ouvre quand tu n\'arrives pas à dormir',
  'Ouvre quand le soleil brille',
  'Ouvre quand tu te sens seule',
  'Ouvre quand tout va trop vite',
  'Ouvre quand tu as besoin de courage',
  'Juste parce que je t\'aime',
];

const LETTER_EMOJIS: Record<string, string> = {
  'Ouvre quand tu es triste': '😢',
  'Ouvre quand tu doutes de toi': '🤔',
  'Ouvre quand tu n\'arrives pas à dormir': '🌙',
  'Ouvre quand le soleil brille': '☀️',
  'Ouvre quand tu te sens seule': '🧍',
  'Ouvre quand tout va trop vite': '🫂',
  'Ouvre quand tu as besoin de courage': '💪',
  'Juste parce que je t\'aime': '💛',
};

const GEM_NAMES: Record<string, string> = {
  gem_1: '🔵 Timeline',
  gem_2: '🩷 Hotspot',
  gem_3: '🟡 Mot de passe',
  gem_4: '🟣 Fidélité',
  gem_5: '🟠 Étoiles',
  gem_6: '🟢 Memory',
  gem_7: '🩷 Quiz',
};

const GEM_ORDER = ['gem_1', 'gem_2', 'gem_3', 'gem_4', 'gem_5', 'gem_6', 'gem_7'];

interface SessionData {
  start: number;
  gemsFound: string[];
  lettersOpened: string[];
  musicPlayed: boolean;
  finalLetterReached: boolean;
  experienceCompleted: boolean;
}

function getSession(): SessionData {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const fresh: SessionData = {
    start: Date.now(),
    gemsFound: [],
    lettersOpened: [],
    musicPlayed: false,
    finalLetterReached: false,
    experienceCompleted: false,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveSession(s: SessionData) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}

function sendSessionSummary() {
  const session = getSession();
  const duration = Math.floor((Date.now() - session.start) / 1000);

  const opened = session.lettersOpened;
  const notOpened = ALL_LETTERS.filter(l => !opened.includes(l));

  // Gem progress bar
  const gemProgress = GEM_ORDER.map(g => session.gemsFound.includes(g) ? '🟡' : '⚫').join('');
  const gemList = session.gemsFound.length > 0
    ? session.gemsFound.map(g => GEM_NAMES[g] || g).join('\n')
    : 'Aucune gemme trouvée';

  // Letters opened list
  const openedList = opened.length > 0
    ? opened.map(l => `${LETTER_EMOJIS[l] || '💌'} ${l}`).join('\n')
    : 'Aucune lettre ouverte';

  // Letters not opened list
  const notOpenedList = notOpened.length > 0
    ? notOpened.map(l => `${LETTER_EMOJIS[l] || '💌'} ${l}`).join('\n')
    : '✅ Toutes ouvertes !';

  // Mood based on engagement
  let mood = '';
  const gemCount = session.gemsFound.length;
  const letterCount = opened.length;
  if (gemCount === 5 && letterCount === ALL_LETTERS.length) {
    mood = '🌟 Exploration complète ! Rien ne lui a échappé.';
  } else if (gemCount >= 3 || letterCount >= 5) {
    mood = '🩷 Une belle exploration, pleine de curiosité.';
  } else if (gemCount >= 1 || letterCount >= 2) {
    mood = '💛 Elle a commencé à explorer, il reste des secrets.';
  } else {
    mood = '🤍 Une visite rapide, peut-être la prochaine fois…';
  }

  const embed: Record<string, unknown> = {
    title: '🩷 Youyou · Récap de visite',
    description: `${mood}`,
    color: gemCount === 5 ? 0xFFD700 : 0xD4AF37,
    timestamp: new Date().toISOString(),
    footer: { text: `Youyou · ${new Date().toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}` },
    fields: [
      { name: `⏱️ Temps passé`, value: formatDuration(duration), inline: true },
      { name: `💎 Gemmes (${gemCount}/5)`, value: `${gemProgress}\n${gemList}`, inline: true },
      { name: `🎵 Musique`, value: session.musicPlayed ? '✅ Lancée' : '❌ Silencieux', inline: true },
      { name: `💕 Lettre finale`, value: session.experienceCompleted ? '✅ Finie 🥹' : session.finalLetterReached ? '📖 En cours' : '❌ Pas encore', inline: true },
      { name: `📬 Ouvertes (${opened.length}/${ALL_LETTERS.length})`, value: openedList, inline: true },
      { name: `📭 Pas ouvertes (${notOpened.length})`, value: notOpenedList, inline: true },
    ],
  };

  try {
    const blob = new Blob([JSON.stringify({
      username: 'Youyou',
      avatar_url: `${SITE_URL}/favicon.svg`,
      embeds: [embed],
    })], { type: 'application/json' });
    navigator.sendBeacon(WEBHOOK_URL!, blob);
  } catch {}
}

if (typeof window !== 'undefined' && WEBHOOK_URL) {
  window.addEventListener('beforeunload', sendSessionSummary);
}

// ── Event embeds ──────────────────────────────────────────

interface EmbedConfig {
  title: string;
  description: string;
  color: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  thumbnail?: string;
  image?: string;
}

const EMBEDS: Record<string, (details?: string) => EmbedConfig> = {
  visit: d => ({
    title: '👋 Nouvelle visite',
    description: `Quelqu'un vient d'arriver sur le site pour la **${d || '—'}** 🩷`,
    color: 0xD4AF37,
    fields: [
      { name: '📱 Appareil', value: getDeviceEmoji(), inline: true },
      { name: '🌐 Navigateur', value: getBrowser(), inline: true },
      { name: '⏰ Moment', value: getTimeContext(), inline: true },
    ],
  }),

  enter_site: () => ({
    title: '🚪✨ Entrée dans l\'univers',
    description: 'Le portail a été traversé. L\'aventure Youyou commence…',
    color: 0xFF69B4,
  }),

  timeline_reveal: d => ({
    title: '📖 Souvenir dévoilé',
    description: `Une carte de la timeline vient d'être révélée :\n> **${d || '—'}**`,
    color: 0x00BFFF,
  }),

  timeline_order_correct: () => ({
    title: '🔓 Ordre secret trouvé',
    description: 'Les cartes de la timeline ont été tapées dans le bon ordre ! La première gemme est débloquée. 🎯',
    color: 0x00FF7F,
  }),

  polaroid_reveal: d => ({
    title: '📸 Message caché',
    description: `Un message secret a été découvert dans un polaroid :\n> *${d || '—'}*`,
    color: 0xFF69B4,
  }),

  gem_1: () => ({
    title: '💎 Gemme — Timeline',
    description: 'Les souvenirs remis en ordre… une gemme apparaît comme par magie. ✨',
    color: 0x00BFFF,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_2: () => ({
    title: '💎 Gemme — Hotspot',
    description: 'Un hotspot caché dans les polaroids… il suffisait de chercher au bon endroit. 🔍',
    color: 0xFF69B4,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_3: () => ({
    title: '💎 Gemme — Mot de passe',
    description: 'Le mot de passe « JETAIME » déchiffré dans les lettres dorées. Le cœur a parlé. 🔐',
    color: 0xFFD700,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_4: () => ({
    title: '💎 Gemme — Fidélité',
    description: '2 minutes sur le site… la patience mérite une gemme. 🩷',
    color: 0x8A2BE2,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_5: () => ({
    title: '💎 Gemme — Jeu des étoiles',
    description: 'Les étoiles ont été attrapées une par une. La dernière gemme scintille. ⭐',
    color: 0xFFA500,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_6: () => ({
    title: '💎 Gemme — Memory',
    description: 'Toutes les paires de souvenirs ont été retrouvées. La mémoire du cœur est infaillible. 🃏',
    color: 0x00FF7F,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_7: () => ({
    title: '💎 Gemme — Quiz',
    description: 'Le quiz a été complété. Elle me connaît vraiment… 💕',
    color: 0xFFB6C1,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  gem_all: () => ({
    title: '🌟 LES 7 GEMMES',
    description: '**Youna a trouvé TOUTES les gemmes !!!**\n\nElle a exploré chaque recoin, résolu chaque énigme, découvert chaque secret caché avec amour. Rien ne lui échappe. Quel cœur courageux. 🩷',
    color: 0xFF0044,
    thumbnail: `${SITE_URL}/favicon.svg`,
  }),

  open_when_opened: d => ({
    title: '💌 Lettre ouverte',
    description: `La lettre « **${d || '—'}** » a été ouverte avec amour.`,
    color: 0xFFA07A,
  }),

  secret_letter_revealed: d => ({
    title: '✨ Lettre dorée',
    description: `Une lettre secrète a été trouvée dans « **${d || '—'}** » ! Une nouvelle lettre du mot de passe se dévoile…`,
    color: 0xFFD700,
  }),

  password_incorrect: d => ({
    title: '❌ Mot de passe incorrect',
    description: `Quelqu'un a essayé « **${d || '—'}** »… mais ce n'était pas le bon. 🔍`,
    color: 0xFF4444,
  }),

  password_correct: () => ({
    title: '🔑 Mot de passe « JETAIME »',
    description: 'Le code secret a été saisi avec succès. Le cœur a parlé. 💛',
    color: 0xFF1493,
  }),

  star_game_played: () => ({
    title: '⭐ Chasse aux étoiles',
    description: 'Le jeu des étoiles a été lancé. 12 secondes pour toutes les attraper !',
    color: 0x87CEEB,
  }),

  star_game_won: d => ({
    title: '🏆 Maître des étoiles',
    description: `**${d || 'Toutes les'}** étoiles capturées ! La gemme des étoiles est débloquée ! 🌟`,
    color: 0xFFD700,
  }),

  quiz_completed: d => ({
    title: '🌸 Quiz « Tu me connais ? »',
    description: `Le quiz est terminé ! Score : **${d || '—'}** 💕`,
    color: 0xFFB6C1,
  }),

  quiz_retry: () => ({
    title: '🔄 Quiz — Nouvelle tentative',
    description: 'Le quiz a été recommencé. Elle veut faire mieux ! 💪',
    color: 0xFFB6C1,
  }),

  final_letter_started: () => ({
    title: '💕 La lettre finale',
    description: 'Youna a atteint la dernière section… la lettre d\'amour commence à se dévoiler, mot après mot. 🥺',
    color: 0xFF69B4,
  }),

  experience_completed: () => ({
    title: '🎬 Fin du voyage',
    description: 'Youna a terminé l\'histoire du début à la fin. Elle a tout vu, tout lu, tout ressenti. Le voyage est complet. 🥹🩷',
    color: 0xFFD700,
  }),

  experience_restarted: () => ({
    title: '🔄 Nouveau départ',
    description: 'L\'expérience a été recommencée. Tout revit. 💫',
    color: 0x808080,
  }),

  music_play: () => ({
    title: '🎵 Leur chanson',
    description: '« Notre chanson » s\'est lancée, emplissant le site de mélodie et d\'émotion. 🎶',
    color: 0x9370DB,
  }),

  music_pause: () => ({
    title: '🤫 Silence',
    description: 'La musique a été mise en pause. Le silence laisse place aux souvenirs.',
    color: 0x696969,
  }),
};

export async function trackEvent(event: string, details?: string) {
  if (!WEBHOOK_URL) return;

  // ── Persist session data ──
  const session = getSession();

  if (event === 'open_when_opened' && details) {
    if (!session.lettersOpened.includes(details)) {
      session.lettersOpened.push(details);
    }
  }

  if (event.startsWith('gem_') && event !== 'gem_all') {
    if (!session.gemsFound.includes(event)) {
      session.gemsFound.push(event);
    }
  }

  if (event === 'music_play') session.musicPlayed = true;
  if (event === 'final_letter_started') session.finalLetterReached = true;
  if (event === 'experience_completed') session.experienceCompleted = true;

  if (event === 'experience_restarted') {
    session.lettersOpened = [];
    session.gemsFound = [];
    session.musicPlayed = false;
    session.finalLetterReached = false;
    session.experienceCompleted = false;
    session.start = Date.now();
  }

  saveSession(session);

  // ── Send event embed ──
  const ip = await getIp();
  const builder = EMBEDS[event];
  const config = builder ? builder(details) : {
    title: event,
    description: details || 'Événement inconnu',
    color: 0xD4AF37,
  };

  const embed: Record<string, unknown> = {
    title: `🩷 Youyou · ${config.title}`,
    description: config.description,
    color: config.color,
    timestamp: new Date().toISOString(),
    footer: { text: `Youyou · ${new Date().toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}` },
  };

  if (config.thumbnail) embed.thumbnail = { url: config.thumbnail };
  if (config.image) embed.image = { url: config.image };

  const fields: Array<Record<string, unknown>> = [...(config.fields || [])];

  if (ip) {
    fields.push({ name: '🌍 IP', value: `\`${ip}\``, inline: true });
  }

  if (fields.length > 0) embed.fields = fields;

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Youyou',
        avatar_url: `${SITE_URL}/favicon.svg`,
        embeds: [embed],
      }),
    });
  } catch {
    // silence
  }
}
