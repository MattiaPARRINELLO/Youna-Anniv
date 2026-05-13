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
