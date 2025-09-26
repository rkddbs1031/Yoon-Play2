import { ReactNode, useState } from 'react';

const Card = ({ children, style }: { children: ReactNode; style?: string }) => {
  return (
    <li
      className={`relative z-10 flex flex-col gap-4 bg-[#ffffff33] hover:bg-white/70 transition-bg duration-400 px-5 pt-5 pb-6 rounded-[24px] shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl w-full cursor-pointer ${style}`}
    >
      {children}
    </li>
  );
};

interface ContentProps {
  thumbnail: string;
  title: string;
  channelTitle: string;
  onClick: () => void;
}

const Content = ({ thumbnail, title, channelTitle, onClick }: ContentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type='button'
      className='flex flex-col w-full items-start gap-2 cursor-pointer'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative w-full'>
        <img src={thumbnail} alt={title} className='rounded-[8px] block w-full aspect-square object-cover' />

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-[8px] transition-opacity duration-400 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button className='px-3 py-1 text-white font-bold bg-red-500 rounded'>Play</button>
        </div>
      </div>
      <h3 className='text-[14px] sm:text-4 font-semibold text-left line-clamp-2 md:line-clamp-3'>{title}</h3>
      <p className='text-[12px] sm:text-[14px]'>{channelTitle}</p>
    </button>
  );
};
export const PlayList = {
  Card: Card,
  Content: Content,
};
