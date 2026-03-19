import { Skeleton } from '@/components/Skeleton';

export default function ReusltLoading() {
  return (
    <div className='result-laoding'>
      <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 auto-rows-fr'>
        <Skeleton.PlayList length={4} />
      </ul>
    </div>
  );
}
