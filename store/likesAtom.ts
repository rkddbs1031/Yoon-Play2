import { atom } from 'jotai';

import { LikeStatus } from '@/constants/like';
import { PlaylistItem } from '@/types/playlist';

export const likedPlaylistAtom = atom<PlaylistItem[]>([]);

export const toggleLikePlaylistAtom = atom(
  get => get(likedPlaylistAtom),
  (get, set, item: PlaylistItem) => {
    const prev = get(likedPlaylistAtom);
    const isExisted = prev.some(p => p.videoId === item.videoId);
    if (isExisted) {
      set(
        likedPlaylistAtom,
        prev.filter(p => p.videoId !== item.videoId),
      );

      return { status: LikeStatus.Remove };
    } else {
      set(likedPlaylistAtom, [item, ...prev]);

      return { status: LikeStatus.Add };
    }
  },
);

export const isLikedSelectorAtom = atom(get => {
  const likedPlaylist = get(likedPlaylistAtom);

  return (videoId: string) => likedPlaylist.some(p => p.videoId === videoId);
});
