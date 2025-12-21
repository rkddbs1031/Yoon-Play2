import { PlaylistItem } from '@/types/playlist';
import { ThumbnailSize, YoutubeThumbnail } from '@/types/youtube';

const THUMBNAIL_KEY_MAP: Record<ThumbnailSize, keyof YoutubeThumbnail> = {
  small: 'default',
  medium: 'medium',
  large: 'high',
};

export const formatThumbnailUrl = ({
  thumbnail,
  size = 'medium',
}: {
  thumbnail?: YoutubeThumbnail;
  size: ThumbnailSize;
}) => {
  if (!thumbnail) return '';

  const key = THUMBNAIL_KEY_MAP[size];

  return thumbnail[key].url;
};

export const getPlaylistThumbnails = (items: PlaylistItem[], size: ThumbnailSize = 'medium', limit = 4) => {
  return items
    .slice(0, limit)
    .map(item => formatThumbnailUrl({ thumbnail: item.thumbnail, size }))
    .filter(Boolean);
};
