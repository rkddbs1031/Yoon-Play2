'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RecommendationResultType } from '@/constants/recommend';
import { useRecommendationSearch } from '@/services/recommend';
import { useYoutubeInfiniteQuery } from '@/services/search';
import { RANDOM_HEADLINES } from '@/states/headLine';
import { CustomAxiosError } from '@/types/error';
import { RandomHeadLineType, Recommendation } from '@/types/recommend';

import LoadingSpinner from '@/components/Loading';
import MainIntro from './_components/MainIntro';
import MainResult from './_components/MainResult';

const INIT_RECOMMEND = {
  description: '',
  list: null,
};

export default function Main() {
  const router = useRouter();

  const [headline, setHeadline] = useState<RandomHeadLineType>({ type: null, text: '' });
  const [searchValue, setSearchValue] = useState('');
  const [recommend, setRecommend] = useState<Recommendation>(INIT_RECOMMEND);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedTarget, setSelectedTarget] = useState<{ type: string | null; value: string | null }>({
    type: null,
    value: null,
  });

  const { mutate: searchRecommendation, isPending } = useRecommendationSearch();

  const { isLoading: isYoutubeLoading } = useYoutubeInfiniteQuery({
    type: selectedTarget.type,
    value: selectedTarget.value,
    initialData: undefined,
  });

  useEffect(() => {
    const { type, text } = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    setHeadline({ type, text });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleSubmit = () => {
    if (!searchValue && !headline.type) return;

    searchRecommendation(
      { value: searchValue, type: headline.type },
      {
        onSuccess: data => {
          const { description, list } = data;
          setRecommend({ description, list });
          setErrorMessage(null);
        },
        onError: (err: CustomAxiosError) => {
          const serverError = err.response?.data;
          const message = serverError?.message || '추천 정보를 가져오지 못했습니다.';

          setErrorMessage(message);
        },
      },
    );
  };

  const handleClick = ({ value, type }: { value: string; type: RecommendationResultType }) => {
    setSelectedTarget({ value, type });

    router.push(`/result?type=${type}&value=${encodeURIComponent(value)}`);
  };

  const handleReset = () => {
    setRecommend(INIT_RECOMMEND);
    setSearchValue('');
    setSelectedTarget({ type: null, value: null });
  };

  const showIntro = !(!isPending && recommend.list !== null);

  return (
    <section className='flex flex-col w-full items-center justify-center max-w-[720px] w-full mx-auto'>
      <MainIntro
        isVisible={showIntro}
        headline={headline.text}
        searchValue={searchValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errorMessage={errorMessage}
      />

      <MainResult
        isVisible={!showIntro}
        description={recommend.description}
        data={recommend.list}
        onClick={handleClick}
        onReset={handleReset}
      />

      <LoadingSpinner isLoading={isPending || isYoutubeLoading} />
    </section>
  );
}
