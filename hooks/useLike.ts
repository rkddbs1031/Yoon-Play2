import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';

import { LikeStatus } from '@/constants/like';
import { toggleLikePlaylistAtom, isLikedSelectorAtom, likedPlaylistAtom } from '@/store/likesAtom';
import { PlaylistItem } from '@/types/playlist';

import * as likedDB from '@/lib/indexedDB/likedPlaylistDB';

export const useLike = () => {
  const toggleLike = useSetAtom(toggleLikePlaylistAtom);
  const setLikedPlaylist = useSetAtom(likedPlaylistAtom);
  const isLikedSelector = useAtomValue(isLikedSelectorAtom);

  useEffect(() => {
    likedDB.getLikedPlaylist().then(setLikedPlaylist);
  }, [setLikedPlaylist]);

  const handleToggleLike = async (item: PlaylistItem) => {
    const result = toggleLike(item);

    if (result.status === LikeStatus.Add) {
      await likedDB.addLikedItem(item);
    } else {
      await likedDB.deleteLikedItem(item.videoId);
    }

    return result;
  };

  const isLiked = (videoId: string) => isLikedSelector(videoId);

  return { isLiked, toggleLike: handleToggleLike };
};
