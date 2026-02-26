'use client';

import PlaylistAddModal from '@/app/library/playlist/_components/PlaylistAddModal';
import PlaylistCreateModal from '@/app/library/playlist/_components/PlaylistCreateModal';
import PlaylistEditModal from '@/app/library/playlist/_components/PlaylistEditModal';
import Confirm from './Confirm';
import { Toaster } from './Toast';

export default function PortalUIRoot() {
  return (
    <>
      <PlaylistCreateModal />
      <PlaylistAddModal />
      <PlaylistEditModal />
      <Confirm />
      <Toaster />
    </>
  );
}
