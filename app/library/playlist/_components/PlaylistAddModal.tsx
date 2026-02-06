'use client';

import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistCreateModal } from '@/hooks/usePlaylistCreateModal';
import { PlusIcon, CloseIcon } from '@/states/icon/svgs';
import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';

interface PlaylistAddModalProps {
  onClose: () => void;
}

// 재생목록 추가 모달 - 1단
export default function PlaylistAddModal({ onClose }: PlaylistAddModalProps) {
  const { playlists, isLoading } = usePlaylist();
  const { openModal } = usePlaylistCreateModal();

  return (
    <ModalPortal>
      <ModalOverlay onClose={onClose} />

      <ModalContent className={'relative max-w-[320px] mx-4 '}>
        <div className='p-4 border-b border-[#66666610] flex items-center justify-between'>
          <h2 className='font-[500]'>재생목록 저장</h2>
          <button type='button' onClick={onClose} className='cursor-pointer border-none bg-none outline-none'>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className='border-b py-4 border-[#66666610] pb-[64px]'>
          <span className='text-xs px-4'>모든 재생목록</span>
          <ul className='mt-1'>
            {!isLoading &&
              playlists.map(playlist => (
                <li key={playlist.id}>
                  <button
                    type='button'
                    onClick={() => console.log('todo!')}
                    className='w-full flex flex-col items-start gap-1 py-2 px-4 cursor-pointer transition-bg duration-300 hover:bg-white/25                    '
                  >
                    <span className='text-sm text-[#394970] line-clamp-1'>{playlist.title}</span>
                    <span className='text-xs text-[#5f5f7c] line-clamp-1'>{playlist.trackCount}곡</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className='absolute bottom-4 right-4'>
          <button
            className='flex gap-1 items-center bg-[currentColor]/90 rounded-full py-1 pl-2 pr-4 cursor-pointer'
            onClick={openModal}
          >
            <PlusIcon size={20} color='white' />
            <span className='text-xs text-white'>새 재생목록</span>
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
