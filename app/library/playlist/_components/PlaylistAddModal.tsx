'use client';

import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';
import { PlusIcon, CloseIcon } from '@/states/icon/svgs';

interface PlaylistAddModalProps {
  onClose: () => void;
}

export default function PlaylistAddModal({ onClose }: PlaylistAddModalProps) {
  return (
    <ModalPortal>
      <ModalOverlay onClose={onClose} />

      <ModalContent className={'relative max-w-[480px] mx-4 '}>
        <div className='p-4 border-b border-[#66666610] flex items-center justify-between'>
          <h2 className='font-[500]'>재생목록 저장</h2>
          <button type='button' onClick={onClose} className='cursor-pointer border-none bg-none outline-none'>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className='p-4 border-b border-[#66666610] pb-[64px]'>
          <span className='text-xs '>모든 재생목록</span>

          <ul className='mt-2'>
            <li>1</li>
            <li>2</li>
          </ul>
        </div>

        <div className='absolute bottom-4 right-4'>
          <button className='flex gap-1 items-center bg-[currentColor]/90 rounded-full py-1 pl-2 pr-4 cursor-pointer'>
            <PlusIcon size={20} color='white' />
            <span className='text-xs text-white'>새 재생목록</span>
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
