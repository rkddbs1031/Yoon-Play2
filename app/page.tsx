'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { getRecommendations } from '@/services/recommend';
import { RANDOM_HEADLINES } from '@/states/headLine';
import { animationStyle } from '@/utils/animation';
import { AnimationType } from '@/types/animation';
import { Recommendation } from '@/types/recommend';
import { TextFieldType } from '@/types/textFiled';

import { ListWrapper } from '@/components/ListWrapper';
import LoadingSpinner from '@/components/Loading';
import SearchField from '@/components/SearchField';

const INIT_RECOMMEND = {
  description: '',
  list: null,
};

export default function Home() {
  const [headLine, setHeadline] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recommend, setRecommend] = useState<Recommendation>(INIT_RECOMMEND);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
  };

  const handleSubmit = () => {
    if (!searchValue) return;

    setIsLoading(true);

    getRecommendations(searchValue)
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
    const random = RANDOM_HEADLINES[Math.floor(Math.random() * RANDOM_HEADLINES.length)];
    setHeadline(random);
  }, []);

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 });
  }, []);

  const animationStyle2 = useMemo(() => {
    return animationStyle({ useAnimation: true, delay: 0.6, duration: 0.6 });
  }, []);

  const handleClick = (key: string) => {
    console.log(key);
  };

  const handleResetSearch = () => {
    setRecommend(INIT_RECOMMEND);
    setShowResults(prev => !prev);
  };

  return (
    <section className='flex flex-col w-full items-center justify-center'>
      <>
        <h1
          className={`${AnimationType.FadeInUp} mt-10 text-lg sm:text-xl font-bold text-center whitespace-pre-wrap`}
          style={animationStyles}
        >
          {headLine}
        </h1>
        <div className='w-full mt-[60px]' style={animationStyle2}>
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
      </>

      <div
        className={`transition-all duration-500 ease-in-out ${isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        {isLoading && <LoadingSpinner />}
      </div>

      {showResults && !isLoading && (
        <div
          className={`result-wrapper flex flex-col items-center w-full gap-10 mt-10 ${AnimationType.FadeInUp}`}
          style={animationStyle2}
        >
          <p className='text-center text-[16px] sm:text-[18px]'>{recommend.description}</p>

          {recommend.list && (
            <>
              <div className='recommend-list flex flex-col gap-10 max-w-[720px] w-full'>
                <ListWrapper
                  sectionName='play-list'
                  title='플레이리스트 추천'
                  list={recommend.list.playlist}
                  onClick={handleClick}
                />
                <ListWrapper sectionName='genre' title='장르 추천' list={recommend.list.genre} onClick={handleClick} />
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
    </section>
  );
}
