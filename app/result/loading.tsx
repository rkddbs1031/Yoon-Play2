import { Skeleton } from '@/components/Skeleton';

export default function ReusltLoading() {
  return (
    <div className='result-laoding'>
      <div className='animate-pulse rounded-[8px] bg-[#ffffff55] mb-6 sm:mb-8 h-8 max-w-[250px]' />

      <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 auto-rows-fr'>
        <Skeleton.PlayList length={4} />
      </ul>
    </div>
  );
}
