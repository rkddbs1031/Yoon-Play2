'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { PlayerControl } from './PlayerControl';

export const PlayerBar = () => {
  const { currentVideo, togglePlayer } = usePlayer();

  return (
    <section className='fixed z-[100] w-full bottom-0 left-0 min-h-[60px] bg-white/60 backdrop-blur-[30px] flex flex-col gap-3 cursor-pointer'>
      <PlayerControl.Frame />
      <PlayerControl.ProgressBar />

      <div className='flex items-center gap-2 px-[10px] pb-3'>
        {currentVideo ? (
          <div className='music-info-wrapper flex gap-2 items-center'>
            <div className='thumbnail rounded-[8px] overflow-hidden w-[50px] h-[50px] flex-shrink-0'>
              <img
                src={currentVideo.thumbnail.medium.url}
                alt={currentVideo.title}
                className='block w-full h-full object-cover'
                width={50}
                height={50}
              />
            </div>
            <div className='music-info'>
              <h4 className='text-[14px] text-[#3d3d68] font-[600] mb-[2px] line-clamp-1'>{currentVideo.title}</h4>
              <span className='text-[10px] text-[#3d3d68] line-clamp-1'>{currentVideo.channelTitle}</span>
            </div>
          </div>
        ) : (
          <div className='w-[50px] h-[50px] rounded-[8px] bg-white/30'></div>
        )}

        <div className='control-wrapper flex items-center justify-between gap-2'>
          <PlayerControl.Buttons />
          <PlayerControl.Volume />
        </div>
      </div>
    </section>
  );
};
