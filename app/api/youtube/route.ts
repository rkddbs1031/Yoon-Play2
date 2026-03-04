import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODE } from '@/constants/error';
import { RecommendationResultType } from '@/constants/recommend';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

const YOUTUBE_ERROR_MAP: Record<string, { status: number; code: string; message: string }> = {
  quotaExceeded: {
    status: 429,
    code: ERROR_CODE.QUOTA_EXCEEDED,
    message: '오늘 준비된 검색량이 소진되었습니다. 내일 다시 만나요! 👋',
  },
  keyInvalid: {
    status: 401,
    code: ERROR_CODE.AUTH_ERROR,
    message: '시스템 인증 오류가 발생했습니다. 관리자에게 문의해주세요.',
  },
  accessNotConfigured: {
    status: 401,
    code: ERROR_CODE.AUTH_ERROR,
    message: '시스템 인증 오류가 발생했습니다. 관리자에게 문의해주세요.',
  },
  videoNotFound: {
    status: 404,
    code: ERROR_CODE.NOT_FOUND,
    message: '찾으시는 영상 정보가 존재하지 않습니다.',
  },
  channelNotFound: {
    status: 404,
    code: ERROR_CODE.NOT_FOUND,
    message: '찾으시는 채널 정보가 존재하지 않습니다.',
  },
  badRequest: {
    status: 400,
    code: ERROR_CODE.INVALID_REQUEST,
    message: '잘못된 검색 요청입니다. 검색어를 확인해주세요.',
  },
  rateLimitExceeded: {
    status: 429,
    code: ERROR_CODE.RATE_LIMIT,
    message: '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.',
  },
  userRateLimitExceeded: {
    status: 429,
    code: ERROR_CODE.RATE_LIMIT,
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim();
    const searchType = searchParams.get('type') || '';
    const pageToken = searchParams.get('pageToken');

    const youtubeParams = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      maxResults: '16',
      ...(query && {
        q: `${query} ${searchType === RecommendationResultType.Genre ? '장르' : ''} 플레이리스트 `,
      }),
      videoDuration: 'long',
      order: 'relevance',
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      fields: 'items(id/videoId, snippet/title, snippet/channelTitle, snippet/thumbnails), nextPageToken',
      ...(pageToken && { pageToken }),
      key: process.env.YOUTUBE_API_KEY || '',
    });

    const response = await fetch(`${YOUTUBE_API_BASE}?${youtubeParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    const reason = error?.error?.errors?.[0]?.reason || 'unknown';

    const errorInfo = YOUTUBE_ERROR_MAP[reason];

    const status = errorInfo?.status || 500;
    const code = errorInfo?.code || ERROR_CODE.SERVER_ERROR;
    const message = errorInfo?.message || error?.error?.message || '서비스 일시 점검 중입니다.';

    console.error(`🔴 [YouTube API] ${reason}:`, error);

    return NextResponse.json({ success: false, code, message }, { status });
  }
}
