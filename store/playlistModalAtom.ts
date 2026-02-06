import { atom } from 'jotai';

export const playlistCreateModalAtom = atom<{
  isOpen: boolean;
  // initialTrackId?: string; // TODO
}>({ isOpen: false });
