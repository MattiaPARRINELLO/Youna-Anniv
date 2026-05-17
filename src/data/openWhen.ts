import config from '../config.json';

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
  secretLetter?: string;
  photos?: string[];
  audio?: string;
  surprise?: OpenWhenSurprise;
}

export const openWhenEntries = config.openWhen as OpenWhenEntry[];
