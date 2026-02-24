import { atom } from 'jotai';

import { ConfirmState } from '@/types/confirm';

export const playlistCreateModalAtom = atom(false);

export const playlistAddModalAtom = atom(false);

export const playlistEditModalAtom = atom({
  isOpen: false,
  playlistId: null as string | null,
});

export const confirmAtom = atom<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: null,
  isDanger: false,
});
