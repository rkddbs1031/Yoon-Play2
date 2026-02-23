'use client';

import { LIKED_PLAYLIST_ID, LibraryType } from '@/constants/library';
import { usePlaylistTracks } from '@/hooks/usePlaylistTracks';
import { QueueContext } from '@/types/queue';
import { getPlaylistThumbnails } from '@/utils/thumbnail';

import PlaylistView from '@/components/Library/Playlist/PlaylistView';
import { PlaylistViewSkeleton } from '@/components/Skeleton/PlaylistViewSkeleton';

interface PlaylistViewProps {
  playlistId: string;
}

export default function LibraryPlaylistView({ playlistId }: PlaylistViewProps) {
  const { tracks, playlist, isLoading } = usePlaylistTracks(playlistId);
  const isLiked = playlistId === LIKED_PLAYLIST_ID;

  const type = isLiked ? LibraryType.Like : LibraryType.Playlist;
  const context = isLiked ? QueueContext.LikedList : QueueContext.UserPlaylist;

  const title = isLiked ? '좋아요한 목록' : playlist?.title || '';
  const thumbnails = getPlaylistThumbnails(tracks);
  const trackCount = tracks.length;

  if (isLoading) return <PlaylistViewSkeleton />;

  return (
    <PlaylistView>
      <PlaylistView.Header title={title} thumbnails={thumbnails} count={trackCount} type={type} />
      <PlaylistView.TrackList tracks={tracks} context={context} />
    </PlaylistView>
  );
}
