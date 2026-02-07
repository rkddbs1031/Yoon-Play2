import { atom } from 'jotai';
import { PlaylistItem } from '@/types/playlist';

export const playlistTargetTrackAtom = atom<PlaylistItem | null>(null);
