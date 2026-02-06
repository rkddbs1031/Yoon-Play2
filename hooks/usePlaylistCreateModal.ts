import { useAtom } from 'jotai';
import { playlistCreateModalAtom } from '@/store/playlistModalAtom';

export const usePlaylistCreateModal = () => {
  const [state, setState] = useAtom(playlistCreateModalAtom);

  return {
    isOpen: state.isOpen,

    openModal: () => {
      setState({ isOpen: true });
      // TODO: 추가할 트랙이 있는가 없는가?
    },

    closeModal: () => {
      setState({ isOpen: false });
    },
  };
};
