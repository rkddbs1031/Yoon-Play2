import { atom } from 'jotai';
import { YouTubePlayer } from 'react-youtube';

import { YoutubeThumbnail } from '@/types/youtube';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: YoutubeThumbnail;
}

export const isPlayerReadyAtom = atom(false);

export const playerRefAtom = atom<YouTubePlayer | null>(null);

export const playlistState = atom<PlaylistItem[]>([]);

export const isPlayingState = atom<boolean>(false);

export const currentPlayingIndexState = atom<number>(0);

export const durationAtom = atom<number>(0);

export const currentTimeAtom = atom<number>(0);

export const volumeAtom = atom<number>(50);

export const isHoveredVolumeButton = atom<boolean>(false);

export const isPanelOpen = atom<boolean>(false);
