import { useAtomValue } from 'jotai';
import PlaylistView from './PlaylistView';
import { likedPlaylistAtom } from '@/store/likesAtom';
import { LibraryType } from '@/constants/library';

export default function LikedPlaylist() {
  const likedPlaylist = useAtomValue(likedPlaylistAtom);

  const thumbnails = likedPlaylist.slice(0, 4).map(p => p.thumbnail.medium.url);
  const likedCount = likedPlaylist.length;

  return (
    <PlaylistView>
      <PlaylistView.Header title='좋아요한 목록' thumbnails={thumbnails} count={likedCount} type={LibraryType.Like} />
      <PlaylistView.TrackList tracks={likedPlaylist} />
    </PlaylistView>
  );
}
