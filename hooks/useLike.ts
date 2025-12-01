import { useSetAtom, useAtomValue } from 'jotai';

import { toggleLikePlaylistAtom, isLikedSelectorAtom } from '@/store/likesAtom';
import { PlaylistItem } from '@/types/playlist';

export const useLike = () => {
  const setLikePlaylist = useSetAtom(toggleLikePlaylistAtom);
  const isLikedSelector = useAtomValue(isLikedSelectorAtom);

  const isLiked = (videoId: string) => isLikedSelector(videoId);

  const toggleLike = (item: PlaylistItem) => setLikePlaylist(item);

  return { isLiked, toggleLike };
};
