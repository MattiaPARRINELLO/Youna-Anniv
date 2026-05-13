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
