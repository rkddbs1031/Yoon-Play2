interface List {
  genre: string[];
  playlist: string[];
}

export interface RecommendationResponse {
  description: string;
  list: null | List;
}
