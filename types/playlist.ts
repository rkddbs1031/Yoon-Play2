import { YoutubeThumbnail } from './youtube';

export interface PlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: YoutubeThumbnail;
}
