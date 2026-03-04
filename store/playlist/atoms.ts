import { atom } from 'jotai';

import { PlaylistItem } from '@/types/playlist';

export const playlistTargetTrackAtom = atom<PlaylistItem | null>(null);

export const currentVideoPlaylistIdAtom = atom<string | null>(null);
