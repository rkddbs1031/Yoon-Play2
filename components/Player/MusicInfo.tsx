import { PlaylistItem } from '@/types/playlist';
import { formatThumbnailUrl } from '@/utils/thumbnail';
import Image from 'next/image';

interface ColorAndFontSize {
  title: string;
  channelTitle: string;
}

interface MusicInfoWrapperProps {
  item: PlaylistItem;
  imageSize?: number;
  color?: ColorAndFontSize;
  fontSize?: ColorAndFontSize;
}

const DEFUALT_COLOR = 'text-[#3d3d68]';
const DEFAULT_TITLE_SIZE = 'text-[14px]';
const DEFAULT_CHANNEL_TITLE_SIZE = 'text-[10px]';

export const MusicInfoWrapper = ({
  item,
  imageSize = 50,
  color = { title: DEFUALT_COLOR, channelTitle: DEFUALT_COLOR },
  fontSize = { title: DEFAULT_TITLE_SIZE, channelTitle: DEFAULT_CHANNEL_TITLE_SIZE },
}: MusicInfoWrapperProps) => {
  const { title, channelTitle, thumbnail } = item;

  return (
    <div className='music-info-wrapper flex gap-2 items-center text-left'>
      <div
        className='thumbnail rounded-[8px] overflow-hidden flex-shrink-0'
        style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
      >
        <Image
          src={formatThumbnailUrl({ thumbnail, size: 'small' })}
          alt={title}
          width={imageSize}
          height={imageSize}
          className='object-cover w-full h-full'
          sizes={`${imageSize * 2}px`}
          quality={75}
          priority
        />
      </div>
      <div className='music-info'>
        <span className={`${fontSize.title} ${color.title} font-[600] mb-[2px] line-clamp-1`}>{title}</span>
        <span className={`${fontSize.channelTitle} ${color.channelTitle} line-clamp-1`}>{channelTitle}</span>
      </div>
    </div>
  );
};
