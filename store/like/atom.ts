import { atom } from 'jotai';

import { PlaylistItem } from '@/types/playlist';

export const likedPlaylistAtom = atom<PlaylistItem[]>([]);

export const likedSetAtom = atom(get => {
  const liked = get(likedPlaylistAtom);
  return new Set(liked.map(v => v.videoId));
});

export const isLikedSelectorAtom = atom(get => {
  const likedSet = get(likedSetAtom);

  return (videoId: string) => likedSet.has(videoId);
});
