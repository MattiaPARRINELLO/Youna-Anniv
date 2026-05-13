import config from '../config.json';

export interface PolaroidData {
  id: string;
  image: string;
  caption: string;
  date: string;
  rotation: number;
  hiddenMessage?: string;
  tapeStyle: 'top' | 'side' | 'both';
}

export const polaroids = config.polaroids as PolaroidData[];
