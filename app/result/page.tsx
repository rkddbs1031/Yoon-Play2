'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { usePlayer } from '@/hooks/usePlayer';
import { useYoutubeInfiniteQuery } from '@/services/search';
import { PlaylistItem } from '@/store/playerAtom';
import { AnimationType } from '@/types/animation';
import { animationStyle } from '@/utils/animation';

import { PlayListCard } from '@/components/Playlist';
import Player from '@/components/Player';
import LoadingSpinner from '@/components/Loading';
import { Skeleton } from '@/components/Skeleton';
import { YoutubeItem } from '@/types/youtube';

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

  const { setPlaylistAndPlay, playlist, addToPlaylistAndPlay } = usePlayer();

  const target = useRef<HTMLDivElement | null>(null);

  const handlePlay = (clickedItem: YoutubeItem) => {
    if (playlist.length === 0) {
      const playlistItems: PlaylistItem[] = allItems.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails,
      }));

      setPlaylistAndPlay(playlistItems, clickedItem.id.videoId);
    } else {
      addToPlaylistAndPlay({
        videoId: clickedItem.id.videoId,
        title: clickedItem.snippet.title,
        channelTitle: clickedItem.snippet.channelTitle,
        thumbnail: clickedItem.snippet.thumbnails,
      });
    }
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
    <>
      <section className='playlist-wrapper max-w-[960px] mx-auto pb-20'>
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && data && (
          <>
            <h1
              className={`${AnimationType.FadeInUp} text-lg sm:text-xl font-[600] text-[#52527a] mb-6 sm:mb-8 whitespace-pre-wrap`}
              style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
            >
              "{value}" 키워드에 맞는 추천 플레이리스트예요!
            </h1>
            <div
              className={`list-wrapper ${AnimationType.FadeInUp}`}
              style={animationStyle({ useAnimation: true, delay: 0.5, duration: 0.6 })}
            >
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 auto-rows-fr'>
                {allItems.map((item, idx) => (
                  <PlayListCard
                    key={`${item.id.videoId}-${idx}`}
                    thumbnail={item.snippet.thumbnails}
                    title={item.snippet.title}
                    channelTitle={item.snippet.channelTitle}
                    onPlay={() => handlePlay(item)}
                  />
                ))}
                {isFetchingNextPage && (
                  <>
                    <Skeleton.PlayList length={2} />
                  </>
                )}
              </ul>

              <div ref={target} className='h-px'></div>
            </div>
          </>
        )}
      </section>
      <Player />
    </>
  );
}
