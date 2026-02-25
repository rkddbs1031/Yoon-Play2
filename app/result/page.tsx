import { RecommendationType } from '@/constants/recommend';
import { fetchYoutubeSearch } from '@/services/search';

import PlaylistResultClient from './_components/PlaylistResultClient';

interface PlayListResultPageProps {
  searchParams: {
    type: string;
    value: string;
  };
}

export default async function PlaylistResultPage({ searchParams }: PlayListResultPageProps) {
  const { type, value } = searchParams;

  const initialData = await fetchYoutubeSearch({ value, type: type as RecommendationType });

  return <PlaylistResultClient initialData={initialData} type={type} value={value} />;
}
