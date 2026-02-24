'use client';

import PlaylistAddModal from '@/app/library/playlist/_components/PlaylistAddModal';
import PlaylistCreateModal from '@/app/library/playlist/_components/PlaylistCreateModal';
import PlaylistEditModal from '@/app/library/playlist/_components/PlaylistEditModal';
import Confirm from './Confirm';

export default function ModalRoot() {
  return (
    <>
      <PlaylistCreateModal />
      <PlaylistAddModal />
      <PlaylistEditModal />
      <Confirm />
    </>
  );
}
