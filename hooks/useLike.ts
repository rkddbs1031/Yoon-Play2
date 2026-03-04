import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useAtom } from 'jotai';

import { LikeStatus } from '@/constants/like';
import * as likedDB from '@/lib/indexedDB/likedPlaylistDB';
import { isLikedSelectorAtom, likedPlaylistAtom } from '@/store/like/atom';
import { PlaylistItem } from '@/types/playlist';

/**
 * - 좋아요 목록 제공
 * - 좋아요 토글 (추가/삭제)
 * - 좋아요 여부 확인 (isLiked)
 */

export const useLike = () => {
  const queryClient = useQueryClient();
  const [likedPlaylist, setLikedPlaylist] = useAtom(likedPlaylistAtom);
  const isLikedSelector = useAtomValue(isLikedSelectorAtom);

  useEffect(() => {
    const restoreLikedPlaylist = async () => {
      try {
        const result = await likedDB.getLikedPlaylist();
        setLikedPlaylist(result ?? []);
      } catch (error) {
        console.error('Failed to restore liked playlist', error);
      }
    };

    if (likedPlaylist.length === 0) {
      restoreLikedPlaylist();
    }
  }, []);

  const toggleMutation = useMutation({
    mutationFn: async (item: PlaylistItem) => {
      const liked = await likedDB.isLikedItem(item.videoId);

      if (liked) {
        await likedDB.deleteLikedItem(item.videoId);
      } else {
        await likedDB.addLikedItem(item);
      }

      return { status: liked ? LikeStatus.Remove : LikeStatus.Add };
    },
    onSuccess: async () => {
      // 좋아요 목록 갱신
      const updated = await likedDB.getLikedPlaylist();
      setLikedPlaylist(updated);

      // 플레이리스트 목록도 갱신 (trackCount 변경)
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const isLiked = (videoId: string) => isLikedSelector(videoId);

  return {
    likedPlaylist, // 좋아요 목록
    isLiked, // 좋아요 여부 확인
    toggleLike: toggleMutation.mutate, // 좋아요 토글
    isToggleing: toggleMutation.isPending,
  };
};
