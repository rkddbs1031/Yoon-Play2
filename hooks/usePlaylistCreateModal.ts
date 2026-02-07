import { useAtom } from 'jotai';
import { playlistCreateModalAtom } from '@/store/ui/modalAtom';

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
