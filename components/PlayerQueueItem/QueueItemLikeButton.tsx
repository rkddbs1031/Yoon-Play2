import { memo } from 'react';

import { useLike } from '@/hooks/useLike';
import { LikeIcon } from '@/states/icon/svgs';
import { PlaylistItem } from '@/types/playlist';

interface QueueItemLikeButtonProps {
  item: PlaylistItem;
}

export const QueueItemLikeButton = memo(({ item }: QueueItemLikeButtonProps) => {
  const { isLiked, toggleLike } = useLike();
  const isLikedCurrent = item.videoId ? isLiked(item.videoId) : false;

  const handleToggleLike = () => toggleLike(item);

  return (
    <button type='button' onClick={handleToggleLike}>
      <LikeIcon fill={isLikedCurrent ? '#6FB7AA' : 'none'} size={14} color='#6FB7AA' />
    </button>
  );
});

QueueItemLikeButton.displayName = 'QueueItemLikeButton';
