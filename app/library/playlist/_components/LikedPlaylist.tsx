import { useAtomValue } from 'jotai';

import { likedPlaylistAtom } from '@/store/like/atom';
import { LibraryType } from '@/constants/library';
import { QueueContext } from '@/types/queue';
import { getPlaylistThumbnails } from '@/utils/thumbnail';

import PlaylistView from '@/components/Library/Playlist/PlaylistView';

export default function LikedPlaylist() {
  const likedPlaylist = useAtomValue(likedPlaylistAtom);
  const thumbnails = getPlaylistThumbnails(likedPlaylist);
  const likedCount = likedPlaylist.length;

  return (
    <PlaylistView>
      <PlaylistView.Header title='좋아요한 목록' thumbnails={thumbnails} count={likedCount} type={LibraryType.Like} />
      <PlaylistView.TrackList tracks={likedPlaylist} context={QueueContext.LikedList} />
    </PlaylistView>
  );
}
