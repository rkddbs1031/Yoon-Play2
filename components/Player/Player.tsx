'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { PlayerControl } from './PlayerControl';

export const MusicPlayer = () => {
  const { currentVideo } = usePlayer();

  return (
    <section className='fixed z-[100] bottom-5 md:bottom-[32px] left-1/2 -translate-x-1/2 w-[calc(100%-20px)] md:w-[calc(100%-32px)] lg:w-full max-w-[1000px] min-h-[60px]  bg-black/20 backdrop-blur-[20px] rounded-[5px_5px_12px_12px] flex flex-col gap-3 '>
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
              <h4 className='text-[14px] text-white font-bold mb-[2px] line-clamp-1'>{currentVideo.title}</h4>
              <span className='text-[10px] text-white/70 line-clamp-1'>{currentVideo.channelTitle}</span>
            </div>
          </div>
        ) : (
          <div className='w-[50px] h-[50px] rounded-[8px] bg-white/30'></div>
        )}

        <div className='control-wrapper flex items-center gap-2'>
          <PlayerControl.Buttons />
          <PlayerControl.Volume />
        </div>
      </div>
    </section>
  );
};
