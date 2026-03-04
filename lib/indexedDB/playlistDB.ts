import { LIKED_PLAYLIST_ID, USER_PLAYLIST_ID } from '@/constants/library';
import { PlaylistItem } from '@/types/playlist';

import { getPlayerDB } from '.';

export const getPlaylists = async () => {
  const db = await getPlayerDB();
  const playlists = await db.getAll('playlists');

  // 각 플레이리스트의 트랙 개수 계산
  const playlistsWithCount = await Promise.all(
    playlists.map(async playlist => {
      const trackKeys = await db.getAllKeysFromIndex('playlistTracks', 'by-playlist', playlist.id);

      return {
        ...playlist,
        trackCount: trackKeys.length,
      };
    }),
  );

  const liked = playlistsWithCount.find(p => p.id === LIKED_PLAYLIST_ID);
  const rest = playlistsWithCount.filter(p => p.id !== LIKED_PLAYLIST_ID).sort((a, b) => b.updatedAt - a.updatedAt);

  return liked ? [liked, ...rest] : rest;
};

// 플레이리스트 정보 + 트랙
export const getPlaylistTracks = async (playlistId: string) => {
  const db = await getPlayerDB();

  const playlist = await db.get('playlists', playlistId); // 플레이리스트 정보 (폴더 정보)

  const relations = await db.getAllFromIndex('playlistTracks', 'by-playlist', playlistId);
  relations.sort((a, b) => a.order - b.order);

  const tracks = await Promise.all(relations.map(r => db.get('tracks', r.trackId)));

  return {
    playlist,
    tracks: tracks.filter(Boolean) as PlaylistItem[],
  };
};

export const getPlaylistPreviewTracks = async ({ playlistId, limit = 4 }: { playlistId: string; limit?: number }) => {
  const db = await getPlayerDB();

  const relations = await db.getAllFromIndex('playlistTracks', 'by-playlist', playlistId);

  relations.sort((a, b) => a.order - b.order);

  const previewRelations = relations.slice(0, limit);

  const tracks = await Promise.all(previewRelations.map(r => db.get('tracks', r.trackId)));

  return tracks.filter(Boolean) as PlaylistItem[];
};

interface TrackEntity extends PlaylistItem {
  id: string;
}
interface CreatePlaylistProps {
  title: string;
  description?: string | undefined;
  initialTrack?: PlaylistItem;
}
// 개인 플레이리스트(재생목록 = 폴더) 추가
export const createPlaylist = async ({ title, description, initialTrack }: CreatePlaylistProps) => {
  const db = await getPlayerDB();
  const now = Date.now();

  const playlistId = `${USER_PLAYLIST_ID}${crypto.randomUUID()}`;

  const playlist = {
    id: playlistId,
    title,
    description,
    createdAt: now,
    updatedAt: now,
  };

  const tx = db.transaction(['playlists', 'tracks', 'playlistTracks'], 'readwrite');
  await tx.objectStore('playlists').put(playlist); // 재생목록 생성

  // 선택된 트랙 있다면,
  if (initialTrack) {
    const track: TrackEntity = {
      ...initialTrack,
      id: initialTrack.videoId,
    };
    await tx.objectStore('tracks').put(track);

    // 새성한 재생목록(폴더)에 음악 추가

    const relationId = `${playlistId}:${initialTrack.videoId}`;
    await tx.objectStore('playlistTracks').put({
      id: relationId,
      playlistId, // FK : 어느 재생목록에 속했는지
      trackId: initialTrack.videoId, // tracks.key 참조
      order: 0,
      addedAt: now,
    });
  }

  await tx.done;

  return {
    ...playlist,
    trackId: initialTrack?.videoId || null,
    isFirstTrack: !!initialTrack,
  };
};

