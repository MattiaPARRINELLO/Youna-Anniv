import config from '../config.json';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  message: string;
  photo: string;
}

export const timelineEvents = config.timeline as TimelineEvent[];
