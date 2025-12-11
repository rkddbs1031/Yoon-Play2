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
