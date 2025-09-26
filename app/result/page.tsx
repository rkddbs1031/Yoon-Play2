'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { AnimationType } from '@/types/animation';
import { animationStyle } from '@/utils/animation';
import { useYoutubeSearchQuery } from '@/services/search';

import { PlayList } from '@/components/Playlist';
import { YoutubeItem } from '@/types/youtube';
import LoadingSpinner from '@/components/Loading';

export default function PlayListResult() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const value = searchParams.get('value');
  const { data, isLoading } = useYoutubeSearchQuery({ type, value });

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 });
  }, []);

  const handleClickPlayListItem = (item: YoutubeItem) => {
    console.log(item);
  };

  return (
    <section className='playlist-wrapper'>
      <LoadingSpinner isLoading={isLoading} />

      {!isLoading && data && (
        <>
          <h1
            className={`${AnimationType.FadeInUp} text-2xl font-bold whitespace-pre-wrap mb-8`}
            style={animationStyles}
          >
            "{value}" 키워드에 맞는 추천 플레이리스트예요!
          </h1>
          <div
            className={`list-wrapper ${AnimationType.FadeInUp}`}
            style={animationStyle({ useAnimation: true, delay: 0.5, duration: 0.6 })}
          >
            <ul className='grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-fr'>
              {data.items.map(item => (
                <PlayList.Card key={item.id.videoId}>
                  <PlayList.Content
                    thumbnail={item.snippet.thumbnails.high.url}
                    title={item.snippet.title}
                    channelTitle={item.snippet.channelTitle}
                    onClick={() => handleClickPlayListItem(item)}
                  />
                </PlayList.Card>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
