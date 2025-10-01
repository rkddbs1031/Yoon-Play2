import { atom } from 'jotai';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

export const playlistState = atom<PlaylistItem[]>([]);

export const isPlayingState = atom<boolean>(false);

export const currentPlayingIndexState = atom<number>(0);
