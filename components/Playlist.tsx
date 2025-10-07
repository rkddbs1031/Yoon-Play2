import { ReactNode, useState } from 'react';

import { PlayIcon } from '@/states/icon/svgs';
import { YoutubeThumbnail } from '@/types/youtube';

const Card = ({ children, style }: { children: ReactNode; style?: string }) => {
  return (
    <li
      className={`relative z-10 flex flex-col gap-4 bg-white/30 hover:bg-white/70 transition-all duration-400 hover:-translate-y-[10px] p-4 sm:p-5 rounded-2xl  shadow-[0px_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl w-full cursor-pointer ${style}`}
    >
      {children}
    </li>
  );
};

interface ContentProps {
  thumbnail: YoutubeThumbnail;
  title: string;
  channelTitle: string;
  onPlay: () => void;
}

const Content = ({ thumbnail, title, channelTitle, onPlay }: ContentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type='button'
      className='flex flex-col w-full items-start gap-2 cursor-pointer'
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative w-full overflow-hidden rounded-[8px]'>
        <img src={thumbnail.medium.url} alt={title} className='block w-full object-cover' />

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-[8px] transition-opacity duration-400 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>
            <PlayIcon color='white' size={24} />
          </span>
        </div>
      </div>
      <h3 className='text-[14px] sm:text-4 font-[500] text-left line-clamp-2'>{title}</h3>
      <p className='text-[12px] sm:text-[14px] text-[#5f5f7c] line-clamp-1'>{channelTitle}</p>
    </button>
  );
};

export const PlayList = {
  Card: Card,
  Content: Content,
};
