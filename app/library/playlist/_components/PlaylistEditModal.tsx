'use client';

import { useEffect, useState } from 'react';

import { usePlaylistEditModal } from '@/hooks/useModal';
import { usePlaylistActions } from '@/hooks/usePlaylistActions';
import { usePlaylistInfo } from '@/hooks/usePlaylistInfo';

import { FieldWrapper, InputError, TextInput } from '@/components/Input';
import { ModalContent, ModalOverlay, ModalPortal } from '@/components/Modal';

const INIT_TITLE = {
  value: '',
  error: null,
};

export default function PlaylistEditModal() {
  const { isOpen, closeModal, playlistId } = usePlaylistEditModal();
  const { onUpdatePlaylist } = usePlaylistActions();

  const { playlist } = usePlaylistInfo(playlistId || '');

  const [title, setTitle] = useState<{ value: string; error: InputError | null }>(INIT_TITLE);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && playlist) {
      setTitle({ value: playlist.title, error: null });
      setDescription(playlist.description || '');
    }
  }, [isOpen, playlist]);

  const handleUpdate = async () => {
    if (!title.value.trim()) {
      setTitle(prev => ({ ...prev, error: { message: '재생목록 이름을 입력해주세요.' } }));
      return;
    }

    if (!playlistId) return;

    await onUpdatePlaylist({
      id: playlistId,
      data: { title: title.value.trim(), description: description.trim() || undefined },
    });

    closeModal();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal label='modal'>
      <ModalOverlay onClose={closeModal} />
      <ModalContent zIndex={12000} className='max-w-[420px] mx-4'>
        <div className='p-4 border-b border-[#66666610]'>
          <h2 className='font-[500]'>재생목록 정보 수정</h2>
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

        <div className='p-4 flex justify-end gap-2'>
          <button
            type='button'
            onClick={closeModal}
            className='text-xs rounded-full px-4 py-2 hover:bg-white/40 duration-200'
          >
            취소
          </button>

          <button type='button' onClick={handleUpdate} className='text-xs bg-[currentColor]/90 rounded-full px-4 py-2'>
            <span className='text-white'>저장하기</span>
          </button>
        </div>
      </ModalContent>
    </ModalPortal>
  );
}
