import { useEffect, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';

import { LikeStatus } from '@/constants/like';
import { isLikedSelectorAtom, likedPlaylistAtom } from '@/store/like/atom';
import { PlaylistItem } from '@/types/playlist';

import * as likedDB from '@/lib/indexedDB/likedPlaylistDB';

export const useLike = () => {
  const setLikedPlaylist = useSetAtom(likedPlaylistAtom);
  const isLikedSelector = useAtomValue(isLikedSelectorAtom);

  const [isLoading, setIsLoading] = useState(true);

  const restoreLikedPlaylist = async () => {
    setIsLoading(true);

    try {
      const result = await likedDB.getLikedPlaylist();
      setLikedPlaylist(result ?? []);
    } catch (error) {
      console.error('Failed to restore liked playlist', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreLikedPlaylist();
  }, []);

  const handleToggleLike = async (item: PlaylistItem) => {
    const liked = await likedDB.isLikedItem(item.videoId);

    if (liked) {
      await likedDB.deleteLikedItem(item.videoId);
    } else {
      await likedDB.addLikedItem(item);
    }

    const updated = await likedDB.getLikedPlaylist();
    setLikedPlaylist(updated);

    return {
      status: liked ? LikeStatus.Remove : LikeStatus.Add,
    };
  };

  const isLiked = (videoId: string) => isLikedSelector(videoId);

  return { isLiked, toggleLike: handleToggleLike, isLoading };
};
