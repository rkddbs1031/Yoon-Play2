import { atom } from 'jotai';

import { LikeStatus } from '@/constants/like';
import { PlaylistItem } from '@/types/playlist';

export const likedPlaylistAtom = atom<PlaylistItem[]>([]);

export const isLikedSelectorAtom = atom(get => {
  const likedPlaylist = get(likedPlaylistAtom);

  return (videoId: string) => likedPlaylist.some(p => p.videoId === videoId);
});
