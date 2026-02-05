import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { FetchMethod } from '@/constants/fetch';
import { YouTubeSearchList } from '@/types/youtube';
import { fetcher } from '@/utils/request';

interface YouTubeSearchProps {
  type: string | null;
  value: string | null;
}

export const useYoutubeSearchQuery = ({ type, value }: YouTubeSearchProps) => {
  return useQuery({
    queryKey: ['recommend-youtube-search', type, value],
    queryFn: async () => {
      const data = await fetcher<YouTubeSearchList>(
        `/api/youtube?type=${encodeURIComponent(type ?? '')}&query=${encodeURIComponent(value ?? '')}`,
        {
          method: FetchMethod.GET,
        },
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

      const data = await fetcher<YouTubeSearchList>(`/api/youtube?${params.toString()}`, {
        method: FetchMethod.GET,
      });

      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_PAGE_COUNT) return undefined;
      return lastPage.nextPageToken;
    },
    enabled: !!value && !!type,
    staleTime: 60 * 1000 * 5, // 5분
    gcTime: 1000 * 60 * 10, //  = cacheTime
    refetchOnWindowFocus: false,
    retry: 3, // 요청 실패시 몇번까지 재시도할지
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // 얼마나 더 기다렸다가 재시도할지
  });
};
