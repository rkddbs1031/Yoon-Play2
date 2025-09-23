interface List {
  genre: string[];
  playlist: string[];
}

export interface Recommendation {
  description: string;
  list: null | List;
}
