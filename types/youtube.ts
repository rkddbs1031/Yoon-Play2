export interface YoutubeImageSize {
  url: string;
  width: number;
  height: number;
}

export interface YoutubeThumbnail {
  default: YoutubeImageSize;
  medium: YoutubeImageSize;
  high: YoutubeImageSize;
}

export interface YoutubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnail;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

export interface YoutubeItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YoutubeSnippet;
}

export interface YouTubeSearchList {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeItem[];
}
