import React from 'react';

import { MusicInfoWrapper } from './MusicInfo';

import { PlaylistItem } from '@/types/playlist';
import { useLike } from '@/hooks/useLike';
import { LikeIcon } from '@/states/icon/svgs';

const ACTIVE_ITEM_BG =
  'bg-[linear-gradient(180deg,rgb(255_255_255_/_20%)_0%,rgb(255_255_255_/_10%)_20%,rgb(255_255_255_/_10%)_70%,rgb(255_255_255_/_20%)_100%)]';

interface PlayerQueueItemProps {
  item: PlaylistItem;
  isActive: boolean;
  onClick: () => void;
  showLikeButton?: boolean;
}

export const PlayerQueueItem = React.memo(
  ({ item, isActive, onClick, showLikeButton = false }: PlayerQueueItemProps) => {
    const { isLiked, toggleLike } = useLike();
    const isLikedCurrent = item.videoId ? isLiked(item.videoId) : false;

    const handleToggleLike = () => toggleLike(item);

    return (
      <li className='relative border-t border-white/15 last:border-b last:border-white/20'>
        <div
          className={`layer absolute inset-0 ${ACTIVE_ITEM_BG} transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className='relative flex gap-2 items-center px-2 py-[10px]'>
          <button type='button' className='w-full cursor-pointer' onClick={onClick}>
            <MusicInfoWrapper
              item={item}
              imageSize={36}
              color={{ title: 'text-white', channelTitle: 'text-white/70' }}
              fontSize={{ title: 'text-[12px]', channelTitle: 'text-[10px]' }}
            />
          </button>

          {showLikeButton && (
            <button type='button' onClick={handleToggleLike} className='cursor-pointer'>
              <LikeIcon fill={isLikedCurrent ? 'currentColor' : 'none'} size={14} />
            </button>
          )}
        </div>
      </li>
    );
  },
);

PlayerQueueItem.displayName = 'PlayerQueueItem';
