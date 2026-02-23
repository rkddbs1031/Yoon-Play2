import { LIKED_PLAYLIST_ID, LibraryListType, USER_PLAYLIST_ID } from '@/constants/library';

export const fromPlaylistParam = (param: string) => {
  if (param === LibraryListType.Like) {
    return LIKED_PLAYLIST_ID;
  }

  if (param.startsWith(`${LibraryListType.Playlist}-`)) {
    const uuid = param.slice(3); // PL-제거
    return `${USER_PLAYLIST_ID}${uuid}`;
  }
};
