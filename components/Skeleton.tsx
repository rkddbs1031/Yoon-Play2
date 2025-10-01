interface SkeletonProps {
  length: number;
}

const PlaylistSkeleton = ({ length }: SkeletonProps) => {
  return [...Array(length)].map((_, idx) => (
    <li
      key={`skeleton-${idx}`}
      className='flex flex-col gap-3 bg-[#ffffff33] p-3 sm:p-4 rounded-2xl shadow-lg shadow-[0_4px_20px_rgba(0, 0, 0, 0.08)] backdrop-blur-xl w-full'
    >
      <div className='flex-4 animate-pulse rounded-[8px] block w-full  bg-[#ffffff]/40'></div>
      <div className='flex-1 animate-pulse rounded-[8px] w-full bg-[#ffffff]/40'></div>
      <div className='flex-1 animate-pulse rounded-[8px] w-full  bg-[#ffffff]/40'></div>
    </li>
  ));
};

export const Skeleton = {
  PlayList: PlaylistSkeleton,
};
