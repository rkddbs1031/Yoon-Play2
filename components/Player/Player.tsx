'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { PlayerControl } from './PlayerControl';

export const MusicPlayer = () => {
  const { currentVideo } = usePlayer();

  return (
    <section className='fixed bottom-[30px] left-1/2 -translate-x-1/2 w-[90%] min-h-[60px] z-[15] bg-black/20 backdrop-blur-[20px] rounded-[5px_5px_12px_12px] flex flex-col gap-3 '>
      <PlayerControl.Frame />
      <PlayerControl.ProgressBar />

      <div className='flex items-center gap-2 px-[10px] pb-3'>
        {currentVideo && (
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
        )}
        <div className='control-wrapper flex items-center gap-2'>
          <PlayerControl.Buttons />
          <PlayerControl.Volume />
        </div>
      </div>
    </section>
  );
};
