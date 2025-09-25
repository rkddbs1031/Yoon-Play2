import { RecommendationResultType } from '@/types/recommend';

import { Card } from './Card';

interface ListWrapperProps {
  type: RecommendationResultType;
  title: string;
  list: string[];
  onClick: ({ value, type }: { value: string; type: RecommendationResultType }) => void;
}

export const ListWrapper = ({ type, title, list, onClick }: ListWrapperProps) => {
  return (
    <div
      className={`${type}-wrapper flex flex-col gap-4 bg-[#ffffff33] px-5 pt-5 pb-6 rounded-[24px] shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl`}
    >
      <h3 className='font-bold text-[12px]'>{title}</h3>
      {list && (
        <ul className='flex flex-col sm:flex-row gap-5 sm:gap-4'>
          {list.map(label => (
            <li key={label} className='flex-1'>
              <Card.Keyword label={label} onClick={() => onClick({ value: label, type })} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
