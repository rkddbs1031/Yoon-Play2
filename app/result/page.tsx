'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { AnimationType } from '@/types/animation';
import { animationStyle } from '@/utils/animation';
import { useYoutubeInfiniteQuery } from '@/services/search';

import { PlayList } from '@/components/Playlist';
import { YoutubeItem } from '@/types/youtube';
import LoadingSpinner from '@/components/Loading';

const OBSERVE_OPTIONS = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

export default function PlayListResult() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const value = searchParams.get('value');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useYoutubeInfiniteQuery({
    type,
    value,
  });

  const target = useRef<HTMLDivElement | null>(null);

  const handlePlay = (item: YoutubeItem) => {
    console.log(item);
  };

  useEffect(() => {
    if (!target.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, OBSERVE_OPTIONS);

    observer.observe(target.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = useMemo(() => {
    return data?.pages.flatMap(page => page.items) ?? [];
  }, [data?.pages]);

  return (
    <section className='playlist-wrapper'>
      <LoadingSpinner isLoading={isLoading} />

      {!isLoading && data && (
        <>
          <h1
            className={`${AnimationType.FadeInUp} text-2xl font-bold whitespace-pre-wrap mb-8`}
            style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
          >
            "{value}" 키워드에 맞는 추천 플레이리스트예요!
          </h1>
          <div
            className={`list-wrapper ${AnimationType.FadeInUp}`}
            style={animationStyle({ useAnimation: true, delay: 0.5, duration: 0.6 })}
          >
            <ul className='grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 auto-rows-fr'>
              {allItems.map(item => (
                <PlayList.Card key={item.id.videoId}>
                  <PlayList.Content
                    thumbnail={item.snippet.thumbnails.high.url}
                    title={item.snippet.title}
                    channelTitle={item.snippet.channelTitle}
                    onPlay={() => handlePlay(item)}
                  />
                </PlayList.Card>
              ))}
            </ul>

            <div ref={target}></div>
          </div>
        </>
      )}
    </section>
  );
}
