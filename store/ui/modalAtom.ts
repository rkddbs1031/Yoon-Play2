import { atom } from 'jotai';

export const playlistCreateModalAtom = atom(false);
export const playlistAddModalAtom = atom(false);
export const playlistEditModalAtom = atom({
  isOpen: false,
  playlistId: null as string | null,
});
