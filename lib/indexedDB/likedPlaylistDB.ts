import { PlaylistItem } from '@/types/playlist';
import { LIKED_PLAYLIST_ID, getPlayerDB } from '.';

export const getLikedPlaylist = async (): Promise<PlaylistItem[]> => {
  const db = await getPlayerDB();

  // 1. 좋아요 playlist에 속한 관계 조회
  const relations = await db.transaction('playlistTracks').store.index('by-playlist').getAll(LIKED_PLAYLIST_ID);

  // 2. order 기준 정렬
  relations.sort((a, b) => a.order - b.order);

  // 3. trackId로 실제 트랙 조회
  const tracks = await Promise.all(relations.map(rel => db.get('tracks', rel.trackId)));

  // null 방어
  return tracks.filter(Boolean) as PlaylistItem[];
};

export interface TrackEntity extends PlaylistItem {
  id: string; // PK (=== videoId)
}

const toTrackEntity = (item: PlaylistItem): TrackEntity => ({
  ...item,
  id: item.videoId,
});

export const addLikedItem = async (item: PlaylistItem) => {
  const db = await getPlayerDB();

  const tx = db.transaction(['tracks', 'playlistTracks'], 'readwrite');

  // 1. 트랙은 항상 tracks에 저장
  await tx.objectStore('tracks').put(toTrackEntity(item));

  const relationId = `${LIKED_PLAYLIST_ID}:${item.videoId}`; // 어느 폴더인지:videoId
  const exists = await tx.objectStore('playlistTracks').get(relationId);

  // 2. 이미 좋아요면 아무 것도 안 함
  if (exists) {
    await tx.done;
    return;
  }

  // 3. 마지막 order 계산
  const lastRelations = await tx.objectStore('playlistTracks').index('by-playlist').getAll(LIKED_PLAYLIST_ID);

  const nextOrder = lastRelations.length > 0 ? Math.max(...lastRelations.map(r => r.order)) + 1 : 0;

  // 4. 관계 추가
  await tx.objectStore('playlistTracks').put({
    id: relationId,
    playlistId: LIKED_PLAYLIST_ID,
    trackId: item.videoId,
    order: nextOrder,
    addedAt: Date.now(),
  });

  await tx.done;
};

export const deleteLikedItem = async (videoId: string) => {
  const db = await getPlayerDB();
  const relationId = `${LIKED_PLAYLIST_ID}:${videoId}`;
  await db.delete('playlistTracks', relationId);
};

// 곡이 이미 좋아요 되어있는지 체크하는 함수
export const isLikedItem = async (videoId: string) => {
  const db = await getPlayerDB();
  const relationId = `${LIKED_PLAYLIST_ID}:${videoId}`;
  return !!(await db.get('playlistTracks', relationId));
};
