import { RecommendationResultType } from '@/constants/recommend';
import { fetchYoutubeSearch } from '@/services/search';

import PlaylistResultClient from './_components/PlaylistResultClient';

interface PlayListResultPageProps {
  searchParams: {
    type: RecommendationResultType;
    value: string;
  };
}

export default async function PlaylistResultPage({ searchParams }: PlayListResultPageProps) {
  const { type, value } = await searchParams;

  const initialData = await fetchYoutubeSearch({ value, type });

  return <PlaylistResultClient initialData={initialData} type={type} value={value} />;
}
