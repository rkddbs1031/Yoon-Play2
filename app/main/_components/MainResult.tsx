import { AnimationType } from '@/constants/animation';
import { RecommendationResultType } from '@/constants/recommend';
import { List as RecommendationList } from '@/types/recommend';
import { animationStyle } from '@/utils/animation';

import { ListWrapper } from '@/components/ListWrapper';

interface MainResultProps {
  isVisible: boolean;
  description: string;
  data: RecommendationList | null;
  onClick: ({ value, type }: { value: string; type: RecommendationResultType }) => void;
  onReset: () => void;
}
export default function MainResult({ isVisible, description, data, onClick, onReset }: MainResultProps) {
  return (
    isVisible && (
      <div
        className={`result-wrapper flex flex-col items-center w-full gap-10 mt-5 ${AnimationType.FadeInUp}`}
        style={animationStyle({ useAnimation: true, delay: 0.8, duration: 0.6 })}
      >
        <p className='text-center text-[16px]'>{description}</p>
        {data && (
          <>
            <div className='recommend-list flex flex-col gap-10 w-full'>
              <ListWrapper
                type={RecommendationResultType.Playlist}
                title='플레이리스트 추천'
                list={data.playlist}
                onClick={onClick}
              />
              <ListWrapper
                type={RecommendationResultType.Genre}
                title='장르 추천'
                list={data.genre}
                onClick={onClick}
              />
            </div>

            <div className='pb-[40px]'>
              <p className='text-sm mb-4'>원하는 음악이 없으신가요?</p>
              <button
                type='button'
                className='block my-0 mx-auto bg-white/50 rounded-[24px] hadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl shadow-lg w-full max-w-[120px] px-2 py-2 text-[12px]'
                onClick={onReset}
              >
                다시 검색하기
              </button>
            </div>
          </>
        )}
      </div>
    )
  );
}
