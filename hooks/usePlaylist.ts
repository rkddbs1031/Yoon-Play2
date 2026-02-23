'use client';

import { LIKED_PLAYLIST_ID } from '@/constants/library';
import { usePlaylistsQuery } from '@/services/playlists';

/**
 * - 유저가 만든 플레이리스트만 조회
 * - 플레이리스트 생성 (a.k.a. 폴더)
 * - targetTrack 관리 (어떤 트랙을 추가할지)
 * - 트랙 추가
 *
 * - 플레이리스트 목록 조회 (likedPlaylist, userPlaylist)
 * - 플레이리스트 생성 (재생목록 폴더)
 */

export const usePlaylist = () => {
  const { data: playlists = [], isLoading, refetch } = usePlaylistsQuery();

  const likedPlaylistInfo = playlists.find(p => p.id === LIKED_PLAYLIST_ID);
  const userPlaylistsInfo = playlists.filter(p => p.id !== LIKED_PLAYLIST_ID);

  return {
    playlists, // 전체
    likedPlaylistInfo, // 좋아요 요약 정보
    userPlaylistsInfo, // 유저 플레이리스트 요약 정보
    isLoading,
    refetch,
  };
};
