import React, { useEffect, useRef, useState } from 'react';

import { MoreHorizontal, MoreVerticalIcon } from '@/states/icon/svgs';
import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';

import QueueItemPopover from './QueueItemPopover';
import { usePlayerCore } from '@/hooks/usePlayer';

interface QueueItemDotMenuProps {
  item: PlaylistItem;
  isActive: boolean;
  context: QueueContext;
}

export const QueueItemDotMenu = React.memo(({ item, isActive, context }: QueueItemDotMenuProps) => {
  const dotMenuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { removePlaylist } = usePlayerCore();

  const handleClickDotMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleRemoveCurrentPlaylist = () => removePlaylist(item);

  const handleUnLike = () => console.log('TODO: handleUnLike');

  const handleRemoveUserPlaylist = () => console.log('TODO: handleRemoveUserPlaylist');

  const removeHandlerMap: Record<QueueContext, () => void> = {
    [QueueContext.CurrentQueue]: () => handleRemoveCurrentPlaylist(),
    [QueueContext.LikedList]: () => handleUnLike(),
    [QueueContext.Playlist]: () => handleRemoveUserPlaylist(),
  };

  const handleAction = (action: QueueContext) => {
    removeHandlerMap[action]();
    setIsOpen(false);
  };

  return (
    <div ref={dotMenuRef} className='relative flex items-center justify-center pl-1' onClick={e => e.stopPropagation()}>
      <button type='button' onClick={handleClickDotMenu} className='cursor-pointer'>
        <MoreVerticalIcon size={16} />
      </button>

      {isOpen && <QueueItemPopover isActive={isActive} onAction={handleAction} context={context} />}
    </div>
  );
});

QueueItemDotMenu.displayName = 'QueueItemDotMenu';
