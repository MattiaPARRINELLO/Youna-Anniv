import config from '../config.json';

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

export const mapLocations = config.mapLocations as MapLocation[];
