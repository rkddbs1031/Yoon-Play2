'use client';

import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { usePlayer } from '@/hooks/usePlayer';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';

import { PlayerControl } from './PlayerControl';
import { MusicInfoWrapper } from './MusicInfo';
import { formatThumbnailUrl } from '@/utils/thumbnail';

const ANIMATION_DURATION = 300;

export const PlayerBar = () => {
  const { currentVideo, isPlaylistPanelOpen, togglePlaylistPanel } = usePlayer();
  const backgroundImage = formatThumbnailUrl({ thumbnail: currentVideo?.thumbnail, size: 'small' });
  const { displayImage: overlayBG, isTransitioning } = usePlayerBackground(backgroundImage);

  const { animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'opacity-0 invisible',
    closed_transform: 'opacity-100 visible',
    duration: ANIMATION_DURATION,
  });

  return (
    <section
      className={`player-bar fixed z-[888] left-1/2 lg:left-[calc(50%+65px)] bottom-3 -translate-x-1/2  w-[calc(100%-32px)] md:max-w-[768px] lg:max-w-[960px] lg:w-full overflow-hidden  min-h-[60px] flex flex-col gap-3 overflow-hidden rounded-[8px]
        ${currentVideo ? 'cursor-pointer' : ''} 
        transition-all duration-${ANIMATION_DURATION} ${animation} `}
      onClick={togglePlaylistPanel}
    >
      {overlayBG && (
        <div
          className={`absolute inset-0 bg-cover bg-center transform scale-[1.1] filter blur-[10px] brightness-[0.8] 
            transition-opacity duration-${TRANSITION_DURATION} ease-in-out
            ${isTransitioning ? 'opacity-50' : 'opacity-100'}
          `}
          style={{ backgroundImage: `url(${overlayBG})` }}
        />
      )}
      <div
        className={`absolute inset-0 transition-all duration-500 ${overlayBG ? 'bg-white/20 backdrop-blur-[10px]' : 'bg-white/60 backdrop-blur-[10px]'} `}
      />
      <div className='relative z-10 flex flex-col '>
        <PlayerControl.Frame />
        {currentVideo && <PlayerControl.ProgressBar />}

        <div className='flex items-center gap-3 px-[10px] py-3 justify-between'>
          {currentVideo ? (
            <MusicInfoWrapper item={currentVideo} color={{ title: 'text-white', channelTitle: 'text-white/60' }} />
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
