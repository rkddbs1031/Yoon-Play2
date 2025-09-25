import { RecommendationResultType } from '@/types/recommend';

import Button from './Button';
import { Card } from './Card';

interface ListWrapperProps {
  type: RecommendationResultType;
  title: string;
  list: string[];
  onClick: ({ value, type }: { value: string; type: RecommendationResultType }) => void;
}

export const ListWrapper = ({ type, title, list, onClick }: ListWrapperProps) => {
  return (
    <Card>
      <h3 className='font-bold text-[12px]'>{title}</h3>
      {list && (
        <ul className='flex flex-col sm:flex-row gap-5 sm:gap-4'>
          {list.map(label => (
            <li key={label} className='flex-1'>
              <Button label={label} onClick={() => onClick({ value: label, type })} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
