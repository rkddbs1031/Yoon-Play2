import { Card } from './Card';

interface ListWrapperProps {
  sectionName: string;
  title: string;
  list: string[];
  onClick: (label: string) => void;
}

export const ListWrapper = ({ sectionName, title, list, onClick }: ListWrapperProps) => {
  return (
    <div
      className={`${sectionName}-wrapper flex flex-col gap-4 bg-[#ffffff33] px-5 pt-5 pb-6 rounded-[24px] shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl`}
    >
      <h3 className='font-bold text-[12px]'>{title}</h3>
      {list && (
        <ul className='flex flex-col sm:flex-row gap-5 sm:gap-4'>
          {list.map(label => (
            <li key={label} className='flex-1'>
              <Card.Keyword label={label} onClick={() => onClick(label)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
