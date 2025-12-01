import { FetchMethod } from '@/constants/fetch';
import { RecommendationType } from '@/constants/recommend';
import { Recommendation } from '@/types/recommend';
import { fetcher } from '@/utils/request';

export const RECOMMEND_API_KEY = '/api/recommend';

const getRecommendations = async ({ value, type }: { value: string; type: RecommendationType | null }) => {
  try {
    const data = await fetcher<Recommendation>(RECOMMEND_API_KEY, {
      method: FetchMethod.POST,
      data: { query: value, type },
    });
    return data;
  } catch (error) {
    console.error('추천 가져오기 실패:', error);
    throw error;
  }
};

export { getRecommendations };
