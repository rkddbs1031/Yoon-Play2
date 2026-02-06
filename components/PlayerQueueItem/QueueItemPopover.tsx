import { JSX, ReactNode, useState } from 'react';

import { AddPlaylistIcon, TrashIcon } from '@/states/icon/svgs';
import { QueueContext } from '@/types/queue';
import Portal from '../Portal';

const MENU_MAP: Record<QueueContext, { label: string; icon: JSX.Element; color: string; background: string }> = {
  [QueueContext.CurrentQueue]: {
    label: '현재 재생목록에서 삭제',
    icon: <TrashIcon size={15} />,
    color: '#394970',
    background: 'bg-white/70 backdrop-blur-sm',
  },

  [QueueContext.LikedList]: {
    label: '좋아요 목록에서 삭제',
    icon: <TrashIcon size={15} />,
    color: 'text-[#52527a]',
    background: 'bg-[#F4F2FB]/90 backdrop-blur-md rounded-[5px] shadow-[0_8px_24px_rgba(46,51,79,0.12)]',
  },

  [QueueContext.Playlist]: {
    label: '이 재생목록에서 삭제',
    icon: <TrashIcon size={15} />,
    color: 'text-[#52527a]',
    background: 'bg-[#F4F2FB]/90 backdrop-blur-md rounded-[5px] shadow-[0_8px_24px_rgba(46,51,79,0.12)]',
  },
};

interface QueueItemPopoverProps {
  context: QueueContext;
  position: { top: number; left: number };
  onAction: (action: QueueContext) => void;
  onAddToPlaylist: () => void;
}

export default function QueueItemPopover({ context, position, onAction, onAddToPlaylist }: QueueItemPopoverProps) {
  const styleByContext = MENU_MAP[context];

  return (
    <Portal>
      <div
        className={`queue-item-popover fixed w-[180px] z-[999] rounded-[5px] ${styleByContext.background}`}
        style={{
          top: position.top,
          left: position.left - 180,
        }}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem onClick={onAddToPlaylist}>
          <AddPlaylistIcon size={15} />
          <span className={`text-sm ${styleByContext.color}`}>재생목록에 저장</span>
        </MenuItem>

        <MenuItem onClick={() => onAction(context)}>
          {styleByContext.icon}
          <span className={`text-sm ${styleByContext.color}`}>{styleByContext.label}</span>
        </MenuItem>
      </div>
    </Portal>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick: () => void;
}

function MenuItem({ children, onClick }: MenuItemProps) {
  return (
    <button type='button' onClick={onClick} className='px-3 py-2 flex gap-2 w-full items-center cursor-pointer'>
      {children}
    </button>
  );
}
