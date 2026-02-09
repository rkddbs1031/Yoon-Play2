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

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playlistDB.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};
