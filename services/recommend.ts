import apiService from '@/utils/fetch';

const getRecommendations = async (query: string) => {
  try {
    const data = await apiService.post('/api/recommend', { query });
    return data;
  } catch (error) {
    console.error('추천 가져오기 실패:', error);
    throw error;
  }
};

export { getRecommendations };
