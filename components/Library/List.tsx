import { useCallback } from 'react';
import Image from 'next/image';

import { LibraryType } from '@/constants/library';

interface ThumbnailGridProps {
  thumbnails: string[];
}

function ThumbnailGrid({ thumbnails }: ThumbnailGridProps) {
  const count = thumbnails.length;

  const getTileImages = useCallback(() => {
    if (count === 1) return thumbnails;
    if (count === 2) {
      const [a, b] = thumbnails;
      return [a, b, b, a];
    }

    if (count === 3) {
      const [a, b, c] = thumbnails;
      return [a, b, c, a];
    }

    return thumbnails;
  }, [thumbnails]);

  const tiles = getTileImages();

  if (count === 1) {
    return (
      <div className='thumbnail relative w-full aspect-square rounded-[8px] overflow-hidden '>
        <Image src={thumbnails[0]} alt='썸네일' fill className='object-cover' />
      </div>
    );
  }

  return (
    <div className='thumbnail relative w-full aspect-square rounded-[8px] overflow-hidden grid grid-cols-2 grid-rows-2'>
      {tiles.map((src, idx) => (
        <div key={`${src}-${idx}`} className='relative w-full h-full'>
          <Image src={src} alt={`썸네일-${idx}`} fill className='object-cover' />
        </div>
      ))}
    </div>
  );
}

interface LibraryListItemProps {
  thumbnails: string[];
  title: string;
  count: number;
  type: LibraryType;
  onNavigate: () => void;
}

export const LibraryListItem = ({ title, count, type, thumbnails, onNavigate }: LibraryListItemProps) => {
  return (
    <li className='library-item '>
      <div onClick={onNavigate} className='thumbnail-grid-container cursor-pointer'>
        <ThumbnailGrid thumbnails={thumbnails} />
      </div>

      <div className='info flex flex-col gap-[2px] mt-[10px]'>
        <button
          type='button'
          onClick={onNavigate}
          className='text-sm md:text-base font-[500] text-left line-clamp-2 bg-transparent border-none hover:underline active:underline cursor-pointer'
        >
          {title}
        </button>
        <div className='subtitle flex items-center text-xs sm:text-[12px] text-[#5f5f7c] line-clamp-1'>
          {type === LibraryType.Playlist && (
            <span className="relative mr-3 after:absolute after:content-['·'] after:mx-1">재생목록</span>
          )}
          <span>{count.toLocaleString()}곡</span>
        </div>
      </div>
    </li>
  );
};
