import { NextRequest, NextResponse } from 'next/server';

import { RecommendationResultType } from '@/types/recommend';

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
      maxResults: '10',
      ...(query && {
        q: `${query} ${searchType === RecommendationResultType.Genre ? '장르' : ''} 플레이리스트 `,
      }),
      ...(pageToken && { pageToken }),
      key: process.env.YOUTUBE_API_KEY || '',
    });

    const response = await fetch(`${YOUTUBE_API_BASE}?${youtubeParams.toString()}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'YouTube API 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Youtube API 오류:', error);

    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 },
    );
  }
}
