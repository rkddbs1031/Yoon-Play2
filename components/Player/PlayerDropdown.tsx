import { useEffect, useRef } from 'react';

import { AddPlaylistIcon, LikeIcon } from '@/states/icon/svgs';

interface PlayerDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleLike: () => void;
  onAddToPlaylist: () => void;
  isLiked: boolean;
}

export default function PlayerDropdown({
  isOpen,
  onClose,
  onToggleLike,
  onAddToPlaylist,
  isLiked,
}: PlayerDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className='player-drop-down absolute top-4 right-12 z-[999] bg-white/70 backdrop-blur-sm rounded-[5px]'
    >
      <ul>
        <li>
          <button
            type='button'
            onClick={onToggleLike}
            className='px-3 py-2 flex gap-2 w-full items-center cursor-pointer'
          >
            <LikeIcon fill={isLiked ? 'currentColor' : 'none'} size={18} />
            <span className='text-sm'>{isLiked ? '좋아요 목록에서 삭제' : '좋아요 목록에 추가'}</span>
          </button>
        </li>
        <li>
          <button
            type='button'
            onClick={onAddToPlaylist}
            className='px-3 py-2 flex gap-2 w-full items-center cursor-pointer'
          >
            <AddPlaylistIcon size={18} />
            <span className='text-sm'>재생목록에 추가</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
