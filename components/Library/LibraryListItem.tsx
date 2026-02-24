import { useState, MouseEvent, useEffect } from 'react';

import { LIKED_PLAYLIST_ID, LibraryType } from '@/constants/library';
import { usePlaylistPreviewQuery } from '@/services/playlists';
import { MoreVerticalIcon } from '@/states/icon/svgs';
import { getPlaylistThumbnails } from '@/utils/thumbnail';

import ThumbnailGrid from './ThumbnailGrid';
import { PlaylistMenuPopover } from './PlaylistMenuPopover';
import { usePlaylistEditModal } from '@/hooks/useModal';

interface LibraryListItemProps {
  playlistId: string;
  title: string;
  count: number;
  type: LibraryType;
  onNavigate: () => void;
}

export const LibraryListItem = ({ playlistId, title, count, type, onNavigate }: LibraryListItemProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  const { data: tracks = [] } = usePlaylistPreviewQuery({ playlistId });
  const thumbnails = getPlaylistThumbnails(tracks);

  const { openModal: openEditModal } = usePlaylistEditModal();

  const handleClickPopover = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + 5,
      left: rect.right,
    });

    setIsPopoverOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleOutsideAction = () => setIsPopoverOpen(false);

    document.addEventListener('mousedown', handleOutsideAction);
    document.addEventListener('touchstart', handleOutsideAction); // 모바일 대응

    return () => {
      document.removeEventListener('mousedown', handleOutsideAction);
      document.removeEventListener('touchstart', handleOutsideAction);
    };
  }, [isPopoverOpen]);

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setIsPopoverOpen(false);
    openEditModal(playlistId);
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    setIsPopoverOpen(prev => !prev);
  };

  return (
    <li className='library-item'>
      <div onClick={onNavigate} className='thumbnail-grid-container cursor-pointer'>
        <ThumbnailGrid thumbnails={thumbnails} />
      </div>

      <div className='info flex flex-col gap-[2px] mt-[10px]'>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={onNavigate}
            className='text-sm md:text-base font-[500] text-left line-clamp-2 bg-transparent border-none hover:underline active:underline cursor-pointer'
          >
            {title}
          </button>

          {playlistId !== LIKED_PLAYLIST_ID && (
            <div className='relative'>
              <button
                type='button'
                aria-haspopup='true'
                aria-expanded={isPopoverOpen}
                aria-label='재생목록 메뉴 열기'
                className='cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50 translate-x-3 transition-all duration-300 outline-none'
                onClick={handleClickPopover}
              >
                <MoreVerticalIcon size={16} />
              </button>

              {isPopoverOpen && popoverPosition && (
                <PlaylistMenuPopover
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={handleClose}
                  position={popoverPosition}
                />
              )}
            </div>
          )}
        </div>

        <div className='subtitle flex items-center text-xs sm:text-[12px] text-[#5f5f7c] line-clamp-1'>
          {type === LibraryType.Playlist && (
            <span className="relative mr-3 after:absolute after:content-['·'] after:mx-1">재생목록</span>
          )}
          <span>{count.toLocaleString()}곡</span>
        </div>
      </div>
    </li>
  );
};
