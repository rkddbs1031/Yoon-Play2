'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AnimationType } from '@/constants/animation';
import { TextFieldType } from '@/constants/textFiled';
import { animationStyle } from '@/utils/animation';
import SearchField from '@/components/SearchField';

interface MainIntroProps {
  isVisible?: boolean;
  headline: string;
  searchValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  duration?: number;
  errorMessage?: string | null;
}

export default function MainIntro({
  isVisible,
  duration = 800,
  searchValue,
  headline,
  onChange,
  onSubmit,
  errorMessage,
}: MainIntroProps) {
  const [shouldRender, setShouldRender] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (headline.length > 0) {
      setShouldRender(true);
    }
  }, [headline, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      const exitTimer = setTimeout(() => {
        setShouldRender(false);
      }, duration);

      return () => {
        clearTimeout(exitTimer);
      };
    }
  }, [isVisible, duration]);

  /**
   * shouldRender가 duration 뒤에 false -> dom에서 제거
   * isVisible은 바로 false가 됨.
   */

  if (!shouldRender) return null;

  return (
    <div className={`${!isVisible ? AnimationType.FadeOutUp : ''} w-full`}>
      <h1
        className={`${isVisible ? AnimationType.FadeInUp : ''} mt-10 text-lg sm:text-xl font-[600] text-[#52527a] text-center whitespace-pre-wrap`}
        style={animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 })}
      >
        {headline}
      </h1>
      <SearchField
        fieldType={TextFieldType.Textarea}
        value={searchValue}
        onChange={onChange}
        onSubmit={onSubmit}
        color='#52527a'
        className={`${isVisible ? AnimationType.FadeInUp : ''} mt-15`}
        style={animationStyle({ useAnimation: true, delay: 0.6, duration: 0.6 })}
      />

      {errorMessage && (
        <div
          className={`error-wrap mt-20 flex flex-col gap-6 items-center w-full ${isVisible ? AnimationType.FadeInUp : ''}`}
          style={animationStyle({ useAnimation: true, delay: 0.6, duration: 0.6 })}
        >
          <p className='text-sm sm:text-base whitespace-pre-wrap font-semibold text-center px-4'>{errorMessage}</p>

          <div className='flex gap-3 justify-center w-full'>
            <button
              onClick={() => router.push('/explore')}
              className='text-xs sm:text-sm rounded-full backdrop-blur-xl shadow-lg px-6 py-2 bg-white/40 hover:bg-white/70 duration-200 cursor-pointer'
            >
              다른 곡 둘러보기
            </button>

            <button
              onClick={() => router.push('/library')}
              className='text-xs sm:text-sm rounded-full backdrop-blur-xl shadow-lg px-6 py-2 bg-white/40 hover:bg-white/70 duration-200 cursor-pointer'
            >
              내 보관함 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
