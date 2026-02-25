'use client';

import { LIKED_PLAYLIST_ID, LibraryType } from '@/constants/library';
import { usePlaylistTracks } from '@/hooks/usePlaylistTracks';
import { usePlaylistEditModal } from '@/hooks/useModal';
import { QueueContext } from '@/types/queue';
import { getPlaylistThumbnails } from '@/utils/thumbnail';
import { formatDate } from '@/utils/date';

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
  const description = isLiked ? '' : playlist?.description || '';
  const thumbnails = getPlaylistThumbnails(tracks);
  const { year, month } = formatDate(playlist?.createdAt);
  const dateInfo = `${year}.${month}`;
  const trackCount = tracks.length;

  const { openModal: openEditModal } = usePlaylistEditModal();

  const handleEdit = () => openEditModal(playlistId);

  if (isLoading) return <PlaylistViewSkeleton />;

  return (
    <PlaylistView>
      <PlaylistView.Header
        type={type}
        title={title}
        description={description}
        thumbnails={thumbnails}
        date={dateInfo}
        count={trackCount}
        onEdit={handleEdit}
      />
      <PlaylistView.TrackList tracks={tracks} context={context} />
    </PlaylistView>
  );
}
