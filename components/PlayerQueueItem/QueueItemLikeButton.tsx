import React from 'react';

import { PlaylistItem } from '@/types/playlist';
import { useLike } from '@/hooks/useLike';
import { LikeIcon } from '@/states/icon/svgs';

interface QueueItemLikeButtonProps {
  item: PlaylistItem;
}

export const QueueItemLikeButton = React.memo(({ item }: QueueItemLikeButtonProps) => {
  const { isLiked, toggleLike } = useLike();
  const isLikedCurrent = item.videoId ? isLiked(item.videoId) : false;

  const handleToggleLike = () => toggleLike(item);

  return (
    <button type='button' onClick={handleToggleLike} className='cursor-pointer'>
      <LikeIcon fill={isLikedCurrent ? '#6FB7AA' : 'none'} size={14} color='#6FB7AA' />
    </button>
  );
});

QueueItemLikeButton.displayName = 'QueueItemLikeButton';
