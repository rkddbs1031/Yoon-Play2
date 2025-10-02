import { YoutubeThumbnail } from '@/types/youtube';
import { atom } from 'jotai';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: YoutubeThumbnail;
}

export const playlistState = atom<PlaylistItem[]>([]);

export const isPlayingState = atom<boolean>(false);

export const currentPlayingIndexState = atom<number>(0);

export const durationAtom = atom<number>(0);

export const currentTimeAtom = atom<number>(0);

export const volumeAtom = atom<number>(50);
