import { PlaylistItem, PlaylistSource } from '@/types/playlist';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface PlayerDBSchema extends DBSchema {
  /**
   * 현재 플레이어 상태
   */
  playerState: {
    key: string;
    value: {
      playlist: string[]; // 🔹 trackId 배열로 변경
      currentVideoId: string | null;
      playlistSource: PlaylistSource;
      // playlist: PlaylistItem[];
      // currentVideoId: string | null;
      // playlistSource: PlaylistSource;
    };
  };

  /**
   * 트랙 단일 저장소 : 비디오 (음악) 리스트
   * - 좋아요 / 재생목록 공통 사용
   * - 중복 저장 방지
   */
  tracks: {
    key: string; // trackId = videoId)
    value: PlaylistItem;
  };

  /**
   * 유저 재생목록 (폴더)
   */
  /* 예시 
  playlists
  ├─ "__liked__" // 좋아요 목록
  ├─ "playlist-A" // A라는 재생목록명(폴더)를 가진 목록 <- user가 생성
  └─ "playlist-B" //B라는 재생목록명(폴더)를 가진 목록 <- user가 생성
  */
  playlists: {
    key: string; // playlistId (uuid)
    value: {
      id: string;
      title: string;
      description?: string;
      createdAt: number;
      updatedAt: number;
    };
  };

  /**
   * 재생목록 ↔ 트랙 관계 테이블
   * - 순서 관리
   * - 다대다 관계
   */
  playlistTracks: {
    key: string; // `${playlistId}:${trackId}`
    value: {
      id: string;
      playlistId: string; // FK : 어느 재생목록에 속했는지
      trackId: string; // tracks.key 참조
      order: number;
      addedAt: number;
    };
    indexes: {
      'by-playlist': string; // playlistId
      'by-track': string; // trackId (선택)
    };
  };
}
/* 예시
tracks
 ├─ abc123  ← trackId
 └─ def456

playlists
 └─ __liked__

playlistTracks
 └─ __liked__:abc123
      ├─ playlistId = "__liked__"
      └─ trackId = "abc123" → tracks.abc123
*/

let dbPromise: Promise<IDBPDatabase<PlayerDBSchema>> | null = null;

const DB_NAME = 'player-db';
const DB_VERSION = 4;
export const LIKED_PLAYLIST_ID = '__liked__';

export const getPlayerDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<PlayerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        /**
         * v1 → v2 마이그레이션 (스토어 구조 변경)
         */
        if (oldVersion < 2) {
          const legacyDb = db as any;

          // 레거시 스토어 제거
          if (legacyDb.objectStoreNames.contains('likedPlaylist')) {
            legacyDb.deleteObjectStore('likedPlaylist');
          }

          if (legacyDb.objectStoreNames.contains('userPlaylist')) {
            legacyDb.deleteObjectStore('userPlaylist');
          }

          // tracks
          if (!db.objectStoreNames.contains('tracks')) {
            db.createObjectStore('tracks', { keyPath: 'id' });
          }

          // playlists
          if (!db.objectStoreNames.contains('playlists')) {
            const playlistStore = db.createObjectStore('playlists', {
              keyPath: 'id',
            });

            // 시스템 플레이리스트: 좋아요한 플레이리스트
            playlistStore.put({
              id: LIKED_PLAYLIST_ID,
              title: '좋아요한 플레이리스트',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }

          // playlistTracks
          if (!db.objectStoreNames.contains('playlistTracks')) {
            const relationStore = db.createObjectStore('playlistTracks', { keyPath: 'id' });
            relationStore.createIndex('by-playlist', 'playlistId');
            relationStore.createIndex('by-track', 'trackId');
          }

          // playerState
          if (!db.objectStoreNames.contains('playerState')) {
            db.createObjectStore('playerState');
          }
        }

        /**
         * v2 → v3 마이그레이션
         * (좋아요 플레이리스트 title 변경)
         */
        if (oldVersion < 3) {
          const playlistStore = transaction.objectStore('playlists');

          playlistStore.put({
            id: LIKED_PLAYLIST_ID,
            title: '좋아요한 플레이리스트',
            updatedAt: Date.now(),
            createdAt: Date.now(),
          });
        }
      },
    });
  }

  return dbPromise;
};
