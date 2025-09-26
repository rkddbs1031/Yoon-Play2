import { YouTubeSearchList } from '@/types/youtube';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface YouTubeSearchProps {
  type: string | null;
  value: string | null;
}

export const useYoutubeSearchQuery = ({ type, value }: YouTubeSearchProps) => {
  return useQuery({
    queryKey: ['recommend-youtube-search', type, value],
    queryFn: async () => {
      const { data } = await axios.get<YouTubeSearchList>(
        `/api/youtube?type=${encodeURIComponent(type ?? '')}&query=${encodeURIComponent(value ?? '')}`,
      );
      return data;
    },
    enabled: !!value && !!type,
    staleTime: 60 * 1000, // 1분
  });
};
