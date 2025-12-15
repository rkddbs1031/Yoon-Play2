import React from 'react';

import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';

import { MusicInfoWrapper } from '../Player/MusicInfo';
import { QueueItemLikeButton } from './QueueItemLikeButton';
import { QueueItemDotMenu } from './QueueItemDotMenu';

const ACTIVE_ITEM_BG =
  'bg-[linear-gradient(180deg,rgb(255_255_255_/_20%)_0%,rgb(255_255_255_/_10%)_20%,rgb(255_255_255_/_10%)_70%,rgb(255_255_255_/_20%)_100%)]';

interface PlayerQueueItemProps {
  item: PlaylistItem;
  isActive: boolean;
  context: QueueContext;
  onClick: () => void;
  showLikeButton?: boolean;
  showDotButton?: boolean;
}

export const PlayerQueueItem = React.memo(
  ({ item, isActive, onClick, context, showLikeButton = true, showDotButton = true }: PlayerQueueItemProps) => {
    return (
      <>
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

          {showLikeButton && <QueueItemLikeButton item={item} />}

          {showDotButton && <QueueItemDotMenu item={item} isActive={isActive} context={context} />}
        </div>
      </>
    );
  },
);
