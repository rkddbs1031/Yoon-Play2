import { useCallback } from 'react';
import Image from 'next/image';

interface ThumbnailGridProps {
  thumbnails: string[];
}

export default function ThumbnailGrid({ thumbnails }: ThumbnailGridProps) {
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
        <Image src={thumbnails[0]} alt='썸네일' fill className='object-cover' sizes='(max-width: 640px) 50vw, 200px' />
      </div>
    );
  }

  return (
    <div className='thumbnail relative w-full aspect-square rounded-[8px] overflow-hidden grid grid-cols-2 grid-rows-2'>
      {tiles.map((src, idx) => (
        <div key={`${src}-${idx}`} className='relative w-full h-full'>
          <Image src={src} alt={`썸네일-${idx}`} fill className='object-cover' sizes='(max-width: 640px) 50vw, 200px' />
        </div>
      ))}
    </div>
  );
}
