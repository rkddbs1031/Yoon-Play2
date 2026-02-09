import { memo } from 'react';

import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';
import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistAddModal } from '@/hooks/useModal';

import { MusicInfoWrapper } from '../Player/MusicInfo';
import { QueueItemLikeButton } from './QueueItemLikeButton';
import { QueueItemDotMenu } from './QueueItemDotMenu';

const ACTIVE_ITEM_BG =
  'bg-[linear-gradient(180deg,rgb(255_255_255_/_15%)_0%,rgb(255_255_255_/_10%)_20%,rgb(255_255_255_/_10%)_70%,rgb(255_255_255_/_15%)_100%)]';

interface PlayerQueueItemProps {
  item: PlaylistItem;
  isActive: boolean;
  context: QueueContext;
  onClick: () => void;
  showLikeButton?: boolean;
  showDotButton?: boolean;
}

const COLOR_BY_CONTEXT: Record<
  QueueContext,
  {
    title: string;
    channelTitle: string;
    dotColor: string;
  }
> = {
  [QueueContext.CurrentQueue]: {
    title: 'text-[#f2f2f2]',
    channelTitle: 'text-white/50',
    dotColor: '#f2f2f2',
  },
  [QueueContext.LikedList]: {
    title: 'text-[#394970]',
    channelTitle: 'text-[#5f5f7c]',
    dotColor: '#5f5f7c',
  },
  [QueueContext.Playlist]: {
    title: 'text-[#52527a]',
    channelTitle: 'text-[#5f5f7c]',
    dotColor: '#5f5f7c',
  },
};

export const PlayerQueueItem = memo(
  ({ item, isActive, onClick, context, showLikeButton = true, showDotButton = true }: PlayerQueueItemProps) => {
    const { dotColor, ...textColor } = COLOR_BY_CONTEXT[context];

    const { setPlaylistTargetTrack } = usePlaylist();
    const { openModal } = usePlaylistAddModal();

    const handleOpenModal = () => {
      setPlaylistTargetTrack(item);
      openModal();
    };

    return (
      <>
        {context === QueueContext.CurrentQueue && (
          <div
            className={`layer absolute pointer-events-none inset-0 ${ACTIVE_ITEM_BG} transition-opacity duration-300 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        <div className='relative flex gap-3 items-center px-2 py-[12px]'>
          <button type='button' className='w-full cursor-pointer' onClick={onClick}>
            <MusicInfoWrapper
              item={item}
              imageSize={36}
              color={textColor}
              fontSize={{ title: 'text-[12px]', channelTitle: 'text-[10px]' }}
            />
          </button>

          {showLikeButton && <QueueItemLikeButton item={item} />}

          {showDotButton && (
            <QueueItemDotMenu item={item} context={context} color={dotColor} onAddToPlaylist={handleOpenModal} />
          )}
        </div>
      </>
    );
  },
);
