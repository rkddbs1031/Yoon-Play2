'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { RecommendationResultType } from '@/constants/recommend';
import { TextFieldType } from '@/constants/textFiled';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePlayerCore } from '@/hooks/usePlayer';
import { useYoutubeInfiniteQuery } from '@/services/search';
import { YoutubeItem } from '@/types/youtube';
import { PlaylistItem } from '@/types/playlist';

import SearchField from '@/components/SearchField';
import { Skeleton } from '@/components/Skeleton';
import { PlayListCard } from '@/components/Playlist';
import LoadingSpinner from '@/components/Loading';

export default function Explore() {
  const [keyword, setKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useYoutubeInfiniteQuery({
    type: RecommendationResultType.Playlist,
    value: activeKeyword,
    enabled: !!activeKeyword,
  });

  const { targetRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { setPlayerListFromExplore } = usePlayerCore();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKeyword(e.currentTarget.value);
    // TODO: 최근 검색어 저장?
  };

  const handleSubmitSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    if (trimmedKeyword === activeKeyword) {
      refetch();
    } else {
      setActiveKeyword(trimmedKeyword);
    }
  };

  const handlePlay = (clickedItem: YoutubeItem) => {
    const format = (item: YoutubeItem): PlaylistItem => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails,
    });

    const playlistItems = searchResults.map(format);
    const clicked: PlaylistItem = format(clickedItem);

    setPlayerListFromExplore(playlistItems, clicked);
  };

  const searchResults = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data?.pages]);

  const hasResults = !isLoading && searchResults.length > 0;

  return (
    <section className='explore-wrapper flex flex-col items-center justify-center w-full max-w-[960px] mx-auto'>
      <div className='flex flex-col w-full mb-10 sm:mb-12'>
        <h1 className='mt-10 text-lg sm:text-xl font-[600] text-[#52527a] text-center whitespace-pre-wrap mb-6 sm:mb-8'>
          원하는 플레이리스트가 없다면 더 찾아볼까요?
        </h1>

        <SearchField
          fieldType={TextFieldType.Input}
          value={keyword}
          onChange={handleChange}
          onSubmit={handleSubmitSearch}
          color='#52527a'
        />
      </div>

      <div className='explore-result-list-wrapper w-full'>
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && activeKeyword && searchResults.length === 0 && (
          <p className='text-sm font-[400] text-[#52527a]'>검색 결과가 없습니다.</p>
        )}

        {hasResults && (
          <>
            <span className='inline-block mb-6 text-sm font-[400] text-[#52527a]'>'{activeKeyword}' 검색 결과</span>

            <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 auto-rows-fr'>
              {searchResults.map((item, idx) => (
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
          </>
        )}
      </div>
    </section>
  );
}
