'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { AnimationType } from '@/types/animation';
import { animationStyle } from '@/utils/animation';

export default function PlayListResult() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const value = searchParams.get('value');

  const animationStyles = useMemo(() => {
    return animationStyle({ useAnimation: true, delay: 0.3, duration: 0.6 });
  }, []);

  return (
    <section className='playlist-wrapper'>
      <h1 className={`${AnimationType.FadeInUp} text-2xl font-bold whitespace-pre-wrap mb-6`} style={animationStyles}>
        "{value}" 키워드에 맞는 추천 플레이리스트예요!
      </h1>
    </section>
  );
}
