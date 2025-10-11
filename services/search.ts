import { YouTubeSearchList } from '@/types/youtube';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

const MAX_PAGE_COUNT = 4;

export const useYoutubeInfiniteQuery = ({ type, value }: YouTubeSearchProps) => {
  return useInfiniteQuery({
    queryKey: ['recommend-youtube-search', type, value],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        query: value ?? '',
        type: type ?? '',
        ...(pageParam && { pageToken: pageParam }),
      });

      const { data } = await axios.get<YouTubeSearchList>(`/api/youtube?${params.toString()}`);
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_PAGE_COUNT) return undefined;
      return lastPage.nextPageToken;
    },
    enabled: !!value && !!type,
    staleTime: 60 * 1000, // 1분
    gcTime: 1000 * 60 * 30, // cacheTime
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
