import { RecommendationType } from '@/constants/recommend';

interface List {
  genre: string[];
  playlist: string[];
}

export interface Recommendation {
  description: string;
  list: null | List;
}

export interface RandomHeadLineType {
  type: RecommendationType | null;
  text: string;
}
