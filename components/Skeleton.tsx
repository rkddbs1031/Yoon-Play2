interface SkeletonProps {
  length: number;
}

const PlaylistSkeleton = ({ length }: SkeletonProps) => {
  return [...Array(length)].map((_, idx) => (
    <li
      key={`skeleton-${idx}`}
      className='flex flex-col gap-3 bg-[#ffffff33] p-3 sm:p-4 rounded-2xl shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl w-full'
    >
      <div className='aspect-[16/9] animate-pulse rounded-[8px] block w-full  bg-[#ffffff]/40' />
      <div className='aspect-[16/3] animate-pulse rounded-[8px] w-full bg-[#ffffff]/40' />
      <div className='aspect-[16/2] animate-pulse rounded-[8px] w-full  bg-[#ffffff]/40' />
    </li>
  ));
};

export const Skeleton = {
  PlayList: PlaylistSkeleton,
};
