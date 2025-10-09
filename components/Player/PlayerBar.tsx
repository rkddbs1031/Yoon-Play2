'use client';

import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { usePlayer } from '@/hooks/usePlayer';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';

import { PlayerControl } from './PlayerControl';
import { MusicInfoWrapper } from './MusicInfo';

const ANIMATION_DURATION = 300;

export const PlayerBar = () => {
  const { currentVideo, isPlaylistPanelOpen, togglePlaylistPanel } = usePlayer();
  const { displayImage, isTransitioning } = usePlayerBackground(currentVideo?.thumbnail?.medium?.url);
  const { animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'opacity-0 invisible',
    closed_transform: 'opacity-100 visible',
    duration: ANIMATION_DURATION,
  });

  return (
    <section
      className={`player-bar fixed z-[100] bottom-3 left-1/2 -translate-x-1/2 max-w-[960px] rounded-[8px] w-[calc(100%-32px)] lg:w-full overflow-hidden  min-h-[60px] flex flex-col gap-3 overflow-hidden 
        ${currentVideo ? 'cursor-pointer' : ''} 
        transition-all duration-${ANIMATION_DURATION} ${animation} `}
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
        className={`absolute inset-0 transition-all duration-500 ${displayImage ? 'bg-white/20 backdrop-blur-[10px]' : 'bg-white/60 backdrop-blur-[10px]'} `}
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
              titleColor='text-white'
              channelTitleColor='text-white/60'
            />
          ) : (
            <div className='w-[50px] h-[50px] rounded-[8px] bg-black/10'></div>
          )}

          <div className='control-wrapper flex items-center gap-2'>
            <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo && '#ffffff66'} />
            <PlayerControl.Volume color='#ffffff' disabledColor={currentVideo && '#ffffff66'} />
          </div>
        </div>
      </div>
    </section>
  );
};
