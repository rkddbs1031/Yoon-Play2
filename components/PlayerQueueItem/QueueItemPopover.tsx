import { JSX, ReactNode } from 'react';

import { AddPlaylistIcon, TrashIcon } from '@/states/icon/svgs';
import { QueueContext } from '@/types/queue';
import Portal from '../Portal';

const MENU_MAP: Record<QueueContext, { label: string; icon: JSX.Element }> = {
  [QueueContext.CurrentQueue]: {
    label: '현재 재생목록에서 삭제',
    icon: <TrashIcon size={18} />,
  },

  [QueueContext.LikedList]: {
    label: '좋아요 목록에서 삭제',
    icon: <TrashIcon size={18} />,
  },

  [QueueContext.Playlist]: {
    label: '이 재생목록에서 삭제',
    icon: <TrashIcon size={18} />,
  },
};

interface QueueItemPopoverProps {
  context: QueueContext;
  position: { top: number; left: number };
  onAction: (action: QueueContext) => void;
}

export default function QueueItemPopover({ context, position, onAction }: QueueItemPopoverProps) {
  const menu = MENU_MAP[context];

  const handleClick = () => console.log('TODO: 재생목록에 저장');

  return (
    <Portal>
      <div
        className='queue-item-popover fixed w-[170px] z-[10000] border bg-white/70 backdrop-blur-sm rounded-[5px] bg-red'
        style={{
          top: position.top,
          left: position.left - 174,
        }}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem onClick={handleClick}>
          <AddPlaylistIcon size={18} />
          <span className='text-sm'>재생목록에 저장</span>
        </MenuItem>

        <MenuItem onClick={() => onAction(context)}>
          {menu.icon}
          <span className='text-sm'>{menu.label}</span>
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
