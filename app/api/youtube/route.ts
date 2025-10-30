import { NextRequest, NextResponse } from 'next/server';

import { RecommendationResultType } from '@/types/recommend';
import { MOCK } from '@/constants/mock';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
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
    // return NextResponse.json(MOCK);
  } catch (error: any) {
    console.error('Youtube API 오류:', error);

    const reason = error?.error?.errors?.[0]?.reason;

    // 할당량 초과
    if (reason === 'quotaExceeded') {
      return NextResponse.json(
        { error: 'QUOTA_EXCEEDED', message: 'YouTube API 할당량을 초과했습니다. 내일 다시 시도해주세요.' },
        { status: 429 },
      );
    }

    // API 키 없음 or 잘못됨
    if (reason === 'keyInvalid' || reason === 'badRequest') {
      return NextResponse.json({ error: 'INVALID_API_KEY', message: 'API 키가 유효하지 않습니다.' }, { status: 401 });
    }

    // API가 활성화되지 않음
    if (reason === 'accessNotConfigured') {
      return NextResponse.json(
        { error: 'API_NOT_ENABLED', message: 'YouTube Data API가 활성화되지 않았습니다.' },
        { status: 403 },
      );
    }

    // Rate Limit (초당 요청 제한)
    if (reason === 'rateLimitExceeded' || reason === 'userRateLimitExceeded') {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 },
      );
    }

    // 리소스를 찾을 수 없음
    if (reason === 'videoNotFound' || reason === 'channelNotFound') {
      return NextResponse.json({ error: 'NOT_FOUND', message: '요청한 리소스를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 기타 에러
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error?.error?.message || '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
