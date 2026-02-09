'use client';

import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistAddModal, usePlaylistCreateModal } from '@/hooks/useModal';
import { PlusIcon, CloseIcon, SpinIcon } from '@/states/icon/svgs';
import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';

// 재생목록 추가 모달 - 1단
export default function PlaylistAddModal() {
  const { playlists, isLoading, onAddTrack } = usePlaylist();
  const { isOpen, closeModal: onCloseAddModal } = usePlaylistAddModal();
  const { openModal: onOpenCreateModal } = usePlaylistCreateModal();

  const handlePlaylistClick = async (playlistId: string) => {
    await onAddTrack(playlistId);
    onCloseAddModal();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <ModalOverlay onClose={onCloseAddModal} />

      <ModalContent className={'relative max-w-[320px] mx-4 pt-[56px]'}>
        <div className='fixed top-0 w-full flex items-center justify-between p-4 border-b border-[#66666610]'>
          <h2 className='font-[500]'>재생목록 저장</h2>
          <button type='button' onClick={onCloseAddModal} className='cursor-pointer border-none bg-none outline-none'>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className='pt-4'>
          <span className='text-xs px-4'>모든 재생목록</span>
          {isLoading ? (
            <div className='flex items-center  justify-center p-4'>
              <SpinIcon className=' animate-spin' />
            </div>
          ) : (
            <ul className='mt-1'>
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <button
                    type='button'
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className='w-full flex flex-col items-start gap-1 py-2 px-4 cursor-pointer transition-bg duration-300 hover:bg-white/30                    '
                  >
                    <span className='text-sm text-[#394970] line-clamp-1'>{playlist.title}</span>
                    <span className='text-xs text-[#5f5f7c] line-clamp-1'>{playlist.trackCount}곡</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='sticky bottom-4 right-0 flex justify-end'>
          <button
            className='flex gap-1 items-center bg-[currentColor]/90 rounded-full py-1 pl-2 pr-4 cursor-pointer mr-4'
            onClick={onOpenCreateModal}
          >
            <PlusIcon size={20} color='white' />
            <span className='text-xs text-white'>새 재생목록</span>
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
