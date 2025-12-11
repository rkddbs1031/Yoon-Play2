import React from 'react';

import { MusicInfoWrapper } from './MusicInfo';

import { PlaylistItem } from '@/types/playlist';

const ACTIVE_ITEM_BG =
  'bg-[linear-gradient(180deg,rgb(255_255_255_/_20%)_0%,rgb(255_255_255_/_10%)_20%,rgb(255_255_255_/_10%)_70%,rgb(255_255_255_/_20%)_100%)]';

interface PlayerQueueItemProps {
  item: PlaylistItem;
  isActive: boolean;
  onClick: () => void;
}

export const PlayerQueueItem = React.memo(({ item, isActive, onClick }: PlayerQueueItemProps) => {
  return (
    <li className='relative border-t border-white/15 last:border-b last:border-white/20'>
      <div
        className={`layer absolute inset-0 ${ACTIVE_ITEM_BG} transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className='relative flex'>
        <button type='button' className='w-full cursor-pointer px-2 py-[10px]' onClick={onClick}>
          <MusicInfoWrapper
            item={item}
            imageSize={36}
            color={{ title: 'text-white', channelTitle: 'text-white/70' }}
            fontSize={{ title: 'text-[12px]', channelTitle: 'text-[10px]' }}
          />
        </button>
      </div>
    </li>
  );
});

PlayerQueueItem.displayName = 'PlayerQueueItem';
