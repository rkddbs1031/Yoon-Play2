import { useAtom } from 'jotai';

import { playlistCreateModalAtom, playlistAddModalAtom, playlistEditModalAtom } from '@/store/ui/modalAtom';

export const usePlaylistAddModal = () => {
  const [isOpen, setIsOpen] = useAtom(playlistAddModalAtom);

  return {
    isOpen,

    openModal: () => {
      setIsOpen(true);
    },

    closeModal: () => {
      setIsOpen(false);
    },
  };
};

export const usePlaylistCreateModal = () => {
  const [isOpen, setIsOpen] = useAtom(playlistCreateModalAtom);

  return {
    isOpen,

    openModal: () => {
      setIsOpen(true);
    },

    closeModal: () => {
      setIsOpen(false);
    },
  };
};

export const usePlaylistEditModal = () => {
  const [modal, setModal] = useAtom(playlistEditModalAtom);

  return {
    isOpen: modal.isOpen,
    playlistId: modal.playlistId,

    openModal: (id: string) => {
      setModal({ isOpen: true, playlistId: id });
    },

    closeModal: () => {
      setModal({ isOpen: false, playlistId: null });
    },
  };
};
