import { atom } from 'jotai';
import { YouTubePlayer } from 'react-youtube';

import { PlaylistItem, PlaylistSource } from '@/types/playlist';

export const isPlayerReadyAtom = atom(false);

export const playerRefAtom = atom<YouTubePlayer | null>(null);

export const playlistState = atom<PlaylistItem[]>([]);

export const playlistSourceAtom = atom<PlaylistSource | null>(null);

export const isPlayingState = atom<boolean>(false);

export const currentVideoIdAtom = atom<string | null>('');

export const durationAtom = atom<number>(0);

export const currentTimeAtom = atom<number>(0);

export const volumeAtom = atom<number>(50);

export const isHoveredVolumeButton = atom<boolean>(false);

export const isPanelOpen = atom<boolean>(false);

export const currentIndexAtom = atom(get => {
  const playlist = get(playlistState);
  const currentVideoId = get(currentVideoIdAtom);
  return playlist.findIndex(item => item.videoId === currentVideoId);
});

export const currentVideoAtom = atom(get => {
  const playlist = get(playlistState);
  const currentIndex = get(currentIndexAtom);
  return currentIndex !== -1 ? playlist[currentIndex] : null;
});

export const lastIndexAtom = atom(get => {
  const playlist = get(playlistState);
  return playlist.length - 1;
});
