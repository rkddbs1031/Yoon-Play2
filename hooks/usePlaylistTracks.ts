import { useAtomValue } from 'jotai';

import { LIKED_PLAYLIST_ID } from '@/constants/library';
import { usePlaylistTracksQuery } from '@/services/playlists';
import { likedPlaylistAtom } from '@/store/like/atom';

/**
 * 플레이리스트 정보 + 트랙 조회
 *
 * - 좋아요 플레이리스트: atom에서 트랙 가져오기
 * - 유저 플레이리스트: ReactQuery 로 DB 조회
 */

export const usePlaylistTracks = (playlistId: string) => {
  const likedPlaylist = useAtomValue(likedPlaylistAtom);
  const isLiked = playlistId === LIKED_PLAYLIST_ID;

  const { data, isLoading } = usePlaylistTracksQuery(playlistId);

  // 좋아요면 atom에서, 아니면 query 결과에서
  const tracks = isLiked ? likedPlaylist : data?.tracks || [];
  const playlist = isLiked ? null : data?.playlist || null;

  return {
    playlist, // 플레이리스트 정보 (좋아요면 null)
    tracks, // 트랙 리스트
    isLoading: isLiked ? false : isLoading,
  };
};
