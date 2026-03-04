'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { AnimationType } from '@/constants/animation';
import { RecommendationResultType } from '@/constants/recommend';
import { usePlayerCore } from '@/hooks/usePlayer';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useYoutubeInfiniteQuery } from '@/services/search';
import { ApiErrorResponse, CustomAxiosError } from '@/types/error';
import { YouTubeSearchList, YoutubeItem } from '@/types/youtube';
import { PlaylistItem } from '@/types/playlist';
import { animationStyle } from '@/utils/animation';

import { PlayListCard } from '@/components/Playlist';
import { Skeleton } from '@/components/Skeleton';

interface PlayListResultClientProps {
  initialData: YouTubeSearchList;
  type: RecommendationResultType | null;
  value: string | null;
}

export default function PlaylistResultClient({ initialData, type, value }: PlayListResultClientProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } = useYoutubeInfiniteQuery({
    type,
    value,
    initialData,
  });

  const { targetRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { setPlayerListFromSearch } = usePlayerCore();

  const allItems = useMemo(() => {
    return data?.pages.flatMap(page => page.items) ?? [];
  }, [data?.pages]);

  const formatPlaylistItem = (item: YoutubeItem): PlaylistItem => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails,
  });

  const handlePlay = (clickedItem: YoutubeItem) => {
    const playlistItems: PlaylistItem[] = allItems.map(formatPlaylistItem);
    const clicked: PlaylistItem = formatPlaylistItem(clickedItem);
    setPlayerListFromSearch(playlistItems, clicked);
  };

  const hasResults = !isError && allItems.length > 0;
  const isEmpty = !isError && allItems.length === 0;

  const router = useRouter();

  const axiosError = error as CustomAxiosError | null;
  const serverError: ApiErrorResponse | undefined = axiosError?.response?.data;
  const errorMessage = serverError?.message || '추천 결과를 불러오는 중 오류가 발생했습니다.';

  return (
    <section className='playlist-wrapper max-w-[960px] mx-auto pb-20'>
      <h1
        className={`${AnimationType.FadeInUp} text-lg sm:text-xl font-[600] text-[#52527a] mb-6 sm:mb-8 whitespace-pre-wrap`}
        style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
      >
        "{value}" 키워드에 맞는 추천 플레이리스트예요!
      </h1>

      {hasResults && (
        <div
          className={`list-wrapper ${AnimationType.FadeInUp}`}
          style={animationStyle({ useAnimation: true, delay: 0.5, duration: 0.6 })}
        >
          <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 auto-rows-fr'>
            {allItems.map((item, idx) => (
              <PlayListCard
                key={`${item.id.videoId}-${idx}`}
                idx={idx}
                thumbnail={item.snippet.thumbnails}
                title={item.snippet.title}
                channelTitle={item.snippet.channelTitle}
                onPlay={() => handlePlay(item)}
              />
            ))}

            {isFetchingNextPage && <Skeleton.PlayList length={4} />}
          </ul>

          <div ref={targetRef} className='h-[50px]'></div>
        </div>
      )}

      {isEmpty && (
        <div
          className={`list-wrapper space-y-4 my-12 ${AnimationType.FadeInUp}`}
          style={animationStyle({ useAnimation: true, delay: 0.5, duration: 0.6 })}
        >
          <p className='text-sm sm:text-base font-[400] text-[#52527a] text-center '>
            검색 결과가 없습니다. 다른 키워드로 검색해보세요!
          </p>

          <button
            type='button'
            onClick={() => router.push('/')}
            className='block mx-auto text-xs sm:text-sm rounded-full backdrop-blur-xl shadow-lg px-6 py-2 bg-white/40 hover:bg-white/70 duration-200'
          >
            다시 추천 받아보기
          </button>
        </div>
      )}

      {isError && (
        <div
          className={`error-wrap my-20 flex flex-col gap-6 items-center w-full ${AnimationType.FadeInUp}`}
          style={animationStyle({ useAnimation: true, delay: 0.6, duration: 0.6 })}
        >
          <p className='text-sm sm:text-base whitespace-pre-wrap font-semibold text-center px-4'>{errorMessage}</p>

          <div className='flex gap-3 justify-center w-full'>
            <button
              type='button'
              onClick={() => router.push('/explore')}
              className='text-xs sm:text-sm rounded-full backdrop-blur-xl shadow-lg px-6 py-2 bg-white/40 hover:bg-white/70 duration-200'
            >
              다른 곡 둘러보기
            </button>

            <button
              type='button'
              onClick={() => router.push('/library')}
              className='text-xs sm:text-sm rounded-full backdrop-blur-xl shadow-lg px-6 py-2 bg-white/40 hover:bg-white/70 duration-200'
            >
              내 보관함 가기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
