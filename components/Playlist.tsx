import { ReactNode } from 'react';

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
  return (
    <button type='button' className='flex flex-col w-full items-start gap-2 cursor-pointer' onClick={onClick}>
      <img src={thumbnail} alt={title} className='rounded-[8px] block w-full aspect-square object-cover' />
      <h3 className='text-[14px] sm:text-4 font-semibold text-left line-clamp-2 md:line-clamp-3'>{title}</h3>
      <p className='text-[12px] sm:text-[14px]'>{channelTitle}</p>
    </button>
  );
};
export const PlayList = {
  Card: Card,
  Content: Content,
};
