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
