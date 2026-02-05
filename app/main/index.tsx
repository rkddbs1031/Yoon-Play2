'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RandomHeadLineType, Recommendation } from '@/types/recommend';
import { RecommendationResultType } from '@/constants/recommend';
import { useRecommendationSearch } from '@/services/recommend';
import { RANDOM_HEADLINES } from '@/states/headLine';

import LoadingSpinner from '@/components/Loading';
import MainIntro from './_components/MainIntro';
import MainResult from './_components/MainResult';

const INIT_RECOMMEND = {
  description: '',
  list: null,
};

export default function Main() {
  const [headline, setHeadline] = useState<RandomHeadLineType>({ type: null, text: '' });
  const [searchValue, setSearchValue] = useState('');
  const [recommend, setRecommend] = useState<Recommendation>(INIT_RECOMMEND);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: searchRecommendation, isPending, error } = useRecommendationSearch();
  const router = useRouter();

  useEffect(() => {
    const { type, text } = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    setHeadline({ type, text });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
  };

  const handleSubmit = () => {
    if (!searchValue && !headline.type) return;

    searchRecommendation(
      { value: searchValue, type: headline.type },
      {
        onSuccess: ({ data }) => {
          const { description, list } = data;
          setRecommend({ description, list });
          setErrorMessage(null);
        },
        onError: (err: any) => {
          if (err?.response) {
            setErrorMessage(err.response.data.error || '오류가 발생했습니다.');
          } else {
            setErrorMessage('서버에 연결할 수 없습니다.');
          }
        },
      },
    );
  };

  const handleClick = ({ value, type }: { value: string; type: RecommendationResultType }) => {
    router.push(`/result?type=${type}&value=${encodeURIComponent(value)}`);
  };

  const handleReset = () => {
    setRecommend(INIT_RECOMMEND);
    setSearchValue('');
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
      />

      <MainResult
        isVisible={!showIntro}
        description={recommend.description}
        data={recommend.list}
        onClick={handleClick}
        onReset={handleReset}
      />

      {errorMessage && <p>{errorMessage}</p>}

      <LoadingSpinner isLoading={isPending} />
    </section>
  );
}
