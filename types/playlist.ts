import { YoutubeThumbnail } from './youtube';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: YoutubeThumbnail;
}

export enum PlaylistSource {
  Context = 'CONTEXT',
  Search = 'SEARCH',
}

export interface PlaylistDB {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  trackCount: number;
}
