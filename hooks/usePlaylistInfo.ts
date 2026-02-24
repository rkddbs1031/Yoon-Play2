import { usePlaylistTracksQuery } from '@/services/playlists';

// 상세 페이지용이 아닌, 단순히 "데이터만" 가져오는 용도
export const usePlaylistInfo = (playlistId: string) => {
  const { data, isLoading } = usePlaylistTracksQuery(playlistId);

  return {
    playlist: data?.playlist || null,
    tracks: data?.tracks || [],
    isLoading,
  };
};
