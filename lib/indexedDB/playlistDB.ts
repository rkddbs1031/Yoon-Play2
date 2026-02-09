import { PlaylistItem } from '@/types/playlist';
import { LIKED_PLAYLIST_ID, USER_PLAYLIST_ID, getPlayerDB } from '.';

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
    await tx.objectStore('tracks').put(initialTrack); // track에 음악 저장.

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

  return playlist;
};
