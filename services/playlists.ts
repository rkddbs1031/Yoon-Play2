import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as playlistDB from '@/lib/indexedDB/playlistDB';

const PLAYLISTS_KEY = 'playlists';
const PLAYLIST_TRACKS_KEY = 'playlist-tracks';
const PLAYLIST_PREVIEW_KEY = 'playlist-preview';

// 전체 플레이리스트 목록 조회 - usePlaylist 훅 내부, Library 페이지
export const usePlaylistsQuery = () => {
  return useQuery({
    queryKey: [PLAYLISTS_KEY],
    queryFn: playlistDB.getPlaylists,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// 특정 플레이리스트의 실제 트랙 조회 - usePlaylistTracks 훅 내부, Playlist View 페이지
export const usePlaylistTracksQuery = (playlistId: string) => {
  return useQuery({
    queryKey: [PLAYLIST_TRACKS_KEY, playlistId],
    queryFn: () => playlistDB.getPlaylistTracks(playlistId),
    enabled: !!playlistId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// 플레이리스트 미리보기(썸네일용), 최대 4개까지의 트랙만 가져오기
export const usePlaylistPreviewQuery = ({ playlistId, limit }: { playlistId?: string; limit?: number }) => {
  return useQuery({
    queryKey: [PLAYLIST_PREVIEW_KEY, playlistId],
    queryFn: () => {
      if (!playlistId) return [];

      return playlistDB.getPlaylistPreviewTracks({ playlistId, limit });
    },
    enabled: !!playlistId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// 플레이리스트 생성, 생성 후 목록 재조회
export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });
    },
  });
};

// 플레이리스트에 트랙 추가, 추가 후 목록 재조회
export const useAddTrackToPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.addTrackToPlaylist,
    onSuccess: (_, variables) => {
      // TODO: 해당 플레이리스트의 트랙 목록 갱신
      // queryClient.invalidateQueries({
      //   queryKey: ['playlistTracks', variables.playlistId]
      // });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });
    },
  });
};

// 플레이리스트(재생목록 = 폴더)내 특정 트랙 삭제
export const useRemoveTrackFromPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.removeTrackFromPlaylist,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_TRACKS_KEY, data.playlistId] });
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });
    },
  });
};

// 플레이리스트(재생목록 = 폴더) 정보 수정 (제목, 설명)
export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.updatePlaylistInfo,
    onSuccess: updated => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] }); // 제목 바뀌었으므로, 전체 재생목록 갱산
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_TRACKS_KEY, updated.id] }); // 정보 갱신
    },
  });
};

// 플레이리스트(재생목록 = 폴더) 자체 삭제
export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] }); // 전체 목록만 갱신
    },
  });
};
