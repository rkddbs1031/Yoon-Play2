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

export const fetchYoutubeSearch = async ({
  type,
  value,
  pageParam,
}: {
  type: string;
  value: string;
  pageParam?: string;
}) => {
  const params = new URLSearchParams({
    query: value ?? '',
    type: type ?? '',
    ...(pageParam && { pageToken: pageParam }),
  });

  const data = await fetcher<YouTubeSearchList>(`/api/youtube?${params.toString()}`, {
    method: FetchMethod.GET,
  });
  return data;
};

const MAX_PAGE_COUNT = 4;

export const useYoutubeInfiniteQuery = ({ type, value }: YouTubeSearchProps) => {
  return useInfiniteQuery({
    queryKey: ['recommend-youtube-search', type, value],
    queryFn: ({ pageParam }) => fetchYoutubeSearch({ type: type!, value: value!, pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= MAX_PAGE_COUNT) return undefined;
      return lastPage.nextPageToken;
    },
    enabled: !!value && !!type,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, //  = cacheTime
    refetchOnWindowFocus: false,
    retry: 3, // 요청 실패시 몇번까지 재시도할지
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 5000), // 얼마나 더 기다렸다가 재시도할지
  });
};
