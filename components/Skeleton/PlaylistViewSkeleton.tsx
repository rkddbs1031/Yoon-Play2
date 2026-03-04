import PlaylistView from '@/components/Library/Playlist/PlaylistView';

export function PlaylistViewSkeleton() {
  return (
    <PlaylistView>
      <div className='header-skeleton mb-[50px] flex flex-col items-center'>
        <div className='thumbnail-container w-full max-w-[180px] h-[180px] mx-auto mb-6'>
          <div className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden h-full w-full' />
        </div>
        <h1 className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-5 w-20' />
        <h1 className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-5 w-32' />
      </div>

      <ul className='track-list-skeleton relative w-full flex flex-col gap-y-2'>
        <li className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-10' />
        <li className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-10' />
        <li className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-10' />
        <li className='animate-pulse bg-white/40 rounded-[8px] overflow-hidden mb-2 h-10' />
      </ul>
    </PlaylistView>
  );
}
