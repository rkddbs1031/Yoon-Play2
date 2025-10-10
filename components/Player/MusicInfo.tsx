interface ColorAndFontSize {
  title: string;
  channelTitle: string;
}

interface MusicInfoWrapperProps {
  thumbnail: string;
  title: string;
  channelTitle: string;
  imageSize?: number;
  color?: ColorAndFontSize;
  fontSize?: ColorAndFontSize;
}

const DEFUALT_COLOR = 'text-[#3d3d68]';
const DEFAULT_TITLE_SIZE = 'text-[14px]';
const DEFAULT_CHANNEL_TITLE_SIZE = 'text-[10px]';

export const MusicInfoWrapper = ({
  thumbnail,
  title,
  channelTitle,
  imageSize = 50,
  color = { title: DEFUALT_COLOR, channelTitle: DEFUALT_COLOR },
  fontSize = { title: DEFAULT_TITLE_SIZE, channelTitle: DEFAULT_CHANNEL_TITLE_SIZE },
}: MusicInfoWrapperProps) => {
  return (
    <div className='music-info-wrapper flex gap-2 items-center text-left'>
      <div
        className='thumbnail rounded-[8px] overflow-hidden flex-shrink-0'
        style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
      >
        <img src={thumbnail} alt={title} className='block w-full h-full object-cover' />
      </div>
      <div className='music-info'>
        <span className={`${fontSize.title} ${color.title} font-[600] mb-[2px] line-clamp-1`}>{title}</span>
        <span className={`${fontSize.channelTitle} ${color.channelTitle} line-clamp-1`}>{channelTitle}</span>
      </div>
    </div>
  );
};
