import { forwardRef } from 'react';
import Image from 'next/image';

import { DownIcon, LikeIcon, MoreVerticalIcon } from '@/states/icon/svgs';
import { PlaylistItem } from '@/types/playlist';

import PlayerDropdown from './PlayerDropdown';
import { PlayerControl } from './PlayerControl';
import { formatThumbnailUrl } from '@/utils/thumbnail';

interface PlayerPanelHeaderProps {
  currentVideo: PlaylistItem;
  isLiked: boolean;
  isDropdownOpen: boolean;
  onTogglePanel: () => void;
  onToggleMore: () => void;
  onCloseDropdown: () => void;
  onToggleLike: () => void;
  onAddToPlaylist: () => void;
}

export const PlayerPanelHeader = forwardRef<HTMLDivElement, PlayerPanelHeaderProps>(
  (
    {
      currentVideo,
      isLiked,
      isDropdownOpen,
      onTogglePanel,
      onToggleMore,
      onCloseDropdown,
      onToggleLike,
      onAddToPlaylist,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className='player-top'>
        <div className='top-button flex justify-between w-full'>
          <button type='button' onClick={onTogglePanel} className='down-btn cursor-pointer'>
            <DownIcon color='white' size={20} />
          </button>
          <button type='button' className='more-btn cursor-pointer' onClick={onToggleMore}>
            <MoreVerticalIcon color='white' size={20} />
          </button>
          <PlayerDropdown
            isOpen={isDropdownOpen}
            isLiked={isLiked}
            onAddToPlaylist={onAddToPlaylist}
            onToggleLike={onToggleLike}
            onClose={onCloseDropdown}
          />
        </div>

        <div className='thumbnail py-5 px-8 sm:py-7 max-w-[360px] w-full mx-auto'>
          <div className='relative w-full aspect-[16/9] overflow-hidden rounded-[8px]'>
            <Image
              src={formatThumbnailUrl({ thumbnail: currentVideo.thumbnail, size: 'large' })}
              alt={currentVideo.title}
              fill
              className='object-cover rounded-[8px]'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 360px'
              quality={80}
              priority
            />
          </div>
        </div>

        <div className='player-controls flex flex-col gap-5'>
          <div className='music-info flex gap-2 justify-between items-center'>
            <div className='music-player-and-title flex flex-col gap-1'>
              <h3 className={`text-[14px] text-[#f2f2f2] font-[600]`}>{currentVideo.title}</h3>
              <span className={`text-[10px] text-white/60 `}>{currentVideo.channelTitle}</span>
            </div>
            <div className='like'>
              <button type='button' onClick={onToggleLike} className='cursor-pointer'>
                <LikeIcon fill={isLiked ? '#5E9F94' : 'none'} size={20} color='#5E9F94' />
              </button>
            </div>
          </div>

          <PlayerControl.ProgressBar />

          <div className='player-control-buttons mb-6'>
            <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo && '#ffffff66'} size={28} />
          </div>
        </div>
      </div>
    );
  },
);
