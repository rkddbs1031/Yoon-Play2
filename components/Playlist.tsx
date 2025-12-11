import { useState } from 'react';
import Image from 'next/image';

import { PlayIcon } from '@/states/icon/svgs';
import { YoutubeThumbnail } from '@/types/youtube';
import { formatThumbnailUrl } from '@/utils/thumbnail';

interface ContentProps {
  idx: number;
  style?: string;
  thumbnail: YoutubeThumbnail;
  title: string;
  channelTitle: string;
  onPlay: () => void;
}

export const PlayListCard = ({ idx, style, thumbnail, title, channelTitle, onPlay }: ContentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className={`relative z-10 bg-white/30 hover:bg-white/50 transition-all duration-400 hover:-translate-y-1 p-3 rounded-2xl shadow-[0px_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl w-full cursor-pointer ${style}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button type='button' className='flex flex-col w-full items-start gap-2 cursor-pointer' onClick={onPlay}>
        <div className='relative w-full aspect-[16/9] overflow-hidden rounded-[8px]'>
          <Image
            src={formatThumbnailUrl({ thumbnail, size: 'medium' })}
            alt={title}
            fill
            className='object-cover transition-all duration-500'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            quality={75}
            priority={idx < 20}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0),rgba(0,0,0,0.2))] rounded-[8px] transition-opacity duration-400 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className='absolute right-[10px] bottom-[10px] bg-black/60 rounded-full p-2'>
              <PlayIcon color='white' size={18} />
            </span>
          </div>
        </div>
        <h3 className='text-[14px] sm:text-4 font-[500] text-left line-clamp-2'>{title}</h3>
        <p className='text-[12px] sm:text-[14px] text-[#5f5f7c] line-clamp-1'>{channelTitle}</p>
      </button>
    </li>
  );
};
