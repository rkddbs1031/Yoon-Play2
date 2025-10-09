'use client';

import { useEffect, useState } from 'react';

import { usePlayer } from '@/hooks/usePlayer';
import { PlayerControl } from './PlayerControl';
import { MusicInfoWrapper } from './MusicInfo';

const TRANSITION_DURATION = 400;

export const PlayerBar = () => {
  const { currentVideo, togglePlaylistPanel } = usePlayer();
  const newImageUrl = currentVideo?.thumbnail?.medium?.url || '';

  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!newImageUrl || newImageUrl === displayImage) return;

    const img = new Image();
    img.src = newImageUrl;

    img.onload = () => {
      setIsTransitioning(true);

      setTimeout(() => {
        setDisplayImage(newImageUrl);
        setIsTransitioning(false);
      }, TRANSITION_DURATION); // 전환 효과 타이밍 조절
    };

    img.onerror = () => {
      setDisplayImage(newImageUrl);
      setIsTransitioning(false);
    };
  }, [newImageUrl]);

  return (
    <section
      className='fixed z-[100] bottom-3 left-1/2 -translate-x-1/2 max-w-[960px] rounded-[8px] w-[calc(100%-32px)] lg:w-full overflow-hidden  min-h-[60px] flex flex-col gap-3 cursor-pointer overflow-hidden'
      onClick={togglePlaylistPanel}
    >
      {displayImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transform scale-[1.1] filter blur-[10px] brightness-[0.8] 
            transition-opacity duration-${TRANSITION_DURATION} ease-in-out
            ${isTransitioning ? 'opacity-50' : 'opacity-100'}
          `}
          style={{ backgroundImage: `url(${displayImage})` }}
        />
      )}

      <div
        className={`absolute inset-0 transition-all duration-500 ${displayImage ? 'bg-white/20 backdrop-blur-[10px]' : 'bg-white/60 backdrop-blur-[30px]'} `}
      />

      <div className='relative z-10 flex flex-col '>
        <PlayerControl.Frame />
        {currentVideo && <PlayerControl.ProgressBar />}

        <div className='flex items-center gap-3 px-[10px] py-3 justify-between'>
          {currentVideo ? (
            <MusicInfoWrapper
              thumbnail={currentVideo.thumbnail.medium.url}
              title={currentVideo.title}
              channelTitle={currentVideo.channelTitle}
              titleColor='white'
              channelTitleColor='white/60'
            />
          ) : (
            <div className='w-[50px] h-[50px] rounded-[8px] bg-black/10'></div>
          )}

          <div className='control-wrapper flex items-center gap-2'>
            <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo ? '#ffffff99' : ''} />
            <PlayerControl.Volume color='#ffffff' disabledColor={currentVideo ? '#ffffff99' : ''} />
          </div>
        </div>
      </div>
    </section>
  );
};
