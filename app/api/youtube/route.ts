import { RecommendationType } from '@/types/recommend';
import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const result = await fetch(
      `${YOUTUBE_SEARCH_URL}&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: 'YouTube API 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: result.status },
      );
    }

    const data = await result.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Youtube API 오류:', error);

    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 },
    );
  }
}
