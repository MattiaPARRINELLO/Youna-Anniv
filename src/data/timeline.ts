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
