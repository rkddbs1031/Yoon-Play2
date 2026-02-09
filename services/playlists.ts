import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as playlistDB from '@/lib/indexedDB/playlistDB';

// 플레이리스트 목록 조회
export const usePlaylistsQuery = () => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: playlistDB.getPlaylists,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const usePlaylistTracksQuery = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist-tracks', playlistId],
    queryFn: () => playlistDB.getPlaylistTracks(playlistId),
    enabled: !!playlistId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const usePlaylistPreviewQuery = ({ playlistId, limit }: { playlistId?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['playlist-preview', playlistId],
    queryFn: () => {
      if (!playlistId) return [];

      return playlistDB.getPlaylistPreviewTracks({ playlistId, limit });
    },
    enabled: !!playlistId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

export const useAddTrackToPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.addTrackToPlaylist,
    onSuccess: (_, variables) => {
      // TODO: 해당 플레이리스트의 트랙 목록 갱신
      // queryClient.invalidateQueries({
      //   queryKey: ['playlistTracks', variables.playlistId]
      // });

      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};
