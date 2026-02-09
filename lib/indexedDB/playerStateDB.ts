import { PlaylistItem, PlaylistSource } from '@/types/playlist';
import { PLAYER_STATE_KEY, getPlayerDB } from '.';

export interface PlayerStateValue {
  playlist: PlaylistItem[];
  currentVideoId: string | null;
  playlistSource: PlaylistSource;
}

export const getPlayerState = async (): Promise<PlayerStateValue | undefined> => {
  const db = await getPlayerDB();
  const entity = await db.get('playerState', PLAYER_STATE_KEY);

  if (!entity) return undefined;
  const tracks = await Promise.all(entity.playlist.map(id => db.get('tracks', id)));

  return {
    playlist: tracks.filter(Boolean) as PlaylistItem[],
    currentVideoId: entity.currentVideoId,
    playlistSource: entity.playlistSource,
  };
};

interface PlayerStateEntity {
  playlist: string[];
  currentVideoId: string | null;
  playlistSource: PlaylistSource;
}

export const savePlayerState = async (state: PlayerStateValue) => {
  const db = await getPlayerDB();

  const tx = db.transaction(['playerState', 'tracks'], 'readwrite');

  // tracks store에도 저장 (중복 방지)
  for (const track of state.playlist) {
    const newTrack = {
      ...track,
      id: track.videoId,
    };

    await tx.objectStore('tracks').put(newTrack);
  }

  const entity: PlayerStateEntity = {
    playlist: state.playlist.map(track => track.videoId),
    currentVideoId: state.currentVideoId,
    playlistSource: state.playlistSource,
  };

  await tx.objectStore('playerState').put(entity, PLAYER_STATE_KEY);

  await tx.done;
};

export const clearPlayerState = async () => {
  const db = await getPlayerDB();
  await db.delete('playerState', PLAYER_STATE_KEY);
};
