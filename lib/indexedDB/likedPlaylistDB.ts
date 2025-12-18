import { PlaylistItem } from '@/types/playlist';
import { getPlayerDB } from '.';

export const getLikedPlaylist = async (): Promise<PlaylistItem[]> => {
  const db = await getPlayerDB();
  return db.getAll('likedPlaylist');
};

export const addLikedItem = async (item: PlaylistItem) => {
  const db = await getPlayerDB();
  await db.put('likedPlaylist', item);
};

export const deleteLikedItem = async (videoId: string) => {
  const db = await getPlayerDB();
  await db.delete('likedPlaylist', videoId);
};

// 곡이 이미 좋아요 되어있는지 체크하는 함수
export const isLikedItem = async (videoId: string) => {
  const db = await getPlayerDB();
  return !!(await db.get('likedPlaylist', videoId));
};
