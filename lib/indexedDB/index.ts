import { PlaylistItem, PlaylistSource } from '@/types/playlist';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface PlayerDBSchema extends DBSchema {
  playerState: {
    key: string;
    value: {
      playlist: PlaylistItem[];
      currentVideoId: string | null;
      playlistSource: PlaylistSource;
    };
  };

  likedPlaylist: {
    key: string; // videoId
    value: PlaylistItem;
  };

  userPlaylist: {
    key: string;
    value: {
      id: string;
      title: string;
      items: PlaylistItem[];
      createdAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PlayerDBSchema>> | null = null;

export const getPlayerDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<PlayerDBSchema>('player-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('likedPlaylist')) {
          db.createObjectStore('likedPlaylist', { keyPath: 'videoId' });
        }

        if (!db.objectStoreNames.contains('playerState')) {
          db.createObjectStore('playerState');
        }

        if (!db.objectStoreNames.contains('userPlaylist')) {
          db.createObjectStore('userPlaylist', { keyPath: 'id' });
        }
      },
    });
  }

  return dbPromise;
};
