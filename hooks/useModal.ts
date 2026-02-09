import { useAtom } from 'jotai';
import { playlistCreateModalAtom, playlistAddModalAtom } from '@/store/ui/modalAtom';

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
