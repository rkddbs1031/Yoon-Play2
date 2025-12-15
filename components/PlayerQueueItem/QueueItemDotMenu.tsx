import React, { useEffect, useRef, useState, MouseEvent } from 'react';

import { MoreHorizontal, MoreVerticalIcon } from '@/states/icon/svgs';
import { PlaylistItem } from '@/types/playlist';
import { QueueContext } from '@/types/queue';

import QueueItemPopover from './QueueItemPopover';
import { usePlayerCore } from '@/hooks/usePlayer';

interface QueueItemDotMenuProps {
  item: PlaylistItem;
  context: QueueContext;
}

export const QueueItemDotMenu = React.memo(({ item, context }: QueueItemDotMenuProps) => {
  const dotMenuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  const handleClickDotMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setPopoverPosition({
      top: rect.top,
      left: rect.left,
    });

    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => setIsOpen(false);

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const { removePlaylist } = usePlayerCore();

  const handleRemoveCurrentPlaylist = () => removePlaylist(item);

  const handleUnLike = () => {
    console.log('handleUnLike');
  };

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

      {isOpen && popoverPosition && (
        <QueueItemPopover context={context} position={popoverPosition} onAction={handleAction} />
      )}
    </div>
  );
});

QueueItemDotMenu.displayName = 'QueueItemDotMenu';
