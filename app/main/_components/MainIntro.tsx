'use client';
import { ChangeEvent, useEffect, useState } from 'react';

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
}

export default function MainIntro({
  isVisible,
  duration = 800,
  searchValue,
  headline,
  onChange,
  onSubmit,
}: MainIntroProps) {
  const [shouldRender, setShouldRender] = useState(false);

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
        className={`${isVisible ? AnimationType.FadeInUp : ''} mt-[60px]`}
        style={animationStyle({ useAnimation: true, delay: 0.6, duration: 0.6 })}
      />
    </div>
  );
}