export const addTrackToPlaylist = async ({ playlistId, track }: { playlistId: string; track: PlaylistItem }) => {
  const db = await getPlayerDB();
  const now = Date.now();
  const relationId = `${playlistId}:${track.videoId}`;

  const tx = db.transaction(['tracks', 'playlistTracks', 'playlists'], 'readwrite');

  // 1. 중복 체크
  const existingRelation = await tx.objectStore('playlistTracks').get(relationId);

  if (existingRelation) {
    tx.abort(); // 트랜잭션 취소
    throw new Error('ALREADY_EXISTS');
  }

  // 2. tracks에 음악 저장 (있어도 덮어쓰기 되므로 상관없음)
  const trackEntity: TrackEntity = {
    ...track,
    id: track.videoId,
  };
  await tx.objectStore('tracks').put(trackEntity);

  // 3. 해당 플레이리스트의 기존 트랙 개수 확인
  const existedTrackKeys = await tx.objectStore('playlistTracks').index('by-playlist').getAllKeys(playlistId);
  const nextOrder = existedTrackKeys.length;

  // 4. playlistTracks 관계 추가
  await tx.objectStore('playlistTracks').add({
    id: relationId,
    playlistId,
    trackId: track.videoId,
    order: nextOrder,
    addedAt: now,
  });

  // 5. playlists의 updatedAt 갱신
  const playlist = await tx.objectStore('playlists').get(playlistId);
  let updatedPlaylist = null;
  if (playlist) {
    updatedPlaylist = {
      ...playlist,
      updatedAt: now,
    };
    await tx.objectStore('playlists').put(updatedPlaylist);
  }

  await tx.done;
  return {
    playlistId,
    trackId: track.videoId,
    ...(updatedPlaylist || { title: '재생목록' }),
  };
};

// 개인 플레이리스트(재생목록 = 폴더) 내 특정 트랙 삭제
export const removeTrackFromPlaylist = async ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
  const db = await getPlayerDB();
  const now = Date.now();

  const tx = db.transaction(['playlistTracks', 'playlists'], 'readwrite');

  const relationId = `${playlistId}:${trackId}`;
  await tx.objectStore('playlistTracks').delete(relationId);

  const playlist = await tx.objectStore('playlists').get(playlistId);
  let updatedPlaylist = null;

  if (playlist) {
    updatedPlaylist = {
      ...playlist,
      updatedAt: now,
    };
    await tx.objectStore('playlists').put(updatedPlaylist);
  }

  await tx.done;
  return { playlistId, trackId, ...(updatedPlaylist || { title: '재생목록' }) };
};

// 개인 플레이리스트(재생목록 = 폴더) 정보 (title, desc) 수정
export const updatePlaylistInfo = async ({
  id: playlistId,
  data,
}: {
  id: string;
  data: { title: string; description?: string };
}) => {
  const db = await getPlayerDB();
  const tx = db.transaction('playlists', 'readwrite');
  const playlist = await tx.store.get(playlistId);

  if (!playlist) throw new Error('재생목록을 찾을 수 없습니다.');

  const updated = {
    ...playlist,
    ...data,
    updatedAt: Date.now(),
  };

  await tx.store.put(updated);
  await tx.done;

  return {
    ...updated,
    playlistId: updated.id,
  };
};

// 개인 플레이리스트(재생목록 = 폴더) 자체 삭제
export const deletePlaylist = async (playlistId: string) => {
  const db = await getPlayerDB();

  const tx = db.transaction(['playlists', 'playlistTracks'], 'readwrite');
  const playlistStore = tx.objectStore('playlists');
  const playlist = await playlistStore.get(playlistId);

  // 삭제될 이름 미리 보관 (없을 경우를 대비해 기본값 설정)
  const deletedTitle = playlist?.title || '재생목록';

  await playlistStore.delete(playlistId);

  // 해당 재생목록에 속한 모든 트랙 관계 삭제 (by-playlist 인덱스 활용)
  const range = IDBKeyRange.only(playlistId);
  let cursor = await tx.objectStore('playlistTracks').index('by-playlist').openCursor(range);

  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  await tx.done;

  return {
    id: playlistId,
    playlistId,
    title: deletedTitle,
  };
};
