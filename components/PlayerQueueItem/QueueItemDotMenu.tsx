import React, { useEffect, useRef, useState } from 'react';

import { MoreHorizontal } from '@/states/icon/svgs';
import { PlaylistItem } from '@/types/playlist';

interface QueueItemDotMenuProps {
  item: PlaylistItem;
  isActive: boolean;
}
export const QueueItemDotMenu = React.memo(({ item, isActive }: QueueItemDotMenuProps) => {
  const dotMenuRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div ref={dotMenuRef} className='relative flex items-center justify-center pl-1' onClick={e => e.stopPropagation()}>
      <button type='button' onClick={handleClickDotMenu} className='cursor-pointer'>
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
});

QueueItemDotMenu.displayName = 'QueueItemDotMenu';
