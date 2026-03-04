import { ReactNode, MouseEvent, useEffect } from 'react';

import { EditIcon, TrashIcon } from '@/states/icon/svgs';

import Portal from '../Portal';

interface PlaylistMenuPopoverProps {
  position: { top: number; left: number };
  onEdit: (e: MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

export function PlaylistMenuPopover({ onEdit, onDelete, onClose, position }: PlaylistMenuPopoverProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <Portal>
      <div
        role='menu'
        className={`playlist-menu-popover fixed w-[140px] z-[999] rounded-[5px] bg-[#F4F2FB]/90 backdrop-blur-md rounded-[5px] shadow-[0_8px_24px_rgba(46,51,79,0.12)]`}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        style={{
          top: position.top,
          left: position.left - 140,
        }}
      >
        <MenuItem onClick={onEdit} label='재생목록 수정'>
          <EditIcon size={16} />
          <span className={`text-sm `}>재생목록 수정</span>
        </MenuItem>

        <MenuItem onClick={onDelete} label='재생목록 삭제'>
          <TrashIcon size={15} />
          <span className={`text-sm text-[#52527a]`}>재생목록 삭제</span>
        </MenuItem>
      </div>
    </Portal>
  );
}

interface MenuItemProps {
  children: ReactNode;
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

function MenuItem({ children, label, onClick }: MenuItemProps) {
  return (
    <button
      type='button'
      role='menuitem'
      aria-label={label}
      onClick={onClick}
      className='px-4 py-2 flex gap-2 w-full items-center justify-between hover:bg-white/30 duration-200'
    >
      {children}
    </button>
  );
}
