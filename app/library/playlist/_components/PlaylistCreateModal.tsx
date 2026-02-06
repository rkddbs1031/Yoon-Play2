'use client';

import { useState } from 'react';
import { usePlaylistCreateModal } from '@/hooks/usePlaylistCreateModal';
import { FieldWrapper, InputError, TextInput } from '@/components/Input';
import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';

const INIT_TITLE = {
  value: '',
  error: null,
};

// 새 재생목록 추가 모달 - 2단
export default function PlaylistCreateModal() {
  const { isOpen, closeModal } = usePlaylistCreateModal();

  const [title, setTitle] = useState<{ value: string; error: InputError | null }>(INIT_TITLE);
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.value.trim()) {
      setTitle(prev => ({ ...prev, error: { message: '재생목록 이름을 입력해주세요.' } }));
      return;
    }

    // TODO:! onCreate(title.value.trim(), description.trim() || undefined);

    setTitle(INIT_TITLE);
    setDescription('');
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <ModalOverlay onClose={closeModal} />
      <ModalContent zIndex={12000} className='max-w-[420px] mx-4'>
        <div className='p-4 border-b border-[#66666610]'>
          <h2 className='font-[500]'>새 재생목록 만들기</h2>
        </div>
        <div className='p-4 pt-5 space-y-4'>
          <FieldWrapper id='title' label='제목' required error={title.error} labelClassName='text-xs'>
            <TextInput
              id='title'
              value={title.value}
              onChange={value => setTitle({ value, error: null })}
              className='text-sm border-b border-[currentColor]/10 rounded-none'
            />
          </FieldWrapper>

          <FieldWrapper id='description' label='설명' labelClassName='text-xs'>
            <TextInput
              id='description'
              value={description}
              onChange={setDescription}
              className='text-sm border-b border-[currentColor]/10 rounded-none'
            />
          </FieldWrapper>
        </div>

        <div className='p-4 flex justify-end gap-3'>
          <button onClick={closeModal} className='text-xs cursor-pointer'>
            취소
          </button>

          <button onClick={handleCreate} className='text-xs bg-[currentColor]/90 rounded-full px-4 py-2 cursor-pointer'>
            <span className='text-white'>만들기</span>
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
