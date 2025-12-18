import { PlaylistItem, PlaylistSource } from '@/types/playlist';
import { getPlayerDB } from '.';

const PLAYER_STATE_KEY = 'PLAYER_STATE';

export interface PlayerStateValue {
  playlist: PlaylistItem[];
  currentVideoId: string | null;
  playlistSource: PlaylistSource;
}

export const getPlayerState = async (): Promise<PlayerStateValue | undefined> => {
  const db = await getPlayerDB();
  return db.get('playerState', PLAYER_STATE_KEY);
};

export const savePlayerState = async (state: PlayerStateValue) => {
  const db = await getPlayerDB();
  return db.put('playerState', state, PLAYER_STATE_KEY);
};

export const clearPlayerState = async () => {
  const db = await getPlayerDB();
  await db.delete('playerState', PLAYER_STATE_KEY);
};
