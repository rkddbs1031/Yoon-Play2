import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

import { ERROR_CODE } from '@/constants/error';
import { RecommendationType } from '@/constants/recommend';

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

const OPENAI_ERROR_MAP: Record<string | number, { status: number; code: string; message: string }> = {
  429: {
    status: 429,
    code: ERROR_CODE.QUOTA_EXCEEDED,
    message: '오늘 준비된 AI 추천 한도가 소진되었습니다. 내일 다시 시도해주세요! 👋',
  },
  401: {
    status: 401,
    code: ERROR_CODE.AUTH_ERROR,
    message: '추천 시스템 인증에 실패했습니다. 관리자에게 문의해주세요.',
  },
  insufficient_quota: {
    status: 429,
    code: ERROR_CODE.QUOTA_EXCEEDED,
    message: '보유하신 API 크레딧이 부족합니다. 계정 설정을 확인해주세요.',
  },
  500: {
    status: 500,
    code: ERROR_CODE.SERVER_ERROR,
    message: 'AI 모델이 응답하지 않습니다. 잠시 후 다시 시도해주세요.',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json();
    // 1. 타입 관련 여부 확인
    const { isRelevant } = await checkQueryRelevance(query, type);

    // 2. 추천 생성
    const typePrompt = isRelevant ? getTypePrompt(type) : '';
    const recommendationResp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '너는 음악 추천 전문가야. 응답은 반드시 한국어로 작성하고, 출력은 오직 JSON 포맷으로만 해줘.',
        },
        {
          role: 'user',
          content: generateRecommendationPrompt(query, typePrompt),
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(recommendationResp.choices[0].message?.content || '{}');
    return NextResponse.json({ ...result, is_relevant: isRelevant });
  } catch (error: any) {
    const status = error.status;
    const errorCode = error.code || error.type;

    const errorInfo = OPENAI_ERROR_MAP[status] || OPENAI_ERROR_MAP[errorCode];

    const finalStatus = errorInfo?.status || status || 500;
    const finalCode = errorInfo?.code || ERROR_CODE.SERVER_ERROR;
    const finalMessage = errorInfo?.message || error.message || '추천 서비스 일시 점검 중입니다.';

    console.error(`🔴 [OpenAI API] ${status || errorCode}:`, error);

    return NextResponse.json({ success: false, code: finalCode, message: finalMessage }, { status: finalStatus });
  }
}

async function checkQueryRelevance(query: string, type: RecommendationType) {
  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
  } catch {
    return { isRelevant: false };
  }
}

function getTypePrompt(type: RecommendationType | null) {
  if (!type) return '';
  return TYPE_PROMPT_MAP[type] || '';
}

const generateRecommendationPrompt = (query: string, typePrompt?: string) => `
사용자의  기분/상황: "${query}"
참고 타입: "${typePrompt ? `${typePrompt}` : ''}"

너의 임무는 위 내용을 바탕으로 유튜브 검색 시 '감성적인 썸네일과 제목'을 가진 플레이리스트가 잘 나오도록 키워드를 추출하는거야.

[작성 규칙]
1. playlist는 한국어 위주로, 유튜버들이 제목으로 쓸 법한 '트렌디한 문구'와 '명사형' 키워드로 작성해.
   - 나쁜 예: "Spring Pop Playlist" (너무 딱딱함), "봄바람을 느끼며 노래하는 시간" (너무 김)
   - 좋은 예: "드라이브하며 듣기 좋은 청량한 팝송", "봄날 카페 플레이리스트", "햇살 좋은 날 듣는 팝송", "산뜻한 봄 팝송", "설레는 인디음악"
2. 장르(genre)는 실제 음악 장르 명칭만 사용해 (예: K-Pop, Lo-fi, Jazz).
3. 설명(description)은 이 음악들을 들었을 때 어떤 기분을 느낄 수 있는지 감성적으로 적어줘.

JSON 형식:
{
  "description": "...",
  "list": {
    "genre": ["장르1", "장르2", "장르3"],
    "playlist": ["검색어1", "검색어2", "검색어3"]
  }
}
`;
