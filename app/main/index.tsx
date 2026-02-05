'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RandomHeadLineType, Recommendation } from '@/types/recommend';
import { AnimationType } from '@/constants/animation';
import { RecommendationResultType } from '@/constants/recommend';
import { animationStyle } from '@/utils/animation';
import { useRecommendationSearch } from '@/services/recommend';
import { RANDOM_HEADLINES } from '@/states/headLine';

import LoadingSpinner from '@/components/Loading';
import { ListWrapper } from '@/components/ListWrapper';
import MainIntro from './_components/MainIntro';

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

      {!showIntro && (
        <div
          className={`result-wrapper flex flex-col items-center w-full gap-10 mt-5 ${AnimationType.FadeInUp}`}
          style={animationStyle({ useAnimation: true, delay: 0.8, duration: 0.6 })}
        >
          <p className='text-center text-[16px]'>{recommend.description}</p>
          {recommend.list && (
            <>
              <div className='recommend-list flex flex-col gap-10 w-full'>
                <ListWrapper
                  type={RecommendationResultType.Playlist}
                  title='플레이리스트 추천'
                  list={recommend.list.playlist}
                  onClick={handleClick}
                />
                <ListWrapper
                  type={RecommendationResultType.Genre}
                  title='장르 추천'
                  list={recommend.list.genre}
                  onClick={handleClick}
                />
              </div>

              <div className='pb-[40px]'>
                <p className='text-sm mb-4'>원하는 음악이 없으신가요?</p>
                <button
                  type='button'
                  className='block my-0 mx-auto bg-white/50 rounded-[24px] hadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl shadow-lg w-full max-w-[120px] px-2 py-2 text-[12px]'
                  onClick={handleReset}
                >
                  다시 검색하기
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      <LoadingSpinner isLoading={isPending} />
    </section>
  );
}
