import { LIKED_PLAYLIST_ID, getPlayerDB } from '.';

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
  const rest = playlistsWithCount.filter(p => p.id !== LIKED_PLAYLIST_ID).sort((a, b) => b.createdAt - a.createdAt);

  return liked ? [liked, ...rest] : rest;
};
