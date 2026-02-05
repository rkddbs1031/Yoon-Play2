'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RandomHeadLineType, Recommendation } from '@/types/recommend';
import { AnimationType } from '@/constants/animation';
import { RecommendationResultType } from '@/constants/recommend';
import { TextFieldType } from '@/constants/textFiled';
import { animationStyle } from '@/utils/animation';
import { useRecommendationSearch } from '@/services/recommend';
import { RANDOM_HEADLINES } from '@/states/headLine';

import SearchField from '@/components/SearchField';
import LoadingSpinner from '@/components/Loading';
import { ListWrapper } from '@/components/ListWrapper';

const INIT_RECOMMEND = {
  description: '',
  list: null,
};

export default function Main() {
  const [showIntro, setShowIntro] = useState(false);
  const [headLine, setHeadline] = useState<RandomHeadLineType>({ type: null, text: '' });
  const [searchValue, setSearchValue] = useState('');
  const [recommend, setRecommend] = useState<Recommendation>(INIT_RECOMMEND);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: searchRecommendation, isPending, error } = useRecommendationSearch();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
  };

  const handleSubmit = () => {
    if (!searchValue && !headLine.type) return;

    searchRecommendation(
      { value: searchValue, type: headLine.type },
      {
        onSuccess: ({ data }) => {
          const { description, list } = data;
          setRecommend({ description, list });
          setShowResults(true);
          setErrorMessage(null);
          setSearchValue('');
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
    setShowResults(prev => !prev);
  };

  const isSuccess = !isPending && showResults;

  useEffect(() => {
    const { type, text } = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    setHeadline({ type, text });

    setShowIntro(true);
  }, []);

  return (
    <section className='flex flex-col w-full items-center justify-center max-w-[720px] w-full mx-auto'>
      {showIntro && !isSuccess && (
        <>
          <h1
            className={`${AnimationType.FadeInUp} mt-10 text-lg sm:text-xl font-[600] text-[#52527a] text-center whitespace-pre-wrap`}
            style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
          >
            {headLine.text}
          </h1>
          <div className='w-full mt-[60px]'>
            <SearchField
              fieldType={TextFieldType.Textarea}
              value={searchValue}
              onChange={handleChange}
              onSubmit={handleSubmit}
              useAnimation={true}
              animationType={AnimationType.FadeInUp}
              delay={0.6}
              duration={0.6}
              color='#52527a'
            />
          </div>
        </>
      )}

      {isSuccess && (
        <div
          className={`result-wrapper flex flex-col items-center w-full gap-10 mt-5 ${AnimationType.FadeInUp}`}
          style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
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
