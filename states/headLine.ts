import { RandomHeadLineType, RecommendationType } from '@/types/recommend';

export const RANDOM_HEADLINES: RandomHeadLineType[] = [
  {
    type: RecommendationType.Mood,
    text: '오늘의 기분과 상태는 어떤가요? \n 딱 맞는 플레이리스트를 추천해드릴게요 🎵',
  },
  {
    type: RecommendationType.Mood,
    text: '오늘의 당신 상태에 맞는 장르를 추천해드릴게요 😎',
  },
  {
    type: RecommendationType.Mood,
    text: '지금 기분을 한 단어로 표현해보세요! \n 어울리는 음악을 찾아드릴게요 🎶',
  },
  {
    type: RecommendationType.Mood,
    text: '오늘의 감정을 말해보세요! AI가 추천하는 음악을 보여드릴게요 🤖🎧',
  },
  {
    type: RecommendationType.Mood,
    text: '오늘의 Mood 체크! 플레이리스트와 장르 추천해드릴게요 🎼',
  },
  {
    type: RecommendationType.Mood,
    text: '휴식이 필요한가요? 🛋️ 힐링 플레이리스트를 추천해드릴게요.',
  },
  {
    type: RecommendationType.Mood,
    text: '기분이 UP? DOWN? \n 그에 맞는 노래를 추천해드릴게요 ⬆️⬇️',
  },
  {
    type: RecommendationType.Weather,
    text: '오늘 날씨에 맞는 노래를 추천드릴까요? ☀️🌧️',
  },
  {
    type: RecommendationType.Weather,
    text: '오늘 날씨에 맞는 음악을 들려드릴까요? ☀️🌧️',
  },
  {
    type: RecommendationType.Artist,
    text: '좋아하는 가수가 있으신가요? 🎤 좋아하는 가수의 플레이리스트는 어떠신가요?',
  },
  {
    type: RecommendationType.Time,
    text: '아침 커피와 함께 듣기 좋은 음악, 준비해드렸어요 ☕🎶',
  },
  {
    type: RecommendationType.Time,
    text: '점심 후 여유롭게 들을 수 있는 음악, 골라봤어요 🍵🎧',
  },
  {
    type: RecommendationType.Time,
    text: '오늘 밤 기분에 딱 맞는 음악, 찾아드릴게요 🌙',
  },
  {
    type: RecommendationType.Time,
    text: '저녁이 되면 여유로운 음악이 필요하죠 🌆 편안한 노래를 추천해드릴게요.',
  },
  {
    type: RecommendationType.Time,
    text: '지금 시간에 딱 맞는 분위기의 음악을 추천해드릴게요 ⏰🎶',
  },
  {
    type: RecommendationType.Activity,
    text: '지금 무엇을 하고 계신가요? 🏃‍♂️📚🚗 활동에 맞는 음악을 추천해드릴게요!',
  },
  {
    type: RecommendationType.Activity,
    text: '운동 중이라면 신나는 플레이리스트를, 집중이 필요하다면 차분한 음악을 추천해드려요 💪🎧',
  },
];
