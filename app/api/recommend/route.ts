import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 음악 추천 전문가 겸 도우미야.' },
        {
          role: 'user',
          content: `
            ${query}의 내용은 사용자의 상태, 감정, 좋아하는 가수, 현재 날씨가 될 수 있어. 그에 맞는 음악을 추천해줘.
            - 설명: 추천 배경이나 분위기에 대한 설명.
            - 리스트: 음악 장르 3개, 플레이리스트 이름 3개만(유튜브 플레이리스트 제목), 배열 형태로 제공, 장르와 플레이리스트 외의 다른 데이터는 없어야할 것.
            - 리스트 하위의 장르와 플레이리스트는 중복되지 않아야 함.
            - 유튜브 링크는 절대 포함하지 않을 것.
            - JSON 형식으로 꼭 지키며 답변해:
              {
                "description": "...",
                "list": {
                  "genre": ["...", "...", "...],
                  "playlist": ["...", "...", "...],
                }
              }
          `,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message?.content || '{}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('OpenAI API 오류:', error, error.status);

    // 오류 유형에 따라 다른 메시지와 상태 코드 반환
    if (error.status === 429) {
      return NextResponse.json(
        {
          error: '일일 API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 429 },
      );
    } else if (error.status === 401) {
      return NextResponse.json(
        {
          error: 'API 인증에 실패했습니다. API 키를 확인해주세요.',
        },
        { status: 401 },
      );
    } else if (error.message && error.message.includes('quota')) {
      return NextResponse.json(
        {
          error: '할당된 API 사용량이 모두 소진되었습니다. 요금제를 확인해주세요.',
        },
        { status: 429 },
      );
    } else {
      // 그 외 모든 오류
      return NextResponse.json(
        {
          error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 500 },
      );
    }
  }
}
