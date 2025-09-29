interface SkeletonProps {
  length: number;
}

const PlaylistSkeleton = ({ length }: SkeletonProps) => {
  return [...Array(length)].map((_, idx) => (
    <li
      key={`skeleton-${idx}`}
      className='flex flex-col gap-3 bg-[#ffffff33] px-5 pt-5 pb-6 rounded-[24px] shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl w-full'
    >
      <div className='flex-4 animate-pulse rounded-[8px] block w-full h-[50px] bg-[#ffffff]/40'></div>
      <div className='flex-1 animate-pulse rounded-[8px] w-full h-[32px] bg-[#ffffff]/40'></div>
      <div className='flex-1 animate-pulse rounded-[8px] w-full h-[16px] bg-[#ffffff]/40'></div>
    </li>
  ));
};

export const Skeleton = {
  PlayList: PlaylistSkeleton,
};
