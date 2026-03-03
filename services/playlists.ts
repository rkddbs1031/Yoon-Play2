import { useSetAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/useToast';
import { likedPlaylistAtom } from '@/store/like/atom';
import { LIKED_PLAYLIST_ID } from '@/constants/library';

import * as playlistDB from '@/lib/indexedDB/playlistDB';
import * as likedDB from '@/lib/indexedDB/likedPlaylistDB';

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
  const toast = useToast();

  return useMutation({
    mutationFn: playlistDB.createPlaylist,
    onSuccess: ({ trackId, title }) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });

      const message = trackId ? `${title} 재생목록을 만들고 곡을 추가했습니다.` : `${title} 재생목록을 만들었습니다.`;
      toast.success(message);
    },
  });
};

// 플레이리스트에 트랙 추가, 추가 후 목록 재조회
export const useAddTrackToPlaylistMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const setLikedPlaylist = useSetAtom(likedPlaylistAtom);

  return useMutation({
    mutationFn: playlistDB.addTrackToPlaylist,
    onSuccess: async (data, variables) => {
      const { title: playlistName, playlistId } = data;
      const { track } = variables;

      if (playlistId) {
        // 트랙 재조회
        queryClient.invalidateQueries({
          queryKey: [PLAYLIST_TRACKS_KEY, playlistId],
        });
      }

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });

      if (playlistId === LIKED_PLAYLIST_ID) {
        try {
          await likedDB.addLikedItem(track);

          // Jotai 전역 상태 갱신 -> 모든 하트 아이콘 즉시 불 들어옴
          const updated = await likedDB.getLikedPlaylist();
          setLikedPlaylist(updated);
        } catch (error) {
          console.error('좋아요 동기화 실패:', error);
        }
      }

      toast.success(`'${playlistName}'에 추가되었습니다.`);
    },
    onError: (error: Error) => {
      // 중복 에러 캐치
      if (error.message === 'ALREADY_EXISTS') {
        toast.info('이미 해당 플레이리스트에 추가된 곡이에요', { subtitle: '다른 곡을 추가해보세요! 😊' });
      } else {
        toast.warning('곡을 추가하는 중에 문제가 생겼어요.', { subtitle: '잠시 후 다시 이용해주세요.' });
      }
    },
  });
};

// 플레이리스트(재생목록 = 폴더)내 특정 트랙 삭제
export const useRemoveTrackFromPlaylistMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: playlistDB.removeTrackFromPlaylist,
    onSuccess: ({ playlistId, title }) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_TRACKS_KEY, playlistId] });
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] });

      const playlistName = title || '재생목록';
      toast.success(`${playlistName}에서 곡을 삭제했습니다.`);
    },
  });
};

// 플레이리스트(재생목록 = 폴더) 정보 수정 (제목, 설명)
export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: playlistDB.updatePlaylistInfo,
    onSuccess: ({ id, title }) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] }); // 제목 바뀌었으므로, 전체 재생목록 갱산
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_TRACKS_KEY, id] }); // 정보 갱신

      toast.success(`${title} 정보가 수정되었습니다.`);
    },
  });
};

// 플레이리스트(재생목록 = 폴더) 자체 삭제
export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: playlistDB.deletePlaylist,
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_KEY] }); // 전체 목록만 갱신

      toast.success(`'${title}' 재생목록을 삭제했습니다.`);
    },
  });
};
