interface MusicInfoWrapperProps {
  thumbnail: string;
  title: string;
  channelTitle: string;
  size?: number;
  titleColor?: string;
  channelTitleColor?: string;
}

const DEFUALT_COLOR = 'text-[#3d3d68]';

export const MusicInfoWrapper = ({
  thumbnail,
  title,
  channelTitle,
  size = 50,
  titleColor = DEFUALT_COLOR,
  channelTitleColor = DEFUALT_COLOR,
}: MusicInfoWrapperProps) => {
  return (
    <div className='music-info-wrapper flex gap-2 items-center text-left'>
      <div
        className='thumbnail rounded-[8px] overflow-hidden flex-shrink-0'
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img src={thumbnail} alt={title} className='block w-full h-full object-cover' />
      </div>
      <div className='music-info'>
        <h4 className={`text-[14px] ${titleColor} font-[600] mb-[2px] line-clamp-1`}>{title}</h4>
        <span className={`text-[10px] ${channelTitleColor} line-clamp-1`}>{channelTitle}</span>
      </div>
    </div>
  );
};
