import { RecommendationType } from '@/types/recommend';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const TYPE_PROMPT_MAP: Record<RecommendationType, string> = {
  artist: '좋아하는 가수에 맞는 음악 및 플레이리스트를 추천해줘',
  mood: '사용자의 기분과 상태에 맞는 음악 및 플레이리스트를 추천해줘.',
  weather: '오늘 날씨에 맞는 음악 및 플레이리스트를 추천해줘.',
  time: '현재 시간대에 맞는 음악 및 플레이리스트를 추천해줘.',
  activity: '사용자의 활동에 맞는 음악 및 플레이리스트를 추천해줘.',
};

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json();
    // 1. 타입 관련 여부 확인
    const { isRelevant } = await checkQueryRelevance(query, type);

    // 2. 추천 생성
    const typePrompt = isRelevant ? getTypePrompt(type) : '';
    const recommendationResp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 음악 추천 전문가 겸 도우미야.' },
        { role: 'user', content: generateRecommendationPrompt(query, typePrompt) },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(recommendationResp.choices[0].message?.content || '{}');
    return NextResponse.json({ ...result, is_relevant: isRelevant });
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

async function checkQueryRelevance(query: string, type: RecommendationType) {
  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 사용자의 입력과 헤드라인 타입의 관련성을 판단하는 전문가야.' },
        {
          role: 'user',
          content: `
            사용자의 입력: "${query}"
            헤드라인 타입: "${type}"
  
            질문: 사용자의 입력이 위 타입과 관련이 있나요? 
            응답은 JSON으로 {"isRelevant": true/false} 형태만 반환해주세요.
            `,
        },
      ],
      temperature: 0,
    });

    const rawContent = JSON.parse(result.choices[0].message?.content ?? '{"isRelevant":false}');
    return { isRelevant: rawContent.isRelevant === true };
  } catch (err) {
    return { isRelevant: false };
  }
}

function getTypePrompt(type: RecommendationType | null) {
  if (!type) return '';
  return TYPE_PROMPT_MAP[type] || '';
}

const generateRecommendationPrompt = (query: string, typePrompt?: string) => `
사용자의 입력: "${query}"
${typePrompt ? `타입 기반 추천: "${typePrompt}"` : ''}

- 설명: 추천 배경이나 분위기에 대한 설명
- 리스트: 음악 장르 3개, 플레이리스트 이름 3개 (유튜브 플레이리스트 제목), 배열 형태
- 리스트 하위의 장르와 플레이리스트 중복 금지
- 유튜브 링크는 절대 포함하지 마세요
- JSON 형식:
{
  "description": "...",
  "list": {
    "genre": ["...", "...", "..."],
    "playlist": ["...", "...", "..."]
  }
}
`;
