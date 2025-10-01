'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getRecommendations } from '@/services/recommend';
import { RANDOM_HEADLINES } from '@/states/headLine';
import { animationStyle } from '@/utils/animation';
import { AnimationType } from '@/types/animation';
import { RecommendationResultType, Recommendation, RandomHeadLineType } from '@/types/recommend';
import { TextFieldType } from '@/types/textFiled';

import { ListWrapper } from '@/components/ListWrapper';
import LoadingSpinner from '@/components/Loading';
import SearchField from '@/components/SearchField';

const INIT_RECOMMEND = {
  description: '',
  list: null,
};

export default function Home() {
  const [headLine, setHeadline] = useState<RandomHeadLineType>({ type: null, text: '' });
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recommend, setRecommend] = useState<Recommendation>(INIT_RECOMMEND);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
  };

  const handleSubmit = () => {
    if (!searchValue && !headLine.type) return;

    setIsLoading(true);

    getRecommendations({ value: searchValue, type: headLine.type })
      .then(({ data }) => {
        const { description, list } = data;
        setRecommend({ description, list });
        setShowResults(true);
        setErrorMessage(null);
      })
      .catch(err => {
        if (err.response) {
          setErrorMessage(err.response.data.error || '오류가 발생했습니다.');
        } else {
          setErrorMessage('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
        }
      })
      .finally(() => {
        setSearchValue('');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const { type, text } = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    setHeadline({ type, text });
  }, []);

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 });
  }, []);

  const handleResetSearch = () => {
    setRecommend(INIT_RECOMMEND);
    setShowResults(prev => !prev);
  };

  const handleClick = ({ value, type }: { value: string; type: RecommendationResultType }) => {
    router.push(`/result?type=${type}&value=${encodeURIComponent(value)}`);
  };

  return (
    <section className='flex flex-col w-full items-center justify-center max-w-[720px] w-full mx-auto'>
      <h1
        className={`${AnimationType.FadeInUp} mt-10 text-lg sm:text-xl font-bold text-center whitespace-pre-wrap`}
        style={animationStyles}
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
        />
      </div>

      {showResults && !isLoading && (
        <div
          className={`result-wrapper flex flex-col items-center w-full gap-10 mt-10 ${AnimationType.FadeInUp}`}
          style={animationStyles}
        >
          <p className='text-center text-[16px] sm:text-[18px]'>{recommend.description}</p>

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

              <div>
                <p className='text-sm mb-4'>원하는 음악이 없으신가요?</p>
                <button
                  type='button'
                  className='block my-0 mx-auto bg-white/50 rounded-[24px] hadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl shadow-lg w-full max-w-[120px] px-2 py-2 text-[12px]'
                  onClick={handleResetSearch}
                >
                  다시 검색하기
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      <LoadingSpinner isLoading={isLoading} />
    </section>
  );
}
