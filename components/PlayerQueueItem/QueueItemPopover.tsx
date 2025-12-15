import { JSX, ReactNode } from 'react';

import { AddPlaylistIcon } from '@/states/icon/svgs';
import { QueueContext } from '@/types/queue';

const MENU_MAP: Record<QueueContext, { label: string; icon: JSX.Element }> = {
  [QueueContext.CurrentQueue]: {
    label: '현재 재생목록에서 삭제',
    icon: <AddPlaylistIcon size={18} />,
  },

  [QueueContext.LikedList]: {
    label: '좋아요 목록에서 삭제',
    icon: <AddPlaylistIcon size={18} />,
  },

  [QueueContext.Playlist]: {
    label: '이 재생목록에서 삭제',
    icon: <AddPlaylistIcon size={18} />,
  },
};

interface QueueItemPopoverProps {
  isActive: boolean;
  context: QueueContext;
  onAction: (action: QueueContext) => void;
}

export default function QueueItemPopover({ isActive, context, onAction }: QueueItemPopoverProps) {
  const handleClick = () => console.log('handleClick');
  const menu = MENU_MAP[context];

  return (
    <div className='absolute right-6 -top-2 z-[10000] w-[155px] bg-white/70 backdrop-blur-sm rounded-[5px]'>
      <MenuItem onClick={handleClick}>
        <AddPlaylistIcon size={18} />
        <span className='text-sm'>재생목록에 저장</span>
      </MenuItem>

      <MenuItem onClick={() => onAction(context)}>
        {menu.icon}
        <span className='text-sm'>
          {menu.label}
          {context}
        </span>
      </MenuItem>
    </div>
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
