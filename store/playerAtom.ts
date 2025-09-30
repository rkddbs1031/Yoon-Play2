import { atom } from 'recoil';

import { YoutubeThumbnail } from '@/types/youtube';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: YoutubeThumbnail;
}

export const playlistState = atom<PlaylistItem[]>({
  key: 'playlistState',
  default: [],
});

export const isPlayingState = atom<boolean>({
  key: 'isPlayingState',
  default: false,
});

export const currentPlayingIndexState = atom<number>({
  key: 'currentPlayingIndexState',
  default: 0,
});
