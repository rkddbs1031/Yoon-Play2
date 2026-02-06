'use client';

import { useState } from 'react';
import { FieldWrapper, InputError, TextInput } from '@/components/Input';
import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';

interface PlaylistCreateModalProps {
  onClose: () => void;
  onCreate: (title: string, description: string | undefined) => void;
}

// 새 재생목록 추가 모달 - 2단
export default function PlaylistCreateModal({ onClose, onCreate }: PlaylistCreateModalProps) {
  const [title, setTitle] = useState<{ value: string; error: InputError | null }>({
    value: '',
    error: null,
  });
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.value.trim()) {
      setTitle(prev => ({ ...prev, error: { message: '재생목록 이름을 입력해주세요.' } }));
      return;
    }

    onCreate(title.value.trim(), description.trim() || undefined);
    onClose();
  };

  return (
    <ModalPortal>
      <ModalOverlay onClose={onClose} />
      <ModalContent zIndex={12000} className='max-w-[420px] mx-4'>
        <div className='p-4 border-b border-[#66666610]'>
          <h2 className='font-[500]'>새 재생목록 만들기</h2>
        </div>
        <div className='p-4 space-y-3'>
          <FieldWrapper id='title' label='제목' required error={title.error}>
            <TextInput
              id='title'
              value={title.value}
              onChange={value => setTitle({ value, error: null })}
              placeholder='제목을 입력해주세요'
            />
          </FieldWrapper>

          <FieldWrapper id='description' label='설명'>
            <TextInput
              id='description'
              value={description}
              onChange={setDescription}
              placeholder='설명을 입력해주세요'
            />
          </FieldWrapper>
        </div>

        <div className='p-4 flex justify-end gap-2 border-t border-[#66666610]'>
          <button onClick={onClose} className='text-sm'>
            취소
          </button>
          <button onClick={handleCreate} className='text-sm bg-[currentColor]/90 rounded-full text-white px-4 py-2'>
            만들기
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
