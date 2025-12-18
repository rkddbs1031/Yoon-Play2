export const LibrarySkeleton = () => {
  return (
    <li>
      <div className='aspect-square rounded-[8px] overflow-hidden animate-pulse bg-white/60'></div>
      <div className='flex flex-col gap-2 mt-2'>
        <div className='h-5 animate-pulse bg-white/60 rounded-[8px] overflow-hidden'></div>
        <div className='h-4 animate-pulse bg-white/60 rounded-[8px] overflow-hidden'></div>
      </div>
    </li>
  );
};
